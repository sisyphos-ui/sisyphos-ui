/**
 * DatePicker — Angular 18 standalone single-date or range picker with
 * optional time, min/max constraints, day/month/year views, and localized
 * weekday/month names. Mirrors the React/Vue versions feature-for-feature.
 *
 * Use `[isRange]="true"` to switch to range mode; bind via `[(value)]` for
 * single (Date | null) or `[(values)]` for range ([Date | null, Date | null]).
 */
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input as NgInput,
  OnDestroy,
  Output,
  ViewChild,
  computed,
  effect,
  signal,
} from "@angular/core";
import { computePosition, type Placement } from "@sisyphos-ui/core/internal";
import { formatDate, sameDay, withTime } from "./format";
import {
  MONTHS,
  PLACEHOLDERS,
  RANGE_LABELS,
  WEEK_DAYS,
  type DateLocale,
} from "./locale";

type ViewMode = "days" | "months" | "years";

let dpCounter = 0;

function buildCalendar(month: Date, locale: DateLocale): Date[] {
  const year = month.getFullYear();
  const m = month.getMonth();
  const firstDay = new Date(year, m, 1);
  const lastDay = new Date(year, m + 1, 0);
  const dayOfWeek = locale === "tr" ? (firstDay.getDay() + 6) % 7 : firstDay.getDay();
  const days: Date[] = [];
  for (let i = dayOfWeek - 1; i >= 0; i--) days.push(new Date(year, m, -i));
  for (let d = 1; d <= lastDay.getDate(); d++) days.push(new Date(year, m, d));
  const remaining = 7 - (days.length % 7);
  if (remaining < 7) for (let i = 1; i <= remaining; i++) days.push(new Date(year, m + 1, i));
  return days;
}

