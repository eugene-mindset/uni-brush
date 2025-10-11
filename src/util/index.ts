import { Vector3 } from "three";

export * as MathHelpers from "./math-helpers";

type vecStringStyles = "point" | "simple" | "coord";

export const ThreeVector3ToString = (
  vec?: Vector3,
  style?: vecStringStyles,
  format?: Intl.NumberFormatOptions
) => {
  if (!vec) return "";

  const formatter = new Intl.NumberFormat("en-US", format);
  const x = formatter.format(vec.x);
  const y = formatter.format(vec.y);
  const z = formatter.format(vec.z);

  switch (style) {
    case "point":
      return `(${x}, ${y}, ${z})`;
    case "simple":
      return `${x}, ${y}, ${z}`;
    case "coord":
      return `x: ${x}; y: ${y}; z: ${z};`;
    default:
      return "";
  }
};
