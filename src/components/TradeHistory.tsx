import React from 'react';
import { Clock, TrendingUp, BarChart3 } from 'lucide-react';
import { Trade } from '../types';

interface TradeHistoryProps {
  trades: Trade[];
  onSelectTrade: (trade: Trade) => void;
}

export const TradeHistory: React.FC<TradeHistoryProps> = ({ trades, onSelectTrade }) => {
  if (trades.length === 0) {
    return (
      <div className="bg-base-100 rounded shadow-lg border border-base-300 p-8 transition-colors">
        <div className="text-center text-base-content/50">
          <Clock className="w-12 h-12 mx-auto mb-3 text-base-content/30" />
          <p>No trade history yet</p>
          <p className="text-sm mt-1">Analyzed trades will appear here</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-base-100 rounded shadow-lg border border-base-300 transition-colors">
      <div className="p-6 border-b border-base-300">
        <div className="flex items-center space-x-3">
          <div className="bg-neutral p-3 rounded">
            <Clock className="w-5 h-5 text-neutral-content" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-base-content font-tomorrow">Trade History</h2>
            <p className="text-base-content/60 text-sm font-noto">Recent trade analyses</p>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {trades.map((trade) => (
            <div
              key={trade.id}
              onClick={() => onSelectTrade(trade)}
              className="p-4 border border-base-300 rounded hover:border-primary/30 hover:bg-primary/5 cursor-pointer transition-all"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <BarChart3 className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium text-base-content">
                    {trade.user1Players.length} ↔ {trade.user2Players.length} Player Trade
                  </span>
                </div>
                <span className="text-xs text-base-content/50">
                  {new Date(trade.timestamp).toLocaleDateString()}
                </span>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-base-content/60">Team 1:</span>
                  <div className="mt-1">
                    {trade.user1Players.map(player => (
                      <div key={player.id} className="text-base-content">
                        {player.name} ({player.position})
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <span className="text-base-content/60">Team 2:</span>
                  <div className="mt-1">
                    {trade.user2Players.map(player => (
                      <div key={player.id} className="text-base-content">
                        {player.name} ({player.position})
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};