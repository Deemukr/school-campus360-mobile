import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl } from "react-native";
import { CheckSquare, Check, X } from "lucide-react-native";
import * as Haptics from "expo-haptics";
import { useTenant } from "../../lib/tenant";
import { useApprovals } from "../../lib/hooks/useModulesData";
import { CLAY_THEME } from "../../lib/theme";
import { ClayCard } from "../../components/ClayCard";
import { LoadingCardSkeleton } from "../../components/LoadingSkeleton";

export default function ApprovalsScreen() {
  const { tenant } = useTenant();
  const { approvals, loading, refetch, decideApproval } = useApprovals();
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const handleDecide = async (id: string, decision: "APPROVED" | "REJECTED") => {
    Haptics.notificationAsync(
      decision === "APPROVED"
        ? Haptics.NotificationFeedbackType.Success
        : Haptics.NotificationFeedbackType.Warning
    );
    await decideApproval(id, decision);
    await refetch();
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} tintColor={tenant.primaryColor} />}
    >
      <Text style={styles.sectionTitle}>
        Pending HITL Workflow Approvals ({approvals.length})
      </Text>

      {loading && !refreshing ? (
        <View style={styles.skeletonPadding}>
          <LoadingCardSkeleton />
          <LoadingCardSkeleton />
        </View>
      ) : (
        approvals.map((app: any, idx: number) => (
          <ClayCard key={app.id || idx} style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.typeBadge}>{app.type || "WORKFLOW"}</Text>
              <Text style={styles.dateText}>{app.date || "Today"}</Text>
            </View>
            <Text style={styles.title}>{app.title || "Approval Item"}</Text>
            <Text style={styles.sub}>Requested by: {app.requestedBy || "Staff User"}</Text>
            <View style={styles.btnRow}>
              <TouchableOpacity
                style={styles.acceptBtn}
                onPress={() => handleDecide(app.id, "APPROVED")}
              >
                <Check size={14} color="#FFFFFF" />
                <Text style={styles.btnText}>Approve Request</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.rejectBtn}
                onPress={() => handleDecide(app.id, "REJECTED")}
              >
                <X size={14} color="#EF4444" />
                <Text style={styles.rejectText}>Reject</Text>
              </TouchableOpacity>
            </View>
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
  cardHeader: { flexDirection: "row", justifyContent: "space-between", marginBottom: 6 },
  typeBadge: { fontSize: 10, fontWeight: "800", color: CLAY_THEME.colors.primary, backgroundColor: "#F3E8FF", paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
  dateText: { fontSize: 11, color: CLAY_THEME.colors.textMuted },
  title: { fontSize: 15, fontWeight: "700", color: CLAY_THEME.colors.textPrimary },
  sub: { fontSize: 12, color: CLAY_THEME.colors.textSecondary, marginTop: 2, marginBottom: 12 },
  btnRow: { flexDirection: "row", gap: 8 },
  acceptBtn: { flexDirection: "row", alignItems: "center", backgroundColor: "#10B981", paddingHorizontal: 14, paddingVertical: 8, borderRadius: 10, gap: 4, ...CLAY_THEME.shadows.clayButton },
  btnText: { color: "#FFFFFF", fontSize: 12, fontWeight: "700" },
  rejectBtn: { flexDirection: "row", alignItems: "center", backgroundColor: "#FEF2F2", paddingHorizontal: 14, paddingVertical: 8, borderRadius: 10, gap: 4, borderWidth: 1, borderColor: "#FCA5A5" },
  rejectText: { color: "#EF4444", fontSize: 12, fontWeight: "700" },
});
