import React from 'react';
import { useApp } from '../context/AppContext';
import { MessageCircle, Mic, Sparkles } from 'lucide-react';

interface VoiceAndTextActionBarProps {
  compact?: boolean;
}

export const VoiceAndTextActionBar: React.FC<VoiceAndTextActionBarProps> = () => {
  const { openVoiceAssistant, activeRole } = useApp();

  return (
    <button
      onClick={() => openVoiceAssistant()}
      className="w-full flex items-center justify-between gap-3 px-4 py-2 bg-gradient-to-r from-[#075E54] to-[#128C7E] hover:brightness-110 text-white rounded-xl shadow-md border border-emerald-500/40 text-xs font-semibold transition group"
      title="Abrir Asistente de Voz y Navegación WhatsApp 360"
    >
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 rounded-full bg-[#25D366] text-[#075E54] flex items-center justify-center font-bold">
          <MessageCircle className="w-3.5 h-3.5 fill-current" />
        </div>
        <span className="font-bold tracking-wide">Asistente WhatsApp 360</span>
        <span className="text-emerald-200 text-[11px] hidden sm:inline">
          • Órdenes por voz, texto y comunicaciones guardadas
        </span>
      </div>

      <div className="flex items-center gap-1.5 bg-slate-900/60 text-emerald-300 px-2.5 py-1 rounded-lg text-[11px] font-bold group-hover:bg-slate-900 transition-colors">
        <Mic className="w-3 h-3 text-[#25D366]" />
        <span>Abrir Chat →</span>
      </div>
    </button>
  );
};
