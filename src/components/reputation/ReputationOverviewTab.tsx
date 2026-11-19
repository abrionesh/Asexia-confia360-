import React from 'react';
import {
  Star,
  TrendingUp,
  ShieldCheck,
  MessageSquare,
  Users,
  AlertTriangle,
  HeartHandshake,
  CheckCircle2,
  ArrowRight,
  Clock,
  Sparkles,
  PhoneCall,
} from 'lucide-react';
import {
  INITIAL_REPUTATION_KPIS,
  INITIAL_CUSTOMER_PROFILES,
} from '../../services/reputationData';

interface ReputationOverviewTabProps {
  onSwitchTab: (tabId: string) => void;
}

export const ReputationOverviewTab: React.FC<ReputationOverviewTabProps> = ({
  onSwitchTab,
}) => {
  const kpis = INITIAL_REPUTATION_KPIS;
  const customers = INITIAL_CUSTOMER_PROFILES;

  return (
    <div className="space-y-6">
      {/* Hero KPIs Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Rating Consolidado */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase tracking-wider text-slate-500">
              Rating Consolidado
            </span>
            <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center">
              <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl sm:text-4xl font-black font-brand text-slate-900">
              {kpis.ratingConsolidado}
            </span>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              +0.18 vs trimestre anterior
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-2">
            Promedio ponderado Google (4.8) · TripAdvisor (4.9) · TheFork (4.7)
          </p>
        </div>

        {/* KPI 2: Firewall de Intercepción */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase tracking-wider text-slate-500">
              Efectividad Firewall
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl sm:text-4xl font-black font-brand text-emerald-700">
              {kpis.intercepcionEfectividad}%
            </span>
            <span className="text-xs font-bold text-slate-600">contenidas</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-2">
            9 de cada 10 quejas (1–3★) resueltas en privado antes de llegar a Google Maps.
          </p>
        </div>

        {/* KPI 3: Tasa de Respuesta */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase tracking-wider text-slate-500">
              Tasa de Respuesta
            </span>
            <div className="w-8 h-8 rounded-lg bg-blue-100 text-[#0067B9] flex items-center justify-center">
              <MessageSquare className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl sm:text-4xl font-black font-brand text-slate-900">
              {kpis.tasaRespuesta}%
            </span>
            <span className="text-xs font-bold text-slate-500 font-mono">tiempo &lt;2h</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-2">
            148 reseñas totales en el mes con borrador asistido por IA.
          </p>
        </div>

        {/* KPI 4: NPS Hostelería */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase tracking-wider text-slate-500">
              Net Promoter Score (NPS)
            </span>
            <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center">
              <HeartHandshake className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl sm:text-4xl font-black font-brand text-purple-700">
              +{kpis.npsScore}
            </span>
            <span className="text-xs font-bold text-purple-800 bg-purple-50 px-2 py-0.5 rounded-full border border-purple-200">
              Nivel Excelencia
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-2">
            86% Promotores entusiastas · 9% Pasivos · 5% Detractores
          </p>
        </div>
      </div>

      {/* Grid: Desglose de Sentimiento & Radar de Causas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Sentiment Analysis Bar */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-brand font-bold text-slate-900 text-base">
              Distribución de Sentimiento Post-Visita
            </h4>
            <span className="text-xs font-mono text-slate-500">148 opiniones analizadas</span>
          </div>

          <div className="h-4 w-full rounded-full bg-slate-100 overflow-hidden flex">
            <div
              style={{ width: `${kpis.sentimientoDesglose.positivo}%` }}
              className="bg-[#80D518] transition-all"
              title={`Positivo: ${kpis.sentimientoDesglose.positivo}%`}
            />
            <div
              style={{ width: `${kpis.sentimientoDesglose.neutro}%` }}
              className="bg-amber-400 transition-all"
              title={`Neutro: ${kpis.sentimientoDesglose.neutro}%`}
            />
            <div
              style={{ width: `${kpis.sentimientoDesglose.critico}%` }}
              className="bg-[#E11D48] transition-all"
              title={`Crítico: ${kpis.sentimientoDesglose.critico}%`}
            />
          </div>

          <div className="grid grid-cols-3 gap-3 pt-2 text-center text-xs">
            <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-200">
              <span className="font-black text-emerald-800 text-lg block font-mono">
                {kpis.sentimientoDesglose.positivo}%
              </span>
              <span className="text-emerald-700 font-bold text-[11px]">Positivas (4–5★)</span>
              <p className="text-[10px] text-emerald-600 mt-0.5">Canalizadas a Google</p>
            </div>
            <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200">
              <span className="font-black text-amber-800 text-lg block font-mono">
                {kpis.sentimientoDesglose.neutro}%
              </span>
              <span className="text-amber-700 font-bold text-[11px]">Neutras (3★)</span>
              <p className="text-[10px] text-amber-600 mt-0.5">Seguimiento de carta</p>
            </div>
            <div className="p-3 rounded-xl bg-rose-50/70 border border-rose-200">
              <span className="font-black text-rose-800 text-lg block font-mono">
                {kpis.sentimientoDesglose.critico}%
              </span>
              <span className="text-rose-700 font-bold text-[11px]">Críticas (1–2★)</span>
              <p className="text-[10px] text-rose-600 mt-0.5">Intercepción privada</p>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-600">¿Quieres probar la encuesta interactiva?</span>
            <button
              onClick={() => onSwitchTab('feedback')}
              className="font-bold text-[#0067B9] hover:underline flex items-center gap-1"
            >
              Simular Encuesta WhatsApp <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Operational Radar / Breakdown */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-brand font-bold text-slate-900 text-base">
              Calidad Percibida por Áreas Operativas
            </h4>
            <span className="text-xs text-slate-500 font-mono">Objetivo &gt;90%</span>
          </div>

          <div className="space-y-3">
            {[
              { label: 'Servicio y Atención en Sala', value: kpis.radarCausas.servicioSala, target: 95 },
              { label: 'Cocina, Punto y Sabor', value: kpis.radarCausas.comidaCocina, target: 92 },
              { label: 'Tiempos de Espera y Pase', value: kpis.radarCausas.esperaTiempos, target: 84 },
              { label: 'Higiene, Limpieza y Baños', value: kpis.radarCausas.limpieza, target: 98 },
              { label: 'Relación Calidad / Precio', value: kpis.radarCausas.precioCalidad, target: 89 },
            ].map((item, i) => (
              <div key={i} className="space-y-1">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-slate-700">{item.label}</span>
                  <span className="font-mono text-slate-900">{item.value}%</span>
                </div>
                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div
                    style={{ width: `${item.value}%` }}
                    className={`h-full rounded-full ${
                      item.value >= 90 ? 'bg-[#0067B9]' : 'bg-amber-500'
                    }`}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-600">Alertas de tiempos de pase en cocina:</span>
            <button
              onClick={() => onSwitchTab('kds')}
              className="font-bold text-[#0067B9] hover:underline flex items-center gap-1"
            >
              Ver Tareas KDS Cocina <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* CRM Clientes en Riesgo vs Promotores Destacados */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h4 className="font-brand font-bold text-slate-900 text-base">
              Registro Único CRM: Clientes en Seguimiento
            </h4>
            <p className="text-xs text-slate-500">
              Conexión directa entre la valoración del comensal, su historial de visitas y el gasto acumulado.
            </p>
          </div>
          <span className="text-xs font-mono bg-slate-100 px-2.5 py-1 rounded-lg text-slate-700 self-start sm:self-auto font-bold">
            4 perfiles activos
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border border-slate-200 rounded-xl overflow-hidden">
            <thead className="bg-slate-50 text-slate-700 uppercase font-black tracking-wider text-[10px]">
              <tr>
                <th className="p-3">Cliente</th>
                <th className="p-3">Teléfono CRM</th>
                <th className="p-3">Estado Reputación</th>
                <th className="p-3">Última Nota</th>
                <th className="p-3">Visitas</th>
                <th className="p-3">Gasto Acumulado</th>
                <th className="p-3 text-right">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {customers.map((c) => (
                <tr key={c.clienteId} className="hover:bg-slate-50/70 transition-colors">
                  <td className="p-3 font-bold text-slate-900">{c.nombre}</td>
                  <td className="p-3 font-mono text-slate-600">{c.telefono}</td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                        c.etiqueta === 'promotor'
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                          : c.etiqueta === 'en_riesgo'
                          ? 'bg-rose-100 text-rose-800 border border-rose-200 animate-pulse'
                          : 'bg-blue-100 text-blue-800 border border-blue-200'
                      }`}
                    >
                      {c.etiqueta === 'en_riesgo' ? '⚠️ En Riesgo (Recuperar)' : c.etiqueta}
                    </span>
                  </td>
                  <td className="p-3 font-mono font-bold">
                    <span className="flex items-center gap-1 text-slate-800">
                      <Star className={`w-3.5 h-3.5 ${c.ultimaValoracion >= 4 ? 'fill-amber-400 text-amber-500' : 'fill-rose-400 text-rose-500'}`} />
                      {c.ultimaValoracion}★
                    </span>
                  </td>
                  <td className="p-3 font-mono text-slate-600">{c.totalVisitas} comidas</td>
                  <td className="p-3 font-mono font-bold text-slate-900">{c.gastoHistorico} €</td>
                  <td className="p-3 text-right">
                    {c.etiqueta === 'en_riesgo' ? (
                      <button
                        onClick={() => onSwitchTab('kds')}
                        className="text-[11px] font-black bg-rose-600 text-white px-2.5 py-1 rounded-lg hover:bg-rose-700 transition"
                      >
                        Gestionar Incidencia
                      </button>
                    ) : (
                      <button
                        onClick={() => onSwitchTab('marketing')}
                        className="text-[11px] font-bold text-[#0067B9] hover:underline"
                      >
                        Ver Reseña Destacada
                      </button>
                    )}
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
