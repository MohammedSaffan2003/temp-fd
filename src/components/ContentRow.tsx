import React, { useState } from 'react';
import { Star, Play, X, AlertCircle, Heart, Share2, MessageCircle } from 'lucide-react';
import VideoPlayer from './VideoPlayer';

interface ContentItem {
  id: number;
  title: string;
  image: string;
  rating: number;
  videoUrl: string;
  thumbnailUrl: string;
  likes: number;
  shares: number;
  comments: number;
}

interface ContentRowProps {
  title: string;
  items: ContentItem[];
  icon?: React.ReactNode;
}

const ContentRow: React.FC<ContentRowProps> = ({ title, items, icon }) => {
  const [selectedVideo, setSelectedVideo] = useState<ContentItem | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [likedVideos, setLikedVideos] = useState<number[]>([]);

  const handlePlay = (item: ContentItem) => {
    try {
      setSelectedVideo(item);
      setError(null);
    } catch (err) {
      setError('Unable to play video. Please try again later.');
    }
  };

  const handleLike = (videoId: number, event: React.MouseEvent) => {
    event.stopPropagation();
    setLikedVideos(prev => 
      prev.includes(videoId) 
        ? prev.filter(id => id !== videoId)
        : [...prev, videoId]
    );
  };

  const handleShare = (item: ContentItem, event: React.MouseEvent) => {
    event.stopPropagation();
    // Implement share functionality
    console.log('Sharing video:', item.title);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        {icon && icon}
        <h2 className="text-xl font-bold">{title}</h2>
      </div>
      
      {error && (
        <div className="bg-red-600/10 border-l-4 border-red-600 p-4 rounded-r">
          <div className="flex items-center space-x-2">
            <AlertCircle className="w-5 h-5 text-red-600" />
            <p className="text-sm text-red-600">{error}</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {items.map((item) => (
          <div
            key={item.id}
            className="relative group rounded-lg overflow-hidden transition-transform duration-300 hover:scale-105 cursor-pointer"
            onClick={() => handlePlay(item)}
          >
            <img
              src={item.image}
              alt={item.title}
              className="w-full h-48 object-cover"
              onError={(e) => {
                e.currentTarget.src = 'https://via.placeholder.com/500x300';
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="absolute bottom-0 p-4 w-full">
                <h3 className="text-white font-semibold truncate">{item.title}</h3>
                <div className="flex items-center justify-between mt-2">
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={(e) => handleLike(item.id, e)}
                      className="flex items-center space-x-1 text-white hover:text-red-500 transition-colors"
                    >
                      <Heart 
                        className={`w-4 h-4 ${likedVideos.includes(item.id) ? 'fill-red-500 text-red-500' : ''}`} 
                      />
                      <span className="text-sm">{item.likes}</span>
                    </button>
                    <button
                      onClick={(e) => handleShare(item, e)}
                      className="flex items-center space-x-1 text-white hover:text-blue-500 transition-colors"
                    >
                      <Share2 className="w-4 h-4" />
                      <span className="text-sm">{item.shares}</span>
                    </button>
                    <div className="flex items-center space-x-1 text-white">
                      <MessageCircle className="w-4 h-4" />
                      <span className="text-sm">{item.comments}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                    <span className="text-sm text-gray-200">{item.rating}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {selectedVideo && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50">
          <div className="relative w-full max-w-4xl mx-4">
            <button
              onClick={() => setSelectedVideo(null)}
              className="absolute -top-12 right-0 text-white hover:text-gray-300 p-2 hover:bg-white/10 rounded-full transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
            <VideoPlayer
              url={selectedVideo.videoUrl}
              thumbnail={selectedVideo.thumbnailUrl}
              onEnded={() => setSelectedVideo(null)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ContentRow;