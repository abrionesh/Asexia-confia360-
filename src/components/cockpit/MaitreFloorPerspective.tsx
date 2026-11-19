import React, { useState } from 'react';
import { MAITRE_FLOOR_DATA } from '../../services/cockpitData';
import { ReservationMetrics } from '../../types/cockpit';
import {
  ConciergeBell,
  CloudRain,
  Users,
  AlertTriangle,
  CheckCircle,
  PhoneCall,
  Clock,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Star,
  MapPin,
} from 'lucide-react';

interface MaitreFloorPerspectiveProps {
  reservationMetrics: ReservationMetrics;
}

export const MaitreFloorPerspective: React.FC<MaitreFloorPerspectiveProps> = ({
  reservationMetrics,
}) => {
  const { distribucionSalas, alertasOperativasMaitre, camarerosTurnoActual } = MAITRE_FLOOR_DATA;
  const [activePlanB, setActivePlanB] = useState(false);

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      
      {/* Banner de Presentación de Rol: Jefe de Sala */}
      <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-[#022853] text-white rounded-3xl p-6 sm:p-7 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-purple-300 text-purple-950">
                Vista Jefe de Sala / Maître
              </span>
              <span className="text-xs text-purple-200">Horizonte: Tiempo Real · Servicio en Vivo</span>
            </div>
            <h3 className="text-2xl font-black font-brand">
              Plano de Ocupación, Rotación de Mesas & Atención a Clientes
            </h3>
            <p className="text-xs text-purple-100 max-w-2xl leading-relaxed">
              Diseñado para el atril de sala o tablet táctil: estado de salones en directo, control de llegadas, incidencias meteorológicas de terraza y presencia del equipo de camareros por rangos.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-xs border border-white/20 p-4 rounded-2xl flex items-center gap-4 self-start lg:self-auto">
            <div className="w-14 h-14 rounded-xl bg-[#80D518] text-[#022853] flex flex-col items-center justify-center font-black">
              <span className="text-xl leading-none">{reservationMetrics.ocupacionEstimadaPct}%</span>
              <span className="text-[9px] uppercase tracking-tighter">Ocupación</span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-purple-200 tracking-wider block">
                Comensales de Hoy
              </span>
              <span className="text-sm font-black text-white">{reservationMetrics.totalPax} Pax Totales</span>
              <span className="text-[10px] text-emerald-300 block">124 ya sentados · 37 previstos</span>
            </div>
          </div>
        </div>
      </div>

      {/* Monitor de Salones y Zonas en Tiempo Real */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <ConciergeBell className="w-5 h-5 text-[#0067B9]" />
            <div>
              <h4 className="font-brand font-black text-base text-[#022853]">
                Estado de Salas y Capacidad en Directo
              </h4>
              <p className="text-xs text-slate-500">Capacidad total instalada: 175 comensales</p>
            </div>
          </div>
          <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
            En Directo
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {distribucionSalas.map((sala, idx) => {
            const pct = Math.round((sala.ocupadosPax / sala.capacidadPax) * 100);
            const isTerrazaRisk = sala.zona.includes('Terraza') && activePlanB;

            return (
              <div
                key={idx}
                className={`p-4 rounded-2xl border transition-all duration-200 space-y-2.5 ${
                  isTerrazaRisk
                    ? 'border-amber-400 bg-amber-50/70'
                    : 'border-slate-200 bg-slate-50/70'
                }`}
              >
                <div className="flex justify-between items-start">
                  <span className="font-brand font-bold text-xs text-slate-800">
                    {sala.zona}
                  </span>
                  <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-white border border-slate-200 text-slate-700">
                    {pct}% Ocupado
                  </span>
                </div>

                <div className="text-2xl font-black font-brand text-[#022853]">
                  {sala.ocupadosPax} <span className="text-xs font-normal text-slate-500">/ {sala.capacidadPax} pax</span>
                </div>

                <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      pct > 85 ? 'bg-rose-500' : pct > 65 ? 'bg-[#48A222]' : 'bg-[#0067B9]'
                    }`}
                    style={{ width: `${pct}%` }}
                  />
                </div>

                <div className="flex justify-between text-[11px] text-slate-600 pt-1 border-t border-slate-200/60">
                  <span>Mesas disponibles:</span>
                  <strong className="text-emerald-700 font-bold">{sala.mesasLibres} libres</strong>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Alertas Operativas Críticas de Sala (Lluvia Terraza, Fianza Grupo, VIP) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Alerta Lluvia Terraza */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4 ring-2 ring-blue-500/10">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <CloudRain className="w-5 h-5 text-blue-600" />
              <h4 className="font-brand font-black text-sm text-[#022853]">
                Alerta Meteorológica
              </h4>
            </div>
            <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
              Cena 21:00h
            </span>
          </div>

          <p className="text-xs text-slate-700 leading-relaxed font-medium">
            AEMET avisa de 85% precipitación. 18 reservas de Terraza en riesgo de no poder cenar en exterior.
          </p>

          <div className="p-3 bg-blue-50 rounded-2xl border border-blue-200 text-xs space-y-1.5 text-slate-700">
            <div className="font-bold text-[#022853]">Plan B Recomendado por IA:</div>
            <p className="text-[11px] text-slate-600">
              Reconfigurar mesas 12 y 15 de Salón para ganar 14 sillas interiores + adelantar 4 reservas a turno 20:00h.
            </p>
          </div>

          <button
            onClick={() => setActivePlanB(!activePlanB)}
            className={`w-full py-2.5 px-4 rounded-xl text-xs font-black transition flex items-center justify-center gap-2 ${
              activePlanB
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-[#0067B9] text-white hover:bg-blue-700'
            }`}
          >
            {activePlanB ? '✓ Plan B Activado en Atril' : 'Activar Plan B de Reubicación'}
          </button>
        </div>

        {/* Fianza Pendiente Grupo */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4 ring-2 ring-amber-500/10">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-600" />
              <h4 className="font-brand font-black text-sm text-[#022853]">
                Reserva Grupo en Riesgo
              </h4>
            </div>
            <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
              12 Pax
            </span>
          </div>

          <p className="text-xs text-slate-700 leading-relaxed font-medium">
            Reserva para mañana a las 14:30h sin fianza depositada tras aviso previo de 24 horas.
          </p>

          <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 text-xs space-y-1 text-slate-700">
            <div className="font-bold text-amber-900">Riesgo Financiero: 480,00 €</div>
            <p className="text-[11px] text-slate-600">
              Si es no-show en hora punta, la mesa 9 queda bloqueada.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <button className="py-2 px-3 rounded-xl border border-slate-300 font-bold text-slate-700 hover:bg-slate-50">
              Liberar Mesa
            </button>
            <button className="py-2 px-3 rounded-xl bg-amber-600 text-white font-bold hover:bg-amber-700">
              Llamar Cliente
            </button>
          </div>
        </div>

        {/* Atención VIP */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4 ring-2 ring-purple-500/10">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
              <h4 className="font-brand font-black text-sm text-[#022853]">
                Cliente VIP en Sala
              </h4>
            </div>
            <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-purple-100 text-purple-800">
              Mesa 3
            </span>
          </div>

          <p className="text-xs text-slate-700 leading-relaxed font-medium">
            Dr. Mendoza (Cliente habitual premium · Gasto medio &gt; 90 €/comensal).
          </p>

          <div className="p-3 bg-purple-50 rounded-2xl border border-purple-200 text-xs space-y-1 text-slate-700">
            <div className="font-bold text-purple-950">Preferencias Registradas:</div>
            <p className="text-[11px] text-slate-600">
              Mesa favorita junto a ventana. Agua sin gas templada y carta de vinos Ribera del Duero.
            </p>
          </div>

          <div className="text-xs text-emerald-800 font-bold bg-emerald-50 p-2 rounded-xl border border-emerald-200 text-center">
            ✓ Camarero Sofía notificada
          </div>
        </div>
      </div>

      {/* Control de Camareros por Rangos de Sala */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-[#0067B9]" />
            <h4 className="font-brand font-black text-base text-[#022853]">
              Personal de Sala en Turno (Asignación por Rangos)
            </h4>
          </div>
          <span className="text-xs text-slate-400">Turno de Mañana</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {camarerosTurnoActual.map((c, idx) => (
            <div
              key={idx}
              className={`p-4 rounded-2xl border space-y-2 ${
                c.estado === 'requiere_validacion'
                  ? 'border-rose-300 bg-rose-50/50'
                  : 'border-slate-200 bg-slate-50/60'
              }`}
            >
              <div className="flex justify-between items-center">
                <span className="font-brand font-black text-xs text-[#022853]">
                  {c.nombre}
                </span>
                <span
                  className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full ${
                    c.estado === 'requiere_validacion'
                      ? 'bg-rose-200 text-rose-900'
                      : 'bg-emerald-100 text-emerald-800'
                  }`}
                >
                  {c.estado === 'requiere_validacion' ? 'Conflicto' : 'Activo'}
                </span>
              </div>

              <div className="text-xs text-slate-600 font-medium">
                {c.rango}
              </div>

              <div className="text-[11px] text-slate-500 pt-1 border-t border-slate-200">
                Fichaje: <strong className="text-slate-800">{c.fichaje}</strong>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
