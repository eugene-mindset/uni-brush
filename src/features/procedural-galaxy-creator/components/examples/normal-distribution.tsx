import { Panel } from "@/components";
import { Generators } from "@/models/creator";

import { ModelStepInput, ModelStepVectorInput } from "../base";

interface Props {
  step: Generators.NormalDistributionVector;
  order: number;
}

export const NormalDistribution: React.FC<Props> = (props) => {
  const { step } = props;

  return (
    <Panel.Group>
      <Panel.Header>
        <h3>{props.order}: Normal Distribution Generator</h3>
      </Panel.Header>
      <div className="flex-col gap">
        <ModelStepInput<typeof step.config, Generators.NormalDistributionVector>
          inputType="number"
          step={step}
          configKey="normalDev"
          labelText="Normal Deviation Ratio"
        />
        <ModelStepVectorInput<typeof step.config, Generators.NormalDistributionVector>
          step={step}
          configKey="dim"
          labelText="Galaxy Size"
        />
      </div>
    </Panel.Group>
  );
};
