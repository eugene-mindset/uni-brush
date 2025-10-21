import { FunctionalComponent } from "preact";

import { Panel } from "@/components";

import "@/styles/ui.css";

export const ProceduralCreator: FunctionalComponent<{}> = () => {
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
          <Panel.Header>
            <h3>1. Normal Distribution Generator</h3>
          </Panel.Header>
          <div className="flex-row gap fit-in-container">
            <span>Position:</span>
            <Panel.Input type="number" labelText="X" />
            <Panel.Input type="number" labelText="Y" />
            <Panel.Input type="number" labelText="Z" />
          </div>
        </Panel.Group>
      </div>
    </Panel>
  );
};
