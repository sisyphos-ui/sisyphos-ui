import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { FileUpload } from "./FileUpload";
import type { UploadedFile } from "./types";

const meta: Meta<typeof FileUpload> = {
  title: "Components/FileUpload",
  component: FileUpload,
  tags: ["autodocs"],
};
export default meta;

type Story = StoryObj<typeof FileUpload>;

export const Default: Story = {
  render: () => {
    const [files, setFiles] = useState<UploadedFile[]>([]);
    return (
      <FileUpload
        label="Attachments"
        value={files}
        onChange={setFiles}
        accept=".pdf,.docx,.png,.jpg"
        supportedFormats={["PDF", "DOCX", "PNG", "JPG"]}
        maxSize={5 * 1024 * 1024}
      />
    );
  },
};

export const Multiple: Story = {
  render: () => {
    const [files, setFiles] = useState<UploadedFile[]>([]);
    return (
      <FileUpload
        label="Up to 5 files"
        value={files}
        onChange={setFiles}
        maxFiles={5}
        supportedFormats={["Any"]}
      />
    );
  },
};

export const WithProgress: Story = {
  render: () => {
    const [files, setFiles] = useState<UploadedFile[]>([
      { id: "1", name: "report.pdf", size: 320_000, status: "success" },
      { id: "2", name: "draft.docx", size: 120_000, status: "uploading", progress: 45 },
      { id: "3", name: "old.zip", size: 9_000_000, status: "error", error: "Too large" },
    ]);
    return <FileUpload label="Files" value={files} onChange={setFiles} maxFiles={5} />;
  },
};

export const Error: Story = {
  render: () => {
    const [files, setFiles] = useState<UploadedFile[]>([]);
    return (
      <FileUpload
        label="Required"
        value={files}
        onChange={setFiles}
        error
        errorMessage="Please attach at least one file"
      />
    );
  },
};
