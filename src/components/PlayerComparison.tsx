import React from 'react';
import { TrendingUp, TrendingDown, Minus, Target, Activity } from 'lucide-react';
import { Player } from '../types';

interface PlayerComparisonProps {
  player1: Player;
  player2: Player;
  scoringFormat: 'standard' | 'halfPpr' | 'ppr';
}

export const PlayerComparison: React.FC<PlayerComparisonProps> = ({
  player1,
  player2,
  scoringFormat
}) => {
  const getPlayerStats = (player: Player) => ({
    points: player.stats.fantasyPoints[scoringFormat],
    avgPoints: player.stats.avgPointsPerGame[scoringFormat],
    projectedPoints: player.projections.projectedPoints[scoringFormat]
  });

  const stats1 = getPlayerStats(player1);
  const stats2 = getPlayerStats(player2);

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="w-4 h-4 text-success" />;
      case 'down':
        return <TrendingDown className="w-4 h-4 text-error" />;
      default:
        return <Minus className="w-4 h-4 text-base-content/40" />;
    }
  };

  const getPositionColor = (position: string) => {
    switch (position) {
      case 'QB': return 'bg-secondary/20 text-secondary';
      case 'RB': return 'bg-success/20 text-success';
      case 'WR': return 'bg-info/20 text-info';
      case 'TE': return 'bg-warning/20 text-warning';
      case 'K': return 'bg-accent/20 text-accent';
      case 'DEF': return 'bg-error/20 text-error';
      default: return 'bg-base-300 text-base-content';
    }
  };

  const ComparisonBar: React.FC<{ 
    label: string; 
    value1: number; 
    value2: number; 
    suffix?: string;
    icon?: React.ReactNode;
  }> = ({ label, value1, value2, suffix = '', icon }) => {
    const max = Math.max(value1, value2);
    const percentage1 = max > 0 ? (value1 / max) * 100 : 0;
    const percentage2 = max > 0 ? (value2 / max) * 100 : 0;

    return (
      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          {icon}
          <span className="text-sm font-medium text-slate-700">{label}</span>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-slate-600">{player1.name}</span>
              <span className="font-medium">{value1.toFixed(1)}{suffix}</span>
            </div>
            <div className="w-full bg-blue-100 rounded-full h-2">
              <div
                className="bg-info h-2 rounded-full transition-all duration-1000"
                style={{ width: `${percentage1}%` }}
              />
            </div>
          </div>
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-slate-600">{player2.name}</span>
              <span className="font-medium">{value2.toFixed(1)}{suffix}</span>
            </div>
            <div className="w-full bg-emerald-100 rounded-full h-2">
              <div
                className="bg-success h-2 rounded-full transition-all duration-1000"
                style={{ width: `${percentage2}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-base-100 rounded shadow-lg border border-base-300 p-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="bg-primary p-3 rounded">
          <Target className="w-5 h-5 text-primary-content" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-base-content font-tomorrow">Player Comparison</h3>
          <p className="text-base-content/60 text-sm font-noto">Head-to-head analysis</p>
        </div>
      </div>

      {/* Player Headers */}
      <div className="grid grid-cols-2 gap-6 mb-6">
        <div className="text-center">
          <div className="flex items-center justify-center space-x-2 mb-2">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPositionColor(player1.position)}`}>
              {player1.position}
            </span>
            {getTrendIcon(player1.stats.trend)}
          </div>
          <h4 className="font-semibold text-slate-800">{player1.name}</h4>
          <h4 className="font-semibold text-base-content font-tomorrow">{player1.name}</h4>
          <p className="text-sm text-base-content/60 font-noto">{player1.team}</p>
        </div>
        <div className="text-center">
          <div className="flex items-center justify-center space-x-2 mb-2">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPositionColor(player2.position)}`}>
              {player2.position}
            </span>
            {getTrendIcon(player2.stats.trend)}
          </div>
          <h4 className="font-semibold text-base-content font-tomorrow">{player2.name}</h4>
          <p className="text-sm text-base-content/60 font-noto">{player2.team}</p>
        </div>
      </div>

      {/* Comparison Metrics */}
      <div className="space-y-6">
        <ComparisonBar
          label="Total Fantasy Points"
          value1={stats1.points}
          value2={stats2.points}
          suffix=" pts"
          icon={<BarChart3 className="w-4 h-4 text-base-content/50" />}
        />
        
        <ComparisonBar
          label="Average Points Per Game"
          value1={stats1.avgPoints}
          value2={stats2.avgPoints}
          suffix=" pts"
          icon={<Activity className="w-4 h-4 text-base-content/50" />}
        />
        
        <ComparisonBar
          label="Projected Points (Rest of Season)"
          value1={stats1.projectedPoints}
          value2={stats2.projectedPoints}
          suffix=" pts"
          icon={<Target className="w-4 h-4 text-base-content/50" />}
        />

        <div className="grid grid-cols-2 gap-6 pt-4 border-t border-base-300">
          <div className="text-center">
            <div className="text-2xl font-bold text-base-content">#{player1.stats.positionRank}</div>
            <div className="text-xs text-base-content/60">Position Rank</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-base-content">#{player2.stats.positionRank}</div>
            <div className="text-xs text-base-content/60">Position Rank</div>
          </div>
        </div>
      </div>
    </div>
  );
};