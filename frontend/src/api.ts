// API configuration
// export const API_URL = 'http://127.0.0.1:8000';
export const API_URL = 'https://simple-website-7opr.onrender.com';

export function getAuthHeader() {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}
