import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Settings, X, Sliders, Eye, Volume2, Smartphone, Sparkles, Check } from 'lucide-react';

export const BrandSettingsModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const { brandConfig, updateBrandConfig, announceAriaLive } = useApp();

  const [appName, setAppName] = useState(brandConfig.appName);
  const [tagline, setTagline] = useState(brandConfig.tagline);
  const [venueName, setVenueName] = useState(brandConfig.venueName);
  const [fontScale, setFontScale] = useState(brandConfig.fontScale);
  const [highContrast, setHighContrast] = useState(brandConfig.highContrast);
  const [hapticFeedback, setHapticFeedback] = useState(brandConfig.hapticFeedback);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateBrandConfig({
      appName,
      tagline,
      venueName,
      fontScale,
      highContrast,
      hapticFeedback,
    });
    announceAriaLive('Configuración de marca y accesibilidad guardada.');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs" role="dialog" aria-modal="true" aria-labelledby="brand-modal-title">
      <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl overflow-hidden border border-slate-200">
        
        {/* Header with Asexia branding styling */}
        <div className="bg-[#022853] p-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#0067B9] flex items-center justify-center">
              <Sliders className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 id="brand-modal-title" className="text-base font-bold font-brand">Configuración de Marca & Accesibilidad</h2>
              <p className="text-xs text-blue-200">Parámetros de branding ConfiA360 y directrices WCAG 2.2 AA</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition"
            aria-label="Cerrar modal de configuración"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSave} className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
          {/* Brand Name Parameterization (as requested by user) */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#0067B9] flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#80D518]" />
              Identidad Parametrizable (Branding Asexia)
            </h3>
            
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Nombre de la Aplicación (Parametrizable)
              </label>
              <input
                type="text"
                value={appName}
                onChange={(e) => setAppName(e.target.value)}
                className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm font-bold text-[#022853] focus:border-[#0067B9] focus:ring-2 focus:ring-[#0067B9]/20"
                placeholder="ConfiA360"
                required
              />
              <span className="text-[11px] text-slate-500 mt-1 block">
                Valor por defecto: <strong>ConfiA360</strong>. Permite adaptar para franquicias o marcas blancas.
              </span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Eslogan / Descriptor de Marca
              </label>
              <input
                type="text"
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-sm text-slate-800 focus:border-[#0067B9] focus:ring-2 focus:ring-[#0067B9]/20"
                placeholder="Tu negocio más seguro, digital y eficiente"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Nombre del Negocio / Restaurante / Local
              </label>
              <input
                type="text"
                value={venueName}
                onChange={(e) => setVenueName(e.target.value)}
                className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-sm text-slate-800 focus:border-[#0067B9] focus:ring-2 focus:ring-[#0067B9]/20"
                placeholder="Restaurante & Gastrobar Puerta del Sol"
              />
            </div>
          </div>

          <hr className="border-slate-200" />

          {/* WCAG 2.2 AA Accessibility section */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#022853] flex items-center gap-1.5">
              <Eye className="w-3.5 h-3.5 text-[#0067B9]" />
              Accesibilidad & Usabilidad en Cocinas/Terrazas (WCAG 2.2 AA)
            </h3>

            {/* Font scaling */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-semibold text-slate-700">
                  Escalado de Texto Dinámico ({Math.round(fontScale * 100)}%)
                </label>
                <span className="text-[11px] text-slate-500 font-mono">
                  {fontScale === 1.0 ? 'Estándar 100%' : fontScale === 1.25 ? 'Grande 125%' : fontScale === 1.5 ? 'Muy grande 150%' : 'Máximo 200%'}
                </span>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {[1.0, 1.25, 1.5, 2.0].map((scale) => (
                  <button
                    key={scale}
                    type="button"
                    onClick={() => setFontScale(scale)}
                    className={`py-2 text-xs font-bold rounded-xl border transition ${
                      fontScale === scale
                        ? 'bg-[#0067B9] text-white border-[#0067B9]'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {Math.round(scale * 100)}%
                  </button>
                ))}
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                Garantiza legibilidad a plena luz solar o bajo el calor de la cocina sin romper el layout.
              </p>
            </div>

            {/* High contrast switch */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200">
              <div>
                <span className="text-xs font-bold text-slate-800 block">Modo de Alto Contraste (Ratio &gt; 7:1)</span>
                <span className="text-[11px] text-slate-500">Refuerza bordes y oscurece fondos para visibilidad exterior extrema.</span>
              </div>
              <button
                type="button"
                onClick={() => setHighContrast(!highContrast)}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  highContrast ? 'bg-[#022853]' : 'bg-slate-300'
                }`}
                role="switch"
                aria-checked={highContrast}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                    highContrast ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Haptic tactile feedback switch */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200">
              <div>
                <span className="text-xs font-bold text-slate-800 block">Respuesta Táctil Háptica (Vibración)</span>
                <span className="text-[11px] text-slate-500">Vibración al pulsar fichaje o enviar gastos (ideal con ruido de sala).</span>
              </div>
              <button
                type="button"
                onClick={() => setHapticFeedback(!hapticFeedback)}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  hapticFeedback ? 'bg-[#48A222]' : 'bg-slate-300'
                }`}
                role="switch"
                aria-checked={hapticFeedback}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                    hapticFeedback ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Action buttons */}
          <div className="pt-2 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border border-slate-300 font-semibold text-xs text-slate-700 hover:bg-slate-100 transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 rounded-xl bg-[#022853] hover:bg-[#0067B9] font-bold text-xs text-white transition flex items-center justify-center gap-1.5 shadow-md"
            >
              <Check className="w-4 h-4 text-[#80D518]" />
              Guardar Cambios
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
