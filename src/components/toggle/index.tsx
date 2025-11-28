import React, { Activity, createContext, useContext } from "react";
import { atom, useAtomValue, useSetAtom } from "jotai";

import { ToggleButton } from "../buttons";
import { Atom } from "jotai";

interface ToggleContextState {
  toggleAtom: Atom<boolean>;
  onToggle: () => void;
}

const toggleContext = createContext<ToggleContextState>({
  toggleAtom: atom(true),
  onToggle: () => {},
});

interface MainProps extends React.PropsWithChildren {
  isInitiallyShown?: boolean;
}

export function ToggleComponent(props: MainProps) {
  const toggleAtom = atom(!!props.isInitiallyShown);
  const setToggle = useSetAtom(toggleAtom);

  const onToggle = () => {
    setToggle((x) => !x);
  };

  return (
    <toggleContext.Provider value={{ toggleAtom, onToggle }}>
      {React.Children.toArray(props.children)}
    </toggleContext.Provider>
  );
}

export const useToggle = () => {
  const { toggleAtom, onToggle } = useContext(toggleContext);
  const toggle = useAtomValue(toggleAtom);

  return {
    toggle,
    onToggle,
  };
};

const ToggleAreaComponent: React.FC<React.PropsWithChildren> = (props) => {
  const { toggle } = useToggle();
  return (
    <Activity mode={toggle ? "visible" : "hidden"}>
      {React.Children.toArray(props.children)}
    </Activity>
  );
};

type ToggleButtonProps = React.ComponentProps<typeof ToggleButton>;
const ToggleButtonComponent = (props: Partial<ToggleButtonProps>) => {
  const { toggle, onToggle } = useToggle();

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
