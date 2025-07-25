import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Search } from 'lucide-react';

interface AutoCompleteProps {
  suggestions: string[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export const AutoComplete: React.FC<AutoCompleteProps> = ({
  suggestions,
  value,
  onChange,
  placeholder = "Search...",
  className = ""
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([]);
  const [activeSuggestion, setActiveSuggestion] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    if (value) {
      const filtered = suggestions.filter(suggestion =>
        suggestion.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredSuggestions(filtered);
      setIsOpen(filtered.length > 0);
    } else {
      setFilteredSuggestions(suggestions);
      setIsOpen(false);
    }
    setActiveSuggestion(-1);
  }, [value, suggestions]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  const handleSuggestionClick = (suggestion: string) => {
    onChange(suggestion);
    setIsOpen(false);
    setActiveSuggestion(-1);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveSuggestion(prev => 
        prev < filteredSuggestions.length - 1 ? prev + 1 : prev
      );
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveSuggestion(prev => prev > 0 ? prev - 1 : -1);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (activeSuggestion >= 0) {
        handleSuggestionClick(filteredSuggestions[activeSuggestion]);
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false);
      setActiveSuggestion(-1);
    }
  };

  const handleFocus = () => {
    if (filteredSuggestions.length > 0) {
      setIsOpen(true);
    }
  };

  const handleBlur = () => {
    // Delay closing to allow for clicks on suggestions
    setTimeout(() => setIsOpen(false), 150);
  };

  return (
    <div className={`relative ${className}`}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 dark:text-slate-500 w-5 h-5" />
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={placeholder}
          className="input input-bordered w-full pl-10 pr-10"
        />
        <ChevronDown 
          className={`absolute right-3 top-1/2 transform -translate-y-1/2 text-base-content/40 w-5 h-5 transition-transform ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </div>
      
      {isOpen && filteredSuggestions.length > 0 && (
        <ul
          ref={listRef}
          className="absolute z-50 w-full mt-1 bg-base-100 border border-base-300 rounded shadow-lg max-h-60 overflow-auto"
        >
          {filteredSuggestions.map((suggestion, index) => (
            <li
              key={index}
              onClick={() => handleSuggestionClick(suggestion)}
              className={`px-4 py-3 cursor-pointer transition-colors ${
                index === activeSuggestion
                  ? 'bg-primary/10 text-primary'
                  : 'hover:bg-base-200 text-base-content'
              }`}
            >
              {suggestion}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};