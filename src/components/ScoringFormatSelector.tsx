import React from 'react';

interface ScoringFormatSelectorProps {
  selectedFormat: 'standard' | 'halfPpr' | 'ppr';
  onFormatChange: (format: 'standard' | 'halfPpr' | 'ppr') => void;
}

export const ScoringFormatSelector: React.FC<ScoringFormatSelectorProps> = ({
  selectedFormat,
  onFormatChange
}) => {
  const formats = [
    { key: 'standard' as const, label: 'Standard', description: 'No PPR' },
    { key: 'halfPpr' as const, label: 'Half PPR', description: '0.5 per reception' },
    { key: 'ppr' as const, label: 'PPR', description: '1.0 per reception' }
  ];

  return (
    <div className="flex items-center space-x-1 bg-base-200 rounded p-1">
      <span className="text-xs font-medium text-base-content/60 px-2 hidden sm:inline">
        Scoring:
      </span>
        {formats.map((format) => (
          <button
            key={format.key}
            onClick={() => onFormatChange(format.key)}
            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
              selectedFormat === format.key
                ? 'bg-base-100 text-base-content shadow-sm'
                : 'text-base-content/60 hover:text-base-content hover:bg-base-100/50'
            }`}
            title={format.description}
          >
            <span className="hidden sm:inline">{format.label}</span>
            <span className="sm:hidden">{format.key === 'standard' ? 'STD' : format.key === 'halfPpr' ? '0.5' : 'PPR'}</span>
          </button>
        ))}
    </div>
  );
};