import { useRef, useState } from "react";

import { MathHelpers } from "@/util";

interface Args {
  enabled?: boolean;
  isBounded?: boolean;
  containerWidth?: number;
  containerHeight?: number;
  boundWidth?: number;
  boundHeight?: number;
  initX?: number;
  initY?: number;
}

export const useDraggable = (args: Args) => {
  const [position, setPosition] = useState({ x: args?.initX || 0, y: args?.initY || 0 });
  const isDragging = useRef(false);
  const startOffset = useRef({ x: 0, y: 0 });

  const onPointerDown = (e: React.PointerEvent) => {
    if (!args.enabled) return;

    isDragging.current = true;
    startOffset.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    };
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);
  };

  const onPointerMove = (e: PointerEvent) => {
    if (!args.enabled) return;

    if (!isDragging.current) return;

    let newX = e.clientX - startOffset.current.x;
    let newY = e.clientY - startOffset.current.y;

    if (
      args.isBounded &&
      args?.boundWidth &&
      args?.boundHeight &&
      args?.containerWidth &&
      args?.containerHeight
    ) {
      newX = MathHelpers.clamp(newX, 0, args.boundWidth - args.containerWidth);
      newY = MathHelpers.clamp(newY, 0, args.boundHeight - args.containerHeight);
    }

    setPosition({ x: newX, y: newY });
  };

  const onPointerUp = (_e: PointerEvent) => {
    if (!args.enabled) return;

    isDragging.current = false;
    window.removeEventListener("pointermove", onPointerMove);
    window.removeEventListener("pointerup", onPointerUp);
  };

  return {
    onPointerDown,
    position,
    setPosition,
    isDragging: isDragging.current,
    transform: `translate(${position.x}px, ${position.y}px)`,
  };
};
