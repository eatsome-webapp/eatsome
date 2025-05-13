'use client';

import { useState, useCallback } from 'react';
import { formatErrorMessage } from '../utils/error-handling';

interface ApiCallState<T> {
  data: T | null;
  isLoading: boolean;
  error: string | null;
}

interface UseApiCallProps<T> {
  initialData?: T | null;
  onSuccess?: (data: T) => void;
  onError?: (error: unknown) => void;
}

export function useApiCall<T>({
  initialData = null,
  onSuccess,
  onError
}: UseApiCallProps<T> = {}) {
  const [state, setState] = useState<ApiCallState<T>>({
    data: initialData,
    isLoading: false,
    error: null
  });

  const execute = useCallback(
    async (apiFunction: () => Promise<T>) => {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      
      try {
        const result = await apiFunction();
        setState({ data: result, isLoading: false, error: null });
        onSuccess?.(result);
        return result;
      } catch (error) {
        const errorMessage = formatErrorMessage(error);
        setState({ data: null, isLoading: false, error: errorMessage });
        onError?.(error);
        throw error;
      }
    },
    [onSuccess, onError]
  );

  const reset = useCallback(() => {
    setState({ data: initialData, isLoading: false, error: null });
  }, [initialData]);

  return {
    ...state,
    execute,
    reset
  };
}

// Example usage:
/*
const {
  data: restaurants,
  isLoading,
  error,
  execute
} = useApiCall<Restaurant[]>({
  onSuccess: (data) => console.log('Loaded restaurants:', data.length),
  onError: (err) => console.error('Failed to load restaurants', err)
});

// Load data
useEffect(() => {
  execute(() => RestaurantRepository.getMyRestaurants());
}, [execute]);
*/ 