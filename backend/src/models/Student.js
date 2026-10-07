import mongoose from 'mongoose';
import { AVAILABILITY_STATUS, AVAILABILITY_STATUS_LIST } from '../constants/availability-status.js';

const projectSubSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, default: '' },
    link: { type: String, default: '' },
    role: { type: String, default: '' },
    techStack: [{ type: String }],
  },
  { _id: true }
);

const experienceSubSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    organization: { type: String, default: '' },
    duration: { type: String, default: '' },
    description: { type: String, default: '' },
  },
  { _id: true }
);

const studentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    branch: {
      type: String,
      default: 'Computer Science and Engineering',
      trim: true,
    },
    year: {
      type: Number,
      default: 2,
      min: 1,
      max: 5,
    },
    skills: {
      type: [String],
      default: [],
    },
    interests: {
      type: [String],
      default: [],
    },
    preferredRoles: {
      type: [String],
      default: [],
    },
    availability: {
      type: String,
      enum: AVAILABILITY_STATUS_LIST,
      default: AVAILABILITY_STATUS.AVAILABLE,
    },
    bio: {
      type: String,
      default: '',
    },
    projects: {
      type: [projectSubSchema],
      default: [],
    },
    experience: {
      type: [experienceSubSchema],
      default: [],
    },
    githubUrl: {
      type: String,
      default: '',
    },
    linkedinUrl: {
      type: String,
      default: '',
    },
    portfolioUrl: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

studentSchema.index({ skills: 1 });
studentSchema.index({ branch: 1 });
studentSchema.index({ availability: 1 });

export const Student = mongoose.model('Student', studentSchema);
