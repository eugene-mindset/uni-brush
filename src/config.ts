import { BaseGalaxyConfig } from "@/models/procedural-generators";
import { Entity } from "./models";
import { Vector3 } from "three";

export const config: BaseGalaxyConfig = {
  numOfEntities: Entity.StarSystem.Manager.capacity,
  dim: new Vector3(1250, 20, 1250),
  mainGravityStrength: 0.075,
  mainGravityFallOff: 0.05,
  armShapeStrength: 10,
  numArms: 4,
  showDebug: false,
  armSpeed: -1,
  armSpread: 0.25,
  armOffset: Math.PI / 4,
  armSpreadDistance: 0.5,
  centerOverArmRatio: 0.15,
  armSharpness: 0.4,
};
