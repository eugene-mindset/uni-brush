import { FunctionComponent } from "preact";

import { Panel } from "@/components";

import { Generators } from "../../model";
import { ModelStepInput, ModelStepVectorInput } from "../base";

interface Props {
  step: Generators.NormalDistribution;
  order: number;
}

export const NormalDistribution: FunctionComponent<Props> = (props) => {
  const { step } = props;

  return (
    <Panel.Group>
      <Panel.Header>
        <h3>{props.order}: Normal Distribution Generator</h3>
      </Panel.Header>
      <div className="flex-col gap">
        <ModelStepInput<typeof step.config, Generators.NormalDistribution>
          inputType="number"
          step={step}
          configKey="normalDev"
          labelText="Normal Deviation Ratio"
        />
        <ModelStepVectorInput<typeof step.config, Generators.NormalDistribution>
          step={step}
          configKey="dim"
          labelText="Galaxy Size"
        />
      </div>
    </Panel.Group>
  );
};
