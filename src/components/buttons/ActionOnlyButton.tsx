import { FunctionalComponent, JSX } from "preact";

import classNames from "classnames";
import { useRef } from "preact/hooks";

interface Props extends JSX.HTMLAttributes<HTMLButtonElement> {}

export const ActionOnlyButton: FunctionalComponent<Props> = (props) => {
  const buttonRef = useRef<HTMLButtonElement>(null);

  const onClick = (event: JSX.TargetedMouseEvent<HTMLButtonElement>) => {
    props?.onClick && props.onClick(event);
    buttonRef.current?.blur();
  };

  return (
    <button
      ref={buttonRef}
      className={classNames("core", "square", props?.className)}
      onClick={onClick}
    >
      {props.children}
    </button>
  );
};
