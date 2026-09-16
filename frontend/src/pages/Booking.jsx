import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import packageService from '../services/packageService';
import bookingService from '../services/bookingService';
import { useAuth } from '../hooks/useAuth';
import BookingSummary from '../components/BookingSummary';
import Loader from '../components/Loader';
import { Calendar, Users, User, Mail, Phone, MessageSquare, ArrowLeft } from 'lucide-react';

export const Booking = () => {
  const { packageId } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const [pkg, setPkg] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Booking Form fields
  const [travelDate, setTravelDate] = useState('');
  const [travellers, setTravellers] = useState(2);
  const [contactName, setContactName] = useState(user?.fullName || '');
  const [contactEmail, setContactEmail] = useState(user?.email || '');
  const [contactPhone, setContactPhone] = useState(user?.phone || '');
  const [specialRequests, setSpecialRequests] = useState('');

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: `/booking/${packageId}` } });
      return;
    }

    const fetchPackage = async () => {
      try {
        const data = await packageService.getById(packageId);
        setPkg(data);
      } catch (err) {
        console.error("Error fetching package for booking:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPackage();
  }, [packageId, isAuthenticated, navigate]);

  // Update contact details when user loads
  useEffect(() => {
    if (user) {
      if (!contactName && user.fullName) setContactName(user.fullName);
      if (!contactEmail && user.email) setContactEmail(user.email);
      if (!contactPhone && user.phone) setContactPhone(user.phone);
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!travelDate) {
      setErrorMessage('Please select a travel date.');
      return;
    }

    try {
      setSubmitting(true);
      const bookingData = {
        packageId: Number(packageId),
        travelDate,
        travellers: Number(travellers),
        contactName,
        contactEmail,
        contactPhone,
        specialRequests
      };

      const booking = await bookingService.create(bookingData);
      navigate(`/payment/${booking.id}`);
    } catch (err) {
      setErrorMessage(err.message || 'Failed to create booking.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Loader message="Setting up your booking..." />;
  if (!pkg) return <div className="p-10 text-center">Package not found.</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Back Link */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center text-xs font-semibold text-gray-500 hover:text-blue-600 mb-6 transition"
      >
        <ArrowLeft className="w-4 h-4 mr-1.5" />
        Back to package details
      </button>

      {/* Main Two-Column Layout matching UI Reference */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Booking Form */}
        <div className="lg:col-span-8 bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold text-gray-900 border-b border-gray-100 pb-4 mb-6">
            Booking Details
          </h2>

          {errorMessage && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs font-semibold">
              {errorMessage}
            </div>
          )}

          <form id="booking-form" onSubmit={handleSubmit} className="space-y-6">
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Travel Date */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
                  Travel Date *
                </label>
                <div className="relative">
                  <Calendar className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="date"
                    required
                    value={travelDate}
                    min={new Date().toISOString().split('T')[0]}
                    onChange={(e) => setTravelDate(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-500 focus:bg-white transition"
                  />
                </div>
              </div>

              {/* Number of Travellers */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
                  No. of Travellers *
                </label>
                <div className="relative">
                  <Users className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <select
                    value={travellers}
                    onChange={(e) => setTravellers(Number(e.target.value))}
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-500 focus:bg-white transition cursor-pointer"
                  >
                    {[...Array(pkg.maxTravellers || 10)].map((_, i) => (
                      <option key={i + 1} value={i + 1}>
                        {i + 1} {i === 0 ? 'Traveller' : 'Travellers'}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Contact Name */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
                Contact Name *
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  placeholder="e.g. John Doe"
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-500 focus:bg-white transition"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Contact Email */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
                  Email Address *
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    placeholder="john@example.com"
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-500 focus:bg-white transition"
                  />
                </div>
              </div>

              {/* Contact Phone */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
                  Phone Number *
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    required
                    placeholder="9876543210"
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-500 focus:bg-white transition"
                  />
                </div>
              </div>
            </div>

            {/* Special Requests */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
                Special Requests <span className="text-gray-400 font-normal">(Optional)</span>
              </label>
              <div className="relative">
                <textarea
                  rows={3}
                  placeholder="Any dietary preferences, early check-in, or special accommodations?"
                  value={specialRequests}
                  onChange={(e) => setSpecialRequests(e.target.value)}
                  className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-500 focus:bg-white transition"
                />
              </div>
            </div>

          </form>
        </div>

        {/* Right Column: Booking Summary Card */}
        <div className="lg:col-span-4">
          <BookingSummary
            packageData={pkg}
            travellers={travellers}
            loading={submitting}
            buttonText="Proceed to Payment"
            onProceed={() => {
              const form = document.getElementById('booking-form');
              if (form) form.requestSubmit();
            }}
          />
        </div>

      </div>

    </div>
  );
};

export default Booking;
