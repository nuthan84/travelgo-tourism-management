import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Compass, Mail, Lock, AlertCircle, ArrowRight } from 'lucide-react';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/dashboard';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await login({ email, password });
      if (res.role === 'ADMIN') {
        navigate('/admin');
      } else {
        navigate(from, { replace: true });
      }
    } catch (err) {
      setError(err.message || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = (demoEmail, demoPass) => {
    setEmail(demoEmail);
    setPassword(demoPass);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 sm:p-10 shadow-lg border border-gray-100 space-y-6">
        
        {/* Brand Icon & Heading */}
        <div className="text-center">
          <Link to="/" className="inline-flex items-center space-x-2 text-teal-600 mb-4">
            <div className="w-10 h-10 rounded-full bg-teal-50 flex items-center justify-center border border-teal-500/20">
              <Compass className="w-6 h-6" />
            </div>
          </Link>
          <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight">
            Welcome to TravelGo
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            Sign in to access your holiday bookings and wishlist
          </p>
        </div>

        {error && (
          <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs font-semibold flex items-center">
            <AlertCircle className="w-4 h-4 mr-2 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-500 focus:bg-white transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-500 focus:bg-white transition"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md hover:shadow-lg transition text-sm flex items-center justify-center space-x-2"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <>
                <span>Sign In</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Demo Credentials Quick Fill */}
        <div className="pt-4 border-t border-gray-100">
          <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400 text-center mb-2">
            Demo Credentials (1-Click Fill)
          </p>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              type="button"
              onClick={() => handleQuickLogin('admin@travelgo.com', 'Admin@123')}
              className="py-2 px-3 bg-gray-50 hover:bg-blue-50 hover:text-blue-700 rounded-xl border border-gray-200 font-semibold transition text-left"
            >
              <span className="block font-bold">Admin Demo</span>
              <span className="text-[10px] text-gray-400">admin@travelgo.com</span>
            </button>
            <button
              type="button"
              onClick={() => handleQuickLogin('john@example.com', 'User@123')}
              className="py-2 px-3 bg-gray-50 hover:bg-blue-50 hover:text-blue-700 rounded-xl border border-gray-200 font-semibold transition text-left"
            >
              <span className="block font-bold">User Demo</span>
              <span className="text-[10px] text-gray-400">john@example.com</span>
            </button>
          </div>
        </div>

        <p className="text-xs text-center text-gray-500 pt-2">
          Don't have an account?{' '}
          <Link to="/register" className="font-bold text-blue-600 hover:underline">
            Sign up now
          </Link>
        </p>

      </div>
    </div>
  );
};

export default Login;
