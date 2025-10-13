import { createContext, Provider } from "preact";
import { useContext } from "preact/hooks";

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
export const AppContextProvider: Provider<{}> = ({ children }) => {
  return (
    <AppContext.Provider value={{ file: "" } as AppContextState}>{children}</AppContext.Provider>
  );
};

/**
 * Hook to access global app state
 * @returns App context state info
 */
export const useAppContext = () => useContext(AppContext);
