
import React from 'react';
import { TreeState } from '../types';
import { generateHolidayGreeting } from '../services/geminiService';

interface UIOverlayProps {
  treeState: TreeState;
  onToggle: () => void;
  isAiGenerating: boolean;
  setIsAiGenerating: (val: boolean) => void;
  aiGreeting: string | null;
  setAiGreeting: (val: string | null) => void;
}

const UIOverlay: React.FC<UIOverlayProps> = ({ 
  treeState, 
  onToggle, 
  isAiGenerating, 
  setIsAiGenerating,
  aiGreeting,
  setAiGreeting 
}) => {
  
  const handleAiSignature = async () => {
    setIsAiGenerating(true);
    setAiGreeting(null);
    try {
      const greeting = await generateHolidayGreeting();
      setAiGreeting(greeting);
    } catch (error) {
      setAiGreeting("Wishing you a golden holiday season filled with magic and light.");
    } finally {
      setIsAiGenerating(false);
    }
  };

  return (
    <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-8 md:p-12">
      <div className="flex justify-between items-start">
        <div className="bg-black/40 backdrop-blur-xl border border-[#d4af37]/50 p-5 rounded-xl pointer-events-auto shadow-[0_0_20px_rgba(212,175,55,0.2)]">
          <p className="text-[10px] uppercase tracking-[0.3em] text-[#d4af37]">Status: Active</p>
          <p className="text-2xl font-serif text-[#ffd700] drop-shadow-sm">{treeState === TreeState.SCATTERED ? 'Aetheric Drift' : 'Signature Array'}</p>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center pointer-events-none px-4">
        {aiGreeting && (
          <div className="max-w-xl animate-in fade-in zoom-in duration-700 bg-black/60 backdrop-blur-2xl border-l-4 border-[#ffd700] p-10 rounded-r-3xl shadow-[0_0_50px_rgba(0,0,0,0.5)]">
            <i className="fas fa-holly-berry text-[#ffd700] text-3xl mb-6 block"></i>
            <p className="text-xl md:text-3xl font-serif text-[#ffffff] leading-relaxed italic drop-shadow-md">
              "{aiGreeting}"
            </p>
            <div className="mt-8 flex items-center gap-4">
              <div className="h-[2px] flex-1 bg-gradient-to-r from-[#ffd700] to-transparent"></div>
              <span className="text-[11px] uppercase tracking-[0.4em] text-[#ffd700] font-bold">Arix Signature</span>
            </div>
            <button 
              onClick={() => setAiGreeting(null)}
              className="mt-8 text-white/50 hover:text-[#ffd700] pointer-events-auto transition-all text-xs uppercase tracking-[0.3em]"
            >
              [ Dismiss ]
            </button>
          </div>
        )}
      </div>

      <div className="flex flex-col md:flex-row items-center justify-center gap-8 pb-4 pointer-events-auto">
        <button 
          onClick={onToggle}
          className="group relative px-10 py-5 bg-[#043927] border-2 border-[#d4af37] overflow-hidden rounded-full transition-all hover:scale-110 hover:shadow-[0_0_30px_rgba(212,175,55,0.4)] active:scale-95"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#ffd700]/30 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
          <span className="relative z-10 flex items-center gap-4 text-[#ffd700] tracking-[0.2em] font-bold uppercase text-base">
            <i className={`fas ${treeState === TreeState.SCATTERED ? 'fa-magic' : 'fa-atom'}`}></i>
            {treeState === TreeState.SCATTERED ? 'Manifest Form' : 'Shatter Reality'}
          </span>
        </button>

        <button 
          onClick={handleAiSignature}
          disabled={isAiGenerating}
          className="group px-10 py-5 bg-[#d4af37] border-2 border-[#d4af37] hover:bg-[#ffd700] rounded-full transition-all disabled:opacity-50 hover:scale-105 active:scale-95"
        >
          <span className="flex items-center gap-4 text-[#01160e] tracking-[0.2em] font-bold uppercase text-base">
            {isAiGenerating ? (
              <i className="fas fa-spinner fa-spin"></i>
            ) : (
              <i className="fas fa-feather-pointed"></i>
            )}
            {isAiGenerating ? 'Crafting...' : 'Arix Blessing'}
          </span>
        </button>
      </div>

      <div className="absolute top-6 left-6 w-16 h-16 border-t-4 border-l-4 border-[#ffd700]/60 rounded-tl-lg"></div>
      <div className="absolute top-6 right-6 w-16 h-16 border-t-4 border-r-4 border-[#ffd700]/60 rounded-tr-lg"></div>
      <div className="absolute bottom-6 left-6 w-16 h-16 border-b-4 border-l-4 border-[#ffd700]/60 rounded-bl-lg"></div>
      <div className="absolute bottom-6 right-6 w-16 h-16 border-b-4 border-r-4 border-[#ffd700]/60 rounded-br-lg"></div>
    </div>
  );
};

export default UIOverlay;
