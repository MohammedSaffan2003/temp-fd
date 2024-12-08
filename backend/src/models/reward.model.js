import mongoose from 'mongoose';

const rewardSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['gold', 'silver', 'bronze'],
    required: true
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  content: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Content',
    required: true
  },
  value: {
    type: Number,
    required: true
  }
}, {
  timestamps: true
});

export default mongoose.model('Reward', rewardSchema);