import mongoose from 'mongoose';
import { ROOM_TYPES, ROOM_TYPES_LIST } from '../constants/room-types.js';
import { ROOM_STATUS, ROOM_STATUS_LIST } from '../constants/room-status.js';

const memberSubSchema = new mongoose.Schema(
  {
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
    role: {
      type: String,
      default: 'Member',
    },
    joinedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: true }
);

const roomSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Room name is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Room description is required'],
      trim: true,
    },
    type: {
      type: String,
      enum: ROOM_TYPES_LIST,
      required: [true, 'Room type is required'],
    },
    host: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    hostStudent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student',
      required: true,
    },
    capacity: {
      type: Number,
      required: [true, 'Team capacity is required'],
      min: 2,
      max: 20,
      default: 4,
    },
    members: {
      type: [memberSubSchema],
      default: [],
    },
    requiredBranches: {
      type: [String],
      default: [],
    },
    requiredSkills: {
      type: [String],
      default: [],
    },
    requiredRoles: {
      type: [String],
      default: [],
    },
    deadline: {
      type: Date,
      required: [true, 'Application deadline is required'],
    },
    startDate: {
      type: Date,
      default: null,
    },
    endDate: {
      type: Date,
      default: null,
    },
    status: {
      type: String,
      enum: ROOM_STATUS_LIST,
      default: ROOM_STATUS.OPEN,
    },
    autoAccept: {
      type: Boolean,
      default: false,
    },
    typeDetails: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

roomSchema.index({ type: 1, status: 1 });
roomSchema.index({ host: 1 });
roomSchema.index({ deadline: 1 });
roomSchema.index({ requiredSkills: 1 });

export const Room = mongoose.model('Room', roomSchema);
