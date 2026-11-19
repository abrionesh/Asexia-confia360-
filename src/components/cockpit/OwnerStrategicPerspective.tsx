import React from 'react';
import { StrategicKPIs, EconomicMetrics, CockpitAlert } from '../../types/cockpit';
import {
  TrendingUp,
  DollarSign,
  ShieldCheck,
  Award,
  Wallet,
  Sparkles,
  PieChart,
  Target,
  Clock,
  ArrowUpRight,
  AlertTriangle,
  Lightbulb,
} from 'lucide-react';

interface OwnerStrategicPerspectiveProps {
  strategicMetrics: StrategicKPIs;
  economicMetrics: EconomicMetrics;
  strategicAlerts: CockpitAlert[];
  onActionClick: (alert: CockpitAlert) => void;
}

export const OwnerStrategicPerspective: React.FC<OwnerStrategicPerspectiveProps> = ({
  strategicMetrics,
  economicMetrics,
  strategicAlerts,
  onActionClick,
}) => {
  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      
      {/* Banner de Presentación de Rol: Dueño */}
      <div className="bg-gradient-to-r from-[#022853] to-[#0067B9] text-white rounded-3xl p-6 sm:p-7 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#80D518] text-[#022853]">
                Vista C-Level / Propietario
              </span>
              <span className="text-xs text-blue-200">Horizonte: Trimestral & Anual</span>
            </div>
            <h3 className="text-2xl font-black font-brand">
              Radar Estratégico & Salud Global del Negocio
            </h3>
            <p className="text-xs text-blue-100 max-w-2xl leading-relaxed">
              Como dueño del restaurante, esta vista te ofrece el pulso real de tu empresa: rentabilidad neta, EBITDA, control de márgenes estructurales y proyección de tesorería sin perderte en el detalle micro.
            </p>
          </div>

          {/* Health Score Pill */}
          <div className="bg-white/10 backdrop-blur-xs border border-white/20 p-4 rounded-2xl flex items-center gap-4 self-start lg:self-auto">
            <div className="w-14 h-14 rounded-xl bg-[#80D518] text-[#022853] flex flex-col items-center justify-center font-black">
              <span className="text-xl leading-none">{strategicMetrics.healthScore}</span>
              <span className="text-[9px] uppercase tracking-tighter">/ 100</span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-blue-200 tracking-wider block">
                Índice de Salud Global
              </span>
              <span className="text-sm font-black text-white">Excelente Rendimiento</span>
              <span className="text-[10px] text-emerald-300 block">+3.4 pts vs trimestre ant.</span>
            </div>
          </div>
        </div>
      </div>

      {/* 4 Grandes Pilares de Dirección */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* 1. EBITDA Estimado y Margen */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-2 ring-2 ring-[#80D518]/20">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              EBITDA Estimado
            </span>
            <span className="text-xs font-black px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
              +{economicMetrics.resultadoVarPct}%
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-black font-brand text-[#022853]">
            {strategicMetrics.ebitdaEstimado.toLocaleString('es-ES', { minimumFractionDigits: 2 })} €
          </div>
          <div className="flex items-center justify-between text-xs text-slate-500 pt-1 border-t border-slate-100">
            <span>Margen sobre ventas:</span>
            <span className="font-black text-[#48A222]">{strategicMetrics.ebitdaMargenPct}%</span>
          </div>
        </div>

        {/* 2. Ratio de Personal (Labor Cost %) */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Labor Cost Ratio
            </span>
            <span className="text-xs font-black px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
              Benchmark 30-33%
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-black font-brand text-[#0067B9]">
            {strategicMetrics.laborCostRatio}%
          </div>
          <div className="flex items-center justify-between text-xs text-slate-500 pt-1 border-t border-slate-100">
            <span>Coste personal / ventas:</span>
            <span className="font-bold text-emerald-700">En rango óptimo</span>
          </div>
        </div>

        {/* 3. RevPASH & Ticket Medio */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              RevPASH / Silla·Hora
            </span>
            <span className="text-[10px] font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full">
              Eficiencia Sala
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-black font-brand text-[#022853]">
            {strategicMetrics.revPash.toLocaleString('es-ES', { minimumFractionDigits: 2 })} €
          </div>
          <div className="flex items-center justify-between text-xs text-slate-500 pt-1 border-t border-slate-100">
            <span>Ticket medio por pax:</span>
            <span className="font-black text-[#022853]">{strategicMetrics.ticketMedioGlobal} €</span>
          </div>
        </div>

        {/* 4. Runway de Tesorería */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Runway de Tesorería
            </span>
            <span className="text-xs font-black px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
              Solvente
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-black font-brand text-[#48A222]">
            {strategicMetrics.runwayCajaDias} Días
          </div>
          <div className="flex items-center justify-between text-xs text-slate-500 pt-1 border-t border-slate-100">
            <span>Previsión de caja 30d:</span>
            <span className="font-bold text-[#022853]">{economicMetrics.cajaPrevista30d.toLocaleString('es-ES')} €</span>
          </div>
        </div>
      </div>

      {/* Bloque de Comparativa de Presupuesto y Retorno de Inversión IA */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Cumplimiento de Presupuestos */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <Target className="w-5 h-5 text-[#0067B9]" />
              <h4 className="font-brand font-black text-base text-[#022853]">
                Control Presupuestario vs Objetivos de Negocio
              </h4>
            </div>
            <span className="text-xs text-slate-400">Año 2026 consolidado</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Ingresos vs Presupuesto */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-slate-600">Ingresos vs Objetivo</span>
                <span className="font-black text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  {strategicMetrics.cumplimientoPresupuestoIngresos}% de meta
                </span>
              </div>
              <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
                <div
                  className="bg-[#48A222] h-full rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(strategicMetrics.cumplimientoPresupuestoIngresos, 100)}%` }}
                />
              </div>
              <p className="text-[11px] text-slate-500">
                Superando la meta prevista en +8,2% gracias a la captación de reservas nocturnas.
              </p>
            </div>

            {/* Gastos vs Presupuesto */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-slate-600">Contención de Gastos</span>
                <span className="font-black text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
                  {strategicMetrics.cumplimientoPresupuestoGastos}% ejecutado
                </span>
              </div>
              <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
                <div
                  className="bg-[#0067B9] h-full rounded-full transition-all duration-500"
                  style={{ width: `${strategicMetrics.cumplimientoPresupuestoGastos}%` }}
                />
              </div>
              <p className="text-[11px] text-slate-500">
                Ahorro neto de -3,4% respecto al techo de gasto autorizado para el mes.
              </p>
            </div>
          </div>

          {/* Ratios de Costes F&B vs Personal */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
            <div className="p-3 bg-blue-50/50 rounded-xl border border-blue-100">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Food & Beverage Cost</span>
              <span className="text-lg font-black text-[#0067B9]">{strategicMetrics.foodBeverageCostRatio}%</span>
              <span className="text-[10px] text-slate-500 block">Objetivo: &lt; 30%</span>
            </div>
            <div className="p-3 bg-emerald-50/50 rounded-xl border border-emerald-100">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Labor Cost (Personal)</span>
              <span className="text-lg font-black text-[#48A222]">{strategicMetrics.laborCostRatio}%</span>
              <span className="text-[10px] text-slate-500 block">Objetivo: &lt; 33%</span>
            </div>
            <div className="p-3 bg-purple-50/50 rounded-xl border border-purple-100 col-span-2 sm:col-span-1">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Retención Clientes</span>
              <span className="text-lg font-black text-purple-800">{strategicMetrics.retencionClientesPct}%</span>
              <span className="text-[10px] text-slate-500 block">Fidelidad y repetición</span>
            </div>
          </div>
        </div>

        {/* ROI de Tecnología & Agentes IA */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <Sparkles className="w-5 h-5 text-[#80D518]" />
              <h4 className="font-brand font-black text-base text-[#022853]">
                Retorno de Inversión (ROI) en IA
              </h4>
            </div>

            <div className="mt-4 space-y-3">
              <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-50 to-blue-50 border border-emerald-200/80">
                <span className="text-[10px] uppercase font-bold text-slate-500 block">
                  Ahorro Operativo Directo
                </span>
                <div className="text-3xl font-black text-[#022853] mt-0.5">
                  +{strategicMetrics.retornoInversionIAMensual.toLocaleString('es-ES')} € <span className="text-xs font-semibold text-slate-500">/ mes</span>
                </div>
                <p className="text-[11px] text-slate-600 mt-2">
                  Calculado sobre 104 llamadas automatizadas por el Agente de Voz 24/7 y 22 facturas procesadas con OCR instantáneo.
                </p>
              </div>

              <div className="space-y-2 text-xs text-slate-600">
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span>Horas de recepción ahorradas:</span>
                  <strong className="text-slate-800">42 horas / mes</strong>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span>Horas contables de picado:</span>
                  <strong className="text-slate-800">18 horas / mes</strong>
                </div>
                <div className="flex justify-between py-1">
                  <span>Reservas recuperadas fuera de horario:</span>
                  <strong className="text-[#48A222]">+28 comensales</strong>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100">
            <span className="text-[11px] text-slate-400 block text-center">
              Tecnología 100% amortizada con impacto directo en margen
            </span>
          </div>
        </div>
      </div>

      {/* Alertas con Impacto Directo para el Dueño */}
      {strategicAlerts.length > 0 && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <AlertTriangle className="w-5 h-5 text-rose-600" />
            <h4 className="font-brand font-black text-base text-[#022853]">
              Alertas de Alto Impacto para la Propiedad
            </h4>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {strategicAlerts.map((alert) => (
              <div
                key={alert.id}
                className="p-4 rounded-2xl border border-rose-200 bg-rose-50/50 flex flex-col justify-between space-y-2"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-rose-700">{alert.title}</span>
                    {alert.financialImpact && (
                      <span className="text-xs font-black text-rose-800 bg-rose-100 px-2 py-0.5 rounded-full">
                        {alert.financialImpact}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-600 mt-1">{alert.description}</p>
                </div>

                <div className="pt-2 border-t border-rose-100 flex justify-end">
                  <button
                    onClick={() => onActionClick(alert)}
                    className="text-xs font-bold text-[#0067B9] hover:underline flex items-center gap-1"
                  >
                    <span>{alert.actionLabel}</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
