import { useCallback, useEffect, useRef } from "react";

import { useRenderGalaxy, useStarSystemManager } from "@/hooks";

export interface GalaxyViewerProps {}

const GalaxyViewer: React.FC<GalaxyViewerProps> = (_: GalaxyViewerProps) => {
  const starSystemManager = useStarSystemManager();
  const divRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [render] = useRenderGalaxy(canvasRef);

  const refreshRenderer = useCallback(() => {
    render.cleanUp();
    render.initialize();
  }, [render]);

  useEffect(() => {
    starSystemManager.addEventListener("load", refreshRenderer);

    return () => {
      starSystemManager.removeEventListener("load", refreshRenderer);
    };
  }, [refreshRenderer, starSystemManager]);

  useEffect(() => {
    refreshRenderer();
  }, []);

  return (
    <div ref={divRef} id="threeMainRender">
      <canvas ref={canvasRef} />
    </div>
  );
};

export default GalaxyViewer;
