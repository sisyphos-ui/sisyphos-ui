import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

export default defineConfig({
  plugins: [vue()],
  // Build into a sub-path so the docs site can mount the iframe at
  // `/previews/vue/index.html?demo=...` without colliding with other
  // static assets.
  base: "./",
  server: { port: 4480 },
  preview: { port: 4480 },
  build: {
    outDir: "dist",
    emptyOutDir: true,
  },
});
