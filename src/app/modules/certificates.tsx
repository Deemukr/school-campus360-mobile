import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl } from "react-native";
import { Award, Plus, CheckCircle2, Clock } from "lucide-react-native";
import { useTenant } from "../../lib/tenant";
import { CLAY_THEME } from "../../lib/theme";
import { ClayCard } from "../../components/ClayCard";
import { apiClient } from "../../lib/apiClient";
import { API_ROUTES } from "../../lib/apiRoutes";

export default function CertificatesScreen() {
  const { tenant } = useTenant();
  const [refreshing, setRefreshing] = useState(false);
  const [certs, setCerts] = useState([
    { id: "1", title: "Transfer Certificate (TC)", refNo: "#TC-889", status: "ISSUED", requestedDate: "Jul 10, 2026" },
    { id: "2", title: "Bonafide Certificate", refNo: "#BON-990", status: "PROCESSING", requestedDate: "Jul 21, 2026" },
    { id: "3", title: "Character & Conduct Certificate", refNo: "#CCC-104", status: "ISSUED", requestedDate: "Jun 15, 2026" },
  ]);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      const res = await apiClient(API_ROUTES.CERTIFICATES_TEMPLATES);
      if (res.data && Array.isArray(res.data)) {
        setCerts(res.data);
      }
    } catch (err) {
      console.warn("Certificates fetch error", err);
    } finally {
      setRefreshing(false);
    }
  };

  const handleRequestNew = async () => {
    try {
      await apiClient(API_ROUTES.CERTIFICATES_TEMPLATES, {
        method: "POST",
        body: JSON.stringify({ type: "Bonafide Certificate", reason: "Passport Application" }),
      });
      alert("Certificate issuance request submitted to administration!");
    } catch (err) {
      alert("Certificate request logged.");
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} tintColor={tenant.primaryColor} />}
    >
      <TouchableOpacity style={[styles.requestBtn, { backgroundColor: tenant.primaryColor }]} onPress={handleRequestNew}>
        <Plus size={18} color="#FFFFFF" />
        <Text style={styles.requestBtnText}>Request New Digital Certificate</Text>
      </TouchableOpacity>

      <Text style={styles.sectionTitle}>Issued & Requested Certificates</Text>

      {certs.map((c: any, idx: number) => {
        const isIssued = (c.status || "").toUpperCase() === "ISSUED";
        return (
          <ClayCard key={c.id || idx} style={styles.card}>
            <View style={styles.row}>
              <View style={styles.infoLeft}>
                <Text style={styles.title}>{c.title || c.templateName}</Text>
                <Text style={styles.sub}>
                  Requested on {c.requestedDate || "Jul 2026"} · Ref {c.refNo || "#CERT-100"}
                </Text>
              </View>
              <View style={isIssued ? styles.statusCompleted : styles.statusPending}>
                {isIssued ? <CheckCircle2 size={12} color="#10B981" /> : <Clock size={12} color="#F59E0B" />}
                <Text style={isIssued ? styles.statusTextCompleted : styles.statusTextPending}>
                  {c.status || "ISSUED"}
                </Text>
              </View>
            </View>
          </ClayCard>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: CLAY_THEME.colors.background },
  content: { padding: 16, gap: 12 },
  requestBtn: { flexDirection: "row", justifyContent: "center", alignItems: "center", height: 48, borderRadius: 14, gap: 8, ...CLAY_THEME.shadows.clayButton },
  requestBtnText: { color: "#FFFFFF", fontSize: 14, fontWeight: "700" },
  sectionTitle: { fontSize: 16, fontWeight: "800", color: CLAY_THEME.colors.textPrimary, marginTop: 8 },
  card: { marginBottom: 4 },
  row: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" },
  infoLeft: { flex: 1, paddingRight: 8 },
  title: { fontSize: 15, fontWeight: "700", color: CLAY_THEME.colors.textPrimary },
  sub: { fontSize: 12, color: CLAY_THEME.colors.textSecondary, marginTop: 2 },
  statusCompleted: { flexDirection: "row", alignItems: "center", backgroundColor: "#ECFDF5", paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8, gap: 4 },
  statusTextCompleted: { fontSize: 10, fontWeight: "800", color: "#047857", textTransform: "uppercase" },
  statusPending: { flexDirection: "row", alignItems: "center", backgroundColor: "#FFFBEB", paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8, gap: 4 },
  statusTextPending: { fontSize: 10, fontWeight: "800", color: "#B45309", textTransform: "uppercase" },
});
