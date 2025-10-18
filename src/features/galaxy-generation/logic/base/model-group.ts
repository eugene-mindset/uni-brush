import { ModelGenerator } from "./model-generator";
import { ModelOperator } from "./model-operator";

export class ModelGroup {
  private _entityCount: number = 1000;
  private _generator?: ModelGenerator<any, any>;
  private _operations: ModelOperator<any, any, any>[] = [];

  public constructor(count: number) {
    this._entityCount = count;
  }

  // properties

  public get generator(): ModelGenerator<any, any> | undefined {
    return this._generator;
  }

  public get operations(): ModelOperator<any, any, any>[] {
    return [...this._operations];
  }

  public get entityCount(): number {
    return this._entityCount;
  }

  public set entityCount(count: number) {
    this.entityCount = count;
    this.reset();
  }

  // group methods

  public get initialInput(): readonly any[] {
    if (!this._generator) return [];

    return this._generator.outputs;
  }

  public get finalOutput(): readonly any[] {
    if (this._operations.length === 0) return [];
    return this._operations[this._operations.length - 1].outputs;
  }

  public generate() {
    if (!this._generator) return;

    this._generator.generate();
    const initialInput = this._generator.outputs;

    this._operations.forEach((element, i, arr) => {
      const inputs = i > 0 ? arr[i - 1].outputs : initialInput;

      element.setInputs(structuredClone([...inputs]));
      element.generate();
    });
  }

  public reset() {
    this._operations.forEach((element) => {
      element.reset();
    });
  }

  // generator

  public setGenerator(generator?: ModelGenerator<any, any>) {
    this._generator = generator;
    this.reset();
  }

  // operations

  public addOperation(operation: ModelOperator<any, any, any>, index?: number) {
    if (!index) {
      this._operations.push(operation);
    } else {
      this._operations.splice(index, 0, operation);
    }

    this.reset();
  }

  public removeOperation(index: number) {
    this._operations.splice(index, 1);
    this.reset();
  }

  public duplicateOperation(index: number) {
    const clone = this._operations[index].clone();
    this.addOperation(clone);
  }

  public configOperation(index: number, config: Object) {
    this._operations[index].setConfig(config);
    this.reset();
  }
}
