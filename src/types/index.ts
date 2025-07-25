export interface Player {
  id: string;
  name: string;
  position: 'QB' | 'RB' | 'WR' | 'TE' | 'K' | 'DEF';
  team: string;
  stats: PlayerStats;
  projections: PlayerProjections;
  injuryStatus: 'healthy' | 'questionable' | 'doubtful' | 'out' | 'ir';
  byeWeek: number;
  imageUrl?: string;
}

export interface PlayerStats {
  gamesPlayed: number;
  fantasyPoints: {
    standard: number;
    halfPpr: number;
    ppr: number;
  };
  avgPointsPerGame: {
    standard: number;
    halfPpr: number;
    ppr: number;
  };
  positionRank: number;
  trend: 'up' | 'down' | 'stable';
}

export interface PlayerProjections {
  remainingGames: number;
  projectedPoints: {
    standard: number;
    halfPpr: number;
    ppr: number;
  };
  confidenceScore: number;
}

export interface Trade {
  id: string;
  user1Players: Player[];
  user2Players: Player[];
  timestamp: Date;
}

export interface TradeAnalysis {
  fairnessScore: number;
  grade: 'A' | 'B' | 'C' | 'D' | 'F';
  winner: 'user1' | 'user2' | 'even';
  recommendations: string[];
  breakdown: {
    user1Value: number;
    user2Value: number;
    difference: number;
  };
  confidence: number;
}