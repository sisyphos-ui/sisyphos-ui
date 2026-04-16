/**
 * Breadcrumb — navigation trail with optional middle-collapse (via `maxItems`)
 * and a customizable separator.
 *
 * Rendered inside a `<nav aria-label="breadcrumb">` and marks the final item
 * with `aria-current="page"`.
 */
import React from "react";
import { cx } from "@sisyphos-ui/core/internal";
import "./Breadcrumb.scss";

export interface BreadcrumbItem {
  label: React.ReactNode;
  href?: string;
  onClick?: (event: React.MouseEvent) => void;
  icon?: React.ReactNode;
  key?: string;
}

export interface BreadcrumbProps extends React.HTMLAttributes<HTMLElement> {
  /** Ordered list of breadcrumb entries. The last item is treated as the current page. */
  items: BreadcrumbItem[];
  /** Custom separator rendered between items. Defaults to "/". */
  separator?: React.ReactNode;
  /**
   * When set, collapses middle items into a `…` when total exceeds this count.
   * Keeps `itemsBeforeCollapse` before and `itemsAfterCollapse` after the ellipsis.
   */
  maxItems?: number;
  /** Items kept before the ellipsis when collapsing. */
  itemsBeforeCollapse?: number;
  /** Items kept after the ellipsis when collapsing. */
  itemsAfterCollapse?: number;
}

const DefaultSeparator = () => <span aria-hidden="true">/</span>;

function collapseItems(
  items: BreadcrumbItem[],
  max: number,
  before: number,
  after: number
): Array<BreadcrumbItem | { ellipsis: true }> {
  if (items.length <= max) return items;
  return [...items.slice(0, before), { ellipsis: true }, ...items.slice(items.length - after)];
}

export const Breadcrumb = React.forwardRef<HTMLElement, BreadcrumbProps>(function Breadcrumb(
  {
    items,
    separator = <DefaultSeparator />,
    maxItems,
    itemsBeforeCollapse = 1,
    itemsAfterCollapse = 1,
    className,
    ...rest
  },
  ref
) {
  const rendered =
    typeof maxItems === "number"
      ? collapseItems(items, maxItems, itemsBeforeCollapse, itemsAfterCollapse)
      : items;

  return (
    <nav
      ref={ref}
      aria-label="breadcrumb"
      className={cx("sisyphos-breadcrumb", className)}
      {...rest}
    >
      <ol className="sisyphos-breadcrumb-list">
        {rendered.map((node, idx) => {
          const isLast = idx === rendered.length - 1;
          const sep = !isLast && (
            <li aria-hidden="true" className="sisyphos-breadcrumb-separator">
              {separator}
            </li>
          );

          if ("ellipsis" in node) {
            return (
              <React.Fragment key={`ellipsis-${idx}`}>
                <li className="sisyphos-breadcrumb-ellipsis" aria-hidden="true">
                  …
                </li>
                {sep}
              </React.Fragment>
            );
          }

          const item = node;
          const content = (
            <>
              {item.icon && <span className="sisyphos-breadcrumb-icon">{item.icon}</span>}
              <span>{item.label}</span>
            </>
          );

          let body: React.ReactNode;
          if (isLast) {
            body = (
              <span className="sisyphos-breadcrumb-current" aria-current="page">
                {content}
              </span>
            );
          } else if (item.href) {
            body = (
              <a className="sisyphos-breadcrumb-link" href={item.href} onClick={item.onClick}>
                {content}
              </a>
            );
          } else if (item.onClick) {
            body = (
              <button
                type="button"
                className="sisyphos-breadcrumb-link as-button"
                onClick={item.onClick}
              >
                {content}
              </button>
            );
          } else {
            body = <span className="sisyphos-breadcrumb-text">{content}</span>;
          }

          return (
            <React.Fragment key={item.key ?? idx}>
              <li className="sisyphos-breadcrumb-item">{body}</li>
              {sep}
            </React.Fragment>
          );
        })}
      </ol>
    </nav>
  );
});

Breadcrumb.displayName = "Breadcrumb";
