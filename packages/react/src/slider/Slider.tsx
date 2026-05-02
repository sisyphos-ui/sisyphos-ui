/**
 * Slider — accessible single-thumb or range slider with mouse, touch, and
 * keyboard support (Arrow/Page/Home/End keys).
 *
 * Pass `range` for two-thumb mode; then `value`/`defaultValue` become tuples.
 */
import type React from "react";
import { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
import { cx } from "@sisyphos-ui/core/internal";
import type { SemanticColor } from "@sisyphos-ui/core/internal";
import "./Slider.scss";

type SingleProps = {
  value?: number;
  defaultValue?: number;
  onChange?: (value: number) => void;
};
type RangeProps = {
  range: true;
  value?: [number, number];
  defaultValue?: [number, number];
  onChange?: (value: [number, number]) => void;
  /** Minimum gap between the two thumbs in range mode. Default 0. */
  minGap?: number;
};

export type SliderProps = {
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
  size?: "sm" | "md" | "lg";
  color?: SemanticColor;
  /** Show value labels above the thumbs. */
  showValue?: boolean;
  /** Format the value label. Default `String`. */
  formatValue?: (value: number) => string;
  /** Accessible label(s). Single: string. Range: [string, string]. */
  ariaLabel?: string | [string, string];
  className?: string;
  range?: boolean;
  /**
   * In range mode, render two editable number inputs alongside the track for
   * precise value entry.
   */
  withInputs?: boolean;
  /** Placeholder/label for the lower-bound input. */
  minInputLabel?: React.ReactNode;
  /** Placeholder/label for the upper-bound input. */
  maxInputLabel?: React.ReactNode;
} & (SingleProps | RangeProps);

function clamp(n: number, lo: number, hi: number) {
  return Math.max(lo, Math.min(hi, n));
}

function snap(value: number, min: number, step: number) {
  return Math.round((value - min) / step) * step + min;
}

export const Slider: React.FC<SliderProps> = (props) => {
  const {
    min = 0,
    max = 100,
    step = 1,
    disabled = false,
    size = "md",
    color = "primary",
    showValue = false,
    formatValue = String,
    ariaLabel,
    className,
    range,
    withInputs = false,
    minInputLabel = "Min",
    maxInputLabel = "Max",
  } = props;

  const reactId = useId();
  const labelIds = [`${reactId}-thumb-0`, `${reactId}-thumb-1`];

  const isControlled = (props as { value?: unknown }).value !== undefined;
  const initial = useMemo<[number, number]>(() => {
    if (range) {
      const v = (props as RangeProps).defaultValue ?? [min, max];
      return [v[0], v[1]];
    }
    const v = (props as SingleProps).defaultValue ?? min;
    return [v, v];
  }, [range, props, min, max]);

  const [internal, setInternal] = useState<[number, number]>(initial);
  const externalRange = range
    ? ((props as RangeProps).value as [number, number] | undefined)
    : undefined;
  const externalSingle = !range ? ((props as SingleProps).value as number | undefined) : undefined;

  const current: [number, number] = useMemo(() => {
    if (range) return externalRange ?? internal;
    const v = externalSingle ?? internal[0];
    return [v, v];
  }, [range, externalRange, externalSingle, internal]);

  const minGap = range ? ((props as RangeProps).minGap ?? 0) : 0;

  const trackRef = useRef<HTMLDivElement | null>(null);
  const dragRef = useRef<0 | 1 | null>(null);

  const emit = useCallback(
    (next: [number, number]) => {
      if (!isControlled) setInternal(next);
      if (range) (props.onChange as ((v: [number, number]) => void) | undefined)?.(next);
      else (props.onChange as ((v: number) => void) | undefined)?.(next[0]);
    },
    [isControlled, range, props]
  );

  const valueFromClientX = useCallback(
    (clientX: number): number => {
      const el = trackRef.current;
      if (!el) return min;
      const rect = el.getBoundingClientRect();
      const ratio = clamp((clientX - rect.left) / rect.width, 0, 1);
      const raw = min + ratio * (max - min);
      return clamp(snap(raw, min, step), min, max);
    },
    [min, max, step]
  );

  const updateThumb = useCallback(
    (idx: 0 | 1, value: number) => {
      const [a, b] = current;
      let next: [number, number];
      if (!range) {
        next = [value, value];
      } else if (idx === 0) {
        next = [Math.min(value, b - minGap), b];
      } else {
        next = [a, Math.max(value, a + minGap)];
      }
      if (next[0] !== a || next[1] !== b) emit(next);
    },
    [current, range, minGap, emit]
  );

  useEffect(() => {
    if (dragRef.current === null) return;
    const onMove = (e: MouseEvent | TouchEvent) => {
      if (dragRef.current === null) return;
      const clientX = "touches" in e ? (e.touches[0]?.clientX ?? 0) : e.clientX;
      const v = valueFromClientX(clientX);
      updateThumb(dragRef.current, v);
    };
    const onUp = () => {
      dragRef.current = null;
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("touchmove", onMove);
    window.addEventListener("mouseup", onUp);
    window.addEventListener("touchend", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("touchmove", onMove);
      window.removeEventListener("mouseup", onUp);
      window.removeEventListener("touchend", onUp);
    };
  });

  const handleThumbDown = (idx: 0 | 1) => (e: React.MouseEvent | React.TouchEvent) => {
    if (disabled) return;
    e.preventDefault();
    dragRef.current = idx;
  };

  const handleTrackClick = (e: React.MouseEvent) => {
    if (disabled) return;
    const v = valueFromClientX(e.clientX);
    if (!range) {
      emit([v, v]);
      return;
    }
    const [a, b] = current;
    // Move the thumb closest to the click point.
    const idx: 0 | 1 = Math.abs(v - a) <= Math.abs(v - b) ? 0 : 1;
    updateThumb(idx, v);
  };

  const handleKeyDown = (idx: 0 | 1) => (e: React.KeyboardEvent) => {
    if (disabled) return;
    let delta = 0;
    if (e.key === "ArrowRight" || e.key === "ArrowUp") delta = step;
    else if (e.key === "ArrowLeft" || e.key === "ArrowDown") delta = -step;
    else if (e.key === "PageUp") delta = step * 10;
    else if (e.key === "PageDown") delta = -step * 10;
    else if (e.key === "Home") {
      e.preventDefault();
      const target = !range ? min : idx === 0 ? min : current[0] + minGap;
      updateThumb(idx, target);
      return;
    } else if (e.key === "End") {
      e.preventDefault();
      const target = !range ? max : idx === 1 ? max : current[1] - minGap;
      updateThumb(idx, target);
      return;
    } else {
      return;
    }
    e.preventDefault();
    updateThumb(idx, current[idx] + delta);
  };

  const pct = (v: number) => ((v - min) / (max - min)) * 100;
  const startPct = pct(current[0]);
  const endPct = pct(range ? current[1] : current[0]);

  const ariaLabels: [string | undefined, string | undefined] = Array.isArray(ariaLabel)
    ? [ariaLabel[0], ariaLabel[1]]
    : [ariaLabel, ariaLabel];

  return (
    <div
      className={cx(
        "sisyphos-slider",
        size,
        color,
        disabled && "disabled",
        range && "range",
        className
      )}
    >
      {showValue && range && (
        <div className="sisyphos-slider-values">
          <span>{formatValue(current[0])}</span>
          <span>{formatValue(current[1])}</span>
        </div>
      )}
      {showValue && !range && (
        <div className="sisyphos-slider-values single">
          <span style={{ marginLeft: `calc(${startPct}% - 16px)` }}>{formatValue(current[0])}</span>
        </div>
      )}
      <div ref={trackRef} className="sisyphos-slider-track" onMouseDown={handleTrackClick}>
        <div
          className="sisyphos-slider-progress"
          style={{
            left: range ? `${startPct}%` : 0,
            width: range ? `${endPct - startPct}%` : `${endPct}%`,
          }}
        />
        {!range ? (
          <button
            type="button"
            id={labelIds[0]}
            role="slider"
            aria-valuemin={min}
            aria-valuemax={max}
            aria-valuenow={current[0]}
            aria-label={ariaLabels[0]}
            aria-disabled={disabled || undefined}
            tabIndex={disabled ? -1 : 0}
            className="sisyphos-slider-thumb"
            style={{ left: `${startPct}%` }}
            onMouseDown={handleThumbDown(0)}
            onTouchStart={handleThumbDown(0)}
            onKeyDown={handleKeyDown(0)}
            disabled={disabled}
          />
        ) : (
          <>
            <button
              type="button"
              id={labelIds[0]}
              role="slider"
              aria-valuemin={min}
              aria-valuemax={current[1] - minGap}
              aria-valuenow={current[0]}
              aria-label={ariaLabels[0] ?? "Minimum"}
              aria-disabled={disabled || undefined}
              tabIndex={disabled ? -1 : 0}
              className="sisyphos-slider-thumb"
              style={{ left: `${startPct}%` }}
              onMouseDown={handleThumbDown(0)}
              onTouchStart={handleThumbDown(0)}
              onKeyDown={handleKeyDown(0)}
              disabled={disabled}
            />
            <button
              type="button"
              id={labelIds[1]}
              role="slider"
              aria-valuemin={current[0] + minGap}
              aria-valuemax={max}
              aria-valuenow={current[1]}
              aria-label={ariaLabels[1] ?? "Maximum"}
              aria-disabled={disabled || undefined}
              tabIndex={disabled ? -1 : 0}
              className="sisyphos-slider-thumb"
              style={{ left: `${endPct}%` }}
              onMouseDown={handleThumbDown(1)}
              onTouchStart={handleThumbDown(1)}
              onKeyDown={handleKeyDown(1)}
              disabled={disabled}
            />
          </>
        )}
      </div>
      {range && withInputs && (
        <div className="sisyphos-slider-inputs">
          <label className="sisyphos-slider-input-field">
            <span className="sisyphos-slider-input-label">{minInputLabel}</span>
            <input
              type="number"
              min={min}
              max={current[1] - minGap}
              step={step}
              value={current[0]}
              disabled={disabled}
              onChange={(e) => {
                const v = Number(e.target.value);
                if (!Number.isNaN(v)) updateThumb(0, v);
              }}
            />
          </label>
          <span className="sisyphos-slider-input-divider" aria-hidden="true">
            –
          </span>
          <label className="sisyphos-slider-input-field">
            <span className="sisyphos-slider-input-label">{maxInputLabel}</span>
            <input
              type="number"
              min={current[0] + minGap}
              max={max}
              step={step}
              value={current[1]}
              disabled={disabled}
              onChange={(e) => {
                const v = Number(e.target.value);
                if (!Number.isNaN(v)) updateThumb(1, v);
              }}
            />
          </label>
        </div>
      )}
    </div>
  );
};
