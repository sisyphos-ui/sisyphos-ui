import { ChangeDetectionStrategy, Component } from "@angular/core";
import { Textarea } from "@sisyphos-ui/angular";

@Component({
  standalone: true,
  selector: "demo-textarea-default",
  imports: [Textarea],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <sui-textarea
      label="Bio"
      placeholder="Tell us a bit about yourself…"
      [maxLength]="140"
      [showCharacterCount]="true"
    />
  `,
})
export class TextareaDefaultDemo {}
