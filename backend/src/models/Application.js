import mongoose from 'mongoose';
import { APPLICATION_STATUS, APPLICATION_STATUS_LIST } from '../constants/application-status.js';

const applicationSchema = new mongoose.Schema(
  {
    room: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Room',
      required: true,
    },
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student',
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    message: {
      type: String,
      default: '',
      trim: true,
    },
    requestedRole: {
      type: String,
      default: 'Member',
      trim: true,
    },
    status: {
      type: String,
      enum: APPLICATION_STATUS_LIST,
      default: APPLICATION_STATUS.PENDING,
    },
    reviewedAt: {
      type: Date,
      default: null,
    },
    reviewerFeedback: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

applicationSchema.index({ room: 1, student: 1 });
applicationSchema.index({ user: 1 });
applicationSchema.index({ status: 1 });

export const Application = mongoose.model('Application', applicationSchema);
