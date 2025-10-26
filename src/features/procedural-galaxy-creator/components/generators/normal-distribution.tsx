import { FunctionComponent } from "preact";
import { useState } from "preact/hooks";

import { Panel } from "@/components";

import { Generators } from "../../model";
import { Vector3 } from "three";
import { updateConfig } from "../base/utils";

interface Props {
  step: Generators.NormalDistribution;
  order: number;
}

export const NormalDistribution: FunctionComponent<Props> = (props) => {
  const { step } = props;

  const [_dim, setDim] = useState(step.config.dim);
  const [_normalDev, setNormalDev] = useState(step.config.normalDev);

  const onDevInput = (value: string) => {
    setNormalDev(parseFloat(value));
    updateConfig(step, { normalDev: parseFloat(value) });
  };

  const onVectorInput = (vec: Vector3) => {
    setDim(vec);
    updateConfig(step, { dim: vec });
  };

  return (
    <Panel.Group>
      <Panel.Header>
        <h3>{props.order}: Normal Distribution Generator</h3>
      </Panel.Header>
      <div className="flex-col gap">
        <Panel.Input
          type="number"
          labelText="Normal Deviation Ratio"
          value={props.step.config.normalDev}
          onInput={(event) => onDevInput(event.currentTarget.value)}
        />
        <Panel.VectorInput
          labelText="Galaxy Size"
          value={props.step.config.dim}
          setValue={onVectorInput}
        />
      </div>
    </Panel.Group>
  );
};
