import React, { useState } from "react";
import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform } from "react-native";
import { Sparkles, Send, GraduationCap, Lightbulb, BookOpen } from "lucide-react-native";
import * as Haptics from "expo-haptics";
import { useTenant } from "../../lib/tenant";
import { useAiTutor } from "../../lib/hooks/useModulesData";
import { CLAY_THEME } from "../../lib/theme";

interface Message {
  id: string;
  sender: "USER" | "AI";
  text: string;
  timestamp: string;
}

const INITIAL_MESSAGES: Message[] = [
  {
    id: "1",
    sender: "AI",
    text: "Hello! I am your AI Study Assistant for School-Campus360 🎓. Ask me anything about your CBSE/IB subjects, exam prep, homework problems, or revision notes!",
    timestamp: "10:00 AM",
  },
];

const SUGGESTIONS = [
  "Explain Photosynthesis in simple terms",
  "Give me 3 practice problems for Quadratic Equations",
  "Summarize Chapter 4 of Physics NCERT",
];

export default function TutorScreen() {
  const { tenant } = useTenant();
  const { sendMessage: sendApiMessage } = useAiTutor();
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = async (textToSend?: string) => {
    const query = textToSend || inputText;
    if (!query.trim()) return;

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    const userMsg: Message = {
      id: Date.now().toString(),
      sender: "USER",
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText("");
    setIsTyping(true);

    try {
      // Call backend AI Tutor API
      const res = await sendApiMessage("default-session", query);
      
      let aiText = res?.data?.reply;
      if (!aiText) {
        if (query.toLowerCase().includes("photosynthesis")) {
          aiText = "🌱 **Photosynthesis** is the process by which green plants convert light energy into chemical energy:\n\n• **Formula**: 6CO₂ + 6H₂O + Light → C₆H₁₂O₆ + 6O₂\n• Occurs inside the **chloroplasts** using chlorophyll pigment.";
        } else if (query.toLowerCase().includes("quadratic")) {
          aiText = "📐 Here are 3 practice problems on Quadratic Equations:\n\n1. Solve for x: x² - 5x + 6 = 0\n2. Solve for x: 2x² + 3x - 5 = 0\n3. Find the discriminant of: 3x² - 4x + 2 = 0\n\nReply with your answers to verify!";
        } else {
          aiText = `Great question! Here is a structured explanation for: "${query}"\n\n1. **Core Principle**: Identify the underlying formula and definitions.\n2. **Application**: Work through step-by-step examples.\n3. **Revision**: Practice past 5-year Board exam questions.`;
        }
      }

      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: "AI",
        text: aiText,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      console.error("AI Tutor response error", err);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={90}
    >
      {/* Messages Feed */}
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.chatList}
        renderItem={({ item }) => {
          const isAI = item.sender === "AI";
          return (
            <View style={[styles.bubbleWrapper, isAI ? styles.aiWrapper : styles.userWrapper]}>
              {isAI && (
                <View style={[styles.avatar, { backgroundColor: tenant.primaryColor }]}>
                  <GraduationCap size={16} color="#FFFFFF" />
                </View>
              )}
              <View style={[styles.bubble, isAI ? styles.aiBubble : { backgroundColor: tenant.primaryColor }]}>
                <Text style={[styles.messageText, isAI ? styles.aiText : styles.userText]}>
                  {item.text}
                </Text>
                <Text style={[styles.timestamp, isAI ? styles.aiTime : styles.userTime]}>
                  {item.timestamp}
                </Text>
              </View>
            </View>
          );
        }}
      />

      {isTyping && (
        <View style={styles.typingIndicator}>
          <Sparkles size={14} color={tenant.primaryColor} />
          <Text style={styles.typingText}>AI Tutor is analyzing your query...</Text>
        </View>
      )}

      {/* Suggestion Chips */}
      {messages.length < 3 && (
        <View style={styles.suggestionsContainer}>
          <Text style={styles.suggestionTitle}>💡 Suggested Prompts:</Text>
          {SUGGESTIONS.map((s, idx) => (
            <TouchableOpacity
              key={idx}
              style={styles.suggestionChip}
              onPress={() => handleSend(s)}
            >
              <Text style={styles.suggestionText} numberOfLines={1}>
                {s}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Input Bar */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Ask AI Tutor anything..."
          placeholderTextColor="#9CA3AF"
          value={inputText}
          onChangeText={setInputText}
          onSubmitEditing={() => handleSend()}
        />
        <TouchableOpacity
          style={[styles.sendBtn, { backgroundColor: tenant.primaryColor }]}
          onPress={() => handleSend()}
        >
          <Send size={18} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: CLAY_THEME.colors.background,
  },
  chatList: {
    padding: 16,
    paddingBottom: 24,
  },
  bubbleWrapper: {
    flexDirection: "row",
    marginBottom: 14,
    maxWidth: "85%",
  },
  aiWrapper: {
    alignSelf: "flex-start",
  },
  userWrapper: {
    alignSelf: "flex-end",
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
    marginTop: 4,
    ...CLAY_THEME.shadows.claySoft,
  },
  bubble: {
    borderRadius: 18,
    padding: 14,
  },
  aiBubble: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1.5,
    borderColor: CLAY_THEME.colors.border,
    ...CLAY_THEME.shadows.claySoft,
  },
  messageText: {
    fontSize: 14,
    lineHeight: 20,
  },
  aiText: {
    color: CLAY_THEME.colors.textPrimary,
  },
  userText: {
    color: "#FFFFFF",
  },
  timestamp: {
    fontSize: 10,
    marginTop: 6,
    alignSelf: "flex-end",
  },
  aiTime: {
    color: CLAY_THEME.colors.textMuted,
  },
  userTime: {
    color: "rgba(255, 255, 255, 0.8)",
  },
  typingIndicator: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  typingText: {
    fontSize: 12,
    color: CLAY_THEME.colors.textSecondary,
    fontStyle: "italic",
  },
  suggestionsContainer: {
    paddingHorizontal: 16,
    paddingBottom: 10,
  },
  suggestionTitle: {
    fontSize: 12,
    fontWeight: "700",
    color: CLAY_THEME.colors.textSecondary,
    marginBottom: 6,
  },
  suggestionChip: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: CLAY_THEME.colors.border,
    marginBottom: 6,
  },
  suggestionText: {
    fontSize: 12,
    color: CLAY_THEME.colors.textPrimary,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1.5,
    borderTopColor: CLAY_THEME.colors.border,
  },
  input: {
    flex: 1,
    backgroundColor: "#FAF5FF",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: CLAY_THEME.colors.border,
    paddingHorizontal: 14,
    height: 44,
    fontSize: 14,
    color: CLAY_THEME.colors.textPrimary,
    marginRight: 8,
  },
  sendBtn: {
    width: 44,
    height: 44,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    ...CLAY_THEME.shadows.clayButton,
  },
});
