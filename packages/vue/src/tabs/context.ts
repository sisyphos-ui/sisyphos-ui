import { type InjectionKey, type Ref, inject } from "vue";

export type TabsOrientation = "horizontal" | "vertical";

export interface TabsContextValue {
  baseId: string;
  value: Ref<string>;
  setValue: (next: string) => void;
  orientation: TabsOrientation;
  registerTrigger: (value: string, el: HTMLButtonElement | null) => void;
  focusValue: (value: string) => void;
  values: () => string[];
}

export const TabsKey: InjectionKey<TabsContextValue> = Symbol("Tabs");

export function useTabs(): TabsContextValue {
  const ctx = inject(TabsKey);
  if (!ctx) throw new Error("[@sisyphos-ui/vue] Tabs subcomponent used outside <Tabs>.");
  return ctx;
}
