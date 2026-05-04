import { describe, it, expect } from "vitest";
import { Component } from "@angular/core";
import { TestBed } from "@angular/core/testing";
import { Card, CardBody, CardFooter, CardHeader } from "./card.component";

describe("Card (Angular)", () => {
  it("renders the root with default classes", () => {
    const fixture = TestBed.createComponent(Card);
    fixture.detectChanges();
    const root = fixture.nativeElement.querySelector(".sisyphos-card") as HTMLElement;
    expect(root).toBeTruthy();
    expect(root.className).toContain("elevated");
    expect(root.className).toContain("padding-md");
    expect(root.className).not.toContain("interactive");
  });

  it("applies variant + padding inputs", () => {
    const fixture = TestBed.createComponent(Card);
    fixture.componentRef.setInput("variant", "outlined");
    fixture.componentRef.setInput("padding", "lg");
    fixture.detectChanges();
    const root = fixture.nativeElement.querySelector(".sisyphos-card") as HTMLElement;
    expect(root.className).toContain("outlined");
    expect(root.className).toContain("padding-lg");
  });

  it("interactive=true sets role=button and tabindex=0", () => {
    const fixture = TestBed.createComponent(Card);
    fixture.componentRef.setInput("interactive", true);
    fixture.detectChanges();
    const root = fixture.nativeElement.querySelector(".sisyphos-card") as HTMLElement;
    expect(root.className).toContain("interactive");
    expect(root.getAttribute("role")).toBe("button");
    expect(root.getAttribute("tabindex")).toBe("0");
  });

  it("interactive=false omits role and tabindex", () => {
    const fixture = TestBed.createComponent(Card);
    fixture.detectChanges();
    const root = fixture.nativeElement.querySelector(".sisyphos-card") as HTMLElement;
    expect(root.getAttribute("role")).toBeNull();
    expect(root.getAttribute("tabindex")).toBeNull();
  });
});

describe("Card compound slots", () => {
  @Component({
    standalone: true,
    imports: [Card, CardHeader, CardBody, CardFooter],
    template: `
      <sui-card>
        <sui-card-header>HEAD</sui-card-header>
        <sui-card-body>BODY</sui-card-body>
        <sui-card-footer>FOOT</sui-card-footer>
      </sui-card>
    `,
  })
  class HostWithSlots {}

  it("projects header/body/footer into their slot elements", () => {
    const fixture = TestBed.createComponent(HostWithSlots);
    fixture.detectChanges();
    const header = fixture.nativeElement.querySelector(".sisyphos-card-header") as HTMLElement;
    const body = fixture.nativeElement.querySelector(".sisyphos-card-body") as HTMLElement;
    const footer = fixture.nativeElement.querySelector(".sisyphos-card-footer") as HTMLElement;

    expect(header.tagName).toBe("HEADER");
    expect(header.textContent).toBe("HEAD");
    expect(body.tagName).toBe("DIV");
    expect(body.textContent).toBe("BODY");
    expect(footer.tagName).toBe("FOOTER");
    expect(footer.textContent).toBe("FOOT");
  });
});
