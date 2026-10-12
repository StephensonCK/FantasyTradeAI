import { LeagueSettings, ValuedPlayer, ValuedPosition } from '../types/value';

const BASE_URL = 'https://api.fantasycalc.com/values/current';
const CACHE_TTL_MS = 1000 * 60 * 60 * 6; // values move slowly; 6 hours

export const DEFAULT_SETTINGS: LeagueSettings = { ppr: 1, numQbs: 1, numTeams: 12 };

const POSITIONS: ReadonlySet<string> = new Set(['QB', 'RB', 'WR', 'TE']);

interface RawEntry {
  player: {
    id: number;
    name: string;
    sleeperId?: string | null;
    position: string;
    maybeAge?: number | null;
    maybeTeam?: string | null;
  };
  value: number;
  overallRank: number;
  positionRank: number;
  trend30Day?: number;
  maybeTier?: number | null;
}

export interface ValuesSnapshot {
  players: ValuedPlayer[];
  fetchedAt: number;
}

export const buildUrl = (s: LeagueSettings): string => {
  const params = new URLSearchParams({
    isDynasty: 'false', // redraft only
    numQbs: String(s.numQbs),
    numTeams: String(s.numTeams),
    ppr: String(s.ppr)
  });
  return `${BASE_URL}?${params}`;
};

/** Convert the API payload into our model, dropping draft picks and anything but QB/RB/WR/TE. */
export const parseValues = (raw: unknown): ValuedPlayer[] => {
  if (!Array.isArray(raw)) {
    throw new Error('Unexpected FantasyCalc response shape');
  }
  const players: ValuedPlayer[] = [];
  for (const entry of raw as RawEntry[]) {
    const p = entry?.player;
    if (!p || !POSITIONS.has(p.position) || typeof entry.value !== 'number') continue;
    players.push({
      id: p.sleeperId ? String(p.sleeperId) : `fc_${p.id}`,
      name: p.name,
      position: p.position as ValuedPosition,
      team: p.maybeTeam ?? null,
      age: p.maybeAge ?? null,
      value: entry.value,
      overallRank: entry.overallRank,
      positionRank: entry.positionRank,
      tier: entry.maybeTier ?? null,
      trend30Day: entry.trend30Day ?? 0
    });
  }
  return players.sort((a, b) => b.value - a.value);
};

const cacheKey = (s: LeagueSettings) => `fantasyCalc:${s.ppr}:${s.numQbs}:${s.numTeams}`;

interface Deps {
  fetchImpl?: typeof fetch;
  storage?: Pick<Storage, 'getItem' | 'setItem'> | null;
  now?: () => number;
}

const defaultStorage = (): Deps['storage'] => {
  try {
    return typeof localStorage === 'undefined' ? null : localStorage;
  } catch {
    return null;
  }
};

const readCache = (storage: Deps['storage'], key: string): ValuesSnapshot | null => {
  try {
    const raw = storage?.getItem(key);
    return raw ? (JSON.parse(raw) as ValuesSnapshot) : null;
  } catch {
    return null;
  }
};

/**
 * Fetch market values for the given league settings. A fresh cache is returned
 * as-is; if the network fails, a stale cache is returned rather than an error.
 */
export const fetchValues = async (
  settings: LeagueSettings = DEFAULT_SETTINGS,
  { fetchImpl = fetch, storage = defaultStorage(), now = Date.now }: Deps = {}
): Promise<ValuesSnapshot> => {
  const key = cacheKey(settings);
  const cached = readCache(storage, key);
  if (cached && now() - cached.fetchedAt < CACHE_TTL_MS) return cached;

  try {
    const res = await fetchImpl(buildUrl(settings));
    if (!res.ok) throw new Error(`FantasyCalc responded ${res.status}`);
    const snapshot: ValuesSnapshot = {
      players: parseValues(await res.json()),
      fetchedAt: now()
    };
    try {
      storage?.setItem(key, JSON.stringify(snapshot));
    } catch {
      // quota or private mode: caching is best-effort
    }
    return snapshot;
  } catch (err) {
    if (cached) return cached;
    throw err instanceof Error ? err : new Error('Failed to fetch player values');
  }
};
