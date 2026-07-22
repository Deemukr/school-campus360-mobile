import React, { useState } from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, RefreshControl } from "react-native";
import { Bell, Filter, Search, Tag, Calendar, ChevronRight } from "lucide-react-native";
import * as Haptics from "expo-haptics";
import { useTenant } from "../../lib/tenant";
import { useCommunication } from "../../lib/hooks/useModulesData";
import { CLAY_THEME } from "../../lib/theme";
import { ClayCard } from "../../components/ClayCard";
import { LoadingCardSkeleton } from "../../components/LoadingSkeleton";

export default function UpdatesScreen() {
  const { tenant } = useTenant();
  const { announcements, loading, refetch } = useCommunication();
  const [activeTab, setActiveTab] = useState<"ALL" | "Academic" | "Sports" | "Health">("ALL");
  const [search, setSearch] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const filtered = announcements.filter((item: any) => {
    const matchesTab = activeTab === "ALL" || item.category === activeTab;
    const matchesSearch =
      item.title?.toLowerCase().includes(search.toLowerCase()) ||
      item.content?.toLowerCase().includes(search.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const getCategoryColor = (category: string) => {
    switch (category?.toUpperCase()) {
      case "EMERGENCY":
      case "ALERT":
        return "#EF4444";
      case "SPORTS":
      case "EVENT":
        return "#10B981";
      case "HEALTH":
        return "#F59E0B";
      default:
        return "#3B82F6";
    }
  };

  return (
    <View style={styles.container}>
      {/* Header Bar */}
      <View style={styles.topFilterContainer}>
        <View style={styles.searchBar}>
          <Search size={16} color="#9CA3AF" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search circulars, events & announcements..."
            placeholderTextColor="#9CA3AF"
            value={search}
            onChangeText={setSearch}
          />
        </View>

        {/* Category Pills */}
        <View style={styles.pillRow}>
          {(["ALL", "Academic", "Sports", "Health"] as const).map((tab) => {
            const isActive = activeTab === tab;
            return (
              <TouchableOpacity
                key={tab}
                style={[
                  styles.pill,
                  isActive && { backgroundColor: tenant.primaryColor, borderColor: tenant.primaryColor },
                ]}
                onPress={() => {
                  Haptics.selectionAsync();
                  setActiveTab(tab);
                }}
              >
                <Text style={[styles.pillText, isActive && styles.pillTextActive]}>{tab}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* List */}
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
          contentContainerStyle={styles.listContent}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} tintColor={tenant.primaryColor} />}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => {
            const catColor = getCategoryColor(item.category);
            return (
              <ClayCard style={styles.card} onPress={() => {}}>
                <View style={styles.cardHeader}>
                  <View style={[styles.badge, { backgroundColor: catColor + "15" }]}>
                    <Tag size={10} color={catColor} />
                    <Text style={[styles.badgeText, { color: catColor }]}>{item.category || "General"}</Text>
                  </View>

                  <View style={styles.dateRow}>
                    <Calendar size={12} color="#6B7280" />
                    <Text style={styles.dateText}>{item.date || "Today"}</Text>
                  </View>
                </View>

                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.summary} numberOfLines={3}>
                  {item.content || item.summary}
                </Text>

                <View style={styles.cardFooter}>
                  <Text style={styles.sender}>By {item.author || "Principal Office"}</Text>
                  <ChevronRight size={16} color="#9CA3AF" />
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
  container: {
    flex: 1,
    backgroundColor: CLAY_THEME.colors.background,
  },
  topFilterContainer: {
    padding: 16,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1.5,
    borderBottomColor: CLAY_THEME.colors.border,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FAF5FF",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: CLAY_THEME.colors.border,
    paddingHorizontal: 12,
    height: 42,
    marginBottom: 12,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 13,
    color: CLAY_THEME.colors.textPrimary,
  },
  pillRow: {
    flexDirection: "row",
    gap: 8,
  },
  pill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    backgroundColor: "#F1F5F9",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  pillText: {
    fontSize: 11,
    fontWeight: "700",
    color: CLAY_THEME.colors.textSecondary,
  },
  pillTextActive: {
    color: "#FFFFFF",
  },
  skeletonPadding: {
    padding: 16,
  },
  listContent: {
    padding: 16,
    gap: 12,
  },
  card: {
    marginBottom: 4,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 4,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: "800",
    textTransform: "uppercase",
  },
  dateRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  dateText: {
    fontSize: 11,
    color: CLAY_THEME.colors.textMuted,
  },
  title: {
    fontSize: 15,
    fontWeight: "700",
    color: CLAY_THEME.colors.textPrimary,
    marginBottom: 6,
  },
  summary: {
    fontSize: 12,
    color: CLAY_THEME.colors.textSecondary,
    lineHeight: 18,
    marginBottom: 10,
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "#F1F5F9",
  },
  sender: {
    fontSize: 11,
    color: CLAY_THEME.colors.textMuted,
    fontWeight: "600",
  },
});
