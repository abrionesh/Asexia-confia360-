import React, { useState, useCallback } from 'react';
import { useApp } from '../../context/AppContext';
import { SyncStatusIndicator } from '../SyncQueueDrawer';
import { useIndexedDbFormState } from '../../hooks/useIndexedDbFormState';
import { MapPin, CheckCircle, Navigation, History, Clock, RefreshCw, X } from 'lucide-react';
import { PositionalHelpBeacon } from '../help/PositionalHelpBeacon';

interface PunchDraftState extends Record<string, unknown> {
  note: string;
  punchId?: string;
  punchType?: 'entrada' | 'salida' | 'pausa';
}

const INITIAL_PUNCH_DRAFT: PunchDraftState = {
  note: '',
};

export const ZeroTouchPunch: React.FC = () => {
  const { punches, recordPunch, isOnline, brandConfig, triggerManualSync } = useApp();
  const [loading, setLoading] = useState(false);
  const [lastActionSuccess, setLastActionSuccess] = useState<string | null>(null);

  const syncPendingPunch = useCallback(async () => {
    await triggerManualSync();
  }, [triggerManualSync]);

  const {
    formState: draft,
    updateField,
    hasRecoveredDraft,
    dismissRecoveredNotice,
    pendingSubmissionsCount,
    isSyncingPending,
    queueSubmission,
    flushPendingSubmissions,
    clearDraft,
  } = useIndexedDbFormState<PunchDraftState>({
    formId: 'operativa_fichaje_cero_toque',
    module: 'fichaje',
    initialState: INITIAL_PUNCH_DRAFT,
    isOnline,
    onSyncPending: syncPendingPunch,
    isDraftDirty: (state) => state.note.trim().length > 0,
  });

  // Check today's active punch state
  const latestPunch = punches[0];
  const isCurrentlyWorking = latestPunch && latestPunch.type === 'entrada';

  const handlePunch = async (type: 'entrada' | 'salida' | 'pausa') => {
    setLoading(true);
    setLastActionSuccess(null);
    try {
      const noteSnapshot = draft.note.trim();
      const res = await recordPunch(type);
      if (!isOnline) {
        await queueSubmission({
          note: noteSnapshot,
          punchId: res.punch.id,
          punchType: type,
        });
      } else if (noteSnapshot) {
        await clearDraft();
      }
      setLastActionSuccess(res.message);
      setTimeout(() => setLastActionSuccess(null), 4500);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Intro Card */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold font-brand text-[#022853]">Fichaje Inteligente "Cero Toque"</h2>
            <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-[#0067B9]/10 text-[#0067B9] border border-[#0067B9]/20">
              WCAG 2.2 AA
            </span>
            <PositionalHelpBeacon
              id="fichaje_intro"
              category="Control Horario del Personal"
              title="Fichaje Rápido en el Restaurante"
              content="Comprueba que el empleado está dentro del restaurante al fichar sin necesidad de instalar aparatos en la pared. Cumple con la normativa laboral de control horario para cocineros y camareros."
              keyPoints={[
                'Funciona sin internet: si falla el Wi-Fi en cocina, el fichaje se guarda en el teléfono',
                'Registra la hora y minuto exactos de entrada y salida',
                'Listado preparado para cualquier revisión oficial de inspección laboral',
              ]}
            />
          </div>
          <p className="text-xs text-slate-500 mt-1 max-w-xl">
            Un solo toque valida GPS en background contra el perímetro del restaurante ({brandConfig.venueName}). Sin pasos intermedios ni fricción en turnos apresurados.
          </p>
        </div>

        {/* GPS Sensor status badge */}
        <div className="flex items-center gap-2.5 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
          <div className="w-8 h-8 rounded-lg bg-[#48A222]/15 text-[#48A222] flex items-center justify-center">
            <Navigation className="w-4 h-4" />
          </div>
          <div className="text-xs">
            <span className="font-bold text-slate-700 block">GPS Activo en Fondo</span>
            <span className="text-slate-500 text-[11px]">Radio de tolerancia: 150m</span>
          </div>
        </div>
      </div>

      {/* IndexedDB Shift Note & Offline Backup Banner */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-2.5">
        <div className="flex flex-col sm:flex-row sm:items-center gap-2">
          <label htmlFor="fichaje-note-input" className="text-xs font-bold text-[#022853] whitespace-nowrap">
            Nota de turno / incidencia (persistida en IndexedDB):
          </label>
          <input
            id="fichaje-note-input"
            type="text"
            value={draft.note}
            onChange={(e) => updateField('note', e.target.value)}
            placeholder="Ej. Apertura de terraza, descarga de proveedor o cambio de turno..."
            className="flex-1 text-xs px-3 py-2 rounded-xl border border-slate-300 focus:border-[#0067B9] focus:ring-2 focus:ring-[#0067B9]/20"
          />
        </div>

        {(hasRecoveredDraft || pendingSubmissionsCount > 0) && (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
            {hasRecoveredDraft && (
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-blue-50 border border-blue-200 text-[#022853]">
                <Clock className="w-3.5 h-3.5 text-[#0067B9] shrink-0" />
                <span>Nota de fichaje recuperada desde IndexedDB.</span>
                <button
                  type="button"
                  onClick={() => clearDraft()}
                  className="font-bold text-rose-700 hover:underline"
                >
                  Limpiar
                </button>
                <button
                  type="button"
                  onClick={dismissRecoveredNotice}
                  className="text-slate-400 hover:text-slate-700"
                  aria-label="Ocultar aviso"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {pendingSubmissionsCount > 0 && (
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900">
                <RefreshCw className={`w-3.5 h-3.5 text-amber-700 shrink-0 ${isSyncingPending ? 'animate-spin' : ''}`} />
                <span>
                  <strong>{pendingSubmissionsCount}</strong>{' '}
                  {pendingSubmissionsCount === 1 ? 'fichaje pendiente' : 'fichajes pendientes'} en IndexedDB
                </span>
                {isOnline && !isSyncingPending && (
                  <button
                    type="button"
                    onClick={() => flushPendingSubmissions()}
                    className="px-2 py-0.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-bold text-[11px] transition"
                  >
                    Sincronizar
                  </button>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Success Notification Alert */}
      {lastActionSuccess && (
        <div className="p-4 rounded-xl bg-emerald-50 border-2 border-emerald-300 text-emerald-900 flex items-center justify-between animate-in fade-in duration-200 shadow-sm">
          <div className="flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-[#48A222] shrink-0" />
            <div className="text-xs font-semibold">
              <span className="font-bold">{lastActionSuccess}</span>
              <p className="text-[11px] text-emerald-700">Validación de perímetro completada sin fricción.</p>
            </div>
          </div>
          <span className="text-xs font-bold px-2 py-1 rounded bg-white text-[#48A222] border border-emerald-200">
            {isOnline ? '🟢 Sincronizado' : '🔵 En Cola Offline'}
          </span>
        </div>
      )}

      {/* Giant One-Touch Action Buttons (WCAG Minimum 48x48dp Touch Area) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* Entrada */}
        <button
          onClick={() => handlePunch('entrada')}
          disabled={loading || isCurrentlyWorking}
          className={`touch-target-min relative p-6 rounded-2xl text-left border-2 transition shadow-sm flex flex-col justify-between ${
            isCurrentlyWorking
              ? 'bg-slate-100 border-slate-200 opacity-60 cursor-not-allowed'
              : 'bg-white border-[#48A222] hover:bg-emerald-50/40 hover:shadow-md cursor-pointer'
          }`}
          aria-label="Fichar entrada de turno con validación GPS automática"
        >
          <div className="flex items-center justify-between">
            <div className="w-12 h-12 rounded-xl bg-[#48A222] text-white flex items-center justify-center font-black text-xl shadow-xs">
              ▶
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#48A222]">
              Inicio de Jornada
            </span>
          </div>
          <div className="mt-4">
            <h3 className="text-base font-black font-brand text-[#022853]">Fichar Entrada</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Tolerancia GPS 150m · Vibración táctil · Respaldo local
            </p>
          </div>
        </button>

        {/* Pausa */}
        <button
          onClick={() => handlePunch('pausa')}
          disabled={loading || !isCurrentlyWorking}
          className={`touch-target-min relative p-6 rounded-2xl text-left border-2 transition shadow-sm flex flex-col justify-between ${
            !isCurrentlyWorking
              ? 'bg-slate-100 border-slate-200 opacity-60 cursor-not-allowed'
              : 'bg-white border-amber-400 hover:bg-amber-50/40 hover:shadow-md cursor-pointer'
          }`}
          aria-label="Registrar pausa o descanso en turno"
        >
          <div className="flex items-center justify-between">
            <div className="w-12 h-12 rounded-xl bg-amber-500 text-white flex items-center justify-center font-black text-xl shadow-xs">
              ⏸
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-amber-600">
              Descanso / Comida
            </span>
          </div>
          <div className="mt-4">
            <h3 className="text-base font-black font-brand text-[#022853]">Registrar Pausa</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Pausa de descanso reglamentario de sala o cocina
            </p>
          </div>
        </button>

        {/* Salida */}
        <button
          onClick={() => handlePunch('salida')}
          disabled={loading || !isCurrentlyWorking}
          className={`touch-target-min relative p-6 rounded-2xl text-left border-2 transition shadow-sm flex flex-col justify-between ${
            !isCurrentlyWorking
              ? 'bg-slate-100 border-slate-200 opacity-60 cursor-not-allowed'
              : 'bg-white border-rose-500 hover:bg-rose-50/40 hover:shadow-md cursor-pointer'
          }`}
          aria-label="Fichar salida de jornada de trabajo"
        >
          <div className="flex items-center justify-between">
            <div className="w-12 h-12 rounded-xl bg-rose-600 text-white flex items-center justify-center font-black text-xl shadow-xs">
              ⏹
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-rose-600">
              Fin de Jornada
            </span>
          </div>
          <div className="mt-4">
            <h3 className="text-base font-black font-brand text-[#022853]">Fichar Salida</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Cierre de turno y cómputo de horas legal auditado
            </p>
          </div>
        </button>
      </div>

      {/* Punch History with Universal Visual States */}
      <div id="historial-fichajes" className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs scroll-mt-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <History className="w-4 h-4 text-[#0067B9]" />
            <h3 className="text-sm font-bold font-brand text-[#022853]">Historial de Fichajes Locales & Central</h3>
          </div>
          <span className="text-xs text-slate-500">
            Mostrando {punches.length} registros
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 bg-slate-50">
                <th className="py-2.5 px-3 font-semibold">Tipo</th>
                <th className="py-2.5 px-3 font-semibold">Empleado</th>
                <th className="py-2.5 px-3 font-semibold">Hora & Fecha</th>
                <th className="py-2.5 px-3 font-semibold">Geolocalización GPS</th>
                <th className="py-2.5 px-3 font-semibold text-right">Estado de Sync</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {punches.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50/60 transition">
                  <td className="py-3 px-3">
                    <span className={`inline-flex items-center gap-1.5 font-bold uppercase text-[10px] px-2 py-0.5 rounded-full ${
                      p.type === 'entrada'
                        ? 'bg-emerald-100 text-emerald-800'
                        : p.type === 'salida'
                        ? 'bg-rose-100 text-rose-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}>
                      {p.type}
                    </span>
                  </td>
                  <td className="py-3 px-3 font-bold text-slate-800">
                    {p.employeeName}
                  </td>
                  <td className="py-3 px-3 text-slate-600">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-400" />
                      <span>{new Date(p.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
                      <span className="text-slate-400 text-[10px]">({new Date(p.timestamp).toLocaleDateString()})</span>
                    </div>
                  </td>
                  <td className="py-3 px-3 text-slate-600">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3 h-3 text-[#0067B9]" />
                      <span>{p.venueDistanceMeters}m de centro</span>
                      <span className={`text-[10px] font-bold px-1.5 rounded ${
                        p.isWithinRadius ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
                      }`}>
                        {p.isWithinRadius ? '✓ Dentro de radio' : '⚠ Excedido'}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-3 text-right">
                    <SyncStatusIndicator status={p.syncStatus} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
