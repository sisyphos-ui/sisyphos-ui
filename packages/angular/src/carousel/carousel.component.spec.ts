import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { Component } from "@angular/core";
import { TestBed } from "@angular/core/testing";
import { Carousel } from "./carousel.component";

@Component({
  standalone: true,
  imports: [Carousel],
  template: `
    <sui-carousel
      [items]="items"
      [index]="index"
      (indexChange)="index = $event"
      [loop]="loop"
      [showArrows]="showArrows"
      [showDots]="showDots"
    >
      <ng-template let-item let-i="index">
        <div class="slide-{{ i }}">{{ item }}</div>
      </ng-template>
    </sui-carousel>
  `,
})
class Host {
  items = ["A", "B", "C"];
  index = 0;
  loop = true;
  showArrows = true;
  showDots = true;
}

describe("Carousel (Angular)", () => {
  it("renders one slide per item", () => {
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    const slides = fixture.nativeElement.querySelectorAll(".sisyphos-carousel-slide");
    expect(slides.length).toBe(3);
  });

  it("translates the track based on the active index", () => {
    const fixture = TestBed.createComponent(Host);
    fixture.componentInstance.index = 1;
    fixture.detectChanges();
    const track = fixture.nativeElement.querySelector(".sisyphos-carousel-track") as HTMLElement;
    expect(track.style.transform).toBe("translateX(-100%)");
  });

  it("aria-hidden marks inactive slides", () => {
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    const slides = fixture.nativeElement.querySelectorAll(
      ".sisyphos-carousel-slide"
    ) as NodeListOf<HTMLElement>;
    expect(slides[0].getAttribute("aria-hidden")).toBe("false");
    expect(slides[1].getAttribute("aria-hidden")).toBe("true");
  });

  it("Next button advances and emits indexChange", () => {
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    const next = fixture.nativeElement.querySelector(
      ".sisyphos-carousel-arrow.next"
    ) as HTMLButtonElement;
    next.click();
    fixture.detectChanges();
    expect(fixture.componentInstance.index).toBe(1);
  });

  it("Prev button goes to previous", () => {
    const fixture = TestBed.createComponent(Host);
    fixture.componentInstance.index = 1;
    fixture.detectChanges();
    const prev = fixture.nativeElement.querySelector(
      ".sisyphos-carousel-arrow.prev"
    ) as HTMLButtonElement;
    prev.click();
    fixture.detectChanges();
    expect(fixture.componentInstance.index).toBe(0);
  });

  it("loop=true wraps from last to first", () => {
    const fixture = TestBed.createComponent(Host);
    fixture.componentInstance.index = 2;
    fixture.detectChanges();
    const next = fixture.nativeElement.querySelector(
      ".sisyphos-carousel-arrow.next"
    ) as HTMLButtonElement;
    next.click();
    fixture.detectChanges();
    expect(fixture.componentInstance.index).toBe(0);
  });

  it("loop=false disables next at last and prev at first", () => {
    const fixture = TestBed.createComponent(Host);
    fixture.componentInstance.loop = false;
    fixture.componentInstance.index = 2;
    fixture.detectChanges();
    const next = fixture.nativeElement.querySelector(
      ".sisyphos-carousel-arrow.next"
    ) as HTMLButtonElement;
    expect(next.disabled).toBe(true);
  });

  it("dot click jumps to that slide", () => {
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    const dots = fixture.nativeElement.querySelectorAll(".sisyphos-carousel-dot");
    (dots[2] as HTMLButtonElement).click();
    fixture.detectChanges();
    expect(fixture.componentInstance.index).toBe(2);
  });

  it("active dot has aria-selected=true and active class", () => {
    const fixture = TestBed.createComponent(Host);
    fixture.componentInstance.index = 1;
    fixture.detectChanges();
    const dots = fixture.nativeElement.querySelectorAll(".sisyphos-carousel-dot");
    expect(dots[1].getAttribute("aria-selected")).toBe("true");
    expect(dots[1].classList.contains("active")).toBe(true);
  });

  it("ArrowRight/ArrowLeft on the region navigates", () => {
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    const region = fixture.nativeElement.querySelector("[role=region]") as HTMLElement;
    region.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowRight", bubbles: true }));
    fixture.detectChanges();
    expect(fixture.componentInstance.index).toBe(1);
    region.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowLeft", bubbles: true }));
    fixture.detectChanges();
    expect(fixture.componentInstance.index).toBe(0);
  });

  it("hides arrows + dots when there's only one slide", () => {
    const fixture = TestBed.createComponent(Host);
    fixture.componentInstance.items = ["solo"];
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector(".sisyphos-carousel-arrow")).toBeNull();
    expect(fixture.nativeElement.querySelector(".sisyphos-carousel-dot")).toBeNull();
  });

  it("renders nothing when items is empty", () => {
    const fixture = TestBed.createComponent(Host);
    fixture.componentInstance.items = [];
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector(".sisyphos-carousel")).toBeNull();
  });
});

describe("Carousel autoPlay", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });
  afterEach(() => {
    vi.useRealTimers();
  });

  @Component({
    standalone: true,
    imports: [Carousel],
    template: `
      <sui-carousel
        [items]="items"
        [autoPlay]="true"
        [autoPlayInterval]="500"
        [pauseOnHover]="false"
        [index]="index"
        (indexChange)="index = $event"
      >
        <ng-template let-item
          ><span>{{ item }}</span></ng-template
        >
      </sui-carousel>
    `,
  })
  class AutoHost {
    items = ["A", "B", "C"];
    index = 0;
  }

  it("advances on the autoPlayInterval", () => {
    const fixture = TestBed.createComponent(AutoHost);
    fixture.detectChanges();
    expect(fixture.componentInstance.index).toBe(0);
    vi.advanceTimersByTime(500);
    fixture.detectChanges();
    expect(fixture.componentInstance.index).toBe(1);
    vi.advanceTimersByTime(500);
    fixture.detectChanges();
    expect(fixture.componentInstance.index).toBe(2);
  });
});
