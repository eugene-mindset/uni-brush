import React, { useState } from "react";

import { ProceduralGalaxyCreator } from "@/features/procedural-galaxy-creator";
import { StarSystemDirectory } from "@/features/star-system-directory";
import { StarSystemEditor } from "@/features/star-system-editor";

import { AppMenu } from "./app-menu";
import { MainToolbar } from "./main-toolbar";

const toolbarRoutes = [
  { name: "Geography", options: ["Procedural Creator", "Directory"] },
  { name: "Civilization", options: ["Nations", "Species", "Diplomacy & Warfare"] },
  { name: "Transportation", options: ["Routes"] },
  { name: "Cartography", options: ["Measurement"] },
];

const panelToShow: Record<string, React.ReactNode> = {
  "Geography, Directory": <StarSystemDirectory />,
  "Geography, Procedural Creator": <ProceduralGalaxyCreator />,
};

export const FullInterface: React.FC = () => {
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
      <div className="interface fixed">
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
