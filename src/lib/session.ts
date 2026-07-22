import React, { createContext, useContext, useState, useEffect } from "react";
import { apiClient, getStoredToken, setStoredToken, clearStoredToken } from "./apiClient";
import { API_ROUTES } from "./apiRoutes";

export type UserRole = "SCHOOL_ADMIN" | "TEACHER" | "PARENT" | "STUDENT";

export interface UserSession {
  userId: string;
  email: string;
  name: string;
  role: UserRole;
  token?: string;
  avatarUrl?: string;
}

export interface SessionContextType {
  session: UserSession | null;
  isLoading: boolean;
  login: (email: string, role: UserRole, password?: string) => Promise<boolean>;
  logout: () => Promise<void>;
}

const DEFAULT_SESSION: UserSession = {
  userId: "user-101",
  email: "principal@dpsdelhi.edu.in",
  name: "Dr. Rajesh Sharma",
  role: "SCHOOL_ADMIN",
};

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export const SessionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<UserSession | null>(DEFAULT_SESSION);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const hydrateSession = async () => {
      try {
        const token = await getStoredToken();
        if (token) {
          // Attempt to verify/hydrate user with backend
          const res = await apiClient(API_ROUTES.AUTH_REFRESH, { method: "POST" });
          if (res.data && res.data.user) {
            setSession({
              userId: res.data.user.id || `user-${Date.now()}`,
              email: res.data.user.email,
              name: res.data.user.name || "Campus User",
              role: res.data.user.role || "SCHOOL_ADMIN",
              token,
            });
          }
        }
      } catch (err) {
        console.warn("Session hydration fallback to local state", err);
      } finally {
        setIsLoading(false);
      }
    };

    hydrateSession();
  }, []);

  const login = async (email: string, role: UserRole, password?: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      if (password) {
        const res = await apiClient(API_ROUTES.AUTH_LOGIN, {
          method: "POST",
          body: JSON.stringify({ email, password, role }),
        });

        if (res.data && res.data.access_token) {
          await setStoredToken(res.data.access_token);
          const user = res.data.user || {};
          setSession({
            userId: user.id || `user-${Date.now()}`,
            email: email,
            name: user.name || email.split("@")[0],
            role: role,
            token: res.data.access_token,
          });
          setIsLoading(false);
          return true;
        }
      }

      // Fallback/Demo session mode
      const namePart = email.split("@")[0].replace(/[._]/g, " ");
      const formattedName = namePart ? namePart.charAt(0).toUpperCase() + namePart.slice(1) : "Campus User";
      const dummyToken = `demo_jwt_${Date.now()}`;
      await setStoredToken(dummyToken);

      setSession({
        userId: `user-${Date.now()}`,
        email,
        name: formattedName,
        role,
        token: dummyToken,
      });
      setIsLoading(false);
      return true;
    } catch (err) {
      console.error("Login failed", err);
      setIsLoading(false);
      return false;
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
