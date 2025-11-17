import { FunctionalComponent } from "preact";

import { SVGIcons } from "@/components";
import { ActionOnlyButton } from "./ActionOnlyButton";

interface Props {
  toggle: boolean;
  onToggle: () => void;
  className?: string;
}

export const ToggleButton: FunctionalComponent<Props> = (props) => {
  const onClick = () => {
    props.onToggle();
  };

  return (
    <ActionOnlyButton onClick={onClick} className={props?.className}>
      {props.toggle ? <SVGIcons.CaretUpFill /> : <SVGIcons.CaretDownFill />}
    </ActionOnlyButton>
  );
};