@Component({
  selector: "sui-datepicker",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div [class]="rootClasses()">
      @if (label()) {
        <label [for]="fieldId" [class]="labelClasses()">{{ label() }}</label>
      }
      <div
        #trigger
        [class]="triggerClasses()"
        (click)="openPicker()"
      >
        <span class="sisyphos-datepicker-start-icon" aria-hidden="true">
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <rect x="3" y="4" width="18" height="18" rx="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
          </svg>
        </span>
        <input
          [id]="fieldId"
          class="sisyphos-datepicker-input"
          type="text"
          readonly
          [disabled]="disabled()"
          [value]="displayValue()"
          [placeholder]="placeholder() || PLACEHOLDERS[locale()]"
          [attr.aria-invalid]="error() || null"
          aria-haspopup="dialog"
          [attr.aria-expanded]="isOpen()"
        />
        <div class="sisyphos-datepicker-end-icons">
          @if (allowClear() && hasValue() && !disabled()) {
            <button
              type="button"
              class="sisyphos-datepicker-clear"
              aria-label="Clear date"
              (click)="onClear($event)"
            >
              <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true">
                <path d="M19 6.41 17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" fill="currentColor" />
              </svg>
            </button>
          }
          <span class="sisyphos-datepicker-chevron" aria-hidden="true">
            <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"
                 [style.transform]="isOpen() ? 'rotate(180deg)' : null">
              <path d="M7 10l5 5 5-5z" fill="currentColor" />
            </svg>
          </span>
        </div>
      </div>

      @if (isOpen()) {
        <div
          #dropdown
          role="dialog"
          [attr.aria-label]="label() ?? 'Date picker'"
          class="sisyphos-datepicker-dropdown"
          [style.position]="'fixed'"
          [style.left.px]="pos()?.left ?? 0"
          [style.top.px]="pos()?.top ?? 0"
          [style.min-width.px]="pos()?.width ?? 0"
          [style.opacity]="pos() ? 1 : 0"
          [style.z-index]="1100"
        >
          <div class="sisyphos-datepicker-header">
            <button type="button" class="sisyphos-datepicker-nav" aria-label="Previous" (click)="navPrev()">‹</button>
            <button type="button" class="sisyphos-datepicker-header-title" (click)="cycleViewMode()">
              @switch (viewMode()) {
                @case ('days') { {{ MONTHS[locale()][cursor().getMonth()] }} {{ cursor().getFullYear() }} }
                @case ('months') { {{ cursor().getFullYear() }} }
                @case ('years') { {{ years()[0] }} - {{ years()[9] }} }
              }
            </button>
            <button type="button" class="sisyphos-datepicker-nav" aria-label="Next" (click)="navNext()">›</button>
          </div>

          @if (viewMode() === 'days') {
            <div class="sisyphos-datepicker-weekdays">
              @for (d of WEEK_DAYS[locale()]; track d) {
                <div class="sisyphos-datepicker-weekday">{{ d }}</div>
              }
            </div>
            <div class="sisyphos-datepicker-days">
              @for (d of calendarDays(); track $index) {
                <button
                  type="button"
                  [class]="dayClasses(d)"
                  [disabled]="isDateDisabled(d) || d.getMonth() !== cursor().getMonth()"
                  [attr.aria-selected]="isSelected(d) || null"
                  (click)="onDaySelect(d)"
                >{{ d.getDate() }}</button>
              }
            </div>
          } @else if (viewMode() === 'months') {
            <div class="sisyphos-datepicker-months">
              @for (m of MONTHS[locale()]; track m; let idx = $index) {
                <button
                  type="button"
                  [class]="'sisyphos-datepicker-month' + (idx === cursor().getMonth() ? ' selected' : '')"
                  (click)="selectMonth(idx)"
                >{{ m }}</button>
              }
            </div>
          } @else {
            <div class="sisyphos-datepicker-years">
              @for (y of years(); track y) {
                <button
                  type="button"
                  [class]="'sisyphos-datepicker-year' + (y === cursor().getFullYear() ? ' selected' : '')"
                  (click)="selectYear(y)"
                >{{ y }}</button>
              }
            </div>
          }

          @if (showTime()) {
            <div [class]="'sisyphos-datepicker-time' + (isRange() ? ' range' : '')">
              @if (isRange()) {
                <div class="sisyphos-datepicker-time-group">
                  <div class="sisyphos-datepicker-time-label">{{ RANGE_LABELS[locale()].start }}</div>
                  <div class="sisyphos-datepicker-time-row">
                    <select
                      [attr.aria-label]="RANGE_LABELS[locale()].start + ' hour'"
                      [disabled]="!rangeAt(0)"
                      [value]="rangeAt(0)?.getHours() ?? 0"
                      (change)="changeTime('start', 'hour', $event)"
                    >
                      @for (h of HOURS; track h) {
                        <option [value]="h">{{ pad(h) }}</option>
                      }
                    </select>
                    :
                    <select
                      [attr.aria-label]="RANGE_LABELS[locale()].start + ' minute'"
                      [disabled]="!rangeAt(0)"
                      [value]="rangeAt(0)?.getMinutes() ?? 0"
                      (change)="changeTime('start', 'minute', $event)"
                    >
                      @for (m of minuteOptions(); track m) {
                        <option [value]="m">{{ pad(m) }}</option>
                      }
                    </select>
                  </div>
                </div>
                <div class="sisyphos-datepicker-time-group">
                  <div class="sisyphos-datepicker-time-label">{{ RANGE_LABELS[locale()].end }}</div>
                  <div class="sisyphos-datepicker-time-row">
                    <select
                      [attr.aria-label]="RANGE_LABELS[locale()].end + ' hour'"
                      [disabled]="!rangeAt(1)"
                      [value]="rangeAt(1)?.getHours() ?? 0"
                      (change)="changeTime('end', 'hour', $event)"
                    >
                      @for (h of HOURS; track h) {
                        <option [value]="h">{{ pad(h) }}</option>
                      }
                    </select>
                    :
                    <select
                      [attr.aria-label]="RANGE_LABELS[locale()].end + ' minute'"
                      [disabled]="!rangeAt(1)"
                      [value]="rangeAt(1)?.getMinutes() ?? 0"
                      (change)="changeTime('end', 'minute', $event)"
                    >
                      @for (m of minuteOptions(); track m) {
                        <option [value]="m">{{ pad(m) }}</option>
                      }
                    </select>
                  </div>
                </div>
              } @else {
                <div class="sisyphos-datepicker-time-row">
                  <select
                    aria-label="Hour"
                    [disabled]="!singleValue()"
                    [value]="singleValue()?.getHours() ?? 0"
                    (change)="changeTime('single', 'hour', $event)"
                  >
                    @for (h of HOURS; track h) {
                      <option [value]="h">{{ pad(h) }}</option>
                    }
                  </select>
                  :
                  <select
                    aria-label="Minute"
                    [disabled]="!singleValue()"
                    [value]="singleValue()?.getMinutes() ?? 0"
                    (change)="changeTime('single', 'minute', $event)"
                  >
                    @for (m of minuteOptions(); track m) {
                      <option [value]="m">{{ pad(m) }}</option>
                    }
                  </select>
                </div>
              }
            </div>
          }
        </div>
      }

      @if (error() && errorMessage()) {
        <span class="sisyphos-datepicker-error" role="alert">{{ errorMessage() }}</span>
      }
    </div>
  `,
})
export class DatePicker implements OnDestroy {
  readonly fieldId = `sisyphos-datepicker-${++dpCounter}`;
  protected readonly MONTHS = MONTHS;
  protected readonly WEEK_DAYS = WEEK_DAYS;
  protected readonly PLACEHOLDERS = PLACEHOLDERS;
  protected readonly RANGE_LABELS = RANGE_LABELS;
  protected readonly HOURS = Array.from({ length: 24 }, (_, i) => i);
  protected readonly pad = (n: number) => String(n).padStart(2, "0");

  // ── inputs ────────────────────────────────────────────────────────────
  private readonly _label = signal<string | undefined>(undefined);
  private readonly _placeholder = signal<string | undefined>(undefined);
  private readonly _disabled = signal(false);
  private readonly _readOnly = signal(false);
  private readonly _required = signal(false);
  private readonly _error = signal(false);
  private readonly _errorMessage = signal<string | undefined>(undefined);
  private readonly _variant = signal<"standard" | "outlined">("outlined");
  private readonly _size = signal<"sm" | "md" | "lg">("md");
  private readonly _minDate = signal<Date | undefined>(undefined);
  private readonly _maxDate = signal<Date | undefined>(undefined);
  private readonly _format = signal<string | undefined>(undefined);
  private readonly _locale = signal<DateLocale>("tr");
  private readonly _showTime = signal(false);
  private readonly _minuteStep = signal(15);
  private readonly _defaultHour = signal(0);
  private readonly _defaultMinute = signal(0);
  private readonly _defaultStartHour = signal<number | undefined>(undefined);
  private readonly _defaultStartMinute = signal<number | undefined>(undefined);
  private readonly _defaultEndHour = signal<number | undefined>(undefined);
  private readonly _defaultEndMinute = signal<number | undefined>(undefined);
  private readonly _allowClear = signal(false);
  private readonly _fullWidth = signal(false);
  private readonly _placement = signal<Placement>("bottom-start");
  private readonly _isRange = signal(false);
  private readonly _value = signal<Date | null>(null);
  private readonly _values = signal<[Date | null, Date | null]>([null, null]);

  // ── internal state ───────────────────────────────────────────────────
  private readonly _isOpen = signal(false);
  private readonly _viewMode = signal<ViewMode>("days");
  private readonly _cursor = signal<Date>(new Date());
  protected readonly pos = signal<{ left: number; top: number; placement: Placement; width: number } | null>(null);

  // ── public reads ─────────────────────────────────────────────────────
  readonly label = this._label.asReadonly();
  readonly placeholder = this._placeholder.asReadonly();
  readonly disabled = this._disabled.asReadonly();
  readonly error = this._error.asReadonly();
  readonly errorMessage = this._errorMessage.asReadonly();
  readonly locale = this._locale.asReadonly();
  readonly showTime = this._showTime.asReadonly();
  readonly allowClear = this._allowClear.asReadonly();
  readonly isRange = this._isRange.asReadonly();
  readonly isOpen = this._isOpen.asReadonly();
  readonly viewMode = this._viewMode.asReadonly();
  readonly cursor = this._cursor.asReadonly();
  readonly singleValue = this._value.asReadonly();
  readonly rangeValue = this._values.asReadonly();

  @NgInput("label") set labelInput(v: string | undefined) { this._label.set(v); }
  @NgInput("placeholder") set placeholderInput(v: string | undefined) {
    this._placeholder.set(v);
  }
  @NgInput("disabled") set disabledInput(v: boolean) { this._disabled.set(v); }
  @NgInput("readOnly") set readOnlyInput(v: boolean) { this._readOnly.set(v); }
  @NgInput("required") set requiredInput(v: boolean) { this._required.set(v); }
  @NgInput("error") set errorInput(v: boolean) { this._error.set(v); }
  @NgInput("errorMessage") set errorMessageInput(v: string | undefined) {
    this._errorMessage.set(v);
  }
  @NgInput("variant") set variantInput(v: "standard" | "outlined") { this._variant.set(v); }
  @NgInput("size") set sizeInput(v: "sm" | "md" | "lg") { this._size.set(v); }
  @NgInput("minDate") set minDateInput(v: Date | undefined) { this._minDate.set(v); }
  @NgInput("maxDate") set maxDateInput(v: Date | undefined) { this._maxDate.set(v); }
  @NgInput("format") set formatInput(v: string | undefined) { this._format.set(v); }
  @NgInput("locale") set localeInput(v: DateLocale) { this._locale.set(v); }
  @NgInput("showTime") set showTimeInput(v: boolean) { this._showTime.set(v); }
  @NgInput("minuteStep") set minuteStepInput(v: number) { this._minuteStep.set(v); }
  @NgInput("defaultHour") set defaultHourInput(v: number) { this._defaultHour.set(v); }
  @NgInput("defaultMinute") set defaultMinuteInput(v: number) { this._defaultMinute.set(v); }
  @NgInput("defaultStartHour") set defaultStartHourInput(v: number | undefined) {
    this._defaultStartHour.set(v);
  }
  @NgInput("defaultStartMinute") set defaultStartMinuteInput(v: number | undefined) {
    this._defaultStartMinute.set(v);
  }
  @NgInput("defaultEndHour") set defaultEndHourInput(v: number | undefined) {
    this._defaultEndHour.set(v);
  }
  @NgInput("defaultEndMinute") set defaultEndMinuteInput(v: number | undefined) {
    this._defaultEndMinute.set(v);
  }
  @NgInput("allowClear") set allowClearInput(v: boolean) { this._allowClear.set(v); }
  @NgInput("fullWidth") set fullWidthInput(v: boolean) { this._fullWidth.set(v); }
  @NgInput("placement") set placementInput(v: Placement) { this._placement.set(v); }
  @NgInput("isRange") set isRangeInput(v: boolean) { this._isRange.set(v); }

  /** Single-mode value. */
  @NgInput("value") set valueInput(v: Date | null | undefined) {
    if (v !== undefined) {
      this._value.set(v);
      // Reset cursor to the picked month so opening the picker shows the right page.
      if (v && !this._isOpen()) this._cursor.set(new Date(v));
    }
  }
  /** Range-mode values (tuple). */
  @NgInput("values") set valuesInput(v: [Date | null, Date | null] | undefined) {
    if (v !== undefined) {
      this._values.set([v[0], v[1]]);
      if (v[0] && !this._isOpen()) this._cursor.set(new Date(v[0]));
    }
  }

  @Output() readonly valueChange = new EventEmitter<Date | null>();
  @Output() readonly valuesChange = new EventEmitter<[Date | null, Date | null]>();

  @ViewChild("trigger") triggerRef?: ElementRef<HTMLDivElement>;
  @ViewChild("dropdown") dropdownRef?: ElementRef<HTMLDivElement>;

  // ── computeds ────────────────────────────────────────────────────────
  readonly defaultFormat = computed(() => (this._showTime() ? "dd.MM.yyyy HH:mm" : "dd.MM.yyyy"));
  readonly fmt = computed(() => this._format() ?? this.defaultFormat());

  readonly displayValue = computed(() => {
    if (this._isRange()) {
      const [s, e] = this._values();
      if (s && e) return `${formatDate(s, this.fmt())} - ${formatDate(e, this.fmt())}`;
      if (s) return formatDate(s, this.fmt());
      return "";
    }
    return this._value() ? formatDate(this._value()!, this.fmt()) : "";
  });

  readonly hasValue = computed(() =>
    this._isRange() ? !!(this._values()[0] || this._values()[1]) : !!this._value()
  );

  readonly minuteOptions = computed(() => {
    const out: number[] = [];
    for (let m = 0; m < 60; m += this._minuteStep()) out.push(m);
    return out;
  });

  readonly decadeStart = computed(() => Math.floor(this._cursor().getFullYear() / 10) * 10);
  readonly years = computed(() => Array.from({ length: 10 }, (_, i) => this.decadeStart() + i));
  readonly calendarDays = computed(() => buildCalendar(this._cursor(), this._locale()));

  readonly rootClasses = computed(() =>
    [
      "sisyphos-datepicker",
      this._size(),
      this._variant(),
      this._error() && "error",
      this._disabled() && "disabled",
      this._fullWidth() && "full-width",
    ]
      .filter(Boolean)
      .join(" ")
  );

  readonly labelClasses = computed(() =>
    [
      "sisyphos-datepicker-label",
      this._error() && "error",
      this._required() && "required",
    ]
      .filter(Boolean)
      .join(" ")
  );

  readonly triggerClasses = computed(() =>
    [
      "sisyphos-datepicker-trigger",
      this._isOpen() && "focused",
    ]
      .filter(Boolean)
      .join(" ")
  );

  // ── lifecycle ────────────────────────────────────────────────────────
  private resizeListener?: () => void;
  private scrollListener?: () => void;

  constructor() {
    effect(() => {
      if (this._isOpen()) {
        queueMicrotask(() => requestAnimationFrame(() => this.reposition()));
        this.installScrollListeners();
      } else {
        this.pos.set(null);
        this._viewMode.set("days");
        this.removeScrollListeners();
      }
    });
  }

  ngOnDestroy(): void { this.removeScrollListeners(); }

  // ── trigger ──────────────────────────────────────────────────────────
  openPicker(): void {
    if (this._disabled() || this._readOnly()) return;
    this._isOpen.set(!this._isOpen());
  }

  onClear(event: MouseEvent): void {
    event.stopPropagation();
    if (this._isRange()) {
      this._values.set([null, null]);
      this.valuesChange.emit([null, null]);
    } else {
      this._value.set(null);
      this.valueChange.emit(null);
    }
  }

  // ── helpers ──────────────────────────────────────────────────────────
  rangeAt(idx: number): Date | null {
    return this._values()[idx] ?? null;
  }

  isDateDisabled(date: Date): boolean {
    const min = this._minDate();
    const max = this._maxDate();
    if (min && date < min) return true;
    if (max && date > max) return true;
    return false;
  }

  isSelected(date: Date): boolean {
    if (this._isRange()) {
      const [s, e] = this._values();
      return Boolean((s && sameDay(date, s)) || (e && sameDay(date, e)));
    }
    return this._value() ? sameDay(date, this._value()!) : false;
  }

  isInRange(date: Date): boolean {
    if (!this._isRange()) return false;
    const [s, e] = this._values();
    if (!s || !e) return false;
    return date >= s && date <= e;
  }

  dayClasses(d: Date): string {
    const inOtherMonth = d.getMonth() !== this._cursor().getMonth();
    return [
      "sisyphos-datepicker-day",
      inOtherMonth && "other-month",
      sameDay(d, new Date()) && !this.hasValue() && "today",
      this.isSelected(d) && "selected",
      this.isInRange(d) && "in-range",
      (this.isDateDisabled(d) || inOtherMonth) && "disabled",
    ]
      .filter(Boolean)
      .join(" ");
  }

  private applyDefaultTime(d: Date, target: "single" | "start" | "end"): Date {
    if (!this._showTime()) return d;
    let h = this._defaultHour();
    let m = this._defaultMinute();
    if (target === "start") {
      h = this._defaultStartHour() ?? this._defaultHour();
      m = this._defaultStartMinute() ?? this._defaultMinute();
    } else if (target === "end") {
      h = this._defaultEndHour() ?? this._defaultHour();
      m = this._defaultEndMinute() ?? this._defaultMinute();
    }
    return withTime(d, h, m);
  }

  // ── selection ────────────────────────────────────────────────────────
  onDaySelect(d: Date): void {
    if (this.isDateDisabled(d) || d.getMonth() !== this._cursor().getMonth()) return;
    if (!this._isRange()) {
      const next =
        this._showTime() && this._value()
          ? withTime(d, this._value()!.getHours(), this._value()!.getMinutes())
          : this.applyDefaultTime(d, "single");
      this._value.set(next);
      this.valueChange.emit(next);
      if (!this._showTime()) this._isOpen.set(false);
      return;
    }
    const [s, e] = this._values();
    if (!s || (s && e)) {
      const next: [Date | null, Date | null] = [this.applyDefaultTime(d, "start"), null];
      this._values.set(next);
      this.valuesChange.emit(next);
    } else if (s && !e) {
      let next: [Date | null, Date | null];
      if (d >= s) {
        next = [s, this.applyDefaultTime(d, "end")];
      } else {
        // Earlier than the existing start — flip the range.
        next = [this.applyDefaultTime(d, "start"), s];
      }
      this._values.set(next);
      this.valuesChange.emit(next);
      if (!this._showTime()) this._isOpen.set(false);
    }
  }

  changeTime(target: "single" | "start" | "end", which: "hour" | "minute", event: Event): void {
    const val = Number((event.target as HTMLSelectElement).value);
    if (target === "single") {
      const v = this._value();
      if (!v) return;
      const h = which === "hour" ? val : v.getHours();
      const m = which === "minute" ? val : v.getMinutes();
      const next = withTime(v, h, m);
      this._value.set(next);
      this.valueChange.emit(next);
    } else if (target === "start") {
      const s = this._values()[0];
      if (!s) return;
      const h = which === "hour" ? val : s.getHours();
      const m = which === "minute" ? val : s.getMinutes();
      const next: [Date | null, Date | null] = [withTime(s, h, m), this._values()[1]];
      this._values.set(next);
      this.valuesChange.emit(next);
    } else {
      const e = this._values()[1];
      if (!e) return;
      const h = which === "hour" ? val : e.getHours();
      const m = which === "minute" ? val : e.getMinutes();
      const next: [Date | null, Date | null] = [this._values()[0], withTime(e, h, m)];
      this._values.set(next);
      this.valuesChange.emit(next);
    }
  }

  // ── view navigation ──────────────────────────────────────────────────
  navPrev(): void {
    const c = this._cursor();
    if (this._viewMode() === "days") this._cursor.set(new Date(c.getFullYear(), c.getMonth() - 1));
    else if (this._viewMode() === "months") this._cursor.set(new Date(c.getFullYear() - 1, c.getMonth()));
    else this._cursor.set(new Date(c.getFullYear() - 10, c.getMonth()));
  }

  navNext(): void {
    const c = this._cursor();
    if (this._viewMode() === "days") this._cursor.set(new Date(c.getFullYear(), c.getMonth() + 1));
    else if (this._viewMode() === "months") this._cursor.set(new Date(c.getFullYear() + 1, c.getMonth()));
    else this._cursor.set(new Date(c.getFullYear() + 10, c.getMonth()));
  }

  cycleViewMode(): void {
    if (this._viewMode() === "days") this._viewMode.set("months");
    else if (this._viewMode() === "months") this._viewMode.set("years");
  }

  selectMonth(idx: number): void {
    const c = this._cursor();
    this._cursor.set(new Date(c.getFullYear(), idx));
    this._viewMode.set("days");
  }

  selectYear(y: number): void {
    const c = this._cursor();
    this._cursor.set(new Date(y, c.getMonth()));
    this._viewMode.set("months");
  }

  // ── outside-click + escape ───────────────────────────────────────────
  @HostListener("document:keydown.escape")
  onEscape(): void {
    if (this._isOpen()) this._isOpen.set(false);
  }

  @HostListener("document:mousedown", ["$event"])
  onDocumentMousedown(event: MouseEvent): void {
    if (!this._isOpen()) return;
    const tgt = event.target as Node | null;
    if (this.triggerRef?.nativeElement.contains(tgt as Node)) return;
    if (this.dropdownRef?.nativeElement.contains(tgt as Node)) return;
    this._isOpen.set(false);
  }

  // ── positioning ──────────────────────────────────────────────────────
  private reposition(): void {
    const anchor = this.triggerRef?.nativeElement;
    const dropdown = this.dropdownRef?.nativeElement;
    if (!anchor || !dropdown) return;
    const a = anchor.getBoundingClientRect();
    const size = { width: dropdown.offsetWidth, height: dropdown.offsetHeight };
    const p = computePosition(a, size, this._placement(), 4);
    this.pos.set({ ...p, width: a.width });
  }

  private installScrollListeners(): void {
    this.scrollListener = () => this.reposition();
    this.resizeListener = () => this.reposition();
    window.addEventListener("scroll", this.scrollListener, true);
    window.addEventListener("resize", this.resizeListener);
  }

  private removeScrollListeners(): void {
    if (this.scrollListener) {
      window.removeEventListener("scroll", this.scrollListener, true);
      this.scrollListener = undefined;
    }
    if (this.resizeListener) {
      window.removeEventListener("resize", this.resizeListener);
      this.resizeListener = undefined;
    }
  }
}
