import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, RefreshControl } from "react-native";
import { Sparkles, TrendingUp, Cpu } from "lucide-react-native";
import { useTenant } from "../../lib/tenant";
import { useAiSummary } from "../../lib/hooks/useModulesData";
import { CLAY_THEME } from "../../lib/theme";
import { ClayCard } from "../../components/ClayCard";
import { LoadingCardSkeleton } from "../../components/LoadingSkeleton";

export default function AIDashboardScreen() {
  const { tenant } = useTenant();
  const { summary, loading, refetch } = useAiSummary();
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} tintColor={tenant.primaryColor} />}
    >
      <View style={[styles.headerCard, { backgroundColor: tenant.primaryColor }]}>
        <Sparkles size={36} color="#FFFFFF" />
        <Text style={styles.title}>School AI Analytics Engine</Text>
        <Text style={styles.sub}>Automated student progress insights & early intervention triggers</Text>
      </View>

      {loading && !refreshing ? (
        <View style={styles.skeletonPadding}>
          <LoadingCardSkeleton />
          <LoadingCardSkeleton />
        </View>
      ) : (
        <>
          <ClayCard style={styles.card}>
            <Text style={styles.kpiTitle}>AI Tutor Queries & Learning Velocity</Text>
            <Text style={styles.kpiValue}>1,420 Prompts</Text>
            <Text style={styles.kpiSub}>Top Subject: Physics (Kinematics & Optics)</Text>
          </ClayCard>

          <ClayCard style={styles.card}>
            <Text style={styles.kpiTitle}>Campus Benchmark Attendance</Text>
            <Text style={styles.kpiValue}>{(summary as any)?.attendance_rate || "96.4%"}</Text>
            <Text style={styles.kpiSub}>Target: 95% Minimum Threshold</Text>
          </ClayCard>
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: CLAY_THEME.colors.background },
  content: { padding: 16, gap: 14 },
  headerCard: { borderRadius: 24, padding: 22, alignItems: "center", ...CLAY_THEME.shadows.clayMedium },
  title: { color: "#FFFFFF", fontSize: 20, fontWeight: "800", marginTop: 10 },
  sub: { color: "rgba(255,255,255,0.88)", fontSize: 12, marginTop: 4, textAlign: "center" },
  skeletonPadding: { paddingVertical: 10 },
  card: { marginBottom: 4 },
  kpiTitle: { fontSize: 12, color: CLAY_THEME.colors.textSecondary, fontWeight: "700" },
  kpiValue: { fontSize: 26, fontWeight: "800", color: CLAY_THEME.colors.textPrimary, marginVertical: 6 },
  kpiSub: { fontSize: 12, color: "#10B981", fontWeight: "700" },
});
