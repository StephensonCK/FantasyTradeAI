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

  const renderPlayerImage = (size: 'sm' | 'lg' = 'lg') => {
    const sizeClasses = size === 'sm' ? 'w-12 h-12' : 'w-16 h-16';
    const teamLogoUrl = `https://a.espncdn.com/i/teamlogos/nfl/500/${player.team.toLowerCase()}.png`;
    
    return (
      <div className={`${sizeClasses} rounded-xl overflow-hidden bg-base-100 shadow-md border border-base-300`}>
        <img
          src={teamLogoUrl}
          alt={`${player.team} logo`}
          className="w-full h-full object-contain p-1.5"
        />
      </div>
    );
  };

  const getCardStatusStyling = () => {
    switch (player.injuryStatus) {
      case 'questionable':
      case 'doubtful':
        return '!border-warning !bg-warning/20 shadow-lg shadow-warning/30 !border-2';
      case 'out':
      case 'ir':
        return '!border-error !bg-error/20 shadow-lg shadow-error/30 !border-2';
      default:
        return 'border-base-300 bg-base-100';
    }
  };

  if (variant === 'trade') {
    return (
      <div className={`rounded p-4 shadow-md hover:shadow-lg transition-all duration-300 hover:scale-[1.01] border ${
        player.injuryStatus === 'questionable' || player.injuryStatus === 'doubtful'
          ? '!border-warning !bg-warning/20 !shadow-warning/30 !border-2'
          : player.injuryStatus === 'out' || player.injuryStatus === 'ir'
          ? '!border-error !bg-error/20 !shadow-error/30 !border-2'
          : 'border-base-300 bg-base-100'
      }`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {renderPlayerImage('sm')}
            <div>
              <h3 className="font-semibold text-base text-base-content">{player.name}</h3>
              <div className="flex items-center space-x-1.5 mt-0.5">
                <span className="text-xs font-medium text-base-content/60">{player.team}</span>
                <span className={`text-xs px-1.5 py-0.5 rounded-md font-semibold ${getPositionColor()}`}>
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
    <div className={`rounded p-4 transition-all duration-300 cursor-pointer group hover:shadow-lg hover:scale-[1.01] border ${
      player.injuryStatus === 'questionable' || player.injuryStatus === 'doubtful'
        ? '!border-warning !bg-warning/20 !shadow-warning/30 !border-2'
        : player.injuryStatus === 'out' || player.injuryStatus === 'ir'
        ? '!border-error !bg-error/20 !shadow-error/30 !border-2'
        : 'border-base-300 bg-base-100'
    }`}>
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
                    ? 'bg-warning/20 border border-warning/40' 
                    : 'bg-error/20 border border-error/40'
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
            <span className="text-lg font-bold text-success">
              {player.stats.fantasyPoints.ppr.toFixed(1)}
            </span>
          </div>
          <p className="text-xs font-semibold text-success/70 mt-0.5">PPR Points</p>
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