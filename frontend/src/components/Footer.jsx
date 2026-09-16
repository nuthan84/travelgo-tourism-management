import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, Phone, Mail, MapPin, Heart } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-navy-900 text-gray-300 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          
          {/* Brand Info */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center space-x-2.5">
              <div className="w-10 h-10 rounded-full bg-teal-500/20 flex items-center justify-center border border-teal-500/30 text-teal-400">
                <Compass className="w-6 h-6" />
              </div>
              <span className="text-2xl font-bold tracking-tight text-white font-sans">
                Travel<span className="text-teal-400">Go</span>
              </span>
            </Link>
            <p className="text-sm text-gray-400 leading-relaxed">
              Discover India's most breathtaking destinations and handcrafted holiday packages.
              Curated experiences, guaranteed prices, and memories for a lifetime.
            </p>
            <p className="text-xs text-teal-400 font-medium tracking-wide">
              Explore • Book • Travel • Repeat
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Quick Links</h3>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/destinations" className="hover:text-white transition">All Destinations</Link></li>
              <li><Link to="/packages" className="hover:text-white transition">Holiday Packages</Link></li>
              <li><Link to="/about" className="hover:text-white transition">About TravelGo</Link></li>
              <li><Link to="/contact" className="hover:text-white transition">Customer Support</Link></li>
              <li><Link to="/dashboard" className="hover:text-white transition">User Dashboard</Link></li>
            </ul>
          </div>

          {/* Popular Destinations */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Top Destinations</h3>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/packages?search=kerala" className="hover:text-white transition">Kerala Backwaters</Link></li>
              <li><Link to="/packages?search=goa" className="hover:text-white transition">Goa Beaches</Link></li>
              <li><Link to="/packages?search=kashmir" className="hover:text-white transition">Kashmir Valley</Link></li>
              <li><Link to="/packages?search=manali" className="hover:text-white transition">Manali Hills</Link></li>
              <li><Link to="/packages?search=rajasthan" className="hover:text-white transition">Rajasthan Royal Palaces</Link></li>
            </ul>
          </div>

          {/* Contact & Support */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Get In Touch</h3>
            <ul className="space-y-3 text-sm text-gray-400">
              <li className="flex items-center space-x-3">
                <MapPin className="w-4 h-4 text-teal-400 shrink-0" />
                <span>TravelGo Plaza, MG Road, Bengaluru, India</span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone className="w-4 h-4 text-teal-400 shrink-0" />
                <span>+91 98765 43210</span>
              </li>
              <li className="flex items-center space-x-3">
                <Mail className="w-4 h-4 text-teal-400 shrink-0" />
                <span>support@travelgo.com</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Banner */}
        <div className="mt-12 pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center text-xs text-gray-500 space-y-4 md:space-y-0">
          <p>© {new Date().getFullYear()} TravelGo Tourism Management System. All rights reserved.</p>
          <div className="flex items-center space-x-2 text-teal-300 font-medium italic">
            <span>Travel More, Live Better</span>
            <span>✈</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
