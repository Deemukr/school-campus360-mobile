import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl } from "react-native";
import { Library, BookOpen, Clock } from "lucide-react-native";
import { useTenant } from "../../lib/tenant";
import { CLAY_THEME } from "../../lib/theme";
import { ClayCard } from "../../components/ClayCard";
import { apiClient } from "../../lib/apiClient";
import { API_ROUTES } from "../../lib/apiRoutes";

export default function LibraryScreen() {
  const { tenant } = useTenant();
  const [refreshing, setRefreshing] = useState(false);
  const [titles, setTitles] = useState([
    { id: "1", title: "Concepts of Physics (Vol 1) - H.C. Verma", borrowedDate: "Jul 05, 2026", dueDate: "Aug 05, 2026", daysRemaining: 14 },
    { id: "2", title: "NCERT Mathematics Class 10", borrowedDate: "Jul 10, 2026", dueDate: "Aug 10, 2026", daysRemaining: 19 },
  ]);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      const res = await apiClient(API_ROUTES.LIBRARY);
      if (res.data && Array.isArray(res.data)) {
        setTitles(res.data);
      }
    } catch (err) {
      console.warn("Library titles error", err);
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
      <Text style={styles.sectionTitle}>Active Borrowed Books & Catalog</Text>

      {titles.map((b: any, idx: number) => (
        <ClayCard key={b.id || idx} style={styles.card}>
          <Text style={styles.title}>{b.title || "Library Book Title"}</Text>
          <Text style={styles.sub}>
            Borrowed: {b.borrowedDate || "Jul 05, 2026"} · Due: {b.dueDate || "Aug 05, 2026"}
          </Text>
          <View style={styles.renewBadge}>
            <Clock size={12} color="#10B981" />
            <Text style={styles.renewText}>{b.daysRemaining || 14} Days Remaining</Text>
          </View>
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
  title: { fontSize: 15, fontWeight: "700", color: CLAY_THEME.colors.textPrimary },
  sub: { fontSize: 12, color: CLAY_THEME.colors.textSecondary, marginTop: 2, marginBottom: 10 },
  renewBadge: { flexDirection: "row", alignItems: "center", backgroundColor: "#ECFDF5", paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8, gap: 4, alignSelf: "flex-start" },
  renewText: { fontSize: 11, fontWeight: "800", color: "#047857" },
});
