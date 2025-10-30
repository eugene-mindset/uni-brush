export abstract class Step<O, K extends Object> {
  protected _config: K;

  public readonly stepKey: string = "Base";

  // constructors

  protected constructor(config: K) {
    this._config = config;
  }

  public static create(): Step<any, any> {
    throw new Error("Cannot call static of abstract class");
  }

  public abstract clone(): Step<O, K>;

  // properties

  public abstract get config(): K;

  // methods

  protected abstract generateStep(idx: number, ...args: any[]): O;

  public abstract generate(...args: any[]): O[];

  public setConfig(config: K) {
    this._config = { ...config };
  }
}
