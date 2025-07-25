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

// NFL team defenses
const NFL_DEFENSES = [
  { team: 'ARI', name: 'Arizona Cardinals' },
  { team: 'ATL', name: 'Atlanta Falcons' },
  { team: 'BAL', name: 'Baltimore Ravens' },
  { team: 'BUF', name: 'Buffalo Bills' },
  { team: 'CAR', name: 'Carolina Panthers' },
  { team: 'CHI', name: 'Chicago Bears' },
  { team: 'CIN', name: 'Cincinnati Bengals' },
  { team: 'CLE', name: 'Cleveland Browns' },
  { team: 'DAL', name: 'Dallas Cowboys' },
  { team: 'DEN', name: 'Denver Broncos' },
  { team: 'DET', name: 'Detroit Lions' },
  { team: 'GB', name: 'Green Bay Packers' },
  { team: 'HOU', name: 'Houston Texans' },
  { team: 'IND', name: 'Indianapolis Colts' },
  { team: 'JAX', name: 'Jacksonville Jaguars' },
  { team: 'KC', name: 'Kansas City Chiefs' },
  { team: 'LV', name: 'Las Vegas Raiders' },
  { team: 'LAC', name: 'Los Angeles Chargers' },
  { team: 'LAR', name: 'Los Angeles Rams' },
  { team: 'MIA', name: 'Miami Dolphins' },
  { team: 'MIN', name: 'Minnesota Vikings' },
  { team: 'NE', name: 'New England Patriots' },
  { team: 'NO', name: 'New Orleans Saints' },
  { team: 'NYG', name: 'New York Giants' },
  { team: 'NYJ', name: 'New York Jets' },
  { team: 'PHI', name: 'Philadelphia Eagles' },
  { team: 'PIT', name: 'Pittsburgh Steelers' },
  { team: 'SF', name: 'San Francisco 49ers' },
  { team: 'SEA', name: 'Seattle Seahawks' },
  { team: 'TB', name: 'Tampa Bay Buccaneers' },
  { team: 'TEN', name: 'Tennessee Titans' },
  { team: 'WAS', name: 'Washington Commanders' }
];

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

