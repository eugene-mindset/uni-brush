import { Vector3 } from "three";

import { MathHelpers } from "@/util";

import { ModelGenerator } from "../base";

interface Config {
  dim: Vector3;
  normalSpread: number;
}

export class NormalDistributionGenerator extends ModelGenerator<Vector3, Config> {
  public create(count: number): NormalDistributionGenerator {
    return new NormalDistributionGenerator(
      {
        dim: new Vector3(1000, 10, 1000),
        normalSpread: 4 / 3.25,
      },
      count
    );
  }

  public clone(): NormalDistributionGenerator {
    return new NormalDistributionGenerator(
      this.config,
      undefined,
      this.outputs.map((vec) => new Vector3(vec.x, vec.y, vec.z))
    );
  }

  protected generateStep(): Vector3 {
    const radius = Math.abs(MathHelpers.randomPercentFromNormal().z0 * this.config.normalSpread);
    let initPos = MathHelpers.randomVectorFromNormal().normalize();
    initPos = initPos.multiplyVectors(initPos, this.config.dim).multiplyScalar(radius);

    return initPos;
  }
}
