/**
 * Select — single- or multi-value combobox with optional search, clear,
 * creatable values, and infinite scroll.
 *
 * Dropdown is portal-mounted with auto-flip placement and full keyboard
 * navigation (Arrow Up/Down, Enter, Escape, Home/End).
 */
import React, {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";
import { Portal } from "@sisyphos-ui/portal";
import {
  cx,
  computePosition,
  useEscapeKey,
  type Placement,
} from "@sisyphos-ui/core/internal";
import type { Scale, SelectOption, SelectValue } from "./types";
import "./Select.scss";

type SingleProps = {
  multiple?: false;
  value?: SelectValue | null;
  defaultValue?: SelectValue | null;
  onChange?: (value: SelectValue | null) => void;
};
type MultiProps = {
  multiple: true;
  value?: SelectValue[];
  defaultValue?: SelectValue[];
  onChange?: (value: SelectValue[]) => void;
};

export type SelectProps = {
  options: SelectOption[];
  placeholder?: string;
  label?: string;
  helperText?: React.ReactNode;
  error?: boolean;
  errorMessage?: React.ReactNode;
  disabled?: boolean;
  required?: boolean;
  size?: Scale;
  radius?: Scale;
  fullWidth?: boolean;

  searchable?: boolean;
  /** Called when the search input changes. Use for server-side filtering. */
  onSearch?: (term: string) => void;
  /** Custom option filter (client-side). Return true to include. */
  filterOption?: (option: SelectOption, term: string) => boolean;

  clearable?: boolean;
  /** Allow typing in arbitrary new values (multi only). */
  creatable?: boolean;

  loading?: boolean;
  /** Fired when the listbox scrolls near the bottom. */
  onLoadMore?: () => void;
  hasMore?: boolean;

  placement?: Placement;
  className?: string;
} & (SingleProps | MultiProps);

const ChevronIcon = ({ open }: { open: boolean }) => (
  <svg viewBox="0 0 24 24" width={18} height={18} aria-hidden="true" style={{ transform: open ? "rotate(180deg)" : undefined, transition: "transform 150ms" }}>
    <path d="M7 10l5 5 5-5z" fill="currentColor" />
  </svg>
);

const ClearIcon = () => (
  <svg viewBox="0 0 24 24" width={14} height={14} aria-hidden="true">
    <path d="M19 6.41 17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" fill="currentColor" />
  </svg>
);

function defaultFilter(option: SelectOption, term: string): boolean {
  if (!term) return true;
  return option.label.toLowerCase().includes(term.toLowerCase());
}

export const Select: React.FC<SelectProps> = (props) => {
  const {
    options,
    placeholder = "Select…",
    label,
    helperText,
    error = false,
    errorMessage,
    disabled = false,
    required = false,
    size = "md",
    radius = "sm",
    fullWidth = false,
    searchable = false,
    onSearch,
    filterOption = defaultFilter,
    clearable = false,
    creatable = false,
    loading = false,
    onLoadMore,
    hasMore,
    placement = "bottom-start",
    className,
    multiple,
  } = props;

  const reactId = useId();
  const listboxId = `sisyphos-select-${reactId}`;

  const isControlled = "value" in props && props.value !== undefined;
  const [internalValue, setInternalValue] = useState<SelectValue | null | SelectValue[] | undefined>(
    props.defaultValue
  );
  const rawValue = isControlled ? (props as { value: unknown }).value : internalValue;

  const selectedValues = useMemo<SelectValue[]>(() => {
    if (multiple) return Array.isArray(rawValue) ? (rawValue as SelectValue[]) : [];
    return rawValue != null && rawValue !== "" ? [rawValue as SelectValue] : [];
  }, [rawValue, multiple]);

  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [activeIndex, setActiveIndex] = useState(-1);
  const [pos, setPos] = useState<{ left: number; top: number; placement: Placement; width: number } | null>(null);

  const triggerRef = useRef<HTMLDivElement | null>(null);
  const listRef = useRef<HTMLUListElement | null>(null);
  const searchRef = useRef<HTMLInputElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEscapeKey(() => setOpen(false), open);

  // Outside-click close — exclude both the trigger and the portalled listbox.
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      const tgt = e.target as Node | null;
      if (!tgt) return;
      if (triggerRef.current?.contains(tgt)) return;
      if (listRef.current?.contains(tgt)) return;
      setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  useEffect(() => {
    if (!open) {
      setSearch("");
      setActiveIndex(-1);
      return;
    }
    if (searchable && searchRef.current) {
      searchRef.current.focus();
    }
  }, [open, searchable]);

  useEffect(() => {
    if (!open) {
      setPos(null);
      return;
    }
    let raf = 0;
    const update = () => {
      const anchor = triggerRef.current;
      const list = listRef.current;
      if (!anchor || !list) return;
      const a = anchor.getBoundingClientRect();
      const size = { width: list.offsetWidth, height: list.offsetHeight };
      const p = computePosition(a, size, placement, 4);
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
  }, [open, placement]);

  const filteredOptions = useMemo(() => {
    if (!searchable || !search) return options;
    // When `onSearch` is provided, filtering happens on the server.
    if (onSearch) return options;
    return options.filter((o) => filterOption(o, search));
  }, [options, searchable, search, onSearch, filterOption]);

  const emitChange = useCallback(
    (next: SelectValue[] | SelectValue | null) => {
      if (!isControlled) {
        setInternalValue(next as SelectValue[] | SelectValue | null);
      }
      if (multiple) {
        (props.onChange as ((v: SelectValue[]) => void) | undefined)?.((next as SelectValue[]) ?? []);
      } else {
        (props.onChange as ((v: SelectValue | null) => void) | undefined)?.(next as SelectValue | null);
      }
    },
    [isControlled, multiple, props]
  );

  const selectValue = useCallback(
    (v: SelectValue) => {
      if (multiple) {
        const curr = selectedValues;
        const next = curr.includes(v) ? curr.filter((x) => x !== v) : [...curr, v];
        emitChange(next);
      } else {
        emitChange(v);
        setOpen(false);
      }
    },
    [multiple, selectedValues, emitChange]
  );

  const handleClear = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      if (disabled) return;
      emitChange(multiple ? [] : null);
    },
    [disabled, emitChange, multiple]
  );

  const handleScroll = (e: React.UIEvent<HTMLUListElement>) => {
    if (!onLoadMore || loading || hasMore === false) return;
    const el = e.currentTarget;
    if (el.scrollHeight - el.scrollTop - el.clientHeight < 24) onLoadMore();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!open && (e.key === "ArrowDown" || e.key === "Enter" || e.key === " ")) {
      e.preventDefault();
      setOpen(true);
      return;
    }
    if (!open) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(filteredOptions.length - 1, i + 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(0, i - 1));
    } else if (e.key === "Home") {
      e.preventDefault();
      setActiveIndex(0);
    } else if (e.key === "End") {
      e.preventDefault();
      setActiveIndex(filteredOptions.length - 1);
    } else if (e.key === "Enter") {
      const opt = filteredOptions[activeIndex];
      if (opt && !opt.disabled) {
        e.preventDefault();
        selectValue(opt.value);
      } else if (creatable && multiple && search.trim()) {
        e.preventDefault();
        const term = search.trim();
        if (!selectedValues.includes(term)) emitChange([...selectedValues, term]);
        setSearch("");
      }
    }
  };

  const displayTags = useMemo(() => {
    if (!multiple) return null;
    return selectedValues.map((v) => {
      const opt = options.find((o) => o.value === v);
      const lbl = opt?.label ?? String(v);
      return (
        <span key={String(v)} className="sisyphos-select-tag" title={lbl}>
          {lbl}
          <button
            type="button"
            className="sisyphos-select-tag-delete"
            aria-label={`Remove ${lbl}`}
            onClick={(e) => {
              e.stopPropagation();
              emitChange(selectedValues.filter((x) => x !== v));
            }}
            disabled={disabled}
          >
            ×
          </button>
        </span>
      );
    });
  }, [multiple, selectedValues, options, emitChange, disabled]);

  const singleLabel = useMemo(() => {
    if (multiple) return null;
    const v = selectedValues[0];
    if (v === undefined) return null;
    return options.find((o) => o.value === v)?.label ?? String(v);
  }, [multiple, selectedValues, options]);

  const hasValue = selectedValues.length > 0;

  return (
    <div
      ref={containerRef}
      className={cx(
        "sisyphos-select",
        size,
        `radius-${radius}`,
        disabled && "disabled",
        error && "error",
        fullWidth && "full-width",
        className
      )}
    >
      {label && (
        <label className={cx("sisyphos-select-label", error && "error", required && "required")}>
          {label}
        </label>
      )}
      <div
        ref={triggerRef}
        className={cx("sisyphos-select-control", open && "open", hasValue && "has-value")}
        role="combobox"
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-controls={open ? listboxId : undefined}
        aria-disabled={disabled || undefined}
        aria-invalid={error || undefined}
        tabIndex={disabled ? -1 : 0}
        onClick={() => !disabled && setOpen((o) => !o)}
        onKeyDown={handleKeyDown}
      >
        <div className="sisyphos-select-value">
          {multiple && selectedValues.length > 0 ? (
            <div className="sisyphos-select-tags">{displayTags}</div>
          ) : singleLabel ? (
            <span className="sisyphos-select-single">{singleLabel}</span>
          ) : (
            <span className="sisyphos-select-placeholder">{placeholder}</span>
          )}
        </div>
        {clearable && hasValue && !disabled && (
          <button
            type="button"
            aria-label="Clear selection"
            className="sisyphos-select-clear"
            onClick={handleClear}
          >
            <ClearIcon />
          </button>
        )}
        <span className="sisyphos-select-chevron"><ChevronIcon open={open} /></span>
      </div>
      {open && (
        <Portal>
          <ul
            ref={listRef}
            id={listboxId}
            role="listbox"
            aria-multiselectable={multiple || undefined}
            className={cx("sisyphos-select-list", pos?.placement ?? placement)}
            style={{
              position: "fixed",
              left: pos?.left ?? 0,
              top: pos?.top ?? 0,
              minWidth: pos?.width ?? 0,
              opacity: pos ? 1 : 0,
            }}
            onScroll={handleScroll}
          >
            {(searchable || creatable) && (
              <li className="sisyphos-select-search-row">
                <input
                  ref={searchRef}
                  className="sisyphos-select-search"
                  type="text"
                  placeholder={creatable ? "Type to add…" : "Search…"}
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    onSearch?.(e.target.value);
                    setActiveIndex(0);
                  }}
                  onKeyDown={handleKeyDown}
                />
              </li>
            )}
            {filteredOptions.length === 0 && !loading && (
              <li className="sisyphos-select-empty">No options</li>
            )}
            {filteredOptions.map((opt, i) => {
              const checked = selectedValues.includes(opt.value);
              return (
                <li
                  key={String(opt.value)}
                  role="option"
                  aria-selected={checked}
                  aria-disabled={opt.disabled || undefined}
                  className={cx(
                    "sisyphos-select-option",
                    checked && "selected",
                    opt.disabled && "disabled",
                    i === activeIndex && "active"
                  )}
                  onMouseEnter={() => setActiveIndex(i)}
                  onClick={() => !opt.disabled && selectValue(opt.value)}
                >
                  {opt.icon && <span className="sisyphos-select-option-icon">{opt.icon}</span>}
                  <span className="sisyphos-select-option-body">
                    <span className="sisyphos-select-option-label">{opt.label}</span>
                    {opt.description && (
                      <span className="sisyphos-select-option-description">{opt.description}</span>
                    )}
                  </span>
                  {checked && <span className="sisyphos-select-option-check" aria-hidden="true">✓</span>}
                </li>
              );
            })}
            {loading && (
              <li className="sisyphos-select-loading">
                <span className="sisyphos-select-loading-spinner" aria-hidden="true" />
                <span>Loading…</span>
              </li>
            )}
          </ul>
        </Portal>
      )}
      {error && errorMessage ? (
        <span className="sisyphos-select-error" role="alert">{errorMessage}</span>
      ) : helperText ? (
        <span className="sisyphos-select-helper">{helperText}</span>
      ) : null}
    </div>
  );
};
