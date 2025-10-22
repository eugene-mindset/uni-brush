import { DeepReadonly } from "@/types";

export abstract class ModelOperator<I, O, K> {
  private _config: K;

  protected _inputs: I[] = [];
  protected _output: O[] = [];

  private _output_ready: boolean = false;

  protected constructor(config: K, input?: I[], output?: O[]) {
    this._config = config;

    this._inputs = input || [];

    this._output = output || [];
    this._output_ready = !!output;
  }

  public static create(): any {
    throw new Error("Cannot call static of abstract class");
  }

  public abstract clone(): ModelOperator<I, O, K>;

  // properties

  public get inputs(): DeepReadonly<I[]> {
    return this._inputs as DeepReadonly<I[]>;
  }

  public get outputs(): DeepReadonly<O[]> {
    if (this._output_ready) return [];
    return this._output as DeepReadonly<O[]>;
  }

  public get config(): DeepReadonly<K> {
    return this._config as DeepReadonly<K>;
  }

  // methods

  public setInputs(input: I[]) {
    input.forEach((element) => {
      this._inputs.push({ ...element });
    });
  }

  protected abstract generateStep(element: I): O;

  public generate() {
    this._inputs.forEach((element) => {
      this._output.push(structuredClone(this.generateStep(element)));
    });

    this._output_ready = true;
  }

  public reset() {
    this._inputs = [];
    this._output = [];
    this._output_ready = false;
  }

  public setConfig(config: K) {
    this._config = config;
  }
}
