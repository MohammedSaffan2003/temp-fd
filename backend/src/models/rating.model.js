import mongoose from 'mongoose';

const ratingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  content: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Content',
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  review: {
    type: String,
    maxLength: 500
  }
}, {
  timestamps: true
});

// Ensure one rating per user per content
ratingSchema.index({ user: 1, content: 1 }, { unique: true });

export default mongoose.model('Rating', ratingSchema);