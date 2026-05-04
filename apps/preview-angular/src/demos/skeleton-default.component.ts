import { ChangeDetectionStrategy, Component } from "@angular/core";
import { Skeleton } from "@sisyphos-ui/angular";

@Component({
  standalone: true,
  selector: "demo-skeleton-default",
  imports: [Skeleton],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div style="display:flex; gap:12px; align-items:center;">
      <sui-skeleton shape="circular" [width]="48" [height]="48" />
      <div style="flex:1; display:grid; gap:8px;">
        <sui-skeleton width="60%" [height]="16" />
        <sui-skeleton width="80%" [height]="14" />
        <sui-skeleton width="40%" [height]="14" />
      </div>
    </div>
  `,
})
export class SkeletonDefaultDemo {}
