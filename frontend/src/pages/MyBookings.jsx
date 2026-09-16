import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import bookingService from '../services/bookingService';
import Loader from '../components/Loader';
import { formatCurrency, formatDate } from '../utils/formatCurrency';
import { Calendar, Clock, MapPin, AlertCircle, CheckCircle2, XCircle } from 'lucide-react';

export const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const data = await bookingService.getMyBookings();
      setBookings(data || []);
    } catch (err) {
      console.error("Error fetching bookings:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (id) => {
    if (!window.confirm("Are you sure you want to cancel this booking?")) return;
    try {
      await bookingService.cancel(id);
      fetchBookings();
    } catch (err) {
      alert("Failed to cancel booking: " + err.message);
    }
  };

  const filteredBookings = filter === 'ALL'
    ? bookings
    : bookings.filter(b => b.status === filter);

  if (loading) return <Loader message="Loading your bookings..." />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-gray-100">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
            My Bookings
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Manage your past, upcoming, and pending travel reservations
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex space-x-2 overflow-x-auto pb-2 sm:pb-0">
          {['ALL', 'CONFIRMED', 'PENDING', 'COMPLETED', 'CANCELLED'].map((st) => (
            <button
              key={st}
              onClick={() => setFilter(st)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                filter === st
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {filteredBookings.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center shadow-sm">
          <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-gray-800">No bookings found</h3>
          <p className="text-xs text-gray-500 mt-1">
            {filter === 'ALL'
              ? "You haven't booked any holiday packages yet."
              : `No bookings with status "${filter}".`}
          </p>
          <Link
            to="/packages"
            className="mt-5 inline-block px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl shadow"
          >
            Explore Holiday Packages
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredBookings.map((b) => (
            <div
              key={b.id}
              className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6 hover:shadow-md transition"
            >
              <div className="flex space-x-4 items-center">
                <img
                  src={b.packageImage || 'https://images.unsplash.com/photo-1566837945700-30057527ade0?auto=format&fit=crop&w=300&q=80'}
                  alt={b.packageName}
                  className="w-24 h-20 rounded-xl object-cover shrink-0"
                />
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                      #{b.bookingReference}
                    </span>
                    <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${
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
                  </div>
                  <h3 className="text-base font-bold text-gray-900">{b.packageName}</h3>
                  <div className="flex flex-wrap gap-x-4 text-xs text-gray-500">
                    <span>Travel Date: <strong>{formatDate(b.travelDate)}</strong></span>
                    <span>Travellers: <strong>{b.travellers}</strong></span>
                  </div>
                </div>
              </div>

              <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-center border-t md:border-t-0 pt-4 md:pt-0 border-gray-100 gap-2">
                <div className="text-right">
                  <span className="text-xs text-gray-400">Total Paid</span>
                  <div className="text-lg font-extrabold text-gray-900">{formatCurrency(b.totalAmount)}</div>
                </div>

                <div className="flex items-center space-x-2">
                  <Link
                    to={`/confirmation/${b.id}`}
                    className="px-3.5 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold rounded-xl transition"
                  >
                    Details
                  </Link>
                  {b.status === 'PENDING' && (
                    <Link
                      to={`/payment/${b.id}`}
                      className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow transition"
                    >
                      Pay Now
                    </Link>
                  )}
                  {b.status !== 'CANCELLED' && b.status !== 'COMPLETED' && (
                    <button
                      onClick={() => handleCancel(b.id)}
                      className="px-3 py-1.5 text-xs font-medium text-rose-600 hover:bg-rose-50 rounded-xl transition"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </div>

            </div>
          ))}
        </div>
      )}

    </div>
  );
};

export default MyBookings;
