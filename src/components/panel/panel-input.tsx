import classNames from "classnames";
import React, { HTMLInputTypeAttribute, Ref, useRef } from "react";

import styles from "./style.module.css";
import { CommonProps } from "./types";

export interface Props extends CommonProps {
  labelText?: string;
  type?: HTMLInputTypeAttribute;
  key?: string;
  value?: string | number;
  onInput?: (event: React.FormEvent<HTMLInputElement>, ref: Ref<HTMLInputElement | null>) => void;
}

export const PanelInput: React.FC<Props> = (props: Props) => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const onInput = (event: React.FormEvent<HTMLInputElement>) => {
    if (!props.onInput) return;
    props.onInput(event, inputRef);
  };

  return (
    <div className={classNames(styles.input, props.className)}>
      <label>{props.labelText}</label>
      <input
        className={classNames(props.type === "checkbox" && "flex-no-fill")}
        ref={inputRef}
        type={props.type}
        value={props.value}
        onInput={onInput}
      />
      {React.Children.toArray(props?.children)}
    </div>
  );
};
