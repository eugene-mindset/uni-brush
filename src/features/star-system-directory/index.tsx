import { useCallback, useEffect, useState } from "react";
import { Vector3 } from "three";

import { Panel, useThreeJSViewer } from "@/components";
import { useManager } from "@/hooks";
import { Entity, EntityTypes } from "@/models";
import { ThreeHelpers } from "@/util";

interface EntryProps {
  onClick?: () => void;
  starSystemName?: string;
  pos?: Vector3;
}

const StarSystemDirectoryEntry: React.FC<EntryProps> = (props: EntryProps) => {
  return (
    <tr>
      <th className="center">
        <button className="core-hover clear fill" onClick={() => props?.onClick && props.onClick()}>
          {props?.starSystemName || "Untitled"} System
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

export const StarSystemDirectory: React.FC = () => {
  const { renderPipeline } = useThreeJSViewer("mainRenderer");
  const starSystemManager = useManager(EntityTypes.STAR_SYSTEM);

  const [starSystems, setStarSystems] = useState<Entity.StarSystemEntity[]>(
    starSystemManager.getAll(),
  );

  // TODO: make a single spot to subscribe to all entity changes within a data manager
  const onUpdateDirectory = useCallback(() => {
    setStarSystems(starSystemManager.getAll());
  }, [starSystemManager]);

  useEffect(() => {
    starSystemManager.addEventListener("load", onUpdateDirectory);

    return () => {
      starSystemManager.removeEventListener("load", onUpdateDirectory);
    };
  }, [onUpdateDirectory, starSystemManager]);

  return (
    <Panel title="Geography / Directory" width="700px" maxHeight="450px" canToggle>
      <div className="flex-col">
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
                pos={x.initPos}
                key={x.id}
                onClick={() => {
                  if (!x.obj3D?.object3D) return;
                  renderPipeline?.selectFromParam(x.obj3D.object3D);
                }}
              />
            ))}
          </tbody>
        </table>
      </div>
    </Panel>
  );
};
