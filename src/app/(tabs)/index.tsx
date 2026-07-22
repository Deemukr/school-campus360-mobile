import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Dimensions,
  RefreshControl,
} from "react-native";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import * as Haptics from "expo-haptics";
import {
  Search,
  Sparkles,
  ChevronRight,
  UserPlus,
  Users,
  CalendarCheck,
  Wallet,
  MessageSquare,
  MessageCircle,
  BookOpen,
  Award,
  Briefcase,
  Activity,
  CircleUser,
  ClipboardList,
  CheckSquare,
  HeartPulse,
  Library,
  TrendingUp,
  Bus,
  BedDouble,
  Boxes,
  GraduationCap,
  Lock,
  AlertTriangle,
} from "lucide-react-native";
import { useTenant } from "../../lib/tenant";
import { useSession } from "../../lib/session";
import { MODULES, ModuleDef } from "../../lib/entitlements";
import { getModuleTheme } from "../../lib/moduleTheme";
import { CLAY_THEME } from "../../lib/theme";
import { ClayCard } from "../../components/ClayCard";
import { useAiSummary, useCommunication } from "../../lib/hooks/useModulesData";

const { width } = Dimensions.get("window");
const CARD_WIDTH = (width - 44) / 2;

const ICON_MAP: Record<string, any> = {
  UserPlus,
  Users,
  CalendarCheck,
  Wallet,
  MessageSquare,
  MessageCircle,
  BookOpen,
  Award,
  Briefcase,
  Activity,
  CircleUser,
  ClipboardList,
  CheckSquare,
  HeartPulse,
  Library,
  TrendingUp,
  Bus,
  BedDouble,
  Boxes,
  Sparkles,
  GraduationCap,
};

