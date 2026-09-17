import React, { useState, useEffect } from 'react';
import adminService from '../services/adminService';
import Loader from '../components/Loader';
import { formatCurrency, formatDate } from '../utils/formatCurrency';
import { Users, Package, CalendarCheck, IndianRupee, TrendingUp, BarChart3, Clock, MapPin, AlertCircle, RefreshCw } from 'lucide-react';

export const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDashboard = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await adminService.getDashboardStats();
      setStats(data);
    } catch (err) {
      console.error("Failed to load admin stats:", err);
      setError(err.message || "Failed to connect to backend server.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  if (loading) return <Loader message="Loading admin metrics..." />;
  if (error || !stats) {
    return (
      <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm text-center max-w-lg mx-auto my-12 space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
          <AlertCircle className="w-6 h-6" />
        </div>
        <h3 className="text-lg font-bold text-gray-900">Admin Metrics Unavailable</h3>
        <p className="text-xs text-gray-500 max-w-sm mx-auto">
          {error || "Failed to load dashboard statistics from backend."}
        </p>
        <button
          onClick={fetchDashboard}
          className="inline-flex items-center px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow transition space-x-2"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Retry Connection</span>
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      
      {/* 4 Dashboard Metric Cards strictly matching UI Reference */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Total Users */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex items-center space-x-4">
          <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <Users className="w-7 h-7" />
          </div>
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">Total Users</span>
            <p className="text-2xl sm:text-3xl font-extrabold text-gray-900 mt-0.5">{stats.totalUsers}</p>
          </div>
        </div>

        {/* Total Packages */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex items-center space-x-4">
          <div className="w-14 h-14 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
            <Package className="w-7 h-7" />
          </div>
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">Total Packages</span>
            <p className="text-2xl sm:text-3xl font-extrabold text-gray-900 mt-0.5">{stats.totalPackages}</p>
          </div>
        </div>

        {/* Total Bookings */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex items-center space-x-4">
          <div className="w-14 h-14 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
            <CalendarCheck className="w-7 h-7" />
          </div>
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">Total Bookings</span>
            <p className="text-2xl sm:text-3xl font-extrabold text-gray-900 mt-0.5">{stats.totalBookings}</p>
          </div>
        </div>

        {/* Total Revenue */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex items-center space-x-4">
          <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <IndianRupee className="w-7 h-7" />
          </div>
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">Total Revenue</span>
            <p className="text-xl sm:text-2xl font-extrabold text-gray-900 mt-0.5">
              {formatCurrency(stats.totalRevenue)}
            </p>
          </div>
        </div>

      </div>

      {/* Charts Section matching UI Reference */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Booking Statistics Bar Visualization */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            <h3 className="text-base font-bold text-gray-900 flex items-center">
              <BarChart3 className="w-5 h-5 mr-2 text-blue-600" />
              Booking Statistics
            </h3>
            <span className="text-xs text-gray-400">Monthly Volume</span>
          </div>

          <div className="h-56 flex items-end justify-between px-4 pt-6 space-x-2">
            {(stats.bookingStatistics || []).map((item, idx) => (
              <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                <span className="text-[10px] font-bold text-blue-600 opacity-0 group-hover:opacity-100 transition">
                  {item.count}
                </span>
                <div
                  style={{ height: `${Math.min(100, Math.max(15, (item.count / 200) * 100))}%` }}
                  className="w-full max-w-[32px] bg-blue-600 hover:bg-blue-700 rounded-t-lg transition-all"
                ></div>
                <span className="text-xs font-medium text-gray-500">{item.month}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Revenue Statistics Line / Area Visualization */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            <h3 className="text-base font-bold text-gray-900 flex items-center">
              <TrendingUp className="w-5 h-5 mr-2 text-teal-600" />
              Revenue Statistics
            </h3>
            <span className="text-xs text-gray-400">Monthly Growth</span>
          </div>

          <div className="h-56 flex items-end justify-between px-4 pt-6 space-x-2">
            {(stats.revenueStatistics || []).map((item, idx) => (
              <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                <span className="text-[10px] font-bold text-teal-600 opacity-0 group-hover:opacity-100 transition">
                  ₹{(item.amount / 1000).toFixed(0)}k
                </span>
                <div
                  style={{ height: `${Math.min(100, Math.max(20, (item.amount / 1000000) * 100))}%` }}
                  className="w-full max-w-[32px] bg-teal-500 hover:bg-teal-600 rounded-t-lg transition-all"
                ></div>
                <span className="text-xs font-medium text-gray-500">{item.month}</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Bottom Row: Recent Bookings Table & Popular Destinations matching UI Reference */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Recent Bookings Table */}
        <div className="lg:col-span-8 bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            <h3 className="text-base font-bold text-gray-900">Recent Bookings</h3>
            <span className="text-xs text-gray-400">Latest Customer Orders</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-gray-50 text-gray-500 uppercase text-[11px] font-bold">
                <tr>
                  <th className="py-3 px-4 rounded-l-xl">#</th>
                  <th className="py-3 px-4">Customer</th>
                  <th className="py-3 px-4">Package</th>
                  <th className="py-3 px-4">Amount</th>
                  <th className="py-3 px-4 rounded-r-xl">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {(stats.recentBookings || []).map((b, idx) => (
                  <tr key={b.id} className="hover:bg-gray-50/60 transition">
                    <td className="py-3.5 px-4 font-mono font-bold text-gray-500">{idx + 1}</td>
                    <td className="py-3.5 px-4 font-semibold text-gray-900">{b.contactName}</td>
                    <td className="py-3.5 px-4 text-gray-600">{b.packageName}</td>
                    <td className="py-3.5 px-4 font-bold text-gray-900">{formatCurrency(b.totalAmount)}</td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        b.status === 'CONFIRMED'
                          ? 'bg-emerald-100 text-emerald-800'
                          : b.status === 'PENDING'
                          ? 'bg-amber-100 text-amber-800'
                          : b.status === 'CANCELLED'
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {b.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Popular Destinations List */}
        <div className="lg:col-span-4 bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            <h3 className="text-base font-bold text-gray-900">Popular Destinations</h3>
            <span className="text-xs text-gray-400">Bookings</span>
          </div>

          <div className="space-y-3">
            {(stats.popularDestinations || []).map((d, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-gray-50 border border-gray-100">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs">
                    {idx + 1}
                  </div>
                  <span className="font-semibold text-sm text-gray-800">{d.name}</span>
                </div>
                <span className="text-xs font-bold bg-white px-2.5 py-1 rounded-lg border border-gray-200 text-gray-700">
                  {d.bookings || 0}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};

export default AdminDashboard;
