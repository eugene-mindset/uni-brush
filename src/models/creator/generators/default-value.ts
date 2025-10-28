import { ModelGenerator } from "../base";

interface Config<T> {
  defaultValue: T | null;
}

export class DefaultValue<T> extends ModelGenerator<T | null, Config<T>> {
  public override readonly stepKey: string = "Generator:DefaultValue";

  public static override create(): DefaultValue<any> {
    return new DefaultValue({
      defaultValue: null,
    });
  }

  public clone(): DefaultValue<T> {
    return new DefaultValue<T>({ ...this.config });
  }

  public get config(): Config<T> {
    return {
      ...this._config,
    };
  }

  protected override generateStep(): T | null {
    return this._config.defaultValue;
  }
}
