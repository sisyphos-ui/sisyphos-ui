import { defineConfig } from "vite";
import angular from "@analogjs/vite-plugin-angular";

export default defineConfig({
  plugins: [
    angular({
      tsconfig: "./tsconfig.json",
      inlineStylesExtension: "scss",
    }),
  ],
  server: { port: 4380 },
  preview: { port: 4380 },
  optimizeDeps: {
    include: [
      "@angular/common",
      "@angular/core",
      "@angular/platform-browser",
      "@angular/platform-browser-dynamic",
      "rxjs",
      "rxjs/operators",
    ],
  },
});
