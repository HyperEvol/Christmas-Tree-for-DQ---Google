
import React from 'react';

const LoadingScreen: React.FC = () => {
  return (
    <div className="absolute inset-0 bg-[#01160e] flex flex-col items-center justify-center z-50">
      <div className="relative">
        <div className="w-24 h-24 border-t-2 border-b-2 border-[#d4af37] rounded-full animate-spin"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-12 h-12 bg-[#d4af37]/20 rounded-full animate-pulse"></div>
        </div>
      </div>
      <h2 className="mt-8 text-[#d4af37] font-serif tracking-[0.5em] text-xl animate-pulse uppercase">
        Initializing Arix
      </h2>
      <p className="mt-2 text-[#d4af37]/40 text-[10px] tracking-[0.2em] uppercase">
        Loading Geometry & Cinematic Assets
      </p>
    </div>
  );
};

export default LoadingScreen;
