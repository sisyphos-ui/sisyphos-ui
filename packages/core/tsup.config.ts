import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts", "src/internal/index.ts"],
  outDir: "dist",
  format: ["cjs", "esm"],
  dts: true,
  splitting: false,
  sourcemap: true,
  clean: true,
  treeshake: true,
  external: ["react", "react-dom"],
});
