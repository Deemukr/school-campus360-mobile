import React, { useState } from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, RefreshControl } from "react-native";
import { Users, Search, GraduationCap, Phone, CheckCircle, ChevronRight } from "lucide-react-native";
import { useTenant } from "../../lib/tenant";
import { useStudents } from "../../lib/hooks/useModulesData";
import { CLAY_THEME } from "../../lib/theme";
import { ClayCard } from "../../components/ClayCard";
import { LoadingCardSkeleton } from "../../components/LoadingSkeleton";

export default function StudentsScreen() {
  const { tenant } = useTenant();
  const { students, loading, refetch } = useStudents();
  const [search, setSearch] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const filtered = students.filter((s: any) =>
    (s.name || s.studentName || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <View style={styles.searchBox}>
          <Search size={16} color="#9CA3AF" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search student name or roll no..."
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
          renderItem={({ item }) => (
            <ClayCard style={styles.card} onPress={() => {}}>
              <View style={styles.cardInner}>
                <View style={[styles.avatarCircle, { backgroundColor: tenant.primaryColor + "15" }]}>
                  <Text style={[styles.avatarText, { color: tenant.primaryColor }]}>
                    {(item.name || "S").charAt(0)}
                  </Text>
                </View>

                <View style={styles.info}>
                  <Text style={styles.name}>{item.name || "Student User"}</Text>
                  <Text style={styles.meta}>
                    Grade {item.grade || "10"} • Roll #{item.rollNo || item.roll_number || "01"}
                  </Text>
                  <Text style={styles.phone}>Parent: {item.parentName || item.parentPhone || "Verified Guardian"}</Text>
                </View>

                <View style={styles.rightTag}>
                  <Text style={styles.attPct}>{item.attendance || "96%"}</Text>
                  <Text style={styles.attLabel}>Attn</Text>
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
  topBar: { padding: 16, backgroundColor: "#FFFFFF", borderBottomWidth: 1.5, borderBottomColor: CLAY_THEME.colors.border },
  searchBox: { flexDirection: "row", alignItems: "center", backgroundColor: "#FAF5FF", borderRadius: 12, paddingHorizontal: 12, height: 42, borderWidth: 1, borderColor: CLAY_THEME.colors.border },
  searchInput: { flex: 1, marginLeft: 8, fontSize: 13, color: CLAY_THEME.colors.textPrimary },
  skeletonPadding: { padding: 16 },
  list: { padding: 16, gap: 10 },
  card: { marginBottom: 4 },
  cardInner: { flexDirection: "row", alignItems: "center" },
  avatarCircle: { width: 44, height: 44, borderRadius: 16, justifyContent: "center", alignItems: "center", marginRight: 12 },
  avatarText: { fontSize: 18, fontWeight: "800" },
  info: { flex: 1 },
  name: { fontSize: 15, fontWeight: "700", color: CLAY_THEME.colors.textPrimary },
  meta: { fontSize: 12, color: CLAY_THEME.colors.textSecondary, marginTop: 2 },
  phone: { fontSize: 11, color: CLAY_THEME.colors.textMuted, marginTop: 2 },
  rightTag: { alignItems: "flex-end", backgroundColor: "#ECFDF5", paddingHorizontal: 10, paddingVertical: 6, borderRadius: 10 },
  attPct: { fontSize: 13, fontWeight: "800", color: "#059669" },
  attLabel: { fontSize: 9, color: "#047857", fontWeight: "700" },
});
