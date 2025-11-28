import { useEffect } from "react";

import { Entity } from "@/models";

interface ListenerPairs {
  events: string[];
  callback: (...args: never[]) => void;
  init?: boolean;
  initArgs?: never[];
}

export const useManagerEvents = <T extends Entity.Base.ManagerType<any, any>>(
  manager: T,
  dependencies: never[],
  ...callbacks: ListenerPairs[]
) => {
  useEffect(() => {
    callbacks.forEach((x) => {
      x.events.forEach((event) => manager.addEventListener(event, x.callback));
    });

    callbacks.forEach((x) => {
      if (!x.init || !x.initArgs || !x.initArgs[Symbol.iterator]) return;
      x.callback(...x.initArgs!);
    });

    return () => {
      callbacks.forEach((x) => {
        x.events.forEach((event) => manager.removeEventListener(event, x.callback));
      });
    };
  }, [manager, dependencies, callbacks]);
};
