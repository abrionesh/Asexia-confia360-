import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { RefreshCw, CheckCircle2, Clock, AlertTriangle, AlertCircle, X, ArrowRight, ShieldCheck } from 'lucide-react';
import { SyncStatus } from '../types';

export const SyncStatusIndicator: React.FC<{ status: SyncStatus; showLabel?: boolean }> = ({ status, showLabel = true }) => {
  switch (status) {
    case 'synced':
      return (
        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
          <span className="w-2 h-2 rounded-full bg-[#48A222]" />
          {showLabel && 'Sincronizado'}
        </span>
      );
    case 'syncing':
      return (
        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
          <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
          {showLabel && 'Sincronizando...'}
        </span>
      );
    case 'pending_offline':
      return (
        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
          <span className="w-2 h-2 rounded-full bg-[#0067B9]" />
          {showLabel && 'Pendiente offline'}
        </span>
      );
    case 'conflict':
      return (
        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
          <span className="w-2 h-2 rounded-full bg-rose-600 animate-pulse" />
          {showLabel && 'Conflicto'}
        </span>
      );
  }
};

export const SyncQueueDrawer: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const {
    syncQueue,
    syncConflicts,
    isOnline,
    isSyncingNow,
    triggerManualSync,
    resolveConflict,
    clearResolvedQueue,
    simulateConflictDemo,
    setActiveOperativaTab,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'queue' | 'conflicts'>('queue');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-xs transition-opacity" role="dialog" aria-modal="true" aria-labelledby="sync-drawer-title">
      <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-right duration-200">
        
        {/* Header */}
        <div className="p-4 bg-[#022853] text-white flex items-center justify-between border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#0067B9] flex items-center justify-center">
              <RefreshCw className={`w-4 h-4 text-white ${isSyncingNow ? 'animate-sync-spin' : ''}`} />
            </div>
            <div>
              <h2 id="sync-drawer-title" className="text-sm font-bold font-brand">Gestor de Cola Offline & Sincronización</h2>
              <p className="text-xs text-blue-200">
                {isOnline ? '🟢 En Línea (Sincronización activa)' : '🔵 Fuera de Línea (Cola local persistida)'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-white/10 text-white/80 hover:text-white transition touch-target-min"
            aria-label="Cerrar panel de cola de sincronización"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Status Banner */}
        <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex gap-2 text-xs">
            <button
              onClick={() => setActiveTab('queue')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition ${
                activeTab === 'queue'
                  ? 'bg-[#0067B9] text-white shadow-xs'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              Cola de Operaciones ({syncQueue.length})
            </button>
            <button
              onClick={() => setActiveTab('conflicts')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition flex items-center gap-1.5 ${
                activeTab === 'conflicts'
                  ? 'bg-rose-600 text-white shadow-xs'
                  : syncConflicts.length > 0
                  ? 'bg-rose-50 text-rose-700 border border-rose-200'
                  : 'bg-white text-slate-600 border border-slate-200'
              }`}
            >
              {syncConflicts.length > 0 && <span className="w-2 h-2 rounded-full bg-rose-600 animate-pulse" />}
              Conflictos ({syncConflicts.length})
            </button>
          </div>

          <button
            onClick={triggerManualSync}
            disabled={isSyncingNow || !isOnline}
            className={`touch-target-min inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg transition ${
              isOnline
                ? 'bg-[#48A222] text-white hover:bg-emerald-700 shadow-xs'
                : 'bg-slate-200 text-slate-400 cursor-not-allowed'
            }`}
            title={isOnline ? 'Forzar sincronización ahora' : 'Requiere conexión activa'}
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSyncingNow ? 'animate-sync-spin' : ''}`} />
            <span>{isSyncingNow ? 'Sincronizando...' : 'Sincronizar'}</span>
          </button>
        </div>

        {/* Content list */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {activeTab === 'queue' && (
            <>
              <div className="flex items-center justify-between text-xs text-slate-500 pb-1">
                <span>Registro cronológico de transacciones locales</span>
                {syncQueue.some(i => i.status === 'synced') && (
                  <button
                    onClick={clearResolvedQueue}
                    className="text-[#0067B9] hover:underline font-semibold"
                  >
                    Limpiar sincronizados
                  </button>
                )}
              </div>

              {syncQueue.length === 0 ? (
                <div className="text-center py-12 px-4">
                  <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-3">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <h4 className="text-sm font-bold text-slate-800">Cola al día</h4>
                  <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
                    No hay transacciones pendientes en local. Todos los fichajes, gastos y reservas están sincronizados con la central.
                  </p>
                </div>
              ) : (
                syncQueue.map((item) => (
                  <div
                    key={item.id}
                    className="p-3 rounded-xl border border-slate-200 bg-white hover:border-slate-300 transition shadow-xs space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                        {item.module}
                      </span>
                      <SyncStatusIndicator status={item.status} />
                    </div>

                    <div className="text-xs font-semibold text-slate-800">
                      {item.action.replace(/_/g, ' ')}
                    </div>

                    <div className="bg-slate-50 p-2 rounded-lg font-mono text-[11px] text-slate-600 overflow-x-auto">
                      {JSON.stringify(item.data, null, 1)}
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                      </span>
                      <span>Intentos: {item.retryCount}</span>
                    </div>
                  </div>
                ))
              )}
            </>
          )}

          {activeTab === 'conflicts' && (
            <>
              {syncConflicts.length === 0 ? (
                <div className="text-center py-12 px-4 space-y-3">
                  <div className="w-12 h-12 rounded-full bg-blue-100 text-[#0067B9] flex items-center justify-center mx-auto">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <h4 className="text-sm font-bold text-slate-800">Cero conflictos de concurrencia</h4>
                  <p className="text-xs text-slate-500 max-w-xs mx-auto">
                    Las transacciones offline han encajado limpiamente con los datos de central.
                  </p>
                  <button
                    onClick={simulateConflictDemo}
                    className="mt-2 inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
                  >
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                    Simular conflicto para prueba
                  </button>
                </div>
              ) : (
                syncConflicts.map((conflict) => (
                  <div
                    key={conflict.id}
                    className="p-3.5 rounded-xl border-2 border-rose-200 bg-rose-50/40 space-y-3"
                  >
                    <div className="flex items-start gap-2 text-rose-800">
                      <AlertCircle className="w-4 h-4 mt-0.5 shrink-0 text-rose-600" />
                      <div>
                        <h4 className="text-xs font-bold">Conflicto en Módulo: {conflict.module.toUpperCase()}</h4>
                        <p className="text-xs text-rose-700 mt-0.5">{conflict.reason}</p>
                      </div>
                    </div>

                    {/* Comparision */}
                    <div className="grid grid-cols-2 gap-2 text-[11px]">
                      <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                        <span className="font-bold text-[#0067B9] block mb-1">📱 Versión Local (Móvil)</span>
                        <pre className="text-slate-600 font-mono text-[10px] whitespace-pre-wrap">
                          {JSON.stringify(conflict.localData, null, 2)}
                        </pre>
                      </div>
                      <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                        <span className="font-bold text-[#022853] block mb-1">☁️ Versión Central (Servidor)</span>
                        <pre className="text-slate-600 font-mono text-[10px] whitespace-pre-wrap">
                          {JSON.stringify(conflict.serverData, null, 2)}
                        </pre>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 pt-1">
                      <button
                        onClick={() => resolveConflict(conflict.id, 'keep_local')}
                        className="flex-1 py-2 px-2.5 rounded-lg bg-[#0067B9] hover:bg-blue-700 text-white font-bold text-xs transition"
                      >
                        Mantener Local
                      </button>
                      <button
                        onClick={() => resolveConflict(conflict.id, 'accept_server')}
                        className="flex-1 py-2 px-2.5 rounded-lg bg-[#022853] hover:bg-slate-900 text-white font-bold text-xs transition"
                      >
                        Aceptar Servidor
                      </button>
                    </div>
                  </div>
                ))
              )}
            </>
          )}
        </div>

        {/* Footer info & Direct Monitor Link */}
        <div className="p-3 bg-slate-100 border-t border-slate-200 text-center space-y-2">
          <button
            onClick={() => {
              setActiveOperativaTab('monitor_sync');
              onClose();
            }}
            className="w-full py-2 px-3 rounded-xl bg-[#0067B9] hover:bg-[#022853] text-white font-bold text-xs transition flex items-center justify-center gap-1.5 shadow-xs"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-[#80D518]" />
            <span>Abrir Monitor Completo (SyncStatusMonitor)</span>
          </button>
          <p className="text-[11px] text-slate-500 font-medium">
            Regla de oro ConfiA360: Las operaciones offline nunca bloquean al empleado en sala ni en cocina.
          </p>
        </div>
      </div>
    </div>
  );
};
