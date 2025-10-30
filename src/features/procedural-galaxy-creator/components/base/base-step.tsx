import { Panel, SVGIcons } from "@/components";

import { ModelStepDynamicInput } from "../base";
import StepConfigTable from "./step-config-tables";

import { Creator } from "@/models";
import { ToggleComponent } from "@/components/toggle";
import { ActionOnlyButton } from "@/components/buttons";

interface Props<K extends Object, T extends Creator.Base.Step<any, K>> {
  step: T;
  order: number;
  onDelete?: () => void;
  onMove?: (dir: "up" | "down") => void;
  onDuplicate?: () => void;
}

export const BaseStepComponent = <K extends Object, T extends Creator.Base.Step<any, K>>(
  props: Props<K, T>
) => {
  const { step } = props;
  const stepProperties = StepConfigTable[step.stepKey];

  return (
    <Panel.Group>
      <ToggleComponent>
        <Panel.Header canToggle="header-big" className="gap">
          <h5 className="flex-fill">
            {props.order}: {stepProperties.header}
          </h5>
          {props.onMove && (
            <ActionOnlyButton
              className="core xs"
              onClick={() => props?.onMove && props.onMove("up")}
            >
              <SVGIcons.ArrowUp />
            </ActionOnlyButton>
          )}
          {props.onMove && (
            <ActionOnlyButton
              className="core xs"
              onClick={() => props?.onMove && props.onMove("down")}
            >
              <SVGIcons.ArrowDown />
            </ActionOnlyButton>
          )}
          {props.onDuplicate && (
            <ActionOnlyButton className="core xs" onClick={props.onDuplicate}>
              <SVGIcons.Copy />
            </ActionOnlyButton>
          )}
          {props.onDelete && (
            <ActionOnlyButton className="core xs" onClick={props.onDelete}>
              <SVGIcons.Delete />
            </ActionOnlyButton>
          )}
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
