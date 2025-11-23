import { FunctionalComponent } from "preact";
import { Vector3 } from "three";

import styles from "./style.module.css";

import { PanelInput } from "./panel-input";
import classNames from "classnames";

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
    <div className={classNames(styles.input, "flex-row", "gap", "fit-in-container")}>
      {props?.labelText && <label className={styles.full}>{props.labelText}</label>}
      <PanelInput
        type="number"
        labelText="x = "
        value={props.value.x}
        onInput={(event) => onVectorInput("x", event.currentTarget.value)}
      />
      <PanelInput
        type="number"
        labelText="y ="
        value={props.value.y}
        onInput={(event) => onVectorInput("y", event.currentTarget.value)}
      />
      <PanelInput
        type="number"
        labelText="z ="
        value={props.value.z}
        onInput={(event) => onVectorInput("z", event.currentTarget.value)}
      />
    </div>
  );
};
