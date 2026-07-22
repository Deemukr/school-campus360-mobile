import React, { useState } from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import { GraduationCap, Building, Mail, Lock, ArrowRight, ShieldCheck, Sparkles, UserCheck } from "lucide-react-native";
import * as Haptics from "expo-haptics";
import { useTenant, PRESET_TENANTS } from "../lib/tenant";
import { useSession, UserRole } from "../lib/session";
import { CLAY_THEME } from "../lib/theme";
import { ClayCard } from "../components/ClayCard";

const DEMO_PRESETS = [
  { label: "DPS Admin", email: "admin@dps.test", role: "SCHOOL_ADMIN" as UserRole, tenantKey: "dps-delhi" },
  { label: "DPS Teacher", email: "teacher@dps.test", role: "TEACHER" as UserRole, tenantKey: "dps-delhi" },
  { label: "DPS Parent", email: "parent@dps.test", role: "PARENT" as UserRole, tenantKey: "dps-delhi" },
  { label: "Greenwood Admin", email: "admin@greenwood.test", role: "SCHOOL_ADMIN" as UserRole, tenantKey: "greenwood" },
];

export default function LoginScreen() {
  const router = useRouter();
  const { tenant, setTenantKey } = useTenant();
  const { login, isLoading } = useSession();

  const [email, setEmail] = useState("admin@dps.test");
  const [password, setPassword] = useState("Demo@12345");
  const [selectedRole, setSelectedRole] = useState<UserRole>("SCHOOL_ADMIN");
  const [selectedSchoolKey, setSelectedSchoolKey] = useState("dps-delhi");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleLogin = async () => {
    setErrorMessage(null);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setTenantKey(selectedSchoolKey);

    const targetTenant = PRESET_TENANTS[selectedSchoolKey];
    const targetTenantId = targetTenant?.tenantId;

    const res = await login(email, selectedRole, password, targetTenantId);
    if (res.success) {
      router.replace("/(tabs)");
    } else {
      setErrorMessage(res.error || "Authentication failed. Please check credentials or network.");
    }
  };

  const applyDemoPreset = (preset: typeof DEMO_PRESETS[0]) => {
    Haptics.selectionAsync();
    setEmail(preset.email);
    setPassword("Demo@12345");
    setSelectedRole(preset.role);
    setSelectedSchoolKey(preset.tenantKey);
    setTenantKey(preset.tenantKey);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <View style={[styles.logoBadge, { backgroundColor: tenant.primaryColor }]}>
          <GraduationCap size={34} color="#FFFFFF" />
        </View>
        <Text style={styles.title}>School-Campus360</Text>
        <Text style={styles.subtitle}>K-12 Multi-Tenant Mobile Portal</Text>
      </View>

      <ClayCard style={styles.card}>
        {errorMessage ? (
          <View style={styles.errorBanner}>
            <Text style={styles.errorText}>{errorMessage}</Text>
          </View>
        ) : null}

        {/* Quick Fill Demo Credentials */}
        <Text style={styles.label}>Quick-Fill Demo Account</Text>
        <View style={styles.demoRow}>
          {DEMO_PRESETS.map((p) => (
            <TouchableOpacity
              key={p.label}
              style={[
                styles.demoChip,
                email === p.email && { backgroundColor: tenant.primaryColor, borderColor: tenant.primaryColor },
              ]}
              onPress={() => applyDemoPreset(p)}
            >
              <Text style={[styles.demoChipText, email === p.email && { color: "#FFFFFF" }]}>
                {p.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* 1. School Tenant Selector */}
        <Text style={styles.label}>1. Select School Branch / Tenant</Text>
        <View style={styles.tenantOptions}>
          {Object.entries(PRESET_TENANTS).map(([key, data]) => {
            const isSelected = selectedSchoolKey === key;
            return (
              <TouchableOpacity
                key={key}
                activeOpacity={0.8}
                style={[
                  styles.tenantOption,
                  isSelected && { borderColor: data.primaryColor, backgroundColor: data.primaryColor + "12" },
                ]}
                onPress={() => {
                  Haptics.selectionAsync();
                  setSelectedSchoolKey(key);
                  setTenantKey(key);
                }}
              >
                <Building size={16} color={isSelected ? data.primaryColor : "#6B7280"} />
                <Text style={[styles.tenantOptionText, isSelected && { color: data.primaryColor, fontWeight: "700" }]}>
                  {data.displayName}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* 2. User Role */}
        <Text style={styles.label}>2. Access Portal Role</Text>
        <View style={styles.roleRow}>
          {(["SCHOOL_ADMIN", "TEACHER", "PARENT", "STUDENT"] as const).map((r) => {
            const isSelected = selectedRole === r;
            return (
              <TouchableOpacity
                key={r}
                style={[
                  styles.roleChip,
                  isSelected && { backgroundColor: tenant.primaryColor, borderColor: tenant.primaryColor },
                ]}
                onPress={() => {
                  Haptics.selectionAsync();
                  setSelectedRole(r);
                }}
              >
                <Text style={[styles.roleChipText, isSelected && { color: "#FFFFFF" }]}>
                  {r.replace(/^SCHOOL_/, "")}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* 3. Credentials */}
        <Text style={styles.label}>3. Institutional Email</Text>
        <View style={styles.inputBox}>
          <Mail size={18} color={CLAY_THEME.colors.textMuted} />
          <TextInput
            style={styles.input}
            placeholder="e.g. admin@dps.test"
            placeholderTextColor="#9CA3AF"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />
        </View>

        <Text style={styles.label}>4. Security Password</Text>
        <View style={styles.inputBox}>
          <Lock size={18} color={CLAY_THEME.colors.textMuted} />
          <TextInput
            style={styles.input}
            placeholder="Demo@12345"
            placeholderTextColor="#9CA3AF"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
        </View>

        <TouchableOpacity
          disabled={isLoading}
          style={[styles.loginBtn, { backgroundColor: tenant.primaryColor }]}
          onPress={handleLogin}
        >
          {isLoading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <>
              <Text style={styles.loginBtnText}>Launch Portal Session</Text>
              <ArrowRight size={18} color="#FFFFFF" />
            </>
          )}
        </TouchableOpacity>

        <View style={styles.securityFooter}>
          <ShieldCheck size={14} color={CLAY_THEME.colors.textMuted} />
          <Text style={styles.securityText}>Zero-Trust Encrypted JWT Authorization</Text>
        </View>
      </ClayCard>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: CLAY_THEME.colors.background,
  },
  content: {
    padding: 20,
    paddingTop: 50,
  },
  header: {
    alignItems: "center",
    marginBottom: 20,
  },
  logoBadge: {
    width: 68,
    height: 68,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
    ...CLAY_THEME.shadows.clayMedium,
  },
  title: {
    fontSize: 26,
    fontWeight: "800",
    color: CLAY_THEME.colors.textPrimary,
  },
  subtitle: {
    fontSize: 13,
    color: CLAY_THEME.colors.textSecondary,
    marginTop: 4,
  },
  card: {
    padding: 22,
  },
  errorBanner: {
    backgroundColor: "#FEE2E2",
    borderRadius: 12,
    padding: 12,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "#FCA5A5",
  },
  errorText: {
    color: "#991B1B",
    fontSize: 12,
    fontWeight: "700",
  },
  label: {
    fontSize: 13,
    fontWeight: "700",
    color: CLAY_THEME.colors.textPrimary,
    marginBottom: 8,
    marginTop: 14,
  },
  demoRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
    marginBottom: 6,
  },
  demoChip: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: "#FAF5FF",
    borderWidth: 1,
    borderColor: CLAY_THEME.colors.border,
  },
  demoChipText: {
    fontSize: 11,
    fontWeight: "700",
    color: CLAY_THEME.colors.primary,
  },
  tenantOptions: {
    gap: 8,
    marginBottom: 4,
  },
  tenantOption: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FAF5FF",
    padding: 12,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: CLAY_THEME.colors.border,
    gap: 10,
  },
  tenantOptionText: {
    fontSize: 13,
    color: CLAY_THEME.colors.textPrimary,
  },
  roleRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  roleChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: "#F1F5F9",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  roleChipText: {
    fontSize: 12,
    fontWeight: "700",
    color: CLAY_THEME.colors.textSecondary,
  },
  inputBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: CLAY_THEME.colors.border,
    paddingHorizontal: 12,
    height: 48,
  },
  input: {
    flex: 1,
    marginLeft: 8,
    fontSize: 14,
    color: CLAY_THEME.colors.textPrimary,
  },
  loginBtn: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    height: 52,
    borderRadius: 16,
    marginTop: 26,
    gap: 8,
    ...CLAY_THEME.shadows.clayButton,
  },
  loginBtnText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
  securityFooter: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 6,
    marginTop: 16,
  },
  securityText: {
    fontSize: 11,
    color: CLAY_THEME.colors.textMuted,
  },
});
