import React from 'react';
import { Heart, Share2, Bookmark, ArrowLeft } from 'lucide-react';

interface UserContentProps {
  content: {
    id: string;
    title: string;
    description: string;
    imageUrl: string;
    likes: number;
    isLiked: boolean;
    isSaved: boolean;
    user: {
      name: string;
      avatar: string;
    };
  };
  onLike: () => void;
  onShare: () => void;
  onSave: () => void;
  onBack: () => void;
}

const UserContent: React.FC<UserContentProps> = ({
  content,
  onLike,
  onShare,
  onSave,
  onBack
}) => {
  return (
    <div className="relative">
      <button
        onClick={onBack}
        className="absolute top-4 left-4 z-10 p-2 bg-black/50 rounded-full hover:bg-black/70 transition-colors"
      >
        <ArrowLeft className="w-6 h-6" />
      </button>

      <div className="relative">
        <img
          src={content.imageUrl}
          alt={content.title}
          className="w-full h-[50vh] object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
      </div>

      <div className="relative -mt-20 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <img
              src={content.user.avatar}
              alt={content.user.name}
              className="w-12 h-12 rounded-full border-2 border-white object-cover"
            />
            <div>
              <h2 className="text-2xl font-bold">{content.title}</h2>
              <p className="text-gray-300">{content.user.name}</p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={onLike}
              className={`p-2 rounded-full ${
                content.isLiked
                  ? 'bg-red-600 text-white'
                  : 'bg-white/10 hover:bg-white/20'
              } transition-colors`}
            >
              <Heart className={`w-6 h-6 ${content.isLiked ? 'fill-current' : ''}`} />
            </button>
            <button
              onClick={onShare}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
            >
              <Share2 className="w-6 h-6" />
            </button>
            <button
              onClick={onSave}
              className={`p-2 rounded-full ${
                content.isSaved
                  ? 'bg-blue-600 text-white'
                  : 'bg-white/10 hover:bg-white/20'
              } transition-colors`}
            >
              <Bookmark className={`w-6 h-6 ${content.isSaved ? 'fill-current' : ''}`} />
            </button>
          </div>
        </div>

        <p className="mt-6 text-lg text-gray-200">{content.description}</p>

        <div className="mt-4 flex items-center space-x-4 text-gray-400">
          <span>{content.likes} likes</span>
          <span>•</span>
          <button className="hover:text-white transition-colors">
            Share this content
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserContent;