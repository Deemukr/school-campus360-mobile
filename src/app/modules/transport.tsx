import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl } from "react-native";
import { Bus, MapPin, Phone, Shield, Navigation } from "lucide-react-native";
import { useTenant } from "../../lib/tenant";
import { useTransport } from "../../lib/hooks/useModulesData";
import { CLAY_THEME } from "../../lib/theme";
import { ClayCard } from "../../components/ClayCard";
import { LoadingCardSkeleton } from "../../components/LoadingSkeleton";

export default function TransportScreen() {
  const { tenant } = useTenant();
  const { routes, loading, refetch } = useTransport();
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
      <View style={[styles.statusCard, { backgroundColor: tenant.primaryColor }]}>
        <Bus size={40} color="#FFFFFF" />
        <Text style={styles.busNo}>Traccar GPS Telemetry Gateway</Text>
        <Text style={styles.eta}>Realtime Vehicle Tracking & Geofence Active</Text>
      </View>

      <Text style={styles.sectionTitle}>Active Fleet Routes ({routes.length})</Text>

      {loading && !refreshing ? (
        <View style={styles.skeletonPadding}>
          <LoadingCardSkeleton />
          <LoadingCardSkeleton />
        </View>
      ) : (
        routes.map((rt: any, idx: number) => (
          <ClayCard key={rt.id || idx} style={styles.card}>
            <View style={styles.cardHeader}>
              <View style={styles.routeBadge}>
                <Navigation size={12} color={tenant.primaryColor} />
                <Text style={[styles.routeName, { color: tenant.primaryColor }]}>
                  {rt.routeName || "Route #01"}
                </Text>
              </View>
              <Text style={styles.speedText}>{rt.speed || "35 km/h"}</Text>
            </View>

            <Text style={styles.busDetails}>
              Vehicle: {rt.busNo || "DL-01-AB-1234"} • {rt.studentsCount || 40} Students
            </Text>

            <View style={styles.driverRow}>
              <Phone size={14} color={CLAY_THEME.colors.textSecondary} />
              <Text style={styles.info}>Driver: {rt.driver || "Ramesh Kumar (+91 98765 00112)"}</Text>
            </View>
          </ClayCard>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: CLAY_THEME.colors.background },
  content: { padding: 16, gap: 14 },
  statusCard: { borderRadius: 24, padding: 22, alignItems: "center", ...CLAY_THEME.shadows.clayMedium },
  busNo: { color: "#FFFFFF", fontSize: 18, fontWeight: "800", marginTop: 10 },
  eta: { color: "rgba(255,255,255,0.88)", fontSize: 12, marginTop: 4 },
  sectionTitle: { fontSize: 16, fontWeight: "800", color: CLAY_THEME.colors.textPrimary },
  skeletonPadding: { paddingVertical: 10 },
  card: { marginBottom: 4 },
  cardHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 6 },
  routeBadge: { flexDirection: "row", alignItems: "center", backgroundColor: "#F3E8FF", paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8, gap: 4 },
  routeName: { fontSize: 13, fontWeight: "800" },
  speedText: { fontSize: 12, fontWeight: "700", color: "#10B981" },
  busDetails: { fontSize: 13, fontWeight: "600", color: CLAY_THEME.colors.textPrimary, marginBottom: 8 },
  driverRow: { flexDirection: "row", alignItems: "center", gap: 6, paddingTop: 8, borderTopWidth: 1, borderTopColor: "#F1F5F9" },
  info: { fontSize: 12, color: CLAY_THEME.colors.textSecondary },
});
