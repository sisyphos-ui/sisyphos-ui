/**
 * Pagination — prev/next + numeric pages with ellipsis elision. Designed as a
 * companion to `Table` but usable anywhere a pager is needed.
 */
import React from "react";
import { cx } from "@sisyphos-ui/core/internal";
import "./Table.scss";

export interface PaginationProps {
  /** Current page (1-based). */
  page: number;
  /** Total number of pages. */
  pageCount: number;
  /** Called with the next page when a page control is activated. */
  onPageChange: (page: number) => void;
  /** Number of sibling pages to show on each side of the current page. Default 1. */
  siblings?: number;
  /** Number of edge pages always shown. Default 1. */
  boundaries?: number;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function getPageItems(page: number, pageCount: number, siblings = 1, boundaries = 1): Array<number | "ellipsis"> {
  const total = pageCount;
  if (total <= 1) return [1];
  const totalNumbers = boundaries * 2 + siblings * 2 + 3;
  if (totalNumbers >= total) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  const left = Math.max(page - siblings, boundaries + 2);
  const right = Math.min(page + siblings, total - boundaries - 1);

  const items: Array<number | "ellipsis"> = [];
  for (let i = 1; i <= boundaries; i++) items.push(i);
  if (left > boundaries + 1) items.push("ellipsis");
  for (let i = left; i <= right; i++) items.push(i);
  if (right < total - boundaries) items.push("ellipsis");
  for (let i = total - boundaries + 1; i <= total; i++) items.push(i);
  return items;
}

const Chevron: React.FC<{ direction: "left" | "right" }> = ({ direction }) => (
  <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true">
    <path d={direction === "left" ? "M10 4l-4 4 4 4" : "M6 4l4 4-4 4"} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const Pagination: React.FC<PaginationProps> = ({
  page,
  pageCount,
  onPageChange,
  siblings = 1,
  boundaries = 1,
  size = "md",
  className,
}) => {
  const items = getPageItems(page, pageCount, siblings, boundaries);
  return (
    <nav className={cx("sisyphos-pagination", size, className)} aria-label="Pagination">
      <button
        type="button"
        className="sisyphos-pagination-arrow"
        onClick={() => onPageChange(page - 1)}
        disabled={page <= 1}
        aria-label="Previous page"
      >
        <Chevron direction="left" />
      </button>
      <ul className="sisyphos-pagination-list">
        {items.map((it, i) =>
          it === "ellipsis" ? (
            <li key={`e-${i}`} className="sisyphos-pagination-ellipsis" aria-hidden="true">…</li>
          ) : (
            <li key={it}>
              <button
                type="button"
                className={cx("sisyphos-pagination-page", it === page && "active")}
                onClick={() => onPageChange(it)}
                aria-current={it === page ? "page" : undefined}
              >
                {it}
              </button>
            </li>
          )
        )}
      </ul>
      <button
        type="button"
        className="sisyphos-pagination-arrow"
        onClick={() => onPageChange(page + 1)}
        disabled={page >= pageCount}
        aria-label="Next page"
      >
        <Chevron direction="right" />
      </button>
    </nav>
  );
};
