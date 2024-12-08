import User from '../models/user.model.js';
import { createError } from '../utils/error.util.js';
import { uploadImage } from '../config/cloudinary.js';

export const getUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId).select('-password');
    if (!user) {
      return next(createError(404, 'User not found'));
    }
    res.json(user);
  } catch (err) {
    next(err);
  }
};

export const updateProfileImage = async (req, res, next) => {
  try {
    if (!req.file) {
      return next(createError(400, 'No image file provided'));
    }

    const user = await User.findById(req.userId);
    if (!user) {
      return next(createError(404, 'User not found'));
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(req.file.mimetype)) {
      return next(createError(400, 'Invalid file type. Only JPEG, PNG, and WebP images are allowed.'));
    }

    // Convert buffer to base64
    const base64Image = req.file.buffer.toString('base64');
    const dataURI = `data:${req.file.mimetype};base64,${base64Image}`;

    // Upload to Cloudinary
    const imageUrl = await uploadImage(dataURI);

    // Update user profile
    user.profileImage = imageUrl;
    await user.save();

    res.json({ 
      success: true,
      profileImage: imageUrl 
    });
  } catch (err) {
    console.error('Profile image update error:', err);
    next(createError(500, 'Failed to update profile image'));
  }
};

export const updateWatchlist = async (req, res, next) => {
  try {
    const { contentId } = req.body;
    const user = await User.findById(req.userId);
    
    if (!user) {
      return next(createError(404, 'User not found'));
    }

    const contentIndex = user.watchlist.indexOf(contentId);
    if (contentIndex === -1) {
      user.watchlist.push(contentId);
    } else {
      user.watchlist.splice(contentIndex, 1);
    }

    await user.save();
    res.json(user.watchlist);
  } catch (err) {
    next(err);
  }
};

export const updateWatchHistory = async (req, res, next) => {
  try {
    const { contentId, progress } = req.body;
    const user = await User.findById(req.userId);
    
    if (!user) {
      return next(createError(404, 'User not found'));
    }

    const historyIndex = user.watchHistory.findIndex(
      item => item.content.toString() === contentId
    );

    if (historyIndex === -1) {
      user.watchHistory.push({
        content: contentId,
        progress,
        lastWatched: new Date()
      });
    } else {
      user.watchHistory[historyIndex].progress = progress;
      user.watchHistory[historyIndex].lastWatched = new Date();
    }

    await user.save();
    res.json(user.watchHistory);
  } catch (err) {
    next(err);
  }
};