import api from './api';

export const adminService = {
  getDashboardStats: async () => {
    return await api.get('/admin/dashboard');
  },

  getAllUsers: async () => {
    return await api.get('/admin/users');
  },

  updateUserStatus: async (id, status) => {
    return await api.put(`/admin/users/${id}/status`, { status });
  },

  getAllBookings: async () => {
    return await api.get('/admin/bookings');
  },

  updateBookingStatus: async (id, status) => {
    return await api.put(`/admin/bookings/${id}/status`, { status });
  },

  getAllPayments: async () => {
    return await api.get('/admin/payments');
  },

  uploadImage: async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return await api.post('/upload/image', formData);
  }
};

export default adminService;
