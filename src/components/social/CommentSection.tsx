import React, { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import TextareaAutosize from 'react-textarea-autosize';
import { MessageCircle, Heart, Share2, ThumbsUp, Flag, MoreVertical } from 'lucide-react';

interface Comment {
  id: string;
  user: {
    name: string;
    avatar: string;
  };
  content: string;
  timestamp: Date;
  likes: number;
  isLiked: boolean;
  replies?: Comment[];
}

interface CommentSectionProps {
  comments: Comment[];
  onAddComment: (content: string) => void;
  onLikeComment: (commentId: string) => void;
}

const CommentSection: React.FC<CommentSectionProps> = ({
  comments,
  onAddComment,
  onLikeComment
}) => {
  const [newComment, setNewComment] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newComment.trim()) {
      onAddComment(newComment);
      setNewComment('');
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-[#1a1a1a] rounded-lg p-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          <TextareaAutosize
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a comment..."
            className="w-full bg-[#2b2b2b] rounded-lg p-3 min-h-[100px] focus:outline-none focus:ring-2 focus:ring-red-600 resize-none"
            maxRows={10}
          />
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={!newComment.trim()}
              className="px-4 py-2 bg-red-600 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-red-700 transition-colors"
            >
              Comment
            </button>
          </div>
        </form>
      </div>

      <div className="space-y-4">
        {comments.map((comment) => (
          <CommentCard
            key={comment.id}
            comment={comment}
            onLike={() => onLikeComment(comment.id)}
          />
        ))}
      </div>
    </div>
  );
};

const CommentCard: React.FC<{ comment: Comment; onLike: () => void }> = ({
  comment,
  onLike
}) => {
  const [showActions, setShowActions] = useState(false);

  return (
    <div className="bg-[#1a1a1a] rounded-lg p-4">
      <div className="flex items-start space-x-3">
        <img
          src={comment.user.avatar}
          alt={comment.user.name}
          className="w-10 h-10 rounded-full object-cover"
          onError={(e) => {
            e.currentTarget.src = 'https://via.placeholder.com/40';
          }}
        />
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">{comment.user.name}</h4>
              <span className="text-sm text-gray-400">
                {formatDistanceToNow(comment.timestamp, { addSuffix: true })}
              </span>
            </div>
            <div className="relative">
              <button
                onClick={() => setShowActions(!showActions)}
                className="p-2 hover:bg-white/10 rounded-full transition-colors"
              >
                <MoreVertical className="w-5 h-5" />
              </button>
              {showActions && (
                <div className="absolute right-0 mt-2 w-48 bg-[#2b2b2b] rounded-lg shadow-lg py-1 z-10">
                  <button className="w-full px-4 py-2 text-left hover:bg-white/10 flex items-center space-x-2">
                    <Flag className="w-4 h-4" />
                    <span>Report</span>
                  </button>
                </div>
              )}
            </div>
          </div>
          <p className="mt-2 text-gray-200">{comment.content}</p>
          <div className="mt-3 flex items-center space-x-4">
            <button
              onClick={onLike}
              className={`flex items-center space-x-1 ${
                comment.isLiked ? 'text-red-600' : 'text-gray-400'
              } hover:text-red-600 transition-colors`}
            >
              <ThumbsUp className="w-4 h-4" />
              <span>{comment.likes}</span>
            </button>
            <button className="flex items-center space-x-1 text-gray-400 hover:text-white transition-colors">
              <MessageCircle className="w-4 h-4" />
              <span>Reply</span>
            </button>
            <button className="flex items-center space-x-1 text-gray-400 hover:text-white transition-colors">
              <Share2 className="w-4 h-4" />
              <span>Share</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommentSection;