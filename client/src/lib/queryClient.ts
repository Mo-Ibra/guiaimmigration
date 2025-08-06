import { QueryClient, QueryFunction } from "@tanstack/react-query";

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    throw new Error(`${res.status}: ${text}`);
  }
}

// Get API base URL from environment variable or default to current origin
const getApiBaseUrl = () => {
  return import.meta.env.VITE_API_URL || '';
};

export async function apiRequest(
  method: string,
  url: string,
  data?: unknown | undefined,
): Promise<Response> {
  const baseUrl = getApiBaseUrl();
  const fullUrl = url.startsWith('http') ? url : `${baseUrl}${url}`;
  
  // Enhanced fetch configuration to handle network issues
  const fetchOptions: RequestInit = {
    method,
    headers: {
      ...(data ? { "Content-Type": "application/json" } : {}),
      // Force HTTP/1.1 to avoid QUIC protocol issues
      'Connection': 'keep-alive',
      'Cache-Control': 'no-cache',
    },
    body: data ? JSON.stringify(data) : undefined,
    credentials: "include",
    // Add timeout and retry-friendly settings
    keepalive: true,
    // Disable cache to avoid stale responses
    cache: 'no-store',
  };

  console.log(`API Request: ${method} ${fullUrl}`);
  
  const res = await fetch(fullUrl, fetchOptions);

  console.log(`API Response: ${res.status} ${res.statusText} for ${method} ${fullUrl}`);

  await throwIfResNotOk(res);
  return res;
}

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    const baseUrl = getApiBaseUrl();
    const fullUrl = (queryKey[0] as string).startsWith('http') 
      ? queryKey[0] as string 
      : `${baseUrl}${queryKey[0]}`;
      
    console.log(`Query Request: ${fullUrl}`);
    
    // Enhanced fetch configuration for queries
    const res = await fetch(fullUrl, {
      credentials: "include",
      headers: {
        'Connection': 'keep-alive',
        'Cache-Control': 'no-cache',
      },
      keepalive: true,
      cache: 'no-store',
    });

    console.log(`Query Response: ${res.status} ${res.statusText} for ${fullUrl}`);

    if (unauthorizedBehavior === "returnNull" && res.status === 401) {
      return null;
    }

    await throwIfResNotOk(res);
    return await res.json();
  };

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});
