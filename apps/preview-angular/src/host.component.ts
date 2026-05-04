import {
  ChangeDetectionStrategy,
  Component,
  Type,
  ViewChild,
  ViewContainerRef,
  signal,
} from "@angular/core";
import { CommonModule } from "@angular/common";
import { DEMOS } from "./demos/registry";

/**
 * Iframe host that reads `?demo=<slug>` from the URL and dynamically
 * mounts the matching standalone demo component into a `ViewContainerRef`.
 * Falls back to a "coming soon" message when the slug is unknown.
 */
@Component({
  standalone: true,
  selector: "preview-host",
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (!demoType()) {
      <div class="empty-demo">
        @if (slug()) {
          Angular preview for "{{ slug() }}" is coming soon.
        } @else {
          Pass a ?demo=&lt;slug&gt; query parameter to render an Angular demo.
        }
      </div>
    }
    <ng-container #demoOutlet />
  `,
})
export class HostComponent {
  protected readonly slug = signal<string>("");
  protected readonly demoType = signal<Type<unknown> | null>(null);

  @ViewChild("demoOutlet", { read: ViewContainerRef, static: true })
  demoOutlet!: ViewContainerRef;

  ngOnInit(): void {
    const params = new URLSearchParams(window.location.search);
    const s = params.get("demo") ?? "";
    this.slug.set(s);
    const cmp = DEMOS[s] ?? null;
    this.demoType.set(cmp);
    if (cmp) {
      this.demoOutlet.createComponent(cmp);
    }
  }
}
