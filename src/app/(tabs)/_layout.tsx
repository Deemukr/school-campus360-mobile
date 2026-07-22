import React from "react";
import { Tabs } from "expo-router";
import { LayoutGrid, MessageSquare, HelpCircle, GraduationCap, User } from "lucide-react-native";
import { useTenant } from "../../lib/tenant";

export default function TabsLayout() {
  const { tenant } = useTenant();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: tenant.primaryColor,
        tabBarInactiveTintColor: "#9CA3AF",
        tabBarStyle: {
          backgroundColor: "#FFFFFF",
          borderTopWidth: 1,
          borderTopColor: "#F3F4F6",
          height: 64,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "500",
        },
        headerStyle: {
          backgroundColor: "#FFFFFF",
          elevation: 0,
          shadowOpacity: 0,
          borderBottomWidth: 1,
          borderBottomColor: "#F3F4F6",
        },
        headerTitleStyle: {
          fontWeight: "700",
          fontSize: 18,
          color: "#111827",
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          headerTitle: tenant.displayName,
          tabBarIcon: ({ color, size }) => <LayoutGrid size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="updates"
        options={{
          title: "Updates",
          headerTitle: "Notice & Circulars",
          tabBarIcon: ({ color, size }) => <MessageSquare size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="concerns"
        options={{
          title: "Concerns",
          headerTitle: "Parent Helpdesk",
          tabBarIcon: ({ color, size }) => <HelpCircle size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="tutor"
        options={{
          title: "AI Tutor",
          headerTitle: "AI Learning Assistant",
          tabBarIcon: ({ color, size }) => <GraduationCap size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          headerTitle: "Account & Tenant",
          tabBarIcon: ({ color, size }) => <User size={size} color={color} />,
        }}
      />
    </Tabs>
  );
}
