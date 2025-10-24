export abstract class ModelStep<O, K extends Object> {
  protected _config: K;

  // constructors

  protected constructor(config: K) {
    this._config = config;
  }

  public static create(): ModelStep<any, any> {
    throw new Error("Cannot call static of abstract class");
  }

  public abstract clone(): ModelStep<O, K>;

  // properties

  public abstract get config(): K;

  // methods

  protected abstract generateStep(...args: any[]): O;

  public abstract generate(...args: any[]): O[];

  public setConfig(config: K) {
    this._config = { ...config };
  }
}
