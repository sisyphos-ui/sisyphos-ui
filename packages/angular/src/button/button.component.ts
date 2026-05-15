/**
 * Button — Angular 18 standalone primary action trigger.
 *
 * Variants, semantic colors, sizes, loading state, optional dropdown menu,
 * and polymorphic rendering as `<a>` when `href` is set. Mirrors the
 * React/Vue versions: same class names, ARIA, focus management.
 *
 * Slots are projected via attribute selectors:
 *   <sui-button>
 *     <svg button-start-icon>...</svg>
 *     Save
 *   </sui-button>
 *
 * Dropdown items pass via `[dropdownItems]`. The chevron and outside-click
 * handling are built in.
 */
import type { ElementRef } from "@angular/core";
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  HostListener,
  Input,
  Output,
  ViewChild,
  computed,
  signal,
} from "@angular/core";
import { NgTemplateOutlet } from "@angular/common";

export type ButtonVariant = "contained" | "outlined" | "text" | "soft";
export type ButtonColor = "primary" | "success" | "error" | "warning" | "info";
export type ButtonSize = "xs" | "sm" | "md" | "lg" | "xl";
export type ButtonRadius = "none" | "sm" | "md" | "lg" | "full";
export type ButtonLoadingPosition = "start" | "center" | "end";
export type ButtonDropdownPosition = "top" | "bottom";

export interface ButtonDropdownItem {
  label: string;
  onClick: () => void;
  key?: string;
}

