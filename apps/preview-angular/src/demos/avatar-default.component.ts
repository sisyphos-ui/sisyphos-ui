import { ChangeDetectionStrategy, Component } from "@angular/core";
import { Avatar } from "@sisyphos-ui/angular";

@Component({
  standalone: true,
  selector: "demo-avatar-default",
  imports: [Avatar],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div style="display:flex;gap:8px">
      <sui-avatar name="Volkan Günay" color="primary" />
      <sui-avatar name="Ada Lovelace" color="info" />
      <sui-avatar name="Grace Hopper" color="success" />
    </div>
  `,
})
export class AvatarDefaultDemo {}
