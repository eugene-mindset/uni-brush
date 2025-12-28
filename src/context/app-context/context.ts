import { createContext, useContext } from "react";

/** General app state*/
export interface AppContextState {
  /** file path of project */
  file: string;
}

/**
 * Context of entire app
 */
export const AppContext = createContext({ file: "" } as AppContextState);

/**
 * Hook to access global app state
 * @returns App context state info
 */
export const useAppContext = () => useContext(AppContext);
