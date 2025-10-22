import { FunctionalComponent } from "preact";
import { useState } from "preact/hooks";
import { Vector3 } from "three";

import { PanelInput } from "./panel-input";

interface Props {
  labelText?: string;
  value: Vector3;
  setValue: (vec: Vector3) => void;
}

export const PanelVectorInput: FunctionalComponent<Props> = (props: Props) => {
  const onVectorInput = (axis: "x" | "y" | "z", value: string) => {
    const newVec = props.value.clone();
    newVec[axis] = parseFloat(value);

    props.setValue(newVec);
  };

  return (
    <div className="flex-row gap fit-in-container">
      {props?.labelText && <span>{props.labelText}</span>}
      <PanelInput
        type="number"
        labelText="X"
        value={props.value.x}
        onInput={(event) => onVectorInput("x", event.currentTarget.value)}
      />
      <PanelInput
        type="number"
        labelText="Y"
        value={props.value.y}
        onInput={(event) => onVectorInput("y", event.currentTarget.value)}
      />
      <PanelInput
        type="number"
        labelText="Z"
        value={props.value.z}
        onInput={(event) => onVectorInput("z", event.currentTarget.value)}
      />
    </div>
  );
};
