import { Atom } from "jotai";
import { atom, useAtomValue } from "jotai";
import { createContext, useContext } from "react";

interface ToggleContextState {
  onToggle: () => void;
  toggleStateAtom: Atom<boolean>;
}

export const ToggleContext = createContext<ToggleContextState>({
  onToggle: () => {},
  toggleStateAtom: atom(false),
});

export const useToggle = () => {
  const { onToggle, toggleStateAtom } = useContext(ToggleContext);
  const toggleState = useAtomValue(toggleStateAtom);

  return {
    toggleState,
    onToggle,
  };
};
