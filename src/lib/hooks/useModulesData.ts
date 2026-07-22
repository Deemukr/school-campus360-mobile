import { useQuery, useMutation } from "./useApi";
import { API_ROUTES } from "../apiRoutes";
import { apiClient } from "../apiClient";

// 1. Dashboard AI Analytics Summary
export function useAiSummary() {
  const { data, loading, error, refetch } = useQuery(API_ROUTES.AI_SUMMARY);

  const fallback = {
    attendance_rate: "96.4%",
    fee_collection: "₹42.8L",
    pending_approvals: 5,
    open_concerns: 3,
    avg_performance: "88.5%",
    alerts: [
      { id: "1", type: "WARNING", message: "Section 10-A attendance dropped below 90% today" },
      { id: "2", type: "INFO", message: "CBSE Term 1 Mark Sheets finalized for Grade 12" },
      { id: "3", type: "CRITICAL", message: "Bus Route #4 delayed by 15 mins (Traffic)" },
    ],
  };

  return {
    summary: data || fallback,
    loading,
    error,
    refetch,
  };
}

// 2. Students Module
export function useStudents() {
  const { data, loading, error, refetch } = useQuery<any[]>(API_ROUTES.STUDENTS);

  const fallback = [
    { id: "STU-1001", name: "Aarav Sharma", grade: "10-A", rollNo: "01", parentName: "Rajesh Sharma", attendance: "98%", status: "ACTIVE" },
    { id: "STU-1002", name: "Ananya Verma", grade: "10-A", rollNo: "02", parentName: "Suresh Verma", attendance: "94%", status: "ACTIVE" },
    { id: "STU-1003", name: "Rhea Patel", grade: "9-B", rollNo: "15", parentName: "Kavita Patel", attendance: "96%", status: "ACTIVE" },
  ];

  const enrolMutation = useMutation(API_ROUTES.STUDENTS, "POST");

  return {
    students: data && Array.isArray(data) ? data : fallback,
    loading,
    error,
    refetch,
    enrolStudent: enrolMutation.mutate,
  };
}

// 3. Admissions Module
export function useAdmissions() {
  const { data, loading, error, refetch } = useQuery<any[]>(API_ROUTES.ADMISSIONS);

  const fallback = [
    { id: "ADM-801", applicantName: "Zara Khan", grade: "Grade 1", parentName: "Imran Khan", status: "UNDER_REVIEW", appliedDate: "2026-07-20" },
    { id: "ADM-802", applicantName: "Yusuf Ahmed", grade: "Grade 6", parentName: "Tariq Ahmed", status: "ACCEPTED", appliedDate: "2026-07-18" },
    { id: "ADM-803", applicantName: "Kabir Mehta", grade: "Grade 11", parentName: "Sunil Mehta", status: "INTERVIEW_SCHEDULED", appliedDate: "2026-07-15" },
  ];

  const createAdmissionMutation = useMutation(API_ROUTES.ADMISSIONS, "POST");

  return {
    applications: data && Array.isArray(data) ? data : fallback,
    loading,
    error,
    refetch,
    createApplication: createAdmissionMutation.mutate,
  };
}

// 4. Attendance Module
export function useAttendance() {
  const { data, loading, error, refetch } = useQuery<any>(API_ROUTES.ATTENDANCE);

  const fallback = {
    section: "Grade 10-A",
    totalStudents: 40,
    presentCount: 38,
    absentCount: 2,
    roster: [
      { id: "STU-1001", name: "Aarav Sharma", rollNo: "01", status: "PRESENT" },
      { id: "STU-1002", name: "Ananya Verma", rollNo: "02", status: "PRESENT" },
      { id: "STU-1004", name: "Rohan Das", rollNo: "04", status: "ABSENT" },
      { id: "STU-1005", name: "Priya Nair", rollNo: "05", status: "ABSENT" },
    ],
  };

  const markAttendanceMutation = useMutation(API_ROUTES.ATTENDANCE, "POST");

  return {
    attendanceData: data || fallback,
    loading,
    error,
    refetch,
    markAttendance: markAttendanceMutation.mutate,
  };
}

// 5. Fees Module
export function useFees() {
  const { data, loading, error, refetch } = useQuery<any>(API_ROUTES.FEES);

  const fallback = {
    totalTarget: "₹50,00,000",
    collected: "₹42,80,000",
    pending: "₹7,20,000",
    concessionsRequested: 3,
    records: [
      { id: "FEE-201", studentName: "Aarav Sharma", grade: "10-A", amount: "₹45,000", status: "PAID", dueDate: "2026-07-10" },
      { id: "FEE-202", studentName: "Rohan Das", grade: "10-A", amount: "₹45,000", status: "PENDING", dueDate: "2026-07-25" },
    ],
  };

  const requestConcessionMutation = useMutation(`${API_ROUTES.FEES}/request-concession`, "POST");

  return {
    feesData: data || fallback,
    loading,
    error,
    refetch,
    requestConcession: requestConcessionMutation.mutate,
  };
}

