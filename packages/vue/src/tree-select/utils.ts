import type { TreeNode, TreeNodeId } from "./types";

/** All descendant ids including the node itself. */
export function descendantIds(node: TreeNode): TreeNodeId[] {
  const ids: TreeNodeId[] = [node.id];
  if (node.children) for (const c of node.children) ids.push(...descendantIds(c));
  return ids;
}

/** Recursively filter the tree to nodes (or their descendants) matching `term`. */
export function filterTree(nodes: TreeNode[], term: string): TreeNode[] {
  if (!term) return nodes;
  const t = term.toLowerCase();
  const walk = (list: TreeNode[]): TreeNode[] =>
    list.reduce<TreeNode[]>((acc, n) => {
      const childMatches = n.children ? walk(n.children) : [];
      const selfMatches = n.label.toLowerCase().includes(t);
      if (selfMatches || childMatches.length > 0) {
        acc.push({
          ...n,
          children: childMatches.length > 0 ? childMatches : n.children,
        });
      }
      return acc;
    }, []);
  return walk(nodes);
}

/** Walk tree and collect all leaf nodes (no children). */
export function leaves(nodes: TreeNode[]): TreeNode[] {
  const out: TreeNode[] = [];
  const walk = (list: TreeNode[]) => {
    for (const n of list) {
      if (n.children && n.children.length) walk(n.children);
      else out.push(n);
    }
  };
  walk(nodes);
  return out;
}

/** Find a node by id (DFS). */
export function findNode(nodes: TreeNode[], id: TreeNodeId): TreeNode | null {
  for (const n of nodes) {
    if (n.id === id) return n;
    if (n.children) {
      const f = findNode(n.children, id);
      if (f) return f;
    }
  }
  return null;
}

/**
 * Returns "checked" | "partial" | "unchecked" for a node given the selection set.
 * Cascade semantics: a parent is "checked" iff all (non-disabled) descendants are checked.
 */
export function nodeState(
  node: TreeNode,
  selected: Set<TreeNodeId>
): "checked" | "partial" | "unchecked" {
  if (!node.children || node.children.length === 0) {
    return selected.has(node.id) ? "checked" : "unchecked";
  }
  let any = false;
  let all = true;
  for (const c of node.children) {
    const s = nodeState(c, selected);
    if (s === "checked") any = true;
    else if (s === "partial") {
      any = true;
      all = false;
    } else {
      all = false;
    }
  }
  if (all) return "checked";
  if (any) return "partial";
  return "unchecked";
}
