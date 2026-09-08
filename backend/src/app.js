import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { ENV } from './config/env.js';
import { errorHandler } from './middleware/error-middleware.js';

import authRoutes from './routes/auth-api.js';
import studentRoutes from './routes/student-api.js';
import roomRoutes from './routes/room-api.js';
import applicationRoutes from './routes/application-api.js';
import invitationRoutes from './routes/invitation-api.js';
import matchingRoutes from './routes/matching-api.js';
import recommendationRoutes from './routes/recommendation-api.js';
import notificationRoutes from './routes/notification-api.js';
import roomUpdateRoutes from './routes/room-update-api.js';

const app = express();

app.use(
  cors({
    origin: [ENV.CLIENT_URL, 'http://localhost:5173', 'http://127.0.0.1:5173'],
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health Check
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'TeamUp Backend API',
  });
});

// API Routes
app.use('/api/auth-api', authRoutes);
app.use('/api/student-api', studentRoutes);
app.use('/api/room-api', roomRoutes);
app.use('/api/application-api', applicationRoutes);
app.use('/api/invitation-api', invitationRoutes);
app.use('/api/matching-api', matchingRoutes);
app.use('/api/recommendation-api', recommendationRoutes);
app.use('/api/notification-api', notificationRoutes);
app.use('/api/room-update-api', roomUpdateRoutes);

// Centralized error handling
app.use(errorHandler);

export default app;
