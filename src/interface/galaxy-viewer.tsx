import { useEffect, useRef, useState } from "react";

import { useManagerEvents, useRenderGalaxy } from "@/hooks";
import { Entity } from "@/models";

export interface GalaxyViewerProps {}

const GalaxyViewer: React.FC<GalaxyViewerProps> = (_: GalaxyViewerProps) => {
  const divRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [render] = useRenderGalaxy(canvasRef);

  useManagerEvents(Entity.StarSystem.Manager, [], {
    events: ["load", "refresh"],
    callback: () => {
      render.cleanUp();
      render.initialize();
    },
    init: false,
  });

  return (
    <div ref={divRef} id="threeMainRender">
      <canvas ref={canvasRef} />
    </div>
  );
};

export default GalaxyViewer;
