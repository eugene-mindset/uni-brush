import { BaseGalaxyConfig } from "@/models/procedural-generators";
import { Entity } from "./models";
import { Vector3 } from "three";

export const config: BaseGalaxyConfig = {
  numOfEntities: Entity.StarSystem.Manager.capacity,
  dim: new Vector3(1250, 20, 1250),
  mainGravityStrength: 0.0,
  mainGravityFallOff: 0.05,
  armShapeStrength: 10,
  numArms: 2,
  showDebug: false,
  armSpeed: -15,
  armSpread: 0.15,
  armOffset: Math.PI / 4,
  armSpreadDistance: 0.6,
  centerOverArmRatio: 0.125,
  armSharpness: 0.1,
};

export const BASE_LAYER = 0;
export const BLOOM_LAYER = 1;
export const OVERLAY_LAYER = 2;
export const DEBUG_LAYER = 31;

export const BLOOM_PARAMS = {
  exposure: 1,
  bloomStrength: 1,
  bloomThreshold: 0.4,
  bloomRadius: 0.1,
};
