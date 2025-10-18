import { DeepReadonly } from "@/types";

export abstract class ModelGenerator<O, K> {
  private _config: K;

  private _outputCount: number;
  private _output: O[] = [];

  private _output_ready: boolean = false;

  // constructors

  protected constructor(config: K, count?: number, output?: O[]) {
    this._config = config;

    if (output) {
      this._output = output;
      this._outputCount = output.length;
      this._output_ready = true;
    } else {
      this._outputCount = count || 0;
    }
  }

  public abstract create(count: number): ModelGenerator<O, K>;

  public abstract clone(): ModelGenerator<O, K>;

  // properties

  public get outputs(): DeepReadonly<O[]> {
    if (this._output_ready) return [];
    return this._output as DeepReadonly<O[]>;
  }

  public get config(): DeepReadonly<K> {
    return this._config as DeepReadonly<K>;
  }

  // methods

  protected abstract generateStep(): O;

  public generate() {
    this.reset();

    for (let i = 0; i < this._outputCount; i++) {
      this._output.push(structuredClone(this.generateStep()));
    }

    this._output_ready = true;
  }

  public reset() {
    this._output = [];
    this._output_ready = false;
  }

  public setConfig(config: K) {
    this._config = config;
  }
}
