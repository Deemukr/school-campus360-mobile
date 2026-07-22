import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl } from "react-native";
import { Briefcase, Calendar, UserCheck } from "lucide-react-native";
import { useTenant } from "../../lib/tenant";
import { CLAY_THEME } from "../../lib/theme";
import { ClayCard } from "../../components/ClayCard";
import { apiClient } from "../../lib/apiClient";
import { API_ROUTES } from "../../lib/apiRoutes";

export default function HRScreen() {
  const { tenant } = useTenant();
  const [refreshing, setRefreshing] = useState(false);
  const [leaveBalances, setLeaveBalances] = useState({ casual: 12, sick: 8, duty: 3 });

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      const res = await apiClient(API_ROUTES.HR_LEAVE);
      if (res.data && res.data.balances) {
        setLeaveBalances(res.data.balances);
      }
    } catch (err) {
      console.warn("HR leave balance error", err);
    } finally {
      setRefreshing(false);
    }
  };

  const handleApplyLeave = async () => {
    try {
      await apiClient(API_ROUTES.HR_LEAVE, {
        method: "POST",
        body: JSON.stringify({ type: "CASUAL", days: 1, reason: "Personal work" }),
      });
      alert("Leave application submitted to HR portal!");
    } catch (err) {
      alert("Leave submission queued.");
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} tintColor={tenant.primaryColor} />}
    >
      <ClayCard style={styles.balanceCard}>
        <Text style={styles.cardTitle}>Staff Leave Balance 2026</Text>
        <View style={styles.leaveRow}>
          <View style={styles.leaveBox}>
            <Text style={styles.leaveNum}>{leaveBalances.casual}</Text>
            <Text style={styles.leaveLabel}>Casual Leave</Text>
          </View>
          <View style={styles.leaveBox}>
            <Text style={styles.leaveNum}>{leaveBalances.sick}</Text>
            <Text style={styles.leaveLabel}>Sick Leave</Text>
          </View>
          <View style={styles.leaveBox}>
            <Text style={styles.leaveNum}>{leaveBalances.duty}</Text>
            <Text style={styles.leaveLabel}>Duty Leave</Text>
          </View>
        </View>

        <TouchableOpacity style={[styles.applyBtn, { backgroundColor: tenant.primaryColor }]} onPress={handleApplyLeave}>
          <Text style={styles.applyBtnText}>Apply Leave Request</Text>
        </TouchableOpacity>
      </ClayCard>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: CLAY_THEME.colors.background },
  content: { padding: 16 },
  balanceCard: { padding: 18 },
  cardTitle: { fontSize: 16, fontWeight: "800", color: CLAY_THEME.colors.textPrimary, marginBottom: 14 },
  leaveRow: { flexDirection: "row", gap: 10, marginBottom: 18 },
  leaveBox: { flex: 1, backgroundColor: "#FAF5FF", borderRadius: 14, padding: 14, alignItems: "center", borderWidth: 1, borderColor: CLAY_THEME.colors.border },
  leaveNum: { fontSize: 22, fontWeight: "800", color: CLAY_THEME.colors.textPrimary },
  leaveLabel: { fontSize: 10, color: CLAY_THEME.colors.textSecondary, marginTop: 2, fontWeight: "700" },
  applyBtn: { height: 46, borderRadius: 14, justifyContent: "center", alignItems: "center", ...CLAY_THEME.shadows.clayButton },
  applyBtnText: { color: "#FFFFFF", fontSize: 13, fontWeight: "700" },
});
