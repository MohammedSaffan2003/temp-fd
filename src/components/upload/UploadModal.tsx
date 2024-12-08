import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X, Upload, Loader2 } from 'lucide-react';
import VideoUpload from './VideoUpload';
import { api } from '../../lib/api';
import { useAuthStore } from '../../store/authStore';

const uploadSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  type: z.enum(['movie', 'series']),
  genre: z.array(z.string()).min(1, 'Select at least one genre'),
  releaseYear: z.number().min(1900).max(new Date().getFullYear()),
});

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const UploadModal: React.FC<UploadModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuthStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm({
    resolver: zodResolver(uploadSchema)
  });

  const handleUpload = async (data: any) => {
    if (!videoFile || !thumbnailFile) {
      setError('Both video and thumbnail are required');
      return;
    }

    try {
      setUploading(true);
      setError(null);

      const formData = new FormData();
      formData.append('video', videoFile);
      formData.append('thumbnail', thumbnailFile);
      formData.append('title', data.title);
      formData.append('description', data.description);
      formData.append('type', data.type);
      formData.append('genre', JSON.stringify(data.genre));
      formData.append('releaseYear', data.releaseYear.toString());
      formData.append('duration', '40'); // Fixed duration for 40-second limit

      await api.content.upload(formData);
      reset();
      setVideoFile(null);
      setThumbnailFile(null);
      onSuccess();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload content');
    } finally {
      setUploading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
      <div className="bg-[#141414] rounded-lg p-8 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Upload Content</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-full transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-600/10 border-l-4 border-red-600 text-red-600">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(handleUpload)} className="space-y-6">
          <VideoUpload
            onVideoSelect={setVideoFile}
            onThumbnailSelect={setThumbnailFile}
          />

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Title
              </label>
              <input
                {...register('title')}
                className="w-full bg-[#2b2b2b] rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-600"
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
              />
              {errors.description && (
                <p className="text-sm text-red-600 mt-1">
                  {errors.description.message as string}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Type
              </label>
              <select
                {...register('type')}
                className="w-full bg-[#2b2b2b] rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-600"
              >
                <option value="movie">Movie</option>
                <option value="series">Series</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Genre
              </label>
              <div className="grid grid-cols-2 gap-2">
                {['action', 'comedy', 'drama', 'horror', 'scifi', 'romance'].map((genre) => (
                  <label key={genre} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      value={genre}
                      {...register('genre')}
                      className="rounded border-gray-600 text-red-600 focus:ring-red-600"
                    />
                    <span className="capitalize">{genre}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Release Year
              </label>
              <input
                type="number"
                {...register('releaseYear', { valueAsNumber: true })}
                className="w-full bg-[#2b2b2b] rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-600"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={uploading}
            className="w-full bg-red-600 text-white py-3 rounded font-semibold hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {uploading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin mr-2" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="w-5 h-5 mr-2" />
                Upload Content
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UploadModal;