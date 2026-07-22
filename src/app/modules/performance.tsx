import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, RefreshControl } from "react-native";
import { TrendingUp, BarChart2 } from "lucide-react-native";
import { useTenant } from "../../lib/tenant";
import { CLAY_THEME } from "../../lib/theme";
import { ClayCard } from "../../components/ClayCard";
import { apiClient } from "../../lib/apiClient";
import { API_ROUTES } from "../../lib/apiRoutes";

export default function PerformanceScreen() {
  const { tenant } = useTenant();
  const [refreshing, setRefreshing] = useState(false);
  const [cohorts, setCohorts] = useState([
    { id: "1", name: "Grade 10 Mathematics Cohort", avg: "78.4%", highest: "99%", status: "IMPROVING" },
    { id: "2", name: "Grade 12 Physics Mechanics", avg: "82.1%", highest: "100%", status: "STABLE" },
  ]);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      const res = await apiClient(API_ROUTES.PERFORMANCE);
      if (res.data && Array.isArray(res.data)) {
        setCohorts(res.data);
      }
    } catch (err) {
      console.warn("Performance fetch error", err);
    } finally {
      setRefreshing(false);
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} tintColor={tenant.primaryColor} />}
    >
      <Text style={styles.sectionTitle}>Cohort Performance & Calibration</Text>
      {cohorts.map((c: any, idx: number) => (
        <ClayCard key={c.id || idx} style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.title}>{c.name || c.cohortName}</Text>
            <Text style={styles.trendText}>{c.status || "STABLE"}</Text>
          </View>
          <Text style={styles.sub}>
            Batch Average: {c.avg || "80%"} · Highest Score: {c.highest || "100%"}
          </Text>
        </ClayCard>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: CLAY_THEME.colors.background },
  content: { padding: 16, gap: 12 },
  sectionTitle: { fontSize: 16, fontWeight: "800", color: CLAY_THEME.colors.textPrimary },
  card: { marginBottom: 4 },
  cardHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 4 },
  title: { fontSize: 15, fontWeight: "700", color: CLAY_THEME.colors.textPrimary },
  trendText: { fontSize: 11, fontWeight: "800", color: "#10B981" },
  sub: { fontSize: 12, color: CLAY_THEME.colors.textSecondary },
});
