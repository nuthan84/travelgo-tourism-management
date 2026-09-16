import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Hero from '../components/Hero';
import DestinationCard from '../components/DestinationCard';
import PackageCard from '../components/PackageCard';
import Loader from '../components/Loader';
import Rating from '../components/Rating';
import destinationService from '../services/destinationService';
import packageService from '../services/packageService';
import reviewService from '../services/reviewService';
import { ArrowRight, Compass, ShieldCheck, Award, Users, CheckCircle2 } from 'lucide-react';

export const Home = () => {
  const [destinations, setDestinations] = useState([]);
  const [packages, setPackages] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [destRes, pkgRes] = await Promise.all([
          destinationService.getAll(true),
          packageService.getPackages()
        ]);
        setDestinations(destRes || []);
        setPackages(pkgRes || []);

        // Fetch sample reviews if packages exist
        if (pkgRes && pkgRes.length > 0) {
          try {
            const revRes = await reviewService.getByPackageId(pkgRes[0].id);
            setReviews(revRes || []);
          } catch (e) {
            console.error("Error fetching reviews:", e);
          }
        }
      } catch (err) {
        console.error("Home page data fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="space-y-16 pb-20">
      {/* Hero Section */}
      <Hero />

      {/* Popular Destinations Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-baseline mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Popular Destinations</h2>
            <p className="text-sm text-gray-500 mt-1">Explore iconic places across the Indian subcontinent</p>
          </div>
          <Link
            to="/destinations"
            className="text-sm font-semibold text-blue-600 hover:text-blue-700 flex items-center space-x-1"
          >
            <span>View All</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <Loader message="Loading popular destinations..." />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {destinations.slice(0, 4).map((dest) => (
              <DestinationCard key={dest.id} destination={dest} />
            ))}
          </div>
        )}
      </section>

      {/* Featured Holiday Packages Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-baseline mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Featured Packages</h2>
            <p className="text-sm text-gray-500 mt-1">All-inclusive tour itineraries created by travel experts</p>
          </div>
          <Link
            to="/packages"
            className="text-sm font-semibold text-blue-600 hover:text-blue-700 flex items-center space-x-1"
          >
            <span>View All</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <Loader message="Loading featured packages..." />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {packages.slice(0, 4).map((pkg) => (
              <PackageCard key={pkg.id} packageData={pkg} />
            ))}
          </div>
        )}
      </section>

      {/* Why Choose TravelGo Section */}
      <section className="bg-blue-50/50 border-y border-blue-100 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Why Choose TravelGo</h2>
            <p className="text-sm text-gray-500 mt-2">
              We bring transparency, local authenticity, and 24/7 dedicated support to every step of your travel.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl border border-blue-100 shadow-sm text-center">
              <div className="w-14 h-14 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center mx-auto mb-5">
                <ShieldCheck className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Best Price Guarantee</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Direct partnerships with trusted hotels and fleet operators eliminate middleman commissions.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl border border-blue-100 shadow-sm text-center">
              <div className="w-14 h-14 rounded-2xl bg-teal-100 text-teal-600 flex items-center justify-center mx-auto mb-5">
                <Award className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Handcrafted Itineraries</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Every tour is thoughtfully organized with balanced sightseeing, relaxation, and cultural encounters.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl border border-blue-100 shadow-sm text-center">
              <div className="w-14 h-14 rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center mx-auto mb-5">
                <Users className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Verified Guides & Stays</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Certified local tour guides and sanitized star-rated hotels ensure comfortable stays.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Customer Reviews Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">What Our Travellers Say</h2>
          <p className="text-sm text-gray-500 mt-1">Real feedback from verified guests who booked through TravelGo</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between">
            <div>
              <Rating value={5} />
              <p className="text-sm text-gray-700 italic mt-4 leading-relaxed">
                "Breathtaking experience! The Dal lake shikara ride and Gulmarg snow were unforgettable. The itinerary was perfectly paced."
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-gray-100 flex items-center space-x-3">
              <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-sm">
                J
              </div>
              <div>
                <h4 className="text-xs font-bold text-gray-900">John Doe</h4>
                <p className="text-[11px] text-gray-400">Kashmir Paradise</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between">
            <div>
              <Rating value={5} />
              <p className="text-sm text-gray-700 italic mt-4 leading-relaxed">
                "Loved the sunset cruise and our resort right next to Baga beach. The itinerary was very relaxing and well-managed."
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-gray-100 flex items-center space-x-3">
              <div className="w-9 h-9 rounded-full bg-pink-100 text-pink-700 flex items-center justify-center font-bold text-sm">
                P
              </div>
              <div>
                <h4 className="text-xs font-bold text-gray-900">Priya Sharma</h4>
                <p className="text-[11px] text-gray-400">Goa Beach Getaway</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between">
            <div>
              <Rating value={5} />
              <p className="text-sm text-gray-700 italic mt-4 leading-relaxed">
                "The Alleppey houseboat experience was top-notch with authentic Kerala karimeen and coconut water. Highly recommended!"
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-gray-100 flex items-center space-x-3">
              <div className="w-9 h-9 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center font-bold text-sm">
                R
              </div>
              <div>
                <h4 className="text-xs font-bold text-gray-900">Rahul Verma</h4>
                <p className="text-[11px] text-gray-400">Kerala Backwaters</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-blue-700 to-teal-600 rounded-3xl p-8 sm:p-12 text-white text-center sm:text-left flex flex-col sm:flex-row items-center justify-between shadow-xl">
          <div className="max-w-xl mb-6 sm:mb-0">
            <h2 className="text-2xl sm:text-3xl font-extrabold leading-tight">
              Ready to Explore India's Wonders?
            </h2>
            <p className="mt-2 text-blue-100 text-sm sm:text-base">
              Book your customized holiday package today and get access to exclusive seasonal offers.
            </p>
          </div>
          <Link
            to="/packages"
            className="px-8 py-4 bg-white text-blue-700 font-bold rounded-2xl hover:bg-blue-50 transition shadow-lg shrink-0 text-sm"
          >
            Explore All Packages
          </Link>
        </div>
      </section>

    </div>
  );
};

export default Home;
