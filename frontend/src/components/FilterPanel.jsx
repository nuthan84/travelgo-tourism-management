import React from 'react';
import { CATEGORIES, DURATIONS } from '../utils/constants';
import { Star, RotateCcw } from 'lucide-react';

export const FilterPanel = ({
  destinations = [],
  selectedDestination,
  onDestinationChange,
  selectedCategory,
  onCategoryChange,
  priceRange,
  onPriceRangeChange,
  selectedDuration,
  onDurationChange,
  selectedRating,
  onRatingChange,
  onReset
}) => {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-6">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-gray-100">
        <h3 className="font-bold text-gray-900 text-base">Filters</h3>
        <button
          onClick={onReset}
          className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center"
        >
          <RotateCcw className="w-3 h-3 mr-1" />
          Reset All
        </button>
      </div>

      {/* Destination Filter */}
      <div>
        <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">Destination</h4>
        <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
          <label className="flex items-center text-sm text-gray-700 hover:text-blue-600 cursor-pointer">
            <input
              type="radio"
              name="destination"
              checked={!selectedDestination}
              onChange={() => onDestinationChange('')}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <span className="ml-2.5">All Destinations</span>
          </label>
          {destinations.map((dest) => (
            <label key={dest.id} className="flex items-center text-sm text-gray-700 hover:text-blue-600 cursor-pointer">
              <input
                type="radio"
                name="destination"
                checked={selectedDestination === String(dest.id)}
                onChange={() => onDestinationChange(String(dest.id))}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="ml-2.5">{dest.name}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Price Range Slider */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500">Price Range</h4>
          <span className="text-xs font-semibold text-blue-600">Up to ₹{Number(priceRange).toLocaleString('en-IN')}</span>
        </div>
        <input
          type="range"
          min="10000"
          max="100000"
          step="5000"
          value={priceRange}
          onChange={(e) => onPriceRangeChange(e.target.value)}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
        />
        <div className="flex justify-between text-[11px] text-gray-400 mt-1">
          <span>₹10,000</span>
          <span>₹1,00,000</span>
        </div>
      </div>

      {/* Duration Filter */}
      <div>
        <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">Duration</h4>
        <div className="space-y-2">
          <label className="flex items-center text-sm text-gray-700 hover:text-blue-600 cursor-pointer">
            <input
              type="radio"
              name="duration"
              checked={!selectedDuration}
              onChange={() => onDurationChange('')}
              className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
            />
            <span className="ml-2.5">Any Duration</span>
          </label>
          {DURATIONS.map((dur) => (
            <label key={dur.label} className="flex items-center text-sm text-gray-700 hover:text-blue-600 cursor-pointer">
              <input
                type="radio"
                name="duration"
                checked={selectedDuration === String(dur.min)}
                onChange={() => onDurationChange(String(dur.min))}
                className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
              />
              <span className="ml-2.5">{dur.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Rating Filter */}
      <div>
        <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">Rating</h4>
        <div className="space-y-2">
          <label className="flex items-center text-sm text-gray-700 hover:text-blue-600 cursor-pointer">
            <input
              type="radio"
              name="rating"
              checked={!selectedRating}
              onChange={() => onRatingChange('')}
              className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
            />
            <span className="ml-2.5">All Ratings</span>
          </label>
          <label className="flex items-center text-sm text-gray-700 hover:text-blue-600 cursor-pointer">
            <input
              type="radio"
              name="rating"
              checked={selectedRating === '4'}
              onChange={() => onRatingChange('4')}
              className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
            />
            <div className="ml-2.5 flex items-center space-x-1">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>4.0 & above</span>
            </div>
          </label>
        </div>
      </div>

      {/* Category Filter */}
      <div>
        <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">Category</h4>
        <div className="space-y-2">
          <label className="flex items-center text-sm text-gray-700 hover:text-blue-600 cursor-pointer">
            <input
              type="radio"
              name="category"
              checked={!selectedCategory}
              onChange={() => onCategoryChange('')}
              className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
            />
            <span className="ml-2.5">All Categories</span>
          </label>
          {CATEGORIES.map((cat) => (
            <label key={cat} className="flex items-center text-sm text-gray-700 hover:text-blue-600 cursor-pointer">
              <input
                type="radio"
                name="category"
                checked={selectedCategory === cat}
                onChange={() => onCategoryChange(cat)}
                className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
              />
              <span className="ml-2.5">{cat}</span>
            </label>
          ))}
        </div>
      </div>

    </div>
  );
};

export default FilterPanel;
