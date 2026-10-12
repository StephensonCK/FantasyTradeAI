import { describe, expect, it } from 'vitest';
import { evaluateTrade, suggestAdditions } from '../utils/tradeValue';
import { ValuedPlayer } from '../types/value';

const p = (id: string, value: number, position: ValuedPlayer['position'] = 'WR'): ValuedPlayer => ({
  id, name: id, position, team: null, age: null, value,
  overallRank: 0, positionRank: 0, tier: null, trend30Day: 0
});

describe('evaluateTrade', () => {
  it('calls equal single-asset sides even with grade A', () => {
    const r = evaluateTrade([p('a', 5000)], [p('b', 5000)]);
    expect(r.favored).toBe('even');
    expect(r.fairness).toBe(100);
    expect(r.grade).toBe('A');
  });

  it('favors the side receiving the more valuable player', () => {
    const r = evaluateTrade([p('a', 8000)], [p('b', 4000)]);
    expect(r.favored).toBe('A');
    expect(r.fairness).toBe(50);
    expect(r.grade).toBe('F');
  });

  it('is symmetric when sides are swapped', () => {
    const x = [p('a', 7000), p('b', 2000)];
    const y = [p('c', 6000)];
    const r1 = evaluateTrade(x, y);
    const r2 = evaluateTrade(y, x);
    expect(r1.fairness).toBeCloseTo(r2.fairness);
    expect(r1.gap).toBeCloseTo(-r2.gap);
  });

  it('discounts depth: a star beats three pieces with the same raw total', () => {
    const r = evaluateTrade([p('star', 6000)], [p('x', 2000), p('y', 2000), p('z', 2000)]);
    expect(r.sideA.rawValue).toBe(r.sideB.rawValue);
    expect(r.favored).toBe('A');
  });

  it('handles empty sides', () => {
    expect(evaluateTrade([], []).fairness).toBe(100);
    expect(evaluateTrade([p('a', 100)], []).favored).toBe('A');
  });
});

describe('suggestAdditions', () => {
  it('picks the player that brings the sides closest to even, skipping those in the trade', () => {
    const a = [p('a', 3000)];
    const b = [p('b', 5000)];
    const pool = [p('a', 3000), p('b', 5000), p('x', 2000), p('y', 1000), p('z', 4000)];
    // Adding x to A: 3000 + 2000 * 0.9 = 4800, gap 200 (closest)
    const out = suggestAdditions(a, b, 'A', pool, 2);
    expect(out[0].id).toBe('x');
    expect(out.map(q => q.id)).not.toContain('a');
    expect(out.map(q => q.id)).not.toContain('b');
  });

  it('can add to side B', () => {
    const out = suggestAdditions([p('a', 5000)], [p('b', 3000)], 'B', [p('x', 2000), p('y', 500)], 1);
    expect(out[0].id).toBe('x');
  });
});