// 6. Approvals (HITL) Module
export function useApprovals() {
  const { data, loading, error, refetch } = useQuery<any[]>(API_ROUTES.APPROVALS);

  const fallback = [
    { id: "APP-501", title: "Fee Concession Request - Rohan Das", type: "FINANCE", requestedBy: "Suresh Das", date: "2026-07-21", status: "PENDING" },
    { id: "APP-502", title: "Staff Leave Application - Dr. Alok Kumar", type: "LEAVE", requestedBy: "Dr. Alok Kumar", date: "2026-07-20", status: "PENDING" },
    { id: "APP-503", title: "Hostel Outing Gate Pass - Diya Patel", type: "GATEPASS", requestedBy: "Diya Patel", date: "2026-07-19", status: "APPROVED" },
  ];

  const decideApproval = async (approvalId: string, decision: "APPROVED" | "REJECTED", notes?: string) => {
    return apiClient(`${API_ROUTES.APPROVALS}/${approvalId}/decide`, {
      method: "POST",
      body: JSON.stringify({ decision, notes }),
    });
  };

  return {
    approvals: data && Array.isArray(data) ? data : fallback,
    loading,
    error,
    refetch,
    decideApproval,
  };
}

// 7. Transport Module
export function useTransport() {
  const { data, loading, error, refetch } = useQuery<any[]>(API_ROUTES.TRANSPORT_ROUTES);

  const fallback = [
    { id: "TR-01", routeName: "North Delhi Express", driver: "Ramesh Singh", busNo: "DL-01-AB-1234", studentsCount: 42, status: "ON_ROUTE", speed: "38 km/h" },
    { id: "TR-02", routeName: "South Extension Loop", driver: "Gurpreet Singh", busNo: "DL-01-CD-5678", studentsCount: 35, status: "GARAGED", speed: "0 km/h" },
  ];

  return {
    routes: data && Array.isArray(data) ? data : fallback,
    loading,
    error,
    refetch,
  };
}

// 8. Concerns & Grievance Desk Module
export function useConcerns() {
  const { data, loading, error, refetch } = useQuery<any[]>(API_ROUTES.CONCERNS);

  const fallback = [
    { id: "CNC-301", category: "Academic", title: "Math Syllabus pace in 10-A", raisedBy: "Kavita Patel", status: "OPEN", priority: "HIGH", date: "2026-07-21" },
    { id: "CNC-302", category: "Transport", title: "Bus 4 AC non-functional", raisedBy: "Suresh Verma", status: "IN_PROGRESS", priority: "MEDIUM", date: "2026-07-20" },
  ];

  const createConcernMutation = useMutation(API_ROUTES.CONCERNS, "POST");

  return {
    concerns: data && Array.isArray(data) ? data : fallback,
    loading,
    error,
    refetch,
    createConcern: createConcernMutation.mutate,
  };
}

// 9. AI Tutor Module
export function useAiTutor() {
  const { data, loading, error, refetch } = useQuery<any[]>(API_ROUTES.AI_TUTOR_SESSIONS);

  const sendMessage = async (sessionId: string, text: string) => {
    return apiClient(`${API_ROUTES.AI_TUTOR_SESSIONS}/${sessionId}/messages`, {
      method: "POST",
      body: JSON.stringify({ message: text }),
    });
  };

  const createSession = async (topic: string, subject: string) => {
    return apiClient(API_ROUTES.AI_TUTOR_SESSIONS, {
      method: "POST",
      body: JSON.stringify({ topic, subject }),
    });
  };

  return {
    sessions: data && Array.isArray(data) ? data : [],
    loading,
    error,
    refetch,
    sendMessage,
    createSession,
  };
}

// 10. Communication & Broadcast Announcements Module
export function useCommunication() {
  const { data, loading, error, refetch } = useQuery<any[]>(API_ROUTES.COMMUNICATION);

  const fallback = [
    { id: "ANN-101", title: "CBSE Board Examination Datesheet Released", category: "Academic", author: "Principal Office", date: "2026-07-22", content: "The official datesheet for CBSE Class 10 & 12 Board Exams has been published." },
    { id: "ANN-102", title: "Annual Sports Day Registration Open", category: "Sports", author: "Sports Dept", date: "2026-07-21", content: "All house captains please collect event nomination forms." },
    { id: "ANN-103", title: "Monsoon Health Advisory", category: "Health", author: "School Nurse", date: "2026-07-19", content: "Parents are requested to ensure students carry rain gear and water bottles." },
  ];

  const publishAnnouncementMutation = useMutation(API_ROUTES.COMMUNICATION, "POST");

  return {
    announcements: data && Array.isArray(data) ? data : fallback,
    loading,
    error,
    refetch,
    publishAnnouncement: publishAnnouncementMutation.mutate,
  };
}
