import { ChangeDetectionStrategy, Component } from "@angular/core";
import { Card, CardBody, CardFooter, CardHeader } from "@sisyphos-ui/angular";

@Component({
  standalone: true,
  selector: "demo-card-default",
  imports: [Card, CardHeader, CardBody, CardFooter],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <sui-card style="max-width:360px">
      <sui-card-header>Profile</sui-card-header>
      <sui-card-body>Welcome back, Volkan.</sui-card-body>
      <sui-card-footer>Updated 5 minutes ago</sui-card-footer>
    </sui-card>
  `,
})
export class CardDefaultDemo {}
