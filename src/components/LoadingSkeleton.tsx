import React, { useEffect, useRef } from "react";
import { View, Animated, StyleSheet, StyleProp, ViewStyle } from "react-native";
import { CLAY_THEME } from "../lib/theme";

interface LoadingSkeletonProps {
  width?: number | `${number}%` | "auto";
  height?: number;
  borderRadius?: number;
  style?: StyleProp<ViewStyle>;
}

export const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({
  width = "100%",
  height = 20,
  borderRadius = CLAY_THEME.borderRadius.sm,
  style,
}) => {
  const opacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 0.8,
          duration: 750,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.3,
          duration: 750,
          useNativeDriver: true,
        }),
      ])
    );
    pulse.start();
    return () => pulse.stop();
  }, [opacity]);

  return (
    <Animated.View
      style={[
        styles.skeleton,
        {
          width,
          height,
          borderRadius,
          opacity,
        },
        style,
      ]}
    />
  );
};

export const LoadingCardSkeleton: React.FC = () => (
  <View style={styles.cardContainer}>
    <LoadingSkeleton height={24} width="60%" style={{ marginBottom: 12 }} />
    <LoadingSkeleton height={16} width="90%" style={{ marginBottom: 8 }} />
    <LoadingSkeleton height={16} width="40%" />
  </View>
);

const styles = StyleSheet.create({
  skeleton: {
    backgroundColor: "#E2E8F0",
  },
  cardContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: CLAY_THEME.borderRadius.lg,
    padding: 16,
    borderWidth: 1.5,
    borderColor: CLAY_THEME.colors.border,
    marginBottom: 12,
  },
});
