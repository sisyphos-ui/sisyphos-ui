/// <reference types="vitest" />
/**
 * Angular has its own Vitest config because @analogjs/vite-plugin-angular
 * processes every .ts file looking for Angular decorators. Mixing it into
 * the root vitest config (which serves React + Vue) would attempt to
 * compile JSX/TSX files as Angular and break those test runs.
 *
 * Run via `pnpm --filter @sisyphos-ui/angular test`.
 */
import { defineConfig } from "vitest/config";
import angular from "@analogjs/vite-plugin-angular";

export default defineConfig({
  plugins: [
    angular({
      tsconfig: "./tsconfig.spec.json",
      inlineStylesExtension: "scss",
    }),
  ],
  css: {
    preprocessorOptions: {
      scss: { api: "modern-compiler" },
    },
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./vitest.setup.ts"],
    include: ["src/**/*.{test,spec}.ts"],
    exclude: ["**/node_modules/**", "**/dist/**"],
  },
  define: {
    "import.meta.vitest": "undefined",
  },
});
