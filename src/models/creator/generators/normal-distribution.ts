import { Vector3 } from "three";

import { MathHelpers } from "@/util";

import { Generator } from "../base";

interface Config {
  dim: Vector3;
  normalDev: number;
}

export class NormalDistributionVector extends Generator<Vector3, Config> {
  public static override readonly stepKey: string = "Generator:NormalDistributionVector";

  public static override create(): NormalDistributionVector {
    return new NormalDistributionVector({
      dim: new Vector3(1000, 10, 1000),
      normalDev: 4 / 3.25,
    });
  }

  public clone(): NormalDistributionVector {
    return new NormalDistributionVector({ ...this.config });
  }

  public override get stepKey(): string {
    return NormalDistributionVector.stepKey;
  }

  public get config(): Config {
    return {
      ...this._config,
      dim: this._config.dim.clone(),
    };
  }

  protected override generateStep(): Vector3 {
    const radius = Math.abs(MathHelpers.randomPercentFromNormal().z0 * this.config.normalDev);

    let initPos = MathHelpers.randomVectorFromNormal().normalize();
    initPos = initPos.multiplyVectors(initPos, this.config.dim).multiplyScalar(radius);

    return initPos;
  }
}
