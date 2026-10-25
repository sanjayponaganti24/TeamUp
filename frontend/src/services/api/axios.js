import axios from 'axios';

const configuredApiBase = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const apiUrl = new URL(configuredApiBase, window.location.origin);
const localHosts = new Set(['localhost', '127.0.0.1']);

// Keep localhost aliases aligned so the browser sends the auth cookie in dev.
if (
  import.meta.env.DEV &&
  localHosts.has(window.location.hostname) &&
  localHosts.has(apiUrl.hostname)
) {
  apiUrl.hostname = window.location.hostname;
}

const api = axios.create({
  baseURL: apiUrl.toString().replace(/\/$/, ''),
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const customError = {
      status: error.response?.status,
      message: error.response?.data?.message || error.message || 'Something went wrong',
      errors: error.response?.data?.errors,
    };
    return Promise.reject(customError);
  }
);

export default api;
