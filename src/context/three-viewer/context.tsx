import { Provider } from "jotai";
import { useAtomCallback } from "jotai/utils";
import React, { PropsWithChildren, useEffect } from "react";
import { Intersection } from "three";

import { useProceduralCreatorModel } from "@/hooks";
import { ContextProvider, RenderIntersectData } from "@/types";

import {
  hoverEntityAtom,
  hoverIntersectAtom,
  MainViewContext,
  selectEntityAtom,
  selectIntersectAtom,
} from "./store";
import { MainViewContextFullState } from "./types";

/**
 * Context provider for seeing info and interacting with the main canvas scene
 * @param props
 * @returns JSX
 */
const InnerProvider: ContextProvider<null> = ({ children }: PropsWithChildren) => {
  // TODO: move this out somewhere, pivot for landing functionality
  const { generate } = useProceduralCreatorModel();
  useEffect(() => {
    generate();
  }, [generate]);

  const setIntersect = useAtomCallback(
    (
      get,
      set,
      action: "hover" | "select",
      entity?: RenderIntersectData,
      intersect?: Intersection,
    ) => {
      if (action === "select") {
        set(selectEntityAtom, entity || get(hoverEntityAtom));
        set(selectIntersectAtom, intersect || get(hoverIntersectAtom));
      } else {
        set(hoverEntityAtom, entity || null);
        set(hoverIntersectAtom, intersect || null);
      }
    },
  );

  const out: MainViewContextFullState = {
    pointer: {
      setPointer: setIntersect,
    },
  };

  return (
    <MainViewContext.Provider value={out}>
      {React.Children.toArray(children)}
    </MainViewContext.Provider>
  );
};

export const MainViewContextProvider: ContextProvider<null> = ({ children }: PropsWithChildren) => {
  return (
    <Provider>
      <InnerProvider value={null}>{children}</InnerProvider>
    </Provider>
  );
};
