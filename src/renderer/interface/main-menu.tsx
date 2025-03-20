import { StarSystemManager } from "@/models/star-system";
import "@/styles/ui.css";
import { Fragment, FunctionComponent } from "preact/compat";
import { useEffect, useRef, useState } from "preact/hooks";

// TODO: UI needs to get cleaned up
export const MainMenu: FunctionComponent<{}> = () => {
  const ref = useRef<HTMLDialogElement | undefined>(undefined);
  const [showMenu, setShowMenu] = useState<boolean>(false);

  // TODO: move the hiding and showing of menus from keys to global state
  const onKeyDown = (event: KeyboardEvent) => {
    if (event.key === "Escape") setShowMenu((x) => !x);
  };

  const onClick = (event: MouseEvent) => {
    // TODO: figure out how to dismiss modal when clicking outside of it
  };

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

  useEffect(() => {
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("click", onClick);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("click", onClick);
    };
  }, []);

  return showMenu ? (
    <dialog id="main-menu" ref={ref}>
      <button onClick={onLoadClick}>Load</button>
      <button onClick={onSaveClick}>Save</button>
    </dialog>
  ) : (
    <Fragment />
  );
};

export default MainMenu;
