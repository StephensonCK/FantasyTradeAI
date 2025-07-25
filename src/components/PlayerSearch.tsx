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
  const [showTypeahead, setShowTypeahead] = useState(false);
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
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-base-content/40 w-5 h-5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onFocus={() => setShowTypeahead(true)}
            onBlur={() => setTimeout(() => setShowTypeahead(false), 150)}
            placeholder="Type to search players or teams..."
            className="input input-bordered w-full pl-10 pr-4"
            autoComplete="off"
          />
          
          {/* Typeahead Suggestions */}
          {showTypeahead && debouncedSearchTerm && filteredPlayers.length > 0 && (
            <div className="absolute z-50 w-full mt-1 bg-base-100 border border-base-300 rounded shadow-lg max-h-60 overflow-auto">
              {filteredPlayers.slice(0, 8).map((player) => (
                <div
                  key={player.id}
                  className="px-4 py-3 cursor-pointer hover:bg-base-200 transition-colors border-b border-base-300 last:border-b-0"
                  onMouseDown={(e) => e.preventDefault()} // Prevent blur from firing before click
                  onClick={() => {
                    setSearchTerm(player.name);
                    setShowTypeahead(false);
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded overflow-hidden bg-base-200 shadow-sm border border-base-300">
                        <img
                          src={`https://a.espncdn.com/i/teamlogos/nfl/500/${player.team.toLowerCase()}.png`}
                          alt={`${player.team} logo`}
                          className="w-full h-full object-contain p-1"
                        />
                      </div>
                      <div>
                        <div className="font-semibold text-base-content">{player.name}</div>
                        <div className="flex items-center space-x-2 text-sm text-base-content/60">
                          <span>{player.team}</span>
                          <span className={`px-1.5 py-0.5 rounded text-xs font-medium ${
                            player.position === 'QB' ? 'bg-secondary/20 text-secondary' :
                            player.position === 'RB' ? 'bg-success/20 text-success' :
                            player.position === 'WR' ? 'bg-info/20 text-info' :
                            player.position === 'TE' ? 'bg-warning/20 text-warning' :
                            player.position === 'K' ? 'bg-accent/20 text-accent' :
                            player.position === 'DEF' ? 'bg-error/20 text-error' :
                            'bg-base-300 text-base-content'
                          }`}>
                            {player.position}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-bold text-success">
                        {player.projections.projectedPoints[scoringFormat].toFixed(1)}
                      </div>
                      <div className="text-xs text-base-content/50">proj pts</div>
                    </div>
                  </div>
                </div>
              ))}
              
              {filteredPlayers.length > 8 && (
                <div className="px-4 py-2 text-center text-sm text-base-content/50 bg-base-200">
                  {filteredPlayers.length - 8} more players found...
                </div>
              )}
            </div>
          )}
        </div>
        
        {/* Filters - Only show when user is actively searching */}
        {debouncedSearchTerm.trim() && filteredPlayers.length > 0 && (
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
        {debouncedSearchTerm.trim() && filteredPlayers.length === 0 ? (
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
        ) : debouncedSearchTerm.trim() ? (
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
        ) : (
          <div className="p-8 text-center text-base-content/50">
            <Search className="w-12 h-12 mx-auto mb-3 text-base-content/30" />
            <p>Start typing to search for players</p>
            <p className="text-sm mt-1">Search by player name or team</p>
          </div>
        )}
      </div>
      
      <div className="p-4 bg-base-200 text-center text-sm text-base-content/60 rounded-b">
        {debouncedSearchTerm.trim() ? `Showing ${filteredPlayers.length} of ${players.length} players` : `${players.length} players available`}
      </div>
    </div>
  );
};