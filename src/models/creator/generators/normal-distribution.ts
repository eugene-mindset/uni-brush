import { Vector3 } from "three";

import { MathHelpers } from "@/util";

import { Generator } from "../base";

interface Config {
  dim: Vector3;
  normalDev: number;
}

export class NormalDistribution extends Generator<Vector3, Config> {
  public override readonly stepKey: string = "Generator:NormalDistribution";

  public static override create(): NormalDistribution {
    return new NormalDistribution({
      dim: new Vector3(1000, 10, 1000),
      normalDev: 4 / 3.25,
    });
  }

  public clone(): NormalDistribution {
    return new NormalDistribution({ ...this.config });
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
