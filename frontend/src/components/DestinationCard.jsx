import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export const DestinationCard = ({ destination }) => {
  const { id, name, category, imageUrl, description, state } = destination;

  return (
    <Link
      to={`/packages?destinationId=${id}`}
      className="group relative flex flex-col bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100"
    >
      <div className="relative h-64 overflow-hidden bg-gray-100">
        <img
          src={imageUrl || 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80'}
          alt={name}
          className="w-full h-full object-cover object-center group-hover:scale-110 transition duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent"></div>
        
        {/* Bottom Details Overlay */}
        <div className="absolute bottom-4 left-4 right-4 text-white">
          <h3 className="text-xl font-bold leading-snug drop-shadow-sm group-hover:text-teal-300 transition">
            {name}
          </h3>
          <p className="text-xs text-gray-200 font-medium drop-shadow-sm mt-0.5">
            {category || state}
          </p>
        </div>
      </div>
      
      {/* Card Body if description exists */}
      <div className="p-4 flex items-center justify-between text-xs font-semibold text-blue-600 bg-white">
        <span>Explore Packages</span>
        <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition" />
      </div>
    </Link>
  );
};

export default DestinationCard;
