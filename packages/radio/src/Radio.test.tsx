import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { Radio } from "./Radio";
import { RadioGroup } from "./RadioGroup";

describe("Radio + RadioGroup", () => {
  it("renders options with radiogroup role", () => {
    render(
      <RadioGroup label="Plan" defaultValue="a">
        <Radio value="a" label="A" />
        <Radio value="b" label="B" />
      </RadioGroup>
    );
    expect(screen.getByRole("radiogroup", { name: "Plan" })).toBeInTheDocument();
    expect(screen.getByRole("radio", { name: "A" })).toBeChecked();
  });

  it("selects on click (uncontrolled)", async () => {
    const onChange = vi.fn();
    render(
      <RadioGroup label="Plan" onChange={onChange}>
        <Radio value="a" label="A" />
        <Radio value="b" label="B" />
      </RadioGroup>
    );
    await userEvent.click(screen.getByRole("radio", { name: "B" }));
    expect(onChange).toHaveBeenCalledWith("b");
    expect(screen.getByRole("radio", { name: "B" })).toBeChecked();
  });

  it("controlled mode respects value prop", async () => {
    function Wrap() {
      const [v, setV] = useState<string | number>("a");
      return (
        <>
          <RadioGroup label="x" value={v} onChange={setV}>
            <Radio value="a" label="A" />
            <Radio value="b" label="B" />
          </RadioGroup>
        </>
      );
    }
    render(<Wrap />);
    const b = screen.getByRole("radio", { name: "B" });
    await userEvent.click(b);
    expect(b).toBeChecked();
  });

  it("disabled prevents selection", async () => {
    const onChange = vi.fn();
    render(
      <RadioGroup disabled onChange={onChange}>
        <Radio value="a" label="A" />
      </RadioGroup>
    );
    await userEvent.click(screen.getByRole("radio", { name: "A" }));
    expect(onChange).not.toHaveBeenCalled();
  });

  it("shows error and errorMessage", () => {
    render(
      <RadioGroup error errorMessage="Required">
        <Radio value="a" label="A" />
      </RadioGroup>
    );
    expect(screen.getByRole("alert")).toHaveTextContent("Required");
    expect(screen.getByRole("radiogroup")).toHaveAttribute("aria-invalid", "true");
  });
});
