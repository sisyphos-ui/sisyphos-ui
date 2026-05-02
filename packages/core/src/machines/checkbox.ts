/**
 * Checkbox state — framework-agnostic primitives for checkbox bindings.
 *
 * Two surfaces:
 *
 *   1. Pure helpers (`nextCheckboxStateAfterToggle`, `coerceCheckboxState`)
 *      — best for controlled bindings where the host framework owns state
 *      (React's `useState`, Vue's `v-model`). The host calls a helper to
 *      compute the next value and re-renders normally.
 *
 *   2. Stateful controller (`createCheckbox`) — best for uncontrolled or
 *      imperative bindings, or when a single source of truth needs to be
 *      shared between several composable pieces. Owns state internally
 *      and exposes a pub/sub API that adapts cleanly to Vue's `customRef`
 *      or Angular's `Observable`.
 *
 * Both share the same transition rule: toggling an indeterminate checkbox
 * promotes it to `checked = true` and clears the flag. Disabled boxes
 * never transition.
 */

export interface CheckboxState {
  checked: boolean;
  indeterminate: boolean;
  disabled: boolean;
}

/**
 * Compute the state after a user toggle. No-op while disabled.
 * Indeterminate is promoted to `checked = true` (standard "select all").
 */
export function nextCheckboxStateAfterToggle(state: CheckboxState): CheckboxState {
  if (state.disabled) return state;
  return {
    ...state,
    checked: state.indeterminate ? true : !state.checked,
    indeterminate: false,
  };
}

/**
 * Normalize a partial state into a complete `CheckboxState`. Useful for
 * bindings that accept any combination of optional props.
 */
export function coerceCheckboxState(input: Partial<CheckboxState> = {}): CheckboxState {
  return {
    checked: input.checked ?? false,
    indeterminate: input.indeterminate ?? false,
    disabled: input.disabled ?? false,
  };
}

export interface CheckboxOptions {
  checked?: boolean;
  indeterminate?: boolean;
  disabled?: boolean;
  /** Fired whenever the checked value changes (after toggle, setChecked). */
  onChange?: (checked: boolean) => void;
}

export interface CheckboxApi {
  /** Current state snapshot. Always returns the same object reference until a change. */
  getState(): CheckboxState;
  /** Subscribe to state changes; returns an unsubscribe function. */
  subscribe(listener: () => void): () => void;
  /**
   * Toggle the checked value. If the box is currently indeterminate,
   * promotes to `checked = true` (the standard "select all" behavior).
   * No-op while disabled.
   */
  toggle(): void;
  /** Force the checked value. Clears indeterminate. */
  setChecked(checked: boolean): void;
  /** Force the indeterminate flag. Independent of `checked`. */
  setIndeterminate(indeterminate: boolean): void;
  /** Sync disabled from outside (controlled callers). */
  setDisabled(disabled: boolean): void;
  /** Sync the entire state from outside (controlled callers). */
  setState(next: Partial<CheckboxState>): void;
}

export function createCheckbox(opts: CheckboxOptions = {}): CheckboxApi {
  let state: CheckboxState = {
    checked: opts.checked ?? false,
    indeterminate: opts.indeterminate ?? false,
    disabled: opts.disabled ?? false,
  };
  const listeners = new Set<() => void>();
  const onChange = opts.onChange;

  const notify = () => {
    listeners.forEach((l) => l());
  };

  const apply = (next: CheckboxState, fireOnChange: boolean) => {
    if (
      next.checked === state.checked &&
      next.indeterminate === state.indeterminate &&
      next.disabled === state.disabled
    ) {
      return;
    }
    const checkedChanged = next.checked !== state.checked;
    state = next;
    notify();
    if (fireOnChange && checkedChanged) onChange?.(state.checked);
  };

  return {
    getState: () => state,
    subscribe(listener) {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },
    toggle() {
      apply(nextCheckboxStateAfterToggle(state), true);
    },
    setChecked(checked) {
      apply({ ...state, checked, indeterminate: false }, true);
    },
    setIndeterminate(indeterminate) {
      apply({ ...state, indeterminate }, false);
    },
    setDisabled(disabled) {
      apply({ ...state, disabled }, false);
    },
    setState(next) {
      apply({ ...state, ...next }, false);
    },
  };
}
