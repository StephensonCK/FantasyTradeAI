import { useCallback, useEffect, useState } from 'react';
import { fetchValues, ValuesSnapshot } from '../services/fantasyCalc';
import { LeagueSettings } from '../types/value';

interface State {
  snapshot: ValuesSnapshot | null;
  loading: boolean;
  error: string | null;
}

/**
 * Loads market values for the given settings. The previous snapshot stays
 * available while a new one loads so the UI doesn't flash empty.
 */
export const useValues = (settings: LeagueSettings) => {
  const [state, setState] = useState<State>({ snapshot: null, loading: true, error: null });
  const [attempt, setAttempt] = useState(0);
  const { ppr, numQbs, numTeams } = settings;

  useEffect(() => {
    let cancelled = false;
    setState(s => ({ ...s, loading: true, error: null }));
    fetchValues({ ppr, numQbs, numTeams })
      .then(snapshot => {
        if (!cancelled) setState({ snapshot, loading: false, error: null });
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        const message = err instanceof Error ? err.message : 'Could not load player values';
        setState(s => ({ ...s, loading: false, error: message }));
      });
    return () => {
      cancelled = true;
    };
  }, [ppr, numQbs, numTeams, attempt]);

  const retry = useCallback(() => setAttempt(n => n + 1), []);

  return { ...state, retry };
};
