import { describe, it, expect } from "vitest";
import * as ui from "./index";

describe("@sisyphos-ui/ui umbrella re-exports", () => {
  it("re-exports the main named components", () => {
    // Sanity check a broad sample of the export surface.
    const required = [
      "Button",
      "Input",
      "Textarea",
      "Switch",
      "Checkbox",
      "Radio",
      "RadioGroup",
      "Select",
      "TreeSelect",
      "NumberInput",
      "Slider",
      "DatePicker",
      "FileUpload",
      "FormControl",
      "FormLabel",
      "FormHelperText",
      "FormErrorText",
      "Portal",
      "Chip",
      "Avatar",
      "AvatarGroup",
      "Spinner",
      "Skeleton",
      "SkeletonText",
      "EmptyState",
      "Breadcrumb",
      "Alert",
      "Tooltip",
      "Popover",
      "DropdownMenu",
      "Dialog",
      "Toaster",
      "toast",
      "Tabs",
      "Card",
      "Accordion",
      "Table",
      "Carousel",
    ] as const;

    for (const name of required) {
      expect(
        (ui as Record<string, unknown>)[name],
        `@sisyphos-ui/ui missing export: ${name}`
      ).toBeDefined();
    }
  });

  it("compound components expose their sub-parts", () => {
    expect(ui.Dialog.Header).toBeDefined();
    expect(ui.Dialog.Title).toBeDefined();
    expect(ui.Dialog.Description).toBeDefined();
    expect(ui.Dialog.Body).toBeDefined();
    expect(ui.Dialog.Footer).toBeDefined();
    expect(ui.Dialog.Close).toBeDefined();

    expect(ui.Card.Header).toBeDefined();
    expect(ui.Card.Body).toBeDefined();
    expect(ui.Card.Footer).toBeDefined();

    expect(ui.Tabs.List).toBeDefined();
    expect(ui.Tabs.Trigger).toBeDefined();
    expect(ui.Tabs.Panel).toBeDefined();

    expect(ui.Accordion.Item).toBeDefined();
    expect(ui.Accordion.Trigger).toBeDefined();
    expect(ui.Accordion.Content).toBeDefined();
  });

  it("toast function has the four semantic helpers", () => {
    expect(typeof ui.toast).toBe("function");
    expect(typeof ui.toast.success).toBe("function");
    expect(typeof ui.toast.error).toBe("function");
    expect(typeof ui.toast.warning).toBe("function");
    expect(typeof ui.toast.info).toBe("function");
    expect(typeof ui.toast.dismiss).toBe("function");
  });
});
