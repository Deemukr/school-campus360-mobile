import React, { createContext, useContext, useState, useEffect } from "react";
import { Plan, effectiveEntitlements } from "./entitlements";
import { getStoredTenantKey, setStoredTenantKey, apiClient } from "./apiClient";
import { API_ROUTES } from "./apiRoutes";

export interface TenantBranding {
  tenantKey: string;
  displayName: string;
  primaryColor: string;
  accentColor: string;
  logoUrl?: string;
}

export interface TenantContextType {
  tenant: TenantBranding;
  plan: Plan;
  entitlements: string[];
  setTenantKey: (key: string) => void;
  setPlan: (plan: Plan) => void;
  refreshBranches: () => Promise<void>;
}

const PRESET_TENANTS: Record<string, { displayName: string; primaryColor: string; accentColor: string }> = {
  "dps-delhi": { displayName: "DPS Delhi Public School", primaryColor: "#7C3AED", accentColor: "#F97316" },
  "st-marys": { displayName: "St. Mary's International", primaryColor: "#7C3AED", accentColor: "#EC4899" },
  "greenwood": { displayName: "Greenwood High Campus", primaryColor: "#059669", accentColor: "#F59E0B" },
  "oakridge": { displayName: "Oakridge International", primaryColor: "#DC2626", accentColor: "#2563EB" },
};

const TenantContext = createContext<TenantContextType | undefined>(undefined);

export const TenantProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tenantKey, setTenantKeyInternal] = useState<string>("dps-delhi");
  const [plan, setPlanInternal] = useState<Plan>("ENTERPRISE");
  const [dynamicTenants, setDynamicTenants] = useState<Record<string, { displayName: string; primaryColor: string; accentColor: string }>>({});

  useEffect(() => {
    const hydrateTenant = async () => {
      const stored = await getStoredTenantKey();
      if (stored) {
        setTenantKeyInternal(stored);
      }
      await refreshBranches();
    };
    hydrateTenant();
  }, []);

  const refreshBranches = async () => {
    try {
      const res = await apiClient(API_ROUTES.BRANCHES);
      if (res.data && Array.isArray(res.data)) {
        const branchMap: Record<string, { displayName: string; primaryColor: string; accentColor: string }> = {};
        res.data.forEach((b: any) => {
          const key = b.slug || b.id || b.name.toLowerCase().replace(/[^a-z0-9]/g, "-");
          branchMap[key] = {
            displayName: b.name || b.displayName,
            primaryColor: b.primary_color || "#7C3AED",
            accentColor: b.accent_color || "#F97316",
          };
        });
        setDynamicTenants(branchMap);
      }
    } catch (err) {
      console.warn("Failed to fetch branches from backend, fallback to presets", err);
    }
  };

  const allTenants = { ...PRESET_TENANTS, ...dynamicTenants };
  const preset = allTenants[tenantKey] || {
    displayName: tenantKey.toUpperCase().replace(/-/g, " "),
    primaryColor: "#7C3AED",
    accentColor: "#F97316",
  };

  const tenant: TenantBranding = {
    tenantKey,
    displayName: preset.displayName,
    primaryColor: preset.primaryColor,
    accentColor: preset.accentColor,
  };

  const entitlements = effectiveEntitlements(plan);

  const setTenantKey = (key: string) => {
    const cleanKey = key.toLowerCase().trim();
    setTenantKeyInternal(cleanKey);
    setStoredTenantKey(cleanKey);
  };

  const setPlan = (p: Plan) => {
    setPlanInternal(p);
  };

  return React.createElement(
    TenantContext.Provider,
    { value: { tenant, plan, entitlements, setTenantKey, setPlan, refreshBranches } },
    children
  );
};

export const useTenant = () => {
  const context = useContext(TenantContext);
  if (!context) {
    throw new Error("useTenant must be used within a TenantProvider");
  }
  return context;
};

export { PRESET_TENANTS };
