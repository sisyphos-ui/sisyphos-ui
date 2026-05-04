import { ChangeDetectionStrategy, Component } from "@angular/core";
import { FileUpload } from "@sisyphos-ui/angular";

@Component({
  standalone: true,
  selector: "demo-file-upload-default",
  imports: [FileUpload],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <sui-file-upload
      label="Profile photo"
      accept="image/*"
      [maxSize]="2 * 1024 * 1024"
    />
  `,
})
export class FileUploadDefaultDemo {}
