import { useState } from 'react';
import { api } from '../lib/api';

interface Rating {
  rating: number;
  review?: string;
}

export const useRating = (contentId: string) => {
  const [isLoading, setIsLoading] = useState(false);

  const submitRating = async (data: Rating) => {
    try {
      setIsLoading(true);
      await api.ratings.submit(contentId, data);
    } catch (error) {
      console.error('Rating submission error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    submitRating,
    isLoading
  };
};

export default useRating;