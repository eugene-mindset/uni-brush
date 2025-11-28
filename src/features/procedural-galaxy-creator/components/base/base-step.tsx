import { Panel, SVGIcons } from "@/components";

import { ModelStepDynamicInput } from "../base";
import ConfigTables from "./step-config-tables";

import { Creator } from "@/models";
import { ToggleComponent } from "@/components/toggle";
import { ActionOnlyButton } from "@/components/buttons";

interface Props<K extends object, T extends Creator.Base.Step<never, K>> {
  step: T;
  order: number;
  onDelete?: () => void;
  onMove?: (dir: "up" | "down") => void;
  onDuplicate?: () => void;
  onSet?: () => void;
}

export const BaseStepComponent = <K extends object, T extends Creator.Base.Step<never, K>>(
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
          {props.onSet && (
            <ActionOnlyButton className="core xs" onClick={props.onSet}>
              <SVGIcons.ArrowClockwise />
            </ActionOnlyButton>
          )}
          {props.onMove && (
            <>
              <ActionOnlyButton
                className="core xs"
                onClick={() => props?.onMove && props.onMove("down")}
              >
                <SVGIcons.ArrowDown />
              </ActionOnlyButton>
              <ActionOnlyButton
                className="core xs"
                onClick={() => props?.onMove && props.onMove("up")}
              >
                <SVGIcons.ArrowUp />
              </ActionOnlyButton>
            </>
          )}
          {props.onDuplicate && (
            <ActionOnlyButton className="core xs" onClick={props.onDuplicate}>
              <SVGIcons.Copy />
            </ActionOnlyButton>
          )}
          {props.onDelete && (
            <ActionOnlyButton className="core xs" onClick={props.onDelete}>
              <SVGIcons.Trash />
            </ActionOnlyButton>
          )}
        </Panel.Header>
        <ToggleComponent.Area>
          <div className="flex-col gap">
            {/* // TODO: add ordering */}
            {Object.keys(step.config).map((value) => (
              <ModelStepDynamicInput key={value} step={step} configKey={value as keyof K} />
            ))}
          </div>
        </ToggleComponent.Area>
      </ToggleComponent>
    </Panel.Group>
  );
};
