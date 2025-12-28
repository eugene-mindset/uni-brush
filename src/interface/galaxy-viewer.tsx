import { useEffect } from "react";
import * as THREE from "three";

import { ThreeJSViewer } from "@/components";
import { useManager, useTriggerUpdate } from "@/hooks";
import { EntityTypes } from "@/models";
import { createGalaxyScene, RenderPipeline } from "@/renderer";

export interface GalaxyViewerProps {}

const GalaxyViewer: React.FC<GalaxyViewerProps> = (_: GalaxyViewerProps) => {
  const starSystemManager = useManager(EntityTypes.STAR_SYSTEM);
  const refresh = useTriggerUpdate();

  const onSelect = (pipeline: RenderPipeline) => {
    const obj3D = pipeline.selectedObject?.visual?.object3D;
    if (!obj3D) {
      pipeline.clearTargetCamera();
    } else {
      const targetCamera = new THREE.PerspectiveCamera();
      const translateV = new THREE.Vector3().subVectors(
        obj3D.position,
        pipeline.currentCamera.position,
      );
      targetCamera.position.copy(obj3D.position);
      targetCamera.position.sub(translateV.normalize().multiplyScalar(1));

      targetCamera.lookAt(obj3D.position);

      pipeline.setCameraToFocus(targetCamera.position, targetCamera.quaternion);
    }
  };

  const onCameraTargetReached = (pipeline: RenderPipeline) => {
    const obj3D = pipeline.selectedObject?.visual?.object3D;
    if (!obj3D) return;

    pipeline.controls.target.copy(obj3D.position);
  };

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
    <ThreeJSViewer
      id="mainRenderer"
      onSelect={onSelect}
      onInitialize={onInit}
      onCleanUp={onCleanUp}
      onTick={onTick}
      onCameraTargetReached={onCameraTargetReached}
    />
  );
};

export default GalaxyViewer;
