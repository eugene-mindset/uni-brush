import { FunctionalComponent } from "preact";

import { Panel } from "@/components";

import * as CreatorView from "./components";
import { EntityTypes } from "@/models";

import { useProceduralCreatorModel } from "./hooks";

export const ProceduralCreator: FunctionalComponent<{}> = () => {
  const { coreModel, generate } = useProceduralCreatorModel();

  return (
    <Panel title="Geography / Editor" canToggle width="650px" maxHeight="1000px">
      <Panel.Header>
        <h2>Base Config</h2>
      </Panel.Header>
      <div className="form-list">
        <Panel.Input type="text" labelText="Generator Name" />
        <h3>Entities</h3>
        <div className="grid-5">
          <Panel.Input type="checkbox" labelText="Star Systems" />
          <Panel.Input type="checkbox" labelText="Star Dust" />
          <Panel.Input type="checkbox" labelText="Special Structures" />
          <Panel.Input type="checkbox" labelText="Lanes" />
          <Panel.Input type="checkbox" labelText="Lanes" />
        </div>
      </div>
      <CreatorView.BaseFactoryComponent factory={coreModel} entity={EntityTypes.STAR_SYSTEM} />
      <div className="space-top gap flex-row justify-right">
        <button className="core float-right">Save</button>
        <button className="core float-right" onClick={generate}>
          Generate
        </button>
      </div>
    </Panel>
  );
};
