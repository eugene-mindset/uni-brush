import { Generator } from "../base";

interface Config<T> {
  defaultValue: T | undefined;
}

export class DefaultValue<T> extends Generator<T | undefined, Config<T>> {
  public static override readonly stepKey: string = "Generator:DefaultValue";

  public static override create(): DefaultValue<unknown> {
    return new DefaultValue({
      defaultValue: undefined,
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

  protected override generateStep(): T | undefined {
    return this._config.defaultValue;
  }
}
