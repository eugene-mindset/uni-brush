import { PropsWithChildren } from "react";

import { useManager, useProceduralCreatorModel } from "@/hooks";
import { EntityTypes } from "@/models";
import { ContextProvider } from "@/types";

import { AppContext } from "./context";

/**
 * Provider for app state
 * @param param0
 * @returns JSX
 */

export const AppContextProvider: ContextProvider<null> = ({ children }: PropsWithChildren) => {
  const starSystemManager = useManager(EntityTypes.STAR_SYSTEM);
  const { generate } = useProceduralCreatorModel();
  if (!starSystemManager.isInitialized) {
    generate();
  }

  return <AppContext.Provider value={{ file: "" }}> {children} </AppContext.Provider>;
};
