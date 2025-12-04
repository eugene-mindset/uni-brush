import { Entity, EntityTypes } from "@/models";
import { atom } from "jotai";

const managers = {
  [EntityTypes.STAR_SYSTEM]: new Entity.StarSystem.Manager(),
};

export const starSystemManagerAtom = atom((_get) => managers[EntityTypes.STAR_SYSTEM]);

export const managerAtoms = {
  [EntityTypes.STAR_SYSTEM]: atom((_get) => managers[EntityTypes.STAR_SYSTEM]),
};
