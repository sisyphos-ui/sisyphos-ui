import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Carousel } from "./Carousel";

function setup(extras: React.ComponentProps<typeof Carousel> = {}) {
  return render(
    <Carousel {...extras}>
      <div>Slide 1</div>
      <div>Slide 2</div>
      <div>Slide 3</div>
    </Carousel>
  );
}

describe("Carousel", () => {
  it("renders all slides with aria-label index", () => {
    setup();
    expect(screen.getByLabelText("1 of 3")).toBeInTheDocument();
    expect(screen.getByLabelText("3 of 3")).toBeInTheDocument();
  });

  it("Next button advances slide", async () => {
    const onIndexChange = vi.fn();
    setup({ onIndexChange });
    await userEvent.click(screen.getByRole("button", { name: "Next slide" }));
    expect(onIndexChange).toHaveBeenCalledWith(1);
  });

  it("Prev wraps with loop=true", async () => {
    const onIndexChange = vi.fn();
    setup({ onIndexChange });
    await userEvent.click(screen.getByRole("button", { name: "Previous slide" }));
    expect(onIndexChange).toHaveBeenCalledWith(2);
  });

  it("loop=false disables prev on first slide", () => {
    setup({ loop: false });
    expect(screen.getByRole("button", { name: "Previous slide" })).toBeDisabled();
  });

  it("dot click jumps to slide", async () => {
    const onIndexChange = vi.fn();
    setup({ onIndexChange });
    await userEvent.click(screen.getByRole("tab", { name: "Go to slide 3" }));
    expect(onIndexChange).toHaveBeenCalledWith(2);
  });

  it("ArrowRight advances", async () => {
    const onIndexChange = vi.fn();
    setup({ onIndexChange });
    const region = screen.getByRole("region");
    region.focus();
    await userEvent.keyboard("{ArrowRight}");
    expect(onIndexChange).toHaveBeenCalledWith(1);
  });
});
