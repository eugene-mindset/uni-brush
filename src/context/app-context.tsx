import { ContextProvider } from "@/types";
import { createContext, PropsWithChildren, useContext } from "react";

/** General app state*/
export interface AppContextState {
  /** file path of project */
  file: string;
}

/**
 * Context of entire app
 */
const AppContext = createContext({ file: "" } as AppContextState);

/**
 * Provider for app state
 * @param param0
 * @returns JSX
 */
export const AppContextProvider: ContextProvider<null> = ({ children }: PropsWithChildren) => {
  return <AppContext.Provider value={{ file: "" }}>{children}</AppContext.Provider>;
};

/**
 * Hook to access global app state
 * @returns App context state info
 */
export const useAppContext = () => useContext(AppContext);
