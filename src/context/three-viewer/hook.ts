import { useContext } from "react";

import { MainViewContext } from "./store";
import { MainViewContextReadOnlyState } from "./types";

/**
 * Hook to read into state of main canvas
 * @returns read-only state
 */
export const useMainViewContext = (): MainViewContextReadOnlyState => {
  const context = useContext(MainViewContext);

  return { ...context } as MainViewContextReadOnlyState;
};

/**
 * Hook to fully interact with main canvas, should only be used by the main renderer it self.
 * @returns full state
 */
export const useMainViewFullContext = () => useContext(MainViewContext);
