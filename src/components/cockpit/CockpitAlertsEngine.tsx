import React, { useState } from 'react';
import { CockpitAlert, AlertSeverity, InformationLevel } from '../../types/cockpit';
import {
  AlertTriangle,
  AlertCircle,
  Lightbulb,
  ArrowRight,
  TrendingDown,
  ShieldCheck,
  CheckCircle,
  Layers,
} from 'lucide-react';

interface CockpitAlertsEngineProps {
  alerts: CockpitAlert[];
  onActionClick: (alert: CockpitAlert) => void;
}

export const CockpitAlertsEngine: React.FC<CockpitAlertsEngineProps> = ({ alerts, onActionClick }) => {
  const [activeSeverity, setActiveSeverity] = useState<'all' | AlertSeverity>('all');
  const [activeLevel, setActiveLevel] = useState<'all' | 'estrategico' | 'tactico' | 'operacional'>('all');

  const filtered = alerts.filter((a) => {
    const matchesSeverity = activeSeverity === 'all' || a.severity === activeSeverity;
    const matchesLevel = activeLevel === 'all' || a.level === activeLevel;
    return matchesSeverity && matchesLevel;
  });

  const redCount = alerts.filter((a) => a.severity === 'red').length;
  const yellowCount = alerts.filter((a) => a.severity === 'yellow').length;
  const blueCount = alerts.filter((a) => a.severity === 'blue').length;

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-rose-100 text-rose-700 flex items-center justify-center font-bold">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <h3 className="text-lg font-black font-brand text-[#022853]">
              Motor de Alertas Navegables (Metáfora Cabina de Avión)
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-1 max-w-xl">
            Ilumina los puntos críticos para toma de decisiones informadas. Toda alerta te traslada con 1 clic al origen del problema.
          </p>
        </div>

        {/* Severity Filters */}
        <div className="flex flex-wrap items-center gap-1.5 self-start sm:self-auto">
          <button
            onClick={() => setActiveSeverity('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
              activeSeverity === 'all'
                ? 'bg-[#022853] text-white shadow-2xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Todas ({alerts.length})
          </button>
          <button
            onClick={() => setActiveSeverity('red')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1 ${
              activeSeverity === 'red'
                ? 'bg-rose-600 text-white shadow-2xs'
                : 'bg-rose-50 text-rose-700 hover:bg-rose-100'
            }`}
          >
            <span>🔴 Críticas</span>
            <span className="font-mono text-[10px] bg-white/20 px-1 rounded-full">{redCount}</span>
          </button>
          <button
            onClick={() => setActiveSeverity('yellow')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1 ${
              activeSeverity === 'yellow'
                ? 'bg-amber-500 text-white shadow-2xs'
                : 'bg-amber-50 text-amber-800 hover:bg-amber-100'
            }`}
          >
            <span>🟡 Operativas</span>
            <span className="font-mono text-[10px] bg-white/20 px-1 rounded-full">{yellowCount}</span>
          </button>
          <button
            onClick={() => setActiveSeverity('blue')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1 ${
              activeSeverity === 'blue'
                ? 'bg-[#0067B9] text-white shadow-2xs'
                : 'bg-blue-50 text-blue-800 hover:bg-blue-100'
            }`}
          >
            <span>🔵 Oportunidad</span>
            <span className="font-mono text-[10px] bg-white/20 px-1 rounded-full">{blueCount}</span>
          </button>
        </div>
      </div>

      {/* Sub-filters by Level */}
      <div className="flex flex-wrap items-center gap-2 text-xs">
        <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">Filtrar por Nivel:</span>
        <button
          onClick={() => setActiveLevel('all')}
          className={`px-2.5 py-1 rounded-lg font-bold transition ${
            activeLevel === 'all' ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          Todos los Niveles
        </button>
        <button
          onClick={() => setActiveLevel('estrategico')}
          className={`px-2.5 py-1 rounded-lg font-bold transition ${
            activeLevel === 'estrategico' ? 'bg-[#0067B9] text-white' : 'bg-blue-50 text-[#0067B9] hover:bg-blue-100'
          }`}
        >
          Estratégico
        </button>
        <button
          onClick={() => setActiveLevel('tactico')}
          className={`px-2.5 py-1 rounded-lg font-bold transition ${
            activeLevel === 'tactico' ? 'bg-amber-600 text-white' : 'bg-amber-50 text-amber-800 hover:bg-amber-100'
          }`}
        >
          Táctico
        </button>
        <button
          onClick={() => setActiveLevel('operacional')}
          className={`px-2.5 py-1 rounded-lg font-bold transition ${
            activeLevel === 'operacional' ? 'bg-emerald-600 text-white' : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
          }`}
        >
          Operacional
        </button>
      </div>

      {/* Alerts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((alert) => {
          const isRed = alert.severity === 'red';
          const isYellow = alert.severity === 'yellow';
          const isBlue = alert.severity === 'blue';

          const cardStyle = isRed
            ? 'border-rose-300 bg-rose-50/50 hover:border-rose-400'
            : isYellow
            ? 'border-amber-300 bg-amber-50/50 hover:border-amber-400'
            : 'border-blue-300 bg-blue-50/50 hover:border-blue-400';

          const badgeStyle = isRed
            ? 'bg-rose-600 text-white'
            : isYellow
            ? 'bg-amber-500 text-white'
            : 'bg-[#0067B9] text-white';

          return (
            <div
              key={alert.id}
              className={`p-4 rounded-2xl border-2 transition-all shadow-2xs space-y-3 flex flex-col justify-between ${cardStyle}`}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-1 flex-wrap">
                  <div className="flex items-center gap-1.5">
                    <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full ${badgeStyle}`}>
                      {isRed ? '🔴 Alerta Crítica' : isYellow ? '🟡 Riesgo Operativo' : '🔵 Oportunidad'}
                    </span>
                    <span className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                      Nivel {alert.level.toUpperCase()}
                    </span>
                  </div>
                  <span className="text-[11px] font-semibold text-slate-400">{alert.createdAt}</span>
                </div>

                <h4 className="font-brand font-black text-xs sm:text-sm text-slate-900 leading-snug">
                  {alert.title}
                </h4>

                <p className="text-xs text-slate-600 leading-relaxed">
                  {alert.description}
                </p>

                {alert.financialImpact && (
                  <div className="inline-flex items-center gap-1.5 text-xs font-bold px-2 py-0.5 rounded-lg bg-white border border-slate-200 text-slate-800">
                    <TrendingDown className="w-3.5 h-3.5 text-rose-600" />
                    <span>Impacto: {alert.financialImpact}</span>
                  </div>
                )}
              </div>

              {/* Actionable Button Navigates directly to Problem Origin */}
              <button
                onClick={() => onActionClick(alert)}
                className={`touch-target-min w-full py-2.5 px-3 rounded-xl font-bold text-xs transition flex items-center justify-center gap-2 shadow-xs ${
                  isRed
                    ? 'bg-rose-600 hover:bg-rose-700 text-white'
                    : isYellow
                    ? 'bg-amber-600 hover:bg-amber-700 text-white'
                    : 'bg-[#0067B9] hover:bg-[#022853] text-white'
                }`}
              >
                <span>{alert.actionLabel}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
