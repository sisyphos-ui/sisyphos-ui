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
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./vitest.setup.ts"],
    include: ["src/**/*.{test,spec}.ts"],
    exclude: ["**/node_modules/**", "**/dist/**"],
    // The @analogjs/vite-plugin-angular pipeline segfaulted under Node 20
    // when vitest used multiple worker forks in parallel. Switching to the
    // threads pool sidesteps the native-module crash while keeping each
    // test file in its own isolated worker.
    pool: "threads",
  },
  define: {
    "import.meta.vitest": "undefined",
  },
});
