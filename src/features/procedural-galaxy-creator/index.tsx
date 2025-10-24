import { FunctionalComponent, JSX } from "preact";
import { useEffect, useRef, useState } from "preact/hooks";

import { Panel } from "@/components";

import * as CreatorView from "./components";
import * as CreateModel from "./model";
import { ModelEntityCreator } from "./model/base";
import { Entity } from "@/models";

export const ProceduralCreator: FunctionalComponent<{}> = () => {
  const count = Entity.StarSystem.Manager.capacity;
  const [modelLoaded, setModelLoaded] = useState(false);

  const coreModelRef = useRef(new ModelEntityCreator());
  useEffect(() => {
    const model = coreModelRef.current;
    model.createGroup(count);
    model.setGenerator(0, CreateModel.Generators.NormalDistribution);
    model.createOperator(0, CreateModel.Operators.BasicGravityPull);
    model.createOperator(0, CreateModel.Operators.ArmGravityPull);

    setModelLoaded(true);
  }, []);

  console.log(coreModelRef.current);
  const onClickGenerate = (event: JSX.TargetedMouseEvent<HTMLButtonElement>) => {
    coreModelRef.current.generate();

    Entity.StarSystem.Manager.fullReset();
    Entity.StarSystem.Manager.batchInitializeProperty(
      "initPos",
      coreModelRef.current.groups[0].finalOutput
    );
  };

  return (
    <Panel title="Geography / Editor" canToggle width="650px">
      {modelLoaded && (
        <>
          <Panel.Header>
            <h2>Base Config</h2>
          </Panel.Header>
          <div className="form-list">
            <Panel.Input type="text" labelText="Generator Name" />
            <Panel.Group>
              <Panel.Header>
                <h2>Group 1</h2>
              </Panel.Header>
              <CreatorView.Generators.NormalDistribution
                step={coreModelRef.current.groups[0].generator}
                order={1}
              />
            </Panel.Group>
          </div>
          <div className="space-top">
            <button className="core float-right" onClick={onClickGenerate}>
              Generate
            </button>
          </div>
        </>
      )}
    </Panel>
  );
};
