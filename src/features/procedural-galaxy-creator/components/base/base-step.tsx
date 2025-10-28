import { Panel } from "@/components";

import { ModelStepInput, ModelStepVectorInput } from "../base";
import StepConfigTable from "./step-config-tables";

import { CreatorModel } from "@/models";
import { ToggleComponent } from "@/components/toggle";

interface Props<K extends Object, T extends CreatorModel.Base.Step<any, K>> {
  step: T;
  order: number;
}

export const BaseStepComponent = <K extends Object, T extends CreatorModel.Base.Step<any, K>>(
  props: Props<K, T>
) => {
  const { step } = props;
  const stepProperties = StepConfigTable[step.stepKey];

  return (
    <Panel.Group>
      <ToggleComponent isInitiallyShown>
        <Panel.Header canToggle="header">
          <h5 className="flex-fill">
            {props.order}: {stepProperties.header}
          </h5>
        </Panel.Header>
        <ToggleComponent.Area>
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
        </ToggleComponent.Area>
      </ToggleComponent>
    </Panel.Group>
  );
};
