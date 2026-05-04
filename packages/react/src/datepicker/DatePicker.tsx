/**
 * DatePicker — single-date or range picker with optional time, `min`/`max`
 * constraints, day/month/year views, and localized weekday and month names.
 *
 * The calendar dropdown is portal-mounted with auto-flip placement. Set
 * `isRange` to switch between single-date and range modes.
 */
import type React from "react";
import { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
import { Portal } from "@sisyphos-ui/portal";
import { cx, computePosition, useEscapeKey, type Placement } from "@sisyphos-ui/core/internal";
import { WEEK_DAYS, MONTHS, PLACEHOLDERS, RANGE_LABELS, type DateLocale } from "./locale";
import { formatDate, sameDay, withTime } from "./format";
import "./DatePicker.scss";

type SingleValue = Date | null;
type RangeValue = [Date | null, Date | null];

type SingleProps = {
  isRange?: false;
  value?: SingleValue;
  onChange?: (value: SingleValue) => void;
};
type RangeProps = {
  isRange: true;
  value?: RangeValue;
  onChange?: (value: RangeValue) => void;
};

type ViewMode = "days" | "months" | "years";

export type DatePickerProps = {
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  readOnly?: boolean;
  required?: boolean;
  error?: boolean;
  errorMessage?: string;
  variant?: "standard" | "outlined";
  size?: "sm" | "md" | "lg";
  minDate?: Date;
  maxDate?: Date;
  /** Format for the trigger input. Supports yyyy/MM/dd/HH/mm. Defaults to `dd.MM.yyyy` (or with time). */
  format?: string;
  locale?: DateLocale;
  showTime?: boolean;
  /** Minute increments in the time picker. Default 15. */
  minuteStep?: number;
  /**
   * Default hour applied when the user picks a date for the first time in
   * `showTime` mode. Avoids the "always lands on 00:00" footgun. Defaults to 0.
   */
  defaultHour?: number;
  /** Default minute applied alongside `defaultHour`. Defaults to 0. */
  defaultMinute?: number;
  /** Range mode: default hour for the start date. Falls back to `defaultHour`. */
  defaultStartHour?: number;
  /** Range mode: default minute for the start date. Falls back to `defaultMinute`. */
  defaultStartMinute?: number;
  /** Range mode: default hour for the end date. Falls back to `defaultHour`. */
  defaultEndHour?: number;
  /** Range mode: default minute for the end date. Falls back to `defaultMinute`. */
  defaultEndMinute?: number;
  allowClear?: boolean;
  fullWidth?: boolean;
  className?: string;
  /** Override the default calendar icon. */
  calendarIcon?: React.ReactNode;
  placement?: Placement;
} & (SingleProps | RangeProps);

const CalendarIcon = () => (
  <svg
    viewBox="0 0 24 24"
    width="20"
    height="20"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <rect x="3" y="4" width="18" height="18" rx="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);

const ChevronIcon = ({ rotated }: { rotated?: boolean }) => (
  <svg
    viewBox="0 0 24 24"
    width="16"
    height="16"
    aria-hidden="true"
    style={{ transform: rotated ? "rotate(180deg)" : undefined }}
  >
    <path d="M7 10l5 5 5-5z" fill="currentColor" />
  </svg>
);

const ClearIcon = () => (
  <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true">
    <path
      d="M19 6.41 17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"
      fill="currentColor"
    />
  </svg>
);

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

export const DatePicker: React.FC<DatePickerProps> = (props) => {
  const {
    label,
    placeholder,
    disabled = false,
    readOnly = false,
    required = false,
    error = false,
    errorMessage,
    variant = "outlined",
    size = "md",
    minDate,
    maxDate,
    locale = "tr",
    showTime = false,
    minuteStep = 15,
    defaultHour = 0,
    defaultMinute = 0,
    defaultStartHour,
    defaultStartMinute,
    defaultEndHour,
    defaultEndMinute,
    allowClear = false,
    fullWidth = false,
    className,
    calendarIcon,
    placement = "bottom-start",
    isRange,
  } = props;

  const defaultFormat = showTime ? "dd.MM.yyyy HH:mm" : "dd.MM.yyyy";
  const format = props.format ?? defaultFormat;

  const reactId = useId();
  const fieldId = `sisyphos-datepicker-${reactId}`;

  const value = props.value;
  const singleValue = !isRange ? ((value as SingleValue | undefined) ?? null) : null;
  const rangeValue: RangeValue = isRange
    ? ((value as RangeValue | undefined) ?? [null, null])
    : [null, null];

  const emitSingle = (v: SingleValue) =>
    (props.onChange as ((v: SingleValue) => void) | undefined)?.(v);
  const emitRange = (v: RangeValue) =>
    (props.onChange as ((v: RangeValue) => void) | undefined)?.(v);

  const [isOpen, setIsOpen] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>("days");
  const [cursor, setCursor] = useState<Date>(
    () => (isRange ? rangeValue[0] : singleValue) ?? new Date()
  );

  const triggerRef = useRef<HTMLDivElement | null>(null);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const [pos, setPos] = useState<{
    left: number;
    top: number;
    placement: Placement;
    width: number;
  } | null>(null);

  useEscapeKey(() => setIsOpen(false), isOpen);

  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: MouseEvent) => {
      const tgt = e.target as Node | null;
      if (!tgt) return;
      if (triggerRef.current?.contains(tgt)) return;
      if (dropdownRef.current?.contains(tgt)) return;
      setIsOpen(false);
      setViewMode("days");
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) {
      setPos(null);
      return;
    }
    let raf = 0;
    const update = () => {
      const anchor = triggerRef.current;
      const dd = dropdownRef.current;
      if (!anchor || !dd) return;
      const a = anchor.getBoundingClientRect();
      const size = { width: dd.offsetWidth, height: dd.offsetHeight };
      const p = computePosition(a, size, placement, 4);
      setPos({ ...p, width: a.width });
    };
    raf = requestAnimationFrame(() => requestAnimationFrame(update));
    const onWin = () => update();
    window.addEventListener("scroll", onWin, true);
    window.addEventListener("resize", onWin);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onWin, true);
      window.removeEventListener("resize", onWin);
    };
  }, [isOpen, placement]);

  const displayValue = useMemo(() => {
    if (isRange) {
      const [s, e] = rangeValue;
      if (s && e) return `${formatDate(s, format)} - ${formatDate(e, format)}`;
      if (s) return formatDate(s, format);
      return "";
    }
    return singleValue ? formatDate(singleValue, format) : "";
  }, [isRange, singleValue, rangeValue, format]);

  const hasValue = isRange ? Boolean(rangeValue[0] || rangeValue[1]) : Boolean(singleValue);

  const openPicker = () => {
    if (disabled || readOnly) return;
    setIsOpen((prev) => !prev);
    setViewMode("days");
  };

  const clear = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      if (isRange) emitRange([null, null]);
      else emitSingle(null);
    },
    [isRange]
  );

  const isDateDisabled = useCallback(
    (date: Date) => {
      if (minDate && date < minDate) return true;
      if (maxDate && date > maxDate) return true;
      return false;
    },
    [minDate, maxDate]
  );

  const isSelected = useCallback(
    (date: Date) => {
      if (isRange) {
        const [s, e] = rangeValue;
        return (s && sameDay(date, s)) || (e && sameDay(date, e));
      }
      return singleValue ? sameDay(date, singleValue) : false;
    },
    [isRange, rangeValue, singleValue]
  );

  const isInRange = useCallback(
    (date: Date) => {
      if (!isRange) return false;
      const [s, e] = rangeValue;
      if (!s || !e) return false;
      return date >= s && date <= e;
    },
    [isRange, rangeValue]
  );

  /**
   * Apply the configured default time when the user picks a date for the
   * first time in `showTime` mode. Once a date already has a user-edited
   * time we keep it intact.
   */
  const applyDefaultTime = useCallback(
    (d: Date, target: "single" | "start" | "end"): Date => {
      if (!showTime) return d;
      let h = defaultHour;
      let m = defaultMinute;
      if (target === "start") {
        h = defaultStartHour ?? defaultHour;
        m = defaultStartMinute ?? defaultMinute;
      } else if (target === "end") {
        h = defaultEndHour ?? defaultHour;
        m = defaultEndMinute ?? defaultMinute;
      }
      return withTime(d, h, m);
    },
    [
      showTime,
      defaultHour,
      defaultMinute,
      defaultStartHour,
      defaultStartMinute,
      defaultEndHour,
      defaultEndMinute,
    ]
  );

  const handleDaySelect = (d: Date) => {
    if (isDateDisabled(d)) return;
    if (!isRange) {
      const next =
        showTime && singleValue
          ? withTime(d, singleValue.getHours(), singleValue.getMinutes())
          : applyDefaultTime(d, "single");
      emitSingle(next);
      if (!showTime) setIsOpen(false);
      return;
    }
    const [s, e] = rangeValue;
    if (!s || (s && e)) {
      emitRange([applyDefaultTime(d, "start"), null]);
    } else if (s && !e) {
      if (d >= s) {
        emitRange([s, applyDefaultTime(d, "end")]);
      } else {
        // User picked a date earlier than the existing start — flip the range.
        // The previous start keeps its (possibly edited) time and becomes the
        // end; the freshly picked date receives the default start time.
        emitRange([applyDefaultTime(d, "start"), s]);
      }
      if (!showTime) setIsOpen(false);
    }
  };

  const handleTimeChange = (
    target: "single" | "start" | "end",
    which: "hour" | "minute",
    val: number
  ) => {
    if (target === "single") {
      if (!singleValue) return;
      const h = which === "hour" ? val : singleValue.getHours();
      const m = which === "minute" ? val : singleValue.getMinutes();
      emitSingle(withTime(singleValue, h, m));
    } else if (target === "start") {
      const s = rangeValue[0];
      if (!s) return;
      const h = which === "hour" ? val : s.getHours();
      const m = which === "minute" ? val : s.getMinutes();
      emitRange([withTime(s, h, m), rangeValue[1]]);
    } else {
      const e = rangeValue[1];
      if (!e) return;
      const h = which === "hour" ? val : e.getHours();
      const m = which === "minute" ? val : e.getMinutes();
      emitRange([rangeValue[0], withTime(e, h, m)]);
    }
  };

  const minuteOptions = useMemo(() => {
    const out: number[] = [];
    for (let m = 0; m < 60; m += minuteStep) out.push(m);
    return out;
  }, [minuteStep]);

  const decadeStart = Math.floor(cursor.getFullYear() / 10) * 10;
  const years = Array.from({ length: 10 }, (_, i) => decadeStart + i);

  const calendarDays = useMemo(() => buildCalendar(cursor, locale), [cursor, locale]);

  const nav = {
    prev: () => {
      if (viewMode === "days") setCursor(new Date(cursor.getFullYear(), cursor.getMonth() - 1));
      else if (viewMode === "months")
        setCursor(new Date(cursor.getFullYear() - 1, cursor.getMonth()));
      else setCursor(new Date(cursor.getFullYear() - 10, cursor.getMonth()));
    },
    next: () => {
      if (viewMode === "days") setCursor(new Date(cursor.getFullYear(), cursor.getMonth() + 1));
      else if (viewMode === "months")
        setCursor(new Date(cursor.getFullYear() + 1, cursor.getMonth()));
      else setCursor(new Date(cursor.getFullYear() + 10, cursor.getMonth()));
    },
  };

  return (
    <div
      className={cx(
        "sisyphos-datepicker",
        size,
        variant,
        error && "error",
        disabled && "disabled",
        fullWidth && "full-width",
        className
      )}
    >
      {label && (
        <label
          htmlFor={fieldId}
          className={cx("sisyphos-datepicker-label", error && "error", required && "required")}
        >
          {label}
        </label>
      )}
      <div
        ref={triggerRef}
        className={cx("sisyphos-datepicker-trigger", isOpen && "focused")}
        onClick={openPicker}
      >
        <span className="sisyphos-datepicker-start-icon" aria-hidden="true">
          {calendarIcon ?? <CalendarIcon />}
        </span>
        <input
          id={fieldId}
          className="sisyphos-datepicker-input"
          type="text"
          readOnly
          disabled={disabled}
          value={displayValue}
          placeholder={placeholder ?? PLACEHOLDERS[locale]}
          aria-invalid={error || undefined}
          aria-haspopup="dialog"
          aria-expanded={isOpen}
        />
        <div className="sisyphos-datepicker-end-icons">
          {allowClear && hasValue && !disabled && (
            <button
              type="button"
              className="sisyphos-datepicker-clear"
              onClick={clear}
              aria-label="Clear date"
            >
              <ClearIcon />
            </button>
          )}
          <span className="sisyphos-datepicker-chevron" aria-hidden="true">
            <ChevronIcon rotated={isOpen} />
          </span>
        </div>
      </div>

      {isOpen && (
        <Portal>
          <div
            ref={dropdownRef}
            role="dialog"
            aria-label={label ?? "Date picker"}
            className="sisyphos-datepicker-dropdown"
            style={{
              position: "fixed",
              left: pos?.left ?? 0,
              top: pos?.top ?? 0,
              minWidth: pos?.width ?? 0,
              opacity: pos ? 1 : 0,
            }}
          >
            <div className="sisyphos-datepicker-header">
              <button
                type="button"
                className="sisyphos-datepicker-nav"
                onClick={nav.prev}
                aria-label="Previous"
              >
                ‹
              </button>
              <button
                type="button"
                className="sisyphos-datepicker-header-title"
                onClick={() =>
                  setViewMode((m) => (m === "days" ? "months" : m === "months" ? "years" : "years"))
                }
              >
                {viewMode === "days" &&
                  `${MONTHS[locale][cursor.getMonth()]} ${cursor.getFullYear()}`}
                {viewMode === "months" && cursor.getFullYear()}
                {viewMode === "years" && `${years[0]} - ${years[9]}`}
              </button>
              <button
                type="button"
                className="sisyphos-datepicker-nav"
                onClick={nav.next}
                aria-label="Next"
              >
                ›
              </button>
            </div>

            {viewMode === "days" && (
              <>
                <div className="sisyphos-datepicker-weekdays">
                  {WEEK_DAYS[locale].map((d) => (
                    <div key={d} className="sisyphos-datepicker-weekday">
                      {d}
                    </div>
                  ))}
                </div>
                <div className="sisyphos-datepicker-days">
                  {calendarDays.map((d, i) => {
                    const other = d.getMonth() !== cursor.getMonth();
                    const selected = isSelected(d);
                    const inRange = isInRange(d);
                    const isToday = sameDay(d, new Date());
                    const dis = isDateDisabled(d) || other;
                    return (
                      <button
                        key={i}
                        type="button"
                        className={cx(
                          "sisyphos-datepicker-day",
                          other && "other-month",
                          isToday && !hasValue && "today",
                          selected && "selected",
                          inRange && "in-range",
                          dis && "disabled"
                        )}
                        disabled={dis}
                        onClick={() => handleDaySelect(d)}
                        aria-selected={selected || undefined}
                      >
                        {d.getDate()}
                      </button>
                    );
                  })}
                </div>
              </>
            )}

            {viewMode === "months" && (
              <div className="sisyphos-datepicker-months">
                {MONTHS[locale].map((m, idx) => (
                  <button
                    key={m}
                    type="button"
                    className={cx(
                      "sisyphos-datepicker-month",
                      idx === cursor.getMonth() && "selected"
                    )}
                    onClick={() => {
                      setCursor(new Date(cursor.getFullYear(), idx));
                      setViewMode("days");
                    }}
                  >
                    {m}
                  </button>
                ))}
              </div>
            )}

            {viewMode === "years" && (
              <div className="sisyphos-datepicker-years">
                {years.map((y) => (
                  <button
                    key={y}
                    type="button"
                    className={cx(
                      "sisyphos-datepicker-year",
                      y === cursor.getFullYear() && "selected"
                    )}
                    onClick={() => {
                      setCursor(new Date(y, cursor.getMonth()));
                      setViewMode("months");
                    }}
                  >
                    {y}
                  </button>
                ))}
              </div>
            )}

            {showTime && (
              <div className={cx("sisyphos-datepicker-time", isRange && "range")}>
                {isRange ? (
                  (["start", "end"] as const).map((which, i) => {
                    const v = rangeValue[i];
                    const h = v?.getHours() ?? 0;
                    const m = v?.getMinutes() ?? 0;
                    return (
                      <div key={which} className="sisyphos-datepicker-time-group">
                        <div className="sisyphos-datepicker-time-label">
                          {RANGE_LABELS[locale][which]}
                        </div>
                        <div className="sisyphos-datepicker-time-row">
                          <select
                            aria-label={`${RANGE_LABELS[locale][which]} hour`}
                            disabled={!v}
                            value={h}
                            onChange={(e) =>
                              handleTimeChange(which, "hour", Number(e.target.value))
                            }
                          >
                            {Array.from({ length: 24 }).map((_, idx) => (
                              <option key={idx} value={idx}>
                                {String(idx).padStart(2, "0")}
                              </option>
                            ))}
                          </select>
                          :
                          <select
                            aria-label={`${RANGE_LABELS[locale][which]} minute`}
                            disabled={!v}
                            value={m}
                            onChange={(e) =>
                              handleTimeChange(which, "minute", Number(e.target.value))
                            }
                          >
                            {minuteOptions.map((mm) => (
                              <option key={mm} value={mm}>
                                {String(mm).padStart(2, "0")}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="sisyphos-datepicker-time-row">
                    <select
                      aria-label="Hour"
                      disabled={!singleValue}
                      value={singleValue?.getHours() ?? 0}
                      onChange={(e) => handleTimeChange("single", "hour", Number(e.target.value))}
                    >
                      {Array.from({ length: 24 }).map((_, idx) => (
                        <option key={idx} value={idx}>
                          {String(idx).padStart(2, "0")}
                        </option>
                      ))}
                    </select>
                    :
                    <select
                      aria-label="Minute"
                      disabled={!singleValue}
                      value={singleValue?.getMinutes() ?? 0}
                      onChange={(e) => handleTimeChange("single", "minute", Number(e.target.value))}
                    >
                      {minuteOptions.map((mm) => (
                        <option key={mm} value={mm}>
                          {String(mm).padStart(2, "0")}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
            )}
          </div>
        </Portal>
      )}

      {error && errorMessage && (
        <span className="sisyphos-datepicker-error" role="alert">
          {errorMessage}
        </span>
      )}
    </div>
  );
};
