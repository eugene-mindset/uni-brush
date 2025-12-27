import { useState } from "react";

export function useTriggerUpdate() {
  const [_stateCount, setStateCount] = useState(0);
  const triggerStateChange = () => setStateCount((x) => x + 1);
  return triggerStateChange;
}
