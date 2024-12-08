import React, { useState } from 'react';
import { ArrowLeft, Heart, Share2, Bookmark, Play } from 'lucide-react';
import CommentSection from './social/CommentSection';
import UserContent from './social/UserContent';

interface ContentDetailsProps {
  content: {
    id: string;
    title: string;
    description: string;
    imageUrl: string;
    videoUrl: string;
    likes: number;
    isLiked: boolean;
    isSaved: boolean;
    user: {
      name: string;
      avatar: string;
    };
  };
  onBack: () => void;
}

const ContentDetails: React.FC<ContentDetailsProps> = ({ content, onBack }) => {
  const [showVideo, setShowVideo] = useState(false);
  const [comments, setComments] = useState([
    {
      id: '1',
      user: {
        name: 'John Doe',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&auto=format'
      },
      content: 'This is amazing! Love the cinematography.',
      timestamp: new Date(Date.now() - 1000 * 60 * 30),
      likes: 12,
      isLiked: false
    },
    {
      id: '2',
      user: {
        name: 'Jane Smith',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=50&auto=format'
      },
      content: 'The storyline is incredible. Cannot wait for the next episode!',
      timestamp: new Date(Date.now() - 1000 * 60 * 60),
      likes: 8,
      isLiked: true
    }
  ]);

  const handleLike = () => {
    // Implement like functionality
  };

  const handleShare = () => {
    // Implement share functionality
  };

  const handleSave = () => {
    // Implement save functionality
  };

  const handleAddComment = (content: string) => {
    const newComment = {
      id: Date.now().toString(),
      user: {
        name: 'Current User',
        avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=50&auto=format'
      },
      content,
      timestamp: new Date(),
      likes: 0,
      isLiked: false
    };
    setComments([newComment, ...comments]);
  };

  const handleLikeComment = (commentId: string) => {
    setComments(comments.map(comment => {
      if (comment.id === commentId) {
        return {
          ...comment,
          likes: comment.isLiked ? comment.likes - 1 : comment.likes + 1,
          isLiked: !comment.isLiked
        };
      }
      return comment;
    }));
  };

  return (
    <div className="min-h-screen bg-[#141414]">
      <UserContent
        content={content}
        onLike={handleLike}
        onShare={handleShare}
        onSave={handleSave}
        onBack={onBack}
      />

      <div className="max-w-4xl mx-auto px-4 py-8">
        {!showVideo ? (
          <button
            onClick={() => setShowVideo(true)}
            className="w-full aspect-video bg-[#1a1a1a] rounded-lg flex items-center justify-center group relative overflow-hidden"
          >
            <img
              src={content.imageUrl}
              alt={content.title}
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-black/50 group-hover:bg-black/60 transition-colors" />
            <div className="relative z-10 p-4 bg-white/10 rounded-full group-hover:bg-white/20 transition-colors">
              <Play className="w-12 h-12 fill-white" />
            </div>
          </button>
        ) : (
          <div className="aspect-video">
            <iframe
              src={content.videoUrl}
              title={content.title}
              className="w-full h-full rounded-lg"
              allowFullScreen
            />
          </div>
        )}

        <div className="mt-8">
          <h3 className="text-xl font-semibold mb-4">Comments</h3>
          <CommentSection
            comments={comments}
            onAddComment={handleAddComment}
            onLikeComment={handleLikeComment}
          />
        </div>
      </div>
    </div>
  );
};

export default ContentDetails;