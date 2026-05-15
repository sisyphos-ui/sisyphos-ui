import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

export default defineConfig({
  plugins: [vue()],
  css: {
    preprocessorOptions: {
      scss: { api: "modern-compiler" },
    },
  },
  server: { port: 4280 },
  preview: { port: 4280 },
});
