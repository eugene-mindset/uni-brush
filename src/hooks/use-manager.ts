import { EntityTypes } from "@/models";
import { managerAtoms } from "@/store";
import { useAtom } from "jotai";

export const useStarSystemManager = () => {
  const [manager, _setManager] = useAtom(managerAtoms[EntityTypes.STAR_SYSTEM]);

  return manager;
};
