import { Creator, Entity } from "..";

export const initModel = () => {
  const model = new Creator.Base.EntityFactory<Entity.StarSystem.Entity>();
  const mainEntityPipe = model.createPipeline(1750, "Primary Shape");
  mainEntityPipe.createPipeline("initPos");
  mainEntityPipe.createPipeline("name");

  mainEntityPipe.pipelines["initPos"]?.setGenerator(Creator.Generators.NormalDistributionVector);
  mainEntityPipe.pipelines["initPos"]?.createOperator(Creator.Operators.BasicGravity);
  mainEntityPipe.pipelines["initPos"]?.createOperator(Creator.Operators.ArmGravity);

  mainEntityPipe.pipelines["name"]?.setGenerator(Creator.Generators.DefaultValue<string>);
  mainEntityPipe.pipelines["name"]?.generator?.setConfig({ defaultValue: "Primary Star" });

  const testEntityPipe = model.createPipeline(750, "Secondary Shape");
  testEntityPipe.createPipeline("initPos");
  testEntityPipe.createPipeline("name");

  testEntityPipe.pipelines["initPos"]?.setGenerator(Creator.Generators.NormalDistributionVector);

  const NewType = Creator.Generators.DefaultValue<string>;

  testEntityPipe.pipelines["name"]?.setGenerator(NewType);
  testEntityPipe.pipelines["name"]?.generator?.setConfig({ defaultValue: "Secondary Star" });

  return model;
};
