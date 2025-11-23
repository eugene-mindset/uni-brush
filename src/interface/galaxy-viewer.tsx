import { FunctionalComponent } from "preact";
import { useEffect, useRef, useState } from "preact/hooks";

import { useRenderGalaxy } from "@/hooks";
import { Entity, Procedural } from "@/models";

export interface GalaxyViewerProps {}

const GalaxyViewer: FunctionalComponent<GalaxyViewerProps> = (_: GalaxyViewerProps) => {
  const divRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [remount, setRemount] = useState<number>(0);

  const [render, config] = useRenderGalaxy(canvasRef);

  /// refresh, usually a result of all new data being set
  const onRefreshNeeded = () => {
    Entity.StarSystem.Manager.batchInitializeEntities();
    setRemount((x) => x + 1);
  };

  // generate a random layout upon initial visit
  useEffect(() => {
    const newVectors = Procedural.generateGalaxyBase(config);
    const afterArm = Procedural.armsGalaxyModifier(newVectors, config);

    const finalVectors = config.showDebug ? newVectors : afterArm;

    Entity.StarSystem.Manager.batchInitializeProperty("initPos", finalVectors);
    Entity.StarSystem.Manager.batchInitializeEntities();
  }, []);

  // setup to non-state events
  useEffect(() => {
    Entity.StarSystem.Manager.addEventListener("load", onRefreshNeeded);
    Entity.StarSystem.Manager.addEventListener("reset", onRefreshNeeded);

    return () => {
      Entity.StarSystem.Manager.removeEventListener("load", onRefreshNeeded);
      Entity.StarSystem.Manager.addEventListener("reset", onRefreshNeeded);
    };
  }, []);

  // remount renderer when a refresh is indicated
  useEffect(() => {
    render.initialize();

    return () => {
      console.log("cleanup triggered!");
      render.cleanUp();
    };
  }, [remount]);

  return (
    <div ref={divRef} id="threeMainRender">
      <canvas ref={canvasRef} />
    </div>
  );
};

export default GalaxyViewer;
