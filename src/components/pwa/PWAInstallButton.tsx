import React, { useState } from 'react';
import { usePWAInstall } from './usePWAInstall';
import { Download, Smartphone } from 'lucide-react';

export const PWAInstallButton: React.FC = () => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  // If already running as an installed standalone PWA, hide or show subtle status
  if (isInstalled) {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-[#48A222]/15 text-[#48A222] border border-[#48A222]/30">
        <span className="w-1.5 h-1.5 rounded-full bg-[#48A222]" />
        PWA Instalada
      </span>
    );
  }

  // Chromium / Android / Desktop flow
  if (isInstallable) {
    return (
      <button
        onClick={install}
        className="touch-target-min inline-flex items-center gap-2 rounded-lg bg-[#0067B9] px-3.5 py-2 text-xs font-bold text-white shadow-sm hover:bg-[#022853] transition focus:outline-none focus:ring-2 focus:ring-[#80D518]"
        aria-label="Instalar AsexIA Confia360 en el dispositivo móvil como aplicación nativa"
      >
        <Download className="w-4 h-4" />
        <span>Instalar App</span>
      </button>
    );
  }

  // iOS Safari flow
  if (isIOS) {
    return (
      <>
        <button
          onClick={() => setShowIOSGuide(true)}
          className="touch-target-min inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white/90 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
          aria-label="Ver instrucciones para instalar en iPhone o iPad"
        >
          <Smartphone className="w-3.5 h-3.5 text-[#0067B9]" />
          <span>Instalar en iOS</span>
        </button>

        {showIOSGuide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
            <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#022853] flex items-center justify-center text-white font-black text-lg">
                  A
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#022853]">Instalar AsexIA Confia360 en iOS</h3>
                  <p className="text-xs text-slate-500">Para uso offline en sala y cocina</p>
                </div>
              </div>
              <div className="mt-4 space-y-2.5 text-xs text-slate-700 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                <p>1. Pulsa el botón <strong>Compartir</strong> <span className="text-blue-600 font-bold">⎋</span> en la barra inferior de Safari.</p>
                <p>2. Desliza hacia abajo y pulsa <strong>Añadir a pantalla de inicio</strong>.</p>
                <p>3. Abre la app desde tu pantalla de inicio con soporte offline completo.</p>
              </div>
              <button
                onClick={() => setShowIOSGuide(false)}
                className="mt-5 w-full rounded-xl bg-[#022853] py-2.5 text-xs font-bold text-white hover:bg-[#0067B9] transition"
              >
                Entendido
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  // Ambient helper button on browser desktop/simulator
  return (
    <button
      onClick={() => alert('Para instalar AsexIA Confia360 en tu móvil o navegador, utiliza la opción "Instalar aplicación" desde el menú del navegador o accede desde un dispositivo móvil Android/iOS.')}
      className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white/70 px-2.5 py-1 text-xs font-medium text-slate-600 hover:bg-white transition"
      title="AsexIA Confia360 es una PWA compatible offline"
    >
      <Download className="w-3.5 h-3.5 text-[#0067B9]" />
      <span>PWA Lista</span>
    </button>
  );
};
