import type { ReactNode } from "react";

export interface DropdownMenuAction {
  type?: "action";
  key?: string;
  label: ReactNode;
  icon?: ReactNode;
  /** Extra hint shown on the right (shortcut, helper text). */
  shortcut?: ReactNode;
  disabled?: boolean;
  /** Visual emphasis for destructive actions (delete, etc.). */
  destructive?: boolean;
  /** Fired on click / Enter / Space. Receives the DOM event. */
  onSelect: (event: React.SyntheticEvent) => void;
  /** Prevent menu from closing after selection. */
  closeOnSelect?: boolean;
}

export interface DropdownMenuSeparator {
  type: "separator";
  key?: string;
}

export interface DropdownMenuLabel {
  type: "label";
  key?: string;
  label: ReactNode;
}

export type DropdownMenuItem = DropdownMenuAction | DropdownMenuSeparator | DropdownMenuLabel;
