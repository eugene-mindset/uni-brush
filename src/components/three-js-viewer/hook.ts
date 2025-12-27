import { useAtomValue } from "jotai";
import { useCallback, useEffect } from "react";

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

  const onClick = useCallback(() => {
    if (args?.onSelect) {
      args.onSelect(renderPipeline?.selectedObject || null);
    }
  }, [args, renderPipeline]);

  useEffect(() => {
    if (!args?.onSelect) return;
    renderPipeline?.addEventListener("on_click", onClick);

    return () => {
      renderPipeline?.removeEventListener("on_click", onClick);
    };
  }, [args?.onSelect, onClick, renderPipeline]);

  return {
    renderPipeline,
  };
};
