import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Star, X } from 'lucide-react';
import { useRating } from '../../hooks/useRating';

const ratingSchema = z.object({
  rating: z.number().min(1).max(5),
  review: z.string().max(500, 'Review must not exceed 500 characters'),
});

interface RatingModalProps {
  contentId: string;
  isOpen: boolean;
  onClose: () => void;
}

const RatingModal: React.FC<RatingModalProps> = ({ contentId, isOpen, onClose }) => {
  const { submitRating, isLoading } = useRating(contentId);
  const [hoveredStar, setHoveredStar] = React.useState(0);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(ratingSchema),
    defaultValues: {
      rating: 0,
      review: ''
    }
  });

  const currentRating = watch('rating');

  const onSubmit = async (data: any) => {
    await submitRating(data);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
      <div className="bg-[#141414] rounded-lg p-8 max-w-md w-full mx-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Rate this content</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-full transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="flex justify-center space-x-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setValue('rating', star)}
                onMouseEnter={() => setHoveredStar(star)}
                onMouseLeave={() => setHoveredStar(0)}
                className="p-1 focus:outline-none"
              >
                <Star
                  className={`w-8 h-8 ${
                    star <= (hoveredStar || currentRating)
                      ? 'text-yellow-400 fill-yellow-400'
                      : 'text-gray-400'
                  } transition-colors`}
                />
              </button>
            ))}
          </div>

          <div>
            <textarea
              {...register('review')}
              placeholder="Write your review (optional)"
              className="w-full bg-[#2b2b2b] rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-600 min-h-[100px] resize-none"
              maxLength={500}
            />
            {errors.review && (
              <p className="text-sm text-red-600 mt-1">
                {errors.review.message as string}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading || currentRating === 0}
            className="w-full bg-red-600 text-white py-3 rounded font-semibold hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Submit Rating
          </button>
        </form>
      </div>
    </div>
  );
};

export default RatingModal;