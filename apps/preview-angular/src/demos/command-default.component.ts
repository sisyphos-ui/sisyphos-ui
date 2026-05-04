import { ChangeDetectionStrategy, Component } from "@angular/core";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@sisyphos-ui/angular";

@Component({
  standalone: true,
  selector: "demo-command-default",
  imports: [Command, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div style="max-width: 360px;">
      <sui-command label="Command menu">
        <sui-command-input placeholder="Type a command…" />
        <sui-command-list>
          <sui-command-empty>No results.</sui-command-empty>
          <sui-command-group heading="Suggestions">
            <sui-command-item value="new-file">New file</sui-command-item>
            <sui-command-item value="open-recent">Open recent…</sui-command-item>
            <sui-command-item value="theme">Toggle theme</sui-command-item>
          </sui-command-group>
        </sui-command-list>
      </sui-command>
    </div>
  `,
})
export class CommandDefaultDemo {}
