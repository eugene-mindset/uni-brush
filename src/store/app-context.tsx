import { createContext, Provider } from "preact";
import { useContext } from "preact/hooks";

export interface AppContextState {
  file: string;
}

const AppContext = createContext({ file: "" } as AppContextState);

export const AppContextProvider: Provider<{}> = ({ children }) => {
  return (
    <AppContext.Provider value={{ file: "" } as AppContextState}>{children}</AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
