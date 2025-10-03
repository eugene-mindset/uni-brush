import { BaseGalaxyConfig } from "@/models/procedural-generators";
import { Entity } from "./models";

export const config: BaseGalaxyConfig = {
  numStars: Entity.StarSystem.Manager.capacity,
  radius: 500,
  width: 10,
  mainGravityStrength: 0.5,
  mainGravityFallOff: 0.1,
  armShapeStrength: 10,
  numArms: 3,
  showDebug: false,
  armSpeed: -30,
  armSpread: 0.025,
  armOffset: Math.PI / 4,
};
