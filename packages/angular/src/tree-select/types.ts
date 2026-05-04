export type TreeNodeId = string | number;

export interface TreeNode {
  id: TreeNodeId;
  label: string;
  children?: TreeNode[];
  /** Disable selection of this node (children may still be selectable). */
  disabled?: boolean;
  /** Optional metadata your renderer can read; ignored by the component. */
  [key: string]: unknown;
}
