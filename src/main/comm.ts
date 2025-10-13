import fs from "node:fs";
import { Buffer } from "node:buffer";
import { dialog } from "electron";
import archiver from "archiver";
import yauzl from "yauzl-promise";

import { streamToString } from "./utils";

/**
 * Opens a save dialog
 * @param _ Electron.IPC stuff
 * @param options dialog options for save
 * @returns filepath selected in dialog
 */
export async function handleFileSaveDialog(
  _?: Electron.IpcMainInvokeEvent,
  options: Electron.SaveDialogOptions = {}
) {
  const { canceled, filePath } = await dialog.showSaveDialog(options);

  if (!canceled) {
    return filePath;
  }
}

/**
 * Opens a load dialog
 * @param _ Electron.IPC stuff
 * @param options dialog options for load
 * @returns first filepath selected in dialog
 */
export async function handleFileOpenDialog(
  _?: Electron.IpcMainInvokeEvent,
  options: Electron.OpenDialogOptions = {}
) {
  const { canceled, filePaths } = await dialog.showOpenDialog(options);

  if (!canceled) {
    return filePaths[0];
  }
}

type ProjectJsonContent = { content: string; path: string }[];

/**
 * Opens a save dialog for a uni-brush project
 * @param _ Electron.IPC stuff
 * @param files files to save in final project file
 * @param dialogOptions options for project dialog
 * @returns full path of the file save
 */
export async function handleProjectSave(
  _?: Electron.IpcMainInvokeEvent,
  files?: ProjectJsonContent,
  dialogOptions?: Electron.SaveDialogOptions
): Promise<string> {
  if (!files) return "";

  const filePath = await handleFileSaveDialog(undefined, dialogOptions);

  if (!filePath) return "";

  const finalPath = filePath.endsWith(".ubpz") ? filePath : filePath + ".ubpz";
  if (fs.existsSync(finalPath)) fs.unlinkSync(finalPath);

  const output = fs.createWriteStream(finalPath);

  const archive = archiver("zip", {
    zlib: { level: 9 },
  });

  output.on("close", function () {
    console.log(archive.pointer() + " total bytes"); // TODO: add better logging
    console.log("archiver has been finalized and the output file descriptor has closed.");
  });

  output.on("end", function () {
    console.log("Data has been drained");
  });

  archive.on("warning", function (err) {
    if (err.code === "ENOENT") {
      console.log(err);
    } else {
      throw err;
    }
  });

  archive.on("error", function (err) {
    throw err;
  });

  archive.pipe(output);

  for (const file of files) {
    const buffer = Buffer.from(file.content);
    archive.append(buffer, { name: file.path });
  }

  archive.finalize();

  return finalPath;
}

/**
 * Opens a load dialog for a uni-brush project
 * @param _ Electron.IPC stuff
 * @param dialogOptions options for project dialog
 * @returns returns the full content needed to load project
 */
export async function handleProjectLoad(
  _?: Electron.IpcMainInvokeEvent,
  dialogOptions?: Electron.OpenDialogOptions
): Promise<ProjectJsonContent> {
  const filePath = await handleFileOpenDialog(undefined, dialogOptions);

  if (!filePath) return [];

  let fullContents: ProjectJsonContent = [];

  const zip = await yauzl.open(filePath);
  try {
    for await (const entry of zip) {
      if (entry.filename.endsWith("/")) {
        continue;
      } else {
        const readStream = await entry.openReadStream();
        const content = await streamToString(readStream);
        fullContents.push({ path: entry.filename, content });
      }
    }
  } finally {
    await zip.close();
  }

  return fullContents;
}
