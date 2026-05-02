import type { Scale } from "@sisyphos-ui/core/internal";

export const CN = {
  button: "sisyphos-button",
  text: "sisyphos-button-text",
  icon: "sisyphos-button-icon",
  iconStart: "sisyphos-button-icon sisyphos-button-icon--start",
  iconEnd: "sisyphos-button-icon sisyphos-button-icon--end",
  iconDropdown: "sisyphos-button-icon sisyphos-button-icon--dropdown",
  loadingSpinner: "sisyphos-button-loading-spinner",
  loadingSpinnerSvg: "sisyphos-button-loading-spinner-svg",
  wrapper: "sisyphos-button-wrapper",
  dropdown: "sisyphos-button-dropdown",
  dropdownItem: "sisyphos-button-dropdown-item",
  size: (v: Scale) => v,
  radius: (v: Scale) => `radius-${v}`,
} as const;

export const DEFAULTS = {
  variant: "contained",
  color: "primary",
  size: "md" as Scale,
  type: "button",
  loadingPosition: "start",
  dropdownPosition: "bottom",
  radius: "md" as Scale,
} as const;
