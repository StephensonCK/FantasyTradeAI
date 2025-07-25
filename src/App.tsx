import React, { useState } from 'react';
import { RefreshCw } from 'lucide-react';
import { Header } from './components/Header';
import { PlayerSearch } from './components/PlayerSearch';
import { TradeInterface } from './components/TradeInterface';
import { TradeAnalysis } from './components/TradeAnalysis';
import { TradeHistory } from './components/TradeHistory';
import { PlayerComparison } from './components/PlayerComparison';
import { ScoringFormatSelector } from './components/ScoringFormatSelector';
import { DataStatus } from './components/DataStatus';
import { Footer } from './components/Footer';
import { LoadingSpinner } from './components/LoadingSpinner';
import { ErrorMessage } from './components/ErrorMessage';
import { Player, Trade } from './types';
import { useFantasyData } from './hooks/useFantasyData';
import { useLocalStorage } from './hooks/useLocalStorage';
import { useTheme } from './hooks/useTheme';

function App() {
  // Initialize theme
  useTheme();
  
  const { players, loading, error, lastUpdated, refetch } = useFantasyData();
  
  const [selectedPlayers, setSelectedPlayers] = useLocalStorage<{
    user1: Player[];
    user2: Player[];
  }>('tradeAnalyzer_selectedPlayers', {
    user1: [],
    user2: []
  });
  
  const [currentTrade, setCurrentTrade] = useState<Trade | null>(null);
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [tradeHistory, setTradeHistory] = useLocalStorage<Trade[]>('tradeAnalyzer_history', []);
  const [scoringFormat, setScoringFormat] = useLocalStorage<'standard' | 'halfPpr' | 'ppr'>('tradeAnalyzer_scoringFormat', 'ppr');
  const [showComparison, setShowComparison] = useState(false);
  const [comparisonPlayers, setComparisonPlayers] = useState<{ player1: Player | null; player2: Player | null }>({
    player1: null,
    player2: null
  });

  const addPlayerToTrade = (player: Player, side: 'user1' | 'user2') => {
    setSelectedPlayers(prev => ({
      ...prev,
      [side]: [...prev[side], player]
    }));
  };

  const removePlayerFromTrade = (playerId: string, side: 'user1' | 'user2') => {
    setSelectedPlayers(prev => ({
      ...prev,
      [side]: prev[side].filter(p => p.id !== playerId)
    }));
  };

  const analyzeTrade = () => {
    const trade: Trade = {
      id: Date.now().toString(),
      user1Players: selectedPlayers.user1,
      user2Players: selectedPlayers.user2,
      timestamp: new Date()
    };
    
    setCurrentTrade(trade);
    setShowAnalysis(true);
    
    // Add to history
    setTradeHistory(prev => [trade, ...prev].slice(0, 10)); // Keep only last 10 trades
  };

  const clearTrade = () => {
    setSelectedPlayers({ user1: [], user2: [] });
    setCurrentTrade(null);
    setShowAnalysis(false);
  };

  const clearTradeHistory = () => {
    setTradeHistory([]);
  };

  const handleTradeHistorySelect = (trade: Trade) => {
    setSelectedPlayers({
      user1: trade.user1Players,
      user2: trade.user2Players
    });
    setCurrentTrade(trade);
    setShowAnalysis(true);
  };

  const handlePlayerComparison = (player1: Player, player2: Player) => {
    setComparisonPlayers({ player1, player2 });
    setShowComparison(true);
  };

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-base-200">
        <Header />
        <main className="container mx-auto px-4 py-8 max-w-7xl">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <LoadingSpinner size="lg" className="text-emerald-600 mb-4" />
              <h2 className="text-xl font-semibold text-base-content mb-2">Loading Player Data</h2>
              <p className="text-base-content/70">Fetching the latest player information...</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen bg-base-200">
        <Header />
        <main className="container mx-auto px-4 py-8 max-w-7xl">
          <ErrorMessage 
            message={error}
            onRetry={refetch}
            className="max-w-2xl mx-auto"
          />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-200 transition-colors">
      <Header 
        lastUpdated={lastUpdated}
        playersCount={players.length}
        onRefresh={refetch}
        scoringFormat={scoringFormat}
        onScoringFormatChange={setScoringFormat}
      />
      
      <main className="container mx-auto px-4 py-8 max-w-7xl">


        <div className="space-y-8">
          {/* Player Search - Full Width */}
          <div>
            <PlayerSearch 
              players={players}
              onPlayerSelect={addPlayerToTrade}
              scoringFormat={scoringFormat}
            />
          </div>
          
          {/* Trade Interface - Full Width */}
          <div>
            <TradeInterface
              selectedPlayers={selectedPlayers}
              onRemovePlayer={removePlayerFromTrade}
              onAnalyzeTrade={analyzeTrade}
              onClearTrade={clearTrade}
            />
          </div>

          {/* Trade History - Full Width */}
          <div>
            <TradeHistory 
              trades={tradeHistory}
              onSelectTrade={handleTradeHistorySelect}
              onClearHistory={clearTradeHistory}
            />
          </div>
        </div>
        
        {/* Trade Analysis */}
        {showAnalysis && currentTrade && (
          <div className="mt-8">
            <TradeAnalysis 
              trade={currentTrade}
            />
          </div>
        )}

        {/* Player Comparison */}
        {showComparison && comparisonPlayers.player1 && comparisonPlayers.player2 && (
          <div className="mt-8">
            <PlayerComparison
              player1={comparisonPlayers.player1}
              player2={comparisonPlayers.player2}
              scoringFormat={scoringFormat}
            />
          </div>
        )}
      </main>
      
      <DataStatus 
        lastUpdated={lastUpdated}
        playersCount={players.length}
        onRefresh={refetch}
      />
      
      <Footer />
    </div>
  );
}

export default App;