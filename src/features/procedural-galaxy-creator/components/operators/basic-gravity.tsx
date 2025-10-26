import { FunctionComponent } from "preact";
import { useState } from "preact/hooks";

import { Panel } from "@/components";

import { Operators } from "../../model";
import { Vector3 } from "three";
import { updateConfig } from "../base/utils";

interface Props {
  step: Operators.BasicGravity;
  order: number;
}

export const BasicGravity: FunctionComponent<Props> = (props) => {
  const { step } = props;

  const [_size, setSize] = useState(step.config.size);
  const [_location, setLocation] = useState(step.config.location);
  const [_strength, setStrength] = useState(step.config.strength);
  const [_falloff, setFalloff] = useState(step.config.falloff);

  const onSizeInput = (vec: Vector3) => {
    setSize(vec);
    updateConfig(step, { size: vec });
  };

  const onLocInput = (vec: Vector3) => {
    setLocation(vec);
    updateConfig(step, { location: vec });
  };

  const onStrengthInput = (value: string) => {
    setStrength(parseFloat(value));
    updateConfig(step, { strength: parseFloat(value) });
  };

  const onFallOffInput = (value: string) => {
    setFalloff(parseFloat(value));
    updateConfig(step, { falloff: parseFloat(value) });
  };

  // TODO: need to fix number inputs not takign negative
  // NOTE: negative strength pushes rather than pulls
  return (
    <Panel.Group>
      <Panel.Header>
        <h3>{props.order}: Basic Gravity Operator</h3>
      </Panel.Header>
      <div className="flex-col gap">
        <Panel.VectorInput labelText="Size" value={props.step.config.size} setValue={onSizeInput} />
        <Panel.VectorInput
          labelText="Position"
          value={props.step.config.location}
          setValue={onLocInput}
        />
        <Panel.Input
          type="number"
          labelText="Strength"
          value={props.step.config.strength}
          onInput={(event) => onStrengthInput(event.currentTarget.value)}
        />
        <Panel.Input
          type="number"
          labelText="Fall Off"
          value={props.step.config.falloff}
          onInput={(event) => onFallOffInput(event.currentTarget.value)}
        />
      </div>
    </Panel.Group>
  );
};
