import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  build: {
    // Fail loudly on missing externals.
    sourcemap: false,
    minify: false,
    target: "es2020",
  },
});
