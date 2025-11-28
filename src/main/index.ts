import path from "node:path";
import { fileURLToPath } from "node:url";

import { app, shell, BrowserWindow, ipcMain } from "electron";
import { is, electronApp, optimizer } from "@electron-toolkit/utils";
import { installExtension, REACT_DEVELOPER_TOOLS } from "electron-extension-installer";
// import { createRequire } from "node:module";

import { handleProjectLoad, handleProjectSave } from "./comm";

// const require = createRequire(import.meta.url);
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// The built directory structure
//
// ├─┬─┬ dist
// │ │ └── index.html
// │ │
// │ ├─┬ out
// │ │ ├── main.js
// │ │ └── preload.mjs
// │

let win: BrowserWindow | null;

/**
 * Create window of app
 */
function createWindow() {
  win = new BrowserWindow({
    fullscreenable: true,
    fullscreen: true,
    webPreferences: {
      preload: path.join(__dirname, "../preload/index.js"),
      sandbox: false,
    },
  });

  // Test active push message to Renderer-process.
  win.webContents.on("did-finish-load", () => {
    win?.webContents.send("main-process-message", new Date().toLocaleString());
  });

  win.on("ready-to-show", () => {
    win?.show();
  });

  win.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url);
    return { action: "deny" };
  });

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env["ELECTRON_RENDERER_URL"]) {
    win.loadURL(process.env["ELECTRON_RENDERER_URL"]);
  } else {
    win.loadFile(path.join(__dirname, "../renderer/index.html"));
  }
}

/**
 * Setup electron app
 */
function startApp() {
  // Set app user model id for windows
  electronApp.setAppUserModelId("com.electron");

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on("browser-window-created", (_, window) => {
    optimizer.watchWindowShortcuts(window);
  });

  // create handles for ipc
  ipcMain.handle("ub:quit", () => app.quit());
  ipcMain.handle("ub:saveProjectFile", handleProjectSave);
  ipcMain.handle("ub:loadProjectFile", handleProjectLoad);

  // create main window
  createWindow();

  app.on("activate", function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
}

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
    win = null;
  }
});

app.on("activate", () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    startApp();
  }
});

// handle any important operations before fully closing
app.on("before-quit", () => {
  console.log("App is about to quit...");
});

// boot up app once ready
app.whenReady().then(startApp);

app.on("ready", async () => {
  await installExtension(REACT_DEVELOPER_TOOLS, {
    loadExtensionOptions: {
      allowFileAccess: true,
    },
  });
});
