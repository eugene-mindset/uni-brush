import * as THREE from "three";

import { Entity, Procedural } from "@/models";
import { Global, StarSystemVisual } from "@/renderer";

export const createGalaxyScene = (
  starSystems: Entity.StarSystem.Entity[],
  scene: THREE.Scene,
  config: Procedural.BaseGalaxyConfig,
) => {
  // TODO: very expensive to recreate stars, for small changes will need to track and change individual
  // ones

  // render stars
  for (const starSystem of starSystems) {
    const starSystemVisual = new StarSystemVisual(starSystem.id, starSystem.initPos);

    scene.add(starSystemVisual.object3D);
    starSystem.obj3D = starSystemVisual;
  }

  // // debugger code for showing some operations
  // // show arm step
  // if (config.showDebug) {
  //   const shift = Procedural.armsGalaxyModifier(
  //     starSystems.map((x) => {
  //       const pos = x.initialPosition;
  //       return new THREE.Vector3(pos.x, pos.y, pos.z);
  //     }),
  //     config
  //   );

  //   for (let i = 0; i < shift.length; i++) {
  //     const pos = starSystems[i].initialPosition;
  //     const vec = shift[i].sub(pos);
  //     const dist = vec.length();
  //     const arrow = new THREE.ArrowHelper(
  //       vec.normalize(),
  //       starSystems[i].visual.object3D.position,
  //       dist,
  //       "#FFF"
  //     );

  //     arrow.layers.set(Global.Layers.DEBUG_LAYER);
  //     scene.add(arrow);
  //   }
  // }

  const light = new THREE.AmbientLight("#828282", 1); // soft white light
  light.layers.enable(Global.Layers.BASE_LAYER);
  scene.add(light);

  //
  const rim = new THREE.PolarGridHelper(config.dim.x, config.numArms, 4);
  rim.layers.set(Global.Layers.DEBUG_LAYER);
  scene.add(rim);

  const axesHelper = new THREE.AxesHelper(10);
  axesHelper.layers.set(Global.Layers.DEBUG_LAYER);
  scene.add(axesHelper);
};
