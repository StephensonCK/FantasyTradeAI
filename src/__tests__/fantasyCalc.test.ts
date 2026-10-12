import { describe, expect, it } from 'vitest';
import { buildUrl, fetchValues, parseValues } from '../services/fantasyCalc';

const entry = (id: number, name: string, position: string, value: number, sleeperId: string | null = String(id)) => ({
  player: { id, name, position, sleeperId, maybeTeam: 'DET', maybeAge: 24.5 },
  value, overallRank: 1, positionRank: 1, trend30Day: 10, maybeTier: 1
});

const settings = { ppr: 0.5 as const, numQbs: 2 as const, numTeams: 10 };

const memoryStorage = () => {
  const m = new Map<string, string>();
  return { getItem: (k: string) => m.get(k) ?? null, setItem: (k: string, v: string) => void m.set(k, v) };
};

describe('parseValues', () => {
  it('drops picks and unknown positions, sorts by value, falls back to fc id', () => {
    const out = parseValues([
      entry(1, '2027 1st', 'PICK', 9000),
      entry(2, 'Low', 'WR', 100),
      entry(3, 'High', 'RB', 9000, null)
    ]);
    expect(out.map(p => p.name)).toEqual(['High', 'Low']);
    expect(out[0].id).toBe('fc_3');
    expect(out[1].id).toBe('2');
  });

  it('rejects non-array payloads', () => {
    expect(() => parseValues({ error: true })).toThrow();
  });
});

describe('buildUrl', () => {
  it('requests redraft values with league settings', () => {
    const url = buildUrl(settings);
    expect(url).toContain('isDynasty=false');
    expect(url).toContain('numQbs=2');
    expect(url).toContain('numTeams=10');
    expect(url).toContain('ppr=0.5');
  });
});

describe('fetchValues', () => {
  const ok = (body: unknown) =>
    (async () => ({ ok: true, status: 200, json: async () => body })) as unknown as typeof fetch;
  const down = (async () => { throw new Error('network'); }) as unknown as typeof fetch;

  it('serves a fresh cache without hitting the network', async () => {
    const storage = memoryStorage();
    await fetchValues(settings, { fetchImpl: ok([entry(1, 'A', 'QB', 10)]), storage, now: () => 1000 });
    const second = await fetchValues(settings, { fetchImpl: down, storage, now: () => 2000 });
    expect(second.players).toHaveLength(1);
  });

  it('falls back to a stale cache when the network fails', async () => {
    const storage = memoryStorage();
    await fetchValues(settings, { fetchImpl: ok([entry(1, 'A', 'QB', 10)]), storage, now: () => 0 });
    const stale = await fetchValues(settings, { fetchImpl: down, storage, now: () => 1e12 });
    expect(stale.players[0].name).toBe('A');
  });

  it('throws when the network fails and nothing is cached', async () => {
    await expect(fetchValues(settings, { fetchImpl: down, storage: memoryStorage() })).rejects.toThrow('network');
  });
});
