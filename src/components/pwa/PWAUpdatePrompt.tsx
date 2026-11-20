import React, { useEffect, useRef, useState } from 'react';
import { registerSW } from 'virtual:pwa-register';
import { RefreshCw, CheckCircle2, X } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const PWAUpdatePrompt: React.FC = () => {
  const { announceAriaLive } = useApp();
  const [needRefresh, setNeedRefresh] = useState(false);
  const [offlineReady, setOfflineReady] = useState(false);
  const updateSwRef = useRef<((reloadPage?: boolean) => Promise<void>) | null>(null);

  useEffect(() => {
    const updateSW = registerSW({
      immediate: true,
      onNeedRefresh() {
        setNeedRefresh(true);
        announceAriaLive('Nueva actualización de AsexIA Confia360 disponible.');
      },
      onOfflineReady() {
        setOfflineReady(true);
        announceAriaLive('AsexIA Confia360 lista para funcionar sin conexión.');
      },
    });
    updateSwRef.current = updateSW;
  }, [announceAriaLive]);

  useEffect(() => {
    if (!offlineReady) return;
    const timer = setTimeout(() => setOfflineReady(false), 4500);
    return () => clearTimeout(timer);
  }, [offlineReady]);

  if (!needRefresh && !offlineReady) return null;

  return (
    <div className="fixed bottom-4 left-4 z-50 max-w-sm animate-in slide-in-from-bottom-4 duration-200">
      {needRefresh ? (
        <div className="rounded-2xl bg-[#022853] text-white p-3.5 shadow-xl border border-white/15 flex items-center gap-3 text-xs">
          <RefreshCw className="w-4 h-4 text-[#80D518] shrink-0" />
          <div className="flex-1">
            <p className="font-bold">Nueva versión disponible</p>
            <p className="text-[11px] text-blue-200">Actualiza para aplicar las últimas mejoras PWA.</p>
          </div>
          <button
            type="button"
            onClick={() => updateSwRef.current?.(true)}
            className="px-2.5 py-1.5 rounded-lg bg-[#80D518] text-[#022853] font-black text-[11px] hover:brightness-105 transition"
          >
            Actualizar
          </button>
          <button
            type="button"
            onClick={() => setNeedRefresh(false)}
            className="text-blue-200 hover:text-white"
            aria-label="Cerrar aviso de actualización"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div className="rounded-2xl bg-white text-[#022853] p-3 shadow-lg border border-emerald-200 flex items-center gap-2.5 text-xs">
          <CheckCircle2 className="w-4 h-4 text-[#48A222] shrink-0" />
          <span className="font-semibold">App lista para operar sin conexión</span>
          <button
            type="button"
            onClick={() => setOfflineReady(false)}
            className="text-slate-400 hover:text-slate-700"
            aria-label="Ocultar aviso offline"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
};
