import React, { useState } from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity, RefreshControl, Dimensions } from "react-native";
import { CheckSquare, Clock, ArrowRight, BookOpen, AlertCircle, Sparkles } from "lucide-react-native";
import * as Haptics from "expo-haptics";
import { MotiView, AnimatePresence } from "moti";
import { useTenant } from "../../lib/tenant";
import { useHomework } from "../../lib/hooks/useModulesData";
import { CLAY_THEME } from "../../lib/theme";
import { ClayCard } from "../../components/ClayCard";
import { LoadingCardSkeleton } from "../../components/LoadingSkeleton";
import { LinearGradient } from "expo-linear-gradient";

const { width } = Dimensions.get("window");

export default function HomeworkScreen() {
  const { tenant } = useTenant();
  const { homeworkList, loading, refetch } = useHomework();
  const [refreshing, setRefreshing] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState("ALL");
  const [showToast, setShowToast] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const handleFilter = (filter: string) => {
    Haptics.selectionAsync();
    setSelectedFilter(filter);
  };

  const handleComplete = (id: string) => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
    // Real app would mutate here
  };

  const filteredHomework = homeworkList?.filter((hw: any) => {
    if (selectedFilter === "ALL") return true;
    return hw.status === selectedFilter;
  });

  return (
    <View style={styles.container}>
      <View style={styles.headerBar}>
        <View>
          <Text style={styles.headerTitle}>Daily Assignments</Text>
          <Text style={styles.headerSub}>
            {homeworkList?.filter((h: any) => h.status === 'PENDING').length} Pending Tasks
          </Text>
        </View>
        <TouchableOpacity style={[styles.submitBtn, { backgroundColor: tenant.primaryColor }]} onPress={() => handleComplete('all')}>
          <Sparkles size={16} color="#FFFFFF" />
          <Text style={styles.submitBtnText}>Submit All</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.filterTabs}>
        {["ALL", "PENDING", "COMPLETED"].map((filter) => (
          <TouchableOpacity
            key={filter}
            style={[styles.filterTab, selectedFilter === filter && { backgroundColor: tenant.primaryColor }]}
            onPress={() => handleFilter(filter)}
          >
            <Text style={[styles.filterTabText, selectedFilter === filter && { color: "#FFF" }]}>
              {filter}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {loading && !refreshing ? (
        <View style={styles.skeletonPadding}>
          <LoadingCardSkeleton />
          <LoadingCardSkeleton />
        </View>
      ) : (
        <FlatList
          data={filteredHomework}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} tintColor={tenant.primaryColor} />}
          renderItem={({ item, index }) => (
            <MotiView
              from={{ opacity: 0, translateY: 20 }}
              animate={{ opacity: 1, translateY: 0 }}
              transition={{ type: "spring", delay: index * 100 }}
            >
              <ClayCard style={styles.card}>
                <LinearGradient
                  colors={item.status === 'COMPLETED' ? ['#ECFDF5', '#D1FAE5'] : ['#FFFFFF', '#F9FAFB']}
                  style={styles.cardGradient}
                >
                  <View style={styles.cardHeader}>
                    <View style={styles.subjectBadge}>
                      <BookOpen size={14} color={tenant.primaryColor} />
                      <Text style={[styles.subjectName, { color: tenant.primaryColor }]}>{item.subject}</Text>
                    </View>
                    <View style={[styles.statusBadge, item.status === 'COMPLETED' ? styles.statusCompleted : styles.statusPending]}>
                      <Text style={[styles.statusText, item.status === 'COMPLETED' ? styles.statusTextCompleted : styles.statusTextPending]}>
                        {item.status}
                      </Text>
                    </View>
                  </View>

                  <Text style={styles.topic}>{item.topic}</Text>
                  <Text style={styles.description}>{item.description}</Text>

                  <View style={styles.cardFooter}>
                    <View style={styles.dateRow}>
                      <Clock size={14} color="#6B7280" />
                      <Text style={styles.dateText}>Due: {item.dueDate}</Text>
                    </View>

                    {item.status === 'PENDING' && (
                      <TouchableOpacity 
                        style={[styles.actionBtn, { backgroundColor: tenant.accentColor }]}
                        onPress={() => handleComplete(item.id)}
                      >
                        <CheckSquare size={14} color="#FFFFFF" />
                        <Text style={styles.actionBtnText}>Mark Done</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                </LinearGradient>
              </ClayCard>
            </MotiView>
          )}
        />
      )}

      {/* Animated Toast Notification */}
      <AnimatePresence>
        {showToast && (
          <MotiView
            from={{ opacity: 0, translateY: -50, scale: 0.9 }}
            animate={{ opacity: 1, translateY: 0, scale: 1 }}
            exit={{ opacity: 0, translateY: -50, scale: 0.9 }}
            style={styles.toastContainer}
          >
            <LinearGradient
              colors={['#10B981', '#059669']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.toast}
            >
              <CheckSquare size={20} color="#FFFFFF" />
              <Text style={styles.toastText}>Awesome! Homework submitted successfully.</Text>
            </LinearGradient>
          </MotiView>
        )}
      </AnimatePresence>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: CLAY_THEME.colors.background },
  headerBar: { 
    flexDirection: "row", 
    justifyContent: "space-between", 
    alignItems: "center", 
    padding: 16, 
    backgroundColor: "#FFFFFF", 
    borderBottomWidth: 1.5, 
    borderBottomColor: CLAY_THEME.colors.border 
  },
  headerTitle: { fontSize: 20, fontWeight: "800", color: CLAY_THEME.colors.textPrimary, fontFamily: "Baloo 2" },
  headerSub: { fontSize: 13, color: CLAY_THEME.colors.textSecondary, fontWeight: '600' },
  submitBtn: { flexDirection: "row", alignItems: "center", paddingHorizontal: 14, paddingVertical: 8, borderRadius: 12, gap: 6, ...CLAY_THEME.shadows.clayButton },
  submitBtnText: { color: "#FFFFFF", fontSize: 13, fontWeight: "700" },
  filterTabs: { flexDirection: 'row', padding: 16, gap: 10 },
  filterTab: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: '#F3F4F6', borderWidth: 1, borderColor: '#E5E7EB' },
  filterTabText: { fontSize: 12, fontWeight: '700', color: '#4B5563' },
  skeletonPadding: { padding: 16 },
  list: { padding: 16, gap: 16, paddingBottom: 40 },
  card: { padding: 0, overflow: 'hidden' },
  cardGradient: { padding: 16 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  subjectBadge: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#F3F4F6', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  subjectName: { fontSize: 12, fontWeight: '800' },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  statusCompleted: { backgroundColor: '#D1FAE5' },
  statusPending: { backgroundColor: '#FEF3C7' },
  statusText: { fontSize: 10, fontWeight: '800' },
  statusTextCompleted: { color: '#065F46' },
  statusTextPending: { color: '#92400E' },
  topic: { fontSize: 18, fontWeight: '800', color: CLAY_THEME.colors.textPrimary, marginBottom: 4 },
  description: { fontSize: 14, color: CLAY_THEME.colors.textSecondary, lineHeight: 20, marginBottom: 16 },
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderTopWidth: 1, borderTopColor: 'rgba(0,0,0,0.05)', paddingTop: 12 },
  dateRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  dateText: { fontSize: 13, fontWeight: '700', color: '#6B7280' },
  actionBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 },
  actionBtnText: { color: '#FFFFFF', fontSize: 12, fontWeight: '700' },
  toastContainer: { position: 'absolute', top: 20, left: 20, right: 20, zIndex: 100 },
  toast: { flexDirection: 'row', alignItems: 'center', padding: 16, borderRadius: 16, gap: 12, ...CLAY_THEME.shadows.clayMedium },
  toastText: { color: '#FFFFFF', fontSize: 14, fontWeight: '700', flex: 1 }
});
