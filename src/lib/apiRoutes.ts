import Constants from "expo-constants";
import { Platform } from "react-native";

// Resolve base URL for local dev, Expo Go LAN, vs production backend
const getBaseUrl = () => {
  const envUrl = process.env.EXPO_PUBLIC_API_BASE_URL;
  if (envUrl && !envUrl.includes("localhost")) {
    return envUrl;
  }
  // Dynamically extract host machine IP when running inside Expo Go on mobile
  const hostUri = Constants.expoConfig?.hostUri;
  if (hostUri) {
    const hostIp = hostUri.split(":")[0];
    if (hostIp && hostIp !== "localhost" && hostIp !== "127.0.0.1") {
      return `http://${hostIp}:8010/api/v1`;
    }
  }
  // Android Emulator fallback to host machine 10.0.2.2
  if (Platform.OS === "android") {
    return "http://10.0.2.2:8010/api/v1";
  }
  return "http://192.168.1.6:8010/api/v1";
};

export const API_BASE_URL = getBaseUrl();

export const API_ROUTES = {
  // Auth & System
  AUTH_LOGIN: "/auth/login",
  AUTH_EXCHANGE: "/auth/exchange",
  AUTH_REFRESH: "/auth/refresh",
  BRANCHES: "/branches",
  ADMIN_USERS: "/admin/users",
  GUARDIANS: "/guardians",

  // Core SIS & Admissions
  STUDENTS: "/students",
  ADMISSIONS: "/admissions",
  ATTENDANCE: "/attendance",
  GRADEBOOK: "/gradebook/assessments",
  LEARNER_PROFILE: "/learner-profile/observations",
  PERFORMANCE: "/performance",

  // Campus Operations
  FEES: "/fees",
  APPROVALS: "/approvals",
  TRANSPORT_ROUTES: "/transport/routes",
  TRANSPORT_TELEMETRY: "/transport/telemetry",
  HR_STAFF: "/hr/staff",
  HR_LEAVE: "/hr/leave",
  LIBRARY: "/library/titles",
  CONCERNS: "/concerns",
  INVENTORY: "/inventory/items",
  HOSTEL_BEDS: "/hostel/beds",
  HOSTEL_GATEPASS: "/hostel/gatepasses",
  HEALTH: "/health/records",

  // Forms, Certificates & Communications
  FORMS: "/forms",
  CERTIFICATES_TEMPLATES: "/certificates/templates",
  WELLBEING: "/wellbeing/checkins",
  COMMUNICATION: "/communication",

  // AI & Analytics
  AI_TUTOR_SESSIONS: "/tutor/sessions",
  AI_SUMMARY: "/ai/summary",
};
