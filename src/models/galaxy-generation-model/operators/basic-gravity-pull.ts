import { Vector3 } from "three";

import { MathHelpers } from "@/util";

import { ModelOperator } from "../base";

interface Config {
  dim: Vector3;
  strength: number;
  falloff: number;
}

export class BasicGravityPullOperator extends ModelOperator<Vector3, Vector3, Config> {
  public create(): BasicGravityPullOperator {
    return new BasicGravityPullOperator({
      dim: new Vector3(1000, 10, 1000),
      strength: 0.1,
      falloff: 0.1,
    });
  }

  public clone(): BasicGravityPullOperator {
    return new BasicGravityPullOperator(
      this.config,
      this.inputs.map((vec) => new Vector3(vec.x, vec.y, vec.z)),
      this.outputs.map((vec) => new Vector3(vec.x, vec.y, vec.z))
    );
  }

  protected generateStep(element: Vector3): Vector3 {
    const distanceRatio = MathHelpers.calculateEllipsoidDistRatio(element, this.config.dim);
    const posPulled = element.multiplyScalar(
      Math.pow(MathHelpers.clamp(this.config.falloff, distanceRatio, 1), this.config.strength)
    );

    return posPulled;
  }
}
