import Content from '../models/content.model.js';
import { storage } from '../config/storage.js';
import { createError } from '../utils/error.util.js';
import fs from 'fs/promises';

export const uploadContent = async (req, res, next) => {
  try {
    if (!req.files?.video || !req.files?.thumbnail) {
      throw createError(400, 'Both video and thumbnail are required');
    }

    const videoFile = req.files.video[0];
    const thumbnailFile = req.files.thumbnail[0];

    const content = new Content({
      title: req.body.title,
      description: req.body.description,
      type: req.body.type,
      genre: JSON.parse(req.body.genre),
      releaseYear: parseInt(req.body.releaseYear),
      duration: parseInt(req.body.duration),
      videoUrl: storage.getContentUrl(videoFile.filename),
      thumbnailUrl: storage.getThumbnailUrl(thumbnailFile.filename),
      user: req.userId
    });

    await content.save();
    res.status(201).json(content);
  } catch (err) {
    // Clean up uploaded files if there's an error
    if (req.files) {
      Object.values(req.files).flat().forEach(async (file) => {
        try {
          await fs.unlink(file.path);
        } catch (unlinkErr) {
          console.error('Error deleting file:', unlinkErr);
        }
      });
    }
    next(err);
  }
};

export const getAllContent = async (req, res, next) => {
  try {
    const { type, genre, sort = '-createdAt', page = 1, limit = 10 } = req.query;
    const query = {};

    if (type) query.type = type;
    if (genre) query.genre = genre;

    const content = await Content.find(query)
      .populate('user', 'username profileImage')
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

export const deleteContent = async (req, res, next) => {
  try {
    const content = await Content.findOne({
      _id: req.params.id,
      user: req.userId
    });

    if (!content) {
      throw createError(404, 'Content not found');
    }

    // Delete files
    const videoPath = storage.getContentPath(content.videoUrl.split('/').pop());
    const thumbnailPath = storage.getThumbnailPath(content.thumbnailUrl.split('/').pop());

    await Promise.all([
      fs.unlink(videoPath).catch(console.error),
      fs.unlink(thumbnailPath).catch(console.error),
      content.deleteOne()
    ]);

    res.json({ message: 'Content deleted successfully' });
  } catch (err) {
    next(err);
  }
};