import { describe, it, expect } from "vitest";
import { TestBed } from "@angular/core/testing";
import { Skeleton } from "./skeleton.component";
import { SkeletonText } from "./skeleton-text.component";
import { PageSkeleton } from "./page-skeleton.component";

describe("Skeleton (Angular)", () => {
  function setup(props: Record<string, unknown> = {}) {
    const fixture = TestBed.createComponent(Skeleton);
    for (const [key, value] of Object.entries(props)) {
      if (value !== undefined) fixture.componentRef.setInput(key, value);
    }
    fixture.detectChanges();
    const root = fixture.nativeElement.querySelector(".sisyphos-skeleton") as HTMLElement;
    return { fixture, root };
  }

  it("renders default rectangular shimmer skeleton", () => {
    const { root } = setup();
    expect(root).toBeTruthy();
    expect(root.className).toContain("rectangular");
    expect(root.className).toContain("shimmer");
    expect(root.getAttribute("aria-hidden")).toBe("true");
  });

  it("converts numeric width and height to px", () => {
    const { root } = setup({ width: 120, height: 40 });
    expect(root.style.width).toBe("120px");
    expect(root.style.height).toBe("40px");
  });

  it("passes through string width/height as-is", () => {
    const { root } = setup({ width: "100%", height: "2rem" });
    expect(root.style.width).toBe("100%");
    expect(root.style.height).toBe("2rem");
  });

  it("text shape sets default height to 1em when none given", () => {
    const { root } = setup({ shape: "text" });
    expect(root.className).toContain("text");
    expect(root.style.height).toBe("1em");
  });

  it("circular shape forces border-radius 50%", () => {
    const { root } = setup({ shape: "circular", radius: 8 });
    expect(root.className).toContain("circular");
    expect(root.style.borderRadius).toBe("50%");
  });

  it("non-circular radius applies as-is", () => {
    const { root } = setup({ radius: 8 });
    expect(root.style.borderRadius).toBe("8px");
  });

  it("animation can be disabled", () => {
    const { root } = setup({ animation: "none" });
    expect(root.className).toContain("none");
    expect(root.className).not.toContain("shimmer");
  });
});

describe("SkeletonText (Angular)", () => {
  function setup(props: Record<string, unknown> = {}) {
    const fixture = TestBed.createComponent(SkeletonText);
    for (const [key, value] of Object.entries(props)) {
      if (value !== undefined) fixture.componentRef.setInput(key, value);
    }
    fixture.detectChanges();
    return fixture;
  }

  it("renders 3 lines by default", () => {
    const fixture = setup();
    const lines = fixture.nativeElement.querySelectorAll(".sisyphos-skeleton.text");
    expect(lines.length).toBe(3);
  });

  it("renders the requested number of lines", () => {
    const fixture = setup({ lines: 6 });
    const lines = fixture.nativeElement.querySelectorAll(".sisyphos-skeleton.text");
    expect(lines.length).toBe(6);
  });

  it("narrows the last line by default", () => {
    const fixture = setup({ lines: 4 });
    const lines = fixture.nativeElement.querySelectorAll(".sisyphos-skeleton.text");
    const last = lines[lines.length - 1] as HTMLElement;
    expect(last.style.width).toBe("60%");
  });

  it("lastNarrow=false makes all lines full width", () => {
    const fixture = setup({ lines: 3, lastNarrow: false });
    const lines = fixture.nativeElement.querySelectorAll(".sisyphos-skeleton.text");
    const last = lines[lines.length - 1] as HTMLElement;
    expect(last.style.width).toBe("100%");
  });
});

describe("PageSkeleton (Angular)", () => {
  function setup(props: Record<string, unknown> = {}) {
    const fixture = TestBed.createComponent(PageSkeleton);
    for (const [key, value] of Object.entries(props)) {
      if (value !== undefined) fixture.componentRef.setInput(key, value);
    }
    fixture.detectChanges();
    return fixture;
  }

  it("default layout renders header + cards + table", () => {
    const fixture = setup();
    expect(fixture.nativeElement.querySelector(".sisyphos-page-skeleton-header")).toBeTruthy();
    expect(fixture.nativeElement.querySelector(".sisyphos-page-skeleton-cards")).toBeTruthy();
    expect(fixture.nativeElement.querySelector(".sisyphos-page-skeleton-table")).toBeTruthy();
  });

  it("showHeader=false hides the header", () => {
    const fixture = setup({ showHeader: false });
    expect(fixture.nativeElement.querySelector(".sisyphos-page-skeleton-header")).toBeNull();
  });

  it("cardCount=0 hides the cards section", () => {
    const fixture = setup({ cardCount: 0 });
    expect(fixture.nativeElement.querySelector(".sisyphos-page-skeleton-cards")).toBeNull();
  });

  it("tableRows=0 hides the table section", () => {
    const fixture = setup({ tableRows: 0 });
    expect(fixture.nativeElement.querySelector(".sisyphos-page-skeleton-table")).toBeNull();
  });

  it("layout=cards omits the table", () => {
    const fixture = setup({ layout: "cards" });
    expect(fixture.nativeElement.querySelector(".sisyphos-page-skeleton-cards")).toBeTruthy();
    expect(fixture.nativeElement.querySelector(".sisyphos-page-skeleton-table")).toBeNull();
  });

  it("layout=detail renders the detail block", () => {
    const fixture = setup({ layout: "detail" });
    expect(fixture.nativeElement.querySelector(".sisyphos-page-skeleton-detail")).toBeTruthy();
    expect(fixture.nativeElement.querySelector(".sisyphos-page-skeleton-cards")).toBeNull();
  });

  it("uses role=status and aria-label for accessibility", () => {
    const fixture = setup();
    const root = fixture.nativeElement.querySelector(".sisyphos-page-skeleton") as HTMLElement;
    expect(root.getAttribute("role")).toBe("status");
    expect(root.getAttribute("aria-label")).toBe("Loading page");
  });
});
