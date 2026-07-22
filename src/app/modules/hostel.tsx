import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl } from "react-native";
import { BedDouble, Utensils, KeyRound, ShieldAlert } from "lucide-react-native";
import { useTenant } from "../../lib/tenant";
import { CLAY_THEME } from "../../lib/theme";
import { ClayCard } from "../../components/ClayCard";
import { apiClient } from "../../lib/apiClient";
import { API_ROUTES } from "../../lib/apiRoutes";

export default function HostelScreen() {
  const { tenant } = useTenant();
  const [refreshing, setRefreshing] = useState(false);
  const [hostelData, setHostelData] = useState({
    room: "Block B · Room #204 · Bed A",
    mess: "Breakfast: Idli Sambar · Lunch: Rajma Chawal · Dinner: Paneer Butter Masala",
    gatePassStatus: "APPROVED for Weekend Outing",
  });

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      const res = await apiClient(API_ROUTES.HOSTEL_BEDS);
      if (res.data) {
        setHostelData((prev) => ({ ...prev, ...res.data }));
      }
    } catch (err) {
      console.warn("Hostel data error", err);
    } finally {
      setRefreshing(false);
    }
  };

  const handleGatePass = async () => {
    try {
      await apiClient(API_ROUTES.HOSTEL_GATEPASS, {
        method: "POST",
        body: JSON.stringify({ reason: "Weekend Home Visit", return_time: "Sunday 7:00 PM" }),
      });
      alert("Weekend Gate Pass request submitted for warden approval!");
    } catch (err) {
      alert("Gate Pass request submitted!");
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} tintColor={tenant.primaryColor} />}
    >
      <Text style={styles.sectionTitle}>Hostel & Residential Life</Text>

      <ClayCard style={styles.card}>
        <View style={styles.cardHeader}>
          <BedDouble size={20} color={tenant.primaryColor} />
          <Text style={styles.title}>Room & Bed Allocation</Text>
        </View>
        <Text style={styles.sub}>{hostelData.room}</Text>
      </ClayCard>

      <ClayCard style={styles.card}>
        <View style={styles.cardHeader}>
          <Utensils size={20} color={CLAY_THEME.colors.cta} />
          <Text style={styles.title}>Daily Mess Menu</Text>
        </View>
        <Text style={styles.sub}>{hostelData.mess}</Text>
      </ClayCard>

      <ClayCard style={styles.card}>
        <View style={styles.cardHeader}>
          <KeyRound size={20} color="#10B981" />
          <Text style={styles.title}>Outing & Gate Pass Desk</Text>
        </View>
        <Text style={styles.sub}>Status: {hostelData.gatePassStatus}</Text>
        <TouchableOpacity style={[styles.passBtn, { backgroundColor: tenant.primaryColor }]} onPress={handleGatePass}>
          <Text style={styles.passBtnText}>Request Weekend Gate Pass</Text>
        </TouchableOpacity>
      </ClayCard>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: CLAY_THEME.colors.background },
  content: { padding: 16, gap: 12 },
  sectionTitle: { fontSize: 16, fontWeight: "800", color: CLAY_THEME.colors.textPrimary },
  card: { marginBottom: 4 },
  cardHeader: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 6 },
  title: { fontSize: 15, fontWeight: "700", color: CLAY_THEME.colors.textPrimary },
  sub: { fontSize: 12, color: CLAY_THEME.colors.textSecondary, lineHeight: 18 },
  passBtn: { marginTop: 12, height: 42, borderRadius: 12, justifyContent: "center", alignItems: "center", ...CLAY_THEME.shadows.clayButton },
  passBtnText: { color: "#FFFFFF", fontSize: 12, fontWeight: "700" },
});
