import { atom } from "jotai";

import { Entity, EntityTypes } from "@/models";

const managers = {
  [EntityTypes.STAR_SYSTEM]: new Entity.StarSystem.Manager(),
};

export const starSystemManagerAtom = atom((_get) => managers[EntityTypes.STAR_SYSTEM]);

export const managerAtoms = {
  [EntityTypes.STAR_SYSTEM]: atom((_get) => managers[EntityTypes.STAR_SYSTEM]),
};

console.log(managers);
