import { MathHelpers } from "@/util";
import { ModelOperator } from "./model-operator";
import { ModelGroup } from "./model-group";
import { ModelGenerator } from "./model-generator";

interface ModelOperationIndex {
  group: number;
  operation: number;
}

export class ModelCreator {
  public readonly ENTITY_COUNT: number = 100000;

  private _groups: ModelGroup[] = [];

  public constructor() {}

  // properties

  public get groups(): ModelGroup[] {
    return [...this._groups];
  }

  public get entityCount(): number {
    return this._groups.map((x) => x.entityCount).reduce((a, x) => a + x);
  }

  // groups

  public createGroup(count: number) {
    this._groups.push(new ModelGroup(count));
  }

  public addGroup(group: ModelGroup) {
    this._groups.push(group);
  }

  public deleteGroup(index: number) {
    this._groups.splice(index, 1);
  }

  public setCountForGroup(index: ModelOperationIndex, count: number) {
    const currentGroupCount = this._groups[index.group].entityCount;
    const actualAdjustment = MathHelpers.clamp(
      count,
      0,
      this.ENTITY_COUNT - this.entityCount - currentGroupCount
    );

    this._groups[index.group].entityCount = actualAdjustment;
  }

  // generators

  public setGenerator(index: number, generator: ModelGenerator<any, any>) {
    this._groups[index].setGenerator(generator);
  }

  // operations

  public addOperation(index: ModelOperationIndex, operation: ModelOperator<any, any, any>) {
    this._groups[index.group].addOperation(operation, index.operation);
  }

  public setOperation(index: ModelOperationIndex, operation: ModelOperator<any, any, any>) {
    this._groups[index.group].removeOperation(index.operation);
    this._groups[index.group].addOperation(operation, index.operation);
  }

  public moveOperation(initIndex: ModelOperationIndex, finalIndex: ModelOperationIndex) {
    const operation = this._groups[initIndex.group].operations[initIndex.operation];

    this._groups[finalIndex.group].addOperation(operation, finalIndex.operation);
  }

  public removeOperation(index: ModelOperationIndex) {
    this._groups[index.group].removeOperation(index.operation);
  }

  public configOperation(index: ModelOperationIndex, config: Object) {
    this._groups[index.group].configOperation(index.operation, config);
  }

  public duplicateOperation(index: ModelOperationIndex) {
    this._groups[index.group].duplicateOperation(index.operation);
  }
}
