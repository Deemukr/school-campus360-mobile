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
import { MotiView } from "moti";
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
  ChevronDown,
} from "lucide-react-native";
import { useTenant } from "../../lib/tenant";
import { useSession } from "../../lib/session";
import { MODULES, ModuleDef, getModulesForRole } from "../../lib/entitlements";
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

  const allowedModules = getModulesForRole(session?.role, entitlements);

  const filteredModules = allowedModules.filter(
    (m) =>
      m.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleModulePress = (module: ModuleDef) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push(module.href as any);
  };

  const roleText = session?.role ? session.role.replace(/^SCHOOL_/, "").replace(/_/g, " ").toLowerCase() : "guest";
  const firstName = session?.name || "User";

  const aiSummaryData: any = summary || {};
  const filteredAlerts = (aiSummaryData.alerts || []).filter((alertItem: any) => {
    if (!alertItem.targetRoles) return true;
    return alertItem.targetRoles.includes(session?.role);
  });

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.content}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} tintColor={tenant.primaryColor} />}
    >
      {/* Welcome Hero Card */}
      <MotiView
        from={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring", delay: 100 }}
      >
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

          <View style={styles.heroHeaderRow}>
            <View>
              <Text style={styles.heroTitle}>Welcome back, {firstName} 👋</Text>
              <Text style={styles.heroSub}>
                {tenant.displayName} · {allowedModules.length} tools available
              </Text>
            </View>
            
            {/* Multi-Ward Switcher for Parents */}
            {session?.role === "PARENT" && (
              <TouchableOpacity style={styles.wardSwitcher} activeOpacity={0.8}>
                <View style={styles.wardAvatar}>
                  <Text style={styles.wardInitial}>S</Text>
                </View>
                <ChevronDown size={16} color="#FFFFFF" />
              </TouchableOpacity>
            )}
          </View>

          <View style={styles.kpiRow}>
            <View style={styles.kpiItem}>
              <Text style={styles.kpiValue}>{summaryLoading ? "..." : aiSummaryData.attendance_rate || "96.4%"}</Text>
              <Text style={styles.kpiLabel}>Today's Attendance</Text>
            </View>
            <View style={styles.kpiDivider} />
            <View style={styles.kpiItem}>
              <Text style={styles.kpiValue}>{summaryLoading ? "..." : aiSummaryData.pending_approvals || "5"}</Text>
              <Text style={styles.kpiLabel}>{session?.role === 'PARENT' ? 'Assignments' : 'Pending Approvals'}</Text>
            </View>
            <View style={styles.kpiDivider} />
            <View style={styles.kpiItem}>
              <Text style={styles.kpiValue}>{commLoading ? "..." : announcements.length}</Text>
              <Text style={styles.kpiLabel}>Active Circulars</Text>
            </View>
          </View>
        </LinearGradient>
      </MotiView>

      {/* Urgent Alerts Feed */}
      {filteredAlerts.length > 0 && (
        <MotiView
          from={{ opacity: 0, translateY: 10 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: "timing", duration: 300, delay: 200 }}
          style={styles.alertsContainer}
        >
          {filteredAlerts.slice(0, 2).map((alertItem: any) => (
            <ClayCard key={alertItem.id} style={styles.alertCard}>
              <View style={styles.alertHeader}>
                <AlertTriangle size={18} color={alertItem.type === "CRITICAL" ? "#EF4444" : "#F59E0B"} />
                <Text style={styles.alertTitle}>Campus Alert ({alertItem.type})</Text>
              </View>
              <Text style={styles.alertMessage}>{alertItem.message}</Text>
            </ClayCard>
          ))}
        </MotiView>
      )}

      {/* Quick Search */}
      <View style={styles.searchContainer}>
        <Search size={20} color="#9CA3AF" style={styles.searchIcon} />
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
        <Text style={styles.sectionTitle}>My Campus Tools</Text>
        <Text style={styles.sectionCount}>{filteredModules.length} Modules</Text>
      </View>

      {/* Modules Grid */}
      <View style={styles.grid}>
        {filteredModules.map((m, index) => {
          const moduleTheme = getModuleTheme(m.key);
          const IconComp = ICON_MAP[m.icon] || Sparkles;

          return (
            <MotiView
              key={m.key}
              from={{ opacity: 0, translateY: 20 }}
              animate={{ opacity: 1, translateY: 0 }}
              transition={{ type: "spring", delay: index * 50 }}
            >
              <TouchableOpacity
                activeOpacity={0.88}
                style={styles.moduleCard}
                onPress={() => handleModulePress(m)}
              >
                <View style={styles.cardHeader}>
                  <View style={[styles.iconContainer, { backgroundColor: moduleTheme.bgLight }]}>
                    <IconComp size={28} color={moduleTheme.from} strokeWidth={2.5} />
                  </View>
                </View>

                <Text style={styles.cardTitle}>{m.label}</Text>
                <Text style={styles.cardDesc} numberOfLines={2}>
                  {m.description}
                </Text>

                <View style={styles.cardFooter}>
                  <Text style={[styles.tierTag, { color: moduleTheme.from }]}>
                    ACCESS
                  </Text>
                  <ChevronRight size={16} color="#D1D5DB" />
                </View>
              </TouchableOpacity>
            </MotiView>
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
    borderRadius: CLAY_THEME.borderRadius.xl,
    padding: 24,
    marginBottom: 20,
    ...CLAY_THEME.shadows.clayMedium,
  },
  heroBadgeRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 16,
  },
  planBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.25)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: CLAY_THEME.borderRadius.pill,
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
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: CLAY_THEME.borderRadius.pill,
  },
  roleBadgeText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "700",
    textTransform: "capitalize",
  },
  heroHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  heroTitle: {
    fontSize: 26,
    fontWeight: "800",
    color: "#FFFFFF",
    marginBottom: 6,
    fontFamily: "Baloo 2",
  },
  heroSub: {
    fontSize: 13,
    color: "rgba(255, 255, 255, 0.9)",
    marginBottom: 20,
    fontWeight: "600",
  },
  wardSwitcher: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.2)",
    padding: 6,
    paddingRight: 8,
    borderRadius: 20,
    gap: 6,
  },
  wardAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#F97316",
    justifyContent: "center",
    alignItems: "center",
  },
  wardInitial: {
    color: "#FFF",
    fontWeight: "800",
    fontSize: 14,
  },
  kpiRow: {
    flexDirection: "row",
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 20,
    padding: 16,
    alignItems: "center",
    justifyContent: "space-around",
    borderWidth: 1.5,
    borderColor: "rgba(255,255,255,0.3)",
  },
  kpiItem: {
    alignItems: "center",
  },
  kpiValue: {
    fontSize: 18,
    fontWeight: "800",
    color: "#FFFFFF",
  },
  kpiLabel: {
    fontSize: 11,
    color: "rgba(255, 255, 255, 0.9)",
    marginTop: 4,
    fontWeight: "600",
  },
  kpiDivider: {
    width: 1.5,
    height: 28,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
  },
  alertsContainer: {
    gap: 12,
    marginBottom: 20,
  },
  alertCard: {
    padding: 16,
    backgroundColor: "#FFFBEB",
    borderColor: "#FDE68A",
    borderWidth: 3,
    borderRadius: CLAY_THEME.borderRadius.lg,
  },
  alertHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 6,
  },
  alertTitle: {
    fontSize: 14,
    fontWeight: "800",
    color: "#92400E",
  },
  alertMessage: {
    fontSize: 13,
    color: "#78350F",
    fontWeight: "600",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    borderWidth: 3,
    borderColor: CLAY_THEME.colors.border,
    paddingHorizontal: 16,
    height: 54,
    marginBottom: 20,
    ...CLAY_THEME.shadows.claySoft,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    fontWeight: "600",
    color: CLAY_THEME.colors.textPrimary,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: CLAY_THEME.colors.textPrimary,
    fontFamily: "Baloo 2",
  },
  sectionCount: {
    fontSize: 13,
    fontWeight: "700",
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
    borderRadius: CLAY_THEME.borderRadius.lg,
    padding: 16,
    borderWidth: 3,
    borderColor: CLAY_THEME.colors.border,
    justifyContent: "space-between",
    ...CLAY_THEME.shadows.claySoft,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  iconContainer: {
    width: 52,
    height: 52,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: CLAY_THEME.colors.textPrimary,
    marginBottom: 6,
  },
  cardDesc: {
    fontSize: 12,
    fontWeight: "600",
    color: CLAY_THEME.colors.textSecondary,
    marginBottom: 14,
    lineHeight: 16,
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 10,
    borderTopWidth: 2,
    borderTopColor: CLAY_THEME.colors.borderLight,
  },
  tierTag: {
    fontSize: 11,
    fontWeight: "800",
    textTransform: "uppercase",
  },
});
