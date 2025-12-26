import { createContext, PropsWithChildren, useContext, useEffect } from "react";

import { useProceduralCreatorModel } from "@/hooks";
import { ContextProvider } from "@/types";

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
  const { generate } = useProceduralCreatorModel();
  useEffect(() => {
    generate();
  }, [generate]);

  return <AppContext.Provider value={{ file: "" }}>{children}</AppContext.Provider>;
};

/**
 * Hook to access global app state
 * @returns App context state info
 */
export const useAppContext = () => useContext(AppContext);
