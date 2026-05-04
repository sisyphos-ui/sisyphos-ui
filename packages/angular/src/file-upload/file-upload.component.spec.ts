import { describe, it, expect, vi } from "vitest";
import { Component } from "@angular/core";
import { TestBed } from "@angular/core/testing";
import { FileUpload } from "./file-upload.component";
import type { RejectReason, UploadedFile } from "./types";
import { formatBytes, matchesAccept } from "./utils";

describe("FileUpload utils", () => {
  it("formatBytes formats nicely", () => {
    expect(formatBytes(0)).toBe("0 B");
    expect(formatBytes(1024)).toBe("1.0 KB");
    expect(formatBytes(1024 * 1024)).toBe("1.0 MB");
  });

  it("matchesAccept handles MIME, wildcard, and extension", () => {
    const png = new File([""], "x.png", { type: "image/png" });
    const txt = new File([""], "x.txt", { type: "text/plain" });
    expect(matchesAccept(png, "image/*")).toBe(true);
    expect(matchesAccept(png, "*")).toBe(true);
    expect(matchesAccept(txt, "image/*")).toBe(false);
    expect(matchesAccept(txt, ".txt")).toBe(true);
    expect(matchesAccept(png, "image/png")).toBe(true);
  });
});

@Component({
  standalone: true,
  imports: [FileUpload],
  template: `
    <sui-file-upload
      [(value)]="files"
      [accept]="accept"
      [maxSize]="maxSize"
      [maxFiles]="maxFiles"
      [disabled]="disabled"
      (reject)="onReject($event)"
    />
  `,
})
class Host {
  files: UploadedFile[] = [];
  accept = "";
  maxSize = 10 * 1024 * 1024;
  maxFiles = 1;
  disabled = false;
  rejectedReasons: RejectReason[] = [];
  onReject = (e: { file: File; reason: RejectReason }) => this.rejectedReasons.push(e.reason);
}

function makeFile(name: string, size = 1024, type = "text/plain"): File {
  // Vitest's File constructor is reasonable; fill with N bytes of data.
  return new File([new Uint8Array(size)], name, { type });
}

describe("FileUpload (Angular)", () => {
  it("renders a dropzone with role=button", () => {
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    const drop = fixture.nativeElement.querySelector("[role=button]") as HTMLElement;
    expect(drop).toBeTruthy();
    expect(drop.classList.contains("sisyphos-file-upload-dropzone")).toBe(true);
  });

  it("renders the file list when value contains files", () => {
    const fixture = TestBed.createComponent(Host);
    fixture.componentInstance.files = [
      { id: "1", name: "a.txt", size: 100, status: "success" },
    ];
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelectorAll("li.sisyphos-file-upload-item").length).toBe(1);
  });

  it("clicking the remove button drops the file", () => {
    const fixture = TestBed.createComponent(Host);
    fixture.componentInstance.files = [
      { id: "1", name: "a.txt", size: 100 },
      { id: "2", name: "b.txt", size: 100 },
    ];
    fixture.componentInstance.maxFiles = 5;
    fixture.detectChanges();
    const removes = fixture.nativeElement.querySelectorAll(
      "button.sisyphos-file-upload-remove"
    ) as NodeListOf<HTMLButtonElement>;
    removes[0].click();
    fixture.detectChanges();
    expect(fixture.componentInstance.files.length).toBe(1);
    expect(fixture.componentInstance.files[0].id).toBe("2");
  });

  it("rejects oversize files via (reject)", () => {
    const fixture = TestBed.createComponent(Host);
    fixture.componentInstance.maxSize = 50;
    fixture.detectChanges();
    const native = fixture.nativeElement.querySelector("input[type=file]") as HTMLInputElement;
    const big = makeFile("big.txt", 200);
    Object.defineProperty(native, "files", {
      value: { 0: big, length: 1, item: () => big } as unknown as FileList,
      writable: true,
    });
    native.dispatchEvent(new Event("change"));
    fixture.detectChanges();
    expect(fixture.componentInstance.rejectedReasons.length).toBe(1);
    expect(fixture.componentInstance.rejectedReasons[0].kind).toBe("size");
  });

  it("rejects wrong types when accept is set", () => {
    const fixture = TestBed.createComponent(Host);
    fixture.componentInstance.accept = "image/*";
    fixture.detectChanges();
    const native = fixture.nativeElement.querySelector("input[type=file]") as HTMLInputElement;
    const txt = makeFile("notes.txt", 100, "text/plain");
    Object.defineProperty(native, "files", {
      value: { 0: txt, length: 1, item: () => txt } as unknown as FileList,
      writable: true,
    });
    native.dispatchEvent(new Event("change"));
    fixture.detectChanges();
    expect(fixture.componentInstance.rejectedReasons[0].kind).toBe("type");
  });

  it("respects maxFiles in multi mode", () => {
    const fixture = TestBed.createComponent(Host);
    fixture.componentInstance.maxFiles = 2;
    fixture.componentInstance.files = [{ id: "1", name: "a.txt", size: 1 }];
    fixture.detectChanges();
    const native = fixture.nativeElement.querySelector("input[type=file]") as HTMLInputElement;
    const f1 = makeFile("b.txt", 100);
    const f2 = makeFile("c.txt", 100);
    Object.defineProperty(native, "files", {
      value: { 0: f1, 1: f2, length: 2, item: (i: number) => (i === 0 ? f1 : f2) } as unknown as FileList,
      writable: true,
    });
    native.dispatchEvent(new Event("change"));
    fixture.detectChanges();
    // 1 existing + 2 new = 3, max=2 → only one slot remains
    expect(fixture.componentInstance.files.length).toBe(2);
    expect(fixture.componentInstance.rejectedReasons.some((r) => r.kind === "max-files")).toBe(true);
  });

  it("disabled blocks the dropzone (canAddMore=false)", () => {
    const fixture = TestBed.createComponent(Host);
    fixture.componentInstance.disabled = true;
    fixture.detectChanges();
    const dropzone = fixture.nativeElement.querySelector(
      ".sisyphos-file-upload-dropzone"
    ) as HTMLElement;
    expect(dropzone.classList.contains("disabled")).toBe(true);
    expect(dropzone.getAttribute("aria-disabled")).toBe("true");
  });
});
