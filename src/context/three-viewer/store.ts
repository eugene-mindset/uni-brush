import { atom } from "jotai";
import { createContext } from "react";
import { Intersection } from "three";

import { RenderIntersectData } from "@/types";

import { MainViewContextFullState } from "./types";

export const hoverEntityAtom = atom<RenderIntersectData | null>(null);
export const hoverIntersectAtom = atom<Intersection | null>(null);

export const selectEntityAtom = atom<RenderIntersectData | null>(null);
export const selectIntersectAtom = atom<Intersection | null>(null);

/**
 * Main View context
 */
export const MainViewContext = createContext({} as MainViewContextFullState);
