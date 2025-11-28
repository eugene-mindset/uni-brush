import { Generator } from "../base";

interface Config<T> {
  outputs: T[];
}

export class PipeFromPipeline<T> extends Generator<T, Config<T>> {
  public static override readonly stepKey: string = "Generator:PipeFromPipeline";

  public static override create<T>(): PipeFromPipeline<T> {
    return new PipeFromPipeline<T>({
      outputs: [],
    });
  }

  public clone(): PipeFromPipeline<T> {
    return new PipeFromPipeline<T>({ ...this.config });
  }

  public override get stepKey(): string {
    return PipeFromPipeline.stepKey;
  }

  public get config(): Config<T> {
    return {
      outputs: [...this._config.outputs],
    };
  }

  protected generateStep(_idx: number, ..._args: never[]): T {
    throw new Error("Method not implemented.");
  }

  public generate(_count: number): T[] {
    return this._config.outputs;
  }
}
