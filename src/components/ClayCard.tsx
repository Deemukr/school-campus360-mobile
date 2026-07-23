import React from "react";
import { TouchableOpacity, View, StyleSheet, ViewStyle, StyleProp } from "react-native";
import * as Haptics from "expo-haptics";
import { CLAY_THEME } from "../lib/theme";

interface ClayCardProps {
  children: React.ReactNode;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  variant?: "default" | "highlight" | "outlined";
  haptic?: boolean;
}

export const ClayCard: React.FC<ClayCardProps> = ({
  children,
  onPress,
  style,
  variant = "default",
  haptic = true,
}) => {
  const handlePress = () => {
    if (!onPress) return;
    if (haptic) {
      Haptics.selectionAsync();
    }
    onPress();
  };

  const variantStyle =
    variant === "highlight"
      ? styles.highlightCard
      : variant === "outlined"
      ? styles.outlinedCard
      : styles.defaultCard;

  if (onPress) {
    return (
      <TouchableOpacity
        activeOpacity={0.88}
        onPress={handlePress}
        style={[styles.baseCard, variantStyle, style]}
      >
        {children}
      </TouchableOpacity>
    );
  }

  return <View style={[styles.baseCard, variantStyle, style]}>{children}</View>;
};

const styles = StyleSheet.create({
  baseCard: {
    borderRadius: CLAY_THEME.borderRadius.lg,
    padding: 18,
    borderWidth: 3,
  },
  defaultCard: {
    backgroundColor: CLAY_THEME.colors.cardBg,
    borderColor: CLAY_THEME.colors.border,
    ...CLAY_THEME.shadows.claySoft,
  },
  highlightCard: {
    backgroundColor: "#FAF5FF",
    borderColor: CLAY_THEME.colors.primary,
    ...CLAY_THEME.shadows.clayMedium,
  },
  outlinedCard: {
    backgroundColor: "#FFFFFF",
    borderColor: "#E2E8F0",
  },
});
