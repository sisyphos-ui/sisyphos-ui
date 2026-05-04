import { ChangeDetectionStrategy, Component, signal } from "@angular/core";
import { Tabs, TabsList, TabsPanel, TabsTrigger } from "@sisyphos-ui/angular";

@Component({
  standalone: true,
  selector: "demo-tabs-default",
  imports: [Tabs, TabsList, TabsTrigger, TabsPanel],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <sui-tabs [(value)]="tab" variant="pill">
      <sui-tabs-list>
        <sui-tabs-trigger value="overview">Overview</sui-tabs-trigger>
        <sui-tabs-trigger value="activity">Activity</sui-tabs-trigger>
        <sui-tabs-trigger value="settings">Settings</sui-tabs-trigger>
      </sui-tabs-list>
      <sui-tabs-panel value="overview">Overview content.</sui-tabs-panel>
      <sui-tabs-panel value="activity">Activity content.</sui-tabs-panel>
      <sui-tabs-panel value="settings">Settings content.</sui-tabs-panel>
    </sui-tabs>
  `,
})
export class TabsDefaultDemo {
  protected readonly tab = signal("overview");
}
