import { FunctionalComponent } from "preact";
import { useEffect, useRef, useState } from "preact/hooks";

import { Entity } from "@/models";

import { useRenderGalaxy } from "./hooks/render-galaxy";

import "@/styles/three.css";
import { Procedural } from "@/models";

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
    Entity.StarSystem.Manager.setAsReady();
  }, []);

  // setup to non-state events
  useEffect(() => {
    Entity.StarSystem.Manager.addEventListener("refresh", onRefreshNeeded);

    return () => {
      Entity.StarSystem.Manager.removeEventListener("refresh", onRefreshNeeded);
    };
  }, []);

  // remount renderer when a refresh is indicated
  useEffect(() => {
    render.initialize();

    return () => {
      render.cleanUp();
    };
  }, [remount]);

  return (
    <div ref={divRef} className="threeMainRender">
      <canvas ref={canvasRef} />
    </div>
  );
};

export default GalaxyViewer;
