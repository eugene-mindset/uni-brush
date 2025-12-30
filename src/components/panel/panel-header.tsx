import classNames from "classnames";
import React from "react";

import { SVGIcons } from "../icons";
import { ToggleComponent, useToggle } from "../toggle";
import styles from "./style.module.css";
import { CommonProps } from "./types";

export interface Props extends CommonProps {
  canToggle?: "header-small" | "header-big";
  toggleButtonClassName?: string;
}

export const PanelHeader: React.FC<Props> = (props: Props) => {
  const { toggleState, onToggle } = useToggle();

  return (
    <div
      className={classNames(
        "flex-row",
        toggleState && styles.header,
        props.className,
        props.canToggle === "header-small" && styles.hover,
      )}
      onClick={props.canToggle === "header-small" ? onToggle : undefined}
    >
      {React.Children.toArray(props?.children)}
      {props.canToggle === "header-small" &&
        (toggleState ? <SVGIcons.CaretUpFill /> : <SVGIcons.CaretDownFill />)}
      {props.canToggle === "header-big" && (
        <ToggleComponent.Button className={props.toggleButtonClassName || "xs"} />
      )}
    </div>
  );
};
