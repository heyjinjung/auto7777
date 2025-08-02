import { useState, useCallback } from "react";

interface ApiOptions<T> {
  url: string;
  method?: "GET" | "POST" | "PUT" | "DELETE";
  body?: T;
  headers?: Record<string, string>;
}

export function useApi() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [data, setData] = useState<any>(null);

  const request = useCallback(
    async <T, R = any>({ url, method = "GET", body, headers = {} }: ApiOptions<T>) => {
      setLoading(true);
      setError(null);
      
      try {
        const options: RequestInit = {
          method,
          headers: {
            "Content-Type": "application/json",
            ...headers,
          },
        };

        if (body && method !== "GET") {
          options.body = JSON.stringify(body);
        }

        const response = await fetch(url, options);
        
        if (!response.ok) {
          throw new Error(`API error: ${response.status}`);
        }
        
        const result: R = await response.json();
        setData(result);
        return result;
      } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err));
        setError(error);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // Convenience methods for common HTTP methods
  const get = useCallback(<R = any>(url: string, headers = {}) => 
    request<null, R>({ url, method: "GET", headers }), [request]);

  const post = useCallback(<T, R = any>(url: string, body: T, headers = {}) => 
    request<T, R>({ url, method: "POST", body, headers }), [request]);

  const put = useCallback(<T, R = any>(url: string, body: T, headers = {}) => 
    request<T, R>({ url, method: "PUT", body, headers }), [request]);

  const del = useCallback(<R = any>(url: string, headers = {}) => 
    request<null, R>({ url, method: "DELETE", headers }), [request]);

  return { request, get, post, put, del, data, loading, error };
}
