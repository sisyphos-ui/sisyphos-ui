import { ChangeDetectionStrategy, Component } from "@angular/core";
import { Carousel } from "@sisyphos-ui/angular";

interface Slide {
  bg: string;
  label: string;
}

@Component({
  standalone: true,
  selector: "demo-carousel-default",
  imports: [Carousel],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div style="max-width: 480px;">
      <sui-carousel [items]="slides">
        <ng-template let-slide>
          <div
            [style.background]="slide.bg"
            style="display:grid; place-items:center; height:160px; color:white; border-radius:12px; font-weight:600; font-size:18px;"
          >
            {{ slide.label }}
          </div>
        </ng-template>
      </sui-carousel>
    </div>
  `,
})
export class CarouselDefaultDemo {
  protected readonly slides: Slide[] = [
    { bg: "linear-gradient(135deg,#ff7022,#ff9a58)", label: "Slide 1 · React, Vue & Angular" },
    { bg: "linear-gradient(135deg,#22c55e,#4ade80)", label: "Slide 2 · One design system" },
    { bg: "linear-gradient(135deg,#06b6d4,#67e8f9)", label: "Slide 3 · Themeable at runtime" },
  ];
}
