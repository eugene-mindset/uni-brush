import { Generator } from "../base";

interface Config<T> {
  defaultValue: T | null;
}

export class DefaultValue<T> extends Generator<T | null, Config<T>> {
  public static override readonly stepKey: string = "Generator:DefaultValue";

  public static override create(): DefaultValue<never> {
    return new DefaultValue({
      defaultValue: null,
    });
  }

  public clone(): DefaultValue<T> {
    return new DefaultValue<T>({ ...this.config });
  }

  public override get stepKey(): string {
    return DefaultValue.stepKey;
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
