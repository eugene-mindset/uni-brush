import { BaseGalaxyConfig } from "@/models/procedural-generators";

export const config: BaseGalaxyConfig = {
  numStars: 50000,
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
