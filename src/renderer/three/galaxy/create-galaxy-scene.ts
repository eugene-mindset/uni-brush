import * as THREE from "three";

import { StarSystemVisual } from "../objects";
import { Entity } from "@/models";
import { Procedural } from "@/models";
import { BaseGalaxyConfig } from "@/models/procedural-generators";

export const createGalaxyScene = (scene: THREE.Scene, config: BaseGalaxyConfig) => {
  // TODO: very expensive to recreate stars, for small changes will need to track and change individual
  // ones

  // render stars
  const starSystems = Entity.StarSystem.Manager.getAll();
  for (const starSystem of starSystems) {
    const starSystemVisual = new StarSystemVisual(starSystem.publicId, starSystem.initialPosition);

    scene.add(starSystemVisual.object3D);
    starSystem.visual = starSystemVisual;
  }

  // debugger code for showing some operations
  // show arm step
  if (config.showDebug) {
    const shift = Procedural.armsGalaxyModifier(
      starSystems.map((x) => {
        const pos = x.initialPosition;
        return new THREE.Vector3(pos.x, pos.y, pos.z);
      }),
      config
    );

    for (let i = 0; i < shift.length; i++) {
      const pos = starSystems[i].initialPosition;
      const vec = shift[i].sub(pos);
      const dist = vec.length();
      const arrow = new THREE.ArrowHelper(
        vec.normalize(),
        starSystems[i].visual.object3D.position,
        dist,
        "#FFF"
      );

      arrow.layers.set(31);
      scene.add(arrow);
    }
  }

  //
  const rim = new THREE.PolarGridHelper(config.dim.x, config.numArms, 4);
  rim.layers.set(31);
  scene.add(rim);

  const axesHelper = new THREE.AxesHelper(10);
  axesHelper.layers.set(31);
  scene.add(axesHelper);
};
