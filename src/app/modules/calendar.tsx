import React, { useState } from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity, RefreshControl } from "react-native";
import { CalendarCheck, CalendarDays, PartyPopper, BookOpen, MapPin, Bell } from "lucide-react-native";
import * as Haptics from "expo-haptics";
import { MotiView } from "moti";
import { useTenant } from "../../lib/tenant";
import { useCalendar } from "../../lib/hooks/useModulesData";
import { CLAY_THEME } from "../../lib/theme";
import { ClayCard } from "../../components/ClayCard";
import { LoadingCardSkeleton } from "../../components/LoadingSkeleton";
import { LinearGradient } from "expo-linear-gradient";

export default function CalendarScreen() {
  const { tenant } = useTenant();
  const { events, loading, refetch } = useCalendar();
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState("UPCOMING");

  const handleRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const handleTabPress = (tab: string) => {
    Haptics.selectionAsync();
    setActiveTab(tab);
  };

  const getEventIcon = (type: string, color: string) => {
    switch (type) {
      case 'HOLIDAY': return <PartyPopper size={24} color={color} />;
      case 'ACADEMIC': return <BookOpen size={24} color={color} />;
      default: return <CalendarDays size={24} color={color} />;
    }
  };

  const getEventColor = (type: string) => {
    switch (type) {
      case 'HOLIDAY': return '#10B981'; // Green
      case 'ACADEMIC': return '#3B82F6'; // Blue
      default: return '#8B5CF6'; // Purple
    }
  };

  const renderMonthHeader = (dateStr: string) => {
    const date = new Date(dateStr);
    const month = date.toLocaleString('default', { month: 'long' });
    const year = date.getFullYear();
    return `${month} ${year}`;
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[tenant.primaryColor, tenant.accentColor]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.heroBanner}
      >
        <View style={styles.heroTop}>
          <CalendarCheck size={32} color="#FFFFFF" />
          <TouchableOpacity style={styles.bellBtn}>
            <Bell size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
        <Text style={styles.heroTitle}>Academic Calendar</Text>
        <Text style={styles.heroSub}>2026 - 2027 Session</Text>
      </LinearGradient>

      <View style={styles.tabsContainer}>
        <View style={styles.tabsWrapper}>
          {["UPCOMING", "PAST"].map((tab) => (
            <TouchableOpacity
              key={tab}
              style={[styles.tabBtn, activeTab === tab && styles.tabBtnActive]}
              onPress={() => handleTabPress(tab)}
            >
              <Text style={[styles.tabText, activeTab === tab && { color: tenant.primaryColor }]}>{tab}</Text>
              {activeTab === tab && <View style={[styles.tabIndicator, { backgroundColor: tenant.primaryColor }]} />}
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {loading && !refreshing ? (
        <View style={styles.skeletonPadding}>
          <LoadingCardSkeleton />
          <LoadingCardSkeleton />
        </View>
      ) : (
        <FlatList
          data={events}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} tintColor={tenant.primaryColor} />}
          renderItem={({ item, index }) => {
            const eventColor = getEventColor(item.type);
            const dateObj = new Date(item.date);
            const day = dateObj.getDate();
            const month = dateObj.toLocaleString('default', { month: 'short' });

            return (
              <MotiView
                from={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: "timing", duration: 300, delay: index * 100 }}
              >
                <ClayCard style={styles.card}>
                  <View style={styles.cardInner}>
                    <View style={[styles.dateBox, { backgroundColor: eventColor + '15' }]}>
                      <Text style={[styles.dateMonth, { color: eventColor }]}>{month.toUpperCase()}</Text>
                      <Text style={[styles.dateDay, { color: eventColor }]}>{day}</Text>
                    </View>

                    <View style={styles.contentBox}>
                      <View style={styles.headerRow}>
                        <View style={[styles.typeBadge, { backgroundColor: eventColor + '20' }]}>
                          <Text style={[styles.typeText, { color: eventColor }]}>{item.type}</Text>
                        </View>
                      </View>
                      
                      <Text style={styles.title}>{item.title}</Text>
                      
                      <View style={styles.footerRow}>
                        {getEventIcon(item.type, eventColor)}
                      </View>
                    </View>
                  </View>
                </ClayCard>
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
  heroBanner: { padding: 24, paddingBottom: 32, borderBottomLeftRadius: 32, borderBottomRightRadius: 32, ...CLAY_THEME.shadows.clayMedium },
  heroTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  bellBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.2)', justifyContent: 'center', alignItems: 'center' },
  heroTitle: { fontSize: 28, fontWeight: '800', color: '#FFFFFF', fontFamily: "Baloo 2", marginBottom: 4 },
  heroSub: { fontSize: 14, fontWeight: '600', color: 'rgba(255,255,255,0.9)' },
  tabsContainer: { marginTop: -20, paddingHorizontal: 24, zIndex: 10 },
  tabsWrapper: { flexDirection: 'row', backgroundColor: '#FFFFFF', borderRadius: 20, padding: 6, ...CLAY_THEME.shadows.claySoft },
  tabBtn: { flex: 1, alignItems: 'center', paddingVertical: 12, borderRadius: 16 },
  tabBtnActive: { backgroundColor: '#F9FAFB' },
  tabText: { fontSize: 13, fontWeight: '800', color: '#9CA3AF' },
  tabIndicator: { position: 'absolute', bottom: -6, width: 40, height: 4, borderRadius: 2 },
  skeletonPadding: { padding: 16, marginTop: 20 },
  list: { padding: 16, paddingTop: 30, gap: 16, paddingBottom: 40 },
  card: { padding: 0 },
  cardInner: { flexDirection: 'row', padding: 16, gap: 16 },
  dateBox: { width: 64, height: 64, borderRadius: 16, justifyContent: 'center', alignItems: 'center' },
  dateMonth: { fontSize: 11, fontWeight: '800', marginBottom: 2 },
  dateDay: { fontSize: 24, fontWeight: '800' },
  contentBox: { flex: 1, justifyContent: 'center' },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  typeBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  typeText: { fontSize: 10, fontWeight: '800' },
  title: { fontSize: 18, fontWeight: '800', color: CLAY_THEME.colors.textPrimary, marginBottom: 8 },
  footerRow: { flexDirection: 'row', justifyContent: 'flex-end' }
});
