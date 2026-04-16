import { defineConfig } from "tsup";
import { sassPlugin } from "esbuild-sass-plugin";
import { resolve } from "node:path";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["cjs", "esm"],
  dts: true,
  splitting: false,
  sourcemap: true,
  clean: true,
  treeshake: true,
  external: ["react", "react-dom", "@sisyphos-ui/core", "@sisyphos-ui/portal"],
  esbuildPlugins: [
    sassPlugin({
      loadPaths: [
        resolve(process.cwd(), "node_modules"),
        resolve(process.cwd(), "../../node_modules"),
      ],
    }),
  ],
});
