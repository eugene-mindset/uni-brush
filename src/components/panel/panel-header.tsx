import React from "react";
import classNames from "classnames";

import styles from "./style.module.css";
import { CommonProps } from "./types";
import { ToggleComponent, useToggle } from "../toggle";
import { SVGIcons } from "../icons";

export interface Props extends CommonProps {
  canToggle?: "header-small" | "header-big";
}

export const PanelHeader: React.FC<Props> = (props: Props) => {
  const { toggle, onToggle } = useToggle();

  return (
    <div
      className={classNames(
        "flex-row",
        toggle && styles.header,
        props.className,
        props.canToggle === "header-small" && styles.hover,
      )}
      onClick={props.canToggle === "header-small" ? onToggle : undefined}
    >
      {React.Children.toArray(props?.children)}
      {props.canToggle === "header-small" &&
        (toggle ? <SVGIcons.CaretUpFill /> : <SVGIcons.CaretDownFill />)}
      {props.canToggle === "header-big" && <ToggleComponent.Button className="fit" />}
    </div>
  );
};
