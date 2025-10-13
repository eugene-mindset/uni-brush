import { FunctionalComponent } from "preact";

import { Panel } from "@/components";

export const GeographyEditor: FunctionalComponent<{}> = (props) => {
  return (
    <Panel title="Geography / Editor" canToggle width="450px">
      <Panel.Header>
        <h2>Base</h2>
      </Panel.Header>
      This is a test.
    </Panel>
  );
};
