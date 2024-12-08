import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X, Video, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../lib/api';

const streamSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  category: z.string().min(1, 'Please select a category'),
});

interface GoLiveModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const GoLiveModal: React.FC<GoLiveModalProps> = ({ isOpen, onClose }) => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm({
    resolver: zodResolver(streamSchema)
  });

  const onSubmit = async (data: any) => {
    try {
      setIsLoading(true);
      const response = await api.streams.create(data);
      reset();
      onClose();
      navigate(`/live/${response.streamId}`);
    } catch (err) {
      console.error('Failed to create stream:', err);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
      <div className="bg-[#141414] rounded-lg p-8 max-w-md w-full mx-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Video className="w-6 h-6" />
            Go Live
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-full transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Stream Title
            </label>
            <input
              {...register('title')}
              className="w-full bg-[#2b2b2b] rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-600"
              placeholder="Enter your stream title"
            />
            {errors.title && (
              <p className="text-sm text-red-600 mt-1">
                {errors.title.message as string}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Description
            </label>
            <textarea
              {...register('description')}
              className="w-full bg-[#2b2b2b] rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-600 min-h-[100px]"
              placeholder="Tell viewers about your stream"
            />
            {errors.description && (
              <p className="text-sm text-red-600 mt-1">
                {errors.description.message as string}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Category
            </label>
            <select
              {...register('category')}
              className="w-full bg-[#2b2b2b] rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-600"
            >
              <option value="">Select a category</option>
              <option value="gaming">Gaming</option>
              <option value="music">Music</option>
              <option value="chatting">Just Chatting</option>
              <option value="creative">Creative</option>
              <option value="sports">Sports</option>
            </select>
            {errors.category && (
              <p className="text-sm text-red-600 mt-1">
                {errors.category.message as string}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-red-600 text-white py-3 rounded font-semibold hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin mr-2" />
                Starting Stream...
              </>
            ) : (
              <>
                <Video className="w-5 h-5 mr-2" />
                Start Streaming
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default GoLiveModal;