import React, { useState, useEffect, useRef } from 'react';
import { Search, X } from 'lucide-react';

interface SearchBarProps {
  onSearch: (query: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (inputRef.current && !inputRef.current.contains(event.target as Node)) {
        if (!query) setIsExpanded(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [query]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
    }
  };

  const handleClear = () => {
    setQuery('');
    onSearch('');
    inputRef.current?.focus();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={`relative transition-all duration-300 ${
        isExpanded ? 'w-64' : 'w-10'
      }`}
    >
      <div className="relative flex items-center">
        <button
          type="button"
          onClick={() => {
            setIsExpanded(true);
            inputRef.current?.focus();
          }}
          className={`absolute left-0 p-2 text-gray-400 hover:text-white transition-colors ${
            isExpanded ? 'pointer-events-none' : ''
          }`}
        >
          <Search className="w-6 h-6" />
        </button>
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search titles, genres..."
          className={`w-full bg-gray-800 rounded-full py-2 pl-10 pr-10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-600 transition-all ${
            isExpanded ? 'opacity-100' : 'opacity-0'
          }`}
        />
        {query && isExpanded && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-2 p-1 text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>
    </form>
  );
};

export default SearchBar;