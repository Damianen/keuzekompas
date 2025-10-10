import { useState, useEffect, useCallback } from 'react';
import type { ApiResponse } from '@/types';

interface UseApiState<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
}

export function useApi<T>(endpoint: string, immediate = true) {
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    loading: immediate,
    error: null,
  });

  const fetchData = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true, error: null }));
    try {
      const response = await fetch(endpoint);
      const apiResponse: ApiResponse<T> = await response.json();

      if (!response.ok) {
        throw new Error(apiResponse.error?.message || 'Request failed');
      }

      setState({ data: apiResponse.data, loading: false, error: null });
    } catch (error) {
      setState({
        data: null,
        loading: false,
        error: error instanceof Error ? error : new Error('Unknown error'),
      });
    }
  }, [endpoint]);

  useEffect(() => {
    if (immediate) {
      fetchData();
    }
  }, [endpoint, immediate, fetchData]);

  return { ...state, refetch: fetchData };
}
