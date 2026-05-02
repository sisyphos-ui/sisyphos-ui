import type { ReactNode, SyntheticEvent } from "react";

export interface ContextMenuAction {
  type?: "action";
  key?: string;
  label: ReactNode;
  icon?: ReactNode;
  /** Extra hint on the right (shortcut text, `<Kbd>`, etc.). */
  shortcut?: ReactNode;
  disabled?: boolean;
  /** Visual emphasis for destructive actions. */
  destructive?: boolean;
  onSelect: (event: SyntheticEvent) => void;
  /** Prevent menu from closing after selection. */
  closeOnSelect?: boolean;
}

export interface ContextMenuSeparator {
  type: "separator";
  key?: string;
}

export interface ContextMenuLabel {
  type: "label";
  key?: string;
  label: ReactNode;
}

export type ContextMenuItem = ContextMenuAction | ContextMenuSeparator | ContextMenuLabel;
