import axios from 'axios';
import { Player } from '../types';

// Using Sleeper API as it's free and reliable
const SLEEPER_BASE_URL = 'https://api.sleeper.app/v1';

// NFL player data endpoint
const NFL_PLAYERS_URL = `${SLEEPER_BASE_URL}/players/nfl`;

// Position mapping for Sleeper API
const POSITION_MAP: { [key: string]: Player['position'] } = {
  'QB': 'QB',
  'RB': 'RB', 
  'WR': 'WR',
  'TE': 'TE',
  'K': 'K',
  'DEF': 'DEF'
};

// Team mapping for common abbreviations
const TEAM_MAP: { [key: string]: string } = {
  'ARI': 'ARI', 'ATL': 'ATL', 'BAL': 'BAL', 'BUF': 'BUF',
  'CAR': 'CAR', 'CHI': 'CHI', 'CIN': 'CIN', 'CLE': 'CLE',
  'DAL': 'DAL', 'DEN': 'DEN', 'DET': 'DET', 'GB': 'GB',
  'HOU': 'HOU', 'IND': 'IND', 'JAX': 'JAX', 'KC': 'KC',
  'LV': 'LV', 'LAC': 'LAC', 'LAR': 'LAR', 'MIA': 'MIA',
  'MIN': 'MIN', 'NE': 'NE', 'NO': 'NO', 'NYG': 'NYG',
  'NYJ': 'NYJ', 'PHI': 'PHI', 'PIT': 'PIT', 'SF': 'SF',
  'SEA': 'SEA', 'TB': 'TB', 'TEN': 'TEN', 'WAS': 'WAS'
};

interface SleeperPlayer {
  player_id: string;
  first_name: string;
  last_name: string;
  full_name: string;
  position: string;
  team: string;
  age: number;
  injury_status: string;
  fantasy_positions: string[];
  years_exp: number;
  height: string;
  weight: string;
  college: string;
  active: boolean;
  status: string;
}

interface FantasyApiResponse {
  players: Player[];
  lastUpdated: Date;
}


// Generate realistic fantasy stats based on position and experience
const generateRealisticStats = (player: SleeperPlayer, position: string): {
  stats: Player['stats'];
  projections: Player['projections'];
} => {
  const isRookie = player.years_exp === 0;
  const isVeteran = player.years_exp > 5;
  const isActive = player.active && player.status === 'Active';
  
  // Base points by position with experience modifiers
  let basePoints = 0;
  switch (position) {
    case 'QB':
      basePoints = isRookie ? 180 : isVeteran ? 280 : 240;
      break;
    case 'RB':
      basePoints = isRookie ? 120 : isVeteran ? 220 : 180;
      break;
    case 'WR':
      basePoints = isRookie ? 100 : isVeteran ? 200 : 160;
      break;
    case 'TE':
      basePoints = isRookie ? 80 : isVeteran ? 160 : 120;
      break;
    case 'K':
      basePoints = 120;
      break;
    case 'DEF':
      basePoints = 140;
      break;
    default:
      basePoints = 100;
  }

  // Reduce points for inactive players
  if (!isActive) {
    basePoints *= 0.3;
  }

  // Add some variance
  const variance = 0.7 + (Math.random() * 0.6); // 0.7-1.3 multiplier
  const standardPoints = basePoints * variance;
  
  // PPR bonuses for skill positions
  const pprMultiplier = ['RB', 'WR', 'TE'].includes(position) ? 1.25 : 1.0;
  const halfPprPoints = standardPoints * (1 + (pprMultiplier - 1) * 0.5);
  const pprPoints = standardPoints * pprMultiplier;

  // Since it's preseason 2025, no games have been played yet
  const gamesPlayed = 0;
  
  // Remaining games - full 17-game season for active players
  const remainingGames = isActive ? 17 : 0;
  
  // Position rank based on points (rough estimate)
  const positionRank = Math.max(1, Math.floor((400 - standardPoints) / 8) + Math.floor(Math.random() * 10));
  
  // Trend based on age and experience
  let trend: 'up' | 'down' | 'stable' = 'stable';
  if (isRookie || player.age < 25) {
    trend = Math.random() > 0.3 ? 'up' : 'stable';
  } else if (player.age > 30) {
    trend = Math.random() > 0.4 ? 'down' : 'stable';
  } else {
    const trendRand = Math.random();
    trend = trendRand > 0.6 ? 'up' : trendRand < 0.3 ? 'down' : 'stable';
  }

  return {
    stats: {
      gamesPlayed,
      fantasyPoints: {
        standard: 0, // No games played yet
        halfPpr: 0,
        ppr: 0
      },
      avgPointsPerGame: {
        standard: 0, // No average yet since no games played
        halfPpr: 0,
        ppr: 0
      },
      positionRank,
      trend
    },
    projections: {
      remainingGames,
      projectedPoints: {
        standard: Math.round(standardPoints * 10) / 10,
        halfPpr: Math.round(halfPprPoints * 10) / 10,  
        ppr: Math.round(pprPoints * 10) / 10
      },
      confidenceScore: isActive ? Math.floor(Math.random() * 25) + 75 : Math.floor(Math.random() * 30) + 40
    }
  };
};

class FantasyApiService {
  private players: Player[] = [];
  private lastFetch: Date | null = null;
  private readonly CACHE_DURATION = 1000 * 60 * 60; // 1 hour cache

