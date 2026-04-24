/**
 * Command — a keyboard-first command palette / filterable menu.
 *
 * Usage:
 *   <Command onSelect={(id) => run(id)}>
 *     <Command.Input placeholder="Type a command…" />
 *     <Command.List>
 *       <Command.Empty>No results.</Command.Empty>
 *       <Command.Group heading="Suggestions">
 *         <Command.Item value="calendar" onSelect={() => …}>Calendar</Command.Item>
 *         <Command.Item value="search"   onSelect={() => …}>Search</Command.Item>
 *       </Command.Group>
 *     </Command.List>
 *   </Command>
 *
 * Filtering is case-insensitive substring match on each Item's `value` prop
 * (falling back to its textContent). The active Item is tracked at the root
 * so Arrow keys on the input navigate the visible list.
 */
import React, {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { cx } from "@sisyphos-ui/core/internal";
import { CommandContext, useCommandContext, matches } from "./context";
import "./Command.scss";

/* ── ROOT ────────────────────────────────────────────────────────────── */

export interface CommandProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "onSelect"> {
  /** Controlled search value. */
  value?: string;
  /** Initial search value when uncontrolled. */
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  /**
   * Fired when an item is activated via click or Enter. Receives the Item's
   * `value` prop (or its text if no value was given).
   */
  onSelect?: (value: string) => void;
  /** Label announced for the input/list combobox. Default "Command menu". */
  label?: string;
  children: ReactNode;
}

interface CommandComponent extends React.FC<CommandProps> {
  Input: typeof CommandInput;
  List: typeof CommandList;
  Empty: typeof CommandEmpty;
  Group: typeof CommandGroup;
  Item: typeof CommandItem;
  Separator: typeof CommandSeparator;
}

const CommandRoot: React.FC<CommandProps> = ({
  value: valueProp,
  defaultValue = "",
  onValueChange,
  onSelect,
  label = "Command menu",
  children,
  className,
  ...rest
}) => {
  const reactId = useId();
  const inputId = `sisyphos-command-input-${reactId}`;
  const listId = `sisyphos-command-list-${reactId}`;

  const isControlled = valueProp !== undefined;
  const [internalValue, setInternalValue] = useState(defaultValue);
  const search = isControlled ? valueProp : internalValue;

  const setSearch = useCallback(
    (next: string) => {
      if (!isControlled) setInternalValue(next);
      onValueChange?.(next);
    },
    [isControlled, onValueChange]
  );

  // Items register themselves — we track a render-stable registry.
  const registryRef = useRef(new Map<string, () => string>());
  // Bumped every time the registry changes, so derived memos recompute.
  const [registryVersion, setRegistryVersion] = useState(0);

  const registerItem = useCallback((id: string, getValue: () => string) => {
    registryRef.current.set(id, getValue);
    setRegistryVersion((v) => v + 1);
    return () => {
      registryRef.current.delete(id);
      setRegistryVersion((v) => v + 1);
    };
  }, []);

  const matchedIds = useMemo(() => {
    const out: string[] = [];
    for (const [id, getValue] of registryRef.current) {
      if (matches(getValue(), search)) out.push(id);
    }
    return out;
    // registryVersion intentionally in deps — read the current registry
    // whenever items register/unregister or the search value changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, registryVersion]);

  const [activeId, setActiveId] = useState<string | null>(null);

  // Reset activeId when matches change — default to the first match.
  useEffect(() => {
    if (matchedIds.length === 0) {
      setActiveId(null);
      return;
    }
    if (!activeId || !matchedIds.includes(activeId)) {
      setActiveId(matchedIds[0]);
    }
  }, [matchedIds, activeId]);

  const handleSelect = useCallback(
    (id: string) => {
      const getValue = registryRef.current.get(id);
      onSelect?.(getValue?.() ?? id);
    },
    [onSelect]
  );

  const ctx = useMemo(
    () => ({
      search,
      setSearch,
      registerItem,
      activeId,
      setActiveId,
      matchedIds,
      onSelect: handleSelect,
      inputId,
      listId,
    }),
    [search, setSearch, registerItem, activeId, matchedIds, handleSelect, inputId, listId]
  );

  return (
    <div
      className={cx("sisyphos-command", className)}
      role="combobox"
      aria-expanded="true"
      aria-haspopup="listbox"
      aria-owns={listId}
      aria-label={label}
      {...rest}
    >
      <CommandContext.Provider value={ctx}>{children}</CommandContext.Provider>
    </div>
  );
};

/* ── INPUT ───────────────────────────────────────────────────────────── */

export interface CommandInputProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "value" | "defaultValue" | "onChange"
> {
  placeholder?: string;
}

const CommandInput = React.forwardRef<HTMLInputElement, CommandInputProps>(function CommandInput(
  { placeholder = "Type a command or search…", className, onKeyDown, ...rest },
  ref
) {
  const ctx = useCommandContext("Command.Input");

  const moveActive = useCallback(
    (dir: 1 | -1) => {
      const { matchedIds, activeId, setActiveId } = ctx;
      if (matchedIds.length === 0) return;
      const idx = activeId ? matchedIds.indexOf(activeId) : -1;
      const nextIdx =
        idx === -1
          ? dir === 1
            ? 0
            : matchedIds.length - 1
          : (idx + dir + matchedIds.length) % matchedIds.length;
      setActiveId(matchedIds[nextIdx]);
    },
    [ctx]
  );

  return (
    <input
      ref={ref}
      id={ctx.inputId}
      className={cx("sisyphos-command-input", className)}
      type="text"
      autoComplete="off"
      autoCorrect="off"
      spellCheck={false}
      role="searchbox"
      aria-autocomplete="list"
      aria-controls={ctx.listId}
      aria-activedescendant={ctx.activeId ?? undefined}
      value={ctx.search}
      placeholder={placeholder}
      onChange={(e) => ctx.setSearch(e.target.value)}
      onKeyDown={(e) => {
        onKeyDown?.(e);
        if (e.defaultPrevented) return;
        if (e.key === "ArrowDown") {
          e.preventDefault();
          moveActive(1);
        } else if (e.key === "ArrowUp") {
          e.preventDefault();
          moveActive(-1);
        } else if (e.key === "Home") {
          e.preventDefault();
          if (ctx.matchedIds.length) ctx.setActiveId(ctx.matchedIds[0]);
        } else if (e.key === "End") {
          e.preventDefault();
          if (ctx.matchedIds.length) ctx.setActiveId(ctx.matchedIds[ctx.matchedIds.length - 1]);
        } else if (e.key === "Enter" && ctx.activeId) {
          e.preventDefault();
          ctx.onSelect(ctx.activeId);
        }
      }}
      {...rest}
    />
  );
});

/* ── LIST ────────────────────────────────────────────────────────────── */

export interface CommandListProps extends React.HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

const CommandList: React.FC<CommandListProps> = ({ className, children, ...rest }) => {
  const ctx = useCommandContext("Command.List");
  return (
    <div
      id={ctx.listId}
      role="listbox"
      className={cx("sisyphos-command-list", className)}
      {...rest}
    >
      {children}
    </div>
  );
};

/* ── EMPTY ───────────────────────────────────────────────────────────── */

export interface CommandEmptyProps extends React.HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

const CommandEmpty: React.FC<CommandEmptyProps> = ({ className, children, ...rest }) => {
  const ctx = useCommandContext("Command.Empty");
  if (ctx.matchedIds.length > 0) return null;
  return (
    <div className={cx("sisyphos-command-empty", className)} role="note" {...rest}>
      {children}
    </div>
  );
};

/* ── GROUP ───────────────────────────────────────────────────────────── */

export interface CommandGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  heading?: ReactNode;
  children: ReactNode;
}

const CommandGroup: React.FC<CommandGroupProps> = ({ heading, className, children, ...rest }) => {
  // The group renders heading + children. Items filter themselves — if every
  // child item is hidden, we hide the whole group via the `:has` selector in
  // SCSS so the heading doesn't linger above an empty group.
  return (
    <div className={cx("sisyphos-command-group", className)} role="group" {...rest}>
      {heading && <div className="sisyphos-command-group-heading">{heading}</div>}
      <div className="sisyphos-command-group-items">{children}</div>
    </div>
  );
};

/* ── ITEM ────────────────────────────────────────────────────────────── */

export interface CommandItemProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "onSelect"> {
  /** Searchable value. Falls back to the text of `children` if omitted. */
  value?: string;
  disabled?: boolean;
  onSelect?: () => void;
  children: ReactNode;
}

const CommandItem: React.FC<CommandItemProps> = ({
  value,
  disabled = false,
  onSelect,
  className,
  children,
  ...rest
}) => {
  const ctx = useCommandContext("Command.Item");
  // Destructure the stable callback so the register effect doesn't retrigger
  // every time ctx (which includes live state like matchedIds) re-creates —
  // that caused a register/unregister storm on mount.
  const { registerItem, matchedIds, activeId, setActiveId, onSelect: onRootSelect } = ctx;
  const reactId = useId();
  const id = `sisyphos-command-item-${reactId}`;
  const itemRef = useRef<HTMLDivElement>(null);

  // Read value via a ref getter so changes to props flow through without re-registering.
  const latestValue = useRef<string>(value ?? "");
  useEffect(() => {
    latestValue.current = value ?? itemRef.current?.textContent ?? "";
  });

  useEffect(() => {
    if (disabled) return;
    return registerItem(id, () => latestValue.current);
  }, [registerItem, id, disabled]);

  const isMatched = matchedIds.includes(id);
  const isActive = activeId === id;

  // Scroll active item into view. Guarded so environments without the DOM
  // method (jsdom) don't throw in tests.
  useEffect(() => {
    if (isActive && typeof itemRef.current?.scrollIntoView === "function") {
      itemRef.current.scrollIntoView({ block: "nearest" });
    }
  }, [isActive]);

  if (!isMatched || disabled) return null;

  return (
    <div
      ref={itemRef}
      id={id}
      role="option"
      aria-selected={isActive || undefined}
      data-active={isActive || undefined}
      className={cx(
        "sisyphos-command-item",
        isActive && "active",
        disabled && "disabled",
        className
      )}
      onMouseEnter={() => setActiveId(id)}
      onClick={() => {
        onSelect?.();
        onRootSelect(id);
      }}
      {...rest}
    >
      {children}
    </div>
  );
};

/* ── SEPARATOR ───────────────────────────────────────────────────────── */

const CommandSeparator: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className,
  ...rest
}) => <div role="separator" className={cx("sisyphos-command-separator", className)} {...rest} />;

/* ── COMPOUND EXPORT ─────────────────────────────────────────────────── */

export const Command = CommandRoot as CommandComponent;
Command.Input = CommandInput;
Command.List = CommandList;
Command.Empty = CommandEmpty;
Command.Group = CommandGroup;
Command.Item = CommandItem;
Command.Separator = CommandSeparator;
