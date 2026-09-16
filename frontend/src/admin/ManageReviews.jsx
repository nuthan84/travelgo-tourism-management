import React, { useState, useEffect } from 'react';
import reviewService from '../services/reviewService';
import Loader from '../components/Loader';
import Rating from '../components/Rating';
import { formatDate } from '../utils/formatCurrency';
import { Star, Check, EyeOff, Trash2, AlertCircle } from 'lucide-react';

export const ManageReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    fetchReviews();
  }, [statusFilter]);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const data = await reviewService.getAllForAdmin(statusFilter);
      setReviews(data || []);
    } catch (err) {
      console.error("Error loading reviews:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (reviewId, newStatus) => {
    try {
      await reviewService.updateStatus(reviewId, newStatus);
      fetchReviews();
    } catch (err) {
      alert("Failed to update status: " + err.message);
    }
  };

  const handleDelete = async (reviewId) => {
    if (!window.confirm("Are you sure you want to delete this review?")) return;
    try {
      await reviewService.delete(reviewId);
      fetchReviews();
    } catch (err) {
      alert("Failed to delete review: " + err.message);
    }
  };

  if (loading) return <Loader message="Loading reviews..." />;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-4 border-b border-gray-200 gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Review Moderation</h2>
          <p className="text-xs text-gray-500">Approve, hide, or manage customer tour reviews</p>
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs font-semibold text-gray-700 shadow-sm"
        >
          <option value="">All Review Statuses</option>
          <option value="PENDING">PENDING (Needs Approval)</option>
          <option value="APPROVED">APPROVED</option>
          <option value="HIDDEN">HIDDEN</option>
        </select>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-gray-50 text-gray-500 uppercase text-[11px] font-bold border-b border-gray-200">
              <tr>
                <th className="py-3.5 px-4">User</th>
                <th className="py-3.5 px-4">Package</th>
                <th className="py-3.5 px-4">Rating</th>
                <th className="py-3.5 px-4 max-w-xs">Comment</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-center">Moderation Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {reviews.map((r) => (
                <tr key={r.id} className="hover:bg-gray-50/60 transition">
                  <td className="py-3.5 px-4 font-semibold text-gray-900">{r.userName}</td>
                  <td className="py-3.5 px-4 text-gray-700">{r.packageName}</td>
                  <td className="py-3.5 px-4">
                    <Rating value={r.rating} />
                  </td>
                  <td className="py-3.5 px-4 text-gray-600 max-w-xs truncate">
                    {r.comment}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                      r.status === 'APPROVED'
                        ? 'bg-emerald-100 text-emerald-800'
                        : r.status === 'PENDING'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-gray-100 text-gray-700'
                    }`}>
                      {r.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="flex items-center justify-center space-x-2">
                      {r.status !== 'APPROVED' && (
                        <button
                          onClick={() => handleUpdateStatus(r.id, 'APPROVED')}
                          className="px-2 py-1 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded text-[11px] font-bold transition flex items-center"
                          title="Approve Review"
                        >
                          <Check className="w-3 h-3 mr-1" />
                          Approve
                        </button>
                      )}
                      {r.status !== 'HIDDEN' && (
                        <button
                          onClick={() => handleUpdateStatus(r.id, 'HIDDEN')}
                          className="px-2 py-1 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded text-[11px] font-bold transition flex items-center"
                          title="Hide Review"
                        >
                          <EyeOff className="w-3 h-3 mr-1" />
                          Hide
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(r.id)}
                        className="p-1 text-rose-600 hover:bg-rose-50 rounded transition"
                        title="Delete Review"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
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

export default ManageReviews;
