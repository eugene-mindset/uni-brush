import { useAtomValue } from "jotai";

import { EntityTypes } from "@/models";
import { managerAtoms } from "@/store";

export const useManager = <Type extends EntityTypes>(entityType: Type) => {
  const manager = useAtomValue(managerAtoms[entityType as keyof typeof managerAtoms]);

  return manager;
};

// export const useStarSystemManager = () => {
//   const [manager, _setManager] = useAtom(managerAtoms[EntityTypes.STAR_SYSTEM]);

//   return manager;
// };

// const starSystemManager = useManager(EntityTypes.STAR_SYSTEM);
