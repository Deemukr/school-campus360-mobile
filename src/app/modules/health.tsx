import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, RefreshControl } from "react-native";
import { Activity, ShieldCheck, QrCode } from "lucide-react-native";
import { useTenant } from "../../lib/tenant";
import { CLAY_THEME } from "../../lib/theme";
import { ClayCard } from "../../components/ClayCard";
import { apiClient } from "../../lib/apiClient";
import { API_ROUTES } from "../../lib/apiRoutes";

export default function HealthScreen() {
  const { tenant } = useTenant();
  const [refreshing, setRefreshing] = useState(false);
  const [medicalLogs, setMedicalLogs] = useState([
    { id: "1", title: "Annual Health & Dental Checkup", status: "Cleared · Blood Group: B+ · Vision 6/6", date: "2026-07-01" },
    { id: "2", title: "Infirmary Visit - First Aid", status: "Minor sports sprain treated with ice pack", date: "2026-07-15" },
  ]);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      const res = await apiClient(API_ROUTES.HEALTH);
      if (res.data && Array.isArray(res.data)) {
        setMedicalLogs(res.data);
      }
    } catch (err) {
      console.warn("Health records fetch error", err);
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
      <View style={[styles.qrCard, { backgroundColor: tenant.primaryColor }]}>
        <QrCode size={52} color="#FFFFFF" />
        <Text style={styles.qrTitle}>Digital Gate & Infirmary ID Pass</Text>
        <Text style={styles.qrSub}>Scan at Campus Medical Desk · Student Record Verified</Text>
      </View>

      <Text style={styles.sectionTitle}>Infirmary & Health Records</Text>
      {medicalLogs.map((log: any, idx: number) => (
        <ClayCard key={log.id || idx} style={styles.card}>
          <Text style={styles.logTitle}>{log.title || log.recordType}</Text>
          <Text style={styles.logDesc}>{log.status || log.notes}</Text>
        </ClayCard>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: CLAY_THEME.colors.background },
  content: { padding: 16, gap: 14 },
  qrCard: { borderRadius: 24, padding: 24, alignItems: "center", ...CLAY_THEME.shadows.clayMedium },
  qrTitle: { color: "#FFFFFF", fontSize: 18, fontWeight: "800", marginTop: 12 },
  qrSub: { color: "rgba(255,255,255,0.88)", fontSize: 11, marginTop: 4 },
  sectionTitle: { fontSize: 16, fontWeight: "800", color: CLAY_THEME.colors.textPrimary },
  card: { marginBottom: 4 },
  logTitle: { fontSize: 15, fontWeight: "700", color: CLAY_THEME.colors.textPrimary },
  logDesc: { fontSize: 12, color: CLAY_THEME.colors.textSecondary, marginTop: 4 },
});
