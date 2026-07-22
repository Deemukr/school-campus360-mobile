import * as SecureStore from "expo-secure-store";
import { API_BASE_URL } from "./apiRoutes";

export interface ApiResponse<T = any> {
  data: T | null;
  error: string | null;
  status: number;
}

const TOKEN_KEY = "sc360_auth_token";
const TENANT_KEY = "sc360_tenant_key";

export const getStoredToken = async (): Promise<string | null> => {
  try {
    return await SecureStore.getItemAsync(TOKEN_KEY);
  } catch {
    return null;
  }
};

export const setStoredToken = async (token: string): Promise<void> => {
  try {
    await SecureStore.setItemAsync(TOKEN_KEY, token);
  } catch (err) {
    console.error("Failed to store token in SecureStore", err);
  }
};

export const clearStoredToken = async (): Promise<void> => {
  try {
    await SecureStore.deleteItemAsync(TOKEN_KEY);
  } catch (err) {
    console.error("Failed to clear token from SecureStore", err);
  }
};

export const getStoredTenantKey = async (): Promise<string | null> => {
  try {
    return await SecureStore.getItemAsync(TENANT_KEY);
  } catch {
    return null;
  }
};

export const setStoredTenantKey = async (tenantKey: string): Promise<void> => {
  try {
    await SecureStore.setItemAsync(TENANT_KEY, tenantKey);
  } catch (err) {
    console.error("Failed to store tenant key", err);
  }
};

export async function apiClient<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const url = endpoint.startsWith("http") ? endpoint : `${API_BASE_URL}${endpoint}`;
  const token = await getStoredToken();
  const tenantKey = await getStoredTenantKey();

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Accept: "application/json",
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  if (tenantKey) {
    headers["X-Tenant-Key"] = tenantKey;
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 12000);

    const response = await fetch(url, {
      ...options,
      headers,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (response.status === 401) {
      await clearStoredToken();
      return {
        data: null,
        error: "Session expired. Please log in again.",
        status: 401,
      };
    }

    const contentType = response.headers.get("content-type");
    let payload: any = null;
    if (contentType && contentType.includes("application/json")) {
      payload = await response.json();
    } else {
      payload = await response.text();
    }

    if (!response.ok) {
      const errorMessage =
        payload?.detail || payload?.message || `HTTP ${response.status}: ${response.statusText}`;
      return {
        data: null,
        error: typeof errorMessage === "string" ? errorMessage : JSON.stringify(errorMessage),
        status: response.status,
      };
    }

    return {
      data: payload as T,
      error: null,
      status: response.status,
    };
  } catch (err: any) {
    if (err.name === "AbortError") {
      return {
        data: null,
        error: "Request timed out. Please check network connection.",
        status: 408,
      };
    }
    return {
      data: null,
      error: err.message || "Network request failed",
      status: 0,
    };
  }
}
