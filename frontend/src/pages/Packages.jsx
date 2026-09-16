import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import packageService from '../services/packageService';
import destinationService from '../services/destinationService';
import wishlistService from '../services/wishlistService';
import { useAuth } from '../hooks/useAuth';
import FilterPanel from '../components/FilterPanel';
import PackageCard from '../components/PackageCard';
import Loader from '../components/Loader';
import { SlidersHorizontal, PackageOpen } from 'lucide-react';

export const Packages = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { isAuthenticated } = useAuth();

  const [packages, setPackages] = useState([]);
  const [destinations, setDestinations] = useState([]);
  const [wishlistIds, setWishlistIds] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('popularity');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Filter states initialized from URL parameters
  const [selectedDestination, setSelectedDestination] = useState(searchParams.get('destinationId') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
  const [priceRange, setPriceRange] = useState(searchParams.get('maxPrice') || '100000');
  const [selectedDuration, setSelectedDuration] = useState(searchParams.get('duration') || '');
  const [selectedRating, setSelectedRating] = useState(searchParams.get('rating') || '');
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');

  // Load destinations & user wishlist
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const dests = await destinationService.getAll(true);
        setDestinations(dests || []);

        if (isAuthenticated) {
          const wl = await wishlistService.getWishlist();
          if (wl) {
            setWishlistIds(new Set(wl.map(item => item.packageId)));
          }
        }
      } catch (err) {
        console.error("Failed to load filter metadata:", err);
      }
    };
    fetchInitialData();
  }, [isAuthenticated]);

  // Fetch filtered packages from backend
  useEffect(() => {
    const fetchPackages = async () => {
      setLoading(true);
      try {
        const filters = {
          destinationId: selectedDestination,
          category: selectedCategory,
          maxPrice: priceRange,
          duration: selectedDuration,
          search: searchTerm
        };

        const data = await packageService.getPackages(filters);
        let list = data || [];

        // Filter by rating client-side if rating selected
        if (selectedRating) {
          list = list.filter(p => Number(p.rating) >= Number(selectedRating));
        }

        // Sorting
        if (sortBy === 'price-low') {
          list.sort((a, b) => Number(a.pricePerPerson) - Number(b.pricePerPerson));
        } else if (sortBy === 'price-high') {
          list.sort((a, b) => Number(b.pricePerPerson) - Number(a.pricePerPerson));
        } else if (sortBy === 'rating') {
          list.sort((a, b) => Number(b.rating) - Number(a.rating));
        }

        setPackages(list);
      } catch (err) {
        console.error("Error fetching packages:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPackages();
  }, [selectedDestination, selectedCategory, priceRange, selectedDuration, selectedRating, searchTerm, sortBy]);

  const handleResetFilters = () => {
    setSelectedDestination('');
    setSelectedCategory('');
    setPriceRange('100000');
    setSelectedDuration('');
    setSelectedRating('');
    setSearchTerm('');
    setSearchParams({});
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Page Title and Mobile Filter Trigger */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-6 border-b border-gray-100 gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
            Tour Packages
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            {packages.length} curated packages found across India
          </p>
        </div>

        <div className="flex items-center space-x-3">
          {/* Mobile Filter Toggle */}
          <button
            onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
            className="md:hidden flex items-center px-4 py-2 border border-gray-200 rounded-xl text-xs font-semibold text-gray-700 bg-white"
          >
            <SlidersHorizontal className="w-4 h-4 mr-2" />
            Filters
          </button>

          {/* Sort Dropdown */}
          <div className="flex items-center space-x-2">
            <span className="text-xs text-gray-500 hidden sm:inline">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs font-semibold text-gray-700 focus:outline-none focus:border-blue-500 shadow-sm cursor-pointer"
            >
              <option value="popularity">Popularity</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Two-Column Layout matching UI Reference */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Filter Sidebar */}
        <div className={`md:col-span-4 lg:col-span-3 ${mobileFilterOpen ? 'block' : 'hidden md:block'}`}>
          <FilterPanel
            destinations={destinations}
            selectedDestination={selectedDestination}
            onDestinationChange={setSelectedDestination}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
            priceRange={priceRange}
            onPriceRangeChange={setPriceRange}
            selectedDuration={selectedDuration}
            onDurationChange={setSelectedDuration}
            selectedRating={selectedRating}
            onRatingChange={setSelectedRating}
            onReset={handleResetFilters}
          />
        </div>

        {/* Right Column: Packages Grid */}
        <div className="md:col-span-8 lg:col-span-9">
          {loading ? (
            <Loader message="Loading holiday packages..." />
          ) : packages.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center shadow-sm">
              <PackageOpen className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <h3 className="text-base font-bold text-gray-800">No matching packages found</h3>
              <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">
                We couldn't find any packages matching your filter criteria. Try resetting filters or choosing different options.
              </p>
              <button
                onClick={handleResetFilters}
                className="mt-5 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl shadow transition"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {packages.map((pkg) => (
                <PackageCard
                  key={pkg.id}
                  packageData={pkg}
                  isWishlisted={wishlistIds.has(pkg.id)}
                />
              ))}
            </div>
          )}
        </div>

      </div>

    </div>
  );
};

export default Packages;
