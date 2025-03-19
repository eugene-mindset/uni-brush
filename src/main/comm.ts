import fs from "node:fs";
import { Buffer } from "node:buffer";

import { dialog } from "electron";
import archiver from "archiver";
import yauzl, { Entry } from "yauzl-promise";

export async function handleFileSaveDialog(
  _?: Electron.IpcMainInvokeEvent,
  options: Electron.SaveDialogOptions = {}
) {
  const { canceled, filePath } = await dialog.showSaveDialog(options);

  if (!canceled) {
    return filePath;
  }
}

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

export async function handleProjectSave(
  _?: Electron.IpcMainInvokeEvent,
  files?: ProjectJsonContent,
  dialogOptions?: Electron.SaveDialogOptions,
  useDialog?: boolean
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
    console.log(archive.pointer() + " total bytes");
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

function streamToString(stream: NodeJS.ReadableStream): Promise<string> {
  const chunks: any[] = [];
  return new Promise((resolve, reject) => {
    stream.on("data", (chunk) => chunks.push(Buffer.from(chunk)));
    stream.on("error", (err) => reject(err));
    stream.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
  });
}

export async function handleProjectLoad(
  _?: Electron.IpcMainInvokeEvent,
  dialogOptions?: Electron.OpenDialogOptions,
  useDialog?: boolean
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
