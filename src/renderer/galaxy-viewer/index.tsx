import { FunctionComponent } from "preact";
import { useEffect, useRef, useState } from "preact/hooks";
import * as THREE from "three";

import { StarSystemManager } from "@/models/star-system";
import { mountMainThreeRenderer } from "@/renderer/threejs";
import { Position } from "@/types";

import "@/styles/three.css";

export interface GalaxyViewerProps {}

const GalaxyViewer: FunctionComponent<GalaxyViewerProps> = (props: GalaxyViewerProps) => {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const [remount, setRemount] = useState<number>(0);

  const onRefresh = () => {
    StarSystemManager.batchInitializeEntites();
    setRemount((x) => x + 1);
  };

  useEffect(() => {
    const newPositions: Position[] = new Array();
    for (let index = 0; index < StarSystemManager.capacity; index++) {
      const vec = new THREE.Vector3().randomDirection();
      const radius = Math.random();
      newPositions.push({
        x: vec.x * 200 * radius,
        y: vec.y * 10 * Math.random(),
        z: vec.z * 200 * radius,
      });
    }

    StarSystemManager.batchInitializeValue("initPos", newPositions);
    StarSystemManager.batchInitializeEntites();
  }, []);

  useEffect(() => {
    StarSystemManager.subscribe("refresh", onRefresh);
    return () => StarSystemManager.unsubscribe("refresh", onRefresh);
  }, [onRefresh]);

  useEffect(() => {
    mountMainThreeRenderer(mountRef);
  }, [remount]);

  return <div key={remount} className="threeMainRender" ref={mountRef} />;
};

export default GalaxyViewer;
