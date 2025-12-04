import { Entity } from "@/models";
import { Vector3 } from "three";

export const config = {
  numOfEntities: Entity.StarSystem.Manager.initialCapacity,
  dim: new Vector3(1000, 10, 1000),

  numArms: 4,
  showDebug: false,
  armOffset: 0,
};
