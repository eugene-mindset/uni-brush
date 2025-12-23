import { Intersection } from "three";

import { RenderIntersectData } from "@/types";

/**
 * Info thats enough to to react to events within canvas.
 */
export interface MainViewContextReadOnlyState {}

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
  };
}
