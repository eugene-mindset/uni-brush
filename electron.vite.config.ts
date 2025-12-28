/// <reference types="vitest/config" />

import react from "@vitejs/plugin-react";
import { defineConfig, defineViteConfig, externalizeDepsPlugin } from "electron-vite";
import { resolve } from "path";

export default defineConfig(({ command }) => {
  // rmSync('out', { recursive: true, force: true })

  const isServe = command === "serve";
  const isBuild = false; // command === 'build'
  const sourcemap = isServe || !!process.env.VSCODE_DEBUG;

  return {
    main: {
      plugins: [externalizeDepsPlugin()],
      build: {
        sourcemap,
        rollupOptions: {
          input: "src/main/index.ts",
        },
        // external: ["src/utils"],
        minify: isBuild,
        // outDir: "out",
      },
    },
    preload: {
      plugins: [externalizeDepsPlugin()],
      build: {
        sourcemap: sourcemap ? "inline" : undefined,
        rollupOptions: {
          input: "src/preload/index.ts",
        },
        minify: isBuild,
      },
    },
    renderer: defineViteConfig({
      root: resolve("src"),
      plugins: [
        react({
          babel: {
            plugins: ["babel-plugin-react-compiler"],
          },
        }),
      ],
      build: {
        rollupOptions: {
          input: "src/index.html",
        },
        minify: isBuild,
      },
      resolve: {
        alias: {
          "@": resolve("src"),
        },
        preserveSymlinks: true,
      },
    }),
  };
});
