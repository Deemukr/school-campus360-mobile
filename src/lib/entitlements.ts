export type Plan = "ESSENTIAL" | "PROFESSIONAL" | "ENTERPRISE";

export interface ModuleDef {
  key: string;
  label: string;
  href: string;
  icon: string;
  description: string;
}

export const MODULES: ModuleDef[] = [
  { key: "admissions", label: "Admissions", href: "/modules/admissions", icon: "UserPlus", description: "Lead funnel & application tracking" },
  { key: "sis", label: "Students", href: "/modules/students", icon: "Users", description: "Student profiles & directory" },
  { key: "attendance", label: "Attendance", href: "/modules/attendance", icon: "CalendarCheck", description: "Quick mobile roster marker" },
  { key: "fees", label: "Fees", href: "/modules/fees", icon: "Wallet", description: "Invoices, payments & concessions" },
  { key: "communication", label: "Communication", href: "/modules/communication", icon: "MessageSquare", description: "Notice board & circulars" },
  { key: "concerns", label: "Concerns", href: "/modules/concerns", icon: "MessageCircle", description: "Parent helpdesk & ticketing" },
  { key: "gradebook", label: "Grade Book", href: "/modules/gradebook", icon: "BookOpen", description: "Assessments & report cards" },
  { key: "certificates", label: "Certificates", href: "/modules/certificates", icon: "Award", description: "TC, Conduct & Bonafide" },
  { key: "hr", label: "Staff & HR", href: "/modules/hr", icon: "Briefcase", description: "Staff directory & leave pass" },
  { key: "health_discipline", label: "Health & Gate Pass", href: "/modules/health", icon: "Activity", description: "Medical logs & gate passes" },
  { key: "learner_profile", label: "Learner's Profile", href: "/modules/learner-profile", icon: "CircleUser", description: "360° student portfolio" },
  { key: "dynamic_forms", label: "Forms", href: "/modules/forms", icon: "ClipboardList", description: "Custom form submissions" },
  { key: "approvals", label: "Approvals", href: "/modules/approvals", icon: "CheckSquare", description: "Admin approval queue" },
  { key: "wellbeing", label: "Well-being", href: "/modules/wellbeing", icon: "HeartPulse", description: "Confidential pulse survey" },
  { key: "digital_library", label: "Library", href: "/modules/library", icon: "Library", description: "Book loans & reservations" },
  { key: "performance_calibration", label: "Performance", href: "/modules/performance", icon: "TrendingUp", description: "Subject analytics & calibration" },
  { key: "transport", label: "Transport", href: "/modules/transport", icon: "Bus", description: "Live bus tracking & routes" },
  { key: "hostel", label: "Hostel", href: "/modules/hostel", icon: "BedDouble", description: "Room allocation & mess" },
  { key: "inventory", label: "Inventory", href: "/modules/inventory", icon: "Boxes", description: "Asset & stock requisitions" },
  { key: "ai_dashboard", label: "AI Dashboard", href: "/modules/ai-dashboard", icon: "Sparkles", description: "AI usage & insights" },
  { key: "ai_tutor", label: "AI Study Tutor", href: "/tutor", icon: "GraduationCap", description: "Interactive study assistant" },
];

const ESSENTIAL = [
  "admissions", "sis", "attendance", "fees", "communication", "digital_library", "concerns", "dynamic_forms",
];

const PROFESSIONAL = [
  ...ESSENTIAL, "gradebook", "certificates", "hr", "wellbeing", "performance_calibration", "approvals", "health_discipline", "learner_profile",
];

const ENTERPRISE = [
  ...PROFESSIONAL, "transport", "hostel", "inventory", "ai_dashboard", "ai_tutor",
];

export const PLAN_FEATURES: Record<Plan, string[]> = {
  ESSENTIAL,
  PROFESSIONAL,
  ENTERPRISE,
};

export function effectiveEntitlements(plan: Plan, overrides: string[] = []): string[] {
  return Array.from(new Set([...(PLAN_FEATURES[plan] ?? ESSENTIAL), ...overrides]));
}
