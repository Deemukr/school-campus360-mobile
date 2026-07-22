import React, { useState } from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, RefreshControl } from "react-native";
import { UserPlus, Search, Phone, Mail, ChevronRight, Plus } from "lucide-react-native";
import { useTenant } from "../../lib/tenant";
import { useAdmissions } from "../../lib/hooks/useModulesData";
import { CLAY_THEME } from "../../lib/theme";
import { ClayCard } from "../../components/ClayCard";
import { LoadingCardSkeleton } from "../../components/LoadingSkeleton";

export default function AdmissionsScreen() {
  const { tenant } = useTenant();
  const { applications, loading, refetch } = useAdmissions();
  const [search, setSearch] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const filtered = applications.filter(
    (a: any) =>
      (a.applicantName || a.studentName || "").toLowerCase().includes(search.toLowerCase()) ||
      (a.parentName || "").toLowerCase().includes(search.toLowerCase())
  );

  const getStatusStyle = (status: string) => {
    switch (status?.toUpperCase()) {
      case "NEW_LEAD":
      case "UNDER_REVIEW":
        return { color: "#3B82F6", label: "Under Review" };
      case "INTERVIEW_SCHEDULED":
        return { color: "#F59E0B", label: "Interview" };
      case "OFFER_SENT":
        return { color: "#8B5CF6", label: "Offer Sent" };
      case "ACCEPTED":
      case "ENROLLED":
        return { color: "#10B981", label: "Enrolled" };
      default:
        return { color: "#6B7280", label: status };
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <View style={styles.searchBox}>
          <Search size={16} color="#9CA3AF" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search applicant or parent..."
            placeholderTextColor="#9CA3AF"
            value={search}
            onChangeText={setSearch}
          />
        </View>
      </View>

      {loading && !refreshing ? (
        <View style={styles.skeletonPadding}>
          <LoadingCardSkeleton />
          <LoadingCardSkeleton />
          <LoadingCardSkeleton />
        </View>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id || String(Math.random())}
          contentContainerStyle={styles.list}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} tintColor={tenant.primaryColor} />}
          renderItem={({ item }) => {
            const st = getStatusStyle(item.status || "NEW_LEAD");
            return (
              <ClayCard style={styles.card} onPress={() => {}}>
                <View style={styles.cardHeader}>
                  <Text style={styles.appId}>{item.id}</Text>
                  <View style={[styles.statusBadge, { backgroundColor: st.color + "15" }]}>
                    <Text style={[styles.statusText, { color: st.color }]}>{st.label}</Text>
                  </View>
                </View>

                <Text style={styles.studentName}>{item.applicantName || item.studentName}</Text>
                <Text style={styles.gradeText}>
                  Applying for {item.grade || item.gradeApplied || "Grade 1"} • Applied {item.appliedDate || item.date || "Recent"}
                </Text>

                <View style={styles.parentRow}>
                  <Text style={styles.parentText}>Parent: {item.parentName || "Guardian Verified"}</Text>
                  <View style={styles.phoneBadge}>
                    <Phone size={12} color="#4B5563" />
                    <Text style={styles.phoneText}>{item.phone || "+91 98111 00000"}</Text>
                  </View>
                </View>
              </ClayCard>
            );
          }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: CLAY_THEME.colors.background },
  topBar: { padding: 16, backgroundColor: "#FFFFFF", borderBottomWidth: 1.5, borderBottomColor: CLAY_THEME.colors.border },
  searchBox: { flexDirection: "row", alignItems: "center", backgroundColor: "#FAF5FF", borderRadius: 12, paddingHorizontal: 12, height: 42, borderWidth: 1, borderColor: CLAY_THEME.colors.border },
  searchInput: { flex: 1, marginLeft: 8, fontSize: 13, color: CLAY_THEME.colors.textPrimary },
  skeletonPadding: { padding: 16 },
  list: { padding: 16, gap: 12 },
  card: { marginBottom: 4 },
  cardHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 6 },
  appId: { fontSize: 11, fontWeight: "800", color: CLAY_THEME.colors.textMuted },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
  statusText: { fontSize: 10, fontWeight: "800" },
  studentName: { fontSize: 16, fontWeight: "700", color: CLAY_THEME.colors.textPrimary, marginBottom: 2 },
  gradeText: { fontSize: 12, color: CLAY_THEME.colors.textSecondary, marginBottom: 12 },
  parentRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingTop: 10, borderTopWidth: 1, borderTopColor: "#F1F5F9" },
  parentText: { fontSize: 12, fontWeight: "600", color: CLAY_THEME.colors.textPrimary },
  phoneBadge: { flexDirection: "row", alignItems: "center", gap: 4 },
  phoneText: { fontSize: 11, color: CLAY_THEME.colors.textSecondary },
});
