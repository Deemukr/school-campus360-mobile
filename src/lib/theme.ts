import { StyleSheet } from "react-native";

export const CLAY_THEME = {
  colors: {
    primary: "#7C3AED",
    primaryLight: "#F3E8FF",
    secondary: "#A78BFA",
    cta: "#F97316",
    ctaLight: "#FFEDD5",
    background: "#FAF5FF",
    cardBg: "#FFFFFF",
    textPrimary: "#1E1B4B",
    textSecondary: "#64748B",
    textMuted: "#94A3B8",
    border: "#E9D5FF",
    borderLight: "#F1F5F9",
    success: "#10B981",
    warning: "#F59E0B",
    danger: "#EF4444",
    info: "#3B82F6",
  },
  borderRadius: {
    sm: 8,
    md: 14,
    lg: 20,
    xl: 26,
    pill: 9999,
  },
  shadows: {
    claySoft: {
      shadowColor: "#7C3AED",
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.08,
      shadowRadius: 12,
      elevation: 4,
    },
    clayMedium: {
      shadowColor: "#4C1D95",
      shadowOffset: { width: 0, height: 10 },
      shadowOpacity: 0.12,
      shadowRadius: 20,
      elevation: 8,
    },
    clayButton: {
      shadowColor: "#F97316",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.25,
      shadowRadius: 10,
      elevation: 6,
    },
  },
};

export const globalStyles = StyleSheet.create({
  clayCard: {
    backgroundColor: CLAY_THEME.colors.cardBg,
    borderRadius: CLAY_THEME.borderRadius.lg,
    padding: 16,
    borderWidth: 1.5,
    borderColor: CLAY_THEME.colors.border,
    ...CLAY_THEME.shadows.claySoft,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: CLAY_THEME.borderRadius.pill,
    alignSelf: "flex-start",
  },
  badgeText: {
    fontSize: 11,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
});
