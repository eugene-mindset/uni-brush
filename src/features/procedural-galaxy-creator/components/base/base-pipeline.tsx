import { ToggleComponent, Panel } from "@/components";
import { useTriggerUpdate } from "@/hooks";
import { Creator } from "@/models";

import { BaseStepComponent } from "./base-step";

interface Props<V, T extends Creator.Base.ValuePipeline<V>> {
  pipeline: T;
  property?: string;
}

export const BasePipelineComponent = <V, T extends Creator.Base.ValuePipeline<V>>(
  props: Props<V, T>
) => {
  const { pipeline } = props;

  const triggerStateChange = useTriggerUpdate();

  const onDeleteGenerator = () => {
    pipeline.setGenerator();
    triggerStateChange();
  };

  const onDeleteOperator = (index: number) => {
    pipeline.removeOperator(index);
    triggerStateChange();
  };

  const onDuplicateOperator = (index: number) => {
    pipeline.duplicateOperator(index);
    triggerStateChange();
  };

  return (
    <Panel.Group>
      <ToggleComponent>
        <Panel.Header canToggle="header-big">
          <h4 className="flex-fill">{props?.property}</h4>
        </Panel.Header>
        <ToggleComponent.Area>
          {pipeline?.generator && (
            <BaseStepComponent step={pipeline.generator} order={1} onDelete={onDeleteGenerator} />
          )}
          {pipeline?.operators &&
            pipeline.operators.map((x, i) => (
              <BaseStepComponent
                key={`x.stepKey_${i}`}
                step={x}
                order={i + 2}
                onDelete={() => onDeleteOperator(i)}
                onDuplicate={() => onDuplicateOperator(i)}
              />
            ))}
        </ToggleComponent.Area>
      </ToggleComponent>
    </Panel.Group>
  );
};
