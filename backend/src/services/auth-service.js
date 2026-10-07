import bcrypt from 'bcryptjs';
import { User } from '../models/User.js';
import { Student } from '../models/Student.js';
import { generateToken } from '../utils/jwt.js';

export const registerUser = async ({ name, email, password, branch, year }) => {
  const existing = await User.findOne({ email: email.toLowerCase() });
  if (existing) {
    const error = new Error('A user with this email already exists.');
    error.statusCode = 400;
    throw error;
  }

  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(password, salt);

  const user = await User.create({
    name,
    email: email.toLowerCase(),
    passwordHash,
  });

  const student = await Student.create({
    user: user._id,
    name: user.name,
    email: user.email,
    branch: branch || 'Computer Science and Engineering',
    year: year || 2,
    skills: [],
    interests: [],
    preferredRoles: [],
    projects: [],
    experience: [],
  });

  user.student = student._id;
  await user.save();

  const token = generateToken({ id: user._id, email: user.email });

  return {
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      student: student._id,
    },
    student,
    token,
  };
};

export const loginUser = async ({ email, password }) => {
  const user = await User.findOne({ email: email.toLowerCase() }).select('+passwordHash');
  if (!user) {
    const error = new Error('Invalid email or password.');
    error.statusCode = 401;
    throw error;
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    const error = new Error('Invalid email or password.');
    error.statusCode = 401;
    throw error;
  }

  let student = await Student.findOne({ user: user._id });
  if (!student) {
    student = await Student.create({
      user: user._id,
      name: user.name,
      email: user.email,
    });
    user.student = student._id;
    await user.save();
  }

  const token = generateToken({ id: user._id, email: user.email });

  return {
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      student: student._id,
    },
    student,
    token,
  };
};

export const getCurrentUser = async (userId) => {
  const user = await User.findById(userId);
  if (!user) {
    const error = new Error('User not found.');
    error.statusCode = 404;
    throw error;
  }

  let student = await Student.findOne({ user: user._id });
  return { user, student };
};
