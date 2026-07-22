import React, { useState } from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity, RefreshControl } from "react-native";
import { Check, X, Clock, CalendarCheck, Save } from "lucide-react-native";
import * as Haptics from "expo-haptics";
import { useTenant } from "../../lib/tenant";
import { useAttendance } from "../../lib/hooks/useModulesData";
import { CLAY_THEME } from "../../lib/theme";
import { ClayCard } from "../../components/ClayCard";
import { LoadingCardSkeleton } from "../../components/LoadingSkeleton";

interface StudentRoster {
  id: string;
  rollNo: string;
  name: string;
  status: "PRESENT" | "ABSENT" | "LATE" | string;
}

export default function AttendanceScreen() {
  const { tenant } = useTenant();
  const { attendanceData, loading, refetch, markAttendance } = useAttendance();
  const [refreshing, setRefreshing] = useState(false);
  const [localRoster, setLocalRoster] = useState<StudentRoster[]>([]);

  const roster = localRoster.length > 0 ? localRoster : (attendanceData?.roster || []);

  const handleRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setLocalRoster([]);
    setRefreshing(false);
  };

  const toggleStatus = (id: string, newStatus: string) => {
    Haptics.selectionAsync();
    const updated = roster.map((s: any) => (s.id === id ? { ...s, status: newStatus } : s));
    setLocalRoster(updated);
  };

  const handleSave = async () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    await markAttendance({
      section: attendanceData?.section || "Grade 10-A",
      roster: roster,
    });
    alert("Attendance Roster submitted to backend successfully!");
  };

  const presentCount = roster.filter((r: any) => r.status === "PRESENT").length;

  return (
    <View style={styles.container}>
      <View style={styles.headerBar}>
        <View>
          <Text style={styles.classTitle}>{attendanceData?.section || "Grade 10 - Section A"}</Text>
          <Text style={styles.dateSub}>
            Today · {presentCount}/{roster.length} Present
          </Text>
        </View>

        <TouchableOpacity style={[styles.saveBtn, { backgroundColor: tenant.primaryColor }]} onPress={handleSave}>
          <Save size={16} color="#FFFFFF" />
          <Text style={styles.saveBtnText}>Save Roster</Text>
        </TouchableOpacity>
      </View>

      {loading && !refreshing ? (
        <View style={styles.skeletonPadding}>
          <LoadingCardSkeleton />
          <LoadingCardSkeleton />
        </View>
      ) : (
        <FlatList
          data={roster}
          keyExtractor={(item) => item.id || String(Math.random())}
          contentContainerStyle={styles.list}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} tintColor={tenant.primaryColor} />}
          renderItem={({ item }) => (
            <ClayCard style={styles.card}>
              <View style={styles.cardInner}>
                <View style={styles.leftInfo}>
                  <Text style={styles.rollNo}>#{item.rollNo || "01"}</Text>
                  <Text style={styles.name}>{item.name}</Text>
                </View>

                <View style={styles.btnGroup}>
                  <TouchableOpacity
                    style={[styles.statusBtn, item.status === "PRESENT" && styles.presentActive]}
                    onPress={() => toggleStatus(item.id, "PRESENT")}
                  >
                    <Check size={14} color={item.status === "PRESENT" ? "#FFFFFF" : "#10B981"} />
                    <Text style={[styles.btnText, item.status === "PRESENT" && { color: "#FFFFFF" }]}>P</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.statusBtn, item.status === "ABSENT" && styles.absentActive]}
                    onPress={() => toggleStatus(item.id, "ABSENT")}
                  >
                    <X size={14} color={item.status === "ABSENT" ? "#FFFFFF" : "#EF4444"} />
                    <Text style={[styles.btnText, item.status === "ABSENT" && { color: "#FFFFFF" }]}>A</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.statusBtn, item.status === "LATE" && styles.lateActive]}
                    onPress={() => toggleStatus(item.id, "LATE")}
                  >
                    <Clock size={14} color={item.status === "LATE" ? "#FFFFFF" : "#F59E0B"} />
                    <Text style={[styles.btnText, item.status === "LATE" && { color: "#FFFFFF" }]}>L</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </ClayCard>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: CLAY_THEME.colors.background },
  headerBar: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", padding: 16, backgroundColor: "#FFFFFF", borderBottomWidth: 1.5, borderBottomColor: CLAY_THEME.colors.border },
  classTitle: { fontSize: 16, fontWeight: "800", color: CLAY_THEME.colors.textPrimary },
  dateSub: { fontSize: 12, color: CLAY_THEME.colors.textSecondary },
  saveBtn: { flexDirection: "row", alignItems: "center", paddingHorizontal: 14, paddingVertical: 8, borderRadius: 12, gap: 6, ...CLAY_THEME.shadows.clayButton },
  saveBtnText: { color: "#FFFFFF", fontSize: 13, fontWeight: "700" },
  skeletonPadding: { padding: 16 },
  list: { padding: 16, gap: 10 },
  card: { marginBottom: 4 },
  cardInner: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  leftInfo: { flexDirection: "row", alignItems: "center", gap: 10 },
  rollNo: { fontSize: 12, fontWeight: "800", color: CLAY_THEME.colors.textMuted, width: 28 },
  name: { fontSize: 14, fontWeight: "700", color: CLAY_THEME.colors.textPrimary },
  btnGroup: { flexDirection: "row", gap: 6 },
  statusBtn: { width: 36, height: 36, borderRadius: 10, borderWidth: 1, borderColor: "#E2E8F0", justifyContent: "center", alignItems: "center", backgroundColor: "#FAF5FF" },
  btnText: { fontSize: 11, fontWeight: "800", color: CLAY_THEME.colors.textSecondary },
  presentActive: { backgroundColor: "#10B981", borderColor: "#10B981" },
  absentActive: { backgroundColor: "#EF4444", borderColor: "#EF4444" },
  lateActive: { backgroundColor: "#F59E0B", borderColor: "#F59E0B" },
});
