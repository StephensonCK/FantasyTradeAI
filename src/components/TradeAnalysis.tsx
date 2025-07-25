import React from 'react';
import { BarChart3, TrendingUp, AlertTriangle, CheckCircle, Target } from 'lucide-react';
import { Trade, TradeAnalysis as Analysis } from '../types';
import { analyzeTradeAI } from '../utils/tradeAnalyzer';

interface TradeAnalysisProps {
  trade: Trade;
}

export const TradeAnalysis: React.FC<TradeAnalysisProps> = ({ trade }) => {
  const analysis = analyzeTradeAI(trade);
  
  const getGradeColor = (grade: string) => {
    switch (grade) {
      case 'A':
        return 'text-success bg-success/20';
      case 'B':
        return 'text-info bg-info/20';
      case 'C':
        return 'text-warning bg-warning/20';
      case 'D':
        return 'text-warning bg-warning/30';
      case 'F':
        return 'text-error bg-error/20';
      default:
        return 'text-base-content bg-base-200';
    }
  };

  const getWinnerDisplay = () => {
    switch (analysis.winner) {
      case 'user1':
        return { text: 'Team 1 Wins', icon: TrendingUp, color: 'text-info' };
      case 'user2':
        return { text: 'Team 2 Wins', icon: TrendingUp, color: 'text-success' };
      default:
        return { text: 'Even Trade', icon: CheckCircle, color: 'text-base-content' };
    }
  };

  const winner = getWinnerDisplay();
  const WinnerIcon = winner.icon;

  return (
    <div className="bg-base-100 rounded shadow-lg border border-base-300">
      <div className="p-6 border-b border-base-300">
        <div className="flex items-center space-x-3">
          <div className="bg-primary p-3 rounded">
            <BarChart3 className="w-6 h-6 text-primary-content" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-base-content font-tomorrow">AI Trade Analysis</h2>
            <p className="text-base-content/60 text-sm font-noto">Advanced statistical evaluation</p>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Overall Grade */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="text-center">
            <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl text-2xl font-bold ${getGradeColor(analysis.grade)}`}>
              {analysis.grade}
            </div>
            <p className="text-sm text-base-content/60 mt-2">Trade Grade</p>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <WinnerIcon className={`w-6 h-6 ${winner.color}`} />
              <span className={`text-lg font-semibold ${winner.color}`}>
                {winner.text}
              </span>
            </div>
            <p className="text-sm text-base-content/60">Trade Winner</p>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-base-content mb-2">
              {(analysis.confidence * 100).toFixed(0)}%
            </div>
            <p className="text-sm text-base-content/60">Confidence Score</p>
          </div>
        </div>

        {/* Value Comparison */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-base-content mb-4 flex items-center space-x-2 font-tomorrow">
            <Target className="w-5 h-5" />
            <span>Value Breakdown</span>
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-info/10 rounded p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-info">Team 1 Value</span>
                <span className="text-xl font-bold text-info">
                  {analysis.breakdown.user1Value.toFixed(1)}
                </span>
              </div>
              <div className="w-full bg-info/20 rounded-full h-2">
                <div 
                  className="bg-info h-2 rounded-full transition-all duration-1000"
                  style={{ 
                    width: `${(analysis.breakdown.user1Value / Math.max(analysis.breakdown.user1Value, analysis.breakdown.user2Value)) * 100}%` 
                  }}
                />
              </div>
            </div>
            
            <div className="bg-success/10 rounded p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-success">Team 2 Value</span>
                <span className="text-xl font-bold text-success">
                  {analysis.breakdown.user2Value.toFixed(1)}
                </span>
              </div>
              <div className="w-full bg-success/20 rounded-full h-2">
                <div 
                  className="bg-success h-2 rounded-full transition-all duration-1000"
                  style={{ 
                    width: `${(analysis.breakdown.user2Value / Math.max(analysis.breakdown.user1Value, analysis.breakdown.user2Value)) * 100}%` 
                  }}
                />
              </div>
            </div>
          </div>
          
          <div className="mt-4 text-center">
            <span className="text-sm text-base-content/60">
              Value Difference: <span className="font-medium">{Math.abs(analysis.breakdown.difference).toFixed(1)} points</span>
            </span>
          </div>
        </div>

        {/* Recommendations */}
        <div>
          <h3 className="text-lg font-semibold text-base-content mb-4 flex items-center space-x-2 font-tomorrow">
            <AlertTriangle className="w-5 h-5" />
            <span>AI Recommendations</span>
          </h3>
          
          <div className="space-y-3">
            {analysis.recommendations.map((recommendation, index) => (
              <div key={index} className="alert bg-warning text-warning-content border-warning/30 flex items-start space-x-3">
                <div className="w-6 h-6 bg-warning text-warning-content rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">
                  {index + 1}
                </div>
                <p className="flex-1 text-warning-content font-medium">{recommendation}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Fairness Score */}
        <div className="mt-8 p-6 bg-base-200 rounded">
          <div className="text-center">
            <h4 className="text-lg font-semibold text-base-content mb-2 font-tomorrow">Fairness Score</h4>
            <div className="relative w-32 h-32 mx-auto mb-4">
              <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 120 120">
                <circle
                  cx="60"
                  cy="60"
                  r="50"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="transparent"
                  className="text-base-300"
                />
                <circle
                  cx="60"
                  cy="60"
                  r="50"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="transparent"
                  strokeLinecap="round"
                  className="text-success"
                  strokeDasharray={`${2 * Math.PI * 50}`}
                  strokeDashoffset={`${2 * Math.PI * 50 * (1 - analysis.fairnessScore / 100)}`}
                  style={{ transition: 'stroke-dashoffset 1s ease-in-out' }}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-2xl font-bold text-base-content">
                  {analysis.fairnessScore.toFixed(0)}
                </span>
              </div>
            </div>
            <p className="text-base-content/60">
              {analysis.fairnessScore >= 80 ? 'Excellent' : 
               analysis.fairnessScore >= 60 ? 'Good' : 
               analysis.fairnessScore >= 40 ? 'Fair' : 'Poor'} trade balance
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};