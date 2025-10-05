import { useState, useEffect } from 'react';
import { api } from '@/services/api';

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

  const fetchData = async () => {
    setState((prev) => ({ ...prev, loading: true, error: null }));
    try {
      const data = await api.get<T>(endpoint);
      setState({ data, loading: false, error: null });
    } catch (error) {
      setState({
        data: null,
        loading: false,
        error: error instanceof Error ? error : new Error('Unknown error'),
      });
    }
  };

  useEffect(() => {
    if (immediate) {
      fetchData();
    }
  }, [endpoint, immediate]);

  return { ...state, refetch: fetchData };
}
