---
"@sisyphos-ui/file-upload": minor
"@sisyphos-ui/ui": minor
---

`<FileUpload>` learns two new optional props:

- `directory` — accepts an entire folder via the non-standard `webkitdirectory` attribute (Chromium / WebKit). Each picked file's `webkitRelativePath` is preserved so the parent app can reconstruct the original folder layout.
- `onBeforeRemove(file)` — called before a file is removed. Returning `false` (or a `Promise` that resolves to `false`) cancels the removal. Useful when the parent has to confirm with the user or revoke a server-side resource before the row disappears. When omitted, removal stays unconditional.

The progress / status surface (already on `UploadedFile`) is unchanged — pre-uploaded "existing" files still flow through `value` items that carry a `url` instead of a `file`.
