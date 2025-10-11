import { FunctionalComponent, JSX } from "preact";
import { useState } from "preact/hooks";

import AppMenu from "./app-menu";
import { StarSystemEditor } from "./star-system-editor";
import { StarSystemDirectory } from "./star-system-directory";
import MainToolbar from "./main-toolbar";

export const toolbarRoutes = [
  { name: "Geography", options: ["Terrain Editor", "System Directory"] },
  { name: "Civilization", options: ["Nations", "Species", "Diplomacy & Warfare"] },
  { name: "Transportation", options: ["Routes"] },
  { name: "Cartography", options: ["Measurement"] },
];

const panelToShow: Record<string, JSX.Element> = {
  "Geography, System Directory": <StarSystemDirectory />,
};

export const FullInterface: FunctionalComponent<{}> = ({}) => {
  const [selectedPath, setSelectedPath] = useState<[string, string]>(["", ""]);

  // const showStarSystemEditor = computed(() => {
  //   return mainView.pointer.intersect.ref.value?.type === EntityTypes.STAR_SYSTEM;
  // })
  // ;

  const onRouteSelected = (path: [string, string]) => {
    setSelectedPath(path);
  };

  console.log("render full interface");
  return (
    <div className="interface">
      <AppMenu />
      <MainToolbar routes={toolbarRoutes} onPathSelected={onRouteSelected} path={selectedPath} />
      <div className="panels" hidden>
        {panelToShow[selectedPath.join(", ")]}
      </div>
      <StarSystemEditor />
    </div>
  );
};

export default FullInterface;
