import { FunctionalComponent, toChildArray } from "preact";
import classNames from "classnames";

import styles from "./panel.module.css";
import { CommonProps } from "./types";
import { useToggle } from "../toggle";
import { SVGIcons } from "../icons";

interface Props extends CommonProps {
  canToggle?: "header";
}

export const PanelHeader: FunctionalComponent<Props> = (props: Props) => {
  const { toggle, onToggle } = useToggle();

  return (
    <div
      className={classNames(
        "flex-row",
        styles.header,
        props.className,
        props.canToggle && styles.hover
      )}
      onClick={props.canToggle && onToggle}
    >
      {toChildArray(props?.children)}
      {props.canToggle && (toggle ? <SVGIcons.CaretUpFill /> : <SVGIcons.CaretDownFill />)}
    </div>
  );
};
