import { createContext, Provider } from "preact";
import { Signal, signal } from "@preact/signals";
import { useContext } from "preact/hooks";

import { Entity } from "@/models";

export interface MainViewContextReadOnlyState {
  pointer: {
    intersect: {
      ref: Signal<Entity.Base.EntityType | undefined>;
    };
  };
}

export interface MainViewContextFullState extends MainViewContextReadOnlyState {
  pointer: {
    intersect: {
      setIntersect: (entity?: Entity.Base.EntityType) => void;
    };
  } & MainViewContextReadOnlyState["pointer"];
}

const MainViewContext = createContext({} as MainViewContextFullState);

export const MainViewContextProvider: Provider<{}> = ({ children }) => {
  const intersectEntity = signal<Entity.Base.EntityType>();

  const setIntersect = (entity?: Entity.Base.EntityType) => {
    intersectEntity.value = entity;
  };

  const out: MainViewContextFullState = {
    pointer: {
      intersect: {
        ref: intersectEntity,
        setIntersect,
      },
    },
  };

  return <MainViewContext.Provider value={out}>{children}</MainViewContext.Provider>;
};

export const useMainViewContext = (): MainViewContextReadOnlyState => {
  const context = useContext(MainViewContext);

  return { ...context } as MainViewContextReadOnlyState;
};

export const useMainViewFullContext = () => useContext(MainViewContext);
