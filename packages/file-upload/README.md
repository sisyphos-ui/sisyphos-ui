# @sisyphos-ui/file-upload

Drag-and-drop file upload with validation (accept/maxSize/maxFiles), per-file progress, preview, and custom rendering.

## Usage

```tsx
import "@sisyphos-ui/core/styles.css";
import "@sisyphos-ui/file-upload/styles.css";
import { FileUpload, UploadedFile } from "@sisyphos-ui/file-upload";

const [files, setFiles] = useState<UploadedFile[]>([]);

<FileUpload
  label="Attachments"
  value={files}
  onChange={setFiles}
  accept=".pdf,.docx,image/*"
  supportedFormats={["PDF", "DOCX", "PNG", "JPG"]}
  maxSize={10 * 1024 * 1024}
  maxFiles={5}
  onReject={(file, reason) => toast.error(`${file.name}: ${reason.kind}`)}
/>
```

### Uploading files

`FileUpload` is controlled — you own the list. Wire it to your uploader:

```tsx
const [files, setFiles] = useState<UploadedFile[]>([]);

const handleChange = async (next: UploadedFile[]) => {
  // Kick off uploads for any pending items
  for (const f of next) {
    if (f.status !== "pending" || !f.file) continue;
    setFiles((xs) => xs.map((x) => x.id === f.id ? { ...x, status: "uploading", progress: 0 } : x));
    try {
      const url = await api.upload(f.file, (progress) => {
        setFiles((xs) => xs.map((x) => x.id === f.id ? { ...x, progress } : x));
      });
      setFiles((xs) => xs.map((x) => x.id === f.id ? { ...x, status: "success", url } : x));
    } catch (err) {
      setFiles((xs) => xs.map((x) => x.id === f.id ? { ...x, status: "error", error: String(err) } : x));
    }
  }
  setFiles(next);
};
```

## Props

| Prop | Type | Default |
|------|------|---------|
| `value` | `UploadedFile[]` | – |
| `onChange` | `(files) => void` | – |
| `label` | `string` | – |
| `accept` | `string` (HTML accept) | – |
| `maxSize` | `number` (bytes) | `10_485_760` (10 MB) |
| `maxFiles` | `number` | `1` |
| `multiple` | `boolean` | `maxFiles > 1` |
| `supportedFormats` | `string[]` | – |
| `onReject` | `(file, reason) => void` | – |
| `renderFile` | `(file, { remove }) => ReactNode` | built-in row |
| `labels` | `FileUploadLabels` | English defaults |
| `error` / `errorMessage` | – | – |

### `UploadedFile`

```ts
interface UploadedFile {
  id: string;
  file?: File;         // new pick
  name: string;
  size?: number;
  url?: string;        // pre-uploaded
  preview?: string;    // auto for images
  status?: "pending" | "uploading" | "success" | "error";
  progress?: number;   // 0-100
  error?: string;
}
```

### `labels` (i18n)

Pass custom strings — all optional:

```ts
{
  placeholder: "Dosya bırak veya",
  selectButton: "Seç",
  supportedFormats: "Desteklenen biçimler:",
  maxSize: (bytes) => `Maks. ${Math.round(bytes / 1024 / 1024)}MB`,
  uploading: "Yükleniyor",
  completed: "Tamamlandı",
  remove: "Kaldır",
}
```
