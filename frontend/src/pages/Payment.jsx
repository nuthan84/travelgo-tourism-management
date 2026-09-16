import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import bookingService from '../services/bookingService';
import paymentService from '../services/paymentService';
import Loader from '../components/Loader';
import { formatCurrency } from '../utils/formatCurrency';
import { ShieldCheck, Lock, CreditCard, CheckCircle2, AlertCircle } from 'lucide-react';

export const Payment = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();

  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const data = await bookingService.getById(bookingId);
        setBooking(data);
        if (data.status === 'CONFIRMED' || data.status === 'COMPLETED') {
          navigate(`/confirmation/${bookingId}`);
        }
      } catch (err) {
        setError(err.message || 'Unable to retrieve booking.');
      } finally {
        setLoading(false);
      }
    };

    fetchBooking();
  }, [bookingId, navigate]);

  const handlePayWithRazorpay = async () => {
    try {
      setProcessing(true);
      setError('');

      // Step 1: Create Order on backend
      const orderData = await paymentService.createOrder(bookingId);

      // Step 2: Launch Razorpay Checkout if window.Razorpay exists
      if (window.Razorpay && !orderData.orderId.startsWith('order_sim_')) {
        const options = {
          key: orderData.keyId,
          amount: Math.round(Number(orderData.amount) * 100),
          currency: orderData.currency || 'INR',
          name: 'TravelGo',
          description: `Booking #${orderData.bookingReference}`,
          image: 'https://images.unsplash.com/photo-1566837945700-30057527ade0?auto=format&fit=crop&w=120&q=80',
          order_id: orderData.orderId,
          handler: async (response) => {
            try {
              await paymentService.verifyPayment({
                bookingId: Number(bookingId),
                razorpayOrderId: response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature,
                paymentMethod: 'Razorpay'
              });
              navigate(`/confirmation/${bookingId}`);
            } catch (vErr) {
              setError("Payment verification failed: " + vErr.message);
              setProcessing(false);
            }
          },
          prefill: {
            name: booking.contactName,
            email: booking.contactEmail,
            contact: booking.contactPhone
          },
          theme: {
            color: '#2563eb'
          }
        };

        const rzp = new window.Razorpay(options);
        rzp.on('payment.failed', function (failRes) {
          setError(`Payment Failed: ${failRes.error?.description || 'Transaction declined'}`);
          setProcessing(false);
        });
        rzp.open();
      } else {
        // Test mode / simulated transaction fallback
        const simulatedPaymentId = 'pay_sim_' + Math.random().toString(36).substring(2, 12);
        const simulatedSig = 'sim_signature_' + Math.random().toString(36).substring(2, 12);

        await paymentService.verifyPayment({
          bookingId: Number(bookingId),
          razorpayOrderId: orderData.orderId,
          razorpayPaymentId: simulatedPaymentId,
          razorpaySignature: simulatedSig,
          paymentMethod: 'Razorpay UPI (Test Mode)'
        });

        navigate(`/confirmation/${bookingId}`);
      }
    } catch (err) {
      setError(err.message || 'Payment initiation failed.');
      setProcessing(false);
    }
  };

  if (loading) return <Loader message="Loading payment gateway..." />;
  if (error && !booking) {
    return (
      <div className="max-w-xl mx-auto my-16 p-8 bg-white rounded-2xl border border-red-200 text-center shadow-sm">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-3" />
        <h2 className="text-lg font-bold text-gray-900">Payment Error</h2>
        <p className="text-sm text-gray-600 mt-2">{error}</p>
        <button
          onClick={() => navigate('/dashboard')}
          className="mt-6 px-6 py-2.5 bg-blue-600 text-white font-semibold text-xs rounded-xl shadow hover:bg-blue-700"
        >
          Go to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        
        {/* Header */}
        <div className="bg-navy-900 text-white p-6 sm:p-8 flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-teal-400 uppercase tracking-wider">Final Step</span>
            <h1 className="text-2xl font-extrabold mt-1">Complete Your Payment</h1>
            <p className="text-xs text-gray-400 mt-1">Booking Reference: {booking.bookingReference}</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-teal-400 border border-white/10">
            <Lock className="w-6 h-6" />
          </div>
        </div>

        {/* Payment Summary */}
        <div className="p-6 sm:p-8 space-y-6">
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs font-semibold flex items-center">
              <AlertCircle className="w-4 h-4 mr-2 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100 space-y-4">
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Trip Details</h3>
            
            <div className="flex items-center space-x-4">
              <img
                src={booking.packageImage || 'https://images.unsplash.com/photo-1566837945700-30057527ade0?auto=format&fit=crop&w=300&q=80'}
                alt={booking.packageName}
                className="w-20 h-16 object-cover rounded-xl border border-gray-200"
              />
              <div>
                <h4 className="font-bold text-gray-900 text-base">{booking.packageName}</h4>
                <p className="text-xs text-gray-500 mt-0.5">
                  {booking.travellers} {booking.travellers === 1 ? 'Traveller' : 'Travellers'} • {booking.travelDate}
                </p>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-200 space-y-2 text-xs sm:text-sm text-gray-600">
              <div className="flex justify-between">
                <span>Contact Name</span>
                <span className="font-semibold text-gray-900">{booking.contactName}</span>
              </div>
              <div className="flex justify-between">
                <span>Contact Email</span>
                <span className="font-semibold text-gray-900">{booking.contactEmail}</span>
              </div>
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-semibold text-gray-900">{formatCurrency(booking.subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>GST (5%)</span>
                <span className="font-semibold text-gray-900">{formatCurrency(booking.taxAmount)}</span>
              </div>
              <div className="flex justify-between pt-3 border-t border-gray-200 text-base font-bold text-gray-900">
                <span>Payable Amount</span>
                <span className="text-2xl font-extrabold text-blue-700">{formatCurrency(booking.totalAmount)}</span>
              </div>
            </div>
          </div>

          {/* Secure Payment Guarantee */}
          <div className="flex items-center space-x-3 p-4 bg-emerald-50/70 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-medium">
            <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>256-Bit SSL Encrypted Payment. Your card or UPI details are never stored on our servers.</span>
          </div>

          {/* Razorpay Trigger Button */}
          <button
            onClick={handlePayWithRazorpay}
            disabled={processing}
            className="w-full py-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition text-base flex items-center justify-center space-x-2"
          >
            {processing ? (
              <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <>
                <CreditCard className="w-5 h-5 mr-2" />
                <span>Pay {formatCurrency(booking.totalAmount)} via Razorpay</span>
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
};

export default Payment;
