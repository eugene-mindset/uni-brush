import { FunctionalComponent } from "preact";
import { useRef } from "preact/hooks";

import { Panel } from "@/components";

import * as CreatorView from "./components";
import * as CreateModel from "./logic";

export const ProceduralCreator: FunctionalComponent<{}> = () => {
  const testModel = useRef(CreateModel.Generators.NormalDistribution.create(1000));

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
    </Panel>
  );
};
