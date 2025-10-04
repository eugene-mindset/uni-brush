import { Vector3 } from "three";

export * as MathHelpers from "./math-helpers";

export const ThreeVector3ToString = (vec?: Vector3) =>
  vec ? `(${vec.x}, ${vec.y}, ${vec.z})` : "";
