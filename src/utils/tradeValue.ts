import { TradeEvaluation, TradeSide, ValuedPlayer } from '../types/value';

/**
 * Heuristic, not fitted to data: in redraft only a limited number of players
 * start, so each additional asset on a side is worth less than its market
 * value. Assets are sorted by value; the best counts fully and each next one
 * loses `perSlot` more, down to `floor`.
 */
export const DEPTH_DISCOUNT = { perSlot: 0.1, floor: 0.5 };

/** Sides closer than this fraction of the larger total are called even. */
export const EVEN_THRESHOLD = 0.05;

const sideValue = (assets: ValuedPlayer[]): TradeSide => {
  const sorted = assets.map(a => a.value).sort((a, b) => b - a);
  const { perSlot, floor } = DEPTH_DISCOUNT;
  let rawValue = 0;
  let adjustedValue = 0;
  sorted.forEach((v, i) => {
    rawValue += v;
    adjustedValue += v * Math.max(floor, 1 - perSlot * i);
  });
  return { rawValue, adjustedValue };
};

const gradeFor = (fairness: number): TradeEvaluation['grade'] => {
  if (fairness >= 90) return 'A';
  if (fairness >= 80) return 'B';
  if (fairness >= 70) return 'C';
  if (fairness >= 60) return 'D';
  return 'F';
};

/** Compare what side A receives with what side B receives. */
export const evaluateTrade = (
  sideAAssets: ValuedPlayer[],
  sideBAssets: ValuedPlayer[]
): TradeEvaluation => {
  const sideA = sideValue(sideAAssets);
  const sideB = sideValue(sideBAssets);
  const gap = sideA.adjustedValue - sideB.adjustedValue;
  const larger = Math.max(sideA.adjustedValue, sideB.adjustedValue);
  const smaller = Math.min(sideA.adjustedValue, sideB.adjustedValue);
  const fairness = larger === 0 ? 100 : (smaller / larger) * 100;

  let favored: TradeEvaluation['favored'] = 'even';
  if (larger > 0 && Math.abs(gap) / larger > EVEN_THRESHOLD) {
    favored = gap > 0 ? 'A' : 'B';
  }

  return { sideA, sideB, gap, favored, fairness, grade: gradeFor(fairness) };
};

/**
 * Players from `pool` that, added to one side, bring the trade closest to
 * even. Evaluates each candidate through `evaluateTrade`, so the depth
 * discount is accounted for. Players already in the trade are skipped.
 */
export const suggestAdditions = (
  sideAAssets: ValuedPlayer[],
  sideBAssets: ValuedPlayer[],
  addTo: 'A' | 'B',
  pool: ValuedPlayer[],
  limit = 5
): ValuedPlayer[] => {
  const inTrade = new Set([...sideAAssets, ...sideBAssets].map(p => p.id));
  return pool
    .filter(p => !inTrade.has(p.id))
    .map(player => {
      const { gap } =
        addTo === 'A'
          ? evaluateTrade([...sideAAssets, player], sideBAssets)
          : evaluateTrade(sideAAssets, [...sideBAssets, player]);
      return { player, remaining: Math.abs(gap) };
    })
    .sort((x, y) => x.remaining - y.remaining)
    .slice(0, limit)
    .map(x => x.player);
};
