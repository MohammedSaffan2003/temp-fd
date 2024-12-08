import { createError } from '../utils/error.util.js';

export const validateRating = (req, res, next) => {
  const { rating, review } = req.body;

  if (!rating || typeof rating !== 'number' || rating < 1 || rating > 5) {
    return next(createError(400, 'Rating must be a number between 1 and 5'));
  }

  if (review && review.length > 500) {
    return next(createError(400, 'Review must not exceed 500 characters'));
  }

  next();
};

export const validateContentId = (req, res, next) => {
  const contentId = req.params.contentId || req.body.contentId;
  
  if (!contentId || !contentId.match(/^[0-9a-fA-F]{24}$/)) {
    return next(createError(400, 'Invalid content ID'));
  }

  next();
};