import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, RefreshControl } from "react-native";
import { MessageSquare, Bell } from "lucide-react-native";
import { useTenant } from "../../lib/tenant";
import { useCommunication } from "../../lib/hooks/useModulesData";
import { CLAY_THEME } from "../../lib/theme";
import { ClayCard } from "../../components/ClayCard";
import { LoadingCardSkeleton } from "../../components/LoadingSkeleton";

export default function CommunicationScreen() {
  const { tenant } = useTenant();
  const { announcements, loading, refetch } = useCommunication();
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
      <Text style={styles.sectionTitle}>Institutional Circulars & Broadcasts</Text>

      {loading && !refreshing ? (
        <View style={styles.skeletonPadding}>
          <LoadingCardSkeleton />
          <LoadingCardSkeleton />
        </View>
      ) : (
        announcements.map((ann: any, idx: number) => (
          <ClayCard key={ann.id || idx} style={styles.card}>
            <Text style={styles.title}>{ann.title || "School Circular"}</Text>
            <Text style={styles.sub}>
              {ann.date || "Today"} · By {ann.author || ann.sender || "Principal Office"}
            </Text>
            <Text style={styles.body}>{ann.content || ann.summary}</Text>
          </ClayCard>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: CLAY_THEME.colors.background },
  content: { padding: 16, gap: 12 },
  sectionTitle: { fontSize: 16, fontWeight: "800", color: CLAY_THEME.colors.textPrimary },
  skeletonPadding: { paddingVertical: 10 },
  card: { marginBottom: 4 },
  title: { fontSize: 15, fontWeight: "700", color: CLAY_THEME.colors.textPrimary },
  sub: { fontSize: 11, color: CLAY_THEME.colors.textSecondary, marginTop: 2, marginBottom: 8 },
  body: { fontSize: 13, color: CLAY_THEME.colors.textPrimary, lineHeight: 18 },
});
