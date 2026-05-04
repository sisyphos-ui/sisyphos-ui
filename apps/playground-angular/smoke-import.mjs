/**
 * Angular consumer-perspective smoke test.
 *
 * Imports the published @sisyphos-ui/angular ESM artifact (the same
 * fesm2022 bundle a real Angular consumer app would consume) and checks
 * that every public component class is reachable.
 *
 * This complements the 364 jsdom unit tests by exercising the *actual
 * dist/* artifact emitted by ng-packagr (rather than src/*.ts), and by
 * verifying the package shape from a process that has never seen the
 * source code — exactly what `npm install @sisyphos-ui/angular` gives a
 * downstream Angular CLI app.
 */
import * as ng from "@sisyphos-ui/angular";

const expected = [
  "Accordion", "AccordionItem", "AccordionTrigger", "AccordionContent",
  "Alert", "Avatar", "AvatarGroup", "Breadcrumb", "Button", "Card",
  "CardHeader", "CardBody", "CardFooter", "Carousel", "Checkbox", "Chip",
  "Command", "CommandInput", "CommandList", "CommandEmpty", "CommandGroup",
  "CommandItem", "CommandSeparator", "ContextMenu", "DatePicker", "Dialog",
  "DialogHeader", "DialogTitle", "DialogDescription", "DialogBody",
  "DialogFooter", "DialogClose", "DropdownMenu", "EmptyState", "FileUpload",
  "FormControl", "FormLabel", "FormHelperText", "FormErrorText", "Input",
  "Kbd", "NumberInput", "Pagination", "Popover", "Radio", "RadioGroup",
  "Select", "Skeleton", "SkeletonText", "Slider", "Spinner", "Switch",
  "Table", "Tabs", "TabsList", "TabsTrigger", "TabsPanel", "Textarea",
  "Toaster", "TooltipDirective", "TreeSelect",
];

let pass = 0;
let fail = 0;
const missing = [];
for (const name of expected) {
  if (ng[name] !== undefined && ng[name] !== null) {
    pass++;
  } else {
    fail++;
    missing.push(name);
  }
}

const tokenExports = [
  ["toast", "function"],
  ["toastStore", "object"],
  ["isDropdownMenuAction", "function"],
];
const tokenIssues = [];
for (const [name, kind] of tokenExports) {
  const v = ng[name];
  if (kind === "function" && typeof v !== "function") {
    tokenIssues.push(`${name} expected function, got ${typeof v}`);
  } else if (kind === "object" && (v === null || typeof v !== "object")) {
    tokenIssues.push(`${name} expected object, got ${typeof v}`);
  }
}

console.log(`[ng-import-smoke] component classes: ${pass}/${expected.length}`);
if (missing.length) {
  console.log(`[ng-import-smoke] missing:`, missing.join(", "));
}
if (tokenIssues.length) {
  console.log(`[ng-import-smoke] token issues:`, tokenIssues.join(" | "));
}

if (fail > 0 || tokenIssues.length > 0) {
  console.error("[ng-import-smoke] FAIL");
  process.exit(1);
}
console.log("[ng-import-smoke] OK — Angular dist consumable from a fresh ESM context");
