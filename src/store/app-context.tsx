import { createContext, Provider } from "preact";
import { useContext } from "preact/hooks";

export interface AppContextState {}

const AppContext = createContext({} as AppContextState);

export const AppContextProvider: Provider<{}> = (props) => {
  return <AppContext.Provider value={{} as AppContextState}>{props?.children}</AppContext.Provider>;
};

export const useAppContext = useContext(AppContext);
