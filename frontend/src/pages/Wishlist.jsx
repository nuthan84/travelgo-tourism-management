import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import wishlistService from '../services/wishlistService';
import Loader from '../components/Loader';
import { formatCurrency } from '../utils/formatCurrency';
import { Heart, Trash2, Clock, Star, MapPin } from 'lucide-react';

export const Wishlist = () => {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWishlist();
  }, []);

  const fetchWishlist = async () => {
    try {
      const data = await wishlistService.getWishlist();
      setWishlist(data || []);
    } catch (err) {
      console.error("Error fetching wishlist:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (packageId) => {
    try {
      await wishlistService.remove(packageId);
      setWishlist(wishlist.filter(item => item.packageId !== packageId));
    } catch (err) {
      alert("Failed to remove item: " + err.message);
    }
  };

  if (loading) return <Loader message="Loading your wishlist..." />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      <div className="pb-6 border-b border-gray-100">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
          Saved Wishlist
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 mt-1">
          Your favorite holiday destinations and packages saved for future adventures
        </p>
      </div>

      {wishlist.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center shadow-sm">
          <Heart className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-gray-800">Your wishlist is empty</h3>
          <p className="text-xs text-gray-500 mt-1">
            Tap the heart icon on any package to save it here for later.
          </p>
          <Link
            to="/packages"
            className="mt-5 inline-block px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl shadow"
          >
            Explore Packages
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {wishlist.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md border border-gray-100 flex flex-col justify-between group"
            >
              <div className="relative h-48 overflow-hidden bg-gray-100">
                <img
                  src={item.packageImage || 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80'}
                  alt={item.packageName}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                />
                <button
                  onClick={() => handleRemove(item.packageId)}
                  className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/80 hover:bg-white text-rose-500 flex items-center justify-center shadow transition"
                  title="Remove from wishlist"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-base text-gray-900 line-clamp-1">{item.packageName}</h3>
                  <div className="flex items-center text-xs text-gray-500 mt-1 space-x-3">
                    <span className="flex items-center">
                      <Clock className="w-3.5 h-3.5 mr-1" />
                      {item.durationDays} Days / {item.durationNights} Nights
                    </span>
                    {item.destinationName && <span>• {item.destinationName}</span>}
                  </div>
                </div>

                <div className="mt-5 pt-4 border-t border-gray-100 flex items-center justify-between">
                  <div>
                    <span className="text-base font-extrabold text-gray-900">
                      {formatCurrency(item.pricePerPerson)}
                    </span>
                    <span className="text-[11px] text-gray-400"> /person</span>
                  </div>

                  <Link
                    to={`/packages/${item.packageId}`}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl shadow transition"
                  >
                    Book Now
                  </Link>
                </div>
              </div>

            </div>
          ))}
        </div>
      )}

    </div>
  );
};

export default Wishlist;
