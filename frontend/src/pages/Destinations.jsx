import React, { useState, useEffect } from 'react';
import destinationService from '../services/destinationService';
import DestinationCard from '../components/DestinationCard';
import Loader from '../components/Loader';
import { Search, MapPin } from 'lucide-react';

export const Destinations = () => {
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');

  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        const data = await destinationService.getAll(true);
        setDestinations(data || []);
      } catch (err) {
        console.error("Error fetching destinations:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDestinations();
  }, []);

  const categories = ['ALL', ...new Set(destinations.map(d => d.category).filter(Boolean))];

  const filteredDestinations = destinations.filter(dest => {
    const matchesSearch = dest.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (dest.state && dest.state.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'ALL' || dest.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
          Explore Destinations
        </h1>
        <p className="mt-2 text-sm sm:text-base text-gray-500">
          From tranquil southern backwaters to the majestic snowpeaks of the Himalayas.
        </p>
      </div>

      {/* Search & Category Pills */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search Bar */}
        <div className="w-full md:w-80 relative">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search destination or state..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-500 shadow-sm"
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center space-x-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                selectedCategory === cat
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Destinations Grid */}
      {loading ? (
        <Loader message="Loading destinations..." />
      ) : filteredDestinations.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-gray-100 shadow-sm">
          <MapPin className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-gray-800">No destinations found</h3>
          <p className="text-xs text-gray-500 mt-1">Try adjusting your search query or category filter.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredDestinations.map((dest) => (
            <DestinationCard key={dest.id} destination={dest} />
          ))}
        </div>
      )}

    </div>
  );
};

export default Destinations;
