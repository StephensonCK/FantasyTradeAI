// Market-value model (FantasyCalc, redraft)

export type ValuedPosition = 'QB' | 'RB' | 'WR' | 'TE';

/** Redraft league settings that change player values. */
export interface LeagueSettings {
  ppr: 0 | 0.5 | 1;
  numQbs: 1 | 2;
  numTeams: number;
}

export interface ValuedPlayer {
  /** Sleeper player id when FantasyCalc supplies one, otherwise `fc_<id>`. */
  id: string;
  name: string;
  position: ValuedPosition;
  team: string | null;
  age: number | null;
  /** Market trade value, roughly 1-10,000. Only comparable within one LeagueSettings. */
  value: number;
  overallRank: number;
  positionRank: number;
  tier: number | null;
  /** Change in value over the last 30 days. */
  trend30Day: number;
}

export interface TradeSide {
  rawValue: number;
  /** Value after the depth discount for multi-asset sides. */
  adjustedValue: number;
}

export interface TradeEvaluation {
  sideA: TradeSide;
  sideB: TradeSide;
  /** adjusted A minus adjusted B; positive means side A is receiving more. */
  gap: number;
  favored: 'A' | 'B' | 'even';
  /** 0-100, the smaller adjusted total as a percentage of the larger. */
  fairness: number;
  grade: 'A' | 'B' | 'C' | 'D' | 'F';
}
