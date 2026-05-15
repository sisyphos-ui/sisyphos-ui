/**
 * Item shapes for the DropdownMenu / ContextMenu data API. Mirrors the React
 * binding so a typed `items` array is portable across all three frameworks.
 */
export interface DropdownMenuAction {
  type?: "action";
  key?: string;
  label: string;
  /** Stringy glyph (emoji or short text). For rich icons use a TemplateRef-based slot. */
  icon?: string;
  shortcut?: string;
  disabled?: boolean;
  /** Visual emphasis for destructive actions. */
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

export function isDropdownMenuAction(item: DropdownMenuItem): item is DropdownMenuAction {
  return item.type === undefined || item.type === "action";
}
