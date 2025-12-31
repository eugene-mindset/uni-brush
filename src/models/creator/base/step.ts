export abstract class Step<O, K extends object> {
  protected _config: K;
  public readonly id: string;

  public static readonly stepKey: string = "Base";

  // constructors

  protected constructor(config: K) {
    this.id = crypto.randomUUID();
    this._config = config;
  }

  public static create(): Step<unknown, object> {
    throw new Error("Cannot call static of abstract class");
  }

  public abstract clone(): Step<O, K>;

  // properties

  public abstract get config(): K;

  public get stepKey(): string {
    return Step.stepKey;
  }

  // methods

  protected abstract generateStep(_count: number, _idx: number, ..._args: unknown[]): O;

  public abstract generate(..._args: unknown[]): O[];

  public setConfig(config: K) {
    this._config = { ...config };
  }
}
