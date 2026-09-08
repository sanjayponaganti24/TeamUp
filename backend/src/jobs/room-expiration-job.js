import { processDeadlines } from '../services/deadline-service.js';

export const runRoomExpirationJob = async () => {
  await processDeadlines();
};
