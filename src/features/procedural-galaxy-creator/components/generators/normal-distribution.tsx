import { FunctionComponent } from "preact";
import { useEffect } from "preact/hooks";

import { Panel } from "@/components";

import { Generators } from "../../logic";
import { Vector3 } from "three";

interface Props {
  generator: Generators.NormalDistribution;
  order: number;
}

export const NormalDistribution: FunctionComponent<Props> = (props) => {
  const { generator } = props;

  const onVectorInput = (vec: Vector3) => {
    props.generator.setConfig({ ...generator.config, dim: vec });
  };

  useEffect(() => {}, [generator.config]);

  return (
    <Panel.Group>
      <Panel.Header>
        <h3>{props.order}: Normal Distribution Generator</h3>
      </Panel.Header>
      <div className="flex-col gap">
        <Panel.Input
          type="number"
          labelText="Normal Deviation Ratio"
          value={props.generator.config.normalDev}
        />
        <Panel.VectorInput
          labelText="Position"
          value={props.generator.config.dim}
          setValue={onVectorInput}
        />
      </div>
    </Panel.Group>
  );
};
