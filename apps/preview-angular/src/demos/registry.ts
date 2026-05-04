/**
 * Angular demo registry. Maps the docs-site demo slug to a standalone
 * Angular component, so the iframe can render the same example as the
 * React + Vue previews via `?demo=<slug>`.
 */
import type { Type } from "@angular/core";
import { ButtonDefaultDemo } from "./button-default.component";
import { ButtonVariantsDemo } from "./button-variants.component";
import { CheckboxDefaultDemo } from "./checkbox-default.component";
import { SwitchDefaultDemo } from "./switch-default.component";
import { ChipDefaultDemo } from "./chip-default.component";
import { AvatarDefaultDemo } from "./avatar-default.component";
import { SpinnerDefaultDemo } from "./spinner-default.component";
import { AlertDefaultDemo } from "./alert-default.component";
import { CardDefaultDemo } from "./card-default.component";
import { DialogDefaultDemo } from "./dialog-default.component";
import { TabsDefaultDemo } from "./tabs-default.component";
import { InputDefaultDemo } from "./input-default.component";

export const DEMOS: Record<string, Type<unknown>> = {
  "button-default": ButtonDefaultDemo,
  "button-variants": ButtonVariantsDemo,
  "checkbox-default": CheckboxDefaultDemo,
  "switch-default": SwitchDefaultDemo,
  "chip-default": ChipDefaultDemo,
  "avatar-default": AvatarDefaultDemo,
  "spinner-default": SpinnerDefaultDemo,
  "alert-default": AlertDefaultDemo,
  "card-default": CardDefaultDemo,
  "dialog-default": DialogDefaultDemo,
  "tabs-default": TabsDefaultDemo,
  "input-default": InputDefaultDemo,
};
