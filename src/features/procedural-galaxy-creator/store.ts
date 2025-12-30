import { atom } from "jotai";

import { Entity } from "@/models";

export const creatorEntityFactoryTypeAtom = atom<Entity.EntityTypes>(Entity.EntityTypes.BASE);
