import { FunctionalComponent, toChildArray } from "preact";
import classNames from "classnames";

import styles from "./panel.module.css";
import { CommonProps } from "./types";

interface Props extends CommonProps {}

export const PanelGroup: FunctionalComponent<Props> = (props: Props) => {
  return (
    <div className={classNames(styles.group, props?.className)}>
      {toChildArray(props?.children)}
    </div>
  );
};
