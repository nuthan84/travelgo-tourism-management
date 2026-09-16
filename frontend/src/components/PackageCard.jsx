import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Clock, Star } from 'lucide-react';
import { formatCurrency } from '../utils/formatCurrency';
import { useAuth } from '../hooks/useAuth';
import wishlistService from '../services/wishlistService';

export const PackageCard = ({ packageData, isWishlisted = false, onWishlistToggle }) => {
  const { id, name, category, durationDays, durationNights, pricePerPerson, rating, mainImageUrl, destinationName } = packageData;
  const { isAuthenticated } = useAuth();
  const [wishlistActive, setWishlistActive] = useState(isWishlisted);
  const [loadingWishlist, setLoadingWishlist] = useState(false);

  const handleWishlistClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) {
      alert("Please login to save this package to your wishlist.");
      return;
    }

    try {
      setLoadingWishlist(true);
      if (wishlistActive) {
        await wishlistService.remove(id);
        setWishlistActive(false);
      } else {
        await wishlistService.add(id);
        setWishlistActive(true);
      }
      if (onWishlistToggle) onWishlistToggle(id, !wishlistActive);
    } catch (err) {
      console.error("Wishlist toggle error:", err);
    } finally {
      setLoadingWishlist(false);
    }
  };

  const getCategoryBadgeClass = (cat) => {
    switch (cat?.toLowerCase()) {
      case 'family':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'honeymoon':
        return 'bg-pink-50 text-pink-700 border-pink-200';
      case 'adventure':
        return 'bg-teal-50 text-teal-700 border-teal-200';
      case 'culture':
      case 'heritage':
        return 'bg-amber-50 text-amber-800 border-amber-200';
      default:
        return 'bg-blue-50 text-blue-700 border-blue-200';
    }
  };

  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col group">
      
      {/* Thumbnail with Wishlist Button */}
      <div className="relative h-52 overflow-hidden bg-gray-100">
        <img
          src={mainImageUrl || 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80'}
          alt={name}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition duration-500"
          loading="lazy"
        />
        
        {/* Wishlist Button */}
        <button
          onClick={handleWishlistClick}
          disabled={loadingWishlist}
          title="Save to Wishlist"
          className={`absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center backdrop-blur-md transition shadow-md ${
            wishlistActive
              ? 'bg-rose-500 text-white'
              : 'bg-white/80 text-gray-700 hover:bg-white hover:text-rose-500'
          }`}
        >
          <Heart className={`w-4 h-4 ${wishlistActive ? 'fill-current' : ''}`} />
        </button>

        {/* Rating Badge */}
        {rating > 0 && (
          <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-full text-white text-xs font-semibold flex items-center space-x-1">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span>{Number(rating).toFixed(1)}</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Category Tag */}
          {category && (
            <span className={`inline-block text-[11px] font-semibold px-2.5 py-0.5 rounded-full border mb-2 ${getCategoryBadgeClass(category)}`}>
              {category}
            </span>
          )}

          {/* Package Name */}
          <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition line-clamp-1">
            {name}
          </h3>

          {/* Destination & Duration */}
          <div className="flex items-center text-xs text-gray-500 mt-2 space-x-3">
            <span className="flex items-center">
              <Clock className="w-3.5 h-3.5 mr-1 text-gray-400" />
              {durationDays} Days | {durationNights} Nights
            </span>
            {destinationName && (
              <span className="text-gray-400">• {destinationName}</span>
            )}
          </div>
        </div>

        {/* Price & Action */}
        <div className="mt-5 pt-4 border-t border-gray-100 flex items-center justify-between">
          <div>
            <span className="text-lg font-extrabold text-gray-900">
              {formatCurrency(pricePerPerson)}
            </span>
            <span className="text-xs text-gray-500"> /person</span>
          </div>

          <Link
            to={`/packages/${id}`}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl shadow-sm hover:shadow transition"
          >
            View Details
          </Link>
        </div>

      </div>

    </div>
  );
};

export default PackageCard;
