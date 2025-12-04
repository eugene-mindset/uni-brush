import { BaseGalaxyConfig } from "@/models/procedural-generators";
import { Entity } from "@/models";
import { Vector3 } from "three";

export const config: BaseGalaxyConfig = {
  numOfEntities: Entity.StarSystem.Manager.initialCapacity,
  dim: new Vector3(1000, 10, 1000),
  mainGravityStrength: 0.1,
  mainGravityFallOff: 0.1,
  armShapeStrength: 10,
  numArms: 4,
  showDebug: false,
  armSpeed: 15,
  armSpread: 0.25,
  armOffset: Math.PI / 4,
  armSpreadDistance: 0.5,
  centerOverArmRatio: 0.1,
  armSharpness: 0.4,
};
