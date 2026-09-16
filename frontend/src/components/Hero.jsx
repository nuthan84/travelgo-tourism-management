import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Calendar, Users, Search, ShieldCheck, Award, Headphones, Lock } from 'lucide-react';

export const Hero = () => {
  const navigate = useNavigate();
  const [destination, setDestination] = useState('');
  const [date, setDate] = useState('');
  const [travellers, setTravellers] = useState('2 Travellers');

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (destination.trim()) params.append('search', destination.trim());
    navigate(`/packages${params.toString() ? `?${params.toString()}` : ''}`);
  };

  return (
    <div className="relative">
      {/* Hero Banner with Kashmir Mountain Background */}
      <div className="relative min-h-[540px] md:min-h-[580px] flex items-center justify-center bg-gray-900 overflow-hidden">
        {/* Background Image */}
        <img
          src="https://images.unsplash.com/photo-1566837945700-30057527ade0?auto=format&fit=crop&w=2000&q=85"
          alt="Discover India"
          className="absolute inset-0 w-full h-full object-cover object-center scale-105"
        />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-navy-950/90 via-navy-950/50 to-navy-900/40"></div>

        {/* Content */}
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-16">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white tracking-tight leading-tight drop-shadow-md">
            Discover <span className="text-teal-400 underline decoration-teal-400/40 decoration-4">India</span>, Your Way
          </h1>
          <p className="mt-4 text-base sm:text-lg md:text-xl text-gray-200 max-w-2xl mx-auto font-light drop-shadow">
            Explore breathtaking destinations, curated tour packages, and unforgettable experiences.
          </p>

          {/* Search Card */}
          <div className="mt-8 sm:mt-10 bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl p-3 sm:p-4 border border-white/40 max-w-4xl mx-auto">
            <form onSubmit={handleSearch} className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
              
              {/* Destination Search */}
              <div className="sm:col-span-5 flex items-center px-3.5 py-2.5 bg-gray-50/80 rounded-xl border border-gray-200/80 focus-within:border-blue-500 focus-within:bg-white transition">
                <MapPin className="w-5 h-5 text-gray-400 shrink-0 mr-3" />
                <input
                  type="text"
                  placeholder="Where do you want to go?"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  className="w-full bg-transparent text-sm text-gray-800 placeholder-gray-400 focus:outline-none"
                />
              </div>

              {/* Travel Date */}
              <div className="sm:col-span-3 flex items-center px-3.5 py-2.5 bg-gray-50/80 rounded-xl border border-gray-200/80 focus-within:border-blue-500 focus-within:bg-white transition">
                <Calendar className="w-5 h-5 text-gray-400 shrink-0 mr-3" />
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full bg-transparent text-sm text-gray-700 focus:outline-none"
                />
              </div>

              {/* Travellers count */}
              <div className="sm:col-span-2 flex items-center px-3 py-2.5 bg-gray-50/80 rounded-xl border border-gray-200/80 focus-within:border-blue-500 focus-within:bg-white transition">
                <Users className="w-5 h-5 text-gray-400 shrink-0 mr-2" />
                <select
                  value={travellers}
                  onChange={(e) => setTravellers(e.target.value)}
                  className="w-full bg-transparent text-sm text-gray-700 focus:outline-none cursor-pointer"
                >
                  <option value="1 Traveller">1 Traveller</option>
                  <option value="2 Travellers">2 Travellers</option>
                  <option value="3 Travellers">3 Travellers</option>
                  <option value="4 Travellers">4 Travellers</option>
                  <option value="5+ Travellers">5+ Travellers</option>
                </select>
              </div>

              {/* Search Button */}
              <div className="sm:col-span-2">
                <button
                  type="submit"
                  className="w-full flex items-center justify-center py-3 px-5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl shadow-md hover:shadow-lg transition group"
                >
                  <Search className="w-4 h-4 mr-2 group-hover:scale-110 transition" />
                  Search
                </button>
              </div>

            </form>
          </div>
        </div>
      </div>

      {/* Feature Highlights Bar matching UI reference */}
      <div className="bg-navy-900 border-t border-navy-800 py-4 px-4 sm:px-6 lg:px-8 shadow-inner">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div className="flex items-center justify-center space-x-2.5 text-gray-300 py-1">
            <ShieldCheck className="w-5 h-5 text-teal-400 shrink-0" />
            <span className="text-xs sm:text-sm font-medium">Best Price Guarantee</span>
          </div>
          <div className="flex items-center justify-center space-x-2.5 text-gray-300 py-1">
            <Award className="w-5 h-5 text-teal-400 shrink-0" />
            <span className="text-xs sm:text-sm font-medium">Handpicked Packages</span>
          </div>
          <div className="flex items-center justify-center space-x-2.5 text-gray-300 py-1">
            <Headphones className="w-5 h-5 text-teal-400 shrink-0" />
            <span className="text-xs sm:text-sm font-medium">24/7 Support</span>
          </div>
          <div className="flex items-center justify-center space-x-2.5 text-gray-300 py-1">
            <Lock className="w-5 h-5 text-teal-400 shrink-0" />
            <span className="text-xs sm:text-sm font-medium">Safe & Secure Booking</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
