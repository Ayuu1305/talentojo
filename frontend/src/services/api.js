/**
 * API Service for interacting with backend endpoints
 */

const API_BASE = '/api';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

const handleResponse = async (response) => {
  const data = await response.json();
  if (!response.ok) {
    const errorMsg = data.message || (data.errors && data.errors.join(', ')) || 'An error occurred';
    throw new Error(errorMsg);
  }
  return data;
};

export const api = {
  // Authentication & Profile APIs
  auth: {
    login: async (email, password) => {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      return handleResponse(res);
    },

    signup: async (userData) => {
      const res = await fetch(`${API_BASE}/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });
      return handleResponse(res);
    },

    getMe: async () => {
      const res = await fetch(`${API_BASE}/auth/me`, {
        headers: getAuthHeaders(),
      });
      return handleResponse(res);
    },

    updatePassword: async (currentPassword, newPassword) => {
      const res = await fetch(`${API_BASE}/auth/update-password`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      return handleResponse(res);
    },
  },

  // Admin APIs
  admin: {
    getStats: async () => {
      const res = await fetch(`${API_BASE}/admin/stats`, {
        headers: getAuthHeaders(),
      });
      return handleResponse(res);
    },

    getUsers: async (filters = {}) => {
      const params = new URLSearchParams();
      if (filters.name) params.append('name', filters.name);
      if (filters.email) params.append('email', filters.email);
      if (filters.address) params.append('address', filters.address);
      if (filters.role) params.append('role', filters.role);
      if (filters.sortBy) params.append('sortBy', filters.sortBy);
      if (filters.sortOrder) params.append('sortOrder', filters.sortOrder);

      const res = await fetch(`${API_BASE}/admin/users?${params.toString()}`, {
        headers: getAuthHeaders(),
      });
      return handleResponse(res);
    },

    createUser: async (userData) => {
      const res = await fetch(`${API_BASE}/admin/users`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(userData),
      });
      return handleResponse(res);
    },

    getStores: async (filters = {}) => {
      const params = new URLSearchParams();
      if (filters.name) params.append('name', filters.name);
      if (filters.email) params.append('email', filters.email);
      if (filters.address) params.append('address', filters.address);
      if (filters.sortBy) params.append('sortBy', filters.sortBy);
      if (filters.sortOrder) params.append('sortOrder', filters.sortOrder);

      const res = await fetch(`${API_BASE}/admin/stores?${params.toString()}`, {
        headers: getAuthHeaders(),
      });
      return handleResponse(res);
    },

    createStore: async (storeData) => {
      const res = await fetch(`${API_BASE}/admin/stores`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(storeData),
      });
      return handleResponse(res);
    },

    getStoreOwners: async () => {
      const res = await fetch(`${API_BASE}/admin/store-owners`, {
        headers: getAuthHeaders(),
      });
      return handleResponse(res);
    },
  },

  // Normal User Store Listings & Ratings APIs
  stores: {
    getAll: async (params = {}) => {
      const query = new URLSearchParams();
      if (params.search) query.append('search', params.search);
      if (params.sortBy) query.append('sortBy', params.sortBy);
      if (params.sortOrder) query.append('sortOrder', params.sortOrder);

      const res = await fetch(`${API_BASE}/stores?${query.toString()}`, {
        headers: getAuthHeaders(),
      });
      return handleResponse(res);
    },

    submitRating: async (storeId, rating) => {
      const res = await fetch(`${API_BASE}/stores/${storeId}/rating`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ rating }),
      });
      return handleResponse(res);
    },
  },

  // Store Owner Dashboard APIs
  owner: {
    getDashboard: async (params = {}) => {
      const query = new URLSearchParams();
      if (params.sortBy) query.append('sortBy', params.sortBy);
      if (params.sortOrder) query.append('sortOrder', params.sortOrder);

      const res = await fetch(`${API_BASE}/owner/dashboard?${query.toString()}`, {
        headers: getAuthHeaders(),
      });
      return handleResponse(res);
    },
  },
};
