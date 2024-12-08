import express from 'express';
import natural from 'natural';
import Content from '../models/content.model.js';
import { verifyToken } from '../middleware/auth.middleware.js';

const router = express.Router();

// Initialize TF-IDF
const TfIdf = natural.TfIdf;
const tfidf = new TfIdf();

// AI-powered search endpoint
router.get('/ai', verifyToken, async (req, res, next) => {
  try {
    const { q: query } = req.query;
    if (!query) {
      return res.status(400).json({ message: 'Search query is required' });
    }

    // Get all content
    const allContent = await Content.find({}, 'title description genre');

    // Add documents to TF-IDF
    allContent.forEach((content, index) => {
      const document = `${content.title} ${content.description} ${content.genre.join(' ')}`;
      tfidf.addDocument(document.toLowerCase());
    });

    // Calculate relevance scores
    const scores = [];
    tfidf.tfidfs(query.toLowerCase(), (index, score) => {
      scores.push({ index, score });
    });

    // Sort by relevance and get top results
    const topResults = scores
      .sort((a, b) => b.score - a.score)
      .slice(0, 10)
      .map(({ index, score }) => ({
        ...allContent[index].toObject(),
        relevanceScore: score > 0 ? score / Math.max(...scores.map(s => s.score)) : 0
      }));

    res.json({ results: topResults });
  } catch (err) {
    next(err);
  }
});

export default router;