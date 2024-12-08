import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from '../models/user.model.js';
import { createError } from '../utils/error.util.js';

export const registerUser = async (userData) => {
  const { email, username, password } = userData;

  const existingUser = await User.findOne({ $or: [{ email }, { username }] });
  if (existingUser) {
    throw createError(400, 'Email or username already exists');
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = new User({
    email,
    username,
    password: hashedPassword
  });

  await user.save();

  const token = generateToken(user._id);
  const { password: _, ...userWithoutPassword } = user.toObject();

  return {
    user: userWithoutPassword,
    token
  };
};

export const loginUser = async (email, password) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw createError(404, 'User not found');
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw createError(400, 'Invalid password');
  }

  const token = generateToken(user._id);
  const { password: _, ...userWithoutPassword } = user.toObject();

  return {
    user: userWithoutPassword,
    token
  };
};

const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: '7d'
  });
};