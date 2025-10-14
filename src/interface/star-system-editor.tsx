import { FunctionalComponent, JSX } from "preact";
import { useState } from "preact/hooks";
import { useSignalEffect } from "@preact/signals";

import { Entity, EntityTypes } from "@/models";
import { useMainViewContext } from "@/store";
import { ThreeHelpers } from "@/util";
import { Panel } from "@/components";

export const StarSystemEditor: FunctionalComponent<{}> = () => {
  const [starSystem, setStarSystem] = useState<Entity.StarSystem.EntityType | null>(null);
  const mainView = useMainViewContext();

  const [name, setName] = useState<string>("");

  const saveChanges = () => {
    if (!starSystem) return;
    if (name === starSystem.name) return;
    if (name === "" && !starSystem.name) return;

    starSystem.name = name;
  };

  const onInputName = (event: JSX.TargetedEvent<HTMLInputElement, Event>) => {
    setName(event.currentTarget.value || "");
  };

  useSignalEffect(() => {
    const setRef = mainView.pointer.select.ref.value;
    // if (starSystem) return;

    if (setRef?.refType === EntityTypes.STAR_SYSTEM) {
      saveChanges();
      const newStarSystem = setRef?.refEntity as Entity.StarSystem.EntityType;
      setStarSystem(newStarSystem);
      setName(newStarSystem.name || "");
    } else {
      setStarSystem(null);
    }
  });

  if (starSystem) {
    const panelTitle = starSystem.name || "Untitled";

    return (
      <Panel
        title={panelTitle}
        className="small-editor"
        position="absolute"
        floatX="right"
        floatY="bottom"
        width="350px"
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
};
