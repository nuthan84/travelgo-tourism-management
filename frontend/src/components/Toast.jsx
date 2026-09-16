import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export const Toast = ({ message, type = 'success', onClose }) => {
  if (!message) return null;

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />,
    error: <AlertCircle className="w-5 h-5 text-rose-500 shrink-0" />,
    info: <Info className="w-5 h-5 text-blue-500 shrink-0" />
  };

  const borderColors = {
    success: 'border-emerald-200 bg-emerald-50 text-emerald-900',
    error: 'border-rose-200 bg-rose-50 text-rose-900',
    info: 'border-blue-200 bg-blue-50 text-blue-900'
  };

  return (
    <div className={`fixed bottom-5 right-5 z-50 flex items-center p-4 rounded-xl border shadow-lg max-w-md ${borderColors[type] || borderColors.info} animate-bounce-short`}>
      {icons[type]}
      <p className="ml-3 text-sm font-medium mr-6">{message}</p>
      {onClose && (
        <button onClick={onClose} className="ml-auto opacity-70 hover:opacity-100">
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};

export default Toast;
