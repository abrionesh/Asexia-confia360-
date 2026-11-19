import React, { useState } from 'react';
import {
  ChefHat,
  Users,
  Clock,
  AlertTriangle,
  CheckCircle2,
  ShieldAlert,
  ArrowRight,
  Filter,
  Check,
  Calendar,
  Lock,
  PlusCircle,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import {
  ReputationIncident,
  CorrectiveTask,
  IncidentArea,
} from '../../types/reputation';
import {
  INITIAL_INCIDENTS,
  INITIAL_CORRECTIVE_TASKS,
} from '../../services/reputationData';

export const OperationsKDSTab: React.FC = () => {
  const { announceAriaLive } = useApp();

  const [incidents, setIncidents] = useState<ReputationIncident[]>(INITIAL_INCIDENTS);
  const [tasks, setTasks] = useState<CorrectiveTask[]>(INITIAL_CORRECTIVE_TASKS);
  const [filterArea, setFilterArea] = useState<IncidentArea | 'todas'>('todas');
  const [selectedIncidentId, setSelectedIncidentId] = useState<string>(incidents[0]?.id || 'INC-401');

  const selectedIncident = incidents.find((i) => i.id === selectedIncidentId) || incidents[0];

  const handleToggleTaskStatus = (taskId: string) => {
    const updated = tasks.map((t) => {
      if (t.id === taskId) {
        const nextStatus =
          t.estado === 'pendiente'
            ? ('en_proceso' as const)
            : t.estado === 'en_proceso'
            ? ('completada' as const)
            : ('pendiente' as const);
        announceAriaLive(`Tarea ${t.titulo} cambiada a ${nextStatus}`);
        return { ...t, estado: nextStatus };
      }
      return t;
    });
    setTasks(updated);
  };

  const handleResolveIncident = (incidentId: string) => {
    const updated = incidents.map((i) =>
      i.id === incidentId
        ? {
            ...i,
            estado: 'resuelta' as const,
            resolucionTimestamp: 'Hoy, ' + new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
          }
        : i
    );
    setIncidents(updated);
    announceAriaLive(`Incidencia ${incidentId} marcada como resuelta`);
  };

  const filteredTasks =
    filterArea === 'todas' ? tasks : tasks.filter((t) => t.area === filterArea);

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-[#022853] to-slate-800 text-white p-5 rounded-2xl shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#80D518]/25 text-[#80D518] text-xs font-black uppercase tracking-wider border border-[#80D518]/40 mb-1">
            <ChefHat className="w-3.5 h-3.5" /> Fase 3: Operaciones & KDS
          </div>
          <h3 className="text-lg sm:text-xl font-brand font-black text-white">
            Tareas Correctivas de Calidad, Cocina y Sala
          </h3>
          <p className="text-xs text-slate-300 max-w-2xl mt-0.5">
            Las quejas de clientes no se quedan en un buzón: se transforman en tareas operativas asignadas al turno, partida y responsable para evitar que el fallo se repita.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {(['todas', 'cocina', 'sala', 'reparto'] as const).map((area) => (
            <button
              key={area}
              onClick={() => setFilterArea(area)}
              className={`touch-target-min text-xs font-bold px-3 py-1.5 rounded-xl capitalize transition-all border ${
                filterArea === area
                  ? 'bg-[#80D518] text-[#022853] border-[#80D518] font-black'
                  : 'bg-white/10 text-white border-white/20 hover:bg-white/20'
              }`}
            >
              {area}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN: INCIDENTS LOG (5 COLS) */}
        <div className="lg:col-span-5 space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-500 px-1 font-bold">
            <span>Incidencias Interceptadas ({incidents.length})</span>
            <span>Trazabilidad SHA-256</span>
          </div>

          <div className="space-y-3">
            {incidents.map((inc) => {
              const isSelected = inc.id === selectedIncidentId;
              return (
                <div
                  key={inc.id}
                  onClick={() => setSelectedIncidentId(inc.id)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-rose-50/40 border-rose-500 shadow-md ring-2 ring-rose-500/20'
                      : 'bg-white border-slate-200 hover:border-slate-300 shadow-2xs'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                          inc.gravedad === 'critica_alergeno'
                            ? 'bg-purple-100 text-purple-800 border border-purple-200 animate-pulse'
                            : inc.gravedad === 'alta'
                            ? 'bg-rose-100 text-rose-800 border border-rose-200'
                            : 'bg-amber-100 text-amber-800 border border-amber-200'
                        }`}
                      >
                        {inc.gravedad === 'critica_alergeno' ? 'ALÉRGENO CRÍTICO' : `Gravedad ${inc.gravedad}`}
                      </span>
                      <span className="font-mono text-xs text-slate-500">{inc.id}</span>
                    </div>

                    <span className="font-mono text-[10px] text-slate-400">{inc.timestamp}</span>
                  </div>

                  <h4 className="font-bold text-slate-900 text-sm mt-2">{inc.clienteNombre}</h4>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">{inc.descripcion}</p>

                  <div className="mt-3 flex items-center justify-between text-[11px] pt-2 border-t border-slate-100">
                    <div className="flex items-center gap-1.5 text-slate-500">
                      {inc.areaResponsable === 'cocina' ? (
                        <ChefHat className="w-3.5 h-3.5 text-[#0067B9]" />
                      ) : (
                        <Users className="w-3.5 h-3.5 text-amber-600" />
                      )}
                      <span className="font-bold capitalize">{inc.areaResponsable}</span>
                      <span>·</span>
                      <span className="truncate max-w-[140px]">{inc.turnoNombre}</span>
                    </div>

                    <div>
                      {inc.estado === 'resuelta' ? (
                        <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full text-[10px] font-bold border border-emerald-200">
                          <CheckCircle2 className="w-3 h-3" /> Resuelta
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full text-[10px] font-bold border border-rose-200">
                          <AlertTriangle className="w-3 h-3" /> En gestión
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* RIGHT COLUMN: DETAIL & DERIVED TASKS (7 COLS) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Incident Detail Card */}
          {selectedIncident && (
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center font-bold">
                    <AlertTriangle className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-brand font-bold text-slate-900 text-base">
                      Ficha de Incidencia: {selectedIncident.id}
                    </h4>
                    <span className="text-xs text-slate-500">
                      Afecta a: {selectedIncident.clienteNombre} ({selectedIncident.telefono}) · {selectedIncident.mesa || 'Sin mesa'}
                    </span>
                  </div>
                </div>

                {selectedIncident.estado !== 'resuelta' ? (
                  <button
                    onClick={() => handleResolveIncident(selectedIncident.id)}
                    className="touch-target-min text-xs font-black bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-xl flex items-center gap-1.5 shadow-xs transition"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" /> Marcar Resuelta
                  </button>
                ) : (
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-xl border border-emerald-200 flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" /> Cerrada {selectedIncident.resolucionTimestamp}
                  </span>
                )}
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-[10px] text-slate-400 font-bold block uppercase">Turno Operativo</span>
                  <span className="font-bold text-slate-800">{selectedIncident.turnoNombre}</span>
                </div>
                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-[10px] text-slate-400 font-bold block uppercase">Empleado Responsable</span>
                  <span className="font-bold text-slate-800">{selectedIncident.empleadoResponsable || 'No asignado'}</span>
                </div>
                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 col-span-2 sm:col-span-1">
                  <span className="text-[10px] text-slate-400 font-bold block uppercase">Área Operativa</span>
                  <span className="font-bold text-slate-800 capitalize">{selectedIncident.areaResponsable}</span>
                </div>
              </div>

              {selectedIncident.compensacionOfrecida && (
                <div className="p-3 bg-blue-50/70 rounded-xl border border-blue-200 text-xs text-blue-900">
                  <span className="font-bold block mb-0.5">Acción de recuperación del cliente:</span>
                  <p>{selectedIncident.compensacionOfrecida}</p>
                </div>
              )}

              <div className="text-[10px] font-mono text-slate-400 flex items-center gap-1 bg-slate-50 p-2 rounded-lg border border-slate-200/80">
                <Lock className="w-3 h-3 text-slate-400" />
                <span>Audit SHA-256: {selectedIncident.auditHash.slice(0, 32)}...</span>
              </div>
            </div>
          )}

          {/* Corrective Tasks List */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h4 className="font-brand font-bold text-slate-900 text-base">
                  Tareas Correctivas KDS & Turnos ({filteredTasks.length})
                </h4>
                <p className="text-xs text-slate-500">
                  Acciones concretas asignadas al equipo de cocina y sala para corregir el procedimiento.
                </p>
              </div>
            </div>

            <div className="space-y-2.5">
              {filteredTasks.map((tsk) => (
                <div
                  key={tsk.id}
                  className="p-3.5 rounded-xl border border-slate-200 bg-white hover:border-slate-300 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                          tsk.prioridad === 'urgente'
                            ? 'bg-rose-100 text-rose-800'
                            : tsk.prioridad === 'alta'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {tsk.prioridad}
                      </span>
                      <h5 className="font-bold text-slate-900 text-xs sm:text-sm">{tsk.titulo}</h5>
                    </div>
                    <p className="text-xs text-slate-600">{tsk.descripcion}</p>
                    <div className="flex items-center gap-3 text-[11px] text-slate-500 pt-0.5">
                      <span className="font-bold text-slate-700">Asignado: {tsk.responsable}</span>
                      <span>·</span>
                      <span className="font-mono text-slate-500">Límite: {tsk.fechaLimite}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleToggleTaskStatus(tsk.id)}
                    className={`touch-target-min text-xs font-bold px-3 py-1.5 rounded-xl border transition-all self-start sm:self-center shrink-0 flex items-center gap-1.5 ${
                      tsk.estado === 'completada'
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-300 font-black'
                        : tsk.estado === 'en_proceso'
                        ? 'bg-blue-50 text-[#0067B9] border-blue-300'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {tsk.estado === 'completada' ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Completada</span>
                      </>
                    ) : tsk.estado === 'en_proceso' ? (
                      <>
                        <Clock className="w-3.5 h-3.5 text-[#0067B9] animate-spin" />
                        <span>En Proceso</span>
                      </>
                    ) : (
                      <>
                        <span>Pendiente (Iniciar)</span>
                      </>
                    )}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
