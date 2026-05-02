/**
 * PageSkeleton — preset layout skeletons for full pages.
 *
 * Saves teams from wiring `<Skeleton>` primitives into the same header-cards-
 * table shape on every dashboard. Opt out of any section with `showHeader`,
 * `cardCount`, or `tableRows={0}` — or build a custom layout with the
 * primitive `<Skeleton>` yourself.
 */
import React from "react";
import { cx } from "@sisyphos-ui/core/internal";
import { Skeleton } from "./Skeleton";
import { SkeletonText } from "./SkeletonText";
import "./Skeleton.scss";

export interface PageSkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Layout preset. */
  layout?: "default" | "cards" | "table" | "detail";
  /** Render the top "title + subtitle + icon" header bar. Default true. */
  showHeader?: boolean;
  /** Number of summary cards in the top row. Default 3. */
  cardCount?: number;
  /** Number of body rows for the bottom list/table. Default 5. 0 hides it. */
  tableRows?: number;
  /** Number of table columns (skeletons per row). Default 4. */
  tableColumns?: number;
  /** Animation forwarded to every underlying `<Skeleton>`. */
  animation?: "shimmer" | "pulse" | "none";
}

export const PageSkeleton = React.forwardRef<HTMLDivElement, PageSkeletonProps>(
  function PageSkeleton(
    {
      layout = "default",
      showHeader = true,
      cardCount = 3,
      tableRows = 5,
      tableColumns = 4,
      animation = "shimmer",
      className,
      ...rest
    },
    ref
  ) {
    const renderHeader = () => (
      <div className="sisyphos-page-skeleton-header">
        <Skeleton shape="circular" width={40} height={40} animation={animation} />
        <div className="sisyphos-page-skeleton-header-text">
          <Skeleton width="40%" height={18} animation={animation} />
          <Skeleton width="60%" height={12} animation={animation} />
        </div>
      </div>
    );

    const renderCards = () => (
      <div
        className="sisyphos-page-skeleton-cards"
        style={{ gridTemplateColumns: `repeat(${cardCount}, minmax(0, 1fr))` }}
      >
        {Array.from({ length: cardCount }).map((_, i) => (
          <div key={i} className="sisyphos-page-skeleton-card">
            <Skeleton width="40%" height={12} animation={animation} />
            <Skeleton width="70%" height={24} animation={animation} />
            <Skeleton width="30%" height={10} animation={animation} />
          </div>
        ))}
      </div>
    );

    const renderTable = () => (
      <div className="sisyphos-page-skeleton-table">
        <div className="sisyphos-page-skeleton-table-header">
          {Array.from({ length: tableColumns }).map((_, i) => (
            <Skeleton key={i} height={12} width="70%" animation={animation} />
          ))}
        </div>
        {Array.from({ length: tableRows }).map((_, r) => (
          <div key={r} className="sisyphos-page-skeleton-table-row">
            {Array.from({ length: tableColumns }).map((_, c) => {
              const widths = ["90%", "65%", "80%", "45%"];
              return (
                <Skeleton
                  key={c}
                  height={12}
                  width={widths[c % widths.length]}
                  animation={animation}
                />
              );
            })}
          </div>
        ))}
      </div>
    );

    const renderDetail = () => (
      <div className="sisyphos-page-skeleton-detail">
        <Skeleton width={160} height={120} animation={animation} />
        <div className="sisyphos-page-skeleton-detail-body">
          <Skeleton width="50%" height={20} animation={animation} />
          <SkeletonText lines={4} animation={animation} />
        </div>
      </div>
    );

    return (
      <div
        ref={ref}
        role="status"
        aria-label="Loading page"
        className={cx("sisyphos-page-skeleton", layout, className)}
        {...rest}
      >
        {showHeader && renderHeader()}
        {layout === "default" && (
          <>
            {cardCount > 0 && renderCards()}
            {tableRows > 0 && renderTable()}
          </>
        )}
        {layout === "cards" && cardCount > 0 && renderCards()}
        {layout === "table" && tableRows > 0 && renderTable()}
        {layout === "detail" && renderDetail()}
      </div>
    );
  }
);

PageSkeleton.displayName = "PageSkeleton";
