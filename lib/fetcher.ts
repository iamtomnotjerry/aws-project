export class TimeoutError extends Error {
  constructor(message = 'Request timed out') {
    super(message);
    this.name = 'TimeoutError';
  }
}

interface FetchOptions extends RequestInit {
  timeoutMs?: number;
}

export const fetcher = async <T>(url: string, options: FetchOptions = {}): Promise<T> => {
  const { timeoutMs = 10000, signal, ...customConfig } = options;
  
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  if (signal) {
    signal.addEventListener('abort', () => controller.abort());
  }

  const config: RequestInit = {
    ...customConfig,
    headers: {
      'Content-Type': 'application/json',
      ...customConfig.headers,
    },
    signal: controller.signal,
  };

  try {
    const response = await fetch(url, config);
    if (!response.ok) {
      let errorMessage = 'An error occurred while fetching the data.';
      try {
        const errorData = await response.json();
        errorMessage = errorData.error || errorMessage;
      } catch {
        // Fallback for non-JSON errors
      }
      throw new Error(errorMessage);
    }
    
    const data = await response.json();
    if (data && typeof data === 'object' && 'success' in data && 'data' in data) {
      return data.data;
    }
    return data;
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      throw new TimeoutError();
    }
    throw error;
  } finally {
    clearTimeout(timeoutId);
  }
};