@Component({
  selector: "sui-button",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div [class]="wrapperClasses()" #wrapper>
      @if (href()) {
        <a
          #buttonEl
          [class]="buttonClasses()"
          [attr.href]="isDisabled() ? null : href()"
          [attr.tabindex]="isDisabled() ? -1 : null"
          [attr.aria-busy]="loading() || null"
          [attr.aria-disabled]="isDisabled() || null"
          [attr.aria-label]="ariaLabel() || null"
          (click)="onClick($event)"
        >
          <ng-container *ngTemplateOutlet="contentTpl" />
        </a>
      } @else {
        <button
          #buttonEl
          [type]="type()"
          [class]="buttonClasses()"
          [disabled]="isDisabled()"
          [attr.aria-busy]="loading() || null"
          [attr.aria-disabled]="isDisabled() || null"
          [attr.aria-label]="ariaLabel() || null"
          [attr.aria-haspopup]="hasDropdown() ? 'menu' : null"
          [attr.aria-expanded]="hasDropdown() ? dropdownOpen() : null"
          (click)="onClick($event)"
        >
          <ng-container *ngTemplateOutlet="contentTpl" />
        </button>
      }

      @if (hasDropdown() && dropdownOpen()) {
        <ul [class]="dropdownClasses()" role="menu">
          @for (item of dropdownItems(); track $index) {
            <li
              class="sisyphos-button-dropdown-item"
              role="menuitem"
              tabindex="0"
              (click)="selectItem(item)"
              (keydown)="handleItemKeydown($event, item)"
            >
              {{ item.label }}
            </li>
          }
        </ul>
      }
    </div>

    <ng-template #contentTpl>
      @if (loading() && loadingPosition() === "start") {
        <ng-container *ngTemplateOutlet="spinnerTpl; context: { $implicit: 'start' }" />
      }
      @if (!loading()) {
        <span class="sisyphos-button-icon sisyphos-button-icon--start">
          <ng-content select="[button-start-icon]" />
        </span>
      }
      @if (showText()) {
        <span class="sisyphos-button-text">
          <ng-content />
        </span>
      }
      @if (loading() && loadingPosition() === "center") {
        <ng-container *ngTemplateOutlet="spinnerTpl; context: { $implicit: 'center' }" />
      }
      @if (hasDropdown()) {
        <span [class]="chevronClasses()" aria-hidden="true">
          <svg height="24" width="24" viewBox="0 0 24 24" fill="none">
            <path d="M7 10l5 5 5-5z" fill="currentColor" />
          </svg>
        </span>
      } @else {
        @if (loading() && loadingPosition() === "end") {
          <ng-container *ngTemplateOutlet="spinnerTpl; context: { $implicit: 'end' }" />
        }
        @if (!loading()) {
          <span class="sisyphos-button-icon sisyphos-button-icon--end">
            <ng-content select="[button-end-icon]" />
          </span>
        }
      }
    </ng-template>

    <ng-template #spinnerTpl let-position>
      <span
        [class]="'sisyphos-button-loading-spinner sisyphos-button-loading-spinner--' + position"
        aria-hidden="true"
      >
        <svg class="sisyphos-button-loading-spinner-svg" viewBox="0 0 24 24" fill="none">
          <circle
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-dasharray="32"
            stroke-dashoffset="12"
          />
        </svg>
      </span>
    </ng-template>
  `,
  styles: [
    `
      .sisyphos-button-icon:empty {
        display: none;
      }
    `,
  ],
  imports: [NgTemplateOutlet],
})
export class Button {
  private readonly _variant = signal<ButtonVariant>("contained");
  private readonly _color = signal<ButtonColor>("primary");
  private readonly _size = signal<ButtonSize>("md");
  private readonly _radius = signal<ButtonRadius>("md");
  private readonly _disabled = signal(false);
  private readonly _loading = signal(false);
  private readonly _loadingPosition = signal<ButtonLoadingPosition>("start");
  private readonly _fullWidth = signal(false);
  private readonly _href = signal<string | undefined>(undefined);
  private readonly _type = signal<"button" | "submit" | "reset">("button");
  private readonly _ariaLabel = signal<string | undefined>(undefined);
  private readonly _dropdownItems = signal<ButtonDropdownItem[] | undefined>(undefined);
  private readonly _dropdownPosition = signal<ButtonDropdownPosition>("bottom");
  private readonly _dropdownOpen = signal(false);

  readonly loading = this._loading.asReadonly();
  readonly loadingPosition = this._loadingPosition.asReadonly();
  readonly href = this._href.asReadonly();
  readonly type = this._type.asReadonly();
  readonly ariaLabel = this._ariaLabel.asReadonly();
  readonly dropdownItems = this._dropdownItems.asReadonly();
  readonly dropdownOpen = this._dropdownOpen.asReadonly();

  @Input("variant") set variantInput(v: ButtonVariant) {
    this._variant.set(v);
  }
  @Input("color") set colorInput(v: ButtonColor) {
    this._color.set(v);
  }
  @Input("size") set sizeInput(v: ButtonSize) {
    this._size.set(v);
  }
  @Input("radius") set radiusInput(v: ButtonRadius) {
    this._radius.set(v);
  }
  @Input("disabled") set disabledInput(v: boolean) {
    this._disabled.set(v);
  }
  @Input("loading") set loadingInput(v: boolean) {
    this._loading.set(v);
  }
  @Input("loadingPosition") set loadingPositionInput(v: ButtonLoadingPosition) {
    this._loadingPosition.set(v);
  }
  @Input("fullWidth") set fullWidthInput(v: boolean) {
    this._fullWidth.set(v);
  }
  @Input("href") set hrefInput(v: string | undefined) {
    this._href.set(v);
  }
  @Input("type") set typeInput(v: "button" | "submit" | "reset") {
    this._type.set(v);
  }
  @Input("aria-label") set ariaLabelInput(v: string | undefined) {
    this._ariaLabel.set(v);
  }
  @Input("dropdownItems") set dropdownItemsInput(v: ButtonDropdownItem[] | undefined) {
    this._dropdownItems.set(v);
  }
  @Input("dropdownPosition") set dropdownPositionInput(v: ButtonDropdownPosition) {
    this._dropdownPosition.set(v);
  }

  /** Emitted when the button is activated (excluded when it opens a dropdown). */
  @Output() readonly buttonClick = new EventEmitter<MouseEvent>();

  @ViewChild("wrapper") wrapperRef?: ElementRef<HTMLDivElement>;
  @ViewChild("buttonEl") buttonEl?: ElementRef<HTMLElement>;

  readonly isDisabled = computed(() => this._disabled() || this._loading());

  readonly hasDropdown = computed(
    () => !this._href() && !this._loading() && (this._dropdownItems()?.length ?? 0) > 0
  );

  readonly showText = computed(() => !this._loading() || this._loadingPosition() !== "center");

  readonly buttonClasses = computed(() =>
    [
      "sisyphos-button",
      this._variant(),
      this._color(),
      this._size(),
      `radius-${this._radius()}`,
      this.hasDropdown() && "with-dropdown",
      this._dropdownOpen() && "dropdown-open",
      this._loading() && "loading",
      this._fullWidth() && "full-width",
      this.isDisabled() && "disabled",
    ]
      .filter(Boolean)
      .join(" ")
  );

  readonly wrapperClasses = computed(() =>
    this.hasDropdown() ? "sisyphos-button-wrapper has-dropdown" : "sisyphos-button-wrapper"
  );

  readonly dropdownClasses = computed(() => `sisyphos-button-dropdown ${this._dropdownPosition()}`);

  readonly chevronClasses = computed(
    () =>
      `sisyphos-button-icon sisyphos-button-icon--dropdown${this._dropdownOpen() ? " open" : ""}`
  );

  onClick(event: MouseEvent): void {
    if (this.isDisabled()) {
      event.preventDefault();
      return;
    }
    if (this.hasDropdown()) {
      event.preventDefault();
      this._dropdownOpen.set(!this._dropdownOpen());
      return;
    }
    this.buttonClick.emit(event);
  }

  selectItem(item: ButtonDropdownItem): void {
    item.onClick();
    this._dropdownOpen.set(false);
    this.buttonEl?.nativeElement.focus();
  }

  handleItemKeydown(event: KeyboardEvent, item: ButtonDropdownItem): void {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      this.selectItem(item);
    }
  }

  @HostListener("document:keydown.escape")
  onEscape(): void {
    if (this._dropdownOpen()) {
      this._dropdownOpen.set(false);
      this.buttonEl?.nativeElement.focus();
    }
  }

  @HostListener("document:mousedown", ["$event"])
  onDocumentMousedown(event: MouseEvent): void {
    if (!this._dropdownOpen()) return;
    const wrapper = this.wrapperRef?.nativeElement;
    if (wrapper && !wrapper.contains(event.target as Node)) {
      this._dropdownOpen.set(false);
    }
  }
}
