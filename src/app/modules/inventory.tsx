import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, RefreshControl } from "react-native";
import { Boxes } from "lucide-react-native";
import { useTenant } from "../../lib/tenant";
import { CLAY_THEME } from "../../lib/theme";
import { ClayCard } from "../../components/ClayCard";
import { apiClient } from "../../lib/apiClient";
import { API_ROUTES } from "../../lib/apiRoutes";

export default function InventoryScreen() {
  const { tenant } = useTenant();
  const [refreshing, setRefreshing] = useState(false);
  const [items, setItems] = useState([
    { id: "1", name: "Science Lab Microscopes", stock: "24/25 Available", category: "Lab Equipment" },
    { id: "2", name: "Smart Classroom Projectors", stock: "18/20 Functional", category: "IT Infrastructure" },
    { id: "3", name: "Sports Synthetic Footballs", stock: "45 Units", category: "Sports Department" },
  ]);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      const res = await apiClient(API_ROUTES.INVENTORY);
      if (res.data && Array.isArray(res.data)) {
        setItems(res.data);
      }
    } catch (err) {
      console.warn("Inventory fetch error", err);
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
      <Text style={styles.sectionTitle}>Asset & Inventory Ledger</Text>
      {items.map((item: any, idx: number) => (
        <ClayCard key={item.id || idx} style={styles.card}>
          <Text style={styles.categoryBadge}>{item.category || "General"}</Text>
          <Text style={styles.title}>{item.name || item.itemName}</Text>
          <Text style={styles.sub}>Stock Status: {item.stock || "In Stock"}</Text>
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
  categoryBadge: { fontSize: 10, fontWeight: "800", color: CLAY_THEME.colors.primary, backgroundColor: "#F3E8FF", paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6, alignSelf: "flex-start", marginBottom: 6 },
  title: { fontSize: 15, fontWeight: "700", color: CLAY_THEME.colors.textPrimary },
  sub: { fontSize: 12, color: CLAY_THEME.colors.textSecondary, marginTop: 2 },
});
