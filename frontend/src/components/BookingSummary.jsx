import React from 'react';
import { formatCurrency } from '../utils/formatCurrency';
import { ShieldCheck } from 'lucide-react';

export const BookingSummary = ({
  packageData,
  travellers = 1,
  onProceed,
  loading = false,
  buttonText = 'Proceed to Payment'
}) => {
  if (!packageData) return null;

  const pricePerPerson = Number(packageData.pricePerPerson) || 0;
  const travellerCount = Math.max(1, Number(travellers) || 1);
  const subtotal = pricePerPerson * travellerCount;
  const tax = Math.round(subtotal * 0.05);
  const total = subtotal + tax;

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 sticky top-28 space-y-6">
      <h3 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-4">
        Booking Summary
      </h3>

      {/* Package Header with Image */}
      <div className="flex items-center space-x-4">
        <img
          src={packageData.mainImageUrl || 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=300&q=80'}
          alt={packageData.name}
          className="w-20 h-16 object-cover rounded-xl border border-gray-100"
        />
        <div>
          <h4 className="font-bold text-gray-900 text-sm line-clamp-1">{packageData.name}</h4>
          <p className="text-xs text-gray-500 mt-0.5">
            {packageData.durationDays} Days | {packageData.durationNights} Nights
          </p>
        </div>
      </div>

      {/* Cost Breakdown */}
      <div className="space-y-3 text-sm border-t border-b border-gray-100 py-4">
        <div className="flex justify-between text-gray-600">
          <span>Price per person</span>
          <span className="font-semibold text-gray-900">{formatCurrency(pricePerPerson)}</span>
        </div>
        <div className="flex justify-between text-gray-600">
          <span>Travellers</span>
          <span className="font-semibold text-gray-900">{travellerCount}</span>
        </div>
        <div className="flex justify-between text-gray-600">
          <span>Subtotal</span>
          <span className="font-semibold text-gray-900">{formatCurrency(subtotal)}</span>
        </div>
        <div className="flex justify-between text-gray-600">
          <span>Tax (5% GST)</span>
          <span className="font-semibold text-gray-900">{formatCurrency(tax)}</span>
        </div>
      </div>

      {/* Total Amount */}
      <div className="flex justify-between items-baseline">
        <span className="text-base font-bold text-gray-900">Total Amount</span>
        <span className="text-2xl font-extrabold text-blue-700">{formatCurrency(total)}</span>
      </div>

      {/* Razorpay Badge */}
      <div className="flex items-center justify-center space-x-2 py-2 px-3 bg-blue-50/60 rounded-xl border border-blue-100 text-blue-900 text-xs font-medium">
        <ShieldCheck className="w-4 h-4 text-teal-600 shrink-0" />
        <span>Secure Payment with <strong>Razorpay</strong></span>
      </div>

      {/* Action Button */}
      {onProceed && (
        <button
          type="button"
          onClick={onProceed}
          disabled={loading}
          className="w-full py-3.5 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold rounded-xl shadow-md hover:shadow-lg transition text-sm flex items-center justify-center space-x-2"
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <span>{buttonText}</span>
          )}
        </button>
      )}
    </div>
  );
};

export default BookingSummary;
