import { FunctionalComponent, JSX } from "preact";
import { useState } from "preact/hooks";
import { useSignalEffect } from "@preact/signals";

import { Entity, EntityTypes } from "@/models";
import { useMainViewContext } from "@/store";
import { ThreeHelpers } from "@/util";

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

  console.log(starSystem?.visual.object3D);
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
    return (
      <div id="system-viewer" className="panel core-div bottom">
        <span>
          System Name: {starSystem?.name} <input value={name} onInput={onInputName} />
        </span>
        <span>Name: {starSystem?.name || ""}</span>
        <span>Description: {starSystem?.desc || ""}</span>
        <span>
          Galactic Position:{" "}
          {ThreeHelpers.ThreeVector3ToString(starSystem?.initialPosition, "point")}
        </span>
        <span>Public ID: {starSystem?.publicId}</span>
        <button className="bottom" onClick={saveChanges}>
          Submit
        </button>
      </div>
    );
  }
};
