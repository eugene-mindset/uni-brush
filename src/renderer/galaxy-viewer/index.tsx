import { FunctionComponent } from "preact";
import { useEffect, useRef } from "preact/hooks";
import { mountMainThreeRenderer } from "./threejs";

export interface GalaxyViewerProps {}

const GalaxyViewer: FunctionComponent<GalaxyViewerProps> = (props: GalaxyViewerProps) => {
  const mountRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    mountMainThreeRenderer(mountRef);
  });

  return <div className="vis" ref={mountRef} />;
};

export default GalaxyViewer;
