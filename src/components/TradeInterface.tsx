import React from 'react';
import { ArrowLeftRight, BarChart3, Trash2, Users } from 'lucide-react';
import { Player } from '../types';
import { PlayerCard } from './PlayerCard';

interface TradeInterfaceProps {
  selectedPlayers: {
    user1: Player[];
    user2: Player[];
  };
  onRemovePlayer: (playerId: string, side: 'user1' | 'user2') => void;
  onAnalyzeTrade: () => void;
  onClearTrade: () => void;
}

export const TradeInterface: React.FC<TradeInterfaceProps> = ({
  selectedPlayers,
  onRemovePlayer,
  onAnalyzeTrade,
  onClearTrade
}) => {
  const canAnalyze = selectedPlayers.user1.length > 0 && selectedPlayers.user2.length > 0;
  
  const getTotalValue = (players: Player[]) => {
    return players.reduce((sum, player) => sum + player.stats.fantasyPoints.ppr, 0);
  };

  return (
    <div className="bg-base-100 rounded shadow-lg border border-base-300 transition-colors">
      <div className="p-6 border-b border-base-300">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-base-content font-tomorrow">Trade Setup</h2>
          <div className="flex space-x-1 sm:space-x-2">
            <button
              onClick={onClearTrade}
              className="btn btn-ghost btn-sm flex items-center space-x-1 text-base-content/60 hover:text-error min-w-0 flex-shrink-0"
            >
              <Trash2 className="w-4 h-4" />
              <span className="text-sm hidden xs:inline">Clear</span>
            </button>
            <button
              onClick={onAnalyzeTrade}
              disabled={!canAnalyze}
              className={`btn flex items-center space-x-1 sm:space-x-2 font-medium transition-all min-w-0 flex-shrink-0 ${
                canAnalyze
                  ? 'btn-success'
                  : 'btn-disabled'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              <span className="hidden xs:inline">Analyze Trade</span>
              <span className="xs:hidden">Analyze</span>
            </button>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative">
          {/* Team 1 */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-info/10 rounded flex items-center justify-center">
                  <Users className="w-4 h-4 text-info" />
                </div>
                <h3 className="text-lg font-semibold text-base-content font-tomorrow">Team 1</h3>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-base-content">
                  {getTotalValue(selectedPlayers.user1).toFixed(1)} pts
                </p>
                <p className="text-xs text-base-content/50">Total Value</p>
              </div>
            </div>
            
            <div className="min-h-32 border-2 border-dashed border-base-300 rounded p-4">
              {selectedPlayers.user1.length === 0 ? (
                <div className="flex items-center justify-center h-24 text-base-content/40">
                  <div className="text-center">
                    <Users className="w-8 h-8 mx-auto mb-2" />
                    <p className="text-sm">Add players to Team 1</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  {selectedPlayers.user1.map(player => (
                    <PlayerCard
                      key={player.id}
                      player={player}
                      onRemove={(playerId) => onRemovePlayer(playerId, 'user1')}
                      variant="trade"
                    />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Trade Arrow */}
          <div className="hidden md:flex absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
            <div className="bg-base-100 border-2 border-base-300 rounded-full p-4 shadow-lg">
              <ArrowLeftRight className="w-6 h-6 text-base-content/60" />
            </div>
          </div>
          
          {/* Mobile Trade Arrow */}
          <div className="md:hidden flex justify-center py-4">
            <div className="bg-base-100 border-2 border-base-300 rounded-full p-3 shadow-lg">
              <ArrowLeftRight className="w-5 h-5 text-base-content/60 rotate-90" />
            </div>
          </div>

          {/* Team 2 */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-success/10 rounded flex items-center justify-center">
                  <Users className="w-4 h-4 text-success" />
                </div>
                <h3 className="text-lg font-semibold text-base-content font-tomorrow">Team 2</h3>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-base-content">
                  {getTotalValue(selectedPlayers.user2).toFixed(1)} pts
                </p>
                <p className="text-xs text-base-content/50">Total Value</p>
              </div>
            </div>
            
            <div className="min-h-32 border-2 border-dashed border-base-300 rounded p-4">
              {selectedPlayers.user2.length === 0 ? (
                <div className="flex items-center justify-center h-24 text-base-content/40">
                  <div className="text-center">
                    <Users className="w-8 h-8 mx-auto mb-2" />
                    <p className="text-sm">Add players to Team 2</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  {selectedPlayers.user2.map(player => (
                    <PlayerCard
                      key={player.id}
                      player={player}
                      onRemove={(playerId) => onRemovePlayer(playerId, 'user2')}
                      variant="trade"
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Trade Summary */}
        {canAnalyze && (
          <div className="mt-6 p-4 bg-base-200 rounded">
            <div className="flex items-center justify-between text-sm">
              <span className="text-base-content/60">
                Team 1: {selectedPlayers.user1.length} player{selectedPlayers.user1.length !== 1 ? 's' : ''}
              </span>
              <span className="text-base-content/60">
                Team 2: {selectedPlayers.user2.length} player{selectedPlayers.user2.length !== 1 ? 's' : ''}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};