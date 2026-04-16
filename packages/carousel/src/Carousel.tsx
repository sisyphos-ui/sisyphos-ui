/**
 * Carousel — sliding content area with optional autoplay (paused on hover and
 * focus), navigation arrows, dot indicators, and arrow-key keyboard support.
 *
 * Works controlled (`index`) or uncontrolled (`defaultIndex`).
 */
import React, {
  Children,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { cx } from "@sisyphos-ui/core/internal";
import "./Carousel.scss";

export interface CarouselProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
  /** Controlled active index. */
  index?: number;
  /** Default active index (uncontrolled). */
  defaultIndex?: number;
  onIndexChange?: (index: number) => void;
  /** Auto-advance every `autoPlayInterval` ms. */
  autoPlay?: boolean;
  /** Time between auto-advances in ms. Defaults to 5000. */
  autoPlayInterval?: number;
  /** Wrap from last to first / first to last. Default `true`. */
  loop?: boolean;
  showArrows?: boolean;
  showDots?: boolean;
  /** Pause autoplay on mouse enter / focus. Default `true`. */
  pauseOnHover?: boolean;
  /** Override label for the container `aria-roledescription`. Default `"carousel"`. */
  ariaLabel?: string;
}

const Chevron: React.FC<{ direction: "left" | "right" }> = ({ direction }) => (
  <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
    <path
      d={direction === "left" ? "M15 18L9 12L15 6" : "M9 18L15 12L9 6"}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const Carousel: React.FC<CarouselProps> = ({
  index: indexProp,
  defaultIndex = 0,
  onIndexChange,
  autoPlay = false,
  autoPlayInterval = 5000,
  loop = true,
  showArrows = true,
  showDots = true,
  pauseOnHover = true,
  ariaLabel = "carousel",
  className,
  children,
  ...rest
}) => {
  const slides = Children.toArray(children);
  const count = slides.length;

  const isControlled = indexProp !== undefined;
  const [internal, setInternal] = useState(defaultIndex);
  const current = isControlled ? indexProp! : internal;

  const [paused, setPaused] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const setIndex = useCallback(
    (next: number) => {
      const clamped = ((next % count) + count) % count;
      if (!loop) {
        if (next < 0 || next >= count) return;
      }
      if (!isControlled) setInternal(clamped);
      onIndexChange?.(clamped);
    },
    [count, loop, isControlled, onIndexChange]
  );

  const next = useCallback(() => setIndex(current + 1), [current, setIndex]);
  const prev = useCallback(() => setIndex(current - 1), [current, setIndex]);

  useEffect(() => {
    if (!autoPlay || paused || count <= 1) return;
    timerRef.current = setInterval(next, autoPlayInterval);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [autoPlay, paused, count, autoPlayInterval, next]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      next();
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      prev();
    }
  };

  if (count === 0) return null;

  const hasMultiple = count > 1;

  return (
    <div
      role="region"
      aria-roledescription={ariaLabel}
      tabIndex={0}
      className={cx("sisyphos-carousel", className)}
      onKeyDown={handleKeyDown}
      onMouseEnter={pauseOnHover ? () => setPaused(true) : undefined}
      onMouseLeave={pauseOnHover ? () => setPaused(false) : undefined}
      onFocus={pauseOnHover ? () => setPaused(true) : undefined}
      onBlur={pauseOnHover ? () => setPaused(false) : undefined}
      {...rest}
    >
      <div className="sisyphos-carousel-viewport">
        <div
          className="sisyphos-carousel-track"
          style={{ transform: `translateX(-${current * 100}%)` }}
        >
          {slides.map((child, i) => (
            <div
              key={i}
              className="sisyphos-carousel-slide"
              role="group"
              aria-roledescription="slide"
              aria-label={`${i + 1} of ${count}`}
              aria-hidden={i !== current}
            >
              {child}
            </div>
          ))}
        </div>

        {showArrows && hasMultiple && (
          <>
            <button
              type="button"
              className="sisyphos-carousel-arrow prev"
              onClick={prev}
              aria-label="Previous slide"
              disabled={!loop && current === 0}
            >
              <Chevron direction="left" />
            </button>
            <button
              type="button"
              className="sisyphos-carousel-arrow next"
              onClick={next}
              aria-label="Next slide"
              disabled={!loop && current === count - 1}
            >
              <Chevron direction="right" />
            </button>
          </>
        )}
      </div>

      {showDots && hasMultiple && (
        <div className="sisyphos-carousel-dots" role="tablist" aria-label="Slide selector">
          {slides.map((_, i) => (
            <button
              key={i}
              type="button"
              role="tab"
              aria-selected={i === current}
              aria-label={`Go to slide ${i + 1}`}
              className={cx("sisyphos-carousel-dot", i === current && "active")}
              onClick={() => setIndex(i)}
            />
          ))}
        </div>
      )}
    </div>
  );
};
