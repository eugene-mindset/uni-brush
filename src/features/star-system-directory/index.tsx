import { useCallback, useState } from "react";
import { Vector3 } from "three";

import { Entity } from "@/models";
import { useMainViewContext } from "@/store";
import { ThreeHelpers } from "@/util";
import { Panel } from "@/components";
import { useManagerEvents } from "@/hooks";
import { useSetAtom } from "jotai";

const StarSystemDirectoryEntry: React.FC<{
  onClick?: () => void;
  starSystemName?: string;
  pos?: Vector3;
}> = (props) => {
  return (
    <tr>
      <th className="center">
        <button className="core-hover clear fill" onClick={() => props?.onClick && props.onClick()}>
          {props?.starSystemName} System
        </button>
      </th>
      <td className="center">...</td>
      <td className="center">...</td>
      <td className="center">
        {ThreeHelpers.ThreeVector3ToString(props?.pos, "coord", {
          compactDisplay: "short",
          minimumIntegerDigits: 3,
          minimumFractionDigits: 3,
          useGrouping: false,
          signDisplay: "always",
        })}
      </td>
    </tr>
  );
};

export const StarSystemDirectory: React.FC<{}> = () => {
  const mainView = useMainViewContext();

  const setSelectedRefAtom = useSetAtom(mainView.pointer.select.ref);

  const [starSystems, setStarSystems] = useState<Entity.StarSystem.EntityType[]>(
    Entity.StarSystem.Manager.getAll(),
  );

  // TODO: make a single spot to subscribe to all entity changes within a data manager
  const onUpdateDirectory = useCallback(() => {
    setStarSystems(Entity.StarSystem.Manager.getAll());
  }, []);

  useManagerEvents(Entity.StarSystem.Manager, [], {
    events: ["load", "refresh"],
    callback: onUpdateDirectory,
  });

  return (
    <Panel title="Geography / Directory" width="700px" maxHeight="450px" canToggle>
      <div className="flex-col scrollable">
        <table className="directory alt-row-table">
          <thead>
            <tr>
              <th>System Name</th>
              <th>Star Name</th>
              <th>Star Type</th>
              <th>Galactic Position</th>
            </tr>
          </thead>
          <tbody>
            {starSystems.map((x) => (
              <StarSystemDirectoryEntry
                starSystemName={x.name}
                pos={x.initialPosition}
                key={x.publicId}
                onClick={() => {
                  setSelectedRefAtom({
                    refVisual: x.visual,
                    refEntity: x,
                    refType: x.type,
                  });
                }}
              />
            ))}
          </tbody>
        </table>
      </div>
    </Panel>
  );
};
