import React from 'react';

export const Loader = ({ message = 'Loading...' }) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 space-y-4">
      <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
      <p className="text-sm font-medium text-gray-500">{message}</p>
    </div>
  );
};

export default Loader;
