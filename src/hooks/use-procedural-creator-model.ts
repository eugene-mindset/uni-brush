import { Vector3 } from "three";

import { useAtom } from "jotai";
import { galaxyGeneratorModelAtom } from "@/store/editor";
import { useStarSystemManager } from "@/hooks";

export const useProceduralCreatorModel = () => {
  const starSystemManager = useStarSystemManager();
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
