const API_BASE_URL = 'http://localhost:3001/api';

export const apiClient = {
  get: async (endpoint, token) => {
    const headers = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, { headers });
      if (!response.ok) {
        const errorBody = await response.json().catch(() => ({ message: `Erro na API: ${response.status} ${response.statusText}` }));
        throw new Error(errorBody.message || `Erro na API: ${response.status}`);
      }
      return response.json();
    } catch (error) {
      console.error(`API GET Error (${endpoint}):`, error);
      throw error;
    }
  },
  post: async (endpoint, body, token) => {
    const headers = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'POST',
        headers,
        body: JSON.stringify(body),
      });
      if (!response.ok) {
        const errorBody = await response.json().catch(() => ({ message: `Erro na API: ${response.status} ${response.statusText}` }));
        throw new Error(errorBody.message || `Erro na API: ${response.status}`);
      }
      return response.json();
    } catch (error) {
      console.error(`API POST Error (${endpoint}):`, error);
      throw error;
    }
  },
  put: async (endpoint, body, token) => {
    const headers = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(body),
      });
      if (!response.ok) {
        const errorBody = await response.json().catch(() => ({ message: `Erro na API: ${response.status} ${response.statusText}` }));
        throw new Error(errorBody.message || `Erro na API: ${response.status}`);
      }
      return response.json();
    } catch (error) {
      console.error(`API PUT Error (${endpoint}):`, error);
      throw error;
    }
  },
  delete: async (endpoint, token) => {
    const headers = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'DELETE',
        headers,
      });
      if (!response.ok) {
        const errorBody = await response.json().catch(() => ({ message: `Erro na API: ${response.status} ${response.statusText}` }));
        throw new Error(errorBody.message || `Erro na API: ${response.status}`);
      }

      if (response.status === 204) return null; 
      return response.json();
    } catch (error) {
      console.error(`API DELETE Error (${endpoint}):`, error);
      throw error;
    }
  },
};
