import { useAtom } from "jotai";
import { Vector3 } from "three";

import { useManager } from "@/hooks";
import { EntityTypes } from "@/models";
import { galaxyGeneratorModelAtom } from "@/store/models";

export const useProceduralCreatorModel = () => {
  const starSystemManager = useManager(EntityTypes.STAR_SYSTEM);
  const [galaxyGeneratorModel, _] = useAtom(galaxyGeneratorModelAtom);

  const generate = (_event?: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    galaxyGeneratorModel.generate();
    const outputs = galaxyGeneratorModel.getOutputs();

    starSystemManager.fullReset();
    starSystemManager.setAttributePer("initPos", outputs.initPos as Vector3[]);
    starSystemManager.setAttributePer("name", outputs.name as string[]);
    starSystemManager.initializeEntities();
  };

  return {
    coreModel: galaxyGeneratorModel,
    generate,
  };
};
