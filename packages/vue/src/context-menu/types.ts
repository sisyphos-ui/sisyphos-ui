export interface ContextMenuAction {
  type?: "action";
  key?: string;
  label: string;
  icon?: unknown;
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
