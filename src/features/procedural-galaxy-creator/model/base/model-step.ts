export abstract class ModelStep<O, K extends Object> {
  protected _config: K;

  // constructors
  protected constructor(config: K) {
    this._config = config;
  }

  public static create(): any {
    throw new Error("Cannot call static of abstract class");
  }

  // properties

  public abstract get outputs(): O[];

  public abstract get config(): K;

  // methods

  protected abstract generateStep(): O;

  public setConfig(config: K) {
    this._config = { ...config };
  }
}
