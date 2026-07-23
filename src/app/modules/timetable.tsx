import React, { useState } from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity, RefreshControl, Dimensions, ScrollView } from "react-native";
import { Clock, MapPin, User, CalendarCheck } from "lucide-react-native";
import * as Haptics from "expo-haptics";
import { MotiView } from "moti";
import { useTenant } from "../../lib/tenant";
import { useTimetable } from "../../lib/hooks/useModulesData";
import { CLAY_THEME } from "../../lib/theme";
import { ClayCard } from "../../components/ClayCard";
import { LoadingCardSkeleton } from "../../components/LoadingSkeleton";
import { LinearGradient } from "expo-linear-gradient";

export default function TimetableScreen() {
  const { tenant } = useTenant();
  const { timetable, loading, refetch } = useTimetable();
  const [refreshing, setRefreshing] = useState(false);
  const [selectedDay, setSelectedDay] = useState("Mon");

  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const handleRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const handleDaySelect = (day: string) => {
    Haptics.selectionAsync();
    setSelectedDay(day);
  };

  const getSubjectColor = (subject: string) => {
    const colors = ['#3B82F6', '#8B5CF6', '#EC4899', '#10B981', '#F59E0B', '#EF4444'];
    let hash = 0;
    for (let i = 0; i < subject.length; i++) {
      hash = subject.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerBar}>
        <View>
          <Text style={styles.headerTitle}>Class Timetable</Text>
          <Text style={styles.headerSub}>Weekly Schedule</Text>
        </View>
        <View style={[styles.iconWrapper, { backgroundColor: tenant.primaryColor + '20' }]}>
          <CalendarCheck size={24} color={tenant.primaryColor} />
        </View>
      </View>

      <View style={styles.daysWrapper}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.daysContainer}>
          {days.map((day) => (
            <TouchableOpacity
              key={day}
              style={[
                styles.dayBubble,
                selectedDay === day && { backgroundColor: tenant.primaryColor, borderColor: tenant.primaryColor }
              ]}
              onPress={() => handleDaySelect(day)}
            >
              <Text style={[styles.dayText, selectedDay === day && { color: "#FFFFFF" }]}>{day}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {loading && !refreshing ? (
        <View style={styles.skeletonPadding}>
          <LoadingCardSkeleton />
          <LoadingCardSkeleton />
        </View>
      ) : (
        <FlatList
          data={timetable}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} tintColor={tenant.primaryColor} />}
          renderItem={({ item, index }) => {
            const isBreak = item.subject.toLowerCase() === 'break';
            const subjectColor = isBreak ? '#9CA3AF' : getSubjectColor(item.subject);

            return (
              <MotiView
                from={{ opacity: 0, translateX: -20 }}
                animate={{ opacity: 1, translateX: 0 }}
                transition={{ type: "spring", delay: index * 50 }}
              >
                <View style={styles.timelineRow}>
                  <View style={styles.timelineLine}>
                    <View style={[styles.timelineDot, { backgroundColor: subjectColor }]} />
                    {index !== (timetable?.length || 0) - 1 && <View style={[styles.timelineDash, { backgroundColor: subjectColor + '50' }]} />}
                  </View>

                  <ClayCard style={[styles.card, isBreak && styles.breakCard]}>
                    <View style={styles.cardInner}>
                      <View style={[styles.subjectIndicator, { backgroundColor: subjectColor }]} />
                      
                      <View style={styles.cardContent}>
                        <View style={styles.topRow}>
                          <Text style={[styles.subjectName, isBreak && styles.breakText]}>{item.subject}</Text>
                          <View style={styles.timeBadge}>
                            <Clock size={12} color={CLAY_THEME.colors.textSecondary} />
                            <Text style={styles.timeText}>{item.time.split(' - ')[0]}</Text>
                          </View>
                        </View>

                        {!isBreak && (
                          <View style={styles.detailsRow}>
                            <View style={styles.detailItem}>
                              <User size={14} color="#6B7280" />
                              <Text style={styles.detailText}>{item.teacher}</Text>
                            </View>
                            <View style={styles.detailItem}>
                              <MapPin size={14} color="#6B7280" />
                              <Text style={styles.detailText}>{item.room}</Text>
                            </View>
                          </View>
                        )}
                      </View>
                    </View>
                  </ClayCard>
                </View>
              </MotiView>
            );
          }}
        />
      )}
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
  iconWrapper: { padding: 10, borderRadius: 12 },
  daysWrapper: { backgroundColor: '#FFFFFF', paddingBottom: 12, borderBottomWidth: 1, borderBottomColor: CLAY_THEME.colors.borderLight },
  daysContainer: { paddingHorizontal: 16, gap: 10, paddingTop: 12 },
  dayBubble: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 24, borderWidth: 1, borderColor: '#E5E7EB', backgroundColor: '#F9FAFB' },
  dayText: { fontSize: 14, fontWeight: '700', color: '#4B5563' },
  skeletonPadding: { padding: 16 },
  list: { padding: 16, paddingBottom: 40 },
  timelineRow: { flexDirection: 'row', marginBottom: 16 },
  timelineLine: { width: 30, alignItems: 'center', marginTop: 10 },
  timelineDot: { width: 14, height: 14, borderRadius: 7, zIndex: 2 },
  timelineDash: { width: 2, flex: 1, marginTop: 4, marginBottom: -20 },
  card: { flex: 1, padding: 0, overflow: 'hidden' },
  breakCard: { backgroundColor: '#F3F4F6', borderWidth: 0, elevation: 0, shadowOpacity: 0 },
  cardInner: { flexDirection: 'row' },
  subjectIndicator: { width: 6 },
  cardContent: { flex: 1, padding: 14 },
  topRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 },
  subjectName: { fontSize: 16, fontWeight: '800', color: CLAY_THEME.colors.textPrimary },
  breakText: { color: '#6B7280', fontStyle: 'italic' },
  timeBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: '#F3F4F6', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  timeText: { fontSize: 11, fontWeight: '700', color: CLAY_THEME.colors.textSecondary },
  detailsRow: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  detailItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  detailText: { fontSize: 13, color: '#6B7280', fontWeight: '600' }
});
