import { useState, useEffect } from 'react';
import { fetchDashboard, fetchCallStats } from '../api';
import type { DashboardData, CallStats } from '../api';
import { useUser } from '../context/UserContext';

interface UseDashboardReturn {
  dashboardData: DashboardData | null;
  callStats: CallStats | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

export const useDashboard = (): UseDashboardReturn => {
  const { userId } = useUser();
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [callStats, setCallStats] = useState<CallStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tick, setTick] = useState(0);

  const refetch = () => setTick((t) => t + 1);

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);
    setError(null);

    Promise.all([fetchDashboard(userId), fetchCallStats(userId)])
      .then(([dash, stats]) => {
        if (isMounted) {
          setDashboardData(dash);
          setCallStats(stats);
        }
      })
      .catch(() => {
        if (isMounted) setError('Failed to load dashboard data. Please try again.');
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [userId, tick]);

  return { dashboardData, callStats, isLoading, error, refetch };
};
