import { useAtomValue } from "jotai/react";
import { atomEffect } from "jotai-effect";
import { useMemo } from "react";

type EffectFn = Parameters<typeof atomEffect>[0];

export function useAtomEffect(effectFn: EffectFn) {
  useAtomValue(useMemo(() => atomEffect(effectFn), [effectFn]));
}
