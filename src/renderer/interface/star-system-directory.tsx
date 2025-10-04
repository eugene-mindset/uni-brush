import { FunctionalComponent, JSX } from "preact";
import { useEffect, useState } from "preact/hooks";

import { Entity } from "@/models";
import { useMainViewContext } from "@/store";
import { Vector3 } from "three";
import { ThreeVector3ToString } from "@/util";

export const StarSystemDirectoryEntry: FunctionalComponent<{
  starSystemName?: string;
  pos?: Vector3;
}> = (props) => {
  return (
    <tr>
      <th>{props?.starSystemName}</th>
      <td>...</td>
      <td>...</td>
      <td>{ThreeVector3ToString(props?.pos)}</td>
    </tr>
  );
};

export const StarSystemDirectory: FunctionalComponent<{}> = () => {
  // const mainView = useMainViewContext();

  const [starSystems, setStarSystems] = useState<Entity.StarSystem.EntityType[]>([]);

  // TODO: make a single spot to subscribe to all entity changes within a data manager
  const onUpdateDirectory = () => {
    setStarSystems(Entity.StarSystem.Manager.getAll());
  };

  useEffect(() => {
    Entity.StarSystem.Manager.addEventListener("loaded", onUpdateDirectory);
    Entity.StarSystem.Manager.addEventListener("refresh", onUpdateDirectory);
    onUpdateDirectory();

    return () => {
      Entity.StarSystem.Manager.removeEventListener("loaded", onUpdateDirectory);
      Entity.StarSystem.Manager.removeEventListener("refresh", onUpdateDirectory);
    };
  }, []);

  return (
    <div className="scrollable-table">
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
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};
