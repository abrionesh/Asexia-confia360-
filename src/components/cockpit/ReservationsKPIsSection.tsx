import React from 'react';
import { ReservationMetrics } from '../../types/cockpit';
import {
  Calendar,
  Users,
  CheckCircle2,
  XCircle,
  Clock,
  PhoneCall,
  Sparkles,
  Percent,
} from 'lucide-react';

export const ReservationsKPIsSection: React.FC<{ metrics: ReservationMetrics }> = ({ metrics }) => {
  return (
    <div className="space-y-6">
      
      {/* 4 KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500">
            <span>Reservas Confirmadas</span>
            <span className="text-emerald-700 font-extrabold bg-emerald-50 px-2 py-0.5 rounded-full">
              {metrics.tasaConfirmacionPct}% conf.
            </span>
          </div>
          <div className="text-3xl font-black font-brand text-[#022853]">
            {metrics.confirmadas}
          </div>
          <span className="text-[11px] text-slate-400 block pt-1 border-t">
            {metrics.totalPax} comensales (pax total)
          </span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500">
            <span>Ocupación de Sala</span>
            <span className="text-blue-700 font-extrabold bg-blue-50 px-2 py-0.5 rounded-full">
              Capacidad
            </span>
          </div>
          <div className="text-3xl font-black font-brand text-[#0067B9]">
            {metrics.ocupacionEstimadaPct}%
          </div>
          <span className="text-[11px] text-slate-400 block pt-1 border-t">
            Comensales vs aforo disponible
          </span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500">
            <span>No-Shows (Incomparecencias)</span>
            <span className="text-rose-700 font-extrabold bg-rose-50 px-2 py-0.5 rounded-full">
              Tasa {metrics.tasaNoShowPct}%
            </span>
          </div>
          <div className="text-3xl font-black font-brand text-rose-600">
            {metrics.noShows}
          </div>
          <span className="text-[11px] text-slate-400 block pt-1 border-t">
            7 mesas perdidas sin fianza
          </span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500">
            <span>Conversión Voz 24/7</span>
            <span className="text-[#48A222] font-extrabold bg-emerald-50 px-2 py-0.5 rounded-full">
              IA NLU
            </span>
          </div>
          <div className="text-3xl font-black font-brand text-[#48A222]">
            {metrics.conversionVozPct}%
          </div>
          <span className="text-[11px] text-slate-400 block pt-1 border-t">
            Reservas cerradas por teléfono
          </span>
        </div>
      </div>

      {/* Canales de Reserva Breakdown */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
        <h4 className="font-brand font-bold text-sm text-[#022853]">
          Distribución de Reservas por Canal de Captación
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          {metrics.canales.map((c) => (
            <div key={c.canal} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="font-bold text-slate-700 block truncate">{c.canal}</span>
              <div className="text-lg font-black text-[#022853]">
                {c.reservas} <span className="text-xs font-normal text-slate-500">reservas</span>
              </div>
              <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                <div className="h-full bg-[#0067B9]" style={{ width: `${c.pct}%` }} />
              </div>
              <span className="text-[10px] text-slate-400">{c.pct}% del total</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
