import React, { Activity, useState } from "react";

import { ToggleButton } from "../buttons";
import { ToggleContext, useToggle } from "./hook";

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

interface MainProps extends React.PropsWithChildren {
  isInitShown?: boolean;
}

export function ToggleComponent(props: MainProps) {
  const [toggle, setToggle] = useState<boolean>(props.isInitShown || false);
  const onToggle = () => {
    setToggle((x) => !x);
  };

  return (
    <ToggleContext.Provider value={{ onToggle, toggleState: toggle }}>
      {React.Children.toArray(props.children)}
    </ToggleContext.Provider>
  );
}

ToggleComponent.Area = ToggleAreaComponent;
ToggleComponent.Button = ToggleButtonComponent;

interface MainControlledProps extends React.PropsWithChildren {
  isShown: boolean;
  onToggle: () => void;
}

export function ControlledToggleComponent({ onToggle, isShown, ...props }: MainControlledProps) {
  return (
    <ToggleContext.Provider value={{ onToggle, toggleState: isShown }}>
      {React.Children.toArray(props.children)}
    </ToggleContext.Provider>
  );
}

ControlledToggleComponent.Area = ToggleAreaComponent;
ControlledToggleComponent.Button = ToggleButtonComponent;
