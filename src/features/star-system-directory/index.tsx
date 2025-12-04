import { useCallback, useEffect, useState } from "react";
import { Vector3 } from "three";

import { Entity } from "@/models";
import { useMainViewContext } from "@/context";
import { ThreeHelpers } from "@/util";
import { Panel } from "@/components";
import { useAtomValue, useSetAtom } from "jotai";
import { starSystemManagerAtom } from "@/store";

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
  const starSystemManager = useAtomValue(starSystemManagerAtom);
  const mainView = useMainViewContext();

  const setSelectedRefAtom = useSetAtom(mainView.pointer.select.ref);

  const [starSystems, setStarSystems] = useState<Entity.StarSystem.Entity[]>(
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
                pos={x.initPos}
                key={x.id}
                onClick={() => {
                  setSelectedRefAtom({
                    refVisual: x.obj3D,
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
