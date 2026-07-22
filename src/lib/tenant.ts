import React, { createContext, useContext, useState, useEffect } from "react";
import { Plan, effectiveEntitlements } from "./entitlements";
import { getStoredTenantKey, setStoredTenantKey, apiClient } from "./apiClient";
import { API_ROUTES } from "./apiRoutes";

export interface TenantBranding {
  tenantKey: string;
  tenantId: string;
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

export const PRESET_TENANTS: Record<
  string,
  { tenantId: string; displayName: string; primaryColor: string; accentColor: string; plan: Plan }
> = {
  "dps-delhi": {
    tenantId: "d1d1d1d1-1111-1111-1111-111111111111",
    displayName: "DPS Delhi Public School",
    primaryColor: "#7C3AED",
    accentColor: "#F97316",
    plan: "ENTERPRISE",
  },
  greenwood: {
    tenantId: "e2e2e2e2-2222-2222-2222-222222222222",
    displayName: "Greenwood High Campus",
    primaryColor: "#059669",
    accentColor: "#F59E0B",
    plan: "ESSENTIAL",
  },
  "st-marys": {
    tenantId: "33333333-3333-3333-3333-333333333333",
    displayName: "St. Mary's International",
    primaryColor: "#7C3AED",
    accentColor: "#EC4899",
    plan: "PROFESSIONAL",
  },
  oakridge: {
    tenantId: "44444444-4444-4444-4444-444444444444",
    displayName: "Oakridge International",
    primaryColor: "#DC2626",
    accentColor: "#2563EB",
    plan: "ENTERPRISE",
  },
};

const TenantContext = createContext<TenantContextType | undefined>(undefined);

export const TenantProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tenantKey, setTenantKeyInternal] = useState<string>("dps-delhi");
  const [plan, setPlanInternal] = useState<Plan>("ENTERPRISE");
  const [dynamicTenants, setDynamicTenants] = useState<
    Record<string, { tenantId: string; displayName: string; primaryColor: string; accentColor: string; plan: Plan }>
  >({});

  useEffect(() => {
    const hydrateTenant = async () => {
      const stored = await getStoredTenantKey();
      if (stored && PRESET_TENANTS[stored]) {
        setTenantKeyInternal(stored);
        setPlanInternal(PRESET_TENANTS[stored].plan);
      }
      await refreshBranches();
    };
    hydrateTenant();
  }, []);

  const refreshBranches = async () => {
    try {
      const res = await apiClient(API_ROUTES.BRANCHES);
      if (res.data && Array.isArray(res.data)) {
        const branchMap: Record<string, { tenantId: string; displayName: string; primaryColor: string; accentColor: string; plan: Plan }> = {};
        res.data.forEach((b: any) => {
          const key = b.slug || b.id || b.name.toLowerCase().replace(/[^a-z0-9]/g, "-");
          branchMap[key] = {
            tenantId: b.tenant_id || b.id || "d1d1d1d1-1111-1111-1111-111111111111",
            displayName: b.name || b.displayName,
            primaryColor: b.primary_color || "#7C3AED",
            accentColor: b.accent_color || "#F97316",
            plan: b.plan || "ENTERPRISE",
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
    tenantId: "d1d1d1d1-1111-1111-1111-111111111111",
    displayName: tenantKey.toUpperCase().replace(/-/g, " "),
    primaryColor: "#7C3AED",
    accentColor: "#F97316",
    plan: "ENTERPRISE",
  };

  const tenant: TenantBranding = {
    tenantKey,
    tenantId: preset.tenantId,
    displayName: preset.displayName,
    primaryColor: preset.primaryColor,
    accentColor: preset.accentColor,
  };

  const entitlements = effectiveEntitlements(plan);

  const setTenantKey = (key: string) => {
    const cleanKey = key.toLowerCase().trim();
    setTenantKeyInternal(cleanKey);
    setStoredTenantKey(cleanKey);

    const match = allTenants[cleanKey];
    if (match && match.plan) {
      setPlanInternal(match.plan);
    }
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
