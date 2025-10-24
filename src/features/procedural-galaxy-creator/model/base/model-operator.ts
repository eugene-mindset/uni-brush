export abstract class ModelOperator<I, O, K> {
  protected _config: K;

  protected _inputs: I[] = [];
  protected _outputs: O[] = [];

  protected constructor(config: K, input?: I[], output?: O[]) {
    this._config = config;

    this._inputs = input || [];
    this._outputs = output || [];
  }

  public static create(): any {
    throw new Error("Cannot call static of abstract class");
  }

  public abstract clone(): ModelOperator<I, O, K>;

  // properties

  public abstract get inputs(): I[];

  public abstract get outputs(): O[];

  public abstract get config(): K;

  // methods

  public setInputs(input: I[]) {
    input.forEach((element) => {
      this._inputs.push(element);
    });
  }

  protected abstract generateStep(element: I): O;

  public generate() {
    this.inputs.forEach((element) => {
      this._outputs.push(this.generateStep(element));
    });
  }

  public reset() {
    this._inputs = [];
    this._outputs = [];
  }

  public setConfig(config: K) {
    this._config = config;
  }
}
