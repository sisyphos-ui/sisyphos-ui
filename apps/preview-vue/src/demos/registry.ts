/**
 * Vue demo registry. Each entry maps a docs-site demo slug to a Vue
 * component that renders the same example as the React `getDemos()`
 * registry — so the docs site can show identical visual output across
 * frameworks via the iframe-based live preview.
 *
 * Coverage: every component in the v1 catalogue ships a `<slug>-default`
 * primary demo here. Add additional variants alongside.
 */
import type { Component } from "vue";

import AccordionDefault from "./accordion-default.vue";
import AlertDefault from "./alert-default.vue";
import AvatarDefault from "./avatar-default.vue";
import BreadcrumbDefault from "./breadcrumb-default.vue";
import ButtonDefault from "./button-default.vue";
import ButtonVariants from "./button-variants.vue";
import CardDefault from "./card-default.vue";
import CarouselDefault from "./carousel-default.vue";
import CheckboxDefault from "./checkbox-default.vue";
import ChipDefault from "./chip-default.vue";
import CommandDefault from "./command-default.vue";
import ContextMenuDefault from "./context-menu-default.vue";
import DatepickerDefault from "./datepicker-default.vue";
import DialogDefault from "./dialog-default.vue";
import DropdownMenuDefault from "./dropdown-menu-default.vue";
import EmptyStateDefault from "./empty-state-default.vue";
import FileUploadDefault from "./file-upload-default.vue";
import FormControlDefault from "./form-control-default.vue";
import InputDefault from "./input-default.vue";
import KbdDefault from "./kbd-default.vue";
import NumberInputDefault from "./number-input-default.vue";
import PopoverDefault from "./popover-default.vue";
import RadioDefault from "./radio-default.vue";
import SelectDefault from "./select-default.vue";
import SkeletonDefault from "./skeleton-default.vue";
import SliderDefault from "./slider-default.vue";
import SpinnerDefault from "./spinner-default.vue";
import SwitchDefault from "./switch-default.vue";
import TableDefault from "./table-default.vue";
import TabsDefault from "./tabs-default.vue";
import TextareaDefault from "./textarea-default.vue";
import ToastDefault from "./toast-default.vue";
import TooltipDefault from "./tooltip-default.vue";
import TreeSelectDefault from "./tree-select-default.vue";

export const DEMOS: Record<string, Component> = {
  "accordion-default": AccordionDefault,
  "alert-default": AlertDefault,
  "avatar-default": AvatarDefault,
  "breadcrumb-default": BreadcrumbDefault,
  "button-default": ButtonDefault,
  "button-variants": ButtonVariants,
  "card-default": CardDefault,
  "carousel-default": CarouselDefault,
  "checkbox-default": CheckboxDefault,
  "chip-default": ChipDefault,
  "command-default": CommandDefault,
  "context-menu-default": ContextMenuDefault,
  "datepicker-default": DatepickerDefault,
  "dialog-default": DialogDefault,
  "dropdown-menu-default": DropdownMenuDefault,
  "empty-state-default": EmptyStateDefault,
  "file-upload-default": FileUploadDefault,
  "form-control-default": FormControlDefault,
  "input-default": InputDefault,
  "kbd-default": KbdDefault,
  "number-input-default": NumberInputDefault,
  "popover-default": PopoverDefault,
  "radio-default": RadioDefault,
  "select-default": SelectDefault,
  "skeleton-default": SkeletonDefault,
  "slider-default": SliderDefault,
  "spinner-default": SpinnerDefault,
  "switch-default": SwitchDefault,
  "table-default": TableDefault,
  "tabs-default": TabsDefault,
  "textarea-default": TextareaDefault,
  "toast-default": ToastDefault,
  "tooltip-default": TooltipDefault,
  "tree-select-default": TreeSelectDefault,
};
