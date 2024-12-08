import React, { useState } from 'react';
import { Gift, X, Award, Coins } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { api } from '../../lib/api';

interface GiftModalProps {
  isOpen: boolean;
  onClose: () => void;
  creatorId: string;
  contentId: string;
}

const rewards = [
  {
    id: 'gold',
    name: 'Gold Award',
    icon: <Award className="w-8 h-8 text-yellow-400" />,
    cost: 1000,
    description: 'Show ultimate appreciation with a Gold award'
  },
  {
    id: 'silver',
    name: 'Silver Award',
    icon: <Award className="w-8 h-8 text-gray-400" />,
    cost: 500,
    description: 'Give recognition with a Silver award'
  },
  {
    id: 'bronze',
    name: 'Bronze Award',
    icon: <Award className="w-8 h-8 text-amber-700" />,
    cost: 200,
    description: 'Support with a Bronze award'
  }
];

const GiftModal: React.FC<GiftModalProps> = ({ isOpen, onClose, creatorId, contentId }) => {
  const [selectedReward, setSelectedReward] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuthStore();

  const handleGift = async () => {
    if (!selectedReward || !user) return;

    try {
      setIsProcessing(true);
      setError(null);

      await api.rewards.giveReward({
        creatorId,
        contentId,
        rewardType: selectedReward
      });

      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send reward');
    } finally {
      setIsProcessing(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
      <div className="bg-[#141414] rounded-lg p-8 max-w-md w-full mx-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Gift className="w-6 h-6" />
            Send a Reward
          </h2>
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

        <div className="space-y-4">
          {rewards.map((reward) => (
            <button
              key={reward.id}
              onClick={() => setSelectedReward(reward.id)}
              className={`w-full p-4 rounded-lg border-2 transition-colors ${
                selectedReward === reward.id
                  ? 'border-red-600 bg-red-600/10'
                  : 'border-gray-700 hover:border-gray-600'
              }`}
            >
              <div className="flex items-center space-x-4">
                {reward.icon}
                <div className="flex-1 text-left">
                  <h3 className="font-medium">{reward.name}</h3>
                  <p className="text-sm text-gray-400">{reward.description}</p>
                </div>
                <div className="flex items-center text-yellow-400">
                  <Coins className="w-4 h-4 mr-1" />
                  <span>{reward.cost}</span>
                </div>
              </div>
            </button>
          ))}
        </div>

        <div className="mt-6 flex items-center justify-between">
          <div className="text-sm text-gray-400">
            Your balance: <span className="text-yellow-400">
              <Coins className="w-4 h-4 inline mr-1" />
              {user?.coins || 0}
            </span>
          </div>
          <button
            onClick={handleGift}
            disabled={!selectedReward || isProcessing}
            className="px-6 py-2 bg-red-600 text-white rounded-full font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-red-700 transition-colors"
          >
            {isProcessing ? 'Sending...' : 'Send Reward'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default GiftModal;