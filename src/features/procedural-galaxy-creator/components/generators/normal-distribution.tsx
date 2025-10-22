import { FunctionComponent } from "preact";
import { useEffect, useState } from "preact/hooks";

import { Panel } from "@/components";

import { Generators } from "../../model";
import { Vector3 } from "three";
import { c } from "node_modules/vite/dist/node/types.d-aGj9QkWt";

interface Props {
  generator: Generators.NormalDistribution;
  order: number;
}

export const NormalDistribution: FunctionComponent<Props> = (props) => {
  const { generator } = props;

  const [dim, setDim] = useState(generator.config.dim);
  const [normalDev, setNormalDev] = useState(generator.config.normalDev);

  const onDevInput = (value: string) => {
    setNormalDev(parseFloat(value));
    generator.setConfig({
      dim,
      normalDev: parseFloat(value),
    });
  };

  const onVectorInput = (vec: Vector3) => {
    setDim(vec);
    generator.setConfig({
      dim: vec,
      normalDev,
    });
  };

  console.log(dim, normalDev);

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
          onInput={(event) => onDevInput(event.currentTarget.value)}
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
