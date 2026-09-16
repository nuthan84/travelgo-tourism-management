import api from './api';

export const wishlistService = {
  getWishlist: async () => {
    return await api.get('/wishlist');
  },

  add: async (packageId) => {
    return await api.post(`/wishlist/${packageId}`, {});
  },

  remove: async (packageId) => {
    return await api.delete(`/wishlist/${packageId}`);
  }
};

export default wishlistService;
