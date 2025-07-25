import React, { useState, useMemo } from 'react';
import { Search, Filter, X, Users, RefreshCw } from 'lucide-react';
import { Player } from '../types';
import { PlayerCard } from './PlayerCard';
import { AutoComplete } from './AutoComplete';
import { useDebounce } from '../hooks/useDebounce';

interface PlayerSearchProps {
  players: Player[];
  onPlayerSelect: (player: Player, side: 'user1' | 'user2') => void;
  scoringFormat: 'standard' | 'halfPpr' | 'ppr';
}

export const PlayerSearch: React.FC<PlayerSearchProps> = ({ 
  players, 
  onPlayerSelect, 
  scoringFormat 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPosition, setSelectedPosition] = useState<string>('all');
  const [selectedTeam, setSelectedTeam] = useState<string>('all');
  const [selectedInjuryStatus, setSelectedInjuryStatus] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState<'points' | 'rank' | 'name'>('points');

  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  const positions = ['all', 'QB', 'RB', 'WR', 'TE', 'K', 'DEF'];
  const teams = useMemo(() => {
    const uniqueTeams = [...new Set(players.map(p => p.team))].sort();
    return ['all', ...uniqueTeams];
  }, [players]);
  
  const injuryStatuses = ['all', 'healthy', 'questionable', 'doubtful', 'out', 'ir'];

  // Generate autocomplete suggestions
  const suggestions = useMemo(() => {
    const playerNames = players.map(p => p.name);
    const teamNames = [...new Set(players.map(p => p.team))];
    return [...playerNames, ...teamNames];
  }, [players]);

  const filteredPlayers = useMemo(() => {
    let filtered = players.filter(player => {
      const matchesSearch = player.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
                          player.team.toLowerCase().includes(debouncedSearchTerm.toLowerCase());
      const matchesPosition = selectedPosition === 'all' || player.position === selectedPosition;
      const matchesTeam = selectedTeam === 'all' || player.team === selectedTeam;
      const matchesInjury = selectedInjuryStatus === 'all' || player.injuryStatus === selectedInjuryStatus;
      
      return matchesSearch && matchesPosition && matchesTeam && matchesInjury;
    });

    // Sort players
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'points':
          return b.stats.fantasyPoints[scoringFormat] - a.stats.fantasyPoints[scoringFormat];
        case 'rank':
          return a.stats.positionRank - b.stats.positionRank;
        case 'name':
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });

    return filtered;
  }, [players, debouncedSearchTerm, selectedPosition, selectedTeam, selectedInjuryStatus, sortBy, scoringFormat]);

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedPosition('all');
    setSelectedTeam('all');
    setSelectedInjuryStatus('all');
    setSortBy('points');
  };

  const hasActiveFilters = selectedPosition !== 'all' || selectedTeam !== 'all' || 
                          selectedInjuryStatus !== 'all' || searchTerm !== '';

  return (
    <div className="bg-base-100 rounded shadow-lg border border-base-300 transition-colors">
      <div className="p-6 border-b border-base-300">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-base-content font-tomorrow">Player Search</h2>
          <div className="flex items-center space-x-2">
            {hasActiveFilters && (
              <span className="bg-success/10 text-success text-xs px-2 py-1 rounded-full">
                {filteredPlayers.length} results
              </span>
            )}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center space-x-1 px-3 py-2 rounded-lg transition-all ${
                showFilters 
                  ? 'bg-primary/10 text-primary' 
                  : 'text-base-content/60 hover:text-primary hover:bg-primary/10'
              }`}
            >
              <Filter className="w-4 h-4" />
              <span className="text-sm">Filters</span>
            </button>
          </div>
        </div>
        
        {/* Search Input with Autocomplete */}
        <AutoComplete
          suggestions={suggestions}
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder="Search players or teams..."
        />
        
        {/* Filters */}
        {showFilters && (
          <div className="mt-4 space-y-4 p-4 bg-base-200 rounded">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-base-content mb-2">Position</label>
                <select
                  value={selectedPosition}
                  onChange={(e) => setSelectedPosition(e.target.value)}
                  className="select select-bordered w-full"
                >
                  {positions.map(pos => (
                    <option key={pos} value={pos}>
                      {pos === 'all' ? 'All Positions' : pos}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-base-content mb-2">Team</label>
                <select
                  value={selectedTeam}
                  onChange={(e) => setSelectedTeam(e.target.value)}
                  className="select select-bordered w-full"
                >
                  {teams.map(team => (
                    <option key={team} value={team}>
                      {team === 'all' ? 'All Teams' : team}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-base-content mb-2">Injury Status</label>
                <select
                  value={selectedInjuryStatus}
                  onChange={(e) => setSelectedInjuryStatus(e.target.value)}
                  className="select select-bordered w-full"
                >
                  {injuryStatuses.map(status => (
                    <option key={status} value={status}>
                      {status === 'all' ? 'All Statuses' : status.charAt(0).toUpperCase() + status.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-base-content mb-2">Sort By</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as 'points' | 'rank' | 'name')}
                  className="select select-bordered w-full"
                >
                  <option value="points">Fantasy Points</option>
                  <option value="rank">Position Rank</option>
                  <option value="name">Name (A-Z)</option>
                </select>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <button
                onClick={clearFilters}
                className="flex items-center space-x-1 text-base-content/60 hover:text-error transition-colors"
              >
                <X className="w-4 h-4" />
                <span className="text-sm">Clear All Filters</span>
              </button>
              
              <span className="text-sm text-base-content/50">
                {filteredPlayers.length} of {players.length} players
              </span>
            </div>
          </div>
        )}
      </div>
      
      {/* Player List */}
      <div className="max-h-96 overflow-y-auto">
        {filteredPlayers.length === 0 ? (
          <div className="p-8 text-center text-base-content/50">
            <Users className="w-12 h-12 mx-auto mb-3 text-base-content/30" />
            <p>No players found matching your criteria</p>
            <button 
              onClick={clearFilters}
              className="text-primary hover:text-primary/80 text-sm mt-2 underline"
            >
              Clear filters to see all players
            </button>
          </div>
        ) : (
          <div className="p-4 space-y-2">
            {filteredPlayers.map(player => (
              <PlayerCard
                key={player.id}
                player={player}
                onSelect={onPlayerSelect}
                variant="search"
              />
            ))}
          </div>
        )}
      </div>
      
      <div className="p-4 bg-base-200 text-center text-sm text-base-content/60 rounded-b">
        Showing {filteredPlayers.length} of {players.length} players
      </div>
    </div>
  );
};