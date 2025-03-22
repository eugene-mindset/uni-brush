import { FunctionComponent } from "preact";
import { useEffect, useRef, useState } from "preact/hooks";
import * as THREE from "three";

import { Entity } from "@/models";
import { Position } from "@/types";

import { useRenderGalaxy } from "./hooks/render-galaxy";

import "@/styles/three.css";

export interface GalaxyViewerProps {}

const GalaxyViewer: FunctionComponent<GalaxyViewerProps> = (_: GalaxyViewerProps) => {
  const divRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [remount, setRemount] = useState<number>(0);

  const render = useRenderGalaxy(canvasRef);

  const onRefreshNeeded = () => {
    Entity.StarSystem.Manager.batchInitializeEntites();
    setRemount((x) => x + 1);
  };

  // generate random galaxy upon viewer (app) load
  useEffect(() => {
    const newPositions: Position[] = new Array();
    for (let index = 0; index < Entity.StarSystem.Manager.capacity; index++) {
      const vec = new THREE.Vector3().randomDirection();
      const radius = Math.random();
      newPositions.push({
        x: vec.x * 200 * radius,
        y: vec.y * 10 * Math.random(),
        z: vec.z * 200 * radius,
      });
    }

    Entity.StarSystem.Manager.batchInitializeProperty("initPos", newPositions);
    Entity.StarSystem.Manager.batchInitializeEntites();
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
