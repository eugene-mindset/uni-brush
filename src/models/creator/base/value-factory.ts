import { Generator } from "./generator";
import { Operator } from "./operator";
import { Step } from "./step";

export class ValueFactory<T> {
  private _generator?: Generator<T, object>;
  private _operators: Operator<T, object>[] = [];

  private _outputs: T[][] = [];

  // properties

  public get generator(): Generator<T, object> | undefined {
    return this._generator;
  }

  public get operators(): Operator<T, object>[] {
    return [...this._operators];
  }

  public get orderOfOperations(): Step<T, object>[] {
    return [this._generator, ...this._operators] as Step<T, object>[];
  }

  public get output(): T[] {
    if (this._outputs.length === 0) return [];
    return this._outputs[this._outputs.length - 1];
  }

  // group methods

  public reset() {
    this._outputs = [];
  }

  public generate(count: number) {
    this.reset();

    if (!this._generator) return;
    this._outputs.push(this._generator.generate(count));

    this._operators.forEach((element) => {
      this._outputs.push(element.generate(this.output));
    });
  }

  // generator

  public setGenerator(generator?: typeof Generator<T, object>): Generator<T, object> | undefined {
    this._generator = generator?.create() as Generator<T, object>;
    this.reset();

    return this._generator;
  }

  public configGenerator(config: object) {
    this._generator?.setConfig(config);
    this.reset();
  }

  // operators
  public setOperator(index: number, operator: typeof Operator<T, object>): Operator<T, object> {
    const newOp = operator.create() as Operator<T, object>;
    this._operators[index] = newOp;
    this.reset();

    return newOp;
  }

  public createOperator(operator: typeof Operator<T, object>): Operator<T, object> {
    const newOp = operator.create() as Operator<T, object>;
    this._operators.push(newOp);
    this.reset();

    return newOp;
  }

  public removeOperator(index: number) {
    this._operators.splice(index, 1);
    this.reset();
  }

  public duplicateOperator(index: number) {
    const clone = this._operators[index].clone();
    this._operators.splice(index + 1, 0, clone);
    this.reset();
  }

  public configOperator(index: number, config: object) {
    this._operators[index].setConfig(config);
    this.reset();
  }

  public moveOperator(index: number, dir: "up" | "down") {
    const delta = dir === "up" ? -1 : 1;
    const dest = index + delta;

    if (dest < 0 || dest >= this._operators.length) {
      return;
    }

    const temp = this._operators[index];
    this._operators[index] = this._operators[dest];
    this._operators[dest] = temp;
  }
}
