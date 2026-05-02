import { type InjectionKey, type Ref, inject } from "vue";

export interface CommandItemRegistration {
  value: string;
  text: string;
  disabled: boolean;
  ref: Ref<HTMLElement | null>;
}

export interface CommandContextValue {
  query: Ref<string>;
  setQuery: (q: string) => void;
  active: Ref<string>;
  setActive: (v: string) => void;
  register: (item: CommandItemRegistration) => () => void;
  visibleValues: Ref<string[]>;
  matches: (text: string, value: string) => boolean;
  selectActive: () => void;
}

export const CommandKey: InjectionKey<CommandContextValue> = Symbol("Command");

export function useCommand(): CommandContextValue {
  const ctx = inject(CommandKey);
  if (!ctx) throw new Error("[@sisyphos-ui/vue] Command subcomponent used outside <Command>.");
  return ctx;
}
