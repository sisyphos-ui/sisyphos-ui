import { describe, it, expect, vi } from "vitest";
import { render, screen, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { DatePicker } from "./DatePicker";

describe("DatePicker (single)", () => {
  it("renders trigger and opens dialog on click", async () => {
    render(<DatePicker label="Date" />);
    const input = screen.getByLabelText("Date") as HTMLInputElement;
    expect(input).toHaveAttribute("readonly");
    await userEvent.click(input);
    expect(await screen.findByRole("dialog")).toBeInTheDocument();
  });

  it("selects a day and closes when showTime=false", async () => {
    function Wrap() {
      const [v, setV] = useState<Date | null>(null);
      return <DatePicker label="Date" value={v} onChange={setV} />;
    }
    render(<Wrap />);
    await userEvent.click(screen.getByLabelText("Date"));
    const day = await screen.findByRole("button", { name: "15" });
    await userEvent.click(day);
    const input = screen.getByLabelText("Date") as HTMLInputElement;
    expect(input.value).toMatch(/15\./);
  });

  it("clear button resets value", async () => {
    const onChange = vi.fn();
    render(
      <DatePicker label="Date" allowClear value={new Date(2025, 0, 15)} onChange={onChange} />
    );
    await userEvent.click(screen.getByRole("button", { name: "Clear date" }));
    expect(onChange).toHaveBeenCalledWith(null);
  });

  it("respects min/max", async () => {
    const today = new Date();
    const min = new Date(today.getFullYear(), today.getMonth(), 10);
    const max = new Date(today.getFullYear(), today.getMonth(), 20);
    render(<DatePicker label="Date" minDate={min} maxDate={max} />);
    await userEvent.click(screen.getByLabelText("Date"));
    const day5 = await screen.findByRole("button", { name: "5" });
    expect(day5).toBeDisabled();
    const day15 = screen.getByRole("button", { name: "15" });
    expect(day15).not.toBeDisabled();
  });
});

describe("DatePicker (range)", () => {
  it("selects start and end dates", async () => {
    function Wrap() {
      const [v, setV] = useState<[Date | null, Date | null]>([null, null]);
      return <DatePicker label="Range" isRange value={v} onChange={setV} />;
    }
    render(<Wrap />);
    await userEvent.click(screen.getByLabelText("Range"));
    const start = await screen.findByRole("button", { name: "10" });
    await userEvent.click(start);
    const end = screen.getByRole("button", { name: "20" });
    await userEvent.click(end);
    const input = screen.getByLabelText("Range") as HTMLInputElement;
    expect(input.value).toMatch(/10\.\d+\.\d+ - 20\./);
  });
});

describe("DatePicker header views", () => {
  it("switches to months view on header click and selects month", async () => {
    render(<DatePicker label="Date" />);
    await userEvent.click(screen.getByLabelText("Date"));
    const header = await screen.findByRole("button", {
      name: /(\d{4}|Ocak|Şubat|Mart|Nisan|Mayıs|Haziran|Temmuz|Ağustos|Eylül|Ekim|Kasım|Aralık)/,
    });
    await userEvent.click(header);
    const mart = await screen.findByRole("button", { name: "Mart" });
    await userEvent.click(mart);
    expect(await screen.findByText(/Mart \d{4}/)).toBeInTheDocument();
  });
});
