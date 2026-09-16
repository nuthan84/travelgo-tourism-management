import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle2 } from 'lucide-react';

export const Contact = () => {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
          Get in Touch
        </h1>
        <p className="mt-2 text-sm sm:text-base text-gray-500">
          Have questions about a holiday package or custom group booking? We're here to help.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 max-w-5xl mx-auto">
        
        {/* Contact Info Card */}
        <div className="md:col-span-5 bg-navy-900 text-white rounded-3xl p-8 space-y-8 flex flex-col justify-between">
          <div className="space-y-6">
            <h3 className="text-xl font-bold">Contact Information</h3>
            <p className="text-sm text-gray-300 leading-relaxed">
              Fill out the form and our tourism holiday specialist will reach out to you within 24 hours.
            </p>

            <div className="space-y-4 text-sm text-gray-300">
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-teal-400 shrink-0" />
                <span>+91 98765 43210</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-teal-400 shrink-0" />
                <span>support@travelgo.com</span>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="w-5 h-5 text-teal-400 shrink-0" />
                <span>TravelGo Plaza, MG Road, Bengaluru, India</span>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-gray-800 text-xs text-teal-300 font-medium">
            Customer Support Available 24x7
          </div>
        </div>

        {/* Contact Form */}
        <div className="md:col-span-7 bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
          {submitted ? (
            <div className="text-center py-12 space-y-3">
              <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
              <h3 className="text-xl font-bold text-gray-900">Message Sent!</h3>
              <p className="text-sm text-gray-500">
                Thank you for reaching out. We will get in touch with you shortly.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                  Your Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="John Doe"
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-500 focus:bg-white transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  placeholder="john@example.com"
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-500 focus:bg-white transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                  Message
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="How can we assist your travel plans?"
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-500 focus:bg-white transition"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md transition text-sm flex items-center justify-center space-x-2"
              >
                <Send className="w-4 h-4 mr-1" />
                <span>Send Message</span>
              </button>
            </form>
          )}
        </div>

      </div>
    </div>
  );
};

export default Contact;
