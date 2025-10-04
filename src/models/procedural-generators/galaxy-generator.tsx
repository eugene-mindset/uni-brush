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
  numOfEntities: number;
  dim: Vector3; // (13.4, 0.306601, 13.4)
  mainGravityStrength: number;
  mainGravityFallOff: number;

  // centerWidth: number; // 4.9056223
  armShapeStrength: number;
  numArms: number;
  showDebug: boolean;
  armSpeed: number;
  armSpread: number;
  armSpreadDistance: number;
  armOffset: number;
  centerOverArmRatio: number;
  armSharpness: number;

  // bulgeRadius: number;
  // bulgeHeight: number;
};

function calculateEllipsoidDistRatio(point: Vector3, dim: Vector3): number {
  return new Vector3(point.x / dim.x, point.y / dim.y, point.z / dim.z).length();
}

export function generateGalaxyBase(config: BaseGalaxyConfig): Vector3[] {
  let out: Vector3[] = [];

  for (let index = 0; index < config.numOfEntities; index++) {
    const radius = Math.abs(MathHelpers.randomPercentFromNormal().z0);
    let initPos = MathHelpers.randomVectorFromNormal().normalize();
    initPos = initPos.multiplyVectors(initPos, config.dim).multiplyScalar(radius);

    const distanceRatio = calculateEllipsoidDistRatio(initPos, config.dim);
    const initPosPulled = initPos.multiplyScalar(
      Math.pow(
        MathHelpers.clamp(config.mainGravityFallOff, distanceRatio, 1),
        config.mainGravityStrength
      )
    );

    const finalPos = initPosPulled;
    out.push(finalPos);
  }

  return out;
}

export function armsGalaxyModifier(positions: Vector3[], config: BaseGalaxyConfig): Vector3[] {
  if (config.numArms == GalaxyArmCount.NoArms) return positions;

  const armArc = (2 * Math.PI) / config.numArms;

  let out = positions.map((x) => {
    const pos = x.clone();

    const theta = Math.atan2(pos.z / config.dim.z, pos.x / config.dim.x) + config.armOffset;
    const nearestArmTheta = Math.round(theta / armArc) * armArc;
    const deltaTheta = nearestArmTheta - theta;

    const planarDistRatio = new Vector2(pos.x / config.dim.x, pos.z / config.dim.z).length();

    const factor =
      // how off the entity's angle is from the center of its nearest arm
      planarDistRatio < config.centerOverArmRatio
        ? 0
        : MathHelpers.clamp(planarDistRatio - config.centerOverArmRatio, 0, 1) /
          (1 - config.centerOverArmRatio);

    const finalCoefficient = Math.pow(factor, 1 / config.armShapeStrength);

    const taperTheta = finalCoefficient ? deltaTheta / finalCoefficient : 0;
    const finalTheta = taperTheta + planarDistRatio * config.armSpeed;

    const rotated = new Vector3(
      pos.x / config.dim.x,
      pos.y / config.dim.y,
      pos.z / config.dim.z
    ).applyAxisAngle(new Vector3(0, 1, 0), -finalTheta);

    // add jitter to final position
    const jitter =
      1 +
      config.armSpread *
        config.dim.length() *
        MathHelpers.randomPercentFromNormal().z0 *
        Math.min(planarDistRatio + config.armSpreadDistance, 1);

    const final = MathHelpers.applyJitter(
      new Vector3().multiplyVectors(rotated, config.dim),
      jitter
    );

    return final;
  });

  return out;
}

// export function bulgeGalaxyModifier(positions: Vector3[], config: BaseGalaxyConfig) {}
// export function ringGalaxyModifier(positions: Vector3[], config: BaseGalaxyConfig) {}
// export function clusteringGalaxyModifier(positions: Vector3[], config: BaseGalaxyConfig) {}
// export function wobbleGalaxyModifier(positions: Vector3[], config: BaseGalaxyConfig) {}
