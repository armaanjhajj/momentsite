const isDev = import.meta.env.DEV;

// In dev we hit localhost:3001 (your local server). In prod, use same-origin "".
export const API_BASE_URL = isDev ? 'http://localhost:3001' : '';

export const API_ENDPOINTS = {
  waitlist: `${API_BASE_URL}/api/waitlist`,
  health: `${API_BASE_URL}/api/health`,
};
