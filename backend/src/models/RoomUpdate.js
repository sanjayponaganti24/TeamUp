import mongoose from 'mongoose';

const roomUpdateSchema = new mongoose.Schema(
  {
    room: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Room',
      required: true,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: [true, 'Update title is required'],
      trim: true,
    },
    content: {
      type: String,
      required: [true, 'Update content is required'],
    },
    type: {
      type: String,
      enum: ['UPDATE', 'MILESTONE', 'ANNOUNCEMENT', 'ACTIVITY'],
      default: 'UPDATE',
    },
    pinned: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

roomUpdateSchema.index({ room: 1, createdAt: -1 });

export const RoomUpdate = mongoose.model('RoomUpdate', roomUpdateSchema);
