/**
 * Tabs context — DI bridge between `<sui-tabs>`, `<sui-tabs-list>`,
 * `<sui-tabs-trigger>`, and `<sui-tabs-panel>`. Triggers self-register on
 * init and unregister on destroy so TabsList can drive arrow-key navigation
 * and the active-indicator measurement.
 */
import { InjectionToken, type Signal } from "@angular/core";

export type TabsOrientation = "horizontal" | "vertical";

export interface TabsContextValue {
  baseId: Signal<string>;
  value: Signal<string>;
  orientation: Signal<TabsOrientation>;
  setValue: (next: string) => void;
  registerTrigger: (value: string, el: HTMLElement) => void;
  unregisterTrigger: (value: string) => void;
  focusValue: (value: string) => void;
  triggerValues: () => string[];
}

export const TabsCtx = new InjectionToken<TabsContextValue>("sisyphos.tabs");
