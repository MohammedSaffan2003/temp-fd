import { useState } from 'react';
import { api } from '../lib/api';

interface SearchResult {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  rating: number;
  relevanceScore: number;
}

export const useAISearch = () => {
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const search = async (query: string) => {
    try {
      setIsLoading(true);
      const response = await api.search.aiSearch(query);
      setResults(response.results);
    } catch (error) {
      console.error('AI search error:', error);
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const clear = () => {
    setResults([]);
  };

  return {
    results,
    isLoading,
    search,
    clear
  };
};

export default useAISearch;