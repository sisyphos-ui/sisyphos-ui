/**
 * Angular demo registry. Maps the docs-site demo slug to a standalone
 * Angular component, so the iframe can render the same example as the
 * React + Vue previews via `?demo=<slug>`.
 *
 * Coverage: every component in the v1 catalogue ships a `<slug>-default`
 * primary demo here.
 */
import type { Type } from "@angular/core";

import { AccordionDefaultDemo } from "./accordion-default.component";
import { AlertDefaultDemo } from "./alert-default.component";
import { AvatarDefaultDemo } from "./avatar-default.component";
import { BreadcrumbDefaultDemo } from "./breadcrumb-default.component";
import { ButtonDefaultDemo } from "./button-default.component";
import { ButtonVariantsDemo } from "./button-variants.component";
import { CardDefaultDemo } from "./card-default.component";
import { CarouselDefaultDemo } from "./carousel-default.component";
import { CheckboxDefaultDemo } from "./checkbox-default.component";
import { ChipDefaultDemo } from "./chip-default.component";
import { CommandDefaultDemo } from "./command-default.component";
import { ContextMenuDefaultDemo } from "./context-menu-default.component";
import { DatepickerDefaultDemo } from "./datepicker-default.component";
import { DialogDefaultDemo } from "./dialog-default.component";
import { DropdownMenuDefaultDemo } from "./dropdown-menu-default.component";
import { EmptyStateDefaultDemo } from "./empty-state-default.component";
import { FileUploadDefaultDemo } from "./file-upload-default.component";
import { FormControlDefaultDemo } from "./form-control-default.component";
import { InputDefaultDemo } from "./input-default.component";
import { KbdDefaultDemo } from "./kbd-default.component";
import { NumberInputDefaultDemo } from "./number-input-default.component";
import { PopoverDefaultDemo } from "./popover-default.component";
import { RadioDefaultDemo } from "./radio-default.component";
import { SelectDefaultDemo } from "./select-default.component";
import { SkeletonDefaultDemo } from "./skeleton-default.component";
import { SliderDefaultDemo } from "./slider-default.component";
import { SpinnerDefaultDemo } from "./spinner-default.component";
import { SwitchDefaultDemo } from "./switch-default.component";
import { TableDefaultDemo } from "./table-default.component";
import { TabsDefaultDemo } from "./tabs-default.component";
import { TextareaDefaultDemo } from "./textarea-default.component";
import { ToastDefaultDemo } from "./toast-default.component";
import { TooltipDefaultDemo } from "./tooltip-default.component";
import { TreeSelectDefaultDemo } from "./tree-select-default.component";

export const DEMOS: Record<string, Type<unknown>> = {
  "accordion-default": AccordionDefaultDemo,
  "alert-default": AlertDefaultDemo,
  "avatar-default": AvatarDefaultDemo,
  "breadcrumb-default": BreadcrumbDefaultDemo,
  "button-default": ButtonDefaultDemo,
  "button-variants": ButtonVariantsDemo,
  "card-default": CardDefaultDemo,
  "carousel-default": CarouselDefaultDemo,
  "checkbox-default": CheckboxDefaultDemo,
  "chip-default": ChipDefaultDemo,
  "command-default": CommandDefaultDemo,
  "context-menu-default": ContextMenuDefaultDemo,
  "datepicker-default": DatepickerDefaultDemo,
  "dialog-default": DialogDefaultDemo,
  "dropdown-menu-default": DropdownMenuDefaultDemo,
  "empty-state-default": EmptyStateDefaultDemo,
  "file-upload-default": FileUploadDefaultDemo,
  "form-control-default": FormControlDefaultDemo,
  "input-default": InputDefaultDemo,
  "kbd-default": KbdDefaultDemo,
  "number-input-default": NumberInputDefaultDemo,
  "popover-default": PopoverDefaultDemo,
  "radio-default": RadioDefaultDemo,
  "select-default": SelectDefaultDemo,
  "skeleton-default": SkeletonDefaultDemo,
  "slider-default": SliderDefaultDemo,
  "spinner-default": SpinnerDefaultDemo,
  "switch-default": SwitchDefaultDemo,
  "table-default": TableDefaultDemo,
  "tabs-default": TabsDefaultDemo,
  "textarea-default": TextareaDefaultDemo,
  "toast-default": ToastDefaultDemo,
  "tooltip-default": TooltipDefaultDemo,
  "tree-select-default": TreeSelectDefaultDemo,
};
