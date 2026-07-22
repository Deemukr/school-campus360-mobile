import { useState, useEffect, useCallback } from "react";
import { apiClient, ApiResponse } from "../apiClient";

export interface UseApiResult<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useQuery<T>(endpoint: string, initialData: T | null = null): UseApiResult<T> {
  const [data, setData] = useState<T | null>(initialData);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    const res: ApiResponse<T> = await apiClient<T>(endpoint);
    if (res.error) {
      setError(res.error);
    } else {
      setData(res.data);
    }
    setLoading(false);
  }, [endpoint]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
}

export function useMutation<TInput = any, TOutput = any>(
  endpoint: string,
  method: "POST" | "PUT" | "PATCH" | "DELETE" = "POST"
) {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const mutate = async (payload?: TInput): Promise<ApiResponse<TOutput>> => {
    setLoading(true);
    setError(null);
    const res = await apiClient<TOutput>(endpoint, {
      method,
      body: payload ? JSON.stringify(payload) : undefined,
    });
    if (res.error) {
      setError(res.error);
    }
    setLoading(false);
    return res;
  };

  return { mutate, loading, error };
}
