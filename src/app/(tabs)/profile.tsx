import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from "react-native";
import { User, Building, ShieldCheck, LogOut, Check, Sparkles, ChevronRight, Lock } from "lucide-react-native";
import * as Haptics from "expo-haptics";
import { useTenant, PRESET_TENANTS } from "../../lib/tenant";
import { useSession, UserRole } from "../../lib/session";
import { Plan } from "../../lib/entitlements";
import { useRouter } from "expo-router";
import { CLAY_THEME } from "../../lib/theme";
import { ClayCard } from "../../components/ClayCard";

export default function ProfileScreen() {
  const router = useRouter();
  const { tenant, plan, setTenantKey, setPlan } = useTenant();
  const { session, login, logout } = useSession();
  const [customKeyInput, setCustomKeyInput] = useState("");

  const handleSelectTenant = (key: string) => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setTenantKey(key);
  };

  const handleSelectRole = (role: UserRole) => {
    Haptics.selectionAsync();
    login(session?.email || "principal@dpsdelhi.edu.in", role);
  };

  const handleSelectPlan = (p: Plan) => {
    Haptics.selectionAsync();
    setPlan(p);
  };

  const handleLogout = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    await logout();
    router.replace("/login");
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      {/* User Info Header Card */}
      <ClayCard style={styles.userCard}>
        <View style={[styles.avatar, { backgroundColor: tenant.primaryColor }]}>
          <User size={32} color="#FFFFFF" />
        </View>

        <View style={styles.userInfo}>
          <Text style={styles.userName}>{session?.name || "Campus User"}</Text>
          <Text style={styles.userEmail}>{session?.email || "user@campus360.co.in"}</Text>

          <View style={styles.badgeRow}>
            <View style={styles.roleTag}>
              <ShieldCheck size={12} color="#10B981" />
              <Text style={styles.roleTagText}>
                {session?.role ? session.role.replace(/^SCHOOL_/, "").replace(/_/g, " ") : "SCHOOL ADMIN"}
              </Text>
            </View>
          </View>
        </View>
      </ClayCard>

      {/* Multi-Tenant School Switcher */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Building size={18} color={tenant.primaryColor} />
          <Text style={styles.sectionTitle}>Active School Tenant</Text>
        </View>

        <Text style={styles.sectionDesc}>
          Select a preset school or type a custom tenant key to test white-label branding & themes.
        </Text>

        <View style={styles.presetList}>
          {Object.entries(PRESET_TENANTS).map(([key, data]) => {
            const isSelected = tenant.tenantKey === key;
            return (
              <TouchableOpacity
                key={key}
                activeOpacity={0.8}
                style={[
                  styles.tenantCard,
                  isSelected && { borderColor: data.primaryColor, backgroundColor: data.primaryColor + "0F" },
                ]}
                onPress={() => handleSelectTenant(key)}
              >
                <View style={styles.tenantLeft}>
                  <View style={[styles.colorDot, { backgroundColor: data.primaryColor }]} />
                  <View>
                    <Text style={styles.tenantName}>{data.displayName}</Text>
                    <Text style={styles.tenantKeyText}>{key}.school.campus360.co.in</Text>
                  </View>
                </View>

                {isSelected && <Check size={18} color={data.primaryColor} />}
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={styles.customKeyRow}>
          <TextInput
            style={styles.customInput}
            placeholder="Custom tenant key (e.g. st-johns)"
            placeholderTextColor="#9CA3AF"
            value={customKeyInput}
            onChangeText={setCustomKeyInput}
          />
          <TouchableOpacity
            style={[styles.applyBtn, { backgroundColor: tenant.primaryColor }]}
            onPress={() => {
              if (customKeyInput.trim()) handleSelectTenant(customKeyInput);
            }}
          >
            <Text style={styles.applyBtnText}>Apply</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Entitlement Tiers / Plan Switcher */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Sparkles size={18} color={tenant.primaryColor} />
          <Text style={styles.sectionTitle}>Tenant Plan Tier</Text>
        </View>
        <Text style={styles.sectionDesc}>
          Toggle between Essential, Professional, and Enterprise plans to verify module gating.
        </Text>

        <View style={styles.planRow}>
          {(["ESSENTIAL", "PROFESSIONAL", "ENTERPRISE"] as const).map((p) => {
            const isSelected = plan === p;
            return (
              <TouchableOpacity
                key={p}
                style={[
                  styles.planChip,
                  isSelected && { backgroundColor: tenant.primaryColor, borderColor: tenant.primaryColor },
                ]}
                onPress={() => handleSelectPlan(p)}
              >
                <Text style={[styles.planChipText, isSelected && { color: "#FFFFFF" }]}>{p}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* Role Switcher */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <ShieldCheck size={18} color={tenant.primaryColor} />
          <Text style={styles.sectionTitle}>Simulate User Role</Text>
        </View>

        <View style={styles.planRow}>
          {(["SCHOOL_ADMIN", "TEACHER", "PARENT", "STUDENT"] as const).map((r) => {
            const isSelected = session?.role === r;
            return (
              <TouchableOpacity
                key={r}
                style={[
                  styles.planChip,
                  isSelected && { backgroundColor: tenant.primaryColor, borderColor: tenant.primaryColor },
                ]}
                onPress={() => handleSelectRole(r)}
              >
                <Text style={[styles.planChipText, isSelected && { color: "#FFFFFF" }]}>
                  {r.replace(/^SCHOOL_/, "")}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* Logout Action */}
      <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
        <LogOut size={18} color="#EF4444" />
        <Text style={styles.logoutText}>Sign Out of Mobile Portal</Text>
      </TouchableOpacity>
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
    paddingBottom: 40,
  },
  userCard: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    padding: 18,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
    ...CLAY_THEME.shadows.clayMedium,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: "800",
    color: CLAY_THEME.colors.textPrimary,
  },
  userEmail: {
    fontSize: 12,
    color: CLAY_THEME.colors.textSecondary,
    marginTop: 2,
    marginBottom: 8,
  },
  badgeRow: {
    flexDirection: "row",
  },
  roleTag: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ECFDF5",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    gap: 4,
  },
  roleTagText: {
    fontSize: 10,
    fontWeight: "800",
    color: "#065F46",
    textTransform: "uppercase",
  },
  section: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 16,
    borderWidth: 1.5,
    borderColor: CLAY_THEME.colors.border,
    marginBottom: 16,
    ...CLAY_THEME.shadows.claySoft,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 4,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: "800",
    color: CLAY_THEME.colors.textPrimary,
  },
  sectionDesc: {
    fontSize: 11,
    color: CLAY_THEME.colors.textSecondary,
    marginBottom: 12,
    lineHeight: 16,
  },
  presetList: {
    gap: 8,
    marginBottom: 12,
  },
  tenantCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#FAF5FF",
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: CLAY_THEME.colors.border,
  },
  tenantLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  colorDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  tenantName: {
    fontSize: 13,
    fontWeight: "700",
    color: CLAY_THEME.colors.textPrimary,
  },
  tenantKeyText: {
    fontSize: 10,
    color: CLAY_THEME.colors.textMuted,
  },
  customKeyRow: {
    flexDirection: "row",
    gap: 8,
  },
  customInput: {
    flex: 1,
    backgroundColor: "#FAF5FF",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: CLAY_THEME.colors.border,
    paddingHorizontal: 12,
    height: 42,
    fontSize: 12,
    color: CLAY_THEME.colors.textPrimary,
  },
  applyBtn: {
    paddingHorizontal: 16,
    height: 42,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  applyBtnText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "700",
  },
  planRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  planChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: "#F1F5F9",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  planChipText: {
    fontSize: 11,
    fontWeight: "800",
    color: CLAY_THEME.colors.textSecondary,
  },
  logoutBtn: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FEE2E2",
    borderRadius: 16,
    padding: 16,
    gap: 8,
    borderWidth: 1,
    borderColor: "#FCA5A5",
    marginTop: 8,
  },
  logoutText: {
    color: "#991B1B",
    fontSize: 14,
    fontWeight: "700",
  },
});
