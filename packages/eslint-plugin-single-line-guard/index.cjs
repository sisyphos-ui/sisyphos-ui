const preferSingleLineGuard = {
  meta: {
    type: "layout",
    docs: {
      description: "Enforce single-line guard clauses for single-statement if blocks.",
    },
    fixable: "code",
    messages: {
      preferSingleLine: "Convert guard clause into a single-line statement.",
    },
    schema: [],
  },
  create(context) {
    const sourceCode = context.getSourceCode();
    return {
      IfStatement(node) {
        if (node.alternate) return;

        const { consequent } = node;
        if (consequent.type !== "BlockStatement") return;
        if (sourceCode.getCommentsInside(consequent).length > 0) return;
        if (consequent.body.length !== 1) return;

        const [statement] = consequent.body;
        if (
          statement.type !== "ThrowStatement" &&
          statement.type !== "ExpressionStatement" &&
          statement.type !== "ReturnStatement"
        ) {
          return;
        }

        if (statement.loc.start.line !== statement.loc.end.line) return;

        context.report({
          node,
          messageId: "preferSingleLine",
          fix(fixer) {
            const conditionText = sourceCode.getText(node.test).trim();
            const statementText = sourceCode.getText(statement).trim();
            const statementWithSemicolon = statementText.endsWith(";")
              ? statementText
              : `${statementText};`;
            return fixer.replaceText(node, `if (${conditionText}) ${statementWithSemicolon}`);
          },
        });
      },
    };
  },
};

const preferRemoveUnused = {
  meta: {
    type: "suggestion",
    docs: {
      description:
        "Auto-fix unused imports, variables, and parameters by removing them or prefixing with '_'.",
    },
    fixable: "code",
    messages: {
      removeUnused: "'{{name}}' is declared but its value is never read.",
    },
    schema: [],
  },
  create(context) {
    const sourceCode = context.getSourceCode();

    const reportImport = (node, name) => {
      const importDecl = node.parent;
      const specifiers = importDecl.specifiers;

      context.report({
        node,
        messageId: "removeUnused",
        data: { name },
        fix(fixer) {
          if (specifiers.length === 1) {
            const leadingToken = sourceCode.getTokenBefore(importDecl);
            const trailingToken = sourceCode.getTokenAfter(importDecl);
            const start = leadingToken ? leadingToken.range[1] : importDecl.range[0];
            let end = importDecl.range[1];
            if (
              trailingToken &&
              trailingToken.type === "Punctuator" &&
              trailingToken.value === ";"
            ) {
              end = trailingToken.range[1];
            }
            return fixer.removeRange([start, end]);
          }

          const tokenAfter = sourceCode.getTokenAfter(node);
          const tokenBefore = sourceCode.getTokenBefore(node);
          if (tokenAfter && tokenAfter.value === ",") {
            return fixer.removeRange([node.range[0], tokenAfter.range[1]]);
          }
          if (tokenBefore && tokenBefore.value === ",") {
            return fixer.removeRange([tokenBefore.range[0], node.range[1]]);
          }
          return fixer.remove(node);
        },
      });
    };

    const reportVariable = (node, name) => {
      const declaration = node.parent;
      const declarators = declaration.declarations;

      context.report({
        node,
        messageId: "removeUnused",
        data: { name },
        fix(fixer) {
          if (declarators.length === 1) {
            const statement = declaration.parent;
            const start = statement.range[0];
            let end = statement.range[1];
            const tokenAfter = sourceCode.getTokenAfter(statement);
            if (tokenAfter && tokenAfter.type === "Punctuator" && tokenAfter.value === ";") {
              end = tokenAfter.range[1];
            }
            return fixer.removeRange([start, end]);
          }

          const tokenAfter = sourceCode.getTokenAfter(node);
          const tokenBefore = sourceCode.getTokenBefore(node);
          if (tokenAfter && tokenAfter.value === ",") {
            return fixer.removeRange([node.range[0], tokenAfter.range[1]]);
          }
          if (tokenBefore && tokenBefore.value === ",") {
            return fixer.removeRange([tokenBefore.range[0], node.range[1]]);
          }
          return fixer.remove(node);
        },
      });
    };

    const reportParameter = (identifier, name) => {
      context.report({
        node: identifier,
        messageId: "removeUnused",
        data: { name },
        fix(fixer) {
          if (name.startsWith("_")) return null;
          return fixer.replaceText(identifier, `_${sourceCode.getText(identifier)}`);
        },
      });
    };

    const shouldIgnore = (name) => /^_/.test(name);

    function checkNode(node) {
      if (typeof context.getDeclaredVariables !== "function") return;

      const variables = context.getDeclaredVariables(node) || [];
      for (const variable of variables) {
        const name = variable.name;
        if (shouldIgnore(name) || variable.references.length > 0) continue;

        const def = variable.defs[0];
        if (!def) continue;

        if (
          def.node.type === "ImportSpecifier" ||
          def.node.type === "ImportDefaultSpecifier" ||
          def.node.type === "ImportNamespaceSpecifier"
        ) {
          reportImport(def.node, name);
          continue;
        }

        if (
          def.node.type === "Identifier" &&
          def.parent &&
          def.parent.type === "VariableDeclarator"
        ) {
          reportVariable(def.parent, name);
          continue;
        }

        if (def.type === "Parameter" && def.node.type === "Identifier") {
          reportParameter(def.node, name);
        }
      }
    }

    return {
      ImportDeclaration: checkNode,
      VariableDeclaration: checkNode,
      FunctionDeclaration: checkNode,
      FunctionExpression: checkNode,
      ArrowFunctionExpression: checkNode,
      TSFunctionType: checkNode,
      TSMethodSignature: checkNode,
    };
  },
};

module.exports = {
  rules: {
    "prefer-single-line-guard": preferSingleLineGuard,
    "prefer-remove-unused": preferRemoveUnused,
  },
};
