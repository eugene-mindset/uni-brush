import { StarSystemManager } from "@/models/star-system";
import "@/styles/ui.css";

// TODO: UI needs to get cleaned up
export const MainMenu = () => {
  const onSaveClick = async () => {
    const files = [{ content: StarSystemManager.dumpData(), path: "star_systems.json" }];
    const outputFile = await window.ipcRenderer.invoke("ub:saveProjectFile", files);
    console.log(outputFile); // TODO: add better logging
  };

  const onLoadClick = async () => {
    const contents = await window.ipcRenderer.invoke("ub:loadProjectFile");
    for (const { content, path } of contents) {
      if (path === "star_systems.json") {
        StarSystemManager.loadData(content);
      }
    }
  };

  return (
    <div>
      <button onClick={onLoadClick}>Load</button>
      <button onClick={onSaveClick}>Save</button>
    </div>
  );
};

export default MainMenu;
