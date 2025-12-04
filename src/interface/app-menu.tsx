import { Fragment, useEffect, useState } from "react";

import { useStarSystemManager } from "@/hooks";

// TODO: UI needs to get cleaned up
export const AppMenu: React.FC = () => {
  const starSystemManager = useStarSystemManager();
  const [showMenu, setShowMenu] = useState<boolean>(false);

  // TODO: move the hiding and showing of menus from keys to global state
  const onKeyDown = (event: KeyboardEvent) => {
    if (event.key === "Escape") setShowMenu((x) => !x);
  };

  const onClick = (_: MouseEvent) => {
    // TODO: figure out how to dismiss modal when clicking outside of it
  };

  // TODO: don't to save and load calls here
  const onSaveClick = async () => {
    const files = [{ content: starSystemManager.dump(), path: "star_systems.json" }];
    const outputFile = await window.ipcRenderer.invoke("ub:saveProjectFile", files);
    console.log(outputFile); // TODO: add better logging
  };

  const onLoadClick = async () => {
    const contents = await window.ipcRenderer.invoke("ub:loadProjectFile");
    for (const { content, path } of contents) {
      if (path === "star_systems.json") {
        starSystemManager.load(content);
      }
    }
  };

  const onQuitClick = async () => {
    window.ipcRenderer.invoke("ub:quit");
  };

  useEffect(() => {
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("click", onClick);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("click", onClick);
    };
  }, []);

  return showMenu ? (
    <dialog id="app-menu" className="core-div modal">
      <button className="core large" onClick={onLoadClick}>
        Load
      </button>
      <button className="core large" onClick={onSaveClick}>
        Save
      </button>
      <button className="core large" onClick={onQuitClick}>
        Quit
      </button>
    </dialog>
  ) : (
    <Fragment />
  );
};
