import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl } from "react-native";
import { ClipboardList, ArrowRight } from "lucide-react-native";
import { useTenant } from "../../lib/tenant";
import { CLAY_THEME } from "../../lib/theme";
import { ClayCard } from "../../components/ClayCard";
import { apiClient } from "../../lib/apiClient";
import { API_ROUTES } from "../../lib/apiRoutes";

export default function FormsScreen() {
  const { tenant } = useTenant();
  const [refreshing, setRefreshing] = useState(false);
  const [formsList, setFormsList] = useState([
    { id: "1", title: "Annual Parent Feedback Survey 2026", deadline: "Jul 31, 2026 · Estimated 3 mins" },
    { id: "2", title: "Science Exhibition Project Enrollment", deadline: "Aug 05, 2026 · Open for Grades 6-12" },
  ]);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      const res = await apiClient(API_ROUTES.FORMS);
      if (res.data && Array.isArray(res.data)) {
        setFormsList(res.data);
      }
    } catch (err) {
      console.warn("Forms fetch error", err);
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
      <Text style={styles.sectionTitle}>Dynamic Digital Forms & Surveys</Text>

      {formsList.map((f: any, idx: number) => (
        <ClayCard key={f.id || idx} style={styles.card} onPress={() => alert(`Opening form: ${f.title}`)}>
          <View style={styles.cardRow}>
            <View style={styles.left}>
              <Text style={styles.title}>{f.title}</Text>
              <Text style={styles.sub}>{f.deadline || "Active"}</Text>
            </View>
            <ArrowRight size={18} color={tenant.primaryColor} />
          </View>
        </ClayCard>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: CLAY_THEME.colors.background },
  content: { padding: 16, gap: 12 },
  sectionTitle: { fontSize: 16, fontWeight: "800", color: CLAY_THEME.colors.textPrimary },
  card: { marginBottom: 4 },
  cardRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  left: { flex: 1, paddingRight: 10 },
  title: { fontSize: 15, fontWeight: "700", color: CLAY_THEME.colors.textPrimary },
  sub: { fontSize: 12, color: CLAY_THEME.colors.textSecondary, marginTop: 4 },
});
