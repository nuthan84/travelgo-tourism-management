import React, { useState, useEffect } from 'react';
import adminService from '../services/adminService';
import Loader from '../components/Loader';
import { formatCurrency, formatDate } from '../utils/formatCurrency';
import { Search, Calendar, Check, AlertCircle } from 'lucide-react';

export const ManageBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const data = await adminService.getAllBookings();
      setBookings(data || []);
    } catch (err) {
      console.error("Error fetching bookings:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (bookingId, newStatus) => {
    try {
      await adminService.updateBookingStatus(bookingId, newStatus);
      fetchBookings();
    } catch (err) {
      alert("Failed to update booking status: " + err.message);
    }
  };

  const filteredBookings = bookings.filter(b => {
    const matchesSearch = b.bookingReference.toLowerCase().includes(search.toLowerCase()) ||
                          b.contactName.toLowerCase().includes(search.toLowerCase()) ||
                          b.packageName.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || b.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (loading) return <Loader message="Loading customer bookings..." />;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-4 border-b border-gray-200 gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Manage Bookings</h2>
          <p className="text-xs text-gray-500">Monitor, confirm, and update customer tour reservations</p>
        </div>

        <div className="flex items-center space-x-3">
          <div className="relative w-48 sm:w-64">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search reference, guest..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-3 py-2 bg-white border border-gray-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-blue-500 shadow-sm"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs font-semibold text-gray-700 shadow-sm"
          >
            <option value="ALL">All Statuses</option>
            <option value="PENDING">PENDING</option>
            <option value="CONFIRMED">CONFIRMED</option>
            <option value="COMPLETED">COMPLETED</option>
            <option value="CANCELLED">CANCELLED</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-gray-50 text-gray-500 uppercase text-[11px] font-bold border-b border-gray-200">
              <tr>
                <th className="py-3.5 px-4">Reference</th>
                <th className="py-3.5 px-4">Customer</th>
                <th className="py-3.5 px-4">Package</th>
                <th className="py-3.5 px-4">Travel Date</th>
                <th className="py-3.5 px-4">Total</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-center">Update Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredBookings.map((b) => (
                <tr key={b.id} className="hover:bg-gray-50/60 transition">
                  <td className="py-3.5 px-4 font-mono font-bold text-blue-600">
                    {b.bookingReference}
                  </td>
                  <td className="py-3.5 px-4">
                    <p className="font-semibold text-gray-900">{b.contactName}</p>
                    <p className="text-[11px] text-gray-400">{b.contactEmail} • {b.contactPhone}</p>
                  </td>
                  <td className="py-3.5 px-4 font-medium text-gray-800">{b.packageName}</td>
                  <td className="py-3.5 px-4 text-gray-600">{formatDate(b.travelDate)}</td>
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
                  <td className="py-3.5 px-4 text-center">
                    <select
                      value={b.status}
                      onChange={(e) => handleStatusChange(b.id, e.target.value)}
                      className="px-2.5 py-1 text-xs border border-gray-200 rounded-lg bg-gray-50 font-semibold cursor-pointer focus:outline-none focus:border-blue-500"
                    >
                      <option value="PENDING">PENDING</option>
                      <option value="CONFIRMED">CONFIRMED</option>
                      <option value="COMPLETED">COMPLETED</option>
                      <option value="CANCELLED">CANCELLED</option>
                    </select>
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

export default ManageBookings;
