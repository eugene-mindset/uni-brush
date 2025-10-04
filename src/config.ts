import { BaseGalaxyConfig } from "@/models/procedural-generators";
import { Entity } from "./models";
import { Vector3 } from "three";

export const config: BaseGalaxyConfig = {
  numOfEntities: Entity.StarSystem.Manager.capacity,
  dim: new Vector3(1250, 20, 1250),
  mainGravityStrength: 0.1,
  mainGravityFallOff: 0.05,
  armShapeStrength: 10,
  numArms: 2,
  showDebug: false,
  armSpeed: -20,
  armSpread: 0.4,
  armOffset: 0,
  armSpreadDistance: 0.15,
  centerOverArmRatio: 0.125,
  armSharpness: 0.1,
};
