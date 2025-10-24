import { Vector3 } from "three";

import { MathHelpers } from "@/util";
import { ModelOperator } from "../base";

interface Config {
  dim: Vector3;
  strength: number;
  falloff: number;
}

export class BasicGravity extends ModelOperator<Vector3, Config> {
  public static override create(): BasicGravity {
    return new BasicGravity({
      dim: new Vector3(1000, 10, 1000),
      strength: 0.1,
      falloff: 0.1,
    });
  }

  public clone(): BasicGravity {
    return new BasicGravity({ ...this.config });
  }

  public get config(): Config {
    return {
      ...this._config,
      dim: this._config.dim.clone(),
    };
  }

  protected override generateStep(element: Vector3): Vector3 {
    const distanceRatio = MathHelpers.calculateEllipsoidDistRatio(element, this.config.dim);
    const posPulled = element.multiplyScalar(
      Math.pow(MathHelpers.clamp(this.config.falloff, distanceRatio, 1), this.config.strength)
    );

    return posPulled;
  }
}
