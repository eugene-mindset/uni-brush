import { useRef, HTMLAttributes } from "react";
import classNames from "classnames";

interface Props extends HTMLAttributes<HTMLButtonElement> {}

export const ActionOnlyButton: React.FC<Props> = (props) => {
  const buttonRef = useRef<HTMLButtonElement>(null);

  const onClick = (event: React.MouseEvent<HTMLButtonElement>) => {
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
