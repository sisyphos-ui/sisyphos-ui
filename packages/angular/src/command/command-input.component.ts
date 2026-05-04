/**
 * CommandInput — searchbox with arrow-key navigation that drives the parent
 * Command's active item.
 */
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  inject,
  signal,
} from "@angular/core";
import { CommandCtx } from "./context";

@Component({
  selector: "sui-command-input",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <input
      [id]="ctx.inputId()"
      class="sisyphos-command-input"
      type="text"
      autocomplete="off"
      autocorrect="off"
      [spellcheck]="false"
      role="searchbox"
      aria-autocomplete="list"
      [attr.aria-controls]="ctx.listId()"
      [attr.aria-activedescendant]="ctx.activeId() || null"
      [value]="ctx.search()"
      [placeholder]="placeholder()"
      (input)="onInput($event)"
      (keydown)="onKeydown($event)"
    />
  `,
})
export class CommandInput {
  protected readonly ctx = inject(CommandCtx);

  private readonly _placeholder = signal<string>("Type a command or search…");
  readonly placeholder = this._placeholder.asReadonly();

  @Input("placeholder") set placeholderInput(v: string) { this._placeholder.set(v); }

  onInput(event: Event): void {
    this.ctx.setSearch((event.target as HTMLInputElement).value);
  }

  onKeydown(event: KeyboardEvent): void {
    const ids = this.ctx.matchedIds();
    if (event.key === "ArrowDown") {
      event.preventDefault();
      this.move(1, ids);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      this.move(-1, ids);
    } else if (event.key === "Home") {
      event.preventDefault();
      if (ids.length) this.ctx.setActiveId(ids[0]!);
    } else if (event.key === "End") {
      event.preventDefault();
      if (ids.length) this.ctx.setActiveId(ids[ids.length - 1]!);
    } else if (event.key === "Enter" && this.ctx.activeId()) {
      event.preventDefault();
      this.ctx.selectItem(this.ctx.activeId()!);
    }
  }

  private move(dir: 1 | -1, ids: string[]): void {
    if (ids.length === 0) return;
    const curr = this.ctx.activeId();
    const idx = curr ? ids.indexOf(curr) : -1;
    const next =
      idx === -1
        ? dir === 1
          ? ids[0]!
          : ids[ids.length - 1]!
        : ids[(idx + dir + ids.length) % ids.length]!;
    this.ctx.setActiveId(next);
  }
}
