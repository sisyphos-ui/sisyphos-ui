import { describe, it, expect, vi } from "vitest";
import { Component } from "@angular/core";
import { TestBed } from "@angular/core/testing";
import { Button, type ButtonDropdownItem } from "./button.component";

function setup(props: Record<string, unknown> = {}) {
  const fixture = TestBed.createComponent(Button);
  for (const [key, value] of Object.entries(props)) {
    if (value !== undefined) fixture.componentRef.setInput(key, value);
  }
  fixture.detectChanges();
  return fixture;
}

describe("Button (Angular)", () => {
  it("renders a <button> with default classes", () => {
    const fixture = setup();
    const btn = fixture.nativeElement.querySelector("button.sisyphos-button") as HTMLButtonElement;
    expect(btn).toBeTruthy();
    expect(btn.type).toBe("button");
    expect(btn.className).toContain("contained");
    expect(btn.className).toContain("primary");
    expect(btn.className).toContain("md");
    expect(btn.className).toContain("radius-md");
  });

  it("emits buttonClick on click", () => {
    const fixture = setup();
    const onClick = vi.fn();
    fixture.componentInstance.buttonClick.subscribe(onClick);
    const btn = fixture.nativeElement.querySelector("button") as HTMLButtonElement;
    btn.click();
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("disabled prevents click and adds aria-disabled", () => {
    const fixture = setup({ disabled: true });
    const onClick = vi.fn();
    fixture.componentInstance.buttonClick.subscribe(onClick);
    const btn = fixture.nativeElement.querySelector("button") as HTMLButtonElement;
    expect(btn.disabled).toBe(true);
    expect(btn.getAttribute("aria-disabled")).toBe("true");
    btn.click();
    expect(onClick).not.toHaveBeenCalled();
  });

  it("loading state renders spinner and disables button", () => {
    const fixture = setup({ loading: true });
    const btn = fixture.nativeElement.querySelector("button") as HTMLButtonElement;
    expect(btn.className).toContain("loading");
    expect(btn.getAttribute("aria-busy")).toBe("true");
    expect(btn.disabled).toBe(true);
    expect(fixture.nativeElement.querySelector(".sisyphos-button-loading-spinner")).toBeTruthy();
  });

  it("loadingPosition=center hides text", () => {
    const fixture = setup({ loading: true, loadingPosition: "center" });
    expect(fixture.nativeElement.querySelector(".sisyphos-button-text")).toBeNull();
  });

  it("loadingPosition=start keeps text and renders spinner before", () => {
    const fixture = setup({ loading: true, loadingPosition: "start" });
    expect(fixture.nativeElement.querySelector(".sisyphos-button-text")).toBeTruthy();
    expect(
      fixture.nativeElement.querySelector(".sisyphos-button-loading-spinner--start")
    ).toBeTruthy();
  });

  it("href renders an <a> instead of <button>", () => {
    const fixture = setup({ href: "https://example.com" });
    expect(fixture.nativeElement.querySelector("button")).toBeNull();
    const link = fixture.nativeElement.querySelector("a.sisyphos-button") as HTMLAnchorElement;
    expect(link).toBeTruthy();
    expect(link.getAttribute("href")).toBe("https://example.com");
  });

  it("disabled href anchor strips the href and sets tabindex=-1", () => {
    const fixture = setup({ href: "https://example.com", disabled: true });
    const link = fixture.nativeElement.querySelector("a.sisyphos-button") as HTMLAnchorElement;
    expect(link.getAttribute("href")).toBeNull();
    expect(link.getAttribute("tabindex")).toBe("-1");
  });

  it("fullWidth + radius variants apply classes", () => {
    const fixture = setup({ fullWidth: true, radius: "full", color: "success" });
    const btn = fixture.nativeElement.querySelector("button") as HTMLButtonElement;
    expect(btn.className).toContain("full-width");
    expect(btn.className).toContain("radius-full");
    expect(btn.className).toContain("success");
  });

  it("dropdownItems toggle the menu on click", () => {
    const items: ButtonDropdownItem[] = [
      { label: "Edit", onClick: vi.fn() },
      { label: "Delete", onClick: vi.fn() },
    ];
    const fixture = setup({ dropdownItems: items });
    const btn = fixture.nativeElement.querySelector("button") as HTMLButtonElement;
    expect(btn.getAttribute("aria-haspopup")).toBe("menu");
    expect(btn.getAttribute("aria-expanded")).toBe("false");
    expect(fixture.nativeElement.querySelector("ul[role=menu]")).toBeNull();

    btn.click();
    fixture.detectChanges();

    expect(btn.getAttribute("aria-expanded")).toBe("true");
    const menu = fixture.nativeElement.querySelector("ul[role=menu]");
    expect(menu).toBeTruthy();
    expect(menu.querySelectorAll("li").length).toBe(2);
  });

  it("dropdown item click fires its callback and closes the menu", () => {
    const editFn = vi.fn();
    const items: ButtonDropdownItem[] = [
      { label: "Edit", onClick: editFn },
      { label: "Delete", onClick: vi.fn() },
    ];
    const fixture = setup({ dropdownItems: items });
    const btn = fixture.nativeElement.querySelector("button") as HTMLButtonElement;
    btn.click();
    fixture.detectChanges();
    const items_ = fixture.nativeElement.querySelectorAll("li[role=menuitem]");
    (items_[0] as HTMLLIElement).click();
    fixture.detectChanges();
    expect(editFn).toHaveBeenCalled();
    expect(fixture.nativeElement.querySelector("ul[role=menu]")).toBeNull();
  });

  it("Enter/Space activate dropdown items", () => {
    const editFn = vi.fn();
    const items: ButtonDropdownItem[] = [{ label: "Edit", onClick: editFn }];
    const fixture = setup({ dropdownItems: items });
    const btn = fixture.nativeElement.querySelector("button") as HTMLButtonElement;
    btn.click();
    fixture.detectChanges();
    const li = fixture.nativeElement.querySelector("li[role=menuitem]") as HTMLLIElement;
    li.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", bubbles: true }));
    expect(editFn).toHaveBeenCalled();
  });

  it("dropdown is disabled when href is set", () => {
    const items: ButtonDropdownItem[] = [{ label: "X", onClick: vi.fn() }];
    const fixture = setup({ dropdownItems: items, href: "/x" });
    expect(fixture.nativeElement.querySelector("a")).toBeTruthy();
    const link = fixture.nativeElement.querySelector("a") as HTMLAnchorElement;
    expect(link.getAttribute("aria-haspopup")).toBeNull();
  });

  it("aria-label is forwarded to button", () => {
    const fixture = setup({ "aria-label": "Save changes" });
    const btn = fixture.nativeElement.querySelector("button") as HTMLButtonElement;
    expect(btn.getAttribute("aria-label")).toBe("Save changes");
  });
});

describe("Button — projected slots", () => {
  @Component({
    standalone: true,
    imports: [Button],
    template: `
      <sui-button>
        <svg button-start-icon class="start"></svg>
        Save
        <svg button-end-icon class="end"></svg>
      </sui-button>
    `,
  })
  class Host {}

  it("projects start and end icons into their containers", () => {
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector(".sisyphos-button-icon--start .start")).toBeTruthy();
    expect(fixture.nativeElement.querySelector(".sisyphos-button-icon--end .end")).toBeTruthy();
  });

  it("projects label text into .sisyphos-button-text", () => {
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    const text = fixture.nativeElement.querySelector(".sisyphos-button-text") as HTMLElement;
    expect(text.textContent?.trim()).toBe("Save");
  });
});
