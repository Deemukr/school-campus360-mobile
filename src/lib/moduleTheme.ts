export interface ModuleTheme {
  from: string;
  to: string;
  bgLight: string;
}

const DEFAULT_THEME: ModuleTheme = {
  from: "#0081CC",
  to: "#10B981",
  bgLight: "#EFF6FF",
};

const MODULE_THEMES: Record<string, ModuleTheme> = {
  admissions: { from: "#3B82F6", to: "#1D4ED8", bgLight: "#EFF6FF" },
  sis: { from: "#6366F1", to: "#4338CA", bgLight: "#EEF2FF" },
  attendance: { from: "#10B981", to: "#047857", bgLight: "#ECFDF5" },
  fees: { from: "#F59E0B", to: "#D97706", bgLight: "#FFFBEB" },
  communication: { from: "#EC4899", to: "#BE185D", bgLight: "#FDF2F8" },
  concerns: { from: "#8B5CF6", to: "#6D28D9", bgLight: "#F5F3FF" },
  gradebook: { from: "#06B6D4", to: "#0E7490", bgLight: "#ECFEFF" },
  certificates: { from: "#EAB308", to: "#CA8A04", bgLight: "#FEFCE8" },
  hr: { from: "#64748B", to: "#334155", bgLight: "#F8FAFC" },
  health_discipline: { from: "#EF4444", to: "#B91C1C", bgLight: "#FEF2F2" },
  learner_profile: { from: "#14B8A6", to: "#0F766E", bgLight: "#F0FDFA" },
  dynamic_forms: { from: "#F97316", to: "#C2410C", bgLight: "#FFF7ED" },
  approvals: { from: "#10B981", to: "#059669", bgLight: "#ECFDF5" },
  wellbeing: { from: "#F43F5E", to: "#BE123C", bgLight: "#FFF1F2" },
  digital_library: { from: "#8B5CF6", to: "#4C1D95", bgLight: "#F5F3FF" },
  performance_calibration: { from: "#3B82F6", to: "#1E40AF", bgLight: "#EFF6FF" },
  transport: { from: "#F59E0B", to: "#B45309", bgLight: "#FFFBEB" },
  hostel: { from: "#A855F7", to: "#7E22CE", bgLight: "#FAF5FF" },
  inventory: { from: "#6B7280", to: "#374151", bgLight: "#F9FAFB" },
  ai_dashboard: { from: "#8B5CF6", to: "#EC4899", bgLight: "#F5F3FF" },
  ai_tutor: { from: "#0081CC", to: "#8B5CF6", bgLight: "#F0F9FF" },
};

export function getModuleTheme(key: string): ModuleTheme {
  return MODULE_THEMES[key] || DEFAULT_THEME;
}
