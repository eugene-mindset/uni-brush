import { dialog } from "electron";

export async function handleFileSave() {
  const { canceled, filePath } = await dialog.showSaveDialog({});
  if (!canceled) {
    return filePath;
  }
}
