import { Notification, NOTIFICATION_TYPES } from '../models/Notification.js';
import { emitToUser } from '../sockets/socket.js';

export { NOTIFICATION_TYPES };

export const createNotification = async ({
  recipient,
  sender = null,
  type,
  title,
  message,
  link = '',
  room = null,
}) => {
  try {
    const notification = await Notification.create({
      recipient,
      sender,
      type,
      title,
      message,
      link,
      room,
    });

    const populated = await Notification.findById(notification._id)
      .populate('sender', 'name email')
      .populate('room', 'name type');

    emitToUser(recipient, 'NOTIFICATION_RECEIVED', populated);
    return populated;
  } catch (error) {
    console.error('[NotificationService] Error creating notification:', error.message);
    return null;
  }
};

export const getUserNotifications = async (userId, { limit = 20, page = 1 } = {}) => {
  const skip = (page - 1) * limit;

  const [notifications, total, unreadCount] = await Promise.all([
    Notification.find({ recipient: userId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('sender', 'name email')
      .populate('room', 'name type'),
    Notification.countDocuments({ recipient: userId }),
    Notification.countDocuments({ recipient: userId, read: false }),
  ]);

  return {
    notifications,
    total,
    unreadCount,
    page,
    pages: Math.ceil(total / limit),
  };
};

export const markAsRead = async (notificationId, userId) => {
  const notification = await Notification.findOneAndUpdate(
    { _id: notificationId, recipient: userId },
    { read: true },
    { new: true }
  );
  return notification;
};

export const markAllAsRead = async (userId) => {
  await Notification.updateMany({ recipient: userId, read: false }, { read: true });
  return true;
};
