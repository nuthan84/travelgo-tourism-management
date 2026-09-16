import api from './api';

export const paymentService = {
  createOrder: async (bookingId) => {
    return await api.post('/payments/create-order', { bookingId });
  },

  verifyPayment: async (paymentData) => {
    return await api.post('/payments/verify', paymentData);
  },

  getByBookingId: async (bookingId) => {
    return await api.get(`/payments/${bookingId}`);
  }
};

export default paymentService;
