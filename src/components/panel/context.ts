import { createContext } from "preact";

interface PanelState {}

export const PanelContext = createContext<PanelState>({});
