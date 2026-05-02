import { createContext, useContext } from "react";

export type TabsOrientation = "horizontal" | "vertical";

export interface TabsContextValue {
  baseId: string;
  value: string;
  setValue: (next: string) => void;
  orientation: TabsOrientation;
  registerTrigger: (value: string, el: HTMLButtonElement | null) => void;
  focusValue: (value: string) => void;
  values: () => string[];
}

export const TabsContext = createContext<TabsContextValue | null>(null);

export function useTabs(): TabsContextValue {
  const ctx = useContext(TabsContext);
  if (!ctx) throw new Error("[@sisyphos-ui/tabs] subcomponent used outside <Tabs>.");
  return ctx;
}
