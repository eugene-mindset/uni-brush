import { useEffect } from "preact/hooks";

import { Entity } from "@/models";

interface ListenerPairs {
  events: string[];
  callback: (...args: any[]) => void;
  init?: boolean;
  initArgs?: any[];
}

export const useManagerEvents = <T extends Entity.Base.ManagerType<any, any>>(
  manager: T,
  dependencies: any[],
  ...callbacks: ListenerPairs[]
) => {
  useEffect(() => {
    console.log(callbacks);

    callbacks.forEach((x) => {
      x.events.forEach((event) => manager.addEventListener(event, x.callback));
    });

    callbacks.forEach((x) => {
      if (!x.init) return;
      x.callback(x.initArgs);
    });

    return () => {
      callbacks.forEach((x) => {
        x.events.forEach((event) => manager.removeEventListener(event, x.callback));
      });
    };
  }, dependencies);
};
