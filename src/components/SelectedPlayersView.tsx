import React from 'react';
import { Star, Calendar, TrendingUp, Target, Activity, Clock, X, Users } from 'lucide-react';
import { Player } from '../types';

interface SelectedPlayersViewProps {
  selectedPlayers: Player[];
  onRemovePlayer: (playerId: string) => void;
  onAssignToTeam: (player: Player, team: 'user1' | 'user2') => void;
  scoringFormat: 'standard' | 'halfPpr' | 'ppr';
}

export const SelectedPlayersView: React.FC<SelectedPlayersViewProps> = ({
  selectedPlayers,
  onRemovePlayer,
  onAssignToTeam,
  scoringFormat
}) => {
  const getPositionColor = (position: string) => {
    switch (position) {
      case 'QB': return 'bg-secondary/20 text-secondary border-secondary/30';
      case 'RB': return 'bg-success/20 text-success border-success/30';
      case 'WR': return 'bg-info/20 text-info border-info/30';
      case 'TE': return 'bg-warning/20 text-warning border-warning/30';
      case 'K': return 'bg-accent/20 text-accent border-accent/30';
      case 'DEF': return 'bg-error/20 text-error border-error/30';
      default: return 'bg-base-300 text-base-content border-base-300';
    }
  };

  const getInjuryStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'text-success bg-success/10';
      case 'questionable': return 'text-warning bg-warning/10';
      case 'doubtful': return 'text-warning bg-warning/20';
      case 'out':
      case 'ir': return 'text-error bg-error/10';
      default: return 'text-base-content bg-base-200';
    }
  };

  // Generate mock schedule for remaining games
  const generateSchedule = (player: Player) => {
    const opponents = ['vs BUF', '@MIA', 'vs NYJ', '@NE', 'vs CIN', '@BAL', 'vs KC', '@DEN', 'vs LAC', '@LV', 'vs HOU', '@IND', 'vs JAX', '@TEN', 'vs CLE', '@PIT', 'vs CIN'];
    
    // Since it's preseason 2025, all 17 games are remaining
    // Start from week 1 and go through week 17
    return Array.from({ length: Math.min(17, player.projections.remainingGames) }, (_, i) => ({
      week: i + 1, // Week 1, 2, 3, etc.
      opponent: opponents[i % opponents.length],
      projectedPoints: (player.projections.projectedPoints[scoringFormat] / player.projections.remainingGames) * (0.8 + Math.random() * 0.4),
      difficulty: ['Easy', 'Medium', 'Hard'][Math.floor(Math.random() * 3)] as 'Easy' | 'Medium' | 'Hard'
    }));
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'text-success bg-success/10';
      case 'Medium': return 'text-warning bg-warning/10';
      case 'Hard': return 'text-error bg-error/10';
      default: return 'text-base-content bg-base-200';
    }
  };

  if (selectedPlayers.length === 0) {
    return (
      <div className="bg-base-100 rounded shadow-lg border border-base-300 p-8 transition-colors">
        <div className="text-center text-base-content/50">
          <Star className="w-12 h-12 mx-auto mb-3 text-base-content/30" />
          <p>No players selected yet</p>
          <p className="text-sm mt-1">Click on players from search to view detailed stats</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-base-100 rounded shadow-lg border border-base-300 transition-colors">
      <div className="p-6 border-b border-base-300">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-primary p-3 rounded">
              <Star className="w-5 h-5 text-primary-content" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-base-content font-tomorrow">Selected Players</h2>
              <p className="text-base-content/60 text-sm font-noto">Detailed player analysis and projections</p>
            </div>
          </div>
          <div className="text-sm text-base-content/60">
            {selectedPlayers.length} player{selectedPlayers.length !== 1 ? 's' : ''} selected
          </div>
        </div>
      </div>

      <div className="p-6 space-y-8">
        {selectedPlayers.map((player) => {
          const schedule = generateSchedule(player);
          
          return (
            <div key={player.id} className="border border-base-300 rounded p-6 bg-base-50">
              {/* Player Header */}
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 rounded-xl overflow-hidden bg-base-100 shadow-md border border-base-300">
                    <img
                      src={`https://a.espncdn.com/i/teamlogos/nfl/500/${player.team.toLowerCase()}.png`}
                      alt={`${player.team} logo`}
                      className="w-full h-full object-contain p-2"
                    />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-base-content font-tomorrow mb-2">
                      {player.name}
                    </h3>
                    <div className="flex items-center space-x-3">
                      <span className="text-sm font-semibold text-base-content/70 bg-base-200 px-2 py-1 rounded">
                        {player.team}
                      </span>
                      <span className={`text-sm px-3 py-1 rounded-md font-bold border ${getPositionColor(player.position)}`}>
                        {player.position}
                      </span>
                      <span className={`text-sm px-2 py-1 rounded font-medium ${getInjuryStatusColor(player.injuryStatus)}`}>
                        {player.injuryStatus.toUpperCase()}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => onAssignToTeam(player, 'user1')}
                    className="btn btn-sm flex items-center space-x-1 bg-blue-500 hover:bg-blue-600 text-white border-blue-500 hover:border-blue-600"
                  >
                    <Users className="w-4 h-4" />
                    <span>Team 1</span>
                  </button>
                  <button
                    onClick={() => onAssignToTeam(player, 'user2')}
                    className="btn btn-sm flex items-center space-x-1 bg-red-500 hover:bg-red-600 text-white border-red-500 hover:border-red-600"
                  >
                    <Users className="w-4 h-4" />
                    <span>Team 2</span>
                  </button>
                  <button
                    onClick={() => onRemovePlayer(player.id)}
                    className="btn btn-ghost btn-sm text-error hover:bg-error/10"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Detailed Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 mb-6">
                <div className="bg-base-100 rounded p-4 text-center shadow-sm border border-base-300">
                  <div className="flex items-center justify-center space-x-1 mb-2">
                    <Target className="w-4 h-4 text-info" />
                    <span className="text-sm font-semibold text-base-content/60">Rank</span>
                  </div>
                  <span className="text-lg font-bold text-info">#{player.stats.positionRank}</span>
                  <p className="text-xs text-base-content/50 mt-1">{player.position} Position</p>
                </div>
                
                <div className="bg-base-100 rounded p-4 text-center shadow-sm border border-base-300">
                  <div className="flex items-center justify-center space-x-1 mb-2">
                    <Activity className="w-4 h-4 text-primary" />
                    <span className="text-sm font-semibold text-base-content/60">Actual Points</span>
                  </div>
                  <span className="text-lg font-bold text-base-content">
                    {player.stats.fantasyPoints[scoringFormat].toFixed(1)}
                  </span>
                  <p className="text-xs text-base-content/50 mt-1">{scoringFormat.toUpperCase()} Points</p>
                </div>
                
                <div className="bg-base-100 rounded p-4 text-center shadow-sm border border-base-300">
                  <div className="flex items-center justify-center space-x-1 mb-2">
                    <Activity className="w-4 h-4 text-secondary" />
                    <span className="text-sm font-semibold text-base-content/60">Season Proj</span>
                  </div>
                  <span className="text-lg font-bold text-secondary">
                    {player.projections.projectedPoints[scoringFormat].toFixed(1)}
                  </span>
                  <p className="text-xs text-base-content/50 mt-1">{scoringFormat.toUpperCase()} Points</p>
                </div>
                
                <div className="bg-base-100 rounded p-4 text-center shadow-sm border border-base-300">
                  <div className="flex items-center justify-center space-x-1 mb-2">
                    <TrendingUp className="w-4 h-4 text-success" />
                    <span className="text-sm font-semibold text-base-content/60">Per Game</span>
                  </div>
                  <span className="text-lg font-bold text-success">
                    {(player.projections.projectedPoints[scoringFormat] / Math.max(player.projections.remainingGames, 1)).toFixed(1)}
                  </span>
                  <p className="text-xs text-base-content/50 mt-1">Projected Avg</p>
                </div>
                
                <div className="bg-base-100 rounded p-4 text-center shadow-sm border border-base-300">
                  <div className="flex items-center justify-center space-x-1 mb-2">
                    <Calendar className="w-4 h-4 text-warning" />
                    <span className="text-sm font-semibold text-base-content/60">Bye Week</span>
                  </div>
                  <span className="text-lg font-bold text-warning">{player.byeWeek}</span>
                  <p className="text-xs text-base-content/50 mt-1">Week</p>
                </div>
                
                <div className="bg-base-100 rounded p-4 text-center shadow-sm border border-base-300">
                  <div className="flex items-center justify-center space-x-1 mb-2">
                    <Clock className="w-4 h-4 text-accent" />
                    <span className="text-sm font-semibold text-base-content/60">Games Left</span>
                  </div>
                  <span className="text-lg font-bold text-accent">{player.projections.remainingGames}</span>
                  <p className="text-xs text-base-content/50 mt-1">Remaining</p>
                </div>
                
                <div className="bg-base-100 rounded p-4 text-center shadow-sm border border-base-300">
                  <div className="flex items-center justify-center space-x-1 mb-2">
                    <Target className="w-4 h-4 text-primary" />
                    <span className="text-sm font-semibold text-base-content/60">Confidence</span>
                  </div>
                  <span className="text-lg font-bold text-primary">{player.projections.confidenceScore}%</span>
                  <p className="text-xs text-base-content/50 mt-1">Score</p>
                </div>
              </div>

              {/* Schedule */}
              {schedule.length > 0 && (
                <div>
                  <h4 className="text-lg font-semibold text-base-content mb-4 flex items-center space-x-2 font-tomorrow">
                    <Calendar className="w-5 h-5" />
                    <span>Upcoming Schedule & Projections</span>
                  </h4>
                  
                  <div className="overflow-x-auto">
                    <table className="table table-zebra w-full">
                      <thead>
                        <tr>
                          <th className="text-base-content font-bold">Week</th>
                          <th className="text-base-content font-bold">Opponent</th>
                          <th className="text-base-content font-bold">Difficulty</th>
                          <th className="text-base-content font-bold text-right">Projected Points</th>
                        </tr>
                      </thead>
                      <tbody>
                        {schedule.map((game, index) => (
                          <tr key={index} className="hover:bg-base-200/50">
                            <td className="font-bold text-base-content">
                              Week {game.week}
                            </td>
                            <td className="text-base-content/80">
                              {game.opponent}
                            </td>
                            <td>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(game.difficulty)}`}>
                                {game.difficulty}
                              </span>
                            </td>
                            <td className="text-right">
                              <span className="text-lg font-bold text-success">
                                {game.projectedPoints.toFixed(1)}
                              </span>
                              <span className="text-xs text-base-content/50 ml-1">pts</span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  
                  <div className="mt-4 p-3 bg-info/10 rounded border border-info/20">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-info font-medium">Total Projected Points:</span>
                      <span className="text-info font-bold">
                        {schedule.reduce((sum, game) => sum + game.projectedPoints, 0).toFixed(1)} pts
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};