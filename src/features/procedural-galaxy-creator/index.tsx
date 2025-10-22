import { FunctionalComponent, JSX } from "preact";
import { useRef } from "preact/hooks";

import { Panel } from "@/components";

import * as CreatorView from "./components";
import * as CreateModel from "./model";
import { ModelCreator } from "./model/base";
import { Entity } from "@/models";

export const ProceduralCreator: FunctionalComponent<{}> = () => {
  const count = Entity.StarSystem.Manager.capacity;

  const coreModel = useRef(new ModelCreator());
  const testModel = useRef(CreateModel.Generators.NormalDistribution.create(count));

  const onClickGenerate = (event: JSX.TargetedMouseEvent<HTMLButtonElement>) => {
    testModel.current.generate();

    Entity.StarSystem.Manager.fullReset();
    Entity.StarSystem.Manager.batchInitializeProperty("initPos", testModel.current.outputs);
  };

  return (
    <Panel title="Geography / Editor" canToggle width="650px">
      <Panel.Header>
        <h2>Base Config</h2>
      </Panel.Header>
      <div className="form-list">
        <Panel.Input type="text" labelText="Generator Name" />
        <Panel.Group>
          <Panel.Header>
            <h2>Group 1</h2>
          </Panel.Header>
          <CreatorView.Generators.NormalDistribution generator={testModel.current} order={1} />
        </Panel.Group>
      </div>
      <div className="space-top">
        <button className="core float-right" onClick={onClickGenerate}>
          Generate
        </button>
      </div>
    </Panel>
  );
};
