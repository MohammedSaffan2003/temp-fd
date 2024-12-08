import Rating from '../models/rating.model.js';
import Content from '../models/content.model.js';
import { createError } from '../utils/error.util.js';

export const addRating = async (req, res, next) => {
  try {
    const { contentId, rating, review } = req.body;
    const userId = req.userId;

    // Create or update rating
    const ratingDoc = await Rating.findOneAndUpdate(
      { user: userId, content: contentId },
      { rating, review },
      { new: true, upsert: true }
    );

    // Update content average rating
    const ratings = await Rating.find({ content: contentId });
    const avgRating = ratings.reduce((acc, curr) => acc + curr.rating, 0) / ratings.length;
    
    await Content.findByIdAndUpdate(contentId, { rating: avgRating });

    res.status(201).json(ratingDoc);
  } catch (err) {
    next(err);
  }
};

export const getContentRatings = async (req, res, next) => {
  try {
    const { contentId } = req.params;
    const ratings = await Rating.find({ content: contentId })
      .populate('user', 'username')
      .sort('-createdAt');

    res.json(ratings);
  } catch (err) {
    next(err);
  }
};

export const getUserRating = async (req, res, next) => {
  try {
    const { contentId } = req.params;
    const rating = await Rating.findOne({
      user: req.userId,
      content: contentId
    });

    if (!rating) {
      return next(createError(404, 'Rating not found'));
    }

    res.json(rating);
  } catch (err) {
    next(err);
  }
};