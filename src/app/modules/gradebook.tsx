import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl } from "react-native";
import { BookOpen, Award, Download, CheckCircle2 } from "lucide-react-native";
import { useTenant } from "../../lib/tenant";
import { CLAY_THEME } from "../../lib/theme";
import { ClayCard } from "../../components/ClayCard";
import { apiClient } from "../../lib/apiClient";
import { API_ROUTES } from "../../lib/apiRoutes";

export default function GradebookScreen() {
  const { tenant } = useTenant();
  const [refreshing, setRefreshing] = useState(false);
  const [assessments, setAssessments] = useState([
    { name: "Mathematics", marks: "94/100", grade: "A1", teacher: "Mr. Sharma" },
    { name: "Physics", marks: "88/100", grade: "A2", teacher: "Dr. Verma" },
    { name: "Chemistry", marks: "91/100", grade: "A1", teacher: "Mrs. Gupta" },
    { name: "English Literature", marks: "95/100", grade: "A1", teacher: "Ms. Davis" },
    { name: "Computer Science", marks: "99/100", grade: "A1", teacher: "Mr. Rao" },
  ]);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      const res = await apiClient(API_ROUTES.GRADEBOOK);
      if (res.data && Array.isArray(res.data)) {
        setAssessments(res.data);
      }
    } catch (err) {
      console.warn("Gradebook fetch error", err);
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
      <ClayCard style={styles.headerCard}>
        <Text style={styles.termTitle}>CBSE / IB Mid-Term Assessment 2026</Text>
        <Text style={styles.overallGrade}>Overall Grade: A1 (93.4%)</Text>
        <TouchableOpacity style={[styles.downloadBtn, { backgroundColor: tenant.primaryColor }]}>
          <Download size={14} color="#FFFFFF" />
          <Text style={styles.downloadText}>Download Official Report Card PDF</Text>
        </TouchableOpacity>
      </ClayCard>

      <Text style={styles.sectionTitle}>Subject Marksheet</Text>
      {assessments.map((sub: any, idx: number) => (
        <ClayCard key={sub.id || idx} style={styles.subjectCard}>
          <View style={styles.subRow}>
            <View>
              <Text style={styles.subName}>{sub.name || sub.subject}</Text>
              <Text style={styles.teacherText}>{sub.teacher || "Faculty"}</Text>
            </View>
            <View style={styles.gradeBadge}>
              <Text style={styles.gradeText}>{sub.grade || "A1"}</Text>
            </View>
          </View>

          <View style={styles.marksRow}>
            <Text style={styles.marksLabel}>Score Obtained:</Text>
            <Text style={styles.marksValue}>{sub.marks || "90/100"}</Text>
          </View>
        </ClayCard>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: CLAY_THEME.colors.background },
  content: { padding: 16, gap: 12 },
  headerCard: { padding: 18 },
  termTitle: { fontSize: 13, color: CLAY_THEME.colors.textSecondary, fontWeight: "600" },
  overallGrade: { fontSize: 20, fontWeight: "800", color: CLAY_THEME.colors.textPrimary, marginVertical: 6 },
  downloadBtn: { flexDirection: "row", alignItems: "center", justifyContent: "center", borderRadius: 12, height: 44, marginTop: 10, gap: 6, ...CLAY_THEME.shadows.clayButton },
  downloadText: { color: "#FFFFFF", fontSize: 12, fontWeight: "700" },
  sectionTitle: { fontSize: 16, fontWeight: "800", color: CLAY_THEME.colors.textPrimary, marginTop: 4 },
  subjectCard: { marginBottom: 2 },
  subRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  subName: { fontSize: 15, fontWeight: "700", color: CLAY_THEME.colors.textPrimary },
  teacherText: { fontSize: 11, color: CLAY_THEME.colors.textSecondary, marginTop: 2 },
  gradeBadge: { backgroundColor: "#F3E8FF", paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  gradeText: { fontSize: 13, fontWeight: "800", color: CLAY_THEME.colors.primary },
  marksRow: { flexDirection: "row", justifyContent: "space-between", marginTop: 10, paddingTop: 10, borderTopWidth: 1, borderTopColor: "#F1F5F9" },
  marksLabel: { fontSize: 12, color: CLAY_THEME.colors.textSecondary },
  marksValue: { fontSize: 12, fontWeight: "800", color: CLAY_THEME.colors.textPrimary },
});
