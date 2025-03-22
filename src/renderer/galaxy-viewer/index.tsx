import { FunctionComponent } from "preact";
import { useEffect, useRef, useState } from "preact/hooks";
import * as THREE from "three";

import { Data } from "@/models";
import { useRenderGalaxy } from "@/renderer/threejs/mount-galaxy-renderer";
import { Position } from "@/types";

import "@/styles/three.css";

export interface GalaxyViewerProps {}

const GalaxyViewer: FunctionComponent<GalaxyViewerProps> = (_: GalaxyViewerProps) => {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const pointerRef = useRef<THREE.Vector2>(new THREE.Vector2());
  const [remount, setRemount] = useState<number>(0);

  const render = useRenderGalaxy(mountRef);

  const onWindowResize = () => {
    if (!render.camera || !render.renderer) return;

    render.camera.aspect = window.innerWidth / window.innerHeight;
    render.camera.updateProjectionMatrix();
    render.renderer.setSize(window.innerWidth, window.innerHeight);
  };

  const onPointerMove = (event: PointerEvent) => {
    pointerRef.current.set(
      (event.clientX / window.innerWidth) * 2 - 1,
      -(event.clientY / window.innerHeight) * 2 + 1
    );
  };

  const onRefreshNeeded = () => {
    Data.StarSystem.Manager.batchInitializeEntites();
    setRemount((x) => x + 1);
  };

  useEffect(() => {
    window.addEventListener("resize", onWindowResize);
    window.addEventListener("pointermove", onPointerMove);
    Data.StarSystem.Manager.subscribe("refresh", onRefreshNeeded);

    return () => {
      window.removeEventListener("resize", onWindowResize);
      window.removeEventListener("pointermove", onPointerMove);
      Data.StarSystem.Manager.unsubscribe("refresh", onRefreshNeeded);
    };
  }, [onRefreshNeeded]);

  // generate random galaxy upon viewer (app) load
  useEffect(() => {
    const newPositions: Position[] = new Array();
    for (let index = 0; index < Data.StarSystem.Manager.capacity; index++) {
      const vec = new THREE.Vector3().randomDirection();
      const radius = Math.random();
      newPositions.push({
        x: vec.x * 200 * radius,
        y: vec.y * 10 * Math.random(),
        z: vec.z * 200 * radius,
      });
    }

    Data.StarSystem.Manager.batchInitializeProperty("initPos", newPositions);
    Data.StarSystem.Manager.batchInitializeEntites();
  }, []);

  // remount renderer when a refresh is indicated
  useEffect(() => {
    render.initialize();

    return () => {
      render.cleanUp();
    };
  }, [remount]);

  return <div ref={mountRef} className="threeMainRender" />;
};

export default GalaxyViewer;
