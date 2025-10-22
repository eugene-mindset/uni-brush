import { Vector3 } from "three";

import { MathHelpers } from "@/util";

import { ModelGenerator } from "../base";

interface Config {
  dim: Vector3;
  normalDev: number;
}

export class NormalDistribution extends ModelGenerator<Vector3, Config> {
  public get outputs(): Vector3[] {
    return this._output.map((x) => x.clone());
  }

  public get config(): Config {
    return {
      ...this._config,
      dim: this._config.dim.clone(),
    };
  }

  public static override create(count: number): NormalDistribution {
    return new NormalDistribution(
      {
        dim: new Vector3(1000, 10, 1000),
        normalDev: 4 / 3.25,
      },
      count
    );
  }

  public override clone(): NormalDistribution {
    return new NormalDistribution(
      this.config,
      undefined,
      this.outputs.map((vec) => new Vector3(vec.x, vec.y, vec.z))
    );
  }

  protected override generateStep(): Vector3 {
    const radius = Math.abs(MathHelpers.randomPercentFromNormal().z0 * this.config.normalDev);

    let initPos = MathHelpers.randomVectorFromNormal().normalize();
    initPos = initPos.multiplyVectors(initPos, this.config.dim).multiplyScalar(radius);

    return initPos;
  }
}
