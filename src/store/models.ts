import { atom } from "jotai";

import { Entity, EntityTypes, initModel } from "@/models";

const managers = {
  [EntityTypes.STAR_SYSTEM]: new Entity.StarSystemManager(),
};

export const starSystemManagerAtom = atom((_get) => managers[EntityTypes.STAR_SYSTEM]);

export const managerAtoms = {
  [EntityTypes.STAR_SYSTEM]: atom((_get) => managers[EntityTypes.STAR_SYSTEM]),
};

export const galaxyGeneratorModelAtom = atom(initModel());
