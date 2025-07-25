import React from 'react';
import { BarChart3, RefreshCw } from 'lucide-react';
import { ScoringFormatSelector } from './ScoringFormatSelector';

interface HeaderProps {
  lastUpdated: Date | null;
  playersCount: number;
  onRefresh: () => void;
  scoringFormat: 'standard' | 'halfPpr' | 'ppr';
  onScoringFormatChange: (format: 'standard' | 'halfPpr' | 'ppr') => void;
}

export const Header: React.FC<HeaderProps> = ({
  lastUpdated,
  playersCount,
  onRefresh,
  scoringFormat,
  onScoringFormatChange
}) => {
  return (
    <header className="bg-base-100 shadow-sm border-b border-base-300 transition-colors">
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="bg-primary p-3 rounded shadow-lg">
              <BarChart3 className="w-8 h-8 text-primary-content" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-base-content font-tomorrow">
                Fantasy Trade AI
              </h1>
              <p className="text-base-content/70 text-sm mt-1 font-noto">
                AI-powered trade evaluation and optimization
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <ScoringFormatSelector 
              selectedFormat={scoringFormat}
              onFormatChange={onScoringFormatChange}
            />
          </div>
        </div>
        
        {/* Data Status Bar */}
        {lastUpdated && (
          <div className="bg-success/10 border border-success/30 rounded p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-success rounded-full"></div>
                <span className="text-success text-sm font-medium">
                  Player data updated: {lastUpdated.toLocaleString()}
                </span>
                <span className="text-success/80 text-sm">
                  ({playersCount} players loaded)
                </span>
              </div>
              <button
                onClick={onRefresh}
                className="flex items-center space-x-1 text-success hover:text-success/70 transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                <span className="text-sm">Refresh</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};