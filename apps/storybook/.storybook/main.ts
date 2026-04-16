import type { StorybookConfig } from "@storybook/react-vite";
import { mergeConfig } from "vite";
import path from "path";

const rootDir = path.resolve(__dirname, "../../../");

const config: StorybookConfig = {
  stories: [
    path.join(rootDir, "packages/**/*.stories.@(js|jsx|ts|tsx)").replace(/\\/g, "/"),
    path.join(rootDir, "apps/storybook/stories/**/*.@(mdx|stories.@(js|jsx|ts|tsx))").replace(/\\/g, "/"),
  ],
  addons: [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/addon-docs",
    "@storybook/addon-a11y",
  ],
  framework: {
    name: "@storybook/react-vite",
    options: {},
  },
  async viteFinal(config) {
    return mergeConfig(config, {
      // No resolve.alias — pnpm workspace symlinks already wire node_modules/@sisyphos-ui/*
      // to the workspace packages. Adding src-aliases caused SCSS path collisions (src/src/...).
      css: {
        preprocessorOptions: {
          scss: {
            loadPaths: [
              path.resolve(rootDir, "node_modules"),
              path.resolve(rootDir, "packages"),
            ],
          },
        },
      },
      server: {
        fs: {
          allow: [rootDir],
        },
      },
    });
  },
};

export default config;
