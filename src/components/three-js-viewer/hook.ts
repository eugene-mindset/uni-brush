import { useAtomValue } from "jotai";
import { useEffect } from "react";

import { RenderPipeline, RenderPipelineIntersection } from "@/renderer";
import { renderPipelineAtomFamily } from "@/store";

interface UseThreeJSViewerArgs {
  onSelect?: (selected: RenderPipelineIntersection | null) => void;
}

interface UseThreeJSViewerOut {
  renderPipeline: RenderPipeline | null;
}

export const useThreeJSViewer = (
  id: string,
  args?: Partial<UseThreeJSViewerArgs>,
): UseThreeJSViewerOut => {
  const renderPipeline = useAtomValue(renderPipelineAtomFamily(id));

  useEffect(() => {
    const onClick = () => {
      args?.onSelect && args?.onSelect(renderPipeline?.selectedObject || null);
    };

    renderPipeline?.addEventListener("on_click", onClick);

    return () => {
      renderPipeline?.removeEventListener("on_click", onClick);
    };
  }, [args, args?.onSelect, renderPipeline]);

  return {
    renderPipeline,
  };
};
