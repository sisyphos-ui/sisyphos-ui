/**
 * ContextMenu items mirror DropdownMenu items exactly so the two feel
 * interchangeable on the consumer side.
 */
export interface ContextMenuAction {
  type?: "action";
  key?: string;
  label: string;
  icon?: string;
  shortcut?: string;
  disabled?: boolean;
  destructive?: boolean;
  onSelect: (event: Event) => void;
  closeOnSelect?: boolean;
}

export interface ContextMenuSeparator {
  type: "separator";
  key?: string;
}

export interface ContextMenuLabel {
  type: "label";
  key?: string;
  label: string;
}

export type ContextMenuItem = ContextMenuAction | ContextMenuSeparator | ContextMenuLabel;

export function isContextMenuAction(item: ContextMenuItem): item is ContextMenuAction {
  return item.type === undefined || item.type === "action";
}
