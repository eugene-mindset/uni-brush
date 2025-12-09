import { Vector3 } from "three";

import { Entity } from "@/models";

export const config = {
  numOfEntities: Entity.StarSystemManager.initialCapacity,
  dim: new Vector3(1000, 10, 1000),

  numArms: 4,
  showDebug: false,
  armOffset: 0,
};
