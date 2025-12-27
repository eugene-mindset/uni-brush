import { atom, useSetAtom } from "jotai";
import React, { Activity, useEffect } from "react";

import { ToggleButton } from "../buttons";
import { ToggleContext, useToggle } from "./hook";

interface MainProps extends React.PropsWithChildren {
  isInitiallyShown?: boolean;
  isShown?: boolean;
}

export function ToggleComponent(props: MainProps) {
  const toggleStateAtom = atom(props?.isInitiallyShown || false);
  const setToggle = useSetAtom(toggleStateAtom);

  useEffect(() => {
    if (!props.isShown) return;
    setToggle(props.isShown);
  }, [props.isShown, setToggle]);

  const onToggle = () => {
    setToggle((x) => !x);
  };

  return (
    <ToggleContext.Provider value={{ toggleStateAtom, onToggle }}>
      {React.Children.toArray(props.children)}
    </ToggleContext.Provider>
  );
}

const ToggleAreaComponent: React.FC<React.PropsWithChildren> = (props) => {
  const { toggleState: toggle } = useToggle();
  return (
    <Activity mode={toggle ? "visible" : "hidden"}>
      {React.Children.toArray(props.children)}
    </Activity>
  );
};

type ToggleButtonProps = React.ComponentProps<typeof ToggleButton>;
const ToggleButtonComponent = (props: Partial<ToggleButtonProps>) => {
  const { toggleState: toggle, onToggle } = useToggle();

  return (
    <ToggleButton
      {...props}
      toggle={toggle ?? props.toggle}
      onToggle={onToggle ?? props.onToggle}
    />
  );
};

ToggleComponent.useToggle = useToggle;
ToggleComponent.Area = ToggleAreaComponent;
ToggleComponent.Button = ToggleButtonComponent;
