import { Vector2, Vector3 } from "three";
import { MathHelpers } from "@/util";
import { RAD2DEG } from "three/src/math/MathUtils.js";
import { cubeTexture } from "three/tsl";

export enum GalaxyArmCount {
  NoArms = 0,
  TwoArms = 2,
  ThreeArms = 3,
  FourArms = 4,
  SixArms = 6,
}

export type BaseGalaxyConfig = {
  numStars: number;
  radius: number; // 26.8
  width: number; // 0.306601
  mainGravityStrength: number;
  mainGravityFallOff: number;

  // centerWidth: number; // 4.9056223
  armShapeStrength: number;
  numArms: number;
  showDebug: boolean;
  armSpeed: number;
  armSpread: number;
  armOffset: number;

  // bulgeRadius: number;
  // bulgeHeight: number;
};

// export function clusteringGalaxyModifier(positions: Vector3[], config: BaseGalaxyConfig) {}

// export function ringGalaxyModifier(positions: Vector3[], config: BaseGalaxyConfig) {}

// export function bulgeGalaxyModifier(positions: Vector3[], config: BaseGalaxyConfig) {}

export function armsGalaxyModifier(positions: Vector3[], config: BaseGalaxyConfig): Vector3[] {
  if (config.numArms == GalaxyArmCount.NoArms) return positions;

  const armArc = (2 * Math.PI) / config.numArms;
  const armOffset = config.armOffset;

  const shifts: number[][] = [];

  let starSystems = positions.map((x) => {
    const star = x.clone();
    const starAngle = Math.atan2(star.z, star.x) + armOffset;
    const nearestArmAngle = Math.round(starAngle / armArc) * armArc;
    const starDistance = Math.sqrt(star.x ** 2 + star.z ** 2);
    const starDistanceRatio = starDistance / config.radius;

    const deltaAngle = nearestArmAngle - starAngle;

    const factor =
      starDistanceRatio < config.mainGravityFallOff
        ? 0
        : MathHelpers.clamp(starDistanceRatio - config.mainGravityFallOff, 0, 1) /
          (1 - config.mainGravityFallOff);

    shifts.push([starDistanceRatio, deltaAngle * starDistance]);

    const taperAngle = factor ? deltaAngle / Math.pow(factor, 1 / config.armShapeStrength) : 0;
    const finalAngle =
      taperAngle +
      starDistanceRatio *
        config.armSpeed *
        (1 + MathHelpers.randomFromNormal(0, config.armSpread).z0);
    // deltaAngle * MathHelpers.clamp(starDistanceRatio + 0.5, 0, 1); //* (Math.abs(MathHelpers.randomFromNormal(0, 1 / 3).z0) + 1);

    return new Vector3(star.x, star.y, star.z).applyAxisAngle(new Vector3(0, 1, 0), -finalAngle);
  });

  console.log(shifts.sort((a, b) => a[0] - b[0]));

  return starSystems;
}

export function generateGalaxyBase(config: BaseGalaxyConfig): Vector3[] {
  let out: Vector3[] = [];

  for (let index = 0; index < config.numStars; index++) {
    const radiusFactor = config.radius / 4;
    const planar = MathHelpers.randomFromNormal(0, 1);

    const planarVector = new Vector2(planar.z0, planar.z1);

    const initPos = new Vector3(
      planarVector.x * radiusFactor,
      (1 - planarVector.length() / 4) * config.width * MathHelpers.randomSigned(),
      planarVector.y * radiusFactor
    );

    const ratioDistFromCOM = initPos.length() / config.radius;
    const mainGravityPull = initPos.multiplyScalar(
      Math.pow(ratioDistFromCOM, config.mainGravityStrength)
    );

    const finalPos = mainGravityPull;
    out.push(finalPos);
  }

  return out;
}
