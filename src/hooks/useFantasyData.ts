import { useState, useEffect } from 'react';
import { Player } from '../types';
import { fantasyApiService } from '../services/fantasyApi';

interface UseFantasyDataReturn {
  players: Player[];
  loading: boolean;
  error: string | null;
  lastUpdated: Date | null;
  refetch: () => Promise<void>;
  clearCache: () => void;
}

export const useFantasyData = (): UseFantasyDataReturn => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchData = async (forceRefresh = false) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fantasyApiService.fetchPlayers(forceRefresh);
      setPlayers(response.players);
      setLastUpdated(response.lastUpdated);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch player data');
      console.error('Error fetching fantasy data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const refetch = async () => {
    await fetchData(true);
  };

  const clearCache = () => {
    fantasyApiService.clearCache();
    fetchData(true);
  };

  return {
    players,
    loading,
    error,
    lastUpdated,
    refetch,
    clearCache
  };
};