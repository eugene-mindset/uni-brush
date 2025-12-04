import { useCallback, useEffect, useRef } from "react";

import { useRenderGalaxy } from "@/hooks";
import { starSystemManagerAtom } from "@/store";
import { useAtomValue } from "jotai";

export interface GalaxyViewerProps {}

const GalaxyViewer: React.FC<GalaxyViewerProps> = (_: GalaxyViewerProps) => {
  const starSystemManager = useAtomValue(starSystemManagerAtom);
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

  return (
    <div ref={divRef} id="threeMainRender">
      <canvas ref={canvasRef} />
    </div>
  );
};

export default GalaxyViewer;
