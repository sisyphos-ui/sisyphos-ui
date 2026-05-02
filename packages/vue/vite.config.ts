import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { resolve } from "node:path";

export default defineConfig({
  plugins: [vue()],
  build: {
    lib: {
      entry: resolve(__dirname, "src/index.ts"),
      name: "SisyphosUiVue",
      fileName: "sisyphos-ui-vue",
      formats: ["es", "umd"],
    },
    rollupOptions: {
      external: ["vue", "@sisyphos-ui/core"],
      output: {
        globals: {
          vue: "Vue",
          "@sisyphos-ui/core": "SisyphosUiCore",
        },
      },
    },
    sourcemap: true,
    emptyOutDir: true,
  },
});
