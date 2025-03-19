import { FunctionComponent } from "preact";
import { useEffect, useRef } from "preact/hooks";

import { mountMainThreeRenderer } from "@/renderer/threejs";
import "@/styles/three.css";

export interface GalaxyViewerProps {}

const GalaxyViewer: FunctionComponent<GalaxyViewerProps> = (props: GalaxyViewerProps) => {
  const mountRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    mountMainThreeRenderer(mountRef);
  });

  return <div className="threeMainRender" ref={mountRef} />;
};

export default GalaxyViewer;
