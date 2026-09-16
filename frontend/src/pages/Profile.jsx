import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { User, Mail, Phone, ShieldCheck, Calendar } from 'lucide-react';
import { formatDate } from '../utils/formatCurrency';

export const Profile = () => {
  const { user } = useAuth();

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      <div className="pb-6 border-b border-gray-100">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
          User Profile
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 mt-1">
          Your personal account credentials and travel preferences
        </p>
      </div>

      <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-100 space-y-6">
        <div className="flex items-center space-x-4 pb-6 border-b border-gray-100">
          <div className="w-16 h-16 rounded-full bg-blue-100 text-blue-700 font-bold text-2xl flex items-center justify-center">
            {user?.fullName?.charAt(0).toUpperCase()}
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">{user?.fullName}</h2>
            <span className="inline-block mt-1 px-3 py-0.5 text-xs font-bold bg-blue-50 text-blue-700 rounded-full border border-blue-100">
              {user?.role}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 flex items-start space-x-3">
            <Mail className="w-5 h-5 text-gray-400 mt-0.5" />
            <div>
              <span className="text-xs text-gray-500 font-medium">Email Address</span>
              <p className="text-sm font-bold text-gray-900 mt-0.5">{user?.email}</p>
            </div>
          </div>

          <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 flex items-start space-x-3">
            <Phone className="w-5 h-5 text-gray-400 mt-0.5" />
            <div>
              <span className="text-xs text-gray-500 font-medium">Phone Number</span>
              <p className="text-sm font-bold text-gray-900 mt-0.5">{user?.phone || 'Not provided'}</p>
            </div>
          </div>

          <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 flex items-start space-x-3">
            <ShieldCheck className="w-5 h-5 text-emerald-500 mt-0.5" />
            <div>
              <span className="text-xs text-gray-500 font-medium">Account Status</span>
              <p className="text-sm font-bold text-emerald-700 mt-0.5">{user?.status || 'ACTIVE'}</p>
            </div>
          </div>

          <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 flex items-start space-x-3">
            <Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
            <div>
              <span className="text-xs text-gray-500 font-medium">Member Since</span>
              <p className="text-sm font-bold text-gray-900 mt-0.5">{user?.createdAt ? formatDate(user.createdAt) : 'Recently'}</p>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};

export default Profile;
