import { describe, it, expect } from "vitest";
import { computePosition } from "./placement";

const VIEWPORT = { width: 1024, height: 768 };
const TOOLTIP = { width: 200, height: 40 };

function anchorAt(left: number, top: number, w = 100, h = 32) {
  return {
    left,
    top,
    right: left + w,
    bottom: top + h,
    width: w,
    height: h,
  };
}

describe("computePosition", () => {
  it("places the tooltip above the anchor for placement=top and keeps that resolved placement when there is room", () => {
    const anchor = anchorAt(400, 300);
    const pos = computePosition(anchor, TOOLTIP, "top", 8, VIEWPORT);
    expect(pos.placement).toBe("top");
    expect(pos.top).toBe(anchor.top - TOOLTIP.height - 8);
    // Horizontally centered on the anchor.
    expect(pos.left).toBe(anchor.left + anchor.width / 2 - TOOLTIP.width / 2);
  });

  it("flips top → bottom when there is no room above the anchor", () => {
    const anchor = anchorAt(400, 4); // too close to the top edge
    const pos = computePosition(anchor, TOOLTIP, "top", 8, VIEWPORT);
    expect(pos.placement).toBe("bottom");
    expect(pos.top).toBe(anchor.bottom + 8);
  });

  it("flips bottom → top when there is no room below the anchor", () => {
    const anchor = anchorAt(400, VIEWPORT.height - 40); // near the bottom
    const pos = computePosition(anchor, TOOLTIP, "bottom", 8, VIEWPORT);
    expect(pos.placement).toBe("top");
  });

  it("flips left → right when there is no room on the left", () => {
    const anchor = anchorAt(10, 300);
    const pos = computePosition(anchor, TOOLTIP, "left", 8, VIEWPORT);
    expect(pos.placement).toBe("right");
    expect(pos.left).toBe(anchor.right + 8);
  });

  it("honors start/end alignment on vertical placements", () => {
    const anchor = anchorAt(300, 300, 200, 32);
    const start = computePosition(anchor, TOOLTIP, "top-start", 0, VIEWPORT);
    expect(start.left).toBe(anchor.left);

    const end = computePosition(anchor, TOOLTIP, "top-end", 0, VIEWPORT);
    expect(end.left).toBe(anchor.right - TOOLTIP.width);
  });

  it("respects the offset parameter", () => {
    const anchor = anchorAt(400, 300);
    const posA = computePosition(anchor, TOOLTIP, "top", 0, VIEWPORT);
    const posB = computePosition(anchor, TOOLTIP, "top", 16, VIEWPORT);
    expect(posA.top - posB.top).toBe(16);
  });

  it("keeps the requested placement when the flipped candidate also doesn't fit", () => {
    // Tooltip bigger than the viewport on the desired axis — no flip helps.
    const huge = { width: 2000, height: 40 };
    const anchor = anchorAt(10, 300);
    const pos = computePosition(anchor, huge, "left", 8, VIEWPORT);
    // Because "left" doesn't fit and "right" also wouldn't fit due to width,
    // the function keeps the original placement rather than flipping.
    expect(pos.placement).toBe("left");
  });
});
