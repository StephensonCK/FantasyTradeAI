import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
  className?: string;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({ 
  message, 
  onRetry, 
  className = '' 
}) => {
  return (
    <div className={`bg-error/10 border border-error/20 rounded p-6 ${className}`}>
      <div className="flex items-center space-x-3 mb-3">
        <AlertTriangle className="w-6 h-6 text-error" />
        <h3 className="text-lg font-semibold text-error font-tomorrow">Error</h3>
      </div>
      <p className="text-error-content mb-4 font-noto">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="btn btn-error flex items-center space-x-2 font-medium"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Try Again</span>
        </button>
      )}
    </div>
  );
};