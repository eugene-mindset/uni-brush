import { createContext, Provider } from "preact";
import { Signal, signal } from "@preact/signals";
import { useContext } from "preact/hooks";

import { RenderIntersectData } from "@/types";
import { Intersection } from "three";

export interface MainViewContextReadOnlyState {
  pointer: {
    hover: {
      ref: Signal<RenderIntersectData | null>;
      intersect: Signal<Intersection | null>;
    };
    select: {
      ref: Signal<RenderIntersectData | null>;
      intersect: Signal<Intersection | null>;
    };
  };
}

export interface MainViewContextFullState extends MainViewContextReadOnlyState {
  pointer: {
    setIntersect: (
      action: "hover" | "select",
      entity?: RenderIntersectData,
      intersect?: Intersection
    ) => void;
  } & MainViewContextReadOnlyState["pointer"];
}

const MainViewContext = createContext({} as MainViewContextFullState);

export const MainViewContextProvider: Provider<{}> = ({ children }) => {
  const hoverEntity = signal<RenderIntersectData | null>(null);
  const hoverIntersect = signal<Intersection | null>(null);

  const selectEntity = signal<RenderIntersectData | null>(null);
  const selectIntersect = signal<Intersection | null>(null);

  const setIntersect = (
    action: "hover" | "select",
    entity?: RenderIntersectData,
    intersect?: Intersection
  ) => {
    if (action === "select") {
      selectEntity.value = hoverEntity.value;
      selectIntersect.value = entity ? hoverIntersect.value : intersect || null;
    } else {
      hoverEntity.value = entity || null;
      hoverIntersect.value = intersect || null;
    }
  };

  const out: MainViewContextFullState = {
    pointer: {
      hover: { ref: hoverEntity, intersect: hoverIntersect },
      select: { ref: selectEntity, intersect: selectIntersect },
      setIntersect,
    },
  };

  return <MainViewContext.Provider value={out}>{children}</MainViewContext.Provider>;
};

export const useMainViewContext = (): MainViewContextReadOnlyState => {
  const context = useContext(MainViewContext);

  return { ...context } as MainViewContextReadOnlyState;
};

export const useMainViewFullContext = () => useContext(MainViewContext);
