import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import bookingService from '../services/bookingService';
import wishlistService from '../services/wishlistService';
import Loader from '../components/Loader';
import { formatDate } from '../utils/formatCurrency';
import {
  LayoutDashboard, Calendar, Heart, User, Settings, LogOut,
  Plane, CheckCircle2, Clock, ArrowRight, MapPin
} from 'lucide-react';

export const UserDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [bookings, setBookings] = useState([]);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const [bData, wData] = await Promise.all([
          bookingService.getMyBookings(),
          wishlistService.getWishlist()
        ]);
        setBookings(bData || []);
        setWishlistCount(wData ? wData.length : 0);
      } catch (err) {
        console.error("Dashboard data load error:", err);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const totalBookings = bookings.length;
  const upcomingTrips = bookings.filter(b => b.status === 'CONFIRMED' || b.status === 'PENDING');
  const completedTrips = bookings.filter(b => b.status === 'COMPLETED');

  if (loading) return <Loader message="Loading your dashboard..." />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        
        {/* User Dashboard Left Sidebar matching UI Reference */}
        <div className="md:col-span-4 lg:col-span-3 bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <div className="p-3 mb-2 flex items-center space-x-3 border-b border-gray-100 pb-4">
            <div className="w-11 h-11 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center text-base">
              {user?.fullName?.charAt(0).toUpperCase()}
            </div>
            <div className="overflow-hidden">
              <h3 className="font-bold text-gray-900 text-sm truncate">{user?.fullName}</h3>
              <p className="text-xs text-gray-400 truncate">{user?.email}</p>
            </div>
          </div>

          <nav className="space-y-1">
            <Link
              to="/dashboard"
              className="flex items-center px-4 py-2.5 text-xs sm:text-sm font-semibold text-blue-600 bg-blue-50 rounded-xl"
            >
              <LayoutDashboard className="w-4 h-4 mr-3 text-blue-600" />
              Dashboard
            </Link>

            <Link
              to="/my-bookings"
              className="flex items-center px-4 py-2.5 text-xs sm:text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-xl transition"
            >
              <Calendar className="w-4 h-4 mr-3 text-gray-400" />
              My Bookings
            </Link>

            <Link
              to="/wishlist"
              className="flex items-center px-4 py-2.5 text-xs sm:text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-xl transition"
            >
              <Heart className="w-4 h-4 mr-3 text-gray-400" />
              Wishlist
            </Link>

            <Link
              to="/profile"
              className="flex items-center px-4 py-2.5 text-xs sm:text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-xl transition"
            >
              <User className="w-4 h-4 mr-3 text-gray-400" />
              Profile
            </Link>

            <button
              onClick={handleLogout}
              className="flex items-center w-full px-4 py-2.5 text-xs sm:text-sm font-medium text-red-600 hover:bg-red-50 rounded-xl transition mt-4 pt-4 border-t border-gray-100"
            >
              <LogOut className="w-4 h-4 mr-3 text-red-500" />
              Logout
            </button>
          </nav>
        </div>

        {/* User Dashboard Right Content */}
        <div className="md:col-span-8 lg:col-span-9 space-y-8">
          
          {/* Welcome Header */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-100">
            <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">
              Welcome back, {user?.fullName?.split(' ')[0] || 'Traveller'}!
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              Here's an overview of your upcoming holidays and past adventures.
            </p>

            {/* 4 Stats Cards matching UI Reference */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
              
              {/* Total Bookings */}
              <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 text-center">
                <Calendar className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                <span className="text-xs text-gray-500 font-medium">Total Bookings</span>
                <p className="text-2xl font-extrabold text-gray-900 mt-1">{totalBookings}</p>
              </div>

              {/* Upcoming Trips */}
              <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 text-center">
                <Plane className="w-6 h-6 text-teal-600 mx-auto mb-2" />
                <span className="text-xs text-gray-500 font-medium">Upcoming Trips</span>
                <p className="text-2xl font-extrabold text-gray-900 mt-1">{upcomingTrips.length}</p>
              </div>

              {/* Completed Trips */}
              <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 text-center">
                <CheckCircle2 className="w-6 h-6 text-emerald-600 mx-auto mb-2" />
                <span className="text-xs text-gray-500 font-medium">Completed Trips</span>
                <p className="text-2xl font-extrabold text-gray-900 mt-1">{completedTrips.length}</p>
              </div>

              {/* Wishlist */}
              <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 text-center">
                <Heart className="w-6 h-6 text-rose-500 mx-auto mb-2" />
                <span className="text-xs text-gray-500 font-medium">Wishlist</span>
                <p className="text-2xl font-extrabold text-gray-900 mt-1">{wishlistCount}</p>
              </div>

            </div>
          </div>

          {/* My Upcoming Trips Section matching UI Reference */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-6 pb-3 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-900">My Upcoming Trips</h2>
              <Link to="/my-bookings" className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center">
                <span>View All</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </Link>
            </div>

            {upcomingTrips.length === 0 ? (
              <div className="text-center py-10 text-gray-500 text-sm">
                No upcoming trips planned yet. Explore our packages and start packing!
                <div className="mt-4">
                  <Link
                    to="/packages"
                    className="px-5 py-2.5 bg-blue-600 text-white rounded-xl text-xs font-semibold hover:bg-blue-700"
                  >
                    Browse Tour Packages
                  </Link>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {upcomingTrips.slice(0, 4).map((b) => (
                  <div
                    key={b.id}
                    className="p-4 rounded-2xl border border-gray-100 bg-gray-50/60 hover:bg-white hover:shadow-md transition flex flex-col justify-between"
                  >
                    <div className="flex space-x-3 items-center">
                      <img
                        src={b.packageImage || 'https://images.unsplash.com/photo-1566837945700-30057527ade0?auto=format&fit=crop&w=200&q=80'}
                        alt={b.packageName}
                        className="w-16 h-14 rounded-xl object-cover"
                      />
                      <div className="overflow-hidden">
                        <h4 className="font-bold text-sm text-gray-900 truncate">{b.packageName}</h4>
                        <div className="text-xs text-gray-500 flex items-center mt-1">
                          <Calendar className="w-3 h-3 mr-1" />
                          <span>{formatDate(b.travelDate)}</span>
                        </div>
                        <div className="text-xs text-gray-500 mt-0.5">
                          {b.travellers} {b.travellers === 1 ? 'Traveller' : 'Travellers'}
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-gray-200/60 flex items-center justify-between">
                      <span className={`px-2.5 py-0.5 text-[11px] font-bold rounded-full ${
                        b.status === 'CONFIRMED'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {b.status}
                      </span>
                      <Link
                        to={`/confirmation/${b.id}`}
                        className="text-xs font-semibold text-blue-600 hover:text-blue-700"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};

export default UserDashboard;
