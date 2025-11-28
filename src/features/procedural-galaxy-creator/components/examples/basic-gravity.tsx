import { Panel } from "@/components";
import { Operators } from "@/models/creator";

import { ModelStepInput, ModelStepVectorInput } from "../base";

interface Props {
  step: Operators.BasicGravity;
  order: number;
}

export const BasicGravity: React.FC<Props> = (props) => {
  const { step } = props;

  // NOTE: negative strength pushes rather than pulls
  return (
    <Panel.Group>
      <Panel.Header>
        <h3>{props.order}: Basic Gravity Operator</h3>
      </Panel.Header>
      <div className="flex-col gap">
        <ModelStepVectorInput<typeof step.config, Operators.BasicGravity>
          step={step}
          configKey="size"
          labelText="Size"
        />
        <ModelStepVectorInput<typeof step.config, Operators.BasicGravity>
          step={step}
          configKey="location"
          labelText="Position"
        />
        <ModelStepInput<typeof step.config, Operators.BasicGravity>
          step={step}
          configKey="strength"
          inputType="number"
          labelText="Strength"
        />
        <ModelStepInput<typeof step.config, Operators.BasicGravity>
          step={step}
          configKey="falloff"
          inputType="number"
          labelText="Fall Off"
        />
      </div>
    </Panel.Group>
  );
};
