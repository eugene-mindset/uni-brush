import { Panel } from "@/components";

import { ModelStepDynamicInput } from "../base";
import StepConfigTable from "./step-config-tables";

import { Creator } from "@/models";
import { ToggleComponent } from "@/components/toggle";

interface Props<K extends Object, T extends Creator.Base.Step<any, K>> {
  step: T;
  order: number;
}

export const BaseStepComponent = <K extends Object, T extends Creator.Base.Step<any, K>>(
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
            {/* // TODO: add ordering */}
            {Object.keys(step.config).map((value) => (
              <ModelStepDynamicInput step={step} configKey={value as keyof K} />
            ))}
          </div>
        </ToggleComponent.Area>
      </ToggleComponent>
    </Panel.Group>
  );
};
