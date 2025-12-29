import { Panel } from "@/components";
import { useProceduralCreatorModel } from "@/hooks";
import { EntityTypes } from "@/models";

import * as CreatorView from "./components";

export const ProceduralCreator: React.FC = () => {
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
      <br />
      <br />
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
