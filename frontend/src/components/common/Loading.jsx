import React from 'react';
import { Loader2 } from 'lucide-react';

const Loading = ({ message = 'Loading...', fullScreen = false }) => {
  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-slate-50/80 backdrop-blur-sm z-50 flex flex-col items-center justify-center">
        <div className="w-12 h-12 rounded-2xl bg-blue-600/10 flex items-center justify-center mb-3">
          <Loader2 className="w-6 h-6 text-blue-600 animate-spin" />
        </div>
        <p className="text-sm font-medium text-slate-600">{message}</p>
      </div>
    );
  }

  return (
    <div className="py-12 flex flex-col items-center justify-center w-full">
      <Loader2 className="w-8 h-8 text-blue-600 animate-spin mb-2" />
      <p className="text-sm font-medium text-slate-500">{message}</p>
    </div>
  );
};

export default Loading;
