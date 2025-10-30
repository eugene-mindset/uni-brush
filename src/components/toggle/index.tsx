import { ComponentChildren, createContext, FunctionalComponent, toChildArray } from "preact";
import { useContext } from "preact/hooks";
import { signal, useSignal } from "@preact/signals";
import { ToggleButton } from "../buttons";

const toggleContext = createContext({ toggle: true, onToggle: () => {} });

interface MainProps {
  isInitiallyShown?: boolean;
  children: ComponentChildren;
}

export function ToggleComponent(props: MainProps) {
  const toggle = useSignal(!!props.isInitiallyShown);

  const onToggle = () => {
    toggle.value = !toggle.value;
  };

  return (
    <toggleContext.Provider value={{ toggle: toggle.value, onToggle }}>
      {toChildArray(props.children)}
    </toggleContext.Provider>
  );
}

export const useToggle = () => useContext(toggleContext);

interface AreaProps {
  children: ComponentChildren;
}

const ToggleAreaComponent: FunctionalComponent<AreaProps> = (props) => {
  const { toggle } = useToggle();
  return toggle ? toChildArray(props.children) : null;
};

const ToggleButtonComponent: FunctionalComponent<typeof ToggleButton.defaultProps> = (props) => {
  const { toggle, onToggle } = useToggle();
  return <ToggleButton toggle={toggle} onToggle={onToggle} {...props} />;
};

ToggleComponent.useToggle = useToggle;
ToggleComponent.Area = ToggleAreaComponent;
ToggleComponent.Button = ToggleButtonComponent;
