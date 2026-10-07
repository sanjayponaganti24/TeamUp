import { processDeadlines } from '../services/deadline-service.js';

let intervalId = null;

export const startDeadlineJob = () => {
  console.log('[Jobs] Deadline and expiration scheduler initiated (interval: 60s)');
  // Run once immediately on server startup
  processDeadlines();

  intervalId = setInterval(() => {
    processDeadlines();
  }, 60 * 1000);
};

export const stopDeadlineJob = () => {
  if (intervalId) {
    clearInterval(intervalId);
    intervalId = null;
  }
};
