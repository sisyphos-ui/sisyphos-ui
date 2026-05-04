/**
 * Vue demo registry. Each entry maps a docs-site demo slug to a Vue
 * component that renders the same example as the React `getDemos()`
 * registry — so the docs site can show identical visual output across
 * frameworks via the iframe-based live preview.
 *
 * To add a new demo:
 *   1. Drop a .vue file in this folder.
 *   2. Register it below using the same slug the React registry uses
 *      (see sisyphosui-landing/src/components/demos/registry.tsx).
 *   3. Re-build the preview app — the docs iframe picks it up via
 *      `?demo=<slug>` automatically.
 */
import type { Component } from "vue";

import ButtonDefault from "./button-default.vue";
import ButtonVariants from "./button-variants.vue";
import CheckboxDefault from "./checkbox-default.vue";
import SwitchDefault from "./switch-default.vue";
import ChipDefault from "./chip-default.vue";
import AvatarDefault from "./avatar-default.vue";
import SpinnerDefault from "./spinner-default.vue";
import AlertDefault from "./alert-default.vue";
import CardDefault from "./card-default.vue";
import DialogDefault from "./dialog-default.vue";
import TabsDefault from "./tabs-default.vue";
import InputDefault from "./input-default.vue";

export const DEMOS: Record<string, Component> = {
  "button-default": ButtonDefault,
  "button-variants": ButtonVariants,
  "checkbox-default": CheckboxDefault,
  "switch-default": SwitchDefault,
  "chip-default": ChipDefault,
  "avatar-default": AvatarDefault,
  "spinner-default": SpinnerDefault,
  "alert-default": AlertDefault,
  "card-default": CardDefault,
  "dialog-default": DialogDefault,
  "tabs-default": TabsDefault,
  "input-default": InputDefault,
};
