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
      
      console.log('useFantasyData: Starting to fetch data...');
      const response = await fantasyApiService.fetchPlayers(forceRefresh);
      console.log('useFantasyData: Received response with', response.players.length, 'players');
      
      const defPlayers = response.players.filter(p => p.position === 'DEF');
      console.log('useFantasyData: DEF players in response:', defPlayers.length, defPlayers.map(p => p.name));
      
      setPlayers(response.players);
      setLastUpdated(response.lastUpdated);
      
      console.log('useFantasyData: State updated with players');
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