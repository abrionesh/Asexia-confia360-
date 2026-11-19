import React, { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, Sparkles, CheckCircle2 } from 'lucide-react';

export const AriaLiveAnnouncer: React.FC = () => {
  const { ariaLiveMessage, dismissAriaLive } = useApp();
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [displayMessage, setDisplayMessage] = useState<string>('');

  useEffect(() => {
    if (ariaLiveMessage && ariaLiveMessage.trim() !== '') {
      setDisplayMessage(ariaLiveMessage);
      setIsVisible(true);

      // Auto-dismiss automatically after 4 seconds (4000ms)
      const timer = setTimeout(() => {
        setIsVisible(false);
        dismissAriaLive();
      }, 4000);

      return () => clearTimeout(timer);
    } else {
      setIsVisible(false);
    }
  }, [ariaLiveMessage, dismissAriaLive]);

  const handleDismiss = () => {
    setIsVisible(false);
    dismissAriaLive();
  };

  return (
    <>
      {/* Visually hidden for assistive technology (Screen Readers: VoiceOver / TalkBack / NVDA) */}
      <div
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
        id="a11y-live-region"
      >
        {ariaLiveMessage}
      </div>

      {/* Discrete transient toast alert for sighted users: auto-dismisses in 4s and disappears on click/touch */}
      {isVisible && displayMessage && (
        <div
          role="status"
          aria-live="polite"
          tabIndex={0}
          onClick={handleDismiss}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ' || e.key === 'Escape') {
              handleDismiss();
            }
          }}
          className="fixed bottom-5 right-4 sm:right-6 z-50 max-w-sm w-[calc(100vw-2rem)] sm:w-auto cursor-pointer select-none rounded-2xl border-2 border-emerald-400/90 bg-[#022853] text-white p-3.5 shadow-2xl backdrop-blur-md transition-all duration-200 hover:border-emerald-300 hover:shadow-emerald-900/30 transform active:scale-98 animate-in slide-in-from-bottom-4 fade-in group focus:outline-none focus:ring-4 focus:ring-emerald-400/50"
          title="Toca para cerrar este aviso"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-2.5">
              <span className="flex h-3 w-3 translate-y-1 rounded-full bg-[#80D518] animate-ping shrink-0" />
              <div className="flex-1 text-xs">
                <div className="flex items-center gap-1.5 mb-0.5">
                  <span className="text-[10px] font-black uppercase tracking-wider text-[#80D518]">
                    Aviso de Estado:
                  </span>
                  <span className="text-[10px] text-slate-300 font-semibold hidden sm:inline">
                    · Toca para cerrar
                  </span>
                </div>
                <p className="text-white font-medium leading-snug">
                  {displayMessage}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleDismiss();
              }}
              className="p-1 rounded-lg bg-white/10 hover:bg-white/20 text-slate-200 hover:text-white transition shrink-0 group-hover:rotate-90 duration-150"
              title="Cerrar aviso"
              aria-label="Cerrar aviso de estado"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Progress bar indicating automatic disappearance */}
          <div className="mt-2.5 h-1 w-full bg-white/15 rounded-full overflow-hidden">
            <div
              className="h-full bg-[#80D518] rounded-full animate-[shrink_4s_linear_forwards]"
              style={{
                animation: 'shrinkProgress 4000ms linear forwards',
              }}
            />
          </div>
          <style>{`
            @keyframes shrinkProgress {
              0% { width: 100%; }
              100% { width: 0%; }
            }
          `}</style>
        </div>
      )}
    </>
  );
};
