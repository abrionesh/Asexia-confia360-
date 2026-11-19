import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Lightbulb,
  ArrowLeft,
  Compass,
  Sparkles,
  HelpCircle,
  Volume2,
  Square,
  Bot,
} from 'lucide-react';

export const PositionalHelpFloatingBar: React.FC = () => {
  const {
    isPositionalHelpActive,
    togglePositionalHelp,
    canGoBack,
    previousNavigationState,
    goBack,
    currentScreenTitle,
    startTour,
    isReadingCurrentScreen,
    toggleReadCurrentScreen,
    openDrawer360,
    openVoiceAssistant,
  } = useApp();

  return (
    <aside
      aria-label="Barra flotante de retroceso, audio y ayuda del restaurante"
      className="hidden md:flex fixed bottom-20 right-6 z-40 items-center gap-2 select-none justify-end"
    >
      {/* Universal Back Button (Sticky Floating Pill) */}
      {canGoBack && previousNavigationState && (
        <button
          onClick={goBack}
          className="touch-target-min flex items-center gap-1.5 sm:gap-2 bg-[#022853] hover:bg-[#0067B9] text-white px-3 sm:px-3.5 py-2 rounded-2xl shadow-lg border border-white/20 text-xs font-bold transition-all transform hover:-translate-y-0.5 active:translate-y-0 group"
          aria-label={`Retroceder a ${previousNavigationState.title}`}
          title={`Retroceder a ${previousNavigationState.title}`}
        >
          <div className="w-5 h-5 rounded-lg bg-white/20 flex items-center justify-center group-hover:-translate-x-0.5 transition-transform">
            <ArrowLeft className="w-3.5 h-3.5 text-[#80D518]" />
          </div>
          <span className="hidden sm:inline">Atrás:</span>
          <span className="truncate max-w-[120px] font-semibold text-blue-100">
            {previousNavigationState.title}
          </span>
        </button>
      )}

      {/* Screen Reader Audio Button (🔊 Oír Pantalla) */}
      <button
        onClick={toggleReadCurrentScreen}
        className={`touch-target-min flex items-center gap-1.5 px-3 py-2 rounded-2xl shadow-lg border transition-all transform hover:-translate-y-0.5 active:translate-y-0 text-xs font-bold ${
          isReadingCurrentScreen
            ? 'bg-[#80D518] text-[#022853] border-[#80D518] animate-pulse ring-2 ring-[#80D518]/50'
            : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-300'
        }`}
        title={isReadingCurrentScreen ? 'Pausar audio de la pantalla' : 'Oír explicación de esta pantalla con voz'}
        aria-label={isReadingCurrentScreen ? 'Detener lectura en voz alta' : 'Oír esta pantalla con voz'}
      >
        <div className={`w-5 h-5 rounded-lg flex items-center justify-center ${
          isReadingCurrentScreen ? 'bg-[#022853] text-[#80D518]' : 'bg-blue-50 text-[#0067B9]'
        }`}>
          {isReadingCurrentScreen ? <Square className="w-3 h-3 fill-current" /> : <Volume2 className="w-3.5 h-3.5" />}
        </div>
        <span className="hidden sm:inline">
          {isReadingCurrentScreen ? 'Pausar Audio' : 'Oír Pantalla'}
        </span>
      </button>

      {/* Voice Agent Quick Launch - WhatsApp 360 */}
      <button
        onClick={() => openVoiceAssistant()}
        className="touch-target-min hidden sm:flex items-center gap-1.5 bg-[#075E54] hover:bg-[#128C7E] text-white px-3 py-2 rounded-2xl shadow-md border border-[#25D366]/40 text-xs font-bold transition group"
        title="Preguntar al asistente de voz y viajar a cualquier pantalla (WhatsApp 360)"
        aria-label="Preguntar al asistente con voz estilo WhatsApp"
      >
        <Bot className="w-4 h-4 text-[#25D366] group-hover:scale-110 transition-transform" />
        <span>Voz WhatsApp</span>
      </button>

      {/* Positional Help Toggle Button */}
      <button
        onClick={togglePositionalHelp}
        className={`touch-target-min flex items-center gap-1.5 sm:gap-2 px-3 sm:px-3.5 py-2 rounded-2xl shadow-lg border transition-all transform hover:-translate-y-0.5 active:translate-y-0 text-xs font-bold ${
          isPositionalHelpActive
            ? 'bg-amber-400 text-slate-950 border-amber-500 ring-2 ring-amber-400/50 font-black'
            : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-300'
        }`}
        aria-pressed={isPositionalHelpActive}
        title={isPositionalHelpActive ? 'Desactivar ayuda posicional' : 'Activar balizas de ayuda posicional en pantalla'}
      >
        <div className={`w-5 h-5 rounded-lg flex items-center justify-center ${
          isPositionalHelpActive ? 'bg-amber-500 text-slate-950' : 'bg-amber-100 text-amber-900'
        }`}>
          <Lightbulb className="w-3.5 h-3.5 fill-current" />
        </div>
        <span className="hidden md:inline">
          {isPositionalHelpActive ? 'Ayuda Activa' : 'Ayuda'}
        </span>
        <span className={`text-[10px] font-black uppercase px-1.5 py-0.5 rounded-full ${
          isPositionalHelpActive ? 'bg-slate-950 text-amber-300' : 'bg-slate-200 text-slate-700'
        }`}>
          {isPositionalHelpActive ? 'ON' : 'OFF'}
        </span>
      </button>

      {/* Quick Launch Universal Drawer 360 */}
      <button
        onClick={() => openDrawer360()}
        className="touch-target-min flex items-center gap-1.5 bg-[#022853] hover:bg-[#0067B9] text-white px-3 py-2 rounded-2xl shadow-lg border border-[#80D518]/60 text-xs font-bold transition transform hover:-translate-y-0.5 active:translate-y-0"
        title="Abrir Cajón Transversal de Navegación 360º"
        aria-label="Abrir Navegación 360"
      >
        <Compass className="w-4 h-4 text-[#80D518]" />
        <span className="hidden sm:inline">Navegación 360º</span>
        <span className="sm:hidden">360º</span>
      </button>

      {/* Quick Launch Tour */}
      <button
        onClick={() => startTour('tour')}
        className="touch-target-min hidden sm:flex items-center gap-1.5 bg-white hover:bg-slate-50 text-[#0067B9] hover:text-[#022853] px-3 py-2 rounded-2xl shadow-md border border-slate-200 text-xs font-bold transition"
        title="Abrir Tour Guiado del Restaurante"
        aria-label="Abrir Tour Guiado"
      >
        <Sparkles className="w-4 h-4 text-[#80D518]" />
        <span>Tour</span>
      </button>
    </aside>
  );
};
