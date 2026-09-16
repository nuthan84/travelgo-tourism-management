import api from './api';

export const destinationService = {
  getAll: async (activeOnly = true) => {
    return await api.get(`/destinations?activeOnly=${activeOnly}`);
  },

  getById: async (id) => {
    return await api.get(`/destinations/${id}`);
  },

  create: async (data) => {
    return await api.post('/destinations', data);
  },

  update: async (id, data) => {
    return await api.put(`/destinations/${id}`, data);
  },

  delete: async (id) => {
    return await api.delete(`/destinations/${id}`);
  }
};

export default destinationService;
