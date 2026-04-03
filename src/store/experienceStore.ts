import { create } from "zustand";

type GatewayId = "cyrus" | "alpha" | "corporate" | "lab";

interface ExperienceState {
  activeGateway: GatewayId;
  setActiveGateway: (gateway: GatewayId) => void;
}

export const useExperienceStore = create<ExperienceState>((set) => ({
  activeGateway: "cyrus",
  setActiveGateway: (gateway) => set({ activeGateway: gateway }),
}));

export type { GatewayId };
