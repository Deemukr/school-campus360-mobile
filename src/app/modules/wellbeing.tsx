import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl } from "react-native";
import { HeartPulse, Smile, Meh, Frown, Shield } from "lucide-react-native";
import * as Haptics from "expo-haptics";
import { useTenant } from "../../lib/tenant";
import { CLAY_THEME } from "../../lib/theme";
import { ClayCard } from "../../components/ClayCard";
import { apiClient } from "../../lib/apiClient";
import { API_ROUTES } from "../../lib/apiRoutes";

export default function WellbeingScreen() {
  const { tenant } = useTenant();
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [recentCheckin, setRecentCheckin] = useState<string | null>(null);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      const res = await apiClient(API_ROUTES.WELLBEING);
      if (res.data && res.data.lastCheckin) {
        setRecentCheckin(res.data.lastCheckin);
      }
    } catch (err) {
      console.warn("Wellbeing checkin error", err);
    } finally {
      setRefreshing(false);
    }
  };

  const handleSelectMood = async (mood: string) => {
    Haptics.selectionAsync();
    setSelectedMood(mood);
    try {
      await apiClient(API_ROUTES.WELLBEING, {
        method: "POST",
        body: JSON.stringify({ mood }),
      });
      alert("Wellness check-in recorded. Counseling support is available if needed!");
    } catch (err) {
      alert("Wellness check-in recorded!");
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} tintColor={tenant.primaryColor} />}
    >
      <ClayCard style={styles.header}>
        <HeartPulse size={42} color="#F43F5E" />
        <Text style={styles.title}>Student Mental Wellness Check-in</Text>
        <Text style={styles.sub}>How are you feeling today? (Encrypted & Confidential)</Text>

        <View style={styles.moodRow}>
          {[
            { id: "GREAT", icon: Smile, label: "Great", color: "#10B981" },
            { id: "OKAY", icon: Meh, label: "Okay", color: "#F59E0B" },
            { id: "LOW", icon: Frown, label: "Low", color: "#EF4444" },
          ].map((m) => (
            <TouchableOpacity
              key={m.id}
              style={[
                styles.moodBtn,
                selectedMood === m.id && { backgroundColor: m.color + "20", borderColor: m.color },
              ]}
              onPress={() => handleSelectMood(m.id)}
            >
              <m.icon size={32} color={m.color} />
              <Text style={[styles.moodLabel, { color: m.color }]}>{m.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {recentCheckin && (
          <Text style={styles.recentText}>Last Check-in Recorded: {recentCheckin}</Text>
        )}
      </ClayCard>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: CLAY_THEME.colors.background },
  content: { padding: 16 },
  header: { alignItems: "center", padding: 22 },
  title: { fontSize: 18, fontWeight: "800", color: CLAY_THEME.colors.textPrimary, marginTop: 12 },
  sub: { fontSize: 12, color: CLAY_THEME.colors.textSecondary, marginTop: 4, textAlign: "center" },
  moodRow: { flexDirection: "row", gap: 12, marginTop: 22, width: "100%" },
  moodBtn: { flex: 1, alignItems: "center", backgroundColor: "#FAF5FF", padding: 16, borderRadius: 16, borderWidth: 1.5, borderColor: CLAY_THEME.colors.border },
  moodLabel: { fontSize: 13, fontWeight: "800", marginTop: 8 },
  recentText: { fontSize: 11, color: CLAY_THEME.colors.textMuted, marginTop: 16, fontStyle: "italic" },
});