export default function HomeScreen() {
  const router = useRouter();
  const { tenant, plan, entitlements } = useTenant();
  const { session } = useSession();
  const [searchQuery, setSearchQuery] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  const { summary, loading: summaryLoading, refetch: refetchSummary } = useAiSummary();
  const { announcements, loading: commLoading, refetch: refetchComm } = useCommunication();

  const handleRefresh = async () => {
    setRefreshing(true);
    await Promise.all([refetchSummary(), refetchComm()]);
    setRefreshing(false);
  };

  const filteredModules = MODULES.filter(
    (m) =>
      m.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleModulePress = (module: ModuleDef, isEnabled: boolean) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (!isEnabled) {
      alert(`Module "${module.label}" is locked under the ${plan} plan. Upgrade tenant plan in Profile.`);
      return;
    }
    router.push(module.href as any);
  };

  const roleText = session?.role ? session.role.replace(/^SCHOOL_/, "").replace(/_/g, " ").toLowerCase() : "guest";
  const firstName = session?.name || "User";

  const aiSummaryData: any = summary || {};

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.content}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} tintColor={tenant.primaryColor} />}
    >
      {/* Welcome Hero Card */}
      <LinearGradient
        colors={[tenant.primaryColor, tenant.accentColor]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.heroBanner}
      >
        <View style={styles.heroBadgeRow}>
          <View style={styles.planBadge}>
            <Sparkles size={12} color="#FFFFFF" />
            <Text style={styles.planBadgeText}>{plan} PLAN</Text>
          </View>
          <View style={styles.roleBadge}>
            <Text style={styles.roleBadgeText}>{roleText}</Text>
          </View>
        </View>

        <Text style={styles.heroTitle}>Welcome back, {firstName} 👋</Text>
        <Text style={styles.heroSub}>
          {tenant.displayName} · {entitlements.length} active modules enabled
        </Text>

        <View style={styles.kpiRow}>
          <View style={styles.kpiItem}>
            <Text style={styles.kpiValue}>{summaryLoading ? "..." : aiSummaryData.attendance_rate || "96.4%"}</Text>
            <Text style={styles.kpiLabel}>Today's Attendance</Text>
          </View>
          <View style={styles.kpiDivider} />
          <View style={styles.kpiItem}>
            <Text style={styles.kpiValue}>{summaryLoading ? "..." : aiSummaryData.pending_approvals || "5"}</Text>
            <Text style={styles.kpiLabel}>Pending Approvals</Text>
          </View>
          <View style={styles.kpiDivider} />
          <View style={styles.kpiItem}>
            <Text style={styles.kpiValue}>{commLoading ? "..." : announcements.length}</Text>
            <Text style={styles.kpiLabel}>Active Circulars</Text>
          </View>
        </View>
      </LinearGradient>

      {/* Urgent Alerts Feed */}
      {aiSummaryData.alerts && Array.isArray(aiSummaryData.alerts) && aiSummaryData.alerts.length > 0 && (
        <View style={styles.alertsContainer}>
          {aiSummaryData.alerts.slice(0, 2).map((alertItem: any) => (
            <ClayCard key={alertItem.id} style={styles.alertCard}>
              <View style={styles.alertHeader}>
                <AlertTriangle size={16} color={alertItem.type === "CRITICAL" ? "#EF4444" : "#F59E0B"} />
                <Text style={styles.alertTitle}>Campus Alert ({alertItem.type})</Text>
              </View>
              <Text style={styles.alertMessage}>{alertItem.message}</Text>
            </ClayCard>
          ))}
        </View>
      )}

      {/* Quick Search */}
      <View style={styles.searchContainer}>
        <Search size={18} color="#9CA3AF" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search modules, forms, services..."
          placeholderTextColor="#9CA3AF"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Section Header */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Campus Modules Grid</Text>
        <Text style={styles.sectionCount}>{filteredModules.length} Modules</Text>
      </View>

      {/* Modules Grid */}
      <View style={styles.grid}>
        {filteredModules.map((m) => {
          const isEnabled = entitlements.includes(m.key);
          const moduleTheme = getModuleTheme(m.key);
          const IconComp = ICON_MAP[m.icon] || Sparkles;

          return (
            <TouchableOpacity
              key={m.key}
              activeOpacity={0.88}
              style={[
                styles.moduleCard,
                !isEnabled && styles.disabledCard,
              ]}
              onPress={() => handleModulePress(m, isEnabled)}
            >
              <View style={styles.cardHeader}>
                <View style={[styles.iconContainer, { backgroundColor: isEnabled ? moduleTheme.bgLight : "#F3F4F6" }]}>
                  <IconComp size={22} color={isEnabled ? moduleTheme.from : "#9CA3AF"} />
                </View>
                {!isEnabled && (
                  <View style={styles.lockBadge}>
                    <Lock size={12} color="#9CA3AF" />
                  </View>
                )}
              </View>

              <Text style={[styles.cardTitle, !isEnabled && styles.disabledText]}>{m.label}</Text>
              <Text style={styles.cardDesc} numberOfLines={2}>
                {m.description}
              </Text>

              <View style={styles.cardFooter}>
                <Text style={[styles.tierTag, { color: isEnabled ? moduleTheme.from : "#9CA3AF" }]}>
                  {isEnabled ? "ACTIVE" : "LOCKED"}
                </Text>
                <ChevronRight size={14} color={isEnabled ? "#9CA3AF" : "#D1D5DB"} />
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: CLAY_THEME.colors.background,
  },
  content: {
    padding: 16,
    paddingTop: 20,
    paddingBottom: 40,
  },
  heroBanner: {
    borderRadius: 24,
    padding: 20,
    marginBottom: 16,
    ...CLAY_THEME.shadows.clayMedium,
  },
  heroBadgeRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 12,
  },
  planBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.25)",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  planBadgeText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 0.5,
  },
  roleBadge: {
    backgroundColor: "rgba(0, 0, 0, 0.2)",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  roleBadgeText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "700",
    textTransform: "capitalize",
  },
  heroTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: "#FFFFFF",
    marginBottom: 4,
  },
  heroSub: {
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.9)",
    marginBottom: 16,
  },
  kpiRow: {
    flexDirection: "row",
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    borderRadius: 16,
    padding: 12,
    alignItems: "center",
    justifyContent: "space-around",
  },
  kpiItem: {
    alignItems: "center",
  },
  kpiValue: {
    fontSize: 16,
    fontWeight: "800",
    color: "#FFFFFF",
  },
  kpiLabel: {
    fontSize: 10,
    color: "rgba(255, 255, 255, 0.85)",
    marginTop: 2,
  },
  kpiDivider: {
    width: 1,
    height: 24,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
  },
  alertsContainer: {
    gap: 10,
    marginBottom: 16,
  },
  alertCard: {
    padding: 12,
    backgroundColor: "#FFFBEB",
    borderColor: "#FDE68A",
  },
  alertHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 4,
  },
  alertTitle: {
    fontSize: 12,
    fontWeight: "700",
    color: "#92400E",
  },
  alertMessage: {
    fontSize: 12,
    color: "#78350F",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: CLAY_THEME.colors.border,
    paddingHorizontal: 12,
    height: 46,
    marginBottom: 16,
    ...CLAY_THEME.shadows.claySoft,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: CLAY_THEME.colors.textPrimary,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: CLAY_THEME.colors.textPrimary,
  },
  sectionCount: {
    fontSize: 12,
    color: CLAY_THEME.colors.textSecondary,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  moduleCard: {
    width: CARD_WIDTH,
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 14,
    borderWidth: 1.5,
    borderColor: CLAY_THEME.colors.border,
    justifyContent: "space-between",
    ...CLAY_THEME.shadows.claySoft,
  },
  disabledCard: {
    backgroundColor: "#F9FAFB",
    borderColor: "#E5E7EB",
    opacity: 0.7,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  lockBadge: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: "#F3F4F6",
    justifyContent: "center",
    alignItems: "center",
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: CLAY_THEME.colors.textPrimary,
    marginBottom: 4,
  },
  disabledText: {
    color: "#6B7280",
  },
  cardDesc: {
    fontSize: 11,
    color: CLAY_THEME.colors.textSecondary,
    marginBottom: 12,
    lineHeight: 15,
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "#F1F5F9",
  },
  tierTag: {
    fontSize: 10,
    fontWeight: "800",
    textTransform: "uppercase",
  },
});
