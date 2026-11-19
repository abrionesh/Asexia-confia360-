import React from 'react';
import { useApp } from '../../context/AppContext';
import { CheckCircle2, X, Sparkles } from 'lucide-react';

export const TourCompletionBanner: React.FC = () => {
  const { tourCompletionMessage, dismissTourCompletionMessage } = useApp();

  if (!tourCompletionMessage) {
    return null;
  }

  return (
    <div
      role="alert"
      aria-live="polite"
      tabIndex={0}
      onClick={dismissTourCompletionMessage}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ' || e.key === 'Escape') {
          dismissTourCompletionMessage();
        }
      }}
      className="cursor-pointer select-none bg-gradient-to-r from-emerald-600 via-[#0067B9] to-[#022853] text-white p-3.5 sm:p-4 rounded-2xl shadow-xl border-2 border-emerald-300/80 hover:border-white transition-all transform active:scale-[0.99] group animate-in slide-in-from-top-3 duration-250 focus:outline-none focus:ring-4 focus:ring-emerald-400"
      title="Toca en cualquier parte de este aviso para quitarlo"
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-xs flex items-center justify-center text-xl shrink-0 group-hover:scale-110 transition-transform shadow-inner">
            <span>🎉</span>
          </div>
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <span className="text-[10px] font-black uppercase tracking-wider bg-emerald-400 text-slate-950 px-2 py-0.5 rounded-full shadow-xs">
                Tutorial Completado
              </span>
              <span className="text-xs text-emerald-200 font-bold hidden sm:inline">
                Listo para trabajar
              </span>
            </div>
            <p className="text-xs sm:text-sm font-bold text-white leading-snug">
              {tourCompletionMessage}
            </p>
          </div>
        </div>

        <div className="shrink-0 flex items-center gap-2 bg-white/15 hover:bg-white/25 px-3 py-1.5 rounded-xl border border-white/25 transition">
          <span className="text-[11px] font-black uppercase text-emerald-200 group-hover:text-white hidden sm:inline">
            Tocar para cerrar
          </span>
          <X className="w-4 h-4 text-white group-hover:rotate-90 transition-transform" />
        </div>
      </div>
    </div>
  );
};
