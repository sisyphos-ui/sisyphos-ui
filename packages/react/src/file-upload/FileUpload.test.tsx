import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { FileUpload } from "./FileUpload";
import { matchesAccept, formatBytes } from "./utils";

describe("utils", () => {
  it("formatBytes", () => {
    expect(formatBytes(0)).toBe("0 B");
    expect(formatBytes(512)).toBe("512 B");
    expect(formatBytes(2048)).toBe("2.0 KB");
  });

  it("matchesAccept — extension", () => {
    const f = new File([""], "a.pdf", { type: "application/pdf" });
    expect(matchesAccept(f, ".pdf")).toBe(true);
    expect(matchesAccept(f, ".docx")).toBe(false);
  });

  it("matchesAccept — mime wildcard", () => {
    const f = new File([""], "a.png", { type: "image/png" });
    expect(matchesAccept(f, "image/*")).toBe(true);
  });
});

describe("FileUpload", () => {
  it("calls onChange with accepted file", async () => {
    const onChange = vi.fn();
    render(<FileUpload value={[]} onChange={onChange} label="x" />);
    const input = document.getElementById(screen.getByLabelText("x").id) as HTMLInputElement;
    const file = new File(["hi"], "hello.txt", { type: "text/plain" });
    await userEvent.upload(input, file);
    expect(onChange).toHaveBeenCalled();
    const next = onChange.mock.calls[0][0];
    expect(next[0].name).toBe("hello.txt");
  });

  it("rejects oversized file and calls onReject", async () => {
    const onChange = vi.fn();
    const onReject = vi.fn();
    render(
      <FileUpload value={[]} onChange={onChange} onReject={onReject} maxSize={10} label="x" />
    );
    const input = screen.getByLabelText("x") as HTMLInputElement;
    const big = new File(["a".repeat(100)], "big.txt", { type: "text/plain" });
    await userEvent.upload(input, big);
    expect(onReject).toHaveBeenCalledWith(big, { kind: "size", maxSize: 10 });
    expect(onChange).not.toHaveBeenCalled();
  });

  it("remove button removes a file", async () => {
    const onChange = vi.fn();
    render(
      <FileUpload label="x" value={[{ id: "a", name: "a.pdf", size: 100 }]} onChange={onChange} />
    );
    await userEvent.click(screen.getByRole("button", { name: "Remove file" }));
    expect(onChange).toHaveBeenCalledWith([]);
  });

  it("respects maxFiles=1 by replacing", async () => {
    const onChange = vi.fn();
    render(
      <FileUpload
        label="x"
        value={[{ id: "old", name: "old.pdf", size: 100 }]}
        onChange={onChange}
      />
    );
    const input = screen.getByLabelText("x") as HTMLInputElement;
    await userEvent.upload(input, new File(["new"], "new.pdf", { type: "application/pdf" }));
    const next = onChange.mock.calls[0][0];
    expect(next).toHaveLength(1);
    expect(next[0].name).toBe("new.pdf");
  });

  it("onBeforeRemove returning false cancels the removal", async () => {
    const onChange = vi.fn();
    const onBeforeRemove = vi.fn().mockReturnValue(false);
    render(
      <FileUpload
        label="confirm-remove"
        value={[{ id: "a", name: "a.pdf", size: 100 }]}
        onChange={onChange}
        onBeforeRemove={onBeforeRemove}
      />
    );
    await userEvent.click(screen.getByRole("button", { name: "Remove file" }));
    expect(onBeforeRemove).toHaveBeenCalledWith(
      expect.objectContaining({ id: "a", name: "a.pdf" })
    );
    expect(onChange).not.toHaveBeenCalled();
  });

  it("onBeforeRemove resolving true allows the async removal", async () => {
    const onChange = vi.fn();
    const onBeforeRemove = vi.fn().mockResolvedValue(true);
    render(
      <FileUpload
        label="async-remove"
        value={[{ id: "a", name: "a.pdf", size: 100 }]}
        onChange={onChange}
        onBeforeRemove={onBeforeRemove}
      />
    );
    await userEvent.click(screen.getByRole("button", { name: "Remove file" }));
    expect(onChange).toHaveBeenCalledWith([]);
  });

  it("directory mode applies the webkitdirectory attribute to the native input", () => {
    render(<FileUpload label="folder" value={[]} onChange={() => {}} directory />);
    const input = screen.getByLabelText("folder");
    expect(input).toHaveAttribute("webkitdirectory");
    expect(input).toHaveAttribute("directory");
  });
});
