import React from 'react';
import { TrendingUp, TrendingDown, Minus, X, Plus, Calendar, Activity, Target, AlertCircle } from 'lucide-react';
import { Player } from '../types';

interface PlayerCardProps {
  player: Player;
  onSelect?: (player: Player, side: 'user1' | 'user2') => void;
  onRemove?: (playerId: string) => void;
  variant?: 'search' | 'trade';
}

export const PlayerCard: React.FC<PlayerCardProps> = ({ player, onSelect, onRemove, variant = 'search' }) => {
  const getTrendIcon = () => {
    switch (player.stats.trend) {
      case 'up':
        return <TrendingUp className="w-4 h-4 text-emerald-500" />;
      case 'down':
        return <TrendingDown className="w-4 h-4 text-red-500" />;
      default:
        return <Minus className="w-4 h-4 text-slate-400" />;
    }
  };

  const getPositionColor = () => {
    switch (player.position) {
      case 'QB':
        return 'bg-secondary/20 text-secondary';
      case 'RB':
        return 'bg-success/20 text-success';
      case 'WR':
        return 'bg-info/20 text-info';
      case 'TE':
        return 'bg-warning/20 text-warning';
      case 'K':
        return 'bg-accent/20 text-accent';
      case 'DEF':
        return 'bg-error/20 text-error';
      default:
        return 'bg-base-300 text-base-content';
    }
  };

  const getInjuryStatusColor = () => {
    switch (player.injuryStatus) {
      case 'healthy':
        return 'text-success';
      case 'questionable':
        return 'text-warning';
      case 'doubtful':
        return 'text-warning';
      case 'out':
      case 'ir':
        return 'text-error';
      default:
        return 'text-base-content';
    }
  };

  const getInjuryStyles = () => {
    return {};
  };

  const renderPlayerImage = (size: 'sm' | 'lg' = 'lg') => {
    const sizeClasses = size === 'sm' ? 'w-12 h-12' : 'w-16 h-16';
    const teamLogoUrl = `https://a.espncdn.com/i/teamlogos/nfl/500/${player.team.toLowerCase()}.png`;
    
    return (
      <div className={`${sizeClasses} rounded-full bg-base-200 flex items-center justify-center overflow-hidden`}>
        <img 
          src={teamLogoUrl} 
          alt={`${player.team} logo`}
          className="w-full h-full object-cover"
        />
      </div>
    );
  };

  if (variant === 'trade') {
    return (
      <div 
        className="rounded p-4 transition-all duration-300 cursor-pointer group hover:shadow-lg hover:scale-[1.01] border border-base-300 bg-base-100"
        style={getInjuryStyles()}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {renderPlayerImage('sm')}
            <div>
              <h3 className="font-bold text-base text-base-content group-hover:text-primary transition-colors font-tomorrow">
                {player.name}
              </h3>
              <div className="flex items-center space-x-1.5">
                <span className="text-xs font-semibold text-base-content/70 bg-base-200 px-1.5 py-0.5 rounded font-noto">
                  {player.team}
                </span>
                <span className={`text-xs px-2 py-0.5 rounded-md font-bold ${getPositionColor()}`}>
                  {player.position}
                </span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <div className="text-right bg-success/10 rounded px-2 py-1">
              <p className="text-sm font-bold text-success">
                {player.stats.fantasyPoints.ppr.toFixed(1)} pts
              </p>
              <p className="text-xs text-success/80">PPR</p>
            </div>
            {onRemove && (
              <button
                onClick={() => onRemove(player.id)}
                className="p-1.5 text-base-content/40 hover:text-error hover:bg-error/10 rounded transition-all duration-200"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className={`rounded p-4 transition-all duration-300 cursor-pointer group hover:shadow-lg hover:scale-[1.01] border ${
        player.injuryStatus === 'healthy' ? 'border-base-300 bg-base-100' : ''
      }`}
      style={getInjuryStyles()}
    >
      {/* Season Status Banner */}
      {player.stats.gamesPlayed === 0 && (
        <div className="mb-4 p-3 bg-info/10 border border-info/20 rounded">
          <div className="flex items-center space-x-2">
            <Calendar className="w-4 h-4 text-info" />
            <span className="text-sm font-semibold text-info">2025 Season Preview</span>
          </div>
          <p className="text-xs text-info/80 mt-1">
            Stats shown are projections for the upcoming season
          </p>
        </div>
      )}
      
      {/* Main Player Info */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-2">
          {renderPlayerImage('lg')}
          <div>
            <h3 className="font-bold text-lg text-base-content group-hover:text-primary transition-colors mb-1 font-tomorrow">
              {player.name}
            </h3>
            <div className="flex items-center space-x-1.5">
              <span className="text-xs font-semibold text-base-content/70 bg-base-200 px-1.5 py-0.5 rounded font-noto">
                {player.team}
              </span>
              <span className={`text-xs px-2 py-0.5 rounded-md font-bold ${getPositionColor()}`}>
                {player.position}
              </span>
              {player.injuryStatus !== 'healthy' && (
                <div className={`flex items-center space-x-1 px-1.5 py-0.5 rounded ${
                  player.injuryStatus === 'questionable' || player.injuryStatus === 'doubtful' 
                    ? 'bg-warning/20' 
                    : 'bg-error/20'
                }`}>
                  <AlertCircle className={`w-3 h-3 ${
                    player.injuryStatus === 'questionable' || player.injuryStatus === 'doubtful'
                      ? 'text-warning' 
                      : 'text-error'
                  }`} />
                  <span className={`text-xs font-bold ${
                    player.injuryStatus === 'questionable' || player.injuryStatus === 'doubtful'
                      ? 'text-warning' 
                      : 'text-error'
                  }`}>
                    {player.injuryStatus.toUpperCase()}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="text-right bg-success/10 rounded p-3 shadow-sm">
          <div className="flex items-center space-x-1">
            {getTrendIcon()}
            {player.stats.gamesPlayed > 0 ? (
              <span className="text-lg font-bold text-success">
                {player.stats.fantasyPoints.ppr.toFixed(1)}
              </span>
            ) : (
              <span className="text-lg font-bold text-info">
                {player.projections.projectedPoints.ppr.toFixed(1)}
              </span>
            )}
          </div>
          <p className={`text-xs font-semibold mt-0.5 ${player.stats.gamesPlayed > 0 ? 'text-success/70' : 'text-info/70'}`}>
            {player.stats.gamesPlayed > 0 ? 'Season PPR' : 'Proj PPR'}
          </p>
        </div>
      </div>
      
      {/* Stats Sections */}
      <div className="space-y-4 mb-4">
        {/* Current Season Stats */}
        {player.stats.gamesPlayed > 0 ? (
          <div>
            <h4 className="text-sm font-bold text-base-content mb-3 flex items-center space-x-2">
              <Activity className="w-4 h-4 text-success" />
              <span>2025 Season Stats</span>
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="bg-success/10 rounded p-3 text-center shadow-sm border border-success/20">
                <div className="flex items-center justify-center space-x-1 mb-1">
                  <span className="text-xs font-semibold text-success/70">Total Points</span>
                </div>
                <span className="text-sm font-bold text-success">
                  {player.stats.fantasyPoints.ppr.toFixed(1)}
                </span>
              </div>
              
              <div className="bg-success/10 rounded p-3 text-center shadow-sm border border-success/20">
                <div className="flex items-center justify-center space-x-1 mb-1">
                  <span className="text-xs font-semibold text-success/70">Avg/Game</span>
                </div>
                <span className="text-sm font-bold text-success">
                  {player.stats.avgPointsPerGame.ppr.toFixed(1)}
                </span>
              </div>
              
              <div className="bg-success/10 rounded p-3 text-center shadow-sm border border-success/20">
                <div className="flex items-center justify-center space-x-1 mb-1">
                  <span className="text-xs font-semibold text-success/70">Games</span>
                </div>
                <span className="text-sm font-bold text-success">
                  {player.stats.gamesPlayed}
                </span>
              </div>
              
              <div className="bg-success/10 rounded p-3 text-center shadow-sm border border-success/20">
                <div className="flex items-center justify-center space-x-1 mb-1">
                  <span className="text-xs font-semibold text-success/70">Rank</span>
                </div>
                <span className="text-sm font-bold text-success">
                  #{player.stats.positionRank}
                </span>
              </div>
            </div>
          </div>
        ) : null}
        
        {/* Projected Stats */}
        <div>
          <h4 className="text-sm font-bold text-base-content mb-3 flex items-center space-x-2">
            <TrendingUp className="w-4 h-4 text-info" />
            <span>{player.stats.gamesPlayed > 0 ? 'Rest of Season' : '2025 Season'} Projections</span>
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="bg-info/10 rounded p-3 text-center shadow-sm border border-info/20">
              <div className="flex items-center justify-center space-x-1 mb-1">
                <span className="text-xs font-semibold text-info/70">Proj Points</span>
              </div>
              <span className="text-sm font-bold text-info">
                {player.projections.projectedPoints.ppr.toFixed(1)}
              </span>
            </div>
            
            <div className="bg-info/10 rounded p-3 text-center shadow-sm border border-info/20">
              <div className="flex items-center justify-center space-x-1 mb-1">
                <span className="text-xs font-semibold text-info/70">Games Left</span>
              </div>
              <span className="text-sm font-bold text-info">
                {player.projections.remainingGames}
              </span>
            </div>
            
            <div className="bg-info/10 rounded p-3 text-center shadow-sm border border-info/20">
              <div className="flex items-center justify-center space-x-1 mb-1">
                <span className="text-xs font-semibold text-info/70">Confidence</span>
              </div>
              <span className="text-sm font-bold text-info">
                {player.projections.confidenceScore}%
              </span>
            </div>
            
            <div className="bg-warning/10 rounded p-3 text-center shadow-sm border border-warning/20">
              <div className="flex items-center justify-center space-x-1 mb-1">
                <Calendar className="w-3 h-3 text-warning" />
                <span className="text-xs font-semibold text-warning/70">Bye Week</span>
              </div>
              <span className="text-sm font-bold text-warning">
                {player.byeWeek}
              </span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Detailed Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
        <div className="bg-base-200 rounded p-3 text-center shadow-sm border border-base-300">
          <div className="flex items-center justify-center space-x-1 mb-1">
            <Target className="w-3 h-3 text-info" />
            <span className="text-xs font-semibold text-base-content/60">Rank</span>
          </div>
          <span className="text-sm font-bold text-info">
            #{player.stats.positionRank}
          </span>
        </div>
        
        <div className="bg-base-200 rounded p-3 text-center shadow-sm border border-base-300">
          <div className="flex items-center justify-center space-x-1 mb-1">
            <Activity className="w-3 h-3 text-secondary" />
            <span className="text-xs font-semibold text-base-content/60">Avg/Game</span>
          </div>
          <span className="text-sm font-bold text-secondary">
            {player.stats.avgPointsPerGame.ppr.toFixed(1)}
          </span>
        </div>
        
        <div className="bg-base-200 rounded p-3 text-center shadow-sm border border-base-300">
          <div className="flex items-center justify-center space-x-1 mb-1">
            <TrendingUp className="w-3 h-3 text-success" />
            <span className="text-xs font-semibold text-base-content/60">Projected</span>
          </div>
          <span className="text-sm font-bold text-success">
            {player.projections.projectedPoints.ppr.toFixed(1)}
          </span>
        </div>
        
        <div className="bg-base-200 rounded p-3 text-center shadow-sm border border-base-300">
          <div className="flex items-center justify-center space-x-1 mb-1">
            <Calendar className="w-3 h-3 text-warning" />
            <span className="text-xs font-semibold text-base-content/60">Bye Week</span>
          </div>
          <span className="text-sm font-bold text-warning">
            {player.byeWeek}
          </span>
        </div>
      </div>
      
      {/* Additional Info Row */}
      <div className="flex items-center justify-between text-xs mb-3 bg-base-200 rounded p-2">
        <div className="flex items-center space-x-4 text-base-content/70">
          <span className="font-medium">Games: <span className="font-bold text-base-content">{player.stats.gamesPlayed}</span></span>
          <span className="font-medium">Confidence: <span className="font-bold text-base-content">{player.projections.confidenceScore}%</span></span>
        </div>
        <div className="flex items-center space-x-1 bg-base-100 rounded px-2 py-1">
          <span className="text-base-content/60 font-medium">Trend:</span>
          {getTrendIcon()}
          <span className="capitalize font-semibold text-base-content">{player.stats.trend}</span>
        </div>
      </div>
      
      <div className="text-xs font-medium text-base-content/60">
        <span className="font-medium">Position Rank: </span>
        <span className="font-bold text-info">#{player.stats.positionRank}</span>
      </div>
      
      {/* Action Buttons */}
      <div className="flex items-center justify-between">
        <div className="text-xs font-medium text-base-content/60 bg-info/10 rounded px-2 py-1">
          <span className="text-info font-bold">{player.projections.remainingGames}</span> games left
        </div>
        
        <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
          {onSelect && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onSelect(player, 'user1');
                }}
                className="btn btn-info btn-xs text-xs flex items-center space-x-1 transition-all duration-200 font-semibold"
              >
                <Plus className="w-3 h-3" />
                <span>Team 1</span>
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onSelect(player, 'user2');
                }}
                className="btn btn-success btn-xs text-xs flex items-center space-x-1 transition-all duration-200 font-semibold"
              >
                <Plus className="w-3 h-3" />
                <span>Team 2</span>
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};