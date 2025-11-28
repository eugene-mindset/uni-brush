import { useEffect, useState } from "react";

import { Entity, EntityTypes } from "@/models";
import { useMainViewContext } from "@/store";
import { ThreeHelpers } from "@/util";
import { Panel } from "@/components";
import { useAtomValue } from "jotai";
import React from "react";

export const StarSystemEditor: React.FC<{}> = () => {
  const mainView = useMainViewContext();

  const selectValue = useAtomValue(mainView.pointer.select.ref);
  const [starSystem, setStarSystem] = useState<Entity.StarSystem.EntityType | null>(null);
  const [name, setName] = useState<string>("");

  const saveChanges = () => {
    if (!starSystem) return;
    if (name === starSystem.name) return;
    if (name === "" && !starSystem.name) return;

    starSystem.name = name;
  };

  const onInputName = (event: React.MouseEvent<HTMLInputElement, MouseEvent>) => {
    setName(event.currentTarget.value || "");
  };

  useEffect(() => {
    if (selectValue?.refType === EntityTypes.STAR_SYSTEM) {
      saveChanges();
      const newStarSystem = selectValue?.refEntity as Entity.StarSystem.EntityType;
      setStarSystem(newStarSystem);
      setName(newStarSystem.name || "");
    } else {
      setStarSystem(null);
    }
  }, [selectValue]);

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
            Galactic Position:{" "}
            {ThreeHelpers.ThreeVector3ToString(starSystem.initialPosition, "point")}
          </span>
        </div>

        <div>
          <span>Public ID: {starSystem.publicId}</span>
        </div>

        <button className="bottom" onClick={saveChanges}>
          Submit
        </button>
      </Panel>
    );
  }

  return <React.Fragment />
};
