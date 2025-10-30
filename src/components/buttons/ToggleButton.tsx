import { FunctionalComponent } from "preact";

import { SVGIcons } from "@/components";
import classNames from "classnames";

interface Props {
  toggle: boolean;
  onToggle: () => void;
  className?: string;
}

export const ToggleButton: FunctionalComponent<Props> = (props) => {
  return (
    <button className={classNames("core", "square", props?.className)} onClick={props.onToggle}>
      {props.toggle ? <SVGIcons.CaretUpFill /> : <SVGIcons.CaretDownFill />}
    </button>
  );
};
