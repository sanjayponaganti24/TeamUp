import mongoose from 'mongoose';
import { INVITATION_STATUS, INVITATION_STATUS_LIST } from '../constants/invitation-status.js';

const invitationSchema = new mongoose.Schema(
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
    invitedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    role: {
      type: String,
      default: 'Member',
      trim: true,
    },
    message: {
      type: String,
      default: '',
      trim: true,
    },
    status: {
      type: String,
      enum: INVITATION_STATUS_LIST,
      default: INVITATION_STATUS.PENDING,
    },
    respondedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

invitationSchema.index({ room: 1, student: 1 });
invitationSchema.index({ student: 1, status: 1 });
invitationSchema.index({ invitedBy: 1 });

export const Invitation = mongoose.model('Invitation', invitationSchema);
