import api from './api';

export const bookingService = {
  create: async (bookingData) => {
    return await api.post('/bookings', bookingData);
  },

  getMyBookings: async () => {
    return await api.get('/bookings/my');
  },

  getById: async (id) => {
    return await api.get(`/bookings/${id}`);
  },

  getByReference: async (reference) => {
    return await api.get(`/bookings/ref/${reference}`);
  },

  cancel: async (id) => {
    return await api.put(`/bookings/${id}/cancel`, {});
  }
};

export default bookingService;
