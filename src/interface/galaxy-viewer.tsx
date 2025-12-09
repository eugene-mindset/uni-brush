import { useCallback, useEffect, useRef } from "react";

import { useManager, useRenderGalaxy } from "@/hooks";
import { EntityTypes } from "@/models";

export interface GalaxyViewerProps {}

const GalaxyViewer: React.FC<GalaxyViewerProps> = (_: GalaxyViewerProps) => {
  const starSystemManager = useManager(EntityTypes.STAR_SYSTEM);
  const divRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [render] = useRenderGalaxy(canvasRef);

  const refreshRenderer = useCallback(() => {
    render.cleanUp();
    render.initialize();
  }, [render]);

  useEffect(() => {
    starSystemManager.addEventListener("create_all", refreshRenderer);

    return () => {
      starSystemManager.removeEventListener("create_all", refreshRenderer);
    };
  }, [refreshRenderer, starSystemManager]);

  useEffect(() => {
    refreshRenderer();
  }, [refreshRenderer]);

  return (
    <div ref={divRef} id="threeMainRender">
      <canvas ref={canvasRef} />
    </div>
  );
};

export default GalaxyViewer;
