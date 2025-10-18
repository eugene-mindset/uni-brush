import { FunctionalComponent, JSX } from "preact";
import { useState } from "preact/hooks";

import { StarSystemDirectory } from "@/features/star-system-directory";
import { StarSystemEditor } from "@/features/star-system-editor";
import { GeographyEditor } from "@/features/galaxy-generation";

import { AppMenu } from "./app-menu";
import { MainToolbar } from "./main-toolbar";

export const toolbarRoutes = [
  { name: "Geography", options: ["Editor", "Directory"] },
  { name: "Civilization", options: ["Nations", "Species", "Diplomacy & Warfare"] },
  { name: "Transportation", options: ["Routes"] },
  { name: "Cartography", options: ["Measurement"] },
];

const panelToShow: Record<string, JSX.Element> = {
  "Geography, Directory": <StarSystemDirectory />,
  "Geography, Editor": <GeographyEditor />,
};

export const FullInterface: FunctionalComponent<{}> = ({}) => {
  const [selectedPath, setSelectedPath] = useState<[string, string]>(["", ""]);

  // const showStarSystemEditor = computed(() => {
  //   return mainView.pointer.intersect.ref.value?.type === EntityTypes.STAR_SYSTEM;
  // })
  // ;

  const panelToDisplay = selectedPath[0] === "" ? "" : selectedPath.join(", ");
  const onRouteSelected = (path: [string, string]) => {
    setSelectedPath(path);
  };

  return (
    <div className="interface">
      <AppMenu />
      <div class="interface fixed">
        <MainToolbar routes={toolbarRoutes} onPathSelected={onRouteSelected} path={selectedPath} />
        {panelToDisplay !== "" && panelToShow[panelToDisplay]}
      </div>
      <div className="interface dynamic">
        <StarSystemEditor />
      </div>
    </div>
  );
};

export default FullInterface;
