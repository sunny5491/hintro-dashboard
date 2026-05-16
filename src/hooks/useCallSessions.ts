import { useState, useEffect } from 'react';
import { fetchCallHistory } from '../api';
import type { CallHistoryResponse } from '../api';
import { useUser } from '../context/UserContext';

interface UseCallSessionsReturn {
  data: CallHistoryResponse | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

export const useCallSessions = (limit = 10): UseCallSessionsReturn => {
  const { userId } = useUser();
  const [data, setData] = useState<CallHistoryResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tick, setTick] = useState(0);

  const refetch = () => setTick((t) => t + 1);

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);
    setError(null);

    fetchCallHistory(userId, limit)
      .then((res) => {
        if (isMounted) setData(res);
      })
      .catch(() => {
        if (isMounted) setError('Failed to load call history. Please try again.');
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [userId, limit, tick]);

  return { data, isLoading, error, refetch };
};
