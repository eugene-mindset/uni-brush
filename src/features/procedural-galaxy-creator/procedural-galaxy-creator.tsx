import { Panel } from "@/components";
import { useProceduralCreatorModel } from "@/hooks";
import { EntityTypes } from "@/models";

import { CreatorEntityFactoryEditor } from "./components";

export const ProceduralGalaxyCreator: React.FC = () => {
  const { coreModel, generate } = useProceduralCreatorModel();

  return (
    <Panel
      title="Geography / Editor"
      titleContent={
        <div className="gap flex-row justify-right mg-right">
          <button className="core block-center float-right">Save</button>
          <button className="core block-center float-right" onClick={generate}>
            Generate
          </button>
        </div>
      }
      canToggle
      width="650px"
      maxHeight="1000px"
    >
      <Panel.Header>
        <h2>Base Config</h2>
      </Panel.Header>
      <div className="form-list">
        <Panel.Input type="text" labelText="Generator Name" />
        {/* <h3>Entities</h3>
        <div className="grid-5">
          <Panel.Input type="checkbox" labelText="Star Systems" />
          <Panel.Input type="checkbox" labelText="Star Dust" />
          <Panel.Input type="checkbox" labelText="Special Structures" />
          <Panel.Input type="checkbox" labelText="Lanes" />
          <Panel.Input type="checkbox" labelText="Lanes" />
        </div> */}
      </div>
      <br />
      <CreatorEntityFactoryEditor entityFactory={coreModel} entity={EntityTypes.STAR_SYSTEM} />
    </Panel>
  );
};
