import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, RefreshControl } from "react-native";
import { CircleUser, Award, Star, BookOpen } from "lucide-react-native";
import { useTenant } from "../../lib/tenant";
import { CLAY_THEME } from "../../lib/theme";
import { ClayCard } from "../../components/ClayCard";
import { apiClient } from "../../lib/apiClient";
import { API_ROUTES } from "../../lib/apiRoutes";

export default function LearnerProfileScreen() {
  const { tenant } = useTenant();
  const [refreshing, setRefreshing] = useState(false);
  const [profile, setProfile] = useState({
    name: "Aaditya Roy",
    meta: "Grade 10-A · Roll #101 · House: Blue Dragons",
    skills: [
      { name: "Problem Solving & Analytics", score: "95%" },
      { name: "Collaboration & Leadership", score: "90%" },
      { name: "Creative Expression", score: "88%" },
      { name: "Emotional Resilience", score: "92%" },
    ],
  });

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      const res = await apiClient(API_ROUTES.LEARNER_PROFILE);
      if (res.data) {
        setProfile((prev) => ({ ...prev, ...res.data }));
      }
    } catch (err) {
      console.warn("Learner profile error", err);
    } finally {
      setRefreshing(false);
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} tintColor={tenant.primaryColor} />}
    >
      <ClayCard style={styles.header}>
        <View style={[styles.avatar, { backgroundColor: tenant.primaryColor }]}>
          <CircleUser size={48} color="#FFFFFF" />
        </View>

        <Text style={styles.name}>{profile.name}</Text>
        <Text style={styles.meta}>{profile.meta}</Text>
      </ClayCard>

      <Text style={styles.sectionTitle}>360° Competency & Holistic Radar</Text>
      <ClayCard style={styles.card}>
        {profile.skills.map((s, idx) => (
          <View key={idx} style={styles.skillRow}>
            <Text style={styles.skillName}>{s.name}</Text>
            <Text style={[styles.skillScore, { color: tenant.primaryColor }]}>{s.score}</Text>
          </View>
        ))}
      </ClayCard>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: CLAY_THEME.colors.background },
  content: { padding: 16, gap: 14 },
  header: { alignItems: "center", padding: 20 },
  avatar: { width: 72, height: 72, borderRadius: 24, justifyContent: "center", alignItems: "center", marginBottom: 10, ...CLAY_THEME.shadows.clayMedium },
  name: { fontSize: 20, fontWeight: "800", color: CLAY_THEME.colors.textPrimary },
  meta: { fontSize: 12, color: CLAY_THEME.colors.textSecondary, marginTop: 4 },
  sectionTitle: { fontSize: 16, fontWeight: "800", color: CLAY_THEME.colors.textPrimary },
  card: { gap: 12, padding: 18 },
  skillRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingBottom: 8, borderBottomWidth: 1, borderBottomColor: "#F1F5F9" },
  skillName: { fontSize: 13, color: CLAY_THEME.colors.textPrimary, fontWeight: "700" },
  skillScore: { fontSize: 14, fontWeight: "800" },
});
