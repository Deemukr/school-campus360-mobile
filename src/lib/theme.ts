import { StyleSheet } from "react-native";

export const CLAY_THEME = {
  colors: {
    primary: "#4F46E5",
    primaryLight: "#E0E7FF",
    secondary: "#818CF8",
    cta: "#F97316",
    ctaLight: "#FFEDD5",
    background: "#EEF2FF",
    cardBg: "#FFFFFF",
    textPrimary: "#1E1B4B",
    textSecondary: "#64748B",
    textMuted: "#94A3B8",
    border: "#C7D2FE",
    borderLight: "#EEF2FF",
    success: "#10B981",
    warning: "#F59E0B",
    danger: "#EF4444",
    info: "#3B82F6",
  },
  borderRadius: {
    sm: 12,
    md: 18,
    lg: 24,
    xl: 32,
    pill: 9999,
  },
  shadows: {
    claySoft: {
      shadowColor: "#4F46E5",
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.12,
      shadowRadius: 12,
      elevation: 6,
    },
    clayMedium: {
      shadowColor: "#4338CA",
      shadowOffset: { width: 0, height: 12 },
      shadowOpacity: 0.15,
      shadowRadius: 16,
      elevation: 10,
    },
    clayButton: {
      shadowColor: "#EA580C",
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.25,
      shadowRadius: 10,
      elevation: 8,
    },
  },
};

export const globalStyles = StyleSheet.create({
  clayCard: {
    backgroundColor: CLAY_THEME.colors.cardBg,
    borderRadius: CLAY_THEME.borderRadius.lg,
    padding: 16,
    borderWidth: 3,
    borderColor: CLAY_THEME.colors.border,
    ...CLAY_THEME.shadows.claySoft,
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: CLAY_THEME.borderRadius.pill,
    alignSelf: "flex-start",
  },
  badgeText: {
    fontSize: 11,
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
});
