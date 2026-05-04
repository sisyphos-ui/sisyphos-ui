import { ChangeDetectionStrategy, Component, signal } from "@angular/core";
import { DatePicker } from "@sisyphos-ui/angular";

@Component({
  standalone: true,
  selector: "demo-datepicker-default",
  imports: [DatePicker],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<sui-datepicker label="Birthday" [(value)]="date" />`,
})
export class DatepickerDefaultDemo {
  protected readonly date = signal<Date | null>(new Date());
}
