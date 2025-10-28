import classNames from "classnames";
import { FunctionalComponent, JSX, Ref, toChildArray } from "preact";

import { useRef } from "preact/hooks";
import { HTMLInputTypeAttribute } from "react-dom/src";

import styles from "./panel.module.css";
import { CommonProps } from "./types";

interface Props extends CommonProps {
  labelText?: string;
  type?: HTMLInputTypeAttribute;
  key?: string;
  value?: string | number;
  onInput?: (
    event: JSX.TargetedInputEvent<HTMLInputElement>,
    ref: Ref<HTMLInputElement | null>
  ) => void;
}

export const PanelInput: FunctionalComponent<Props> = (props: Props) => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const onInput = (event: JSX.TargetedInputEvent<HTMLInputElement>) => {
    if (!props.onInput) return;
    props.onInput(event, inputRef);
  };

  return (
    <div className={classNames(styles.input, props.className)}>
      <label>{props.labelText}</label>
      <input ref={inputRef} type={props.type} value={props.value} onInput={onInput} />
      {toChildArray(props?.children)}
    </div>
  );
};
