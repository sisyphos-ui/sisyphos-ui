import { ChangeDetectionStrategy, Component } from "@angular/core";
import { FormControl, FormHelperText, FormLabel, Input } from "@sisyphos-ui/angular";

@Component({
  standalone: true,
  selector: "demo-form-control-default",
  imports: [FormControl, FormLabel, FormHelperText, Input],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <sui-form-control>
      <sui-form-label>Email</sui-form-label>
      <sui-input type="email" placeholder="name@example.com" />
      <sui-form-helper-text>We'll never share your email.</sui-form-helper-text>
    </sui-form-control>
  `,
})
export class FormControlDefaultDemo {}
