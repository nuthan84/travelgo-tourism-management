import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import bookingService from '../services/bookingService';
import Loader from '../components/Loader';
import { formatCurrency, formatDate } from '../utils/formatCurrency';
import { CheckCircle2, Copy, Check, Calendar, ArrowRight, Home } from 'lucide-react';

export const Confirmation = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();

  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const data = await bookingService.getById(bookingId);
        setBooking(data);
      } catch (err) {
        console.error("Error fetching confirmation booking:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBooking();
  }, [bookingId]);

  const handleCopyReference = () => {
    if (booking?.bookingReference) {
      navigator.clipboard.writeText(booking.bookingReference);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  if (loading) return <Loader message="Loading confirmation details..." />;
  if (!booking) {
    return (
      <div className="max-w-md mx-auto my-16 p-8 bg-white rounded-2xl text-center shadow-sm border border-gray-100">
        <p className="text-gray-600">Booking information not found.</p>
        <Link to="/" className="mt-4 inline-block text-blue-600 font-semibold text-sm">
          Return to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-sm border border-gray-100 text-center relative overflow-hidden">
        
        {/* Animated Green Checkmark matching UI Reference */}
        <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner animate-scale-up">
          <CheckCircle2 className="w-12 h-12" />
        </div>

        {/* Heading */}
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
          Booking Confirmed!
        </h1>
        <p className="text-sm text-gray-500 mt-2">
          Thank you for choosing TravelGo. Your holiday booking has been successfully confirmed.
        </p>

        {/* Booking Reference Card matching screenshot */}
        <div className="mt-8 p-4 bg-teal-50/60 border border-teal-200 rounded-2xl max-w-md mx-auto flex items-center justify-between">
          <div className="text-left">
            <span className="text-[11px] font-bold uppercase tracking-wider text-teal-800">Booking Reference</span>
            <p className="text-lg sm:text-xl font-extrabold text-teal-950 font-mono tracking-wide mt-0.5">
              {booking.bookingReference}
            </p>
          </div>
          <button
            onClick={handleCopyReference}
            className="p-2 bg-white rounded-xl border border-teal-200 text-teal-700 hover:bg-teal-100 transition shadow-sm"
            title="Copy Reference"
          >
            {copied ? <Check className="w-5 h-5 text-emerald-600" /> : <Copy className="w-5 h-5" />}
          </button>
        </div>

        {/* Key Booking Details Table */}
        <div className="mt-8 bg-gray-50/80 rounded-2xl p-6 border border-gray-100 text-left space-y-3.5 text-xs sm:text-sm">
          <div className="flex justify-between py-1 border-b border-gray-200/60">
            <span className="text-gray-500 font-medium">Package</span>
            <span className="font-bold text-gray-900">{booking.packageName}</span>
          </div>

          <div className="flex justify-between py-1 border-b border-gray-200/60">
            <span className="text-gray-500 font-medium">Travel Date</span>
            <span className="font-semibold text-gray-900">{formatDate(booking.travelDate)}</span>
          </div>

          <div className="flex justify-between py-1 border-b border-gray-200/60">
            <span className="text-gray-500 font-medium">Travellers</span>
            <span className="font-semibold text-gray-900">{booking.travellers}</span>
          </div>

          <div className="flex justify-between py-1 border-b border-gray-200/60">
            <span className="text-gray-500 font-medium">Total Amount</span>
            <span className="font-extrabold text-gray-900 text-base">{formatCurrency(booking.totalAmount)}</span>
          </div>

          <div className="flex justify-between py-1 border-b border-gray-200/60 items-center">
            <span className="text-gray-500 font-medium">Payment Status</span>
            <span className="px-3 py-1 bg-emerald-100 text-emerald-800 font-bold rounded-full text-xs">
              {booking.paymentStatus || 'Success'}
            </span>
          </div>

          <div className="flex justify-between py-1 items-center">
            <span className="text-gray-500 font-medium">Booking Status</span>
            <span className="px-3 py-1 bg-emerald-100 text-emerald-800 font-bold rounded-full text-xs">
              {booking.status}
            </span>
          </div>
        </div>

        {/* Actions Buttons matching UI Reference */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/my-bookings"
            className="w-full sm:w-auto px-6 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md hover:shadow-lg transition text-sm flex items-center justify-center"
          >
            <span>View My Bookings</span>
            <ArrowRight className="w-4 h-4 ml-2" />
          </Link>

          <Link
            to="/packages"
            className="w-full sm:w-auto px-6 py-3.5 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-semibold rounded-xl transition text-sm"
          >
            Continue Exploring
          </Link>
        </div>

      </div>
    </div>
  );
};

export default Confirmation;
