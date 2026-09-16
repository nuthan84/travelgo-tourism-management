import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import {
  Compass, LayoutDashboard, Users, MapPin, Package,
  CalendarCheck, CreditCard, Star, Settings, LogOut, Menu, X, ArrowLeft
} from 'lucide-react';

export const AdminLayout = () => {
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
    { to: '/admin/users', label: 'Users', icon: Users },
    { to: '/admin/destinations', label: 'Destinations', icon: MapPin },
    { to: '/admin/packages', label: 'Packages', icon: Package },
    { to: '/admin/bookings', label: 'Bookings', icon: CalendarCheck },
    { to: '/admin/payments', label: 'Payments', icon: CreditCard },
    { to: '/admin/reviews', label: 'Reviews', icon: Star },
  ];

  return (
    <div className="min-h-screen bg-[#f1f5f9] flex">
      {/* Mobile backdrop */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-black/60 md:hidden"
        />
      )}

      {/* Admin Sidebar */}
      <aside
        className={`fixed md:sticky top-0 z-50 h-screen w-64 bg-[#0b162c] text-slate-300 flex flex-col transition-transform duration-200 ease-in-out ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Sidebar Brand */}
        <div className="h-20 flex items-center justify-between px-6 border-b border-slate-800">
          <Link to="/admin" className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-full bg-teal-500/20 flex items-center justify-center border border-teal-400 text-teal-400">
              <Compass className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold tracking-tight text-white leading-none">
                Travel<span className="text-teal-400">Go</span>
              </span>
              <span className="text-[10px] text-slate-400 font-semibold tracking-wider mt-1 uppercase">Admin Portal</span>
            </div>
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="md:hidden text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                onClick={() => setSidebarOpen(false)}
                className={({ isActive }) =>
                  `flex items-center px-4 py-3 text-sm font-medium rounded-xl transition ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-900/30 font-semibold'
                      : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
                  }`
                }
              >
                <Icon className="w-5 h-5 mr-3 shrink-0" />
                {item.label}
              </NavLink>
            );
          })}
        </nav>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-800 space-y-2">
          <Link
            to="/"
            className="flex items-center w-full px-4 py-2.5 text-xs text-slate-400 hover:text-white hover:bg-slate-800/40 rounded-lg transition"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Public Website
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center w-full px-4 py-2.5 text-xs font-medium text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Admin Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="h-20 bg-white border-b border-gray-200 px-6 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100"
            >
              <Menu className="w-6 h-6" />
            </button>
            <h1 className="text-xl font-bold text-gray-800">Admin Control Center</h1>
          </div>

          <div className="flex items-center space-x-4">
            <div className="hidden sm:flex flex-col text-right">
              <span className="text-sm font-semibold text-gray-900">{user?.fullName || 'Administrator'}</span>
              <span className="text-xs text-gray-500">{user?.email}</span>
            </div>
            <div className="w-10 h-10 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center shadow-sm">
              {user?.fullName?.charAt(0) || 'A'}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6 md:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
