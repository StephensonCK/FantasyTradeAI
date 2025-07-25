import React from 'react';
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
            <div className="p-4 rounded shadow-lg bg-primary">
              <img 
                src="/icons/file.svg" 
                alt="Fantasy Trade AI Logo" 
                className="w-12 h-12"
                style={{ filter: 'brightness(0) invert(1)' }}
              />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-base-content font-tomorrow">
                Fantasy Trade AI
              </h1>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <ScoringFormatSelector 
              selectedFormat={scoringFormat}
              onFormatChange={onScoringFormatChange}
            />
          </div>
        </div>
      </div>
    </header>
  );
};