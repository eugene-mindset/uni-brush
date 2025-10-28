import { ModelStep } from "./step";

export abstract class ModelGenerator<O, K extends Object> extends ModelStep<O, K> {
  public readonly stepKey: string = "Generator";
  // methods

  public static create(): ModelGenerator<any, any> {
    throw new Error("Cannot call static of abstract class");
  }

  public abstract clone(): ModelGenerator<O, K>;

  public generate(count: number): O[] {
    const out: O[] = [];

    for (let i = 0; i < count; i++) {
      out.push(this.generateStep(i));
    }

    return out;
  }
}
