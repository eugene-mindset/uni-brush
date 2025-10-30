import { Step } from "./step";

export abstract class Operator<O, K extends Object> extends Step<O, K> {
  public readonly stepKey: string = "Operator";
  // methods

  public static create(): Operator<any, any> {
    throw new Error("Cannot call static of abstract class");
  }

  public abstract clone(): Operator<O, K>;

  protected abstract override generateStep(idx: number, input: O): O;

  public generate(inputs: O[]): O[] {
    const out: O[] = [];

    inputs.forEach((element, idx) => {
      out.push(this.generateStep(idx, element));
    });

    return out;
  }
}
