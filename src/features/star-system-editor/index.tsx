import { useAtomValue } from "jotai";
import { useCallback, useEffect, useState } from "react";
import React from "react";

import { Panel } from "@/components";
import { Entity, EntityTypes } from "@/models";
import { mainRenderPipelineSelectedAtom } from "@/store";
import { ThreeHelpers } from "@/util";

export const StarSystemEditor: React.FC = () => {
  const selectValue = useAtomValue(mainRenderPipelineSelectedAtom);
  const [starSystem, setStarSystem] = useState<Entity.StarSystemEntity | null>(null);
  const [name, setName] = useState<string>("");

  const saveChanges = useCallback(() => {
    if (!starSystem) return;
    if (name === starSystem.name) return;
    if (name === "" && !starSystem.name) return;

    starSystem.name = name;
  }, [name, starSystem]);

  const onInputName = (event: React.MouseEvent<HTMLInputElement, MouseEvent>) => {
    setName(event.currentTarget.value || "");
  };

  useEffect(() => {
    if (selectValue?.entityType === EntityTypes.STAR_SYSTEM) {
      saveChanges();
      const newStarSystem = selectValue?.entity as Entity.StarSystemEntity;
      setStarSystem(newStarSystem);
      setName(newStarSystem.name || "");
    } else {
      setStarSystem(null);
    }
  }, [saveChanges, selectValue]);

  if (starSystem) {
    const panelTitle = starSystem.name || "Untitled";

    return (
      <Panel
        title={panelTitle}
        position="absolute"
        floatX="right"
        floatY="bottom"
        width="450px"
        canToggle
        canDrag
      >
        <div>
          <span>System Name: {starSystem.name}</span>
          <input value={name} onInput={onInputName} />
        </div>

        <div>
          <span>Name: {starSystem.name || ""}</span>
        </div>

        <div>
          <span>Description: {starSystem.desc || ""}</span>
        </div>

        <div>
          <span>
            Galactic Position: {ThreeHelpers.ThreeVector3ToString(starSystem.initPos, "point")}
          </span>
        </div>

        <div>
          <span>Public ID: {starSystem.id}</span>
        </div>

        <button className="bottom" onClick={saveChanges}>
          Submit
        </button>
      </Panel>
    );
  }

  return <React.Fragment />;
};
