import { sendError } from '../utils/response.js';

export const errorHandler = (err, req, res, _next) => {
  console.error(`[Error] ${req.method} ${req.originalUrl}:`, err);

  // Mongoose duplicate key error
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0] || 'field';
    return sendError(res, 400, `A record with this ${field} already exists.`);
  }

  // Mongoose CastError (bad ObjectId)
  if (err.name === 'CastError') {
    return sendError(res, 400, `Invalid ID resource format.`);
  }

  // JWT error
  if (err.name === 'JsonWebTokenError') {
    return sendError(res, 401, 'Invalid authentication token.');
  }

  const statusCode = err.statusCode || 500;
  const message = err.message || 'An unexpected error occurred on the server.';
  return sendError(res, statusCode, message);
};
