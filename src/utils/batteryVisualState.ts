export type BatteryStateTier = "healthy" | "caution" | "critical";

export interface BatteryVisualState {
  tier: BatteryStateTier;
  color: string;
  accentColor: string;
  textColor: string;
  bgBadge: string;
  borderColor: string;
  glowColor: string;
  labelKey: "systemHealthy" | "systemCaution" | "systemLowBattery";
}

export const getBatteryVisualState = (soc: number): BatteryVisualState => {
  if (soc > 50) {
    return {
      tier: "healthy",
      color: "#10B981",
      accentColor: "#2DD4BF",
      textColor: "text-emerald-400",
      bgBadge: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
      borderColor: "border-emerald-500/40",
      glowColor: "rgba(16, 185, 129, 0.35)",
      labelKey: "systemHealthy",
    };
  }
  if (soc >= 15) {
    return {
      tier: "caution",
      color: "#F59E0B",
      accentColor: "#FBBF24",
      textColor: "text-amber-400",
      bgBadge: "bg-amber-500/15 text-amber-300 border-amber-500/30",
      borderColor: "border-amber-500/40",
      glowColor: "rgba(245, 158, 11, 0.35)",
      labelKey: "systemCaution",
    };
  }
  return {
    tier: "critical",
    color: "#EF4444",
    accentColor: "#F87171",
    textColor: "text-rose-400",
    bgBadge: "bg-rose-500/15 text-rose-300 border-rose-500/30",
    borderColor: "border-rose-500/40",
    glowColor: "rgba(239, 68, 68, 0.45)",
    labelKey: "systemLowBattery",
  };
};
