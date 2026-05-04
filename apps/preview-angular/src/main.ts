import "zone.js";
import { bootstrapApplication } from "@angular/platform-browser";
import { HostComponent } from "./host.component";

bootstrapApplication(HostComponent).catch((err) => {
  console.error(err);
});
