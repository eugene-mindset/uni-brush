import * as THREE from "three";

// A function to find the first matching ancestor
export function findAncestor(object: THREE.Object3D, predicate: (x: THREE.Object3D) => boolean) {
  let current = object.parent;
  while (current) {
    if (predicate(current)) {
      return current;
    }
    current = current.parent;
  }

  return null; // No matching ancestor found
}
type vecStringStyles = "point" | "simple" | "coord";

export const ThreeVector3ToString = (
  vec?: THREE.Vector3,
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
