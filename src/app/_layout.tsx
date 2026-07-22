import React from "react";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { TenantProvider } from "../lib/tenant";
import { SessionProvider } from "../lib/session";

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <TenantProvider>
        <SessionProvider>
          <StatusBar style="auto" />
          <Stack
            screenOptions={{
              headerStyle: {
                backgroundColor: "#FFFFFF",
              },
              headerTintColor: "#1F2937",
              headerTitleStyle: {
                fontWeight: "600",
              },
              animation: "slide_from_right",
            }}
          >
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="login" options={{ headerShown: false, presentation: "modal" }} />
            
            {/* Module Sub-screens */}
            <Stack.Screen name="modules/admissions" options={{ title: "Admissions Hub" }} />
            <Stack.Screen name="modules/students" options={{ title: "Student Directory" }} />
            <Stack.Screen name="modules/attendance" options={{ title: "Attendance Roster" }} />
            <Stack.Screen name="modules/fees" options={{ title: "Fees & Payments" }} />
            <Stack.Screen name="modules/communication" options={{ title: "Communication" }} />
            <Stack.Screen name="modules/concerns" options={{ title: "Parent Concerns" }} />
            <Stack.Screen name="modules/gradebook" options={{ title: "Grade Book" }} />
            <Stack.Screen name="modules/certificates" options={{ title: "Certificates" }} />
            <Stack.Screen name="modules/hr" options={{ title: "Staff & HR" }} />
            <Stack.Screen name="modules/health" options={{ title: "Health & Gate Pass" }} />
            <Stack.Screen name="modules/learner-profile" options={{ title: "Learner 360° Profile" }} />
            <Stack.Screen name="modules/forms" options={{ title: "Dynamic Forms" }} />
            <Stack.Screen name="modules/approvals" options={{ title: "Approval Queue" }} />
            <Stack.Screen name="modules/wellbeing" options={{ title: "Well-being Tracker" }} />
            <Stack.Screen name="modules/library" options={{ title: "Digital Library" }} />
            <Stack.Screen name="modules/performance" options={{ title: "Performance Calibration" }} />
            <Stack.Screen name="modules/transport" options={{ title: "Bus Transport" }} />
            <Stack.Screen name="modules/hostel" options={{ title: "Hostel & Mess" }} />
            <Stack.Screen name="modules/inventory" options={{ title: "Inventory & Assets" }} />
            <Stack.Screen name="modules/ai-dashboard" options={{ title: "AI Analytics" }} />
          </Stack>
        </SessionProvider>
      </TenantProvider>
    </SafeAreaProvider>
  );
}
