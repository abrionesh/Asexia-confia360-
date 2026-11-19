import React from 'react';
import { useApp } from '../context/AppContext';
import { ArrowLeft, ChevronLeft, Volume2, Square } from 'lucide-react';

interface NavigationBackButtonProps {
  className?: string;
  variant?: 'header' | 'banner' | 'floating';
}

export const NavigationBackButton: React.FC<NavigationBackButtonProps> = ({
  className = '',
  variant = 'banner',
}) => {
  const {
    canGoBack,
    previousNavigationState,
    goBack,
    currentScreenTitle,
    isReadingCurrentScreen,
    toggleReadCurrentScreen,
  } = useApp();

  if (!canGoBack || !previousNavigationState) {
    return null;
  }

  if (variant === 'header') {
    return (
      <button
        onClick={goBack}
        className={`touch-target-min inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all border border-white/15 focus:outline-none focus:ring-2 focus:ring-[#80D518] shadow-xs ${className}`}
        aria-label={`Volver a ${previousNavigationState.title}`}
        title={`Volver a ${previousNavigationState.title}`}
      >
        <ArrowLeft className="w-3.5 h-3.5 text-[#80D518]" />
        <span className="hidden sm:inline">Volver a</span>
        <span className="truncate max-w-[140px] font-medium text-blue-100">
          {previousNavigationState.title}
        </span>
      </button>
    );
  }

  // Default 'banner' variant displayed at the top of the content area
  return (
    <div className={`flex items-center justify-between bg-white rounded-2xl px-3.5 py-2.5 border border-slate-200/90 shadow-2xs text-xs animate-in fade-in duration-150 ${className}`}>
      <button
        onClick={goBack}
        className="touch-target-min flex items-center gap-2 text-[#0067B9] hover:text-[#022853] font-bold group transition"
        aria-label={`Volver a la pantalla anterior: ${previousNavigationState.title}`}
      >
        <div className="w-6 h-6 rounded-lg bg-blue-50 group-hover:bg-blue-100 border border-blue-200/80 flex items-center justify-center transition">
          <ArrowLeft className="w-3.5 h-3.5 text-[#0067B9] group-hover:-translate-x-0.5 transition-transform" />
        </div>
        <span>
          Volver a <strong className="text-[#022853] font-extrabold">{previousNavigationState.title}</strong>
        </span>
      </button>

      <div className="flex items-center gap-2.5">
        <span className="text-[11px] text-slate-400 hidden sm:inline">
          Actual: <span className="font-semibold text-slate-600">{currentScreenTitle}</span>
        </span>

        {/* Screen audio button */}
        <button
          onClick={toggleReadCurrentScreen}
          className={`touch-target-min inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-bold transition border ${
            isReadingCurrentScreen
              ? 'bg-[#80D518] text-[#022853] border-[#80D518] animate-pulse'
              : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
          }`}
          title={isReadingCurrentScreen ? 'Pausar audio de la pantalla' : 'Oír explicación de esta pantalla'}
        >
          {isReadingCurrentScreen ? (
            <>
              <Square className="w-3 h-3 fill-current" />
              <span className="font-black text-[11px]">Pausar</span>
            </>
          ) : (
            <>
              <Volume2 className="w-3 h-3 text-[#0067B9]" />
              <span className="text-[11px]">Oír Pantalla</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
