import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import packageService from '../services/packageService';
import reviewService from '../services/reviewService';
import wishlistService from '../services/wishlistService';
import { useAuth } from '../hooks/useAuth';
import Loader from '../components/Loader';
import Rating from '../components/Rating';
import Modal from '../components/Modal';
import { formatCurrency } from '../utils/formatCurrency';
import {
  Clock, Users, Utensils, MapPin, Car, Heart, ShieldCheck,
  ChevronLeft, ChevronRight, CheckCircle2, XCircle, Info, Calendar
} from 'lucide-react';

export const PackageDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();

  const [pkg, setPkg] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);

  // Review Modal state
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    const fetchPackageDetails = async () => {
      setLoading(true);
      try {
        const [pkgData, revData] = await Promise.all([
          packageService.getById(id),
          reviewService.getByPackageId(id)
        ]);
        setPkg(pkgData);
        setReviews(revData || []);

        if (isAuthenticated) {
          const wl = await wishlistService.getWishlist();
          if (wl && wl.some(item => item.packageId === Number(id))) {
            setIsWishlisted(true);
          }
        }
      } catch (err) {
        console.error("Error fetching package details:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPackageDetails();
  }, [id, isAuthenticated]);

  if (loading) return <Loader message="Loading package details..." />;
  if (!pkg) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <h2 className="text-xl font-bold text-gray-800">Package not found</h2>
        <Link to="/packages" className="mt-4 inline-block text-blue-600 font-semibold">
          Back to all packages
        </Link>
      </div>
    );
  }

  // Aggregate images list
  const allImages = [
    pkg.mainImageUrl,
    ...(pkg.images && pkg.images.length > 0 ? pkg.images : [])
  ].filter(Boolean);

  const handlePrevImage = () => {
    setSelectedImageIndex((prev) => (prev === 0 ? allImages.length - 1 : prev - 1));
  };

  const handleNextImage = () => {
    setSelectedImageIndex((prev) => (prev === allImages.length - 1 ? 0 : prev + 1));
  };

  const handleWishlistToggle = async () => {
    if (!isAuthenticated) {
      alert("Please login to save to wishlist.");
      return;
    }
    try {
      if (isWishlisted) {
        await wishlistService.remove(pkg.id);
        setIsWishlisted(false);
      } else {
        await wishlistService.add(pkg.id);
        setIsWishlisted(true);
      }
    } catch (err) {
      console.error("Wishlist toggle error:", err);
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      alert("Please login to submit a review.");
      return;
    }
    try {
      setSubmittingReview(true);
      await reviewService.create({
        packageId: pkg.id,
        rating: newRating,
        comment: newComment
      });
      setReviewModalOpen(false);
      setNewComment('');
      alert("Review submitted! Thank you for your feedback.");
      // Refresh reviews
      const updatedRevs = await reviewService.getByPackageId(pkg.id);
      setReviews(updatedRevs || []);
    } catch (err) {
      alert("Failed to submit review: " + err.message);
    } finally {
      setSubmittingReview(false);
    }
  };

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'itinerary', label: 'Itinerary' },
    { id: 'inclusions', label: 'Inclusions' },
    { id: 'exclusions', label: 'Exclusions' },
    { id: 'cancellation', label: 'Cancellation' },
    { id: 'reviews', label: `Reviews (${reviews.length})` },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      
      {/* Breadcrumb Navigation */}
      <nav className="flex text-xs text-gray-500 space-x-2">
        <Link to="/" className="hover:text-blue-600">Home</Link>
        <span>&gt;</span>
        <Link to="/packages" className="hover:text-blue-600">Packages</Link>
        <span>&gt;</span>
        <span className="text-gray-800 font-medium">{pkg.name}</span>
      </nav>

      {/* Image Gallery matching UI Reference */}
      <div className="relative rounded-2xl overflow-hidden bg-gray-900 shadow-md">
        {/* Main Display Image */}
        <div className="relative h-80 sm:h-[420px] w-full overflow-hidden">
          <img
            src={allImages[selectedImageIndex] || pkg.mainImageUrl}
            alt={pkg.name}
            className="w-full h-full object-cover object-center transition duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>

          {/* Navigation Arrows */}
          {allImages.length > 1 && (
            <>
              <button
                onClick={handlePrevImage}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 hover:bg-white text-gray-800 flex items-center justify-center shadow-lg transition backdrop-blur-sm"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={handleNextImage}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 hover:bg-white text-gray-800 flex items-center justify-center shadow-lg transition backdrop-blur-sm"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </>
          )}

          {/* Image Counter Badge */}
          <div className="absolute bottom-4 right-4 px-3 py-1 bg-black/60 backdrop-blur-md rounded-full text-white text-xs font-medium">
            {selectedImageIndex + 1} / {allImages.length}
          </div>
        </div>

        {/* Thumbnails Row */}
        {allImages.length > 1 && (
          <div className="bg-white p-3 flex space-x-3 overflow-x-auto border-t border-gray-100">
            {allImages.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedImageIndex(idx)}
                className={`relative w-20 h-14 rounded-xl overflow-hidden shrink-0 border-2 transition ${
                  selectedImageIndex === idx ? 'border-blue-600 ring-2 ring-blue-600/30' : 'border-transparent opacity-70 hover:opacity-100'
                }`}
              >
                <img src={img} alt="Thumbnail" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Main Header & Quick Stats */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center space-x-3 mb-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
              {pkg.name}
            </h1>
            <button
              onClick={handleWishlistToggle}
              className={`p-2 rounded-full border transition ${
                isWishlisted
                  ? 'bg-rose-50 border-rose-200 text-rose-500'
                  : 'bg-gray-50 border-gray-200 text-gray-400 hover:text-rose-500'
              }`}
            >
              <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
            </button>
          </div>

          <div className="flex items-center text-xs sm:text-sm text-gray-600 space-x-3">
            <Rating value={pkg.rating} reviewCount={reviews.length} />
            <span>•</span>
            <span className="flex items-center font-medium">
              <MapPin className="w-4 h-4 mr-1 text-teal-600" />
              {pkg.destinationName}, {pkg.destinationCountry || 'India'}
            </span>
          </div>

          <p className="mt-3 text-xs sm:text-sm text-gray-600 leading-relaxed max-w-3xl">
            {pkg.description}
          </p>

          {/* Highlights Pills matching UI Reference */}
          <div className="mt-6 flex flex-wrap gap-3">
            <div className="flex items-center space-x-2 px-3.5 py-2 bg-gray-50 rounded-xl border border-gray-200/80 text-xs font-medium text-gray-700">
              <Clock className="w-4 h-4 text-blue-600" />
              <span>{pkg.durationDays} Days {pkg.durationNights} Nights</span>
            </div>
            <div className="flex items-center space-x-2 px-3.5 py-2 bg-gray-50 rounded-xl border border-gray-200/80 text-xs font-medium text-gray-700">
              <Users className="w-4 h-4 text-blue-600" />
              <span>Max {pkg.maxTravellers} People</span>
            </div>
            <div className="flex items-center space-x-2 px-3.5 py-2 bg-gray-50 rounded-xl border border-gray-200/80 text-xs font-medium text-gray-700">
              <Utensils className="w-4 h-4 text-blue-600" />
              <span>Hotel + Breakfast</span>
            </div>
            <div className="flex items-center space-x-2 px-3.5 py-2 bg-gray-50 rounded-xl border border-gray-200/80 text-xs font-medium text-gray-700">
              <MapPin className="w-4 h-4 text-blue-600" />
              <span>Sightseeing</span>
            </div>
            <div className="flex items-center space-x-2 px-3.5 py-2 bg-gray-50 rounded-xl border border-gray-200/80 text-xs font-medium text-gray-700">
              <Car className="w-4 h-4 text-blue-600" />
              <span>Private Transport</span>
            </div>
          </div>
        </div>

        {/* Pricing Card & Book Now CTA */}
        <div className="shrink-0 bg-blue-50/60 p-6 rounded-2xl border border-blue-100 flex flex-col justify-between items-center text-center sm:min-w-[220px]">
          <div>
            <span className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Starting From</span>
            <div className="text-3xl font-extrabold text-blue-900 mt-1">
              {formatCurrency(pkg.pricePerPerson)}
            </div>
            <span className="text-xs text-gray-500">per person + taxes</span>
          </div>

          <Link
            to={`/booking/${pkg.id}`}
            className="mt-5 w-full py-3 px-6 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md hover:shadow-lg transition text-sm text-center"
          >
            Book Now
          </Link>
        </div>
      </div>

      {/* Tabs Navigation matching UI reference */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="flex border-b border-gray-100 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-4 text-xs sm:text-sm font-bold whitespace-nowrap border-b-2 transition ${
                activeTab === tab.id
                  ? 'border-blue-600 text-blue-600 bg-blue-50/20'
                  : 'border-transparent text-gray-500 hover:text-gray-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content Panels */}
        <div className="p-6 sm:p-8">
          
          {/* Overview */}
          {activeTab === 'overview' && (
            <div className="space-y-4 max-w-3xl">
              <h3 className="text-lg font-bold text-gray-900">About this Package</h3>
              <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                {pkg.description}
              </p>
              <div className="pt-4 border-t border-gray-100 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-gray-600">
                <div>
                  <span className="font-bold text-gray-800">Category:</span> {pkg.category}
                </div>
                <div>
                  <span className="font-bold text-gray-800">Destination:</span> {pkg.destinationName}, {pkg.destinationState}
                </div>
                <div>
                  <span className="font-bold text-gray-800">Duration:</span> {pkg.durationDays} Days / {pkg.durationNights} Nights
                </div>
                <div>
                  <span className="font-bold text-gray-800">Group Capacity:</span> Up to {pkg.maxTravellers} Guests
                </div>
              </div>
            </div>
          )}

          {/* Itinerary */}
          {activeTab === 'itinerary' && (
            <div className="space-y-4 max-w-3xl">
              <h3 className="text-lg font-bold text-gray-900">Day-by-Day Tour Itinerary</h3>
              <div className="space-y-4 text-sm text-gray-700">
                {pkg.itinerary ? (
                  pkg.itinerary.split('\n').map((line, idx) => (
                    <div key={idx} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-xl border border-gray-100">
                      <div className="w-2 h-2 rounded-full bg-blue-600 mt-2 shrink-0"></div>
                      <p className="leading-relaxed">{line}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500">Detailed itinerary will be provided upon booking confirmation.</p>
                )}
              </div>
            </div>
          )}

          {/* Inclusions */}
          {activeTab === 'inclusions' && (
            <div className="space-y-4 max-w-3xl">
              <h3 className="text-lg font-bold text-gray-900">Included Services</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                {pkg.includedServices ? (
                  pkg.includedServices.split(',').map((inc, idx) => (
                    <div key={idx} className="flex items-center space-x-2 text-gray-700">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>{inc.trim()}</span>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500">Standard inclusions apply.</p>
                )}
              </div>
            </div>
          )}

          {/* Exclusions */}
          {activeTab === 'exclusions' && (
            <div className="space-y-4 max-w-3xl">
              <h3 className="text-lg font-bold text-gray-900">Excluded Services</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                {pkg.excludedServices ? (
                  pkg.excludedServices.split(',').map((exc, idx) => (
                    <div key={idx} className="flex items-center space-x-2 text-gray-700">
                      <XCircle className="w-4 h-4 text-rose-500 shrink-0" />
                      <span>{exc.trim()}</span>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500">Personal expenses and flights are not included.</p>
                )}
              </div>
            </div>
          )}

          {/* Cancellation */}
          {activeTab === 'cancellation' && (
            <div className="space-y-4 max-w-3xl">
              <h3 className="text-lg font-bold text-gray-900">Cancellation & Refund Policy</h3>
              <div className="p-4 bg-amber-50/70 border border-amber-200 rounded-xl text-xs sm:text-sm text-amber-900 leading-relaxed">
                <Info className="w-4 h-4 inline mr-2 text-amber-700" />
                {pkg.cancellationPolicy || "Full refund if cancelled 7 days prior to departure. Non-refundable within 48 hours."}
              </div>
            </div>
          )}

          {/* Reviews */}
          {activeTab === 'reviews' && (
            <div className="space-y-6 max-w-3xl">
              <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Traveller Reviews</h3>
                  <p className="text-xs text-gray-500 mt-0.5">Average rating: {Number(pkg.rating).toFixed(1)} / 5</p>
                </div>
                <button
                  onClick={() => setReviewModalOpen(true)}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl shadow-sm transition"
                >
                  Write a Review
                </button>
              </div>

              {reviews.length === 0 ? (
                <p className="text-sm text-gray-500 py-6 text-center">
                  No reviews yet. Be the first to share your experience!
                </p>
              ) : (
                <div className="space-y-4">
                  {reviews.map((rev) => (
                    <div key={rev.id} className="p-4 bg-gray-50 rounded-xl border border-gray-100 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-sm text-gray-900">{rev.userName}</span>
                        <Rating value={rev.rating} />
                      </div>
                      <p className="text-xs sm:text-sm text-gray-700">{rev.comment}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

        </div>
      </div>

      {/* Review Submission Modal */}
      <Modal
        isOpen={reviewModalOpen}
        onClose={() => setReviewModalOpen(false)}
        title="Share Your Experience"
      >
        <form onSubmit={handleReviewSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Your Rating</label>
            <div className="flex items-center space-x-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  onClick={() => setNewRating(star)}
                  className="p-1 focus:outline-none"
                >
                  <Rating value={star <= newRating ? 1 : 0} showValue={false} size="w-6 h-6" />
                </button>
              ))}
              <span className="text-xs font-bold text-gray-700 ml-2">{newRating} of 5 Stars</span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Your Feedback / Comments</label>
            <textarea
              required
              rows={4}
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="What did you like the most about this holiday package?"
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-xl focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={() => setReviewModalOpen(false)}
              className="px-4 py-2 border border-gray-300 text-gray-700 text-xs font-semibold rounded-xl hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submittingReview}
              className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl shadow"
            >
              {submittingReview ? 'Submitting...' : 'Post Review'}
            </button>
          </div>
        </form>
      </Modal>

    </div>
  );
};

export default PackageDetails;
