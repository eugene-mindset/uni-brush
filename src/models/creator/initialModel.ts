import { StarSystemEntity } from "../entities";
import { Base, Generators, Operators } from ".";

export const initModel = () => {
  const model = new Base.EntityFactory<StarSystemEntity>();
  const mainEntityPipe = model.createPipeline(1750, "Primary Shape");
  mainEntityPipe.createPipeline("initPos");
  mainEntityPipe.createPipeline("name");

  mainEntityPipe.pipelines["initPos"]?.setGenerator(Generators.NormalDistributionVector);
  mainEntityPipe.pipelines["initPos"]?.createOperator(Operators.BasicGravity);
  mainEntityPipe.pipelines["initPos"]?.createOperator(Operators.ArmGravity);

  mainEntityPipe.pipelines["name"]?.setGenerator(Generators.DefaultValue<string>);
  mainEntityPipe.pipelines["name"]?.generator?.setConfig({ defaultValue: "Primary Star" });

  const testEntityPipe = model.createPipeline(750, "Secondary Shape");
  testEntityPipe.createPipeline("initPos");
  testEntityPipe.createPipeline("name");

  testEntityPipe.pipelines["initPos"]?.setGenerator(Generators.NormalDistributionVector);

  const NewType = Generators.DefaultValue<string>;

  testEntityPipe.pipelines["name"]?.setGenerator(NewType);
  testEntityPipe.pipelines["name"]?.generator?.setConfig({ defaultValue: "Secondary Star" });

  return model;
};
