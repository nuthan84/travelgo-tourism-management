import React from 'react';
import { Compass, ShieldCheck, Heart, Users, Award, MapPin } from 'lucide-react';

export const About = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      
      {/* Hero */}
      <div className="text-center max-w-3xl mx-auto">
        <span className="text-xs font-bold uppercase tracking-wider text-teal-600 bg-teal-50 px-3 py-1 rounded-full border border-teal-200">
          About TravelGo
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight mt-3">
          Redefining Tourism Across Incredible India
        </h1>
        <p className="mt-3 text-sm sm:text-base text-gray-600 leading-relaxed">
          TravelGo is an end-to-end full-stack tourism management system designed to connect discerning travellers with handcrafted, all-inclusive tour packages across India.
        </p>
      </div>

      {/* Grid of Values */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
          <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center mb-4">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">Transparency & Fair Pricing</h3>
          <p className="text-sm text-gray-600 leading-relaxed">
            Every cost breakdown is transparent. No hidden charges, no unexpected taxi fees.
          </p>
        </div>

        <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
          <div className="w-12 h-12 rounded-xl bg-teal-100 text-teal-600 flex items-center justify-center mb-4">
            <Heart className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">Curated With Passion</h3>
          <p className="text-sm text-gray-600 leading-relaxed">
            Every itinerary is personally verified by destination specialists to ensure unforgettable memories.
          </p>
        </div>

        <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
          <div className="w-12 h-12 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center mb-4">
            <Users className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">24/7 Traveller Care</h3>
          <p className="text-sm text-gray-600 leading-relaxed">
            Our on-ground coordinators are accessible around the clock throughout your entire trip.
          </p>
        </div>
      </div>

    </div>
  );
};

export default About;
