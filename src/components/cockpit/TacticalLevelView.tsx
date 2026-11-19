import React from 'react';
import {
  TacticalKPIs,
  ReservationMetrics,
  StaffMetrics,
  CockpitAlert,
  InformationDomain,
} from '../../types/cockpit';
import {
  Building2,
  Clock,
  PhoneCall,
  Users,
  AlertTriangle,
  Receipt,
  TrendingDown,
  TrendingUp,
  ArrowRight,
  ShieldCheck,
  CheckCircle,
} from 'lucide-react';

interface TacticalLevelViewProps {
  tacticalMetrics: TacticalKPIs;
  reservationMetrics: ReservationMetrics;
  staffMetrics: StaffMetrics;
  alerts: CockpitAlert[];
  selectedDomain: InformationDomain;
  onActionClick: (alert: CockpitAlert) => void;
}

export const TacticalLevelView: React.FC<TacticalLevelViewProps> = ({
  tacticalMetrics,
  reservationMetrics,
  staffMetrics,
  alerts,
  selectedDomain,
  onActionClick,
}) => {
  const tacticalAlerts = alerts.filter(
    (a) => a.level === 'tactico' || a.severity === 'yellow'
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      
      {/* Banner de Nivel Táctico */}
      <div className="bg-gradient-to-r from-[#0067B9] to-[#022853] text-white rounded-3xl p-6 sm:p-7 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-blue-300 text-blue-950">
                Nivel Táctico · Mandos Intermedios
              </span>
              <span className="text-xs text-blue-200">Horizonte: Semanal & Mensual</span>
            </div>
            <h3 className="text-2xl font-black font-brand">
              Control de Desviaciones, Locales & Planes de Acción
            </h3>
            <p className="text-xs text-blue-100 max-w-2xl leading-relaxed">
              Diseñado para Directores de Operaciones y Gerentes: monitoriza desvíos entre locales, productividad de plantilla, eficiencia de canales de reserva y control de compras para tomar decisiones correctivas oportunas.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-xs border border-white/20 p-4 rounded-2xl flex items-center gap-4 self-start lg:self-auto">
            <div className="w-14 h-14 rounded-xl bg-[#80D518] text-[#022853] flex flex-col items-center justify-center font-black">
              <span className="text-xl leading-none">2</span>
              <span className="text-[9px] uppercase tracking-tighter">Locales</span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-blue-200 tracking-wider block">
                Centros de Coste
              </span>
              <span className="text-sm font-black text-white">Consolidado Activo</span>
              <span className="text-[10px] text-emerald-300 block">Centro (86.4%) · Retiro (75.8%)</span>
            </div>
          </div>
        </div>
      </div>

      {/* 1. Desglose Comparativo entre Locales (Centro vs Retiro) */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-[#0067B9]" />
            <div>
              <h4 className="font-brand font-black text-base text-[#022853]">
                Comparativa de Rendimiento entre Locales
              </h4>
              <p className="text-xs text-slate-500">Rentabilidad, ocupación y control de costes por centro de coste</p>
            </div>
          </div>
          <span className="text-xs font-bold text-slate-400">Octubre 2026</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {tacticalMetrics.venues.map((v) => (
            <div
              key={v.venueId}
              className="p-5 rounded-2xl border border-slate-200 bg-slate-50/70 hover:bg-white hover:border-[#0067B9]/40 transition space-y-3"
            >
              <div className="flex justify-between items-start">
                <div>
                  <span className="font-brand font-black text-sm text-[#022853] block">
                    {v.venueName}
                  </span>
                  <span className="text-xs text-slate-500">
                    Ocupación media mensual: <strong className="text-slate-800">{v.ocupacionPct}%</strong>
                  </span>
                </div>
                <span className="text-xs font-black text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded-full">
                  Margen {v.margenPct}%
                </span>
              </div>

              {/* Métricas clave del local */}
              <div className="grid grid-cols-3 gap-2 py-2 border-y border-slate-200/80 text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase">Ingresos</span>
                  <span className="font-black text-[#022853]">{v.ingresos.toLocaleString('es-ES')} €</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase">Gastos</span>
                  <span className="font-black text-blue-700">{v.gastos.toLocaleString('es-ES')} €</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase">Desv. Personal</span>
                  <span className={`font-black ${v.desviacionHoras > 0 ? 'text-amber-700' : 'text-emerald-700'}`}>
                    +{v.desviacionHoras}h extra
                  </span>
                </div>
              </div>

              <div className="flex justify-between items-center text-[11px] text-slate-500">
                <span>Horas planificadas: {v.personalPlanificadoHoras}h · Reales: {v.personalHorasReales}h</span>
                <span className="text-amber-700 font-bold">{v.ticketsSinIva} tickets sin IVA</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 2. Control Táctico de Plantilla & Canales de Reserva */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Desviaciones de Plantilla y Productividad */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-amber-600" />
              <h4 className="font-brand font-black text-base text-[#022853]">
                Control de Horas & Productividad de Plantilla
              </h4>
            </div>
            <span className="text-xs font-black text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
              +{tacticalMetrics.desviacionHorasGlobal}h Desviación
            </span>
          </div>

          <div className="space-y-3">
            <div className="p-4 rounded-2xl bg-amber-50/50 border border-amber-200 space-y-1">
              <div className="flex justify-between items-center text-xs font-bold text-amber-950">
                <span>Horas Planificadas vs Horas Fichadas</span>
                <span>{staffMetrics.horasPlanificadas}h / {staffMetrics.horasFichadas}h</span>
              </div>
              <div className="w-full bg-amber-200/60 h-2 rounded-full overflow-hidden">
                <div className="bg-amber-600 h-full rounded-full" style={{ width: '98%' }} />
              </div>
              <p className="text-[11px] text-slate-600 pt-1">
                Sobrecoste estimado por horas extra no presupuestadas: <strong>{tacticalMetrics.costeHorasExtraEstimado} €</strong>.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-slate-500 block">Fichajes Correctos:</span>
                <strong className="text-emerald-700 text-sm font-black">{staffMetrics.fichajesCorrectosPct}%</strong>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-slate-500 block">Llegadas Tarde este mes:</span>
                <strong className="text-rose-700 text-sm font-black">{staffMetrics.llegadasTarde} incidencias</strong>
              </div>
            </div>
          </div>
        </div>

        {/* Eficiencia de Canales de Reserva & No-Shows */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <PhoneCall className="w-5 h-5 text-[#0067B9]" />
              <h4 className="font-brand font-black text-base text-[#022853]">
                Mix de Canales & Tasa de No-Shows
              </h4>
            </div>
            <span className="text-xs font-black text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
              {tacticalMetrics.tasaNoShowsPct}% No-Show
            </span>
          </div>

          <div className="space-y-2.5">
            {reservationMetrics.canales.map((canal, idx) => (
              <div key={idx} className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <div className="flex justify-between text-xs font-bold text-slate-800">
                  <span>{canal.canal}</span>
                  <span className="text-[#0067B9]">{canal.reservas} reservas ({canal.pct}%)</span>
                </div>
                <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-[#0067B9] h-full rounded-full"
                    style={{ width: `${canal.pct}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <p className="text-[11px] text-slate-500">
            El Agente de Voz 24/7 absorbe casi el 50% de las reservas totales, reduciendo el no-show al 4,7% gracias a la confirmación automática por WhatsApp.
          </p>
        </div>
      </div>

      {/* 3. Alertas Tácticas de Gestión */}
      {tacticalAlerts.length > 0 && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <AlertTriangle className="w-5 h-5 text-amber-500" />
            <h4 className="font-brand font-black text-base text-[#022853]">
              Alertas Tácticas de Operación & Compras
            </h4>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {tacticalAlerts.map((alert) => (
              <div
                key={alert.id}
                className="p-4 rounded-2xl border border-amber-200 bg-amber-50/50 flex flex-col justify-between space-y-2"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-amber-900">{alert.title}</span>
                    {alert.financialImpact && (
                      <span className="text-xs font-black text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full">
                        {alert.financialImpact}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-600 mt-1">{alert.description}</p>
                </div>

                <div className="pt-2 border-t border-amber-100 flex justify-end">
                  <button
                    onClick={() => onActionClick(alert)}
                    className="text-xs font-bold text-[#0067B9] hover:underline flex items-center gap-1"
                  >
                    <span>{alert.actionLabel}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
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
