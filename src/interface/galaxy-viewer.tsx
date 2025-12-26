import { useEffect } from "react";

import { ThreeJSViewer } from "@/components";
import { useManager, useTriggerUpdate } from "@/hooks";
import { EntityTypes } from "@/models";
import { createGalaxyScene, RenderPipeline } from "@/renderer";

export interface GalaxyViewerProps {}

const GalaxyViewer: React.FC<GalaxyViewerProps> = (_: GalaxyViewerProps) => {
  const starSystemManager = useManager(EntityTypes.STAR_SYSTEM);
  const refresh = useTriggerUpdate();

  const onInit = (pipeline: RenderPipeline) => {
    createGalaxyScene(starSystemManager.getAll(), pipeline.scene);
  };

  const onCleanUp = (_pipeline: RenderPipeline) => {
    starSystemManager.disposeVisuals();
  };

  const onTick = (pipeline: RenderPipeline, _delta: number) => {
    starSystemManager.updateVisualScale(pipeline.currentCamera.position);
  };

  useEffect(() => {
    starSystemManager.addEventListener("create_all", refresh);

    return () => {
      starSystemManager.removeEventListener("create_all", refresh);
    };
  }, [refresh, starSystemManager]);

  return (
    <ThreeJSViewer id="mainRenderer" onInitialize={onInit} onCleanUp={onCleanUp} onTick={onTick} />
  );
};

export default GalaxyViewer;
