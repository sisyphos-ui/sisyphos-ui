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

describe("DatePicker default times", () => {
  it("applies defaultHour/defaultMinute on first single-date pick when showTime is on", async () => {
    const onChange = vi.fn();
    render(
      <DatePicker label="Date" showTime defaultHour={9} defaultMinute={30} onChange={onChange} />
    );
    await userEvent.click(screen.getByLabelText("Date"));
    const day = await screen.findByRole("button", { name: "15" });
    await userEvent.click(day);
    expect(onChange).toHaveBeenCalled();
    const picked = onChange.mock.calls[0][0] as Date;
    expect(picked.getHours()).toBe(9);
    expect(picked.getMinutes()).toBe(30);
  });

  it("applies defaultStart and defaultEnd times across a range pick", async () => {
    const onChange = vi.fn();
    function Wrap() {
      const [v, setV] = useState<[Date | null, Date | null]>([null, null]);
      return (
        <DatePicker
          label="Range"
          isRange
          showTime
          defaultStartHour={9}
          defaultStartMinute={0}
          defaultEndHour={18}
          defaultEndMinute={0}
          value={v}
          onChange={(next) => {
            onChange(next);
            setV(next);
          }}
        />
      );
    }
    render(<Wrap />);
    await userEvent.click(screen.getByLabelText("Range"));
    const start = await screen.findByRole("button", { name: "10" });
    await userEvent.click(start);
    const end = screen.getByRole("button", { name: "20" });
    await userEvent.click(end);
    // Last call should hold the completed range with both defaults applied.
    const lastArgs = onChange.mock.calls[onChange.mock.calls.length - 1][0] as [
      Date | null,
      Date | null,
    ];
    expect(lastArgs[0]?.getHours()).toBe(9);
    expect(lastArgs[0]?.getMinutes()).toBe(0);
    expect(lastArgs[1]?.getHours()).toBe(18);
    expect(lastArgs[1]?.getMinutes()).toBe(0);
  });

  it("does not override an already-set time when picking another date", async () => {
    const onChange = vi.fn();
    render(
      <DatePicker
        label="Existing-time date"
        showTime
        defaultHour={9}
        defaultMinute={0}
        value={new Date(2025, 0, 15, 14, 0)}
        onChange={onChange}
      />
    );
    await userEvent.click(screen.getByLabelText("Existing-time date"));
    const day20 = await screen.findByRole("button", { name: "20" });
    await userEvent.click(day20);
    // Existing time (14:00) should be preserved on re-pick — the default
    // only applies when the user has no prior time.
    const picked = onChange.mock.calls[0][0] as Date;
    expect(picked.getHours()).toBe(14);
    expect(picked.getMinutes()).toBe(0);
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
