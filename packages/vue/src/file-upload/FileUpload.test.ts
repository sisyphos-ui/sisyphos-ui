import { describe, it, expect, vi } from "vitest";
import { mount } from "@vue/test-utils";
import FileUpload from "./FileUpload.vue";

function makeFile(name: string, content = "x", type = "application/pdf") {
  return new File([content], name, { type });
}

describe("FileUpload (Vue)", () => {
  it("renders the dropzone and a hidden input", () => {
    const wrapper = mount(FileUpload, { props: { modelValue: [], label: "Pick a file" } });
    expect(wrapper.find(".sisyphos-file-upload-dropzone").exists()).toBe(true);
    expect(wrapper.find('input[type="file"]').exists()).toBe(true);
  });

  it("emits update:modelValue with accepted files", async () => {
    const wrapper = mount(FileUpload, {
      props: { modelValue: [], maxFiles: 3, accept: ".pdf" },
    });
    const input = wrapper.find("input[type='file']").element as HTMLInputElement;
    Object.defineProperty(input, "files", {
      value: [makeFile("a.pdf"), makeFile("b.pdf")],
      writable: false,
    });
    await wrapper.find("input[type='file']").trigger("change");
    const emitted = wrapper.emitted("update:modelValue")?.at(-1)?.[0];
    expect(Array.isArray(emitted)).toBe(true);
    expect(emitted).toHaveLength(2);
  });

  it("rejects files that fail accept", async () => {
    const wrapper = mount(FileUpload, { props: { modelValue: [], accept: ".pdf" } });
    const input = wrapper.find("input[type='file']").element as HTMLInputElement;
    Object.defineProperty(input, "files", {
      value: [makeFile("a.png", "x", "image/png")],
      writable: false,
    });
    await wrapper.find("input[type='file']").trigger("change");
    const reject = wrapper.emitted("reject");
    expect(reject?.length).toBe(1);
    expect((reject?.[0]?.[1] as { kind: string }).kind).toBe("type");
  });

  it("directory mode applies webkitdirectory attribute", () => {
    const wrapper = mount(FileUpload, { props: { modelValue: [], directory: true } });
    const input = wrapper.find("input[type='file']");
    expect(input.attributes("webkitdirectory")).toBe("");
    expect(input.attributes("directory")).toBe("");
  });

  it("remove button emits update:modelValue without the removed file", async () => {
    const wrapper = mount(FileUpload, {
      props: { modelValue: [{ id: "a", name: "a.pdf", size: 100 }] },
    });
    await wrapper.find(".sisyphos-file-upload-remove").trigger("click");
    expect(wrapper.emitted("update:modelValue")?.[0]?.[0]).toEqual([]);
  });
});
