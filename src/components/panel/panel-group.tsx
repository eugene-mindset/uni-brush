import React from "react";
import classNames from "classnames";

import styles from "./style.module.css";
import { CommonProps } from "./types";

export interface Props extends CommonProps {}

export const PanelGroup: React.FC<Props> = (props: Props) => {
  return (
    <div className={classNames(styles.group, props?.className)}>
      {React.Children.toArray(props?.children)}
    </div>
  );
};
