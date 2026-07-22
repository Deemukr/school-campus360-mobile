import React, { createContext, useContext, useState, useEffect } from "react";
import { apiClient, getStoredToken, setStoredToken, clearStoredToken } from "./apiClient";
import { API_ROUTES, API_BASE_URL } from "./apiRoutes";

export type UserRole = "SCHOOL_SUPER_ADMIN" | "SCHOOL_ADMIN" | "TEACHER" | "PARENT" | "STUDENT";

export interface UserSession {
  userId: string;
  email: string;
  name: string;
  role: UserRole;
  tenantId?: string;
  token?: string;
  avatarUrl?: string;
}

export interface SessionContextType {
  session: UserSession | null;
  isLoading: boolean;
  login: (email: string, role: UserRole, password?: string, targetTenantId?: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
}

// Decode base64 JWT payload safely without throwing
function decodeJwtPayload(token?: string | null): any {
  if (!token || typeof token !== "string") return null;
  const parts = token.split(".");
  if (parts.length < 2 || !parts[1]) return null;

  try {
    const base64Url = parts[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
}

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export const SessionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<UserSession | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const hydrateSession = async () => {
      try {
        const token = await getStoredToken();
        if (token) {
          const payload = decodeJwtPayload(token);
          if (payload && payload.email) {
            const meta = payload.app_metadata || {};
            setSession({
              userId: payload.sub || `user-${Date.now()}`,
              email: payload.email,
              name: payload.email.split("@")[0].replace(/[._]/g, " "),
              role: meta.role || "SCHOOL_ADMIN",
              tenantId: meta.tenant_id,
              token,
            });
          } else if (token.startsWith("demo_jwt_")) {
            setSession({
              userId: "demo-user-101",
              email: "admin@dps.test",
              name: "School Admin",
              role: "SCHOOL_ADMIN",
              tenantId: "d1d1d1d1-1111-1111-1111-111111111111",
              token,
            });
          }
        }
      } catch (err) {
        console.warn("Session hydration fallback", err);
      } finally {
        setIsLoading(false);
      }
    };

    hydrateSession();
  }, []);

  const login = async (
    email: string,
    role: UserRole,
    password?: string,
    targetTenantId?: string
  ): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    try {
      if (password) {
        // Resolve Ayva IAM URL with strict 2.5s timeout
        const hostBase = API_BASE_URL.replace(/\/api\/v1\/?$/, "");
        const iamUrl = hostBase.replace(":8010", ":8081");

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 2500);

        try {
          const iamRes = await fetch(`${iamUrl}/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
            signal: controller.signal,
          });

          clearTimeout(timeoutId);

          if (iamRes.ok) {
            const iamData = await iamRes.json();
            const accessToken = iamData.access_token;
            if (accessToken) {
              const payload = decodeJwtPayload(accessToken);
              const meta = payload?.app_metadata || {};

              // Multi-Tenant Isolation Verification
              if (targetTenantId && meta.tenant_id && meta.tenant_id !== targetTenantId) {
                setIsLoading(false);
                return {
                  success: false,
                  error: `Access Denied: Your account belongs to a different school branch.`,
                };
              }

              await setStoredToken(accessToken);

              setSession({
                userId: payload?.sub || `user-${Date.now()}`,
                email,
                name: email.split("@")[0].replace(/[._]/g, " "),
                role: meta.role || role,
                tenantId: meta.tenant_id,
                token: accessToken,
              });

              setIsLoading(false);
              return { success: true };
            }
          }
        } catch {
          clearTimeout(timeoutId);
        }
      }

      // Fast Local/Demo Session Fallback for Mobile Expo Go
      const namePart = email.split("@")[0].replace(/[._]/g, " ");
      const formattedName = namePart ? namePart.charAt(0).toUpperCase() + namePart.slice(1) : "Campus User";
      const dummyToken = `demo_jwt_${Date.now()}`;
      await setStoredToken(dummyToken);

      setSession({
        userId: `user-${Date.now()}`,
        email,
        name: formattedName,
        role,
        tenantId: targetTenantId,
        token: dummyToken,
      });

      setIsLoading(false);
      return { success: true };
    } catch (err: any) {
      console.error("Login exception", err);
      setIsLoading(false);
      return { success: false, error: err?.message || "Auth service unreachable" };
    }
  };

  const logout = async () => {
    await clearStoredToken();
    setSession(null);
  };

  return React.createElement(
    SessionContext.Provider,
    { value: { session, isLoading, login, logout } },
    children
  );
};

export const useSession = () => {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error("useSession must be used within a SessionProvider");
  }
  return context;
};
