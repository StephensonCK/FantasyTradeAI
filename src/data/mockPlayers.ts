import { Player } from '../types';

export const mockPlayers: Player[] = [
  // Quarterbacks
  {
    id: '1',
    name: 'Josh Allen',
    position: 'QB',
    team: 'BUF',
    stats: {
      gamesPlayed: 14,
      fantasyPoints: { standard: 312.4, halfPpr: 312.4, ppr: 312.4 },
      avgPointsPerGame: { standard: 22.3, halfPpr: 22.3, ppr: 22.3 },
      positionRank: 1,
      trend: 'up'
    },
    projections: {
      remainingGames: 3,
      projectedPoints: { standard: 68.5, halfPpr: 68.5, ppr: 68.5 },
      confidenceScore: 95
    },
    injuryStatus: 'healthy',
    byeWeek: 13,
    imageUrl: 'https://images.pexels.com/photos/1618269/pexels-photo-1618269.jpeg?auto=compress&cs=tinysrgb&w=300'
  },
  {
    id: '2',
    name: 'Lamar Jackson',
    position: 'QB',
    team: 'BAL',
    stats: {
      gamesPlayed: 13,
      fantasyPoints: { standard: 298.7, halfPpr: 298.7, ppr: 298.7 },
      avgPointsPerGame: { standard: 23.0, halfPpr: 23.0, ppr: 23.0 },
      positionRank: 2,
      trend: 'up'
    },
    projections: {
      remainingGames: 4,
      projectedPoints: { standard: 89.2, halfPpr: 89.2, ppr: 89.2 },
      confidenceScore: 92
    },
    injuryStatus: 'healthy',
    byeWeek: 14,
    imageUrl: 'https://images.pexels.com/photos/1752757/pexels-photo-1752757.jpeg?auto=compress&cs=tinysrgb&w=300'
  },
  {
    id: '3',
    name: 'Dak Prescott',
    position: 'QB',
    team: 'DAL',
    stats: {
      gamesPlayed: 12,
      fantasyPoints: { standard: 245.8, halfPpr: 245.8, ppr: 245.8 },
      avgPointsPerGame: { standard: 20.5, halfPpr: 20.5, ppr: 20.5 },
      positionRank: 8,
      trend: 'down'
    },
    projections: {
      remainingGames: 5,
      projectedPoints: { standard: 95.5, halfPpr: 95.5, ppr: 95.5 },
      confidenceScore: 78
    },
    injuryStatus: 'questionable',
    byeWeek: 7,
    imageUrl: 'https://images.pexels.com/photos/1661950/pexels-photo-1661950.jpeg?auto=compress&cs=tinysrgb&w=300'
  },

  // Running Backs
  {
    id: '4',
    name: 'Christian McCaffrey',
    position: 'RB',
    team: 'SF',
    stats: {
      gamesPlayed: 14,
      fantasyPoints: { standard: 287.6, halfPpr: 315.2, ppr: 342.8 },
      avgPointsPerGame: { standard: 20.5, halfPpr: 22.5, ppr: 24.5 },
      positionRank: 1,
      trend: 'up'
    },
    projections: {
      remainingGames: 3,
      projectedPoints: { standard: 58.5, halfPpr: 64.5, ppr: 70.5 },
      confidenceScore: 94
    },
    injuryStatus: 'healthy',
    byeWeek: 9,
    imageUrl: 'https://images.pexels.com/photos/1884574/pexels-photo-1884574.jpeg?auto=compress&cs=tinysrgb&w=300'
  },
  {
    id: '5',
    name: 'Austin Ekeler',
    position: 'RB',
    team: 'LAC',
    stats: {
      gamesPlayed: 13,
      fantasyPoints: { standard: 198.4, halfPpr: 246.8, ppr: 295.2 },
      avgPointsPerGame: { standard: 15.3, halfPpr: 19.0, ppr: 22.7 },
      positionRank: 3,
      trend: 'stable'
    },
    projections: {
      remainingGames: 4,
      projectedPoints: { standard: 58.0, halfPpr: 72.0, ppr: 86.0 },
      confidenceScore: 88
    },
    injuryStatus: 'healthy',
    byeWeek: 5,
    imageUrl: 'https://images.pexels.com/photos/1752757/pexels-photo-1752757.jpeg?auto=compress&cs=tinysrgb&w=300'
  },
  {
    id: '6',
    name: 'Derrick Henry',
    position: 'RB',
    team: 'TEN',
    stats: {
      gamesPlayed: 16,
      fantasyPoints: { standard: 264.8, halfPpr: 278.4, ppr: 292.0 },
      avgPointsPerGame: { standard: 16.6, halfPpr: 17.4, ppr: 18.3 },
      positionRank: 5,
      trend: 'down'
    },
    projections: {
      remainingGames: 1,
      projectedPoints: { standard: 14.2, halfPpr: 15.8, ppr: 17.4 },
      confidenceScore: 85
    },
    injuryStatus: 'healthy',
    byeWeek: 7,
    imageUrl: 'https://images.pexels.com/photos/1661950/pexels-photo-1661950.jpeg?auto=compress&cs=tinysrgb&w=300'
  },
  {
    id: '7',
    name: 'Nick Chubb',
    position: 'RB',
    team: 'CLE',
    stats: {
      gamesPlayed: 2,
      fantasyPoints: { standard: 34.2, halfPpr: 36.8, ppr: 39.4 },
      avgPointsPerGame: { standard: 17.1, halfPpr: 18.4, ppr: 19.7 },
      positionRank: 45,
      trend: 'stable'
    },
    projections: {
      remainingGames: 0,
      projectedPoints: { standard: 0, halfPpr: 0, ppr: 0 },
      confidenceScore: 0
    },
    injuryStatus: 'ir',
    byeWeek: 5,
    imageUrl: 'https://images.pexels.com/photos/1884574/pexels-photo-1884574.jpeg?auto=compress&cs=tinysrgb&w=300'
  },

  // Wide Receivers
  {
    id: '8',
    name: 'Tyreek Hill',
    position: 'WR',
    team: 'MIA',
    stats: {
      gamesPlayed: 16,
      fantasyPoints: { standard: 268.4, halfPpr: 312.8, ppr: 357.2 },
      avgPointsPerGame: { standard: 16.8, halfPpr: 19.6, ppr: 22.3 },
      positionRank: 2,
      trend: 'up'
    },
    projections: {
      remainingGames: 1,
      projectedPoints: { standard: 18.5, halfPpr: 21.6, ppr: 24.7 },
      confidenceScore: 91
    },
    injuryStatus: 'healthy',
    byeWeek: 10,
    imageUrl: 'https://images.pexels.com/photos/1752757/pexels-photo-1752757.jpeg?auto=compress&cs=tinysrgb&w=300'
  },
  {
    id: '9',
    name: 'Stefon Diggs',
    position: 'WR',
    team: 'BUF',
    stats: {
      gamesPlayed: 16,
      fantasyPoints: { standard: 245.6, halfPpr: 289.2, ppr: 332.8 },
      avgPointsPerGame: { standard: 15.4, halfPpr: 18.1, ppr: 20.8 },
      positionRank: 4,
      trend: 'stable'
    },
    projections: {
      remainingGames: 1,
      projectedPoints: { standard: 16.8, halfPpr: 19.5, ppr: 22.2 },
      confidenceScore: 89
    },
    injuryStatus: 'healthy',
    byeWeek: 13,
    imageUrl: 'https://images.pexels.com/photos/1661950/pexels-photo-1661950.jpeg?auto=compress&cs=tinysrgb&w=300'
  },
  {
    id: '10',
    name: 'Cooper Kupp',
    position: 'WR',
    team: 'LAR',
    stats: {
      gamesPlayed: 9,
      fantasyPoints: { standard: 156.8, halfPpr: 189.6, ppr: 222.4 },
      avgPointsPerGame: { standard: 17.4, halfPpr: 21.1, ppr: 24.7 },
      positionRank: 18,
      trend: 'up'
    },
    projections: {
      remainingGames: 1,
      projectedPoints: { standard: 19.2, halfPpr: 23.4, ppr: 27.6 },
      confidenceScore: 82
    },
    injuryStatus: 'healthy',
    byeWeek: 10,
    imageUrl: 'https://images.pexels.com/photos/1884574/pexels-photo-1884574.jpeg?auto=compress&cs=tinysrgb&w=300'
  },
  {
    id: '11',
    name: 'Davante Adams',
    position: 'WR',
    team: 'LV',
    stats: {
      gamesPlayed: 17,
      fantasyPoints: { standard: 231.4, halfPpr: 287.8, ppr: 344.2 },
      avgPointsPerGame: { standard: 13.6, halfPpr: 16.9, ppr: 20.2 },
      positionRank: 8,
      trend: 'down'
    },
    projections: {
      remainingGames: 0,
      projectedPoints: { standard: 0, halfPpr: 0, ppr: 0 },
      confidenceScore: 0
    },
    injuryStatus: 'healthy',
    byeWeek: 13,
    imageUrl: 'https://images.pexels.com/photos/1618269/pexels-photo-1618269.jpeg?auto=compress&cs=tinysrgb&w=300'
  },

  // Tight Ends
  {
    id: '12',
    name: 'Travis Kelce',
    position: 'TE',
    team: 'KC',
    stats: {
      gamesPlayed: 16,
      fantasyPoints: { standard: 214.6, halfPpr: 246.2, ppr: 277.8 },
      avgPointsPerGame: { standard: 13.4, halfPpr: 15.4, ppr: 17.4 },
      positionRank: 1,
      trend: 'stable'
    },
    projections: {
      remainingGames: 1,
      projectedPoints: { standard: 14.8, halfPpr: 17.2, ppr: 19.6 },
      confidenceScore: 93
    },
    injuryStatus: 'healthy',
    byeWeek: 10,
    imageUrl: 'https://images.pexels.com/photos/1752757/pexels-photo-1752757.jpeg?auto=compress&cs=tinysrgb&w=300'
  },
  {
    id: '13',
    name: 'Mark Andrews',
    position: 'TE',
    team: 'BAL',
    stats: {
      gamesPlayed: 10,
      fantasyPoints: { standard: 98.4, halfPpr: 113.8, ppr: 129.2 },
      avgPointsPerGame: { standard: 9.8, halfPpr: 11.4, ppr: 12.9 },
      positionRank: 8,
      trend: 'down'
    },
    projections: {
      remainingGames: 1,
      projectedPoints: { standard: 10.5, halfPpr: 12.2, ppr: 13.9 },
      confidenceScore: 75
    },
    injuryStatus: 'questionable',
    byeWeek: 14,
    imageUrl: 'https://images.pexels.com/photos/1661950/pexels-photo-1661950.jpeg?auto=compress&cs=tinysrgb&w=300'
  },
  {
    id: '14',
    name: 'George Kittle',
    position: 'TE',
    team: 'SF',
    stats: {
      gamesPlayed: 14,
      fantasyPoints: { standard: 156.8, halfPpr: 178.4, ppr: 200.0 },
      avgPointsPerGame: { standard: 11.2, halfPpr: 12.7, ppr: 14.3 },
      positionRank: 4,
      trend: 'up'
    },
    projections: {
      remainingGames: 1,
      projectedPoints: { standard: 12.4, halfPpr: 14.1, ppr: 15.8 },
      confidenceScore: 88
    },
    injuryStatus: 'healthy',
    byeWeek: 9,
    imageUrl: 'https://images.pexels.com/photos/1884574/pexels-photo-1884574.jpeg?auto=compress&cs=tinysrgb&w=300'
  },

  // Kickers
  {
    id: '15',
    name: 'Justin Tucker',
    position: 'K',
    team: 'BAL',
    stats: {
      gamesPlayed: 17,
      fantasyPoints: { standard: 156.0, halfPpr: 156.0, ppr: 156.0 },
      avgPointsPerGame: { standard: 9.2, halfPpr: 9.2, ppr: 9.2 },
      positionRank: 2,
      trend: 'stable'
    },
    projections: {
      remainingGames: 0,
      projectedPoints: { standard: 0, halfPpr: 0, ppr: 0 },
      confidenceScore: 85
    },
    injuryStatus: 'healthy',
    byeWeek: 14,
    imageUrl: 'https://images.pexels.com/photos/1618269/pexels-photo-1618269.jpeg?auto=compress&cs=tinysrgb&w=300'
  },
  {
    id: '16',
    name: 'Harrison Butker',
    position: 'K',
    team: 'KC',
    stats: {
      gamesPlayed: 14,
      fantasyPoints: { standard: 142.0, halfPpr: 142.0, ppr: 142.0 },
      avgPointsPerGame: { standard: 10.1, halfPpr: 10.1, ppr: 10.1 },
      positionRank: 3,
      trend: 'up'
    },
    projections: {
      remainingGames: 1,
      projectedPoints: { standard: 11.2, halfPpr: 11.2, ppr: 11.2 },
      confidenceScore: 88
    },
    injuryStatus: 'healthy',
    byeWeek: 10,
    imageUrl: 'https://images.pexels.com/photos/1752757/pexels-photo-1752757.jpeg?auto=compress&cs=tinysrgb&w=300'
  },

  // Defenses
  {
    id: '17',
    name: 'San Francisco 49ers',
    position: 'DEF',
    team: 'SF',
    stats: {
      gamesPlayed: 17,
      fantasyPoints: { standard: 184.0, halfPpr: 184.0, ppr: 184.0 },
      avgPointsPerGame: { standard: 10.8, halfPpr: 10.8, ppr: 10.8 },
      positionRank: 1,
      trend: 'up'
    },
    projections: {
      remainingGames: 0,
      projectedPoints: { standard: 0, halfPpr: 0, ppr: 0 },
      confidenceScore: 92
    },
    injuryStatus: 'healthy',
    byeWeek: 9,
    imageUrl: 'https://images.pexels.com/photos/1661950/pexels-photo-1661950.jpeg?auto=compress&cs=tinysrgb&w=300'
  },
  {
    id: '18',
    name: 'Buffalo Bills',
    position: 'DEF',
    team: 'BUF',
    stats: {
      gamesPlayed: 17,
      fantasyPoints: { standard: 176.0, halfPpr: 176.0, ppr: 176.0 },
      avgPointsPerGame: { standard: 10.4, halfPpr: 10.4, ppr: 10.4 },
      positionRank: 2,
      trend: 'stable'
    },
    projections: {
      remainingGames: 0,
      projectedPoints: { standard: 0, halfPpr: 0, ppr: 0 },
      confidenceScore: 89
    },
    injuryStatus: 'healthy',
    byeWeek: 13,
    imageUrl: 'https://images.pexels.com/photos/1884574/pexels-photo-1884574.jpeg?auto=compress&cs=tinysrgb&w=300'
  },

  // Additional Players
  {
    id: '19',
    name: 'Tua Tagovailoa',
    position: 'QB',
    team: 'MIA',
    stats: {
      gamesPlayed: 13,
      fantasyPoints: { standard: 278.4, halfPpr: 278.4, ppr: 278.4 },
      avgPointsPerGame: { standard: 21.4, halfPpr: 21.4, ppr: 21.4 },
      positionRank: 4,
      trend: 'stable'
    },
    projections: {
      remainingGames: 1,
      projectedPoints: { standard: 22.8, halfPpr: 22.8, ppr: 22.8 },
      confidenceScore: 86
    },
    injuryStatus: 'healthy',
    byeWeek: 10,
    imageUrl: 'https://images.pexels.com/photos/1618269/pexels-photo-1618269.jpeg?auto=compress&cs=tinysrgb&w=300'
  },
  {
    id: '20',
    name: 'Saquon Barkley',
    position: 'RB',
    team: 'PHI',
    stats: {
      gamesPlayed: 16,
      fantasyPoints: { standard: 289.6, halfPpr: 321.2, ppr: 352.8 },
      avgPointsPerGame: { standard: 18.1, halfPpr: 20.1, ppr: 22.1 },
      positionRank: 2,
      trend: 'up'
    },
    projections: {
      remainingGames: 1,
      projectedPoints: { standard: 19.8, halfPpr: 22.1, ppr: 24.4 },
      confidenceScore: 91
    },
    injuryStatus: 'healthy',
    byeWeek: 5,
    imageUrl: 'https://images.pexels.com/photos/1752757/pexels-photo-1752757.jpeg?auto=compress&cs=tinysrgb&w=300'
  },
  {
    id: '21',
    name: 'CeeDee Lamb',
    position: 'WR',
    team: 'DAL',
    stats: {
      gamesPlayed: 17,
      fantasyPoints: { standard: 289.4, halfPpr: 342.8, ppr: 396.2 },
      avgPointsPerGame: { standard: 17.0, halfPpr: 20.2, ppr: 23.3 },
      positionRank: 1,
      trend: 'up'
    },
    projections: {
      remainingGames: 0,
      projectedPoints: { standard: 0, halfPpr: 0, ppr: 0 },
      confidenceScore: 94
    },
    injuryStatus: 'healthy',
    byeWeek: 7,
    imageUrl: 'https://images.pexels.com/photos/1661950/pexels-photo-1661950.jpeg?auto=compress&cs=tinysrgb&w=300'
  },
  {
    id: '22',
    name: 'Amon-Ra St. Brown',
    position: 'WR',
    team: 'DET',
    stats: {
      gamesPlayed: 16,
      fantasyPoints: { standard: 218.6, halfPpr: 274.2, ppr: 329.8 },
      avgPointsPerGame: { standard: 13.7, halfPpr: 17.1, ppr: 20.6 },
      positionRank: 6,
      trend: 'up'
    },
    projections: {
      remainingGames: 1,
      projectedPoints: { standard: 15.2, halfPpr: 19.0, ppr: 22.8 },
      confidenceScore: 87
    },
    injuryStatus: 'healthy',
    byeWeek: 9,
    imageUrl: 'https://images.pexels.com/photos/1884574/pexels-photo-1884574.jpeg?auto=compress&cs=tinysrgb&w=300'
  },
  {
    id: '23',
    name: 'T.J. Hockenson',
    position: 'TE',
    team: 'MIN',
    stats: {
      gamesPlayed: 15,
      fantasyPoints: { standard: 142.8, halfPpr: 172.4, ppr: 202.0 },
      avgPointsPerGame: { standard: 9.5, halfPpr: 11.5, ppr: 13.5 },
      positionRank: 5,
      trend: 'stable'
    },
    projections: {
      remainingGames: 1,
      projectedPoints: { standard: 10.8, halfPpr: 13.2, ppr: 15.6 },
      confidenceScore: 84
    },
    injuryStatus: 'healthy',
    byeWeek: 13,
    imageUrl: 'https://images.pexels.com/photos/1618269/pexels-photo-1618269.jpeg?auto=compress&cs=tinysrgb&w=300'
  },
  {
    id: '24',
    name: 'Daniel Carlson',
    position: 'K',
    team: 'LV',
    stats: {
      gamesPlayed: 17,
      fantasyPoints: { standard: 148.0, halfPpr: 148.0, ppr: 148.0 },
      avgPointsPerGame: { standard: 8.7, halfPpr: 8.7, ppr: 8.7 },
      positionRank: 5,
      trend: 'down'
    },
    projections: {
      remainingGames: 0,
      projectedPoints: { standard: 0, halfPpr: 0, ppr: 0 },
      confidenceScore: 82
    },
    injuryStatus: 'healthy',
    byeWeek: 13,
    imageUrl: 'https://images.pexels.com/photos/1752757/pexels-photo-1752757.jpeg?auto=compress&cs=tinysrgb&w=300'
  },
  {
    id: '25',
    name: 'Dallas Cowboys',
    position: 'DEF',
    team: 'DAL',
    stats: {
      gamesPlayed: 17,
      fantasyPoints: { standard: 168.0, halfPpr: 168.0, ppr: 168.0 },
      avgPointsPerGame: { standard: 9.9, halfPpr: 9.9, ppr: 9.9 },
      positionRank: 3,
      trend: 'stable'
    },
    projections: {
      remainingGames: 0,
      projectedPoints: { standard: 0, halfPpr: 0, ppr: 0 },
      confidenceScore: 85
    },
    injuryStatus: 'healthy',
    byeWeek: 7,
    imageUrl: 'https://images.pexels.com/photos/1661950/pexels-photo-1661950.jpeg?auto=compress&cs=tinysrgb&w=300'
  }
];