import { FunctionalComponent, JSX } from "preact";
import { useEffect, useState } from "preact/hooks";

import { Entity } from "@/models";
import { useMainViewContext } from "@/store";
import { Vector3 } from "three";
import { ThreeVector3ToString } from "@/util";

const StarSystemDirectoryEntry: FunctionalComponent<{
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
        {ThreeVector3ToString(props?.pos, "coord", {
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

export const StarSystemDirectory: FunctionalComponent<{}> = () => {
  const mainView = useMainViewContext();

  const [starSystems, setStarSystems] = useState<Entity.StarSystem.EntityType[]>([]);

  // TODO: make a single spot to subscribe to all entity changes within a data manager
  const onUpdateDirectory = () => {
    setStarSystems(Entity.StarSystem.Manager.getAll());
    console.log("refreshed star directory")!;
  };

  useEffect(() => {
    Entity.StarSystem.Manager.addEventListener("load", onUpdateDirectory);
    Entity.StarSystem.Manager.addEventListener("refresh", onUpdateDirectory);
    onUpdateDirectory();

    return () => {
      Entity.StarSystem.Manager.removeEventListener("load", onUpdateDirectory);
      Entity.StarSystem.Manager.removeEventListener("refresh", onUpdateDirectory);
    };
  }, []);

  return (
    <div draggable className="panel wide directory scrollable-table alt-row-table core-div">
      <table>
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
                mainView.pointer.select.ref.value = {
                  refVisual: x.visual,
                  refEntity: x,
                  refType: x.type,
                };
              }}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};
