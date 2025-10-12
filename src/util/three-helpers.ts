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
