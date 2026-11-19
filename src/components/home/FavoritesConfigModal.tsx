import React from 'react';
import { useApp } from '../../context/AppContext';
import { CONFIA_MODULES } from '../../data/confiaModules';
import { X, Check, Pin, Sparkles } from 'lucide-react';

interface FavoritesConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FavoritesConfigModal: React.FC<FavoritesConfigModalProps> = ({ isOpen, onClose }) => {
  const { pinnedDailyActions, togglePinDailyAction } = useApp();

  if (!isOpen) return null;

  // Potential quick daily actions to pin
  const candidateModules = CONFIA_MODULES.filter(
    (m) => m.category === 'dia_a_dia' || m.status === 'activo'
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-blue-50 text-[#0067B9]">
              <Pin className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">Personalizar "Tu día a día"</h3>
              <p className="text-xs text-slate-500">
                Selecciona los accesos rápidos y módulos favoritos que deseas ver en portada.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200/60 transition-colors"
            aria-label="Cerrar modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content list */}
        <div className="p-6 overflow-y-auto space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
            <span>Acciones disponibles ({candidateModules.length})</span>
            <span className="font-bold text-[#0067B9]">
              {pinnedDailyActions.length} anclados
            </span>
          </div>

          {candidateModules.map((item) => {
            const isPinned = pinnedDailyActions.includes(item.id);
            return (
              <div
                key={item.id}
                onClick={() => togglePinDailyAction(item.id)}
                className={`flex items-center justify-between p-3 rounded-2xl border cursor-pointer transition-all ${
                  isPinned
                    ? 'bg-blue-50/50 border-blue-200 shadow-xs'
                    : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/80'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xs ${
                      isPinned
                        ? 'bg-[#0067B9] text-white shadow-xs'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    <Pin className={`w-4 h-4 ${isPinned ? 'fill-current' : ''}`} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-800 text-sm">{item.name}</span>
                      {item.badgeText && (
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                          {item.badgeText}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 truncate max-w-[280px]">
                      {item.subtitle || item.description}
                    </p>
                  </div>
                </div>

                <div
                  className={`w-6 h-6 rounded-lg flex items-center justify-center border transition-all ${
                    isPinned
                      ? 'bg-[#80D518] border-[#80D518] text-slate-900 shadow-xs'
                      : 'border-slate-300 bg-white'
                  }`}
                >
                  {isPinned && <Check className="w-4 h-4 stroke-[3]" />}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-slate-100 bg-slate-50/70 flex items-center justify-between">
          <span className="text-xs text-slate-400">
            Se guarda automáticamente en tu navegador.
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-[#0067B9] hover:bg-[#022853] text-white text-xs font-bold transition-all shadow-sm"
          >
            Listo
          </button>
        </div>
      </div>
    </div>
  );
};
