import { createContext, useContext } from "react";

export interface CommandContextValue {
  search: string;
  setSearch: (s: string) => void;
  /**
   * Called by Command.Item on mount with its id and searchable value.
   * Returns an unregister callback — Item calls it on unmount.
   */
  registerItem: (id: string, getValue: () => string) => () => void;
  activeId: string | null;
  setActiveId: (id: string | null) => void;
  /**
   * Ordered list of ids that currently match the search query. The List
   * component uses this to drive keyboard navigation, and Items read it
   * to know whether to render.
   */
  matchedIds: string[];
  onSelect: (id: string, meta?: unknown) => void;
  inputId: string;
  listId: string;
}

export const CommandContext = createContext<CommandContextValue | null>(null);

export function useCommandContext(where: string): CommandContextValue {
  const ctx = useContext(CommandContext);
  if (!ctx) {
    throw new Error(
      `[@sisyphos-ui/command] ${where} must be used inside <Command>.`,
    );
  }
  return ctx;
}

/** Lowercase substring match — good enough for a first pass; swap in fuzzy later. */
export function matches(value: string, query: string): boolean {
  if (!query) return true;
  return value.toLowerCase().includes(query.toLowerCase());
}
