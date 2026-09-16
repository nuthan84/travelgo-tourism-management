import api from './api';

export const packageService = {
  getPackages: async (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.destinationId) params.append('destinationId', filters.destinationId);
    if (filters.category) params.append('category', filters.category);
    if (filters.minPrice) params.append('minPrice', filters.minPrice);
    if (filters.maxPrice) params.append('maxPrice', filters.maxPrice);
    if (filters.duration) params.append('duration', filters.duration);
    if (filters.search) params.append('search', filters.search);

    const queryString = params.toString();
    return await api.get(`/packages${queryString ? `?${queryString}` : ''}`);
  },

  getAllForAdmin: async () => {
    return await api.get('/packages/admin/all');
  },

  getById: async (id) => {
    return await api.get(`/packages/${id}`);
  },

  create: async (data) => {
    return await api.post('/packages', data);
  },

  update: async (id, data) => {
    return await api.put(`/packages/${id}`, data);
  },

  delete: async (id) => {
    return await api.delete(`/packages/${id}`);
  }
};

export default packageService;
