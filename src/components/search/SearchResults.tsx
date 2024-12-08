import React from 'react';
import { Play, Star } from 'lucide-react';

interface SearchResult {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  rating: number;
  relevanceScore: number;
}

interface SearchResultsProps {
  results: SearchResult[];
  onClose: () => void;
}

const SearchResults: React.FC<SearchResultsProps> = ({ results, onClose }) => {
  return (
    <div className="absolute top-full mt-2 w-full bg-gray-900 rounded-lg shadow-lg overflow-hidden z-50">
      <div className="max-h-96 overflow-y-auto">
        {results.map((result) => (
          <div
            key={result.id}
            className="p-4 hover:bg-gray-800 transition-colors border-b border-gray-800 last:border-0"
          >
            <div className="flex items-start space-x-4">
              <div className="relative group flex-shrink-0">
                <img
                  src={result.thumbnail}
                  alt={result.title}
                  className="w-32 h-20 object-cover rounded"
                />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Play className="w-8 h-8" />
                </div>
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-lg">{result.title}</h3>
                <p className="text-sm text-gray-400 line-clamp-2">
                  {result.description}
                </p>
                <div className="flex items-center space-x-4 mt-2">
                  <div className="flex items-center text-yellow-400">
                    <Star className="w-4 h-4 fill-current" />
                    <span className="ml-1 text-sm">{result.rating.toFixed(1)}</span>
                  </div>
                  <span className="text-sm text-gray-500">
                    Relevance: {Math.round(result.relevanceScore * 100)}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchResults;