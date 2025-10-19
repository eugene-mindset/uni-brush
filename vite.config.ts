import { defineConfig } from "vite";
import path from "node:path";
import pkg from "./package.json";
import electron from "vite-plugin-electron/simple";
import { rmSync } from "node:fs";
import preact from "@preact/preset-vite";

// https://vitejs.dev/config/
export default defineConfig(({ command }) => {
  rmSync("out", { recursive: true, force: true });

  const isServe = command === "serve";
  const isBuild = command === "build";
  const sourcemap = isServe || !!process.env.VSCODE_DEBUG;

  return {
    plugins: [
      preact(),
      electron({
        main: {
          // Shortcut of `build.lib.entry`.
          entry: "src/main/index.ts",
          onstart(args) {
            if (process.env.VSCODE_DEBUG) {
              console.log(/* For `.vscode/.debug.script.mjs` */ "[startup] Electron App");
            } else {
              args.startup();
            }
          },
          vite: {
            build: {
              rollupOptions: {
                external: ["@node-rs/crc32", "./src/utils"],
              },
              sourcemap,
              minify: isBuild,
              outDir: "out",
            },
          },
        },
        preload: {
          // Shortcut of `build.rollupOptions.input`.
          // Preload scripts may contain Web assets, so use the `build.rollupOptions.input` instead `build.lib.entry`.
          input: path.join(__dirname, "src/main/preload.ts"),
          vite: {
            build: {
              sourcemap: sourcemap ? "inline" : undefined, // #332
              minify: isBuild,
              outDir: "out",
            },
          },
        },
        // Polyfill the Electron and Node.js API for Renderer process.
        // If you want use Node.js in Renderer process, the `nodeIntegration` needs to be enabled in the Main process.
        // See 👉 https://github.com/electron-vite/vite-plugin-electron-renderer
        // renderer: process.env.NODE_ENV === 'test'
        //   // https://github.com/electron-vite/vite-plugin-electron-renderer/issues/78#issuecomment-2053600808
        //   ? undefined
        //   : {},
        renderer: {},
      }),
    ],
    server:
      process.env.VSCODE_DEBUG &&
      (() => {
        const url = new URL(pkg.debug.env.VITE_DEV_SERVER_URL);
        return {
          host: url.hostname,
          port: +url.port,
        };
      })(),
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    clearScreen: false,
  };
});
