import { API_BASE_URL } from '../utils/constants';

export const request = async (endpoint, options = {}) => {
  const token = localStorage.getItem('token');
  const headers = {
    ...options.headers
  };

  // Only set Content-Type to application/json if not FormData
  if (!(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const url = `${API_BASE_URL}${endpoint}`;
  const config = {
    ...options,
    headers
  };

  try {
    const response = await fetch(url, config);

    // If unauthorized / token expired, clear token and trigger event
    if (response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.dispatchEvent(new Event('auth-logout'));
    }

    // Handle responses with no content
    if (response.status === 204) {
      return null;
    }

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      const errorMsg = data?.message || (data?.errors ? Object.values(data.errors).join(', ') : 'Request failed');
      throw new Error(errorMsg);
    }

    return data;
  } catch (err) {
    console.error(`API Error on [${options.method || 'GET'}] ${endpoint}:`, err);
    throw err;
  }
};

export const api = {
  get: (endpoint) => request(endpoint, { method: 'GET' }),
  post: (endpoint, body) => request(endpoint, { method: 'POST', body: body instanceof FormData ? body : JSON.stringify(body) }),
  put: (endpoint, body) => request(endpoint, { method: 'PUT', body: body instanceof FormData ? body : JSON.stringify(body) }),
  delete: (endpoint) => request(endpoint, { method: 'DELETE' })
};

export default api;
