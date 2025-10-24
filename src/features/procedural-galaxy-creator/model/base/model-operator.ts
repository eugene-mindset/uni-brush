import { ModelStep } from "./model-step";

export abstract class ModelOperator<O, K extends Object> extends ModelStep<O, K> {
  // methods

  public static create(): ModelOperator<any, any> {
    throw new Error("Cannot call static of abstract class");
  }

  public abstract clone(): ModelOperator<O, K>;

  protected abstract override generateStep(input: O): O;

  public generate(inputs: O[]): O[] {
    const out: O[] = [];

    inputs.forEach((element) => {
      out.push(this.generateStep(element));
    });

    return out;
  }
}
