import { useState } from "react";

import { ActionOnlyButton, ControlledToggleComponent, SVGIcons } from "@/components";

export interface Props {
  onAdd?: () => void;
  onDelete?: () => void;
  onDuplicate?: () => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  onSet?: () => void;
}

export const CreatorSectionToolbar = (props: Props) => {
  const [toggle, setToggle] = useState(false);

  // TODO: fix react error

  // Cannot update a component (`ToggleAreaComponent`) while rendering a
  // different component (`ToggleComponent`). To locate the bad setState() call
  // inside `ToggleComponent`, follow the stack trace as described in
  // https://react.dev/link/setstate-in-render

  return (
    <ControlledToggleComponent isShown={toggle} onToggle={() => (x) => !x}>
      <ControlledToggleComponent.Area>
        {props.onAdd && (
          <ActionOnlyButton className="core xs" onClick={props.onAdd}>
            <SVGIcons.Plus />
          </ActionOnlyButton>
        )}
        {props.onSet && (
          <ActionOnlyButton className="core xs" onClick={props.onSet}>
            <SVGIcons.ArrowClockwise />
          </ActionOnlyButton>
        )}
        {props.onMoveDown && (
          <ActionOnlyButton className="core xs" onClick={props.onMoveDown}>
            <SVGIcons.ArrowDown />
          </ActionOnlyButton>
        )}
        {props.onMoveUp && (
          <ActionOnlyButton className="core xs" onClick={props.onMoveUp}>
            <SVGIcons.ArrowUp />
          </ActionOnlyButton>
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
      </ControlledToggleComponent.Area>
      {toggle ? (
        <ActionOnlyButton className="core xs" onClick={() => setToggle(false)}>
          <SVGIcons.ArrowBarRight />
        </ActionOnlyButton>
      ) : (
        <ActionOnlyButton className="core xs" onClick={() => setToggle(true)}>
          <SVGIcons.List />
        </ActionOnlyButton>
      )}
    </ControlledToggleComponent>
  );
};
