import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { SyncStatusIndicator } from './SyncQueueDrawer';
import {
  RefreshCw,
  Wifi,
  WifiOff,
  Clock,
  CheckCircle2,
  AlertCircle,
  Database,
  ArrowUpRight,
  PlusCircle,
  Trash2,
  ChevronDown,
  ChevronUp,
  Fingerprint,
  Receipt,
  PhoneCall,
  Users,
  ShieldAlert,
  Sparkles,
} from 'lucide-react';
import { SyncQueueItem } from '../types';
import { PositionalHelpBeacon } from './help/PositionalHelpBeacon';

export const SyncStatusMonitor: React.FC = () => {
  const {
    syncQueue,
    idbDrafts,
    idbPendingSubmissions,
    pendingSyncCount,
    isOnline,
    isSimulatedOffline,
    toggleSimulatedOffline,
    isSyncingNow,
    triggerManualSync,
    discardIdbDraft,
    clearResolvedQueue,
    announceAriaLive,
  } = useApp();

  const [filter, setFilter] = useState<'all' | 'pending' | 'synced' | 'conflict'>('pending');
  const [expandedItemId, setExpandedItemId] = useState<string | null>(null);

  // Filter tasks based on current tab
  const filteredTasks = syncQueue.filter((item) => {
    if (filter === 'pending') return item.status === 'pending_offline' || item.status === 'syncing';
    if (filter === 'synced') return item.status === 'synced';
    if (filter === 'conflict') return item.status === 'conflict';
    return true;
  });

  const syncedCount = syncQueue.filter((i) => i.status === 'synced').length;
  const conflictCount = syncQueue.filter((i) => i.status === 'conflict').length;

  const getModuleIcon = (module: string) => {
    switch (module) {
      case 'fichaje':
        return <Fingerprint className="w-4 h-4 text-[#0067B9]" />;
      case 'gastos':
        return <Receipt className="w-4 h-4 text-[#48A222]" />;
      case 'reservas':
        return <PhoneCall className="w-4 h-4 text-purple-600" />;
      case 'turnos':
        return <Users className="w-4 h-4 text-amber-600" />;
      default:
        return <Database className="w-4 h-4 text-slate-500" />;
    }
  };

  const getModuleLabel = (module: string) => {
    switch (module) {
      case 'fichaje':
        return 'Fichaje de Asistencia';
      case 'gastos':
        return 'Gasto / Ticket OCR';
      case 'reservas':
        return 'Reserva de Sala';
      case 'turnos':
        return 'Gestión de Turnos';
      default:
        return module.toUpperCase();
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner: Monitor Status & Connectivity */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-[#022853] text-[#80D518] flex items-center justify-center font-black shadow-sm">
                <Database className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-black font-brand text-[#022853]">
                Monitor de Sincronización PWA (SyncStatusMonitor)
              </h2>
              <PositionalHelpBeacon
                id="sync_monitor_beacon"
                category="Guardado Seguro"
                title="Envío y Protección de Datos"
                content="Supervisa las operaciones guardadas en el teléfono pendientes de enviarse a la central. Si no hay señal en cocina o bodega, nada se pierde; todo se envía automáticamente al recuperar la conexión."
                keyPoints={[
                  'Guardado permanente en el teléfono que no se pierde aunque cierres la app',
                  'Tú decides qué comanda o dato conservar si dos personas modifican lo mismo',
                  'Envío automático en segundo plano en cuanto vuelve el Wi-Fi',
                ]}
              />
            </div>
            <p className="text-xs text-slate-500 max-w-2xl">
              Supervisa en tiempo real las operaciones locales en cola, los reintentos automáticos y los eventos pendientes de envío al servidor central.
            </p>
          </div>

          {/* Quick Actions Toolbar */}
          <div className="flex flex-wrap items-center gap-2.5">
            
            {/* Online/Offline Toggle */}
            <button
              onClick={toggleSimulatedOffline}
              className={`touch-target-min inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold border transition ${
                isSimulatedOffline
                  ? 'bg-amber-500/15 text-amber-900 border-amber-300 hover:bg-amber-500/25'
                  : 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100'
              }`}
              title={isSimulatedOffline ? 'Reactivar conexión' : 'Simular cocina sin red'}
            >
              {isSimulatedOffline ? (
                <>
                  <WifiOff className="w-4 h-4 text-amber-600 animate-pulse" />
                  <span>Modo Offline Activo</span>
                </>
              ) : (
                <>
                  <Wifi className="w-4 h-4 text-[#48A222]" />
                  <span>Conectado a Central</span>
                </>
              )}
            </button>

            {/* Manual Sync Button */}
            <button
              onClick={triggerManualSync}
              disabled={isSyncingNow || !isOnline}
              className={`touch-target-min inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black transition shadow-sm ${
                isOnline
                  ? 'bg-[#0067B9] hover:bg-[#022853] text-white cursor-pointer active:scale-95'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed'
              }`}
            >
              <RefreshCw className={`w-4 h-4 ${isSyncingNow ? 'animate-sync-spin text-[#80D518]' : ''}`} />
              <span>{isSyncingNow ? 'Empujando Tareas...' : 'Sincronizar Ahora'}</span>
            </button>
          </div>
        </div>

        {/* Live Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t border-slate-100">
          
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
              Total en Cola Local
            </span>
            <div className="text-xl sm:text-2xl font-black text-[#022853] mt-0.5">
              {syncQueue.length}
            </div>
            <span className="text-[10px] text-slate-400">Transacciones persistidas</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-blue-50/60 border border-blue-200/80">
            <span className="text-[11px] font-bold text-[#0067B9] uppercase tracking-wider block">
              Pendientes de Envío
            </span>
            <div className="text-xl sm:text-2xl font-black text-[#0067B9] mt-0.5">
              {pendingSyncCount}
            </div>
            <span className="text-[10px] text-blue-700">Se subirán al volver online</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-emerald-50/60 border border-emerald-200/80">
            <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider block">
              Sincronizados
            </span>
            <div className="text-xl sm:text-2xl font-black text-[#48A222] mt-0.5">
              {syncedCount}
            </div>
            <span className="text-[10px] text-emerald-700">Conciliados con la nube</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-rose-50/60 border border-rose-200/80">
            <span className="text-[11px] font-bold text-rose-800 uppercase tracking-wider block">
              Conflictos
            </span>
            <div className="text-xl sm:text-2xl font-black text-rose-600 mt-0.5">
              {conflictCount}
            </div>
            <span className="text-[10px] text-rose-700">Requieren decisión manual</span>
          </div>
        </div>
      </div>

      {/* IndexedDB Operational Forms Persistence Summary */}
      {(idbPendingSubmissions.length > 0 || idbDrafts.length > 0) && (
        <div className="bg-white rounded-3xl border border-blue-200 p-5 shadow-xs space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Database className="w-4 h-4 text-[#0067B9]" />
              <h3 className="text-sm font-bold font-brand text-[#022853]">
                Formularios Persistidos en IndexedDB
              </h3>
            </div>
            <span className="text-xs text-slate-500">
              {idbPendingSubmissions.length} envíos pendientes · {idbDrafts.length} borradores activos
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            {idbPendingSubmissions.map((sub) => (
              <div key={sub.id} className="p-3 rounded-2xl border border-amber-200 bg-amber-50/50 flex items-center justify-between gap-2">
                <div>
                  <span className="font-bold text-[#022853] block uppercase">
                    Envío Offline · {getModuleLabel(sub.module)}
                  </span>
                  <span className="text-[11px] text-slate-500">
                    Capturado a las {new Date(sub.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} · Reintentos: {sub.retryCount}
                  </span>
                </div>
                <SyncStatusIndicator status={sub.status === 'syncing' ? 'syncing' : 'pending_offline'} />
              </div>
            ))}

            {idbDrafts.map((draft) => (
              <div key={draft.formId} className="p-3 rounded-2xl border border-slate-200 bg-slate-50 flex items-center justify-between gap-2">
                <div>
                  <span className="font-bold text-slate-800 block uppercase">
                    Borrador · {getModuleLabel(draft.module)}
                  </span>
                  <span className="text-[11px] text-slate-500">
                    Actualizado a las {new Date(draft.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => discardIdbDraft(draft.formId)}
                  className="px-2.5 py-1 rounded-lg bg-white border border-slate-300 hover:border-rose-300 hover:text-rose-700 font-semibold text-[11px] transition"
                >
                  Descartar
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Filter Tabs & Task List Card */}
      <div id="cola-transacciones" className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-5 scroll-mt-6">
        
        {/* Header Filter Strip */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div className="flex flex-wrap items-center gap-1.5">
            {[
              { id: 'pending', label: 'Pendientes por Enviar', count: pendingSyncCount },
              { id: 'all', label: 'Todas las Tareas', count: syncQueue.length },
              { id: 'synced', label: 'Sincronizadas', count: syncedCount },
              { id: 'conflict', label: 'Conflictos', count: conflictCount },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setFilter(tab.id as any)}
                className={`touch-target-min px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                  filter === tab.id
                    ? 'bg-[#022853] text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <span>{tab.label}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-black ${
                  filter === tab.id ? 'bg-[#80D518] text-[#022853]' : 'bg-white text-slate-700'
                }`}>
                  {tab.count}
                </span>
              </button>
            ))}
          </div>

          {syncedCount > 0 && (
            <button
              onClick={() => {
                clearResolvedQueue();
                announceAriaLive('Tareas sincronizadas eliminadas del registro local.');
              }}
              className="text-xs font-semibold text-slate-500 hover:text-rose-600 flex items-center gap-1 self-start sm:self-auto"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Limpiar completadas</span>
            </button>
          )}
        </div>

        {/* Task Cards List */}
        <div className="space-y-3">
          {filteredTasks.length === 0 ? (
            <div className="text-center py-14 px-4 space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-[#48A222] flex items-center justify-center mx-auto shadow-xs">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <div className="max-w-sm mx-auto">
                <h4 className="text-base font-bold text-[#022853] font-brand">
                  {filter === 'pending'
                    ? 'No hay tareas pendientes por empujar'
                    : 'No hay elementos en esta vista'}
                </h4>
                <p className="text-xs text-slate-500 mt-1">
                  {filter === 'pending'
                    ? 'Todas las acciones registradas en el dispositivo están sincronizadas con la base de datos central.'
                    : 'Prueba a cambiar el filtro para ver otras transacciones.'}
                </p>
              </div>
            </div>
          ) : (
            filteredTasks.map((task) => {
              const isExpanded = expandedItemId === task.id;
              return (
                <div
                  key={task.id}
                  className="rounded-2xl border border-slate-200/90 bg-slate-50/50 hover:bg-white hover:border-slate-300 transition-all p-4 space-y-3 shadow-2xs"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                    
                    {/* Module & Action title */}
                    <div className="flex items-start gap-3">
                      <div className="w-9 h-9 rounded-xl bg-white border border-slate-200 flex items-center justify-center shrink-0 shadow-2xs">
                        {getModuleIcon(task.module)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-brand font-black text-xs text-[#022853]">
                            {task.action.replace(/_/g, ' ')}
                          </span>
                          <span className="text-[10px] font-bold text-slate-500 bg-white px-2 py-0.5 rounded-full border border-slate-200">
                            {getModuleLabel(task.module)}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 text-[11px] text-slate-500 mt-0.5">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3 text-slate-400" />
                            {new Date(task.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                          </span>
                          <span>Reintentos: <strong>{task.retryCount}</strong></span>
                        </div>
                      </div>
                    </div>

                    {/* Status indicator & Expand toggle */}
                    <div className="flex items-center gap-2.5 self-end sm:self-center">
                      <SyncStatusIndicator status={task.status} />
                      <button
                        onClick={() => setExpandedItemId(isExpanded ? null : task.id)}
                        className="touch-target-min p-1.5 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 text-slate-600 transition"
                        aria-label={isExpanded ? 'Ocultar detalles técnicos' : 'Ver detalles técnicos'}
                      >
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Summary preview */}
                  <div className="text-xs text-slate-700 bg-white p-2.5 rounded-xl border border-slate-200/80 font-mono text-[11px] truncate">
                    {typeof task.data === 'object'
                      ? Object.entries(task.data)
                          .slice(0, 3)
                          .map(([k, v]) => `${k}: ${typeof v === 'object' ? JSON.stringify(v) : v}`)
                          .join(' · ')
                      : String(task.data)}
                  </div>

                  {/* Expandable JSON details */}
                  {isExpanded && (
                    <div className="pt-2 border-t border-slate-200/80 animate-in fade-in duration-150 space-y-2">
                      <div className="flex items-center justify-between text-[11px] text-slate-500 font-bold uppercase tracking-wider">
                        <span>Payload Completo (JSON Estructurado):</span>
                        <span>ID: {task.id}</span>
                      </div>
                      <pre className="p-3 rounded-xl bg-slate-900 text-emerald-400 font-mono text-[11px] overflow-x-auto shadow-inner max-h-48">
                        {JSON.stringify(task, null, 2)}
                      </pre>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
