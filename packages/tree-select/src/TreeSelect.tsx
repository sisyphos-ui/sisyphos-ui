/**
 * TreeSelect — hierarchical multi-select with search, optional cascade
 * selection, and partial (mixed) state for parent nodes.
 *
 * The dropdown is portal-mounted with auto-flip placement. Works controlled
 * (`value`) or uncontrolled (`defaultValue`).
 */
import type React from "react";
import { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
import { Portal } from "@sisyphos-ui/portal";
import { cx, computePosition, useEscapeKey, type Placement } from "@sisyphos-ui/core/internal";
import type { TreeNode, TreeNodeId } from "./types";
import { descendantIds, filterTree, nodeState, findNode } from "./utils";
import "./TreeSelect.scss";

export interface TreeSelectProps {
  /** Tree data rendered in the dropdown. */
  nodes: TreeNode[];
  /** Selected node ids (controlled). */
  value?: TreeNodeId[];
  /** Initial selection (uncontrolled). */
  defaultValue?: TreeNodeId[];
  /** Called with the next selection when it changes. */
  onChange?: (ids: TreeNodeId[]) => void;
  /** Field label rendered above the trigger. */
  label?: string;
  /** Placeholder when nothing is selected. */
  placeholder?: string;
  /** Overrides the trigger text while closed. */
  triggerLabel?: string;
  /** Marks the field as invalid for styling and ARIA. */
  error?: boolean;
  /** Message rendered below the field when `error` is true. */
  errorMessage?: string;
  disabled?: boolean;
  required?: boolean;
  /** Show a search input above the tree. */
  searchable?: boolean;
  searchPlaceholder?: string;
  /** Show a clear button when there is a selection. */
  clearable?: boolean;
  fullWidth?: boolean;
  size?: "sm" | "md" | "lg";
  /** Cascade child selection when toggling a parent. Default `true`. */
  cascade?: boolean;
  /** Tags to show in the trigger before collapsing into `+N`. Default 3. */
  maxTagCount?: number;
  placement?: Placement;
  className?: string;
}

const ChevronIcon = ({ rotated }: { rotated?: boolean }) => (
  <svg
    viewBox="0 0 24 24"
    width="18"
    height="18"
    aria-hidden="true"
    style={{ transform: rotated ? "rotate(180deg)" : undefined, transition: "transform 150ms" }}
  >
    <path d="M7 10l5 5 5-5z" fill="currentColor" />
  </svg>
);
const ChevronRight = () => (
  <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true">
    <path
      d="M9 6l6 6-6 6"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
const ChevronDown = () => (
  <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true">
    <path
      d="M6 9l6 6 6-6"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
const ClearIcon = () => (
  <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true">
    <path
      d="M19 6.41 17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"
      fill="currentColor"
    />
  </svg>
);

export const TreeSelect: React.FC<TreeSelectProps> = ({
  nodes,
  value: valueProp,
  defaultValue,
  onChange,
  label,
  placeholder = "Select…",
  triggerLabel,
  error = false,
  errorMessage,
  disabled = false,
  required = false,
  searchable = true,
  searchPlaceholder = "Search…",
  clearable = false,
  fullWidth = false,
  size = "md",
  cascade = true,
  maxTagCount = 3,
  placement = "bottom-start",
  className,
}) => {
  const reactId = useId();
  const listboxId = `sisyphos-tree-${reactId}`;

  const isControlled = valueProp !== undefined;
  const [internal, setInternal] = useState<TreeNodeId[]>(defaultValue ?? []);
  const selectedIds = isControlled ? (valueProp ?? []) : internal;
  const selectedSet = useMemo(() => new Set<TreeNodeId>(selectedIds), [selectedIds]);

  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [pos, setPos] = useState<{
    left: number;
    top: number;
    placement: Placement;
    width: number;
  } | null>(null);

  const triggerRef = useRef<HTMLDivElement | null>(null);
  const listRef = useRef<HTMLDivElement | null>(null);
  const searchRef = useRef<HTMLInputElement | null>(null);

  useEscapeKey(() => setOpen(false), open);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      const tgt = e.target as Node | null;
      if (!tgt) return;
      if (triggerRef.current?.contains(tgt)) return;
      if (listRef.current?.contains(tgt)) return;
      setOpen(false);
      setSearch("");
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  useEffect(() => {
    if (!open) {
      setPos(null);
      return;
    }
    if (searchable && searchRef.current) searchRef.current.focus();
    let raf = 0;
    const update = () => {
      const anchor = triggerRef.current;
      const list = listRef.current;
      if (!anchor || !list) return;
      const a = anchor.getBoundingClientRect();
      const sz = { width: list.offsetWidth, height: list.offsetHeight };
      const p = computePosition(a, sz, placement, 4);
      setPos({ ...p, width: a.width });
    };
    raf = requestAnimationFrame(() => requestAnimationFrame(update));
    const onWin = () => update();
    window.addEventListener("scroll", onWin, true);
    window.addEventListener("resize", onWin);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onWin, true);
      window.removeEventListener("resize", onWin);
    };
  }, [open, placement, searchable]);

  const filtered = useMemo(() => filterTree(nodes, search), [nodes, search]);

  const emit = useCallback(
    (next: TreeNodeId[]) => {
      if (!isControlled) setInternal(next);
      onChange?.(next);
    },
    [isControlled, onChange]
  );

  const toggleNode = (node: TreeNode) => {
    if (node.disabled) return;
    const ids = cascade ? descendantIds(node) : [node.id];
    const isSelected = nodeState(node, selectedSet) === "checked";
    if (isSelected) {
      const removeSet = new Set(ids);
      emit(selectedIds.filter((id) => !removeSet.has(id)));
    } else {
      const merged = new Set([...selectedIds, ...ids]);
      emit(Array.from(merged));
    }
  };

  const toggleExpand = (id: TreeNodeId, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpanded((prev) => ({ ...prev, [String(id)]: !prev[String(id)] }));
  };

  const selectedItems = useMemo(() => {
    return selectedIds.map((id) => findNode(nodes, id)).filter((n): n is TreeNode => Boolean(n));
  }, [selectedIds, nodes]);

  const renderNode = (node: TreeNode, level: number): React.ReactNode => {
    const hasChildren = !!(node.children && node.children.length);
    const isOpenNode = expanded[String(node.id)];
    const state = nodeState(node, selectedSet);

    return (
      <div key={String(node.id)} className="sisyphos-tree-node">
        <div
          className={cx(
            "sisyphos-tree-row",
            state === "checked" && "checked",
            state === "partial" && "partial",
            node.disabled && "disabled"
          )}
          style={{ paddingLeft: `${level * 20 + 8}px` }}
        >
          {hasChildren ? (
            <button
              type="button"
              className="sisyphos-tree-expand"
              onClick={(e) => toggleExpand(node.id, e)}
              aria-label={isOpenNode ? "Collapse" : "Expand"}
              aria-expanded={isOpenNode}
            >
              {isOpenNode ? <ChevronDown /> : <ChevronRight />}
            </button>
          ) : (
            <span className="sisyphos-tree-expand-spacer" />
          )}
          <button
            type="button"
            className="sisyphos-tree-toggle"
            onClick={() => toggleNode(node)}
            aria-checked={state === "checked" ? "true" : state === "partial" ? "mixed" : "false"}
            role="checkbox"
            disabled={node.disabled}
          >
            <span className={cx("sisyphos-tree-checkbox", state)}>
              {state === "checked" && (
                <svg viewBox="0 0 16 16" width="10" height="10" aria-hidden="true">
                  <path
                    d="M2 8l4 4 8-8"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
              {state === "partial" && <span className="sisyphos-tree-partial" />}
            </span>
            <span className="sisyphos-tree-label" title={node.label}>
              {node.label}
            </span>
          </button>
        </div>
        {hasChildren && isOpenNode && (
          <div className="sisyphos-tree-children">
            {node.children!.map((c) => renderNode(c, level + 1))}
          </div>
        )}
      </div>
    );
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    emit([]);
  };

  const tags = selectedItems.slice(0, maxTagCount);
  const overflow = selectedItems.length - tags.length;

  return (
    <div
      className={cx(
        "sisyphos-tree-select",
        size,
        error && "error",
        disabled && "disabled",
        fullWidth && "full-width",
        className
      )}
    >
      {label && (
        <label
          className={cx("sisyphos-tree-select-label", error && "error", required && "required")}
        >
          {label}
        </label>
      )}
      <div
        ref={triggerRef}
        className={cx("sisyphos-tree-select-trigger", open && "open")}
        onClick={() => !disabled && setOpen((o) => !o)}
        role="combobox"
        aria-haspopup="tree"
        aria-expanded={open}
        aria-controls={open ? listboxId : undefined}
        tabIndex={disabled ? -1 : 0}
      >
        <div className="sisyphos-tree-select-value">
          {selectedItems.length === 0 ? (
            <span className="sisyphos-tree-select-placeholder">{triggerLabel ?? placeholder}</span>
          ) : (
            <div className="sisyphos-tree-select-tags">
              {tags.map((t) => (
                <span key={String(t.id)} className="sisyphos-tree-select-tag" title={t.label}>
                  {t.label}
                </span>
              ))}
              {overflow > 0 && <span className="sisyphos-tree-select-tag more">+{overflow}</span>}
            </div>
          )}
        </div>
        {clearable && selectedItems.length > 0 && !disabled && (
          <button
            type="button"
            className="sisyphos-tree-select-clear"
            onClick={handleClear}
            aria-label="Clear all"
          >
            <ClearIcon />
          </button>
        )}
        <span className="sisyphos-tree-select-chevron">
          <ChevronIcon rotated={open} />
        </span>
      </div>

      {open && (
        <Portal>
          <div
            ref={listRef}
            id={listboxId}
            role="tree"
            className="sisyphos-tree-select-dropdown"
            style={{
              position: "fixed",
              left: pos?.left ?? 0,
              top: pos?.top ?? 0,
              minWidth: pos?.width ?? 0,
              opacity: pos ? 1 : 0,
            }}
          >
            {searchable && (
              <div className="sisyphos-tree-select-search">
                <input
                  ref={searchRef}
                  type="text"
                  placeholder={searchPlaceholder}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            )}
            <div className="sisyphos-tree-select-content">
              {filtered.length === 0 ? (
                <div className="sisyphos-tree-select-empty">No results</div>
              ) : (
                filtered.map((n) => renderNode(n, 0))
              )}
            </div>
          </div>
        </Portal>
      )}

      {error && errorMessage && (
        <span className="sisyphos-tree-select-error" role="alert">
          {errorMessage}
        </span>
      )}
    </div>
  );
};
