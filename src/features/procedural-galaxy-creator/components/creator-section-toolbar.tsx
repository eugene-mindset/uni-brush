import { useState } from "react";

import { ActionOnlyButton, SVGIcons, ToggleComponent } from "@/components";

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

  return (
    <ToggleComponent isShown={toggle}>
      <ToggleComponent.Area>
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
      </ToggleComponent.Area>
      {toggle ? (
        <ActionOnlyButton className="core xs" onClick={() => setToggle(false)}>
          <SVGIcons.ArrowBarRight />
        </ActionOnlyButton>
      ) : (
        <ActionOnlyButton className="core xs" onClick={() => setToggle(true)}>
          <SVGIcons.List />
        </ActionOnlyButton>
      )}
    </ToggleComponent>
  );
};