  async fetchPlayers(forceRefresh = false): Promise<FantasyApiResponse> {
    // Check if we need to refresh data
    if (!forceRefresh && this.lastFetch && 
        Date.now() - this.lastFetch.getTime() < this.CACHE_DURATION &&
        this.players.length > 0) {
      return {
        players: this.players,
        lastUpdated: this.lastFetch
      };
    }

    try {
      console.log('Fetching fresh player data from Sleeper API...');
      const response = await axios.get(NFL_PLAYERS_URL, {
        timeout: 10000 // 10 second timeout
      });
      
      const sleeperPlayers: { [key: string]: SleeperPlayer } = response.data;
      
      // Transform Sleeper data to our Player format
      this.players = this.transformSleeperData(sleeperPlayers);
      this.lastFetch = new Date();
      
      // Store in localStorage for offline capability
      try {
        localStorage.setItem('fantasyPlayers', JSON.stringify({
          players: this.players,
          lastUpdated: this.lastFetch
        }));
      } catch (e) {
        console.warn('Failed to cache player data in localStorage:', e);
      }

      console.log(`Successfully loaded ${this.players.length} players from Sleeper API`);
      
      return {
        players: this.players,
        lastUpdated: this.lastFetch
      };
    } catch (error) {
      console.error('Error fetching player data from Sleeper API:', error);
      
      // Try to load from localStorage as fallback
      try {
        const cached = localStorage.getItem('fantasyPlayers');
        if (cached) {
          const data = JSON.parse(cached);
          this.players = data.players;
          this.lastFetch = new Date(data.lastUpdated);
          console.log(`Loaded ${this.players.length} players from cache`);
          return {
            players: this.players,
            lastUpdated: this.lastFetch
          };
        }
      } catch (cacheError) {
        console.error('Failed to load cached data:', cacheError);
      }
      
      throw new Error('Failed to fetch player data from API and no cached data available');
    }
  }

  private transformSleeperData(sleeperPlayers: { [key: string]: SleeperPlayer }): Player[] {
    const players: Player[] = [];
    
    Object.entries(sleeperPlayers).forEach(([playerId, player]) => {
      // Only include players with valid positions and teams
      if (!player.position || !POSITION_MAP[player.position] || !player.team) {
        return;
      }

      // Skip inactive, retired, or practice squad players for main roster
      if (!player.active || 
          player.injury_status === 'Retired' || 
          player.status === 'Retired' ||
          player.status === 'Inactive' ||
          player.status === 'Practice Squad' ||
          !player.full_name ||
          player.years_exp === null) {
        return;
      }

      // Skip players who are not currently on NFL rosters (2024 season and beyond)
      if (player.years_exp !== null && player.years_exp > 15) {
        return;
      }

      // Skip players without current team assignment
      if (!player.team || player.team === 'FA' || player.team === 'UFA') {
        return;
      }

      // Generate realistic stats based on player data
      const { stats, projections } = generateRealisticStats(player, player.position);
      
      const transformedPlayer: Player = {
        id: playerId,
        name: player.full_name || `${player.first_name} ${player.last_name}`,
        position: POSITION_MAP[player.position],
        team: TEAM_MAP[player.team] || player.team,
        stats,
        projections,
        injuryStatus: this.mapInjuryStatus(player.injury_status),
        byeWeek: this.getByeWeek(player.team)
      };

      players.push(transformedPlayer);
    });

    // Sort by fantasy points (PPR) and take top players by position
    players.sort((a, b) => b.stats.fantasyPoints.ppr - a.stats.fantasyPoints.ppr);
    
    // Filter to get reasonable number of fantasy-relevant players per position
    const positionLimits = {
      'QB': 40,
      'RB': 80,
      'WR': 100,
      'TE': 40,
      'K': 32,
      'DEF': 32
    };

    const filteredPlayers: Player[] = [];
    const positionCounts: { [key: string]: number } = {};

    for (const player of players) {
      const currentCount = positionCounts[player.position] || 0;
      const limit = positionLimits[player.position as keyof typeof positionLimits] || 50;
      
      if (currentCount < limit) {
        filteredPlayers.push(player);
        positionCounts[player.position] = currentCount + 1;
      }
    }

    console.log('Player counts by position:', positionCounts);
    return filteredPlayers;
  }

  private mapInjuryStatus(status: string): Player['injuryStatus'] {
    if (!status) return 'healthy';
    
    const statusLower = status.toLowerCase();
    switch (statusLower) {
      case 'healthy':
      case 'active':
      case '':
        return 'healthy';
      case 'questionable':
      case 'q':
        return 'questionable';
      case 'doubtful':
      case 'd':
        return 'doubtful';
      case 'out':
      case 'o':
        return 'out';
      case 'ir':
      case 'injured reserve':
      case 'reserve/injured':
        return 'ir';
      default:
        return 'healthy';
    }
  }

  private getByeWeek(team: string): number {
    // 2024 NFL bye weeks
    const byeWeeks: { [key: string]: number } = {
      'BUF': 12, 'MIA': 6, 'NE': 14, 'NYJ': 7,
      'BAL': 14, 'CIN': 7, 'CLE': 5, 'PIT': 9,
      'HOU': 14, 'IND': 14, 'JAX': 9, 'TEN': 7,
      'DEN': 8, 'KC': 10, 'LV': 13, 'LAC': 5,
      'DAL': 7, 'NYG': 11, 'PHI': 10, 'WAS': 14,
      'CHI': 13, 'DET': 9, 'GB': 10, 'MIN': 13,
      'ATL': 12, 'CAR': 11, 'NO': 12, 'TB': 11,
      'ARI': 8, 'LAR': 10, 'SF': 9, 'SEA': 5
    };
    
    return byeWeeks[team] || Math.floor(Math.random() * 14) + 4;
  }

  // Clear cache method for debugging
  clearCache(): void {
    this.players = [];
    this.lastFetch = null;
    localStorage.removeItem('fantasyPlayers');
    console.log('Player cache cleared');
  }
}

export const fantasyApiService = new FantasyApiService();
export default fantasyApiService;