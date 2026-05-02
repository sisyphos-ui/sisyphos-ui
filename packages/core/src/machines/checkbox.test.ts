import { describe, it, expect, vi } from "vitest";
import { createCheckbox } from "./checkbox";

describe("createCheckbox", () => {
  it("starts with the supplied initial state", () => {
    const api = createCheckbox({ checked: true, indeterminate: false, disabled: false });
    expect(api.getState()).toEqual({ checked: true, indeterminate: false, disabled: false });
  });

  it("toggle flips checked when not indeterminate", () => {
    const api = createCheckbox({ checked: false });
    api.toggle();
    expect(api.getState().checked).toBe(true);
    api.toggle();
    expect(api.getState().checked).toBe(false);
  });

  it("toggle promotes indeterminate to checked=true and clears the flag", () => {
    const api = createCheckbox({ checked: false, indeterminate: true });
    api.toggle();
    expect(api.getState()).toEqual({ checked: true, indeterminate: false, disabled: false });
  });

  it("toggle is a no-op while disabled", () => {
    const api = createCheckbox({ checked: false, disabled: true });
    api.toggle();
    expect(api.getState().checked).toBe(false);
  });

  it("setChecked clears indeterminate", () => {
    const api = createCheckbox({ checked: false, indeterminate: true });
    api.setChecked(true);
    expect(api.getState()).toEqual({ checked: true, indeterminate: false, disabled: false });
  });

  it("setIndeterminate is independent of checked", () => {
    const api = createCheckbox({ checked: true });
    api.setIndeterminate(true);
    expect(api.getState()).toEqual({ checked: true, indeterminate: true, disabled: false });
  });

  it("subscribers fire on every change and unsubscribe cleanly", () => {
    const api = createCheckbox();
    const listener = vi.fn();
    const unsubscribe = api.subscribe(listener);
    api.toggle();
    api.setIndeterminate(true);
    expect(listener).toHaveBeenCalledTimes(2);
    unsubscribe();
    api.toggle();
    expect(listener).toHaveBeenCalledTimes(2);
  });

  it("onChange fires only when checked actually changes", () => {
    const onChange = vi.fn();
    const api = createCheckbox({ checked: false, onChange });
    api.toggle();
    expect(onChange).toHaveBeenCalledWith(true);
    // setIndeterminate doesn't change `checked`, so no onChange.
    api.setIndeterminate(true);
    expect(onChange).toHaveBeenCalledTimes(1);
    // Toggle from indeterminate fires checked=true (already true → no fire).
    api.toggle();
    expect(onChange).toHaveBeenCalledTimes(1);
  });

  it("getState reference stays stable until a change", () => {
    const api = createCheckbox();
    const a = api.getState();
    const b = api.getState();
    expect(a).toBe(b);
    api.toggle();
    const c = api.getState();
    expect(c).not.toBe(a);
  });
});
