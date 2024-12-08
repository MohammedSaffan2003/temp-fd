import Reward from '../models/reward.model.js';
import User from '../models/user.model.js';
import { createError } from '../utils/error.util.js';

const REWARD_VALUES = {
  gold: 1000,
  silver: 500,
  bronze: 200
};

export const giveReward = async (req, res, next) => {
  try {
    const { creatorId, contentId, rewardType } = req.body;
    const senderId = req.userId;

    // Validate reward type
    if (!REWARD_VALUES[rewardType]) {
      throw createError(400, 'Invalid reward type');
    }

    // Check if sender has enough coins
    const sender = await User.findById(senderId);
    if (!sender) {
      throw createError(404, 'Sender not found');
    }

    const rewardValue = REWARD_VALUES[rewardType];
    if (sender.coins < rewardValue) {
      throw createError(400, 'Insufficient coins');
    }

    // Create reward and update balances
    const reward = new Reward({
      type: rewardType,
      sender: senderId,
      recipient: creatorId,
      content: contentId,
      value: rewardValue
    });

    await reward.save();

    // Update sender's balance
    sender.coins -= rewardValue;
    await sender.save();

    // Update recipient's balance
    const recipient = await User.findById(creatorId);
    if (!recipient) {
      throw createError(404, 'Recipient not found');
    }

    recipient.coins = (recipient.coins || 0) + rewardValue;
    recipient.totalRewardsReceived = (recipient.totalRewardsReceived || 0) + 1;
    await recipient.save();

    res.status(201).json({
      success: true,
      reward,
      senderBalance: sender.coins
    });
  } catch (err) {
    next(err);
  }
};

export const getCreatorStats = async (req, res, next) => {
  try {
    const userId = req.userId;
    const now = new Date();
    const lastMonth = new Date(now.setMonth(now.getMonth() - 1));

    // Get current period stats
    const currentStats = await Reward.aggregate([
      {
        $match: {
          recipient: mongoose.Types.ObjectId(userId),
          createdAt: { $gte: lastMonth }
        }
      },
      {
        $group: {
          _id: null,
          totalRewards: { $sum: 1 },
          totalValue: { $sum: '$value' }
        }
      }
    ]);

    // Get previous period stats for comparison
    const previousMonth = new Date(lastMonth.setMonth(lastMonth.getMonth() - 1));
    const previousStats = await Reward.aggregate([
      {
        $match: {
          recipient: mongoose.Types.ObjectId(userId),
          createdAt: {
            $gte: previousMonth,
            $lt: lastMonth
          }
        }
      },
      {
        $group: {
          _id: null,
          totalRewards: { $sum: 1 },
          totalValue: { $sum: '$value' }
        }
      }
    ]);

    const current = currentStats[0] || { totalRewards: 0, totalValue: 0 };
    const previous = previousStats[0] || { totalRewards: 0, totalValue: 0 };

    // Calculate growth percentages
    const rewardsGrowth = previous.totalRewards === 0 ? 100 :
      ((current.totalRewards - previous.totalRewards) / previous.totalRewards) * 100;

    const earningsGrowth = previous.totalValue === 0 ? 100 :
      ((current.totalValue - previous.totalValue) / previous.totalValue) * 100;

    res.json({
      totalRewards: current.totalRewards,
      earnings: current.totalValue,
      rewardsGrowth: Math.round(rewardsGrowth),
      earningsGrowth: Math.round(earningsGrowth)
    });
  } catch (err) {
    next(err);
  }
};