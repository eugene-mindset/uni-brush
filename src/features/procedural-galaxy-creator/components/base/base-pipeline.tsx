import { Panel } from "@/components";

import { CreatorModel } from "@/models";
import { BaseStepComponent } from "./base-step";
import { ToggleComponent } from "@/components/toggle";

interface Props<V, T extends CreatorModel.Base.ModelValuePipeline<V>> {
  pipeline: T;
  property?: string;
}

export const BasePipelineComponent = <V, T extends CreatorModel.Base.ModelValuePipeline<V>>(
  props: Props<V, T>
) => {
  const { pipeline } = props;

  return (
    <Panel.Group>
      <ToggleComponent>
        <Panel.Header canToggle="header">
          <h4 className="flex-fill">{props?.property}</h4>
        </Panel.Header>
        <ToggleComponent.Area>
          {pipeline?.generator && <BaseStepComponent step={pipeline.generator} order={1} />}
          {pipeline?.operators &&
            pipeline.operators.map((x, i) => (
              <BaseStepComponent key={`x.stepKey_${i}`} step={x} order={i + 2} />
            ))}
        </ToggleComponent.Area>
      </ToggleComponent>
    </Panel.Group>
  );
};
