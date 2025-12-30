import { createContext, useContext } from "react";

import { ToggleContextState } from "./type";

export const ToggleContext = createContext<ToggleContextState>({
  onToggle: () => {},
  toggleState: false,
});

export const useToggle = () => {
  const context = useContext(ToggleContext);
  if (!context)
    throw new Error(
      "useToggle must be called within a ToggleComponent or a ControlledToggleComponent",
    );

  const { onToggle, toggleState } = context;

  return {
    toggleState,
    onToggle,
  };
};
