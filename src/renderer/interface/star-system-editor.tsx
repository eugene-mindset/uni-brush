import { FunctionalComponent, JSX } from "preact";
import { useState } from "preact/hooks";
import { useSignalEffect } from "@preact/signals";

import { Entity, EntityTypes } from "@/models";
import { useMainViewContext } from "@/store";
import { ThreeVector3ToString } from "@/util";

export const StarSystemEditor: FunctionalComponent<{}> = () => {
  const [starSystem, setStarSystem] = useState<Entity.StarSystem.EntityType>();
  const mainView = useMainViewContext();

  const [name, setName] = useState<string>("");

  const saveChanges = () => {
    if (!starSystem) return;

    starSystem.name = name;
  };

  const onInputName = (event: JSX.TargetedEvent<HTMLInputElement, Event>) => {
    setName(event.currentTarget.value || "");
  };

  useSignalEffect(() => {
    const setRef = mainView.pointer.intersect.ref.value;
    // if (starSystem) return;

    if (setRef?.type === EntityTypes.STAR_SYSTEM) {
      saveChanges();
      const newStarSystem = Entity.StarSystem.Manager.get(setRef.publicId);
      setStarSystem(newStarSystem);
      setName(newStarSystem.name || "");
    }
  });

  return (
    <div className="panel">
      <span>
        System Name: {starSystem?.name} <input value={name} onInput={onInputName} />
      </span>
      <span>Name: {starSystem?.name || ""}</span>
      <span>Description: {starSystem?.desc || ""}</span>
      <span>Galactic Position: {ThreeVector3ToString(starSystem?.initialPosition)}</span>
      <span>Public ID: {starSystem?.publicId}</span>
      <button onClick={saveChanges}>Submit</button>
    </div>
  );
};
