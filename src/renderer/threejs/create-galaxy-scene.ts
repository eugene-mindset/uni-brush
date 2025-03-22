import * as THREE from "three";

import { StarSystemVisual } from "./objects";
import { Data } from "@/models";

export const createGalaxyScene = (scene: THREE.Scene) => {
  // TODO: very expensive to recreate stars, for small changes will need to track and change individual
  // ones
  for (const starSystem of Data.StarSystem.Manager.getAll()) {
    const starSystemVisual = new StarSystemVisual(
      starSystem.publicId,
      new THREE.Vector3(
        starSystem.initialPosition.x,
        starSystem.initialPosition.y,
        starSystem.initialPosition.z
      )
    );

    scene.add(starSystemVisual.object3D);
    starSystem.visual = starSystemVisual;
  }
};
