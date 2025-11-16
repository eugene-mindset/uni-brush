import { createContext, Provider, toChildArray } from "preact";
import { Signal, useSignal } from "@preact/signals";
import { useContext } from "preact/hooks";

import { RenderIntersectData } from "@/types";
import { Intersection } from "three";

/**
 * Info thats enough to to react to events within canvas.
 */
export interface MainViewContextReadOnlyState {
  pointer: {
    /** Object currently hovered on within the main view */
    hover: {
      ref: Signal<RenderIntersectData | null>;
      intersect: Signal<Intersection | null>;
    };
    /** Object currently selected within the main view */
    select: {
      ref: Signal<RenderIntersectData | null>;
      intersect: Signal<Intersection | null>;
    };
  };
}

/**
 * Full access and control of context state for main canvas.
 */
export interface MainViewContextFullState extends MainViewContextReadOnlyState {
  pointer: {
    /**
     * Set pointer info
     * @param action whether to set the hovered or selected value
     * @param entity entity to set as
     * @param intersect info on intersection
     */
    setPointer: (
      action: "hover" | "select",
      entity?: RenderIntersectData,
      intersect?: Intersection
    ) => void;
  } & MainViewContextReadOnlyState["pointer"];
}

/**
 * Main View context
 */
const MainViewContext = createContext({} as MainViewContextFullState);

/**
 * Context provider for seeing info and interacting with the main canvas scene
 * @param props
 * @returns JSX
 */
export const MainViewContextProvider: Provider<{}> = ({ children }) => {
  const hoverEntity = useSignal<RenderIntersectData | null>(null);
  const hoverIntersect = useSignal<Intersection | null>(null);

  const selectEntity = useSignal<RenderIntersectData | null>(null);
  const selectIntersect = useSignal<Intersection | null>(null);

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
      setPointer: setIntersect,
    },
  };

  return <MainViewContext.Provider value={out}>{toChildArray(children)}</MainViewContext.Provider>;
};

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
