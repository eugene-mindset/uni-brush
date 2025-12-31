import { Vector3 } from "three";

import { Generator } from "../base";

interface Config {
  dim: Vector3;
}

export class UniformDistributionVector extends Generator<Vector3, Config> {
  public static override readonly stepKey: string = "Generator:UniformDistributionVector";

  public static override create(): UniformDistributionVector {
    return new UniformDistributionVector({
      dim: new Vector3(1000, 10, 1000),
    });
  }

  public clone(): UniformDistributionVector {
    return new UniformDistributionVector({ ...this.config });
  }

  public override get stepKey(): string {
    return UniformDistributionVector.stepKey;
  }

  public get config(): Config {
    return {
      ...this._config,
      dim: this._config.dim.clone(),
    };
  }

  protected override generateStep(_count: number, _idx: number, ..._args: unknown[]): Vector3 {
    return new Vector3()
      .multiplyVectors(new Vector3().randomDirection(), this._config.dim)
      .multiplyScalar(Math.random());
  }
}
