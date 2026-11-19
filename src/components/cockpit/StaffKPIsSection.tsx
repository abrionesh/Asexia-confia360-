import React from 'react';
import { StaffMetrics } from '../../types/cockpit';
import {
  Users,
  Clock,
  AlertCircle,
  CheckCircle2,
  TrendingDown,
  Calendar,
  Percent,
} from 'lucide-react';

export const StaffKPIsSection: React.FC<{ metrics: StaffMetrics }> = ({ metrics }) => {
  return (
    <div className="space-y-6">
      
      {/* 4 Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500">
            <span>Fichajes Correctos</span>
            <span className="text-emerald-700 font-extrabold bg-emerald-50 px-2 py-0.5 rounded-full">
              Legalidad OK
            </span>
          </div>
          <div className="text-3xl font-black font-brand text-[#48A222]">
            {metrics.fichajesCorrectosPct}%
          </div>
          <span className="text-[11px] text-slate-400 block pt-1 border-t">
            Sin conflicto de geolocalización
          </span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500">
            <span>% Coste Personal s/ Ventas</span>
            <span className="text-amber-700 font-extrabold bg-amber-50 px-2 py-0.5 rounded-full">
              Objetivo &lt;33%
            </span>
          </div>
          <div className="text-3xl font-black font-brand text-[#022853]">
            {metrics.costePersonalSobreVentasPct}%
          </div>
          <span className="text-[11px] text-slate-400 block pt-1 border-t">
            Ratio saludable hostelería
          </span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500">
            <span>Incidencias / Horas</span>
            <span className="text-rose-700 font-extrabold bg-rose-50 px-2 py-0.5 rounded-full">
              {metrics.fichajesPendientes} activas
            </span>
          </div>
          <div className="text-3xl font-black font-brand text-rose-600">
            {metrics.desviacionHoras}h
          </div>
          <span className="text-[11px] text-slate-400 block pt-1 border-t">
            Desviación sobre cuadrante
          </span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500">
            <span>Empleados en Turno</span>
            <span className="text-blue-700 font-extrabold bg-blue-50 px-2 py-0.5 rounded-full">
              {metrics.turnosPublicados} turnos
            </span>
          </div>
          <div className="text-3xl font-black font-brand text-[#0067B9]">
            {metrics.empleadosActivos}
          </div>
          <span className="text-[11px] text-slate-400 block pt-1 border-t">
            {metrics.turnosSinCubrir} turno pendiente de asignar
          </span>
        </div>
      </div>

      {/* Detail bar */}
      <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-4">
          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Horas Planificadas</span>
            <span className="font-bold text-slate-800 text-sm">{metrics.horasPlanificadas} h</span>
          </div>
          <span className="text-slate-300 font-bold">vs</span>
          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Horas Fichadas Reales</span>
            <span className="font-bold text-[#0067B9] text-sm">{metrics.horasFichadas} h</span>
          </div>
        </div>

        <div className="flex gap-2">
          <span className="px-2.5 py-1 rounded-xl bg-slate-100 text-slate-600 font-semibold">
            Llegadas tarde: <strong>{metrics.llegadasTarde}</strong>
          </span>
          <span className="px-2.5 py-1 rounded-xl bg-slate-100 text-slate-600 font-semibold">
            Pausas excedidas: <strong>{metrics.pausasExcedidas}</strong>
          </span>
          <span className="px-2.5 py-1 rounded-xl bg-blue-50 text-[#0067B9] font-bold">
            Sync pendiente: <strong>{metrics.fichajesPendientesSync}</strong>
          </span>
        </div>
      </div>
    </div>
  );
};
