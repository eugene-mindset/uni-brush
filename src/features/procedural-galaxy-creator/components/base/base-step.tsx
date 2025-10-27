import { Panel } from "@/components";

import { ModelStepInput, ModelStepVectorInput } from "../base";
import StepConfigTable from "./step-config-tables";
import { Base } from "../../model";

interface Props<K extends Object, T extends Base.ModelStep<any, K>> {
  step: T;
  order: number;
}

export const BaseStepComponent = <K extends Object, T extends Base.ModelStep<any, K>>(
  props: Props<K, T>
) => {
  const { step } = props;
  const stepProperties = StepConfigTable[step.stepKey];

  console.log(step, stepProperties);

  return (
    <Panel.Group>
      <Panel.Header>
        <h3>
          {props.order}: {stepProperties.header}
        </h3>
      </Panel.Header>
      <div className="flex-col gap">
        {Object.keys(step.config).map((value) => {
          // TODO: add ordering
          const properties = stepProperties.config[value];

          if (!properties.type) return;
          if (properties.type === "vector") {
            return (
              <ModelStepVectorInput<typeof step.config, T>
                key={value}
                step={step}
                configKey={value as keyof K}
                labelText={properties.text}
              />
            );
          } else {
            return (
              <ModelStepInput<typeof step.config, T>
                key={value}
                inputType={properties.type}
                step={step}
                configKey={value as keyof K}
                labelText={properties.text}
              />
            );
          }
        })}
      </div>
    </Panel.Group>
  );
};
