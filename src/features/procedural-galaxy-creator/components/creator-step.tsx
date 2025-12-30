import { Panel } from "@/components";
import { ToggleComponent } from "@/components/toggle";
import { Creator } from "@/models";

import { CreatorSectionToolbar } from "./creator-section-toolbar";
import { CreatorStepDynamicInput } from "./creator-step-input";
import ConfigTables from "./step-config-tables";

interface Props<K extends object, T extends Creator.Base.Step<unknown, K>> {
  step: T;
  order: number;
  onDelete?: () => void;
  onDuplicate?: () => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  onSet?: () => void;
}

export const CreatorStepEditor = <K extends object, T extends Creator.Base.Step<unknown, K>>(
  props: Props<K, T>,
) => {
  const { StepConfigTable } = ConfigTables;
  const { step } = props;
  const stepProperties = StepConfigTable[step.stepKey];

  return (
    <Panel.Group>
      <ToggleComponent>
        <Panel.Header canToggle="header-big" className="gap">
          <h5 className="flex-fill">
            {props.order}: {stepProperties.header}
          </h5>
          <CreatorSectionToolbar
            onDelete={props.onDelete}
            onDuplicate={props.onDuplicate}
            onMoveDown={props.onMoveDown}
            onMoveUp={props.onMoveUp}
            onSet={props.onSet}
          />
        </Panel.Header>
        <ToggleComponent.Area>
          <div className="flex-col gap">
            {/* // TODO: add ordering */}
            {Object.keys(step.config).map((value) => (
              <CreatorStepDynamicInput key={value} step={step} configKey={value as keyof K} />
            ))}
          </div>
        </ToggleComponent.Area>
      </ToggleComponent>
    </Panel.Group>
  );
};
