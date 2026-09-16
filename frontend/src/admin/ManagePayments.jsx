import React, { useState, useEffect } from 'react';
import adminService from '../services/adminService';
import Loader from '../components/Loader';
import { formatCurrency, formatDate } from '../utils/formatCurrency';
import { CreditCard, Search, CheckCircle2, XCircle, Clock } from 'lucide-react';

export const ManagePayments = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    setLoading(true);
    try {
      const data = await adminService.getAllPayments();
      setPayments(data || []);
    } catch (err) {
      console.error("Error fetching payments:", err);
    } finally {
      setLoading(false);
    }
  };

  const filteredPayments = payments.filter(p =>
    (p.bookingReference && p.bookingReference.toLowerCase().includes(search.toLowerCase())) ||
    (p.razorpayOrderId && p.razorpayOrderId.toLowerCase().includes(search.toLowerCase())) ||
    (p.razorpayPaymentId && p.razorpayPaymentId.toLowerCase().includes(search.toLowerCase()))
  );

  if (loading) return <Loader message="Loading payment records..." />;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-4 border-b border-gray-200 gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Payment Audit Log</h2>
          <p className="text-xs text-gray-500">Transaction history verified via Razorpay gateway</p>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search order or payment ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-3 py-2 bg-white border border-gray-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-blue-500 shadow-sm"
          />
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-gray-50 text-gray-500 uppercase text-[11px] font-bold border-b border-gray-200">
              <tr>
                <th className="py-3.5 px-4">Booking Ref</th>
                <th className="py-3.5 px-4">Razorpay Order ID</th>
                <th className="py-3.5 px-4">Payment ID</th>
                <th className="py-3.5 px-4">Amount</th>
                <th className="py-3.5 px-4">Method</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Paid At</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredPayments.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50/60 transition">
                  <td className="py-3.5 px-4 font-mono font-bold text-blue-600">
                    {p.bookingReference || `Booking #${p.bookingId}`}
                  </td>
                  <td className="py-3.5 px-4 font-mono text-xs text-gray-600">
                    {p.razorpayOrderId || '—'}
                  </td>
                  <td className="py-3.5 px-4 font-mono text-xs text-gray-600">
                    {p.razorpayPaymentId || '—'}
                  </td>
                  <td className="py-3.5 px-4 font-extrabold text-gray-900">
                    {formatCurrency(p.amount)}
                  </td>
                  <td className="py-3.5 px-4 text-gray-600">
                    {p.paymentMethod || 'Online'}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                      p.status === 'SUCCESS'
                        ? 'bg-emerald-100 text-emerald-800'
                        : p.status === 'CREATED'
                        ? 'bg-blue-100 text-blue-800'
                        : p.status === 'REFUNDED'
                        ? 'bg-purple-100 text-purple-800'
                        : 'bg-rose-100 text-rose-800'
                    }`}>
                      {p.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-gray-500">
                    {p.paidAt ? formatDate(p.paidAt) : formatDate(p.createdAt)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ManagePayments;
