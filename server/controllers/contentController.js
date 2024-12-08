import Content from '../models/Content.js';
import { createError } from '../utils/error.js';

export const getAllContent = async (req, res, next) => {
  try {
    const { type, genre, sort = '-createdAt', page = 1, limit = 10 } = req.query;
    const query = {};

    if (type) query.type = type;
    if (genre) query.genre = genre;

    const content = await Content.find(query)
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await Content.countDocuments(query);

    res.json({
      content,
      totalPages: Math.ceil(total / limit),
      currentPage: page
    });
  } catch (err) {
    next(err);
  }
};

export const getFeaturedContent = async (req, res, next) => {
  try {
    const featured = await Content.find({ featured: true })
      .sort('-createdAt')
      .limit(10);
    res.json(featured);
  } catch (err) {
    next(err);
  }
};

export const getContentById = async (req, res, next) => {
  try {
    const content = await Content.findById(req.params.id);
    if (!content) {
      return next(createError(404, 'Content not found'));
    }
    res.json(content);
  } catch (err) {
    next(err);
  }
};

export const searchContent = async (req, res, next) => {
  try {
    const { q } = req.query;
    if (!q) {
      return next(createError(400, 'Search query is required'));
    }

    const content = await Content.find(
      { $text: { $search: q } },
      { score: { $meta: 'textScore' } }
    )
    .sort({ score: { $meta: 'textScore' } })
    .limit(20);

    res.json(content);
  } catch (err) {
    next(err);
  }
};