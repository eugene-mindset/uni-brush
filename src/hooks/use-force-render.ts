import { useState } from "react";

export function useForceRender() {
  // eslint-disable-next-line react-compiler/react-compiler
  "use no memo"; // the purpose of this hook is to ALWAYS re-render when called

  const [stateCount, setStateCount] = useState(0);
  const forceRender = (debug?: string) =>
    setStateCount((x) => {
      debug && console.log(debug);
      return x + 1;
    });

  return {
    forceRender,
    forceRenderKey: `force-render-${stateCount}`,
  };
}
