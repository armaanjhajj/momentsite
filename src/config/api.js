// API configuration for development and production
const isDevelopment = import.meta.env.DEV;

export const API_BASE_URL = isDevelopment 
  ? 'http://localhost:3001' 
  : 'https://makemoments.app';

export const API_ENDPOINTS = {
  waitlist: `${API_BASE_URL}/api/waitlist`,
  health: `${API_BASE_URL}/api/health`
};
