import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import vue from "@vitejs/plugin-vue";

export default defineConfig({
  // The React + Vue plugins coexist cleanly: each only handles its own
  // file types (JSX/TSX for react, .vue SFCs for vue), so there's no
  // double-processing on shared TS files.
  plugins: [react(), vue()],
  resolve: {
    dedupe: ["react", "react-dom", "react/jsx-runtime", "vue"],
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./vitest.setup.ts"],
    include: ["packages/**/*.{test,spec}.{ts,tsx}"],
    exclude: [
      "**/node_modules/**",
      "**/dist/**",
      // Angular has its own vitest config — it processes TS via @analogjs's
      // angular plugin, which would clash with the React/Vue plugins here.
      "packages/angular/**",
    ],
    server: {
      deps: {
        inline: [/@sisyphos-ui\//],
      },
    },
  },
});
