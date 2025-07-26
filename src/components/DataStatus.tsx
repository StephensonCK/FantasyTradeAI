import React from 'react';
import { RefreshCw } from 'lucide-react';

interface DataStatusProps {
  lastUpdated: Date | null;
  playersCount: number;
  onRefresh: () => void;
}

export const DataStatus: React.FC<DataStatusProps> = ({
  lastUpdated,
  playersCount,
  onRefresh
}) => {
  if (!lastUpdated) return null;

  return (
    <div className="bg-base-100 border-t border-base-300 transition-colors">
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        <div className="bg-success/10 border border-success/30 rounded p-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-3 sm:space-y-0">
            <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-2">
              <div className="w-2 h-2 bg-success rounded-full"></div>
              <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-2">
                <span className="text-success text-sm font-medium">
                  Player data updated: {lastUpdated.toLocaleString()}
                </span>
                <span className="text-success/80 text-sm">
                  ({playersCount} players loaded)
                </span>
              </div>
            </div>
            <button
              onClick={onRefresh}
              className="flex items-center space-x-1 text-success hover:text-success/70 transition-colors self-start sm:self-auto"
            >
              <RefreshCw className="w-4 h-4" />
              <span className="text-sm">Refresh</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};