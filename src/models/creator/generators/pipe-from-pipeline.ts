import { Generator } from "../base";

interface Config<T> {
  outputs: T[];
}

export class PipeFromFactory<T> extends Generator<T, Config<T>> {
  public static override readonly stepKey: string = "Generator:PipeFromFactory";

  public static override create<T>(): PipeFromFactory<T> {
    return new PipeFromFactory<T>({
      outputs: [],
    });
  }

  public clone(): PipeFromFactory<T> {
    return new PipeFromFactory<T>({ ...this.config });
  }

  public override get stepKey(): string {
    return PipeFromFactory.stepKey;
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
