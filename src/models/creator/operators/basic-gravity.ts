import { Vector3 } from "three";

import { MathHelpers } from "@/util";
import { Operator } from "../base";

interface Config {
  size: Vector3;
  location: Vector3;
  strength: number;
  falloff: number;
}

// not working as intended when location is not origin
export class BasicGravity extends Operator<Vector3, Config> {
  public static override readonly stepKey: string = "Operator:BasicGravity";

  public static override create(): BasicGravity {
    return new BasicGravity({
      size: new Vector3(100, 100, 100),
      location: new Vector3(),
      strength: 0.5,
      falloff: 0.1,
    });
  }

  public clone(): BasicGravity {
    return new BasicGravity({ ...this.config });
  }

  public override get stepKey(): string {
    return BasicGravity.stepKey;
  }

  public get config(): Config {
    return {
      ...this._config,
      size: this._config.size.clone(),
      location: this._config.location.clone(),
    };
  }

  protected override generateStep(_idx: number, element: Vector3): Vector3 {
    const relVector = new Vector3().subVectors(element, this._config.location);
    const distanceRatio = MathHelpers.calculateEllipsoidDistRatio(relVector, this.config.size);
    const posPulled = relVector.multiplyScalar(
      Math.pow(MathHelpers.clamp(this.config.falloff, distanceRatio, 1), this.config.strength)
    );

    return posPulled.add(this._config.location);
  }
}
