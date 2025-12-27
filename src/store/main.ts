import { atom, getDefaultStore } from "jotai";
import { atomFamily } from "jotai/utils";
import { observe } from "jotai-effect";
import _ from "lodash";

import { RenderPipeline, RenderPipelineIntersection } from "@/renderer";

export const renderPipelineAtomFamily = atomFamily(
  (_id: string) => atom<RenderPipeline | null>(null),
  (a: string, b: string) => _.isEqual(a, b),
);

export const mainRenderPipelineAtom = atom((get) => get(renderPipelineAtomFamily("mainRenderer")));
export const mainRenderPipelineSelectedAtom = atom<RenderPipelineIntersection | null>(null);

observe((get, set) => {
  const renderPipeline = get(mainRenderPipelineAtom);

  const onClick = () => {
    set(mainRenderPipelineSelectedAtom, renderPipeline?.selectedObject || null);
  };

  renderPipeline?.addEventListener("on_click", onClick);

  return () => {
    renderPipeline?.removeEventListener("on_click", onClick);
  };
});

const defaultStore = getDefaultStore();
defaultStore.sub(mainRenderPipelineAtom, () => {
  const renderPipeline = defaultStore.get(mainRenderPipelineAtom);
  console.log(renderPipeline);

  const onClick = () => {
    defaultStore.set(mainRenderPipelineSelectedAtom, renderPipeline?.selectedObject || null);
  };

  renderPipeline?.addEventListener("on_click", onClick);

  return () => {
    renderPipeline?.removeEventListener("on_click", onClick);
  };
});
