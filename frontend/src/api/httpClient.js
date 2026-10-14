import { API_BASE } from '../config/env';
import { sessionStorageService } from '../storage/sessionStorage';

export async function request(endpoint, options = {}) {
  const token = sessionStorageService.getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers
  };

  try {
    const res = await fetch(`${API_BASE}${endpoint}`, { ...options, headers });
    const data = await res.json();
    if (!res.ok) {
      const error = new Error(data.error || 'Error en la petición al servidor');
      error.status = res.status;
      throw error;
    }
    return data;
  } catch (err) {
    console.warn(`[API Fetch Warning] ${endpoint}: ${err.message}. Using fallback endpoint.`);
    throw err;
  }
}
