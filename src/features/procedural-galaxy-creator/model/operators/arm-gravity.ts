import { Vector2, Vector3 } from "three";
import memoize from "fast-memoize";

import { MathHelpers } from "@/util";

import { ModelOperator } from "../base";

interface Config {
  dim: Vector3;
  normalSpread: number;
  armCount: number;
  armOffset: number;
  armSpeed: number;
  armShape: number;
  armSpread: number;
  armTaperSpread: number;
  centerOverArmRatio: number;
}

export class ArmGravity extends ModelOperator<Vector3, Config> {
  public override readonly stepKey: string = "Operator:ArmGravity";

  public static override create(): ArmGravity {
    return new ArmGravity({
      dim: new Vector3(1000, 10, 1000),
      normalSpread: 4 / 3.25,
      armCount: 4,
      armOffset: Math.PI / 4,
      armSpeed: 15,
      armShape: 10,
      armSpread: 0.1,
      armTaperSpread: 0.25,
      centerOverArmRatio: 0.1,
    });
  }

  public clone(): ArmGravity {
    return new ArmGravity({ ...this.config });
  }

  public get config(): Config {
    return {
      ...this._config,
      dim: this._config.dim.clone(),
    };
  }

  private precomputeConfig = memoize((config: Config) => {
    return {
      armArcLength: (2 * Math.PI) / config.armCount,
    };
  });

  private get derivedConfig() {
    return this.precomputeConfig(this.config);
  }

  protected override generateStep(_idx: number, element: Vector3): Vector3 {
    const theta =
      Math.atan2(element.z / this.config.dim.z, element.x / this.config.dim.x) +
      this.config.armOffset;

    const nearestArmTheta =
      Math.round(theta / this.derivedConfig.armArcLength) * this.derivedConfig.armArcLength;

    const deltaTheta = nearestArmTheta - theta;

    const planarDistRatio = new Vector2(
      element.x / this.config.dim.x,
      element.z / this.config.dim.z
    ).length();

    const factor =
      // how off the entity's angle is from the center of its nearest arm
      planarDistRatio < this.config.centerOverArmRatio
        ? 0
        : MathHelpers.clamp(planarDistRatio - this.config.centerOverArmRatio, 0, 1) /
          (1 - this.config.centerOverArmRatio);

    const finalCoefficient = Math.pow(factor, 1 / this.config.armShape);

    const taperTheta = finalCoefficient ? deltaTheta / finalCoefficient : 0;
    const finalTheta = taperTheta + planarDistRatio * this.config.armSpeed;

    const rotated = new Vector3(
      element.x / this.config.dim.x,
      element.y / this.config.dim.y,
      element.z / this.config.dim.z
    ).applyAxisAngle(new Vector3(0, 1, 0), -finalTheta);

    // add jitter to final position
    const jitter =
      1 +
      this.config.armSpread *
        this.config.dim.length() *
        MathHelpers.randomPercentFromNormal().z0 *
        this.config.normalSpread *
        Math.min(planarDistRatio + this.config.armTaperSpread, 1);

    const final = MathHelpers.applyJitter(
      new Vector3().multiplyVectors(rotated, this.config.dim),
      jitter
    );

    return final;
  }
}
