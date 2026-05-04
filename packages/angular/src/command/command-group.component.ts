import {
  ChangeDetectionStrategy,
  Component,
  Input,
  signal,
} from "@angular/core";

@Component({
  selector: "sui-command-group",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="sisyphos-command-group" role="group">
      @if (heading()) {
        <div class="sisyphos-command-group-heading">{{ heading() }}</div>
      }
      <div class="sisyphos-command-group-items">
        <ng-content />
      </div>
    </div>
  `,
})
export class CommandGroup {
  private readonly _heading = signal<string | undefined>(undefined);
  readonly heading = this._heading.asReadonly();

  @Input("heading") set headingInput(v: string | undefined) { this._heading.set(v); }
}
