import { FunctionalComponent, JSX } from "preact";
import { useRef } from "preact/hooks";

import { Panel } from "@/components";

import * as CreatorView from "./components";
import { Creator } from "@/models";
import { Entity } from "@/models";
import { Vector3 } from "three";

const initModel = () => {
  const model = new Creator.Base.EntityPipeline<Entity.StarSystem.EntityType>();
  model.createPipeline("initialPosition");
  model.createPipeline("name");

  model.pipelines["initialPosition"]?.setGenerator(Creator.Generators.NormalDistribution);
  model.pipelines["initialPosition"]?.createOperator(Creator.Operators.BasicGravity);
  model.pipelines["initialPosition"]?.createOperator(Creator.Operators.ArmGravity);

  model.pipelines["name"]?.setGenerator(Creator.Generators.DefaultValue<string>);
  model.pipelines["name"]?.generator?.setConfig({ defaultValue: "Test Star" });

  return model;
};

export const ProceduralCreator: FunctionalComponent<{}> = () => {
  const coreModelRef = useRef(initModel());

  const count = Entity.StarSystem.Manager.capacity;

  const onClickGenerate = (_event: JSX.TargetedMouseEvent<HTMLButtonElement>) => {
    coreModelRef.current.generate(count);
    const outputs = coreModelRef.current.getOutputs();
    console.log(coreModelRef);

    Entity.StarSystem.Manager.fullReset();
    Entity.StarSystem.Manager.batchInitializeProperty(
      "initPos",
      outputs.initialPosition as Vector3[]
    );
    Entity.StarSystem.Manager.batchInitializeProperty("name", outputs.name as string[]);
  };

  const pipelines = coreModelRef.current.pipelines;

  return (
    <Panel title="Geography / Editor" canToggle width="650px" maxHeight="1000px">
      <Panel.Header>
        <h2>Base Config</h2>
      </Panel.Header>
      <div className="form-list">
        <Panel.Input type="text" labelText="Generator Name" />
        <h3>Entities</h3>
        <Panel.Input type="checkbox" labelText="Star Systems" />
        <Panel.Header>
          <h2>Star Systems</h2>
        </Panel.Header>
        <Panel.Group>
          <Panel.Header>
            <h3>Group 1 - [ADD NAME]</h3>
          </Panel.Header>
          {Object.keys(pipelines).map((x) => {
            const pipeline = pipelines[x as keyof typeof pipelines];
            console.log(x);
            if (!pipeline) return null;

            return <CreatorView.BasePipelineComponent key={x} pipeline={pipeline} property={x} />;
          })}
        </Panel.Group>
      </div>
      <div className="space-top gap flex-row justify-right">
        <button className="core float-right">Save</button>
        <button className="core float-right" onClick={onClickGenerate}>
          Generate
        </button>
      </div>
    </Panel>
  );
};
