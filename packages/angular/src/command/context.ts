/**
 * Command context — DI bridge between the root Command and its compound
 * parts (Input, List, Item, etc.). Mirrors the React `CommandContextValue`
 * shape exactly so the same item-registration pattern works.
 */
import { InjectionToken, type Signal } from "@angular/core";

export interface CommandContextValue {
  search: Signal<string>;
  setSearch: (s: string) => void;
  /** Items call this on init with their id and a getter for the searchable value. */
  registerItem: (id: string, getValue: () => string) => () => void;
  activeId: Signal<string | null>;
  setActiveId: (id: string | null) => void;
  /** Ordered list of ids currently matching the search query. */
  matchedIds: Signal<string[]>;
  /** Called by Item on activation. */
  selectItem: (id: string) => void;
  inputId: Signal<string>;
  listId: Signal<string>;
}

export const CommandCtx = new InjectionToken<CommandContextValue>("sisyphos.command");

/** Lowercase substring match — same rule as the React/Vue versions. */
export function matches(value: string, query: string): boolean {
  if (!query) return true;
  return value.toLowerCase().includes(query.toLowerCase());
}
