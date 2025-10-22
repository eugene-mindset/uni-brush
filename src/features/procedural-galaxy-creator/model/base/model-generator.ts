export abstract class ModelGenerator<O, K> {
  protected _config: K;

  private _outputCount: number;
  protected _output: O[] = [];

  // constructors

  protected constructor(config: K, count?: number, output?: O[]) {
    this._config = config;

    if (output) {
      this._output = output;
      this._outputCount = output.length;
    } else {
      this._outputCount = count || 0;
    }
  }

  public static create(_count: number): any {
    throw new Error("Cannot call static of abstract class");
  }

  public abstract clone(): ModelGenerator<O, K>;

  // properties

  public abstract get outputs(): O[];

  public abstract get config(): K;

  // methods

  protected abstract generateStep(): O;

  public generate() {
    this.reset();

    for (let i = 0; i < this._outputCount; i++) {
      this._output.push(this.generateStep());
    }
  }

  public reset() {
    this._output = [];
  }

  public setConfig(config: K) {
    this._config = config;
  }
}
