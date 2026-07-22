import React, { useState } from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import { GraduationCap, Building, Mail, Lock, ArrowRight, ShieldCheck } from "lucide-react-native";
import * as Haptics from "expo-haptics";
import { useTenant, PRESET_TENANTS } from "../lib/tenant";
import { useSession, UserRole } from "../lib/session";
import { CLAY_THEME } from "../lib/theme";
import { ClayCard } from "../components/ClayCard";

export default function LoginScreen() {
  const router = useRouter();
  const { tenant, setTenantKey } = useTenant();
  const { login, isLoading } = useSession();

  const [email, setEmail] = useState("principal@dpsdelhi.edu.in");
  const [password, setPassword] = useState("");
  const [selectedRole, setSelectedRole] = useState<UserRole>("SCHOOL_ADMIN");
  const [selectedSchoolKey, setSelectedSchoolKey] = useState("dps-delhi");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleLogin = async () => {
    setErrorMessage(null);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setTenantKey(selectedSchoolKey);

    const success = await login(email, selectedRole, password);
    if (success) {
      router.replace("/(tabs)");
    } else {
      setErrorMessage("Authentication failed. Please check credentials or network.");
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <View style={[styles.logoBadge, { backgroundColor: tenant.primaryColor }]}>
          <GraduationCap size={32} color="#FFFFFF" />
        </View>
        <Text style={styles.title}>School-Campus360</Text>
        <Text style={styles.subtitle}>K-12 Multi-Tenant Educational Portal</Text>
      </View>

      <ClayCard style={styles.card}>
        {errorMessage ? (
          <View style={styles.errorBanner}>
            <Text style={styles.errorText}>{errorMessage}</Text>
          </View>
        ) : null}

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
            placeholder="e.g. principal@dpsdelhi.edu.in"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />
        </View>

        <Text style={styles.label}>4. Security Password (Optional in Demo)</Text>
        <View style={styles.inputBox}>
          <Lock size={18} color={CLAY_THEME.colors.textMuted} />
          <TextInput
            style={styles.input}
            placeholder="••••••••"
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
    marginBottom: 24,
  },
  logoBadge: {
    width: 64,
    height: 64,
    borderRadius: 20,
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
    borderRadius: 10,
    padding: 10,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#FCA5A5",
  },
  errorText: {
    color: "#991B1B",
    fontSize: 12,
    fontWeight: "600",
  },
  label: {
    fontSize: 13,
    fontWeight: "700",
    color: CLAY_THEME.colors.textPrimary,
    marginBottom: 8,
    marginTop: 14,
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
