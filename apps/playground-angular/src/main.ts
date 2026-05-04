import "zone.js";
import { bootstrapApplication } from "@angular/platform-browser";
import "@sisyphos-ui/angular/styles.css";
import { AppComponent } from "./app.component";

bootstrapApplication(AppComponent).catch((err) => {
  console.error(err);
});
