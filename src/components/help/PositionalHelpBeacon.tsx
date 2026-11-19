import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Lightbulb, Volume2, Square, X, Sparkles, CheckCircle2 } from 'lucide-react';

export interface PositionalHelpBeaconProps {
  id: string;
  title: string;
  content: string;
  keyPoints?: string[];
  category?: string;
  positionClass?: string;
}

export const PositionalHelpBeacon: React.FC<PositionalHelpBeaconProps> = ({
  id,
  title,
  content,
  keyPoints = [],
  category = 'Guía de Uso',
  positionClass = '',
}) => {
  const { isPositionalHelpActive, announceAriaLive } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  if (!isPositionalHelpActive) return null;

  const handleToggle = () => {
    const nextState = !isOpen;
    setIsOpen(nextState);
    if (nextState) {
      announceAriaLive(`Ayuda posicional abierta: ${title}`);
    }
  };

  const handlePlayAudio = () => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    if (isPlayingAudio) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
      return;
    }

    window.speechSynthesis.cancel();
    const script = `${title}. ${content}. ${keyPoints.length ? 'Puntos clave: ' + keyPoints.join(', ') : ''}`;
    const utterance = new SpeechSynthesisUtterance(script);
    utterance.lang = 'es-ES';
    utterance.rate = 1.05;

    utterance.onstart = () => setIsPlayingAudio(true);
    utterance.onend = () => setIsPlayingAudio(false);
    utterance.onerror = () => setIsPlayingAudio(false);

    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className={`relative inline-flex items-center ${positionClass}`} data-testid={`help-beacon-${id}`}>
      
      {/* Beacon Trigger Button with Pulsing Ping Ring */}
      <button
        onClick={handleToggle}
        className="touch-target-min relative z-10 w-6 h-6 rounded-full bg-amber-400 hover:bg-amber-300 text-slate-900 flex items-center justify-center shadow-md transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-amber-500"
        aria-label={`Ayuda posicional para: ${title}`}
        title={`Ayuda posicional: ${title}`}
      >
        <span className="absolute -inset-1 rounded-full bg-amber-400/50 animate-ping opacity-75" />
        <Lightbulb className="w-3.5 h-3.5 fill-current" />
      </button>

      {/* Popover Card: Centered modal on mobile, anchored dropdown on desktop */}
      {isOpen && (
        <>
          {/* Backdrop on mobile devices */}
          <div
            className="fixed inset-0 bg-slate-950/50 backdrop-blur-xs z-50 sm:hidden"
            onClick={() => {
              if (isPlayingAudio && typeof window !== 'undefined') {
                window.speechSynthesis.cancel();
                setIsPlayingAudio(false);
              }
              setIsOpen(false);
            }}
            aria-hidden="true"
          />

          {/* Dialog Container */}
          <div
            className="fixed inset-x-3 top-1/2 -translate-y-1/2 sm:translate-y-0 sm:absolute sm:inset-x-auto sm:right-0 sm:left-auto sm:top-8 sm:w-85 max-h-[85vh] overflow-y-auto z-50 bg-white rounded-2xl shadow-2xl border border-amber-300/80 p-4 sm:p-4.5 text-left animate-in fade-in zoom-in-95 duration-150"
            role="dialog"
            aria-modal="true"
            aria-labelledby={`beacon-title-${id}`}
          >
            <div className="flex items-start justify-between gap-2 border-b border-amber-100 pb-2.5 mb-2.5">
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-xl bg-amber-100 text-amber-900 shrink-0">
                  <Lightbulb className="w-4 h-4 fill-current" />
                </span>
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-amber-800 block">
                    {category}
                  </span>
                  <h4 id={`beacon-title-${id}`} className="font-brand font-black text-xs sm:text-sm text-[#022853] leading-tight">
                    {title}
                  </h4>
                </div>
              </div>

              <button
                onClick={() => {
                  if (isPlayingAudio && typeof window !== 'undefined') {
                    window.speechSynthesis.cancel();
                    setIsPlayingAudio(false);
                  }
                  setIsOpen(false);
                }}
                className="touch-target-min p-1.5 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-800 transition shrink-0"
                aria-label="Cerrar ayuda posicional"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed mb-3">
              {content}
            </p>

            {keyPoints.length > 0 && (
              <ul className="space-y-1.5 mb-3 bg-amber-50/70 p-3 rounded-xl border border-amber-100/90">
                {keyPoints.map((kp, idx) => (
                  <li key={idx} className="flex items-start gap-1.5 text-[11px] text-slate-700 leading-snug">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#48A222] shrink-0 mt-0.5" />
                    <span>{kp}</span>
                  </li>
                ))}
              </ul>
            )}

            {/* Audio Play Button & Context Info */}
            <div className="flex items-center justify-between pt-1 text-xs gap-2">
              <button
                onClick={handlePlayAudio}
                className={`touch-target-min flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold text-xs transition border ${
                  isPlayingAudio
                    ? 'bg-amber-400 text-slate-900 border-amber-500 animate-pulse'
                    : 'bg-slate-50 hover:bg-amber-50 text-slate-700 border-slate-200'
                }`}
              >
                {isPlayingAudio ? (
                  <>
                    <Square className="w-3.5 h-3.5 fill-current" />
                    <span>Detener Audio</span>
                  </>
                ) : (
                  <>
                    <Volume2 className="w-3.5 h-3.5 text-[#0067B9]" />
                    <span>Escuchar con Voz</span>
                  </>
                )}
              </button>

              <span className="text-[10px] text-slate-400 text-right">
                Ayuda contextual 360
              </span>
            </div>
          </div>
        </>
      )}

    </div>
  );
};
