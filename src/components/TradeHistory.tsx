import React from 'react';
import { Clock, TrendingUp, BarChart3, Trash2 } from 'lucide-react';
import { Trade } from '../types';

interface TradeHistoryProps {
  trades: Trade[];
  onSelectTrade: (trade: Trade) => void;
  onClearHistory: () => void;
}

export const TradeHistory: React.FC<TradeHistoryProps> = ({ trades, onSelectTrade, onClearHistory }) => {
  const [showConfirmDialog, setShowConfirmDialog] = React.useState(false);

  const handleClearHistory = () => {
    onClearHistory();
    setShowConfirmDialog(false);
  };

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
          <div className="flex-1">
            <h2 className="text-xl font-bold text-base-content font-tomorrow">Trade History</h2>
            <p className="text-base-content/60 text-sm font-noto">Recent trade analyses</p>
          </div>
          <button
            onClick={() => setShowConfirmDialog(true)}
            className="btn btn-ghost btn-sm flex items-center space-x-1 text-base-content/60 hover:text-error"
            title="Clear all trade history"
          >
            <Trash2 className="w-4 h-4" />
            <span className="hidden sm:inline">Clear History</span>
          </button>
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

      {/* Confirmation Dialog */}
      {showConfirmDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-base-100 rounded-lg shadow-xl border border-base-300 p-6 max-w-md mx-4">
            <div className="flex items-center space-x-3 mb-4">
              <div className="bg-error/10 p-3 rounded">
                <Trash2 className="w-6 h-6 text-error" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-base-content font-tomorrow">Clear Trade History</h3>
                <p className="text-base-content/60 text-sm font-noto">This action cannot be undone</p>
              </div>
            </div>
            
            <p className="text-base-content mb-6">
              Are you sure you want to delete all {trades.length} trade{trades.length !== 1 ? 's' : ''} from your history? 
              This will permanently remove all your saved trade analyses.
            </p>
            
            <div className="flex items-center justify-end space-x-3">
              <button
                onClick={() => setShowConfirmDialog(false)}
                className="btn btn-ghost"
              >
                Cancel
              </button>
              <button
                onClick={handleClearHistory}
                className="btn btn-error flex items-center space-x-2"
              >
                <Trash2 className="w-4 h-4" />
                <span>Clear History</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};