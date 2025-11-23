import { FunctionalComponent, toChildArray } from "preact";
import classNames from "classnames";

import styles from "./style.module.css";
import { CommonProps } from "./types";
import { ToggleComponent, useToggle } from "../toggle";
import { SVGIcons } from "../icons";

interface Props extends CommonProps {
  canToggle?: "header-small" | "header-big";
}

export const PanelHeader: FunctionalComponent<Props> = (props: Props) => {
  const { toggle, onToggle } = useToggle();

  return (
    <div
      className={classNames(
        "flex-row",
        styles.header,
        props.className,
        props.canToggle === "header-small" && styles.hover
      )}
      onClick={props.canToggle === "header-small" ? onToggle : undefined}
    >
      {toChildArray(props?.children)}
      {props.canToggle === "header-small" &&
        (toggle ? <SVGIcons.CaretUpFill /> : <SVGIcons.CaretDownFill />)}
      {props.canToggle === "header-big" && <ToggleComponent.Button className="fit" />}
    </div>
  );
};
