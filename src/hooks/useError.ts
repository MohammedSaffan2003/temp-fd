import { useState, useCallback } from 'react';

export interface ErrorState {
  message: string;
  code?: string;
  timestamp: number;
}

export const useError = () => {
  const [error, setError] = useState<ErrorState | null>(null);

  const handleError = useCallback((message: string, code?: string) => {
    setError({
      message,
      code,
      timestamp: Date.now()
    });
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    error,
    handleError,
    clearError
  };
};

export default useError;