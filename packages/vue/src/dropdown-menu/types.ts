export interface DropdownMenuAction {
  type?: "action";
  key?: string;
  label: string;
  icon?: unknown;
  shortcut?: string;
  disabled?: boolean;
  /** Visual emphasis for destructive actions (delete, etc.). */
  destructive?: boolean;
  /** Fired on click / Enter / Space. */
  onSelect: (event: Event) => void;
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
  label: string;
}

export type DropdownMenuItem = DropdownMenuAction | DropdownMenuSeparator | DropdownMenuLabel;