// Generate defense stats
const generateDefenseStats = (teamCode: string): {
  stats: Player['stats'];
  projections: Player['projections'];
} => {
  const basePoints = 120 + (Math.random() * 80); // 120-200 points
  
  return {
    stats: {
      gamesPlayed: 0,
      fantasyPoints: {
        standard: 0,
        halfPpr: 0,
        ppr: 0
      },
      avgPointsPerGame: {
        standard: 0,
        halfPpr: 0,
        ppr: 0
      },
      positionRank: Math.floor(Math.random() * 32) + 1,
      trend: ['up', 'down', 'stable'][Math.floor(Math.random() * 3)] as 'up' | 'down' | 'stable'
    },
    projections: {
      remainingGames: 17,
      projectedPoints: {
        standard: Math.round(basePoints * 10) / 10,
        halfPpr: Math.round(basePoints * 10) / 10,
        ppr: Math.round(basePoints * 10) / 10
      },
      confidenceScore: Math.floor(Math.random() * 25) + 70
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
      console.log('Using cached data with', this.players.length, 'players');
      return {
        players: this.players,
        lastUpdated: this.lastFetch
      };
    }

    try {
      console.log('Fetching ALL active NFL players from Sleeper API...');
      const response = await axios.get(NFL_PLAYERS_URL, {
        timeout: 10000 // 10 second timeout
      });
      
      const sleeperPlayers: { [key: string]: SleeperPlayer } = response.data;
      console.log('Total players received from Sleeper API:', Object.keys(sleeperPlayers).length);
      
      // Transform Sleeper data to our Player format
      const apiPlayers = this.transformSleeperData(sleeperPlayers);
      console.log('Players after transformation:', apiPlayers.length);
      
      // Add all NFL defenses since Sleeper API doesn't include them
      const defenseTeams = this.createDefenseTeams();
      console.log('Adding NFL defense teams:', defenseTeams.length);
      
      // Combine offensive players with defense teams
      this.players = [...apiPlayers, ...defenseTeams];
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

      console.log(`Successfully loaded ${this.players.length} total players (${apiPlayers.length} offensive + ${defenseTeams.length} defenses)`);
      
      // Log player counts by position
      const defPlayers = this.players.filter(p => p.position === 'DEF');
      const qbPlayers = this.players.filter(p => p.position === 'QB');
      const rbPlayers = this.players.filter(p => p.position === 'RB');
      const wrPlayers = this.players.filter(p => p.position === 'WR');
      const tePlayers = this.players.filter(p => p.position === 'TE');
      const kPlayers = this.players.filter(p => p.position === 'K');
      
      console.log('Player counts by position:', {
        QB: qbPlayers.length,
        RB: rbPlayers.length,
        WR: wrPlayers.length,
        TE: tePlayers.length,
        K: kPlayers.length,
        DEF: defPlayers.length
      });
      
      // Check for Patrick Mahomes specifically
      const mahomes = this.players.find(p => p.name.toLowerCase().includes('mahomes'));
      if (mahomes) {
        console.log('✅ Patrick Mahomes found:', mahomes.name, mahomes.team, mahomes.position);
      } else {
        console.log('❌ Patrick Mahomes NOT found in player list');
      }
      
      return {
        players: this.players,
        lastUpdated: this.lastFetch
      };
    } catch (error) {
      console.error('Error fetching player data from Sleeper API:', error);
      
      // Try to load from localStorage first
      try {
        const cached = localStorage.getItem('fantasyPlayers');
        if (cached) {
          const parsedCache = JSON.parse(cached);
          console.log('Loading cached player data from localStorage...');
          this.players = parsedCache.players;
          this.lastFetch = new Date(parsedCache.lastUpdated);
          
          return {
            players: this.players,
            lastUpdated: this.lastFetch
          };
        }
      } catch (cacheError) {
        console.warn('Failed to load cached data:', cacheError);
      }
      
      // If everything fails, throw error - no mock data fallback
      throw new Error('Failed to fetch player data and no cached data available');
    }
  }

  private createDefenseTeams(): Player[] {
    return NFL_DEFENSES.map(defense => {
      const { stats, projections } = generateDefenseStats(defense.team);
      
      return {
        id: `def_${defense.team}`,
        name: defense.name,
        position: 'DEF' as const,
        team: defense.team,
        stats,
        projections,
        injuryStatus: 'healthy' as const,
        byeWeek: this.getByeWeek(defense.team)
      };
    });
  }

  private transformSleeperData(sleeperPlayers: { [key: string]: SleeperPlayer }): Player[] {
    const players: Player[] = [];
    
    console.log('Transforming Sleeper data for offensive players...');
    
    Object.entries(sleeperPlayers).forEach(([playerId, player]) => {
      // Only process offensive players (QB, RB, WR, TE, K)
      if (!player.position) {
        return;
      }
      
      // Skip DEF players - we'll add them separately
      if (player.position === 'DEF') {
        return;
      }
      
      if (!POSITION_MAP[player.position]) {
        return;
      }

      // Validation for offensive players - be more lenient to include more players
      if (!player.team || 
          player.team === 'FA' || 
          player.team === 'UFA' ||
          !player.full_name ||
          player.injury_status === 'Retired' || 
          player.status === 'Retired') {
        return;
      }
      
      // Include all active players, even if not currently on active roster
      // This ensures we get players like those on IR, practice squad, etc.

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

    // Sort by projected fantasy points (PPR)
    players.sort((a, b) => b.projections.projectedPoints.ppr - a.projections.projectedPoints.ppr);
    
    console.log('Transformed offensive players:', players.length);
    
    // Return ALL players - no artificial limits
    return players;
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
    // 2025 NFL bye weeks (using 2024 as template)
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