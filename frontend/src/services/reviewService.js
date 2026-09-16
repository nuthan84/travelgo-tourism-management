import api from './api';

export const reviewService = {
  getByPackageId: async (packageId) => {
    return await api.get(`/reviews/package/${packageId}`);
  },

  getAllForAdmin: async (status = '') => {
    return await api.get(`/reviews/admin/all${status ? `?status=${status}` : ''}`);
  },

  create: async (reviewData) => {
    return await api.post('/reviews', reviewData);
  },

  updateStatus: async (id, status) => {
    return await api.put(`/reviews/${id}/status`, { status });
  },

  delete: async (id) => {
    return await api.delete(`/reviews/${id}`);
  }
};

export default reviewService;
