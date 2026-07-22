import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl } from "react-native";
import { Wallet, CheckCircle2, AlertCircle, ArrowUpRight } from "lucide-react-native";
import { useTenant } from "../../lib/tenant";
import { useFees } from "../../lib/hooks/useModulesData";
import { CLAY_THEME } from "../../lib/theme";
import { ClayCard } from "../../components/ClayCard";
import { LoadingCardSkeleton } from "../../components/LoadingSkeleton";

export default function FeesScreen() {
  const { tenant } = useTenant();
  const { feesData, loading, refetch, requestConcession } = useFees();
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const handleConcession = async () => {
    await requestConcession({ student_id: "STU-1001", reason: "Financial hardship" });
    alert("Fee concession request submitted for committee review!");
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} tintColor={tenant.primaryColor} />}
    >
      <View style={[styles.summaryCard, { backgroundColor: tenant.primaryColor }]}>
        <Text style={styles.summaryTitle}>Term 2 Tuition & Campus Fee Status</Text>
        <Text style={styles.amount}>{feesData?.pending || "₹7,20,000"}</Text>
        <Text style={styles.dueDate}>Collected: {feesData?.collected || "₹42,80,000"}</Text>

        <TouchableOpacity style={styles.payBtn} onPress={handleConcession}>
          <Text style={[styles.payBtnText, { color: tenant.primaryColor }]}>
            Apply for Fee Concession / Financial Assistance
          </Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.sectionTitle}>Fee Ledger Records</Text>

      {loading && !refreshing ? (
        <View style={styles.skeletonPadding}>
          <LoadingCardSkeleton />
          <LoadingCardSkeleton />
        </View>
      ) : (
        (feesData?.records || []).map((rec: any, idx: number) => (
          <ClayCard key={rec.id || idx} style={styles.invoiceCard}>
            <View style={styles.invRow}>
              <View>
                <Text style={styles.invTitle}>{rec.studentName || "Aarav Sharma"}</Text>
                <Text style={styles.invSub}>
                  Grade {rec.grade || "10-A"} · Due {rec.dueDate || "2026-07-25"}
                </Text>
              </View>
              <View
                style={[
                  styles.paidBadge,
                  rec.status === "PAID"
                    ? { backgroundColor: "#ECFDF5" }
                    : { backgroundColor: "#FFFBEB" },
                ]}
              >
                <CheckCircle2
                  size={12}
                  color={rec.status === "PAID" ? "#10B981" : "#F59E0B"}
                />
                <Text
                  style={[
                    styles.paidText,
                    rec.status === "PAID"
                      ? { color: "#047857" }
                      : { color: "#92400E" },
                  ]}
                >
                  {rec.status || "PENDING"}
                </Text>
              </View>
            </View>
            <Text style={styles.invAmount}>{rec.amount || "₹45,000"}</Text>
          </ClayCard>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: CLAY_THEME.colors.background },
  content: { padding: 16, gap: 14 },
  summaryCard: { borderRadius: 24, padding: 22, ...CLAY_THEME.shadows.clayMedium },
  summaryTitle: { color: "rgba(255,255,255,0.85)", fontSize: 13, fontWeight: "700" },
  amount: { color: "#FFFFFF", fontSize: 34, fontWeight: "800", marginVertical: 6 },
  dueDate: { color: "rgba(255,255,255,0.9)", fontSize: 12, marginBottom: 16 },
  payBtn: { backgroundColor: "#FFFFFF", borderRadius: 14, height: 46, justifyContent: "center", alignItems: "center", paddingHorizontal: 12 },
  payBtnText: { fontSize: 13, fontWeight: "700" },
  sectionTitle: { fontSize: 16, fontWeight: "800", color: CLAY_THEME.colors.textPrimary, marginTop: 6 },
  skeletonPadding: { paddingVertical: 10 },
  invoiceCard: { marginBottom: 4 },
  invRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" },
  invTitle: { fontSize: 15, fontWeight: "700", color: CLAY_THEME.colors.textPrimary },
  invSub: { fontSize: 11, color: CLAY_THEME.colors.textSecondary, marginTop: 2 },
  paidBadge: { flexDirection: "row", alignItems: "center", paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8, gap: 4 },
  paidText: { fontSize: 10, fontWeight: "800", textTransform: "uppercase" },
  invAmount: { fontSize: 18, fontWeight: "800", color: CLAY_THEME.colors.textPrimary, marginTop: 12 },
});
