import { atom, getDefaultStore, PrimitiveAtom } from "jotai";
import React, { createContext, PropsWithChildren, useContext, useEffect } from "react";
import { Intersection } from "three";

import { useProceduralCreatorModel } from "@/hooks";
import { ContextProvider, RenderIntersectData } from "@/types";

/**
 * Info thats enough to to react to events within canvas.
 */
export interface MainViewContextReadOnlyState {
  pointer: {
    /** Object currently hovered on within the main view */
    hover: {
      ref: PrimitiveAtom<RenderIntersectData | null>;
      intersect: PrimitiveAtom<Intersection | null>;
    };
    /** Object currently selected within the main view */
    select: {
      ref: PrimitiveAtom<RenderIntersectData | null>;
      intersect: PrimitiveAtom<Intersection | null>;
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
      intersect?: Intersection,
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
export const MainViewContextProvider: ContextProvider<null> = ({ children }: PropsWithChildren) => {
  const hoverEntityAtom = atom<RenderIntersectData | null>(null);
  const hoverIntersectAtom = atom<Intersection | null>(null);

  const selectEntityAtom = atom<RenderIntersectData | null>(null);
  const selectIntersectAtom = atom<Intersection | null>(null);

  // TODO: move this out somewhere, pivot for landing functionality
  const { generate } = useProceduralCreatorModel();
  useEffect(() => {
    generate();
  }, [generate]);

  const store = getDefaultStore();

  const setIntersect = (
    action: "hover" | "select",
    entity?: RenderIntersectData,
    intersect?: Intersection,
  ) => {
    if (action === "select") {
      store.set(selectEntityAtom, store.get(hoverEntityAtom));
      store.set(selectEntityAtom, store.get(hoverEntityAtom));
    } else {
      store.set(hoverEntityAtom, entity || null);
      store.set(hoverIntersectAtom, intersect || null);
    }
  };

  const out: MainViewContextFullState = {
    pointer: {
      hover: { ref: hoverEntityAtom, intersect: hoverIntersectAtom },
      select: { ref: selectEntityAtom, intersect: selectIntersectAtom },
      setPointer: setIntersect,
    },
  };

  return (
    <MainViewContext.Provider value={out}>
      {React.Children.toArray(children)}
    </MainViewContext.Provider>
  );
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
