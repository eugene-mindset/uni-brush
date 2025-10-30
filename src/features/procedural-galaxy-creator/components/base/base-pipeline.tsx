import { Panel } from "@/components";

import { Creator } from "@/models";
import { BaseStepComponent } from "./base-step";
import { ToggleComponent } from "@/components/toggle";
import { useEffect } from "preact/hooks";

interface Props<V, T extends Creator.Base.ValuePipeline<V>> {
  pipeline: T;
  property?: string;
}

export const BasePipelineComponent = <V, T extends Creator.Base.ValuePipeline<V>>(
  props: Props<V, T>
) => {
  const { pipeline } = props;

  useEffect(() => {}, [pipeline.generator, pipeline.operators]);

  return (
    <Panel.Group>
      <ToggleComponent>
        <Panel.Header canToggle="header-big">
          <h4 className="flex-fill">{props?.property}</h4>
        </Panel.Header>
        <ToggleComponent.Area>
          {pipeline?.generator && (
            <BaseStepComponent
              step={pipeline.generator}
              order={1}
              onDelete={() => pipeline.setGenerator()}
            />
          )}
          {pipeline?.operators &&
            pipeline.operators.map((x, i) => (
              <BaseStepComponent
                key={`x.stepKey_${i}`}
                step={x}
                order={i + 2}
                onDelete={() => pipeline.removeOperator(i)}
              />
            ))}
        </ToggleComponent.Area>
      </ToggleComponent>
    </Panel.Group>
  );
};
