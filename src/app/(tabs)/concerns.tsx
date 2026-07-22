import React, { useState } from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Modal, TextInput, RefreshControl } from "react-native";
import { MessageCircle, Plus, Clock, CheckCircle2, AlertCircle, X, Send } from "lucide-react-native";
import * as Haptics from "expo-haptics";
import { useTenant } from "../../lib/tenant";
import { useConcerns } from "../../lib/hooks/useModulesData";
import { CLAY_THEME } from "../../lib/theme";
import { ClayCard } from "../../components/ClayCard";
import { LoadingCardSkeleton } from "../../components/LoadingSkeleton";

interface Ticket {
  id: string;
  subject: string;
  category: "ACADEMICS" | "TRANSPORT" | "FEES" | "HOSTEL" | string;
  status: "OPEN" | "IN_PROGRESS" | "RESOLVED" | string;
  date: string;
  lastMessage: string;
}

export default function ConcernsScreen() {
  const { tenant } = useTenant();
  const { concerns, loading, refetch, createConcern } = useConcerns();
  const [modalVisible, setModalVisible] = useState(false);
  const [newSubject, setNewSubject] = useState("");
  const [newCategory, setNewCategory] = useState<string>("ACADEMICS");
  const [newDetails, setNewDetails] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const handleCreateTicket = async () => {
    if (!newSubject.trim()) return;
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

    await createConcern({
      title: newSubject,
      category: newCategory,
      details: newDetails,
    });

    setNewSubject("");
    setNewDetails("");
    setModalVisible(false);
    await refetch();
  };

  const getStatusBadge = (status: string) => {
    switch (status.toUpperCase()) {
      case "OPEN":
        return { color: "#F59E0B", label: "Open", icon: Clock };
      case "IN_PROGRESS":
        return { color: "#3B82F6", label: "In Progress", icon: AlertCircle };
      case "RESOLVED":
        return { color: "#10B981", label: "Resolved", icon: CheckCircle2 };
      default:
        return { color: "#6B7280", label: status, icon: Clock };
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.topInfo}>
        <View>
          <Text style={styles.topTitle}>Parent & Student Helpdesk</Text>
          <Text style={styles.topSub}>Track or submit concerns directly to administration</Text>
        </View>

        <TouchableOpacity
          style={[styles.newBtn, { backgroundColor: tenant.primaryColor }]}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            setModalVisible(true);
          }}
        >
          <Plus size={16} color="#FFFFFF" />
          <Text style={styles.newBtnText}>Raise Concern</Text>
        </TouchableOpacity>
      </View>

      {loading && !refreshing ? (
        <View style={styles.skeletonPadding}>
          <LoadingCardSkeleton />
          <LoadingCardSkeleton />
          <LoadingCardSkeleton />
        </View>
      ) : (
        <FlatList
          data={concerns}
          keyExtractor={(item) => item.id || String(Math.random())}
          contentContainerStyle={styles.listContent}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} tintColor={tenant.primaryColor} />}
          renderItem={({ item }) => {
            const badge = getStatusBadge(item.status || "OPEN");
            const Icon = badge.icon;
            return (
              <ClayCard style={styles.ticketCard} onPress={() => {}}>
                <View style={styles.ticketHeader}>
                  <Text style={styles.ticketId}>{item.id}</Text>
                  <View style={[styles.statusBadge, { backgroundColor: badge.color + "15" }]}>
                    <Icon size={12} color={badge.color} />
                    <Text style={[styles.statusText, { color: badge.color }]}>{badge.label}</Text>
                  </View>
                </View>

                <Text style={styles.subject}>{item.title || item.subject}</Text>
                <Text style={styles.categoryTag}>
                  {item.category} • {item.date || "Recent"}
                </Text>

                <View style={styles.chatPreview}>
                  <MessageCircle size={14} color="#6B7280" />
                  <Text style={styles.chatText} numberOfLines={1}>
                    {item.lastMessage || item.details || "Assigned to department head for review."}
                  </Text>
                </View>
              </ClayCard>
            );
          }}
        />
      )}

      {/* Create Ticket Modal */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Raise a New Concern</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <X size={20} color="#6B7280" />
              </TouchableOpacity>
            </View>

            <Text style={styles.inputLabel}>Subject / Topic</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., Request for bus route adjustment"
              placeholderTextColor="#9CA3AF"
              value={newSubject}
              onChangeText={setNewSubject}
            />

            <Text style={styles.inputLabel}>Category</Text>
            <View style={styles.categoryRow}>
              {["ACADEMICS", "TRANSPORT", "FEES", "HOSTEL"].map((cat) => {
                const isSelected = newCategory === cat;
                return (
                  <TouchableOpacity
                    key={cat}
                    style={[
                      styles.categoryChip,
                      isSelected && { backgroundColor: tenant.primaryColor, borderColor: tenant.primaryColor },
                    ]}
                    onPress={() => setNewCategory(cat)}
                  >
                    <Text style={[styles.categoryChipText, isSelected && { color: "#FFFFFF" }]}>{cat}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <Text style={styles.inputLabel}>Detailed Description</Text>
            <TextInput
              style={[styles.input, styles.multilineInput]}
              placeholder="Provide specific details about your query..."
              placeholderTextColor="#9CA3AF"
              multiline
              numberOfLines={4}
              value={newDetails}
              onChangeText={setNewDetails}
            />

            <TouchableOpacity style={[styles.submitBtn, { backgroundColor: tenant.primaryColor }]} onPress={handleCreateTicket}>
              <Send size={16} color="#FFFFFF" />
              <Text style={styles.submitBtnText}>Submit to Department</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: CLAY_THEME.colors.background,
  },
  topInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1.5,
    borderBottomColor: CLAY_THEME.colors.border,
  },
  topTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: CLAY_THEME.colors.textPrimary,
  },
  topSub: {
    fontSize: 11,
    color: CLAY_THEME.colors.textSecondary,
    marginTop: 2,
  },
  newBtn: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    gap: 6,
    ...CLAY_THEME.shadows.clayButton,
  },
  newBtnText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "700",
  },
  skeletonPadding: {
    padding: 16,
  },
  listContent: {
    padding: 16,
    gap: 12,
  },
  ticketCard: {
    marginBottom: 4,
  },
  ticketHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  ticketId: {
    fontSize: 12,
    fontWeight: "800",
    color: CLAY_THEME.colors.textMuted,
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 4,
  },
  statusText: {
    fontSize: 10,
    fontWeight: "800",
    textTransform: "uppercase",
  },
  subject: {
    fontSize: 14,
    fontWeight: "700",
    color: CLAY_THEME.colors.textPrimary,
    marginBottom: 4,
  },
  categoryTag: {
    fontSize: 11,
    color: CLAY_THEME.colors.textSecondary,
    marginBottom: 10,
  },
  chatPreview: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FAF5FF",
    padding: 10,
    borderRadius: 10,
    gap: 8,
  },
  chatText: {
    fontSize: 12,
    color: CLAY_THEME.colors.textPrimary,
    flex: 1,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modalContainer: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    borderTopWidth: 2,
    borderTopColor: CLAY_THEME.colors.border,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: CLAY_THEME.colors.textPrimary,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: CLAY_THEME.colors.textSecondary,
    marginBottom: 6,
    marginTop: 10,
  },
  input: {
    backgroundColor: "#FAF5FF",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: CLAY_THEME.colors.border,
    paddingHorizontal: 12,
    height: 44,
    fontSize: 14,
    color: CLAY_THEME.colors.textPrimary,
  },
  multilineInput: {
    height: 80,
    paddingTop: 10,
  },
  categoryRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 4,
  },
  categoryChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: "#F1F5F9",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  categoryChipText: {
    fontSize: 11,
    fontWeight: "700",
    color: CLAY_THEME.colors.textSecondary,
  },
  submitBtn: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    height: 48,
    borderRadius: 14,
    marginTop: 20,
    gap: 8,
    ...CLAY_THEME.shadows.clayButton,
  },
  submitBtnText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
  },
});
