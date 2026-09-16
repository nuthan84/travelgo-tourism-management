import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import UserLayout from '../layouts/UserLayout';
import AdminLayout from '../layouts/AdminLayout';

// Guards
import ProtectedRoute from './ProtectedRoute';
import AdminRoute from './AdminRoute';

// Public & User Pages
import Home from '../pages/Home';
import Destinations from '../pages/Destinations';
import Packages from '../pages/Packages';
import PackageDetails from '../pages/PackageDetails';
import Booking from '../pages/Booking';
import Payment from '../pages/Payment';
import Confirmation from '../pages/Confirmation';
import Login from '../pages/Login';
import Register from '../pages/Register';
import About from '../pages/About';
import Contact from '../pages/Contact';
import Profile from '../pages/Profile';
import MyBookings from '../pages/MyBookings';
import Wishlist from '../pages/Wishlist';
import UserDashboard from '../pages/UserDashboard';

// Admin Pages
import AdminDashboard from '../admin/AdminDashboard';
import ManageUsers from '../admin/ManageUsers';
import ManageDestinations from '../admin/ManageDestinations';
import ManagePackages from '../admin/ManagePackages';
import ManageBookings from '../admin/ManageBookings';
import ManagePayments from '../admin/ManagePayments';
import ManageReviews from '../admin/ManageReviews';

export const AppRoutes = () => {
  return (
    <Routes>
      {/* Public & Customer Routes with UserLayout */}
      <Route path="/" element={<UserLayout />}>
        <Route index element={<Home />} />
        <Route path="destinations" element={<Destinations />} />
        <Route path="packages" element={<Packages />} />
        <Route path="packages/:id" element={<PackageDetails />} />
        <Route path="about" element={<About />} />
        <Route path="contact" element={<Contact />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />

        {/* Authenticated Customer Routes */}
        <Route
          path="booking/:packageId"
          element={
            <ProtectedRoute>
              <Booking />
            </ProtectedRoute>
          }
        />
        <Route
          path="payment/:bookingId"
          element={
            <ProtectedRoute>
              <Payment />
            </ProtectedRoute>
          }
        />
        <Route
          path="confirmation/:bookingId"
          element={
            <ProtectedRoute>
              <Confirmation />
            </ProtectedRoute>
          }
        />
        <Route
          path="dashboard"
          element={
            <ProtectedRoute>
              <UserDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="my-bookings"
          element={
            <ProtectedRoute>
              <MyBookings />
            </ProtectedRoute>
          }
        />
        <Route
          path="wishlist"
          element={
            <ProtectedRoute>
              <Wishlist />
            </ProtectedRoute>
          }
        />
        <Route
          path="profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
      </Route>

      {/* Admin Portal Routes with AdminLayout */}
      <Route
        path="/admin"
        element={
          <AdminRoute>
            <AdminLayout />
          </AdminRoute>
        }
      >
        <Route index element={<AdminDashboard />} />
        <Route path="users" element={<ManageUsers />} />
        <Route path="destinations" element={<ManageDestinations />} />
        <Route path="packages" element={<ManagePackages />} />
        <Route path="bookings" element={<ManageBookings />} />
        <Route path="payments" element={<ManagePayments />} />
        <Route path="reviews" element={<ManageReviews />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
