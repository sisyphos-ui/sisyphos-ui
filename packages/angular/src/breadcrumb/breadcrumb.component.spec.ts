import { describe, it, expect, vi } from "vitest";
import { TestBed } from "@angular/core/testing";
import { Breadcrumb, type BreadcrumbItem } from "./breadcrumb.component";

describe("Breadcrumb (Angular)", () => {
  function setup(props: Record<string, unknown> = {}) {
    const fixture = TestBed.createComponent(Breadcrumb);
    for (const [key, value] of Object.entries(props)) {
      if (value !== undefined) fixture.componentRef.setInput(key, value);
    }
    fixture.detectChanges();
    return fixture;
  }

  it("renders a <nav> with aria-label=breadcrumb", () => {
    const fixture = setup({ items: [] });
    const nav = fixture.nativeElement.querySelector("nav") as HTMLElement;
    expect(nav.getAttribute("aria-label")).toBe("breadcrumb");
  });

  it("renders one <li> per item plus separators", () => {
    const items: BreadcrumbItem[] = [
      { label: "Home", href: "/" },
      { label: "Users", href: "/users" },
      { label: "Volkan" },
    ];
    const fixture = setup({ items });
    const itemLis = fixture.nativeElement.querySelectorAll(".sisyphos-breadcrumb-item");
    const sepLis = fixture.nativeElement.querySelectorAll(".sisyphos-breadcrumb-separator");
    expect(itemLis.length).toBe(3);
    expect(sepLis.length).toBe(2);
  });

  it("marks the last item with aria-current=page", () => {
    const items: BreadcrumbItem[] = [{ label: "Home", href: "/" }, { label: "Users" }];
    const fixture = setup({ items });
    const current = fixture.nativeElement.querySelector(
      ".sisyphos-breadcrumb-current"
    ) as HTMLElement;
    expect(current.getAttribute("aria-current")).toBe("page");
    expect(current.textContent?.trim()).toBe("Users");
  });

  it("renders <a> for items with href (not the last)", () => {
    const items: BreadcrumbItem[] = [{ label: "Home", href: "/" }, { label: "Users" }];
    const fixture = setup({ items });
    const link = fixture.nativeElement.querySelector(
      "a.sisyphos-breadcrumb-link"
    ) as HTMLAnchorElement;
    expect(link).toBeTruthy();
    expect(link.getAttribute("href")).toBe("/");
  });

  it("renders <button> for items with onClick (not href)", () => {
    const onClick = vi.fn();
    const items: BreadcrumbItem[] = [{ label: "Home", onClick }, { label: "Users" }];
    const fixture = setup({ items });
    const button = fixture.nativeElement.querySelector(
      "button.sisyphos-breadcrumb-link"
    ) as HTMLButtonElement;
    expect(button).toBeTruthy();
    button.click();
    expect(onClick).toHaveBeenCalled();
  });

  it("emits itemClick when an item is activated", () => {
    const items: BreadcrumbItem[] = [{ label: "Home", onClick: () => {} }, { label: "Users" }];
    const fixture = setup({ items });
    const emitted: BreadcrumbItem[] = [];
    fixture.componentInstance.itemClick.subscribe((it) => emitted.push(it));
    const button = fixture.nativeElement.querySelector("button") as HTMLButtonElement;
    button.click();
    expect(emitted.length).toBe(1);
    expect(emitted[0].label).toBe("Home");
  });

  it("respects custom separator string", () => {
    const items: BreadcrumbItem[] = [{ label: "A" }, { label: "B" }];
    const fixture = setup({ items, separator: ">" });
    const sep = fixture.nativeElement.querySelector(
      ".sisyphos-breadcrumb-separator"
    ) as HTMLElement;
    expect(sep.textContent?.trim()).toBe(">");
  });

  it("collapses middle items when total exceeds maxItems", () => {
    const items: BreadcrumbItem[] = Array.from({ length: 6 }, (_, i) => ({
      label: `Item ${i + 1}`,
    }));
    const fixture = setup({
      items,
      maxItems: 4,
      itemsBeforeCollapse: 1,
      itemsAfterCollapse: 2,
    });
    const ellipsis = fixture.nativeElement.querySelector(".sisyphos-breadcrumb-ellipsis");
    expect(ellipsis).toBeTruthy();
    expect(ellipsis?.textContent?.trim()).toBe("…");

    const itemLis = fixture.nativeElement.querySelectorAll(".sisyphos-breadcrumb-item");
    // 1 before + 2 after = 3 visible items
    expect(itemLis.length).toBe(3);
  });

  it("does not collapse when items count is under maxItems", () => {
    const items: BreadcrumbItem[] = Array.from({ length: 3 }, (_, i) => ({ label: `${i}` }));
    const fixture = setup({ items, maxItems: 5 });
    expect(fixture.nativeElement.querySelector(".sisyphos-breadcrumb-ellipsis")).toBeNull();
  });

  it("renders icon glyph string", () => {
    const items: BreadcrumbItem[] = [{ label: "Home", href: "/", icon: "🏠" }, { label: "Users" }];
    const fixture = setup({ items });
    const icon = fixture.nativeElement.querySelector(".sisyphos-breadcrumb-icon") as HTMLElement;
    expect(icon.textContent?.trim()).toBe("🏠");
  });
});
