import { Generator } from "./generator";
import { Operator } from "./operator";
import { Step } from "./step";

export class ValuePipeline<T> {
  private _generator?: Generator<T, any>;
  private _operators: Operator<T, any>[] = [];

  private _outputs: T[][] = [];

  // properties

  public get generator(): Generator<T, any> | undefined {
    return this._generator;
  }

  public get operators(): Operator<T, any>[] {
    return [...this._operators];
  }

  public get orderOfOperations(): Step<T, any>[] {
    return [this._generator, ...this._operators] as Step<T, any>[];
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

  public setGenerator(generator?: typeof Generator<any, any>): Generator<any, any> | undefined {
    this._generator = generator?.create();
    this.reset();

    return this._generator;
  }

  public configGenerator(config: Object) {
    this._generator?.setConfig(config);
    this.reset();
  }

  // operators
  public setOperator(index: number, operator: typeof Operator<any, any>): Operator<any, any> {
    const newOp = operator.create();
    this._operators[index] = newOp;
    this.reset();

    return newOp;
  }

  public createOperator(operator: typeof Operator<any, any>): Operator<any, any> {
    const newOp = operator.create();
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

  public configOperator(index: number, config: Object) {
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
