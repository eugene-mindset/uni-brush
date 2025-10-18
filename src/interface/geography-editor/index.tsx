import { FunctionalComponent } from "preact";

import { Panel } from "@/components";

import "@/styles/ui.css";

export const GeographyEditor: FunctionalComponent<{}> = (props) => {
  return (
    <Panel title="Geography / Editor" canToggle width="450px">
      <Panel.Header>
        <h2>Base Config</h2>
      </Panel.Header>
      <div className="form-list">
        <div className="row">
          <label>Name:</label>
          <input type="text" />
        </div>

        <div className="border">
          <Panel.Header>
            <h2>Group 1</h2>
          </Panel.Header>
          <div className="border">
            <Panel.Header>
              <h3>Normal Distribution Generator</h3>
            </Panel.Header>
            <div className="row">
              <label>X:</label>
              <input type="number" />

              <label>Y:</label>
              <input type="number" />

              <label>Z:</label>
              <input type="number" />
            </div>
          </div>
        </div>
      </div>
    </Panel>
  );
};
