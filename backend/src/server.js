import http from 'http';
import app from './app.js';
import { connectDB } from './config/db.js';
import { ENV } from './config/env.js';
import { initSocket } from './sockets/socket.js';
import { startDeadlineJob } from './jobs/deadline-job.js';

const httpServer = http.createServer(app);

initSocket(httpServer);

connectDB().then(() => {
  startDeadlineJob();

  httpServer.listen(ENV.PORT, () => {
    console.log(`[TeamUp Server] Running on http://localhost:${ENV.PORT}`);
    console.log(`[Environment] Mode: ${ENV.NODE_ENV}`);
  });
});

export default httpServer;
