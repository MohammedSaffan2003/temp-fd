import React, { useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState([]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 z-50">
      <div className="container mx-auto px-4 pt-20">
        <div className="relative max-w-3xl mx-auto">
          <div className="flex items-center bg-[#2b2b2b] rounded-lg p-2">
            <Search className="w-6 h-6 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search titles, genres, people"
              className="w-full px-4 py-2 bg-transparent text-white focus:outline-none"
              autoFocus
            />
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-full transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="mt-8 space-y-4">
            {/* Search results will be populated here */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchModal;