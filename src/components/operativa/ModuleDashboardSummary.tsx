import React from 'react';
import { useApp } from '../../context/AppContext';
import { USER_ROLES } from '../../types/userProfile';
import {
  OperativaKPIIconKey,
  OperativaModuleKPI,
  DailyPerformancePoint,
  OperationalThresholdAlert,
} from '../../types';
import {
  Clock,
  Receipt,
  UtensilsCrossed,
  Calendar,
  CreditCard,
  Zap,
  CheckCircle,
  AlertTriangle,
  Sparkles,
  MessageCircle,
  ShieldCheck,
  Building,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Mic,
  Users,
  Wifi,
  WifiOff,
  ArrowUpRight,
  Database,
  Info,
  LucideIcon,
} from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, Tooltip } from 'recharts';

interface CalculationTooltipProps {
  title: string;
  formula?: string;
  details: string;
  note?: string;
  align?: 'left' | 'right';
}

const CalculationTooltipPopover: React.FC<CalculationTooltipProps> = ({
  title,
  formula,
  details,
  note,
  align = 'right',
}) => (
  <span
    role="tooltip"
    className={`pointer-events-none opacity-0 invisible group-hover/tip:opacity-100 group-hover/tip:visible group-focus-within/tip:opacity-100 group-focus-within/tip:visible transition-all duration-150 absolute bottom-full mb-2 z-40 w-64 sm:w-72 rounded-xl bg-slate-950/98 border border-slate-700/90 p-2.5 shadow-2xl text-left font-normal normal-case tracking-normal ${
      align === 'right' ? 'right-0' : 'left-0'
    }`}
  >
    <span className="block text-[11px] font-bold text-indigo-300 mb-1">{title}</span>
    {formula && (
      <span className="block text-[10px] font-mono text-slate-300 bg-slate-900/90 border border-slate-800 rounded px-1.5 py-1 mb-1">
        {formula}
      </span>
    )}
    <span className="block text-[11px] text-slate-200 leading-snug">{details}</span>
    {note && <span className="block text-[10px] text-slate-400 mt-1 leading-snug">{note}</span>}
  </span>
);

const ThresholdAlertBadge: React.FC<{ alert: OperationalThresholdAlert; compact?: boolean }> = ({
  alert,
  compact = false,
}) => {
  const isCritical = alert.severity === 'critical';
  return (
    <span
      tabIndex={0}
      role="status"
      aria-label={alert.message}
      onClick={(e) => e.stopPropagation()}
      className={`relative group/tip cursor-help inline-flex items-center gap-1.5 rounded-md font-bold border animate-pulse focus:outline-none ${
        compact ? 'px-1.5 py-0.5 text-[10px]' : 'px-2 py-0.5 text-[10px]'
      } ${
        isCritical
          ? 'bg-rose-500/20 text-rose-200 border-rose-500/60 shadow-xs shadow-rose-500/20'
          : 'bg-amber-500/20 text-amber-200 border-amber-500/60 shadow-xs shadow-amber-500/20'
      }`}
    >
      <span className="relative flex h-2 w-2 shrink-0">
        <span
          className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
            isCritical ? 'bg-rose-400' : 'bg-amber-400'
          }`}
        />
        <span
          className={`relative inline-flex rounded-full h-2 w-2 ${
            isCritical ? 'bg-rose-500' : 'bg-amber-400'
          }`}
        />
      </span>
      <AlertTriangle className="w-3 h-3 shrink-0" />
      <span>{isCritical ? 'Crítico' : 'Bajo umbral'}</span>
      <CalculationTooltipPopover
        title={isCritical ? 'Alerta Crítica de Umbral' : 'Aviso de Umbral Operativo'}
        formula={`Actual: ${alert.currentValue}${alert.unit} · Umbral: ${alert.direction === 'min' ? '≥' : '≤'} ${alert.thresholdValue}${alert.unit}`}
        details={alert.message}
        align="right"
      />
    </span>
  );
};

interface SparklineTooltipProps {
  active?: boolean;
  payload?: Array<{ payload: DailyPerformancePoint }>;
  metric: 'ventas' | 'costeLaboral';
}

const SparklineTooltip: React.FC<SparklineTooltipProps> = ({ active, payload, metric }) => {
  if (!active || !payload || !payload.length) return null;
  const point = payload[0].payload;
  const value = metric === 'ventas' ? point.ventas : point.costeLaboral;
  return (
    <div className="bg-slate-950/95 border border-slate-700 rounded-lg px-2.5 py-1.5 shadow-lg text-[11px] text-slate-100">
      <div className="font-bold text-slate-300">
        {point.dayLabel} ({point.fullDate})
      </div>
      <div className={metric === 'ventas' ? 'font-bold text-emerald-400' : 'font-bold text-cyan-300'}>
        {value.toLocaleString('es-ES')} €
        {metric === 'costeLaboral' && (
          <span className="text-slate-400 font-normal ml-1.5">({point.laborRatioPct.toFixed(1)}%)</span>
        )}
      </div>
    </div>
  );
};

const KPI_ICON_MAP: Record<OperativaKPIIconKey, LucideIcon> = {
  users: Users,
  shield_check: ShieldCheck,
  clock: Clock,
  check_circle: CheckCircle,
  receipt: Receipt,
  alert_triangle: AlertTriangle,
  trending_up: TrendingUp,
  sparkles: Sparkles,
  utensils_crossed: UtensilsCrossed,
  mic: Mic,
  calendar: Calendar,
  credit_card: CreditCard,
  zap: Zap,
  wifi: Wifi,
  wifi_off: WifiOff,
};

export const ModuleDashboardSummary: React.FC = () => {
  const {
    activeOperativaTab,
    setActiveOperativaTab,
    activeRole,
    setActiveRole,
    punches,
    isOnline,
    isSyncingNow,
    triggerManualSync,
    getActiveModuleKPIs,
    monthlyPerformanceKPIs,
    operationalThresholds,
    idbDrafts,
    idbPendingSubmissions,
    openDrawer360,
    businessIdentity,
    setIsIdentityModalOpen,
    openVoiceAssistant,
    announceAriaLive,
    recordPunch,
  } = useApp();

  const currentRoleDef = USER_ROLES.find((r) => r.id === activeRole) || USER_ROLES[0];
  const metrics = getActiveModuleKPIs();
  const activeThresholdAlertsCount = metrics.filter((m) => Boolean(m.thresholdAlert)).length;
  const {
    ventas,
    costeLaboral,
    currentMonthLabel,
    previousMonthLabel,
    netMarginAfterLaborPct,
    dailySeries7d,
  } = monthlyPerformanceKPIs;

  const previousNetMarginPct = Number((100 - (costeLaboral.previousRatioPct ?? 34.2)).toFixed(1));
  const netMarginDeltaPts = Number((netMarginAfterLaborPct - previousNetMarginPct).toFixed(1));

  const formatEur = (amount: number) =>
    `${amount.toLocaleString('es-ES', { maximumFractionDigits: 0 })} €`;
  const formatPct = (val: number, suffix = '%') =>
    `${val > 0 ? '+' : ''}${val.toLocaleString('es-ES', { minimumFractionDigits: 1, maximumFractionDigits: 1 })}${suffix}`;

  const ventasTrendLabel = ventas.monthlyChangePct >= 0 ? 'Crecimiento' : 'Descenso';
  const laborSpendTrendLabel = costeLaboral.monthlyChangePct >= 0 ? 'Subida' : 'Descenso';
  const laborRatioDelta = costeLaboral.ratioDeltaPts ?? 0;

  const isSalesFocusedTab =
    activeOperativaTab === 'reservas_voz' ||
    activeOperativaTab === 'economico_alertas' ||
    activeOperativaTab === 'gastos';
  const isLaborFocusedTab =
    activeOperativaTab === 'fichaje' ||
    activeOperativaTab === 'rrhh_turnos' ||
    activeOperativaTab === 'economico_alertas';

  const modulePendingCount =
    activeOperativaTab === 'monitor_sync'
      ? idbPendingSubmissions.length
      : idbPendingSubmissions.filter((item) => item.module === activeOperativaTab).length;

  const moduleDraftsCount =
    activeOperativaTab === 'monitor_sync'
      ? idbDrafts.filter((d) => d.dirty).length
      : idbDrafts.filter((d) => d.module === activeOperativaTab && d.dirty).length;

  const scrollToSection = (elementId: string, announcement: string) => {
    const el = document.getElementById(elementId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    announceAriaLive(announcement);
  };

  const handleKpiClick = (kpi: OperativaModuleKPI) => {
    if (kpi.drawerHub) {
      openDrawer360(kpi.drawerHub);
      return;
    }
    if (kpi.targetElementId) {
      scrollToSection(kpi.targetElementId, `Navegando al detalle de ${kpi.label}`);
    }
  };

  // Module configuration based on activeOperativaTab
  const getModuleConfig = () => {
    switch (activeOperativaTab) {
      case 'fichaje':
        return {
          id: 'fichaje',
          badge: 'Módulo: Presencia & Fichaje',
          title: 'Cuadro de Mando: Presencia & Fichaje',
          subtitle: 'Control biométrico de jornada, puntualidad y personal activo en sala/cocina',
          icon: Clock,
          accentClass: 'text-[#0067B9]',
          actions: [
            {
              label: '⏱️ Fichar Entrada / Salida',
              onClick: () => {
                const latest = punches[0];
                const nextType = latest && latest.type === 'entrada' ? 'salida' : 'entrada';
                recordPunch(nextType);
              },
              primary: true,
            },
            {
              label: '📜 Historial de Registros',
              onClick: () => scrollToSection('historial-fichajes', 'Desplazado a historial de fichajes'),
            },
            {
              label: '🎙️ Decir: "Fichar jornada"',
              onClick: () => openVoiceAssistant(),
              voice: true,
            },
          ],
        };

      case 'gastos':
        return {
          id: 'gastos',
          badge: 'Módulo: Facturas & Gastos OCR',
          title: 'Cuadro de Mando: Facturas & Gastos OCR',
          subtitle: 'Captura en 3 pasos, auditoría de precios de materias primas y deducción fiscal',
          icon: Receipt,
          accentClass: 'text-[#80D518]',
          actions: [
            {
              label: '📷 Hacer Foto a Ticket',
              onClick: () => {
                const el = document.querySelector('input[type="file"]') as HTMLInputElement;
                if (el) el.click();
              },
              primary: true,
            },
            {
              label: '⚠️ Ver Alertas de Precios',
              onClick: () => scrollToSection('alertas-gastos', 'Desplazado a facturas y alertas de precios'),
            },
            {
              label: '🎙️ Decir: "Escanear ticket de gasto"',
              onClick: () => openVoiceAssistant(),
              voice: true,
            },
          ],
        };

      case 'reservas_voz':
        return {
          id: 'reservas_voz',
          badge: 'Módulo: Reservas de Sala & Agente 24/7',
          title: 'Cuadro de Mando: Recepción & Reservas',
          subtitle: 'Gestión inteligente de mesas, ocupación de comedor y agente de voz telefónico',
          icon: UtensilsCrossed,
          accentClass: 'text-[#D6A52A]',
          actions: [
            {
              label: '🍽️ Nueva Reserva de Mesa',
              onClick: () => scrollToSection('formulario-reserva', 'Desplazado al panel de atención de reservas'),
              primary: true,
            },
            {
              label: '📞 Llamar al Agente con Voz',
              onClick: () => openVoiceAssistant(),
            },
            {
              label: '🎙️ Decir: "Reservar mesa para 4"',
              onClick: () => openVoiceAssistant(),
              voice: true,
            },
          ],
        };

      case 'rrhh_turnos':
        return {
          id: 'rrhh_turnos',
          badge: 'Módulo: RRHH & Cuadrante de Turnos',
          title: 'Cuadro de Mando: RRHH & Turnos',
          subtitle: 'Planificación de turnos de cocina y sala, descansos y suplencias del restaurante',
          icon: Calendar,
          accentClass: 'text-[#48A222]',
          actions: [
            {
              label: '👥 Ver Cuadrante de Turnos',
              onClick: () => scrollToSection('nuevo-turno', 'Desplazado al cuadrante semanal de turnos'),
              primary: true,
            },
            {
              label: '📲 Enviar Cuadrante por WhatsApp',
              onClick: () => openVoiceAssistant(),
            },
            {
              label: '🎙️ Decir: "Ver turnos de cocina"',
              onClick: () => openVoiceAssistant(),
              voice: true,
            },
          ],
        };

      case 'economico_alertas':
        return {
          id: 'economico_alertas',
          badge: 'Módulo: Tesorería & Alertas Económicas',
          title: 'Cuadro de Mando: Tesorería & Bancos',
          subtitle: 'Liquidez en tiempo real, vencimientos de cobros/pagos y conciliación bancaria',
          icon: CreditCard,
          accentClass: 'text-sky-300',
          actions: [
            {
              label: '🏦 Bandeja de Conciliación',
              onClick: () => scrollToSection('conciliacion-bancaria', 'Desplazado a bandeja de conciliación gerencial'),
              primary: true,
            },
            {
              label: '📊 Resumen Económico & Desvíos',
              onClick: () => scrollToSection('prevision-liquidez', 'Desplazado a resumen económico y desvíos'),
            },
            {
              label: '🎙️ Decir: "Ver saldo de tesorería"',
              onClick: () => openVoiceAssistant(),
              voice: true,
            },
          ],
        };

      case 'monitor_sync':
      default:
        return {
          id: 'monitor_sync',
          badge: 'Módulo: Cola de Sincronización PWA',
          title: 'Cuadro de Mando: Monitor de Sincronización',
          subtitle: 'Persistencia offline-first, resolución de conflictos y cola de transacciones',
          icon: Zap,
          accentClass: 'text-[#0067B9]',
          actions: [
            {
              label: isSyncingNow ? '🔄 Sincronizando...' : '🔄 Sincronizar Ahora con Servidor',
              onClick: () => {
                if (!isOnline) {
                  announceAriaLive('Dispositivo sin conexión. Los cambios se enviarán automáticamente al volver internet.');
                  return;
                }
                triggerManualSync();
              },
              primary: true,
            },
            {
              label: '📦 Inspeccionar Datos Locales',
              onClick: () => scrollToSection('cola-transacciones', 'Desplazado a cola de transacciones locales'),
            },
            {
              label: '🎙️ Decir: "Estado de la cola sync"',
              onClick: () => openVoiceAssistant(),
              voice: true,
            },
          ],
        };
    }
  };

  const moduleConfig = getModuleConfig();
  const ModuleIcon = moduleConfig.icon;

  return (
    <div className="bg-gradient-to-br from-slate-900 via-slate-850 to-indigo-950/40 border border-slate-800 rounded-2xl shadow-xl p-4 sm:p-5 mb-5 text-slate-100 transition-all">
      {/* Module Dashboard Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pb-4 border-b border-slate-800/80">
        <div>
          {/* Metadata badges and identity */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider rounded-md bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 flex items-center gap-1.5">
              <ModuleIcon className={`w-3.5 h-3.5 ${moduleConfig.accentClass}`} />
              <span>{moduleConfig.badge}</span>
            </span>

            {/* Clickable Identity */}
            <button
              onClick={() => setIsIdentityModalOpen(true)}
              className="text-xs text-indigo-300 hover:text-white hover:underline transition-colors flex items-center gap-1 bg-slate-800/80 px-2 py-0.5 rounded-md border border-slate-700/60"
              title="Pulsar para consultar tus datos de empresa y NIF"
            >
              <Building className="w-3 h-3 text-indigo-400" />
              <span>{businessIdentity.companyName}</span>
              <span className="font-mono text-slate-400">({businessIdentity.cifNif})</span>
            </button>

            {/* WhatsApp Voice Assistant trigger */}
            <button
              onClick={() => openVoiceAssistant()}
              className="px-2 py-0.5 text-[11px] font-bold rounded-md bg-[#25D366]/20 text-emerald-300 hover:bg-[#25D366]/30 hover:text-white border border-[#25D366]/40 transition-colors flex items-center gap-1 shadow-xs"
              title="Abrir Asistente de Voz y Navegación WhatsApp 360"
            >
              <MessageCircle className="w-3 h-3 fill-current text-[#25D366]" />
              <span>Voz WhatsApp</span>
            </button>

            {/* Module-Scoped IndexedDB Offline Drafts / Pending Indicator */}
            {(modulePendingCount > 0 || moduleDraftsCount > 0) && (
              <button
                type="button"
                onClick={() => {
                  if (isOnline && modulePendingCount > 0) {
                    triggerManualSync();
                  } else {
                    setActiveOperativaTab('monitor_sync');
                  }
                }}
                className="px-2 py-0.5 text-[11px] font-bold rounded-md bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 border border-amber-400/40 transition-colors flex items-center gap-1"
                title={
                  isOnline && modulePendingCount > 0
                    ? 'Sincronizar envíos pendientes de este módulo'
                    : 'Ver borradores y cola offline en el Monitor de Sincronización'
                }
              >
                <Database className="w-3 h-3 text-amber-400" />
                <span>
                  {modulePendingCount > 0
                    ? `${modulePendingCount} pendiente(s) IndexedDB`
                    : `${moduleDraftsCount} borrador(es) offline`}
                </span>
              </button>
            )}
            {/* Module-Scoped Threshold Alert Summary Indicator */}
            {activeThresholdAlertsCount > 0 && (
              <span className="px-2 py-0.5 text-[11px] font-bold rounded-md bg-rose-500/20 text-rose-200 border border-rose-500/40 flex items-center gap-1.5 animate-pulse">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500" />
                </span>
                <span>
                  {activeThresholdAlertsCount} KPI{activeThresholdAlertsCount > 1 ? 's' : ''} en umbral
                </span>
              </span>
            )}
          </div>

          {/* Module Title and Subtitle */}
          <h2 className="text-lg sm:text-xl font-bold text-white mt-1.5 flex items-center gap-2 font-brand">
            <span>{moduleConfig.title}</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            {moduleConfig.subtitle} · <span className="text-indigo-300 font-medium">Foco {currentRoleDef.title}:</span>{' '}
            {currentRoleDef.primaryFocus}
          </p>
        </div>

        {/* Profile Context Switcher within this Module */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 no-scrollbar">
          <span className="text-[11px] text-slate-400 hidden xl:inline font-semibold mr-1">
            Perspectiva:
          </span>
          {USER_ROLES.map((r) => {
            const isActive = activeRole === r.id;
            return (
              <button
                key={r.id}
                onClick={() => {
                  setActiveRole(r.id);
                  announceAriaLive(`Perspectiva cambiada a ${r.title}`);
                }}
                className={`px-2.5 py-1.2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all border ${
                  isActive
                    ? 'bg-indigo-600 text-white border-indigo-500 shadow-md shadow-indigo-600/30 ring-1 ring-indigo-400/40'
                    : 'bg-slate-800/80 hover:bg-slate-750 text-slate-300 border-slate-700/60 hover:border-slate-600'
                }`}
                title={`Ver datos del módulo con rol ${r.title}`}
              >
                {r.badge}
              </button>
            );
          })}
        </div>
      </div>

      {/* Module-Specific Live Metrics Grid */}
      <div className="pt-4 space-y-4">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {metrics.map((m) => {
            const MetricIcon = KPI_ICON_MAP[m.iconKey] || ShieldCheck;
            const isClickable = Boolean(m.targetElementId || m.drawerHub);
            const alert = m.thresholdAlert;
            const cardAlertStyle = alert
              ? alert.severity === 'critical'
                ? 'bg-rose-950/35 border-rose-500/60 ring-1 ring-rose-500/30 shadow-md shadow-rose-950/30'
                : 'bg-amber-950/30 border-amber-500/60 ring-1 ring-amber-500/25 shadow-md shadow-amber-950/20'
              : m.isRolePriority
              ? 'bg-indigo-950/60 border-indigo-400/60 ring-1 ring-indigo-400/30 shadow-md'
              : 'bg-slate-800/50 border-slate-700/60';
            return (
              <button
                key={m.id}
                type="button"
                onClick={() => handleKpiClick(m)}
                disabled={!isClickable}
                className={`text-left rounded-xl p-3 transition-all flex flex-col justify-between border ${cardAlertStyle} ${
                  isClickable ? 'hover:bg-slate-800/80 hover:border-slate-500 cursor-pointer group' : 'cursor-default'
                }`}
                title={
                  alert
                    ? alert.message
                    : m.drawerHub
                    ? `Abrir vista transversal 360º para ${m.label}`
                    : m.targetElementId
                    ? `Ir a la sección de ${m.label}`
                    : m.label
                }
              >
                <div className="flex items-center justify-between gap-1 mb-1 w-full">
                  <span className="text-xs text-slate-300 block truncate font-medium">{m.label}</span>
                  <div className="flex items-center gap-1 shrink-0">
                    {m.isRolePriority && (
                      <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-indigo-500/30 text-indigo-200 border border-indigo-400/40">
                        Prioritario
                      </span>
                    )}
                    {m.calculationFormula && (
                      <span
                        tabIndex={0}
                        role="note"
                        aria-label={`Lógica de cálculo de ${m.label}: ${m.calculationFormula}`}
                        onClick={(e) => e.stopPropagation()}
                        className="relative inline-flex items-center text-slate-400 hover:text-indigo-300 focus:text-indigo-300 focus:outline-none cursor-help group/tip"
                      >
                        <Info className="w-3.5 h-3.5" />
                        <CalculationTooltipPopover
                          title={`Cálculo: ${m.label}`}
                          details={m.calculationFormula}
                          align="right"
                        />
                      </span>
                    )}
                    <MetricIcon className={`w-3.5 h-3.5 ${alert ? (alert.severity === 'critical' ? 'text-rose-400' : 'text-amber-400') : 'text-slate-400'}`} />
                  </div>
                </div>
                <div className="w-full">
                  <div className="flex items-baseline justify-between gap-1">
                    <span className={`text-lg sm:text-xl font-bold block ${m.highlight}`}>
                      {m.value}
                    </span>
                    <div className="flex items-center gap-1 shrink-0">
                      {alert && <ThresholdAlertBadge alert={alert} compact />}
                      {isClickable && (
                        <ArrowUpRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-indigo-300 transition-colors shrink-0" />
                      )}
                    </div>
                  </div>
                  <span className="text-[11px] text-slate-400 block mt-0.5 truncate">
                    {m.subtext}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Monthly Performance Comparison: Ventas vs Coste Laboral */}
        <div className="bg-slate-950/50 border border-slate-800 rounded-xl p-3.5 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-emerald-400 shrink-0" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">
                Comparativa de Rendimiento Mensual · Ventas y Coste Laboral
              </h3>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[11px] text-slate-400">
                {currentMonthLabel} vs. {previousMonthLabel}
              </span>
              {netMarginAfterLaborPct < operationalThresholds.minNetMarginAfterLaborPct && (
                <ThresholdAlertBadge
                  alert={{
                    metricKey: 'minNetMarginAfterLaborPct',
                    currentValue: netMarginAfterLaborPct,
                    thresholdValue: operationalThresholds.minNetMarginAfterLaborPct,
                    unit: '%',
                    direction: 'min',
                    severity: 'warning',
                    message: `Margen tras personal (${netMarginAfterLaborPct.toFixed(1)}%) por debajo del mínimo (${operationalThresholds.minNetMarginAfterLaborPct.toFixed(1)}%).`,
                  }}
                  compact
                />
              )}
              <span
                tabIndex={0}
                role="note"
                aria-label={`Cálculo margen tras personal: ${netMarginAfterLaborPct.toFixed(1)}% (${formatPct(netMarginDeltaPts, ' p.p.')})`}
                className={`relative group/tip cursor-help inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold border focus:outline-none ${
                  netMarginDeltaPts >= 0
                    ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                    : 'bg-amber-500/15 text-amber-300 border-amber-500/30'
                }`}
              >
                <span>
                  Margen tras personal: {netMarginAfterLaborPct.toFixed(1)}% ({formatPct(netMarginDeltaPts, ' p.p.')})
                </span>
                <Info className="w-3 h-3 opacity-80" />
                <CalculationTooltipPopover
                  title="Cálculo: Margen tras Personal"
                  formula="(100% − Ratio Laboral Actual) − (100% − Ratio Ant.)"
                  details={`${netMarginAfterLaborPct.toFixed(1)}% − ${previousNetMarginPct.toFixed(1)}% = ${formatPct(netMarginDeltaPts, ' p.p.')}`}
                  note={`Porcentaje de ventas disponible tras cubrir el coste laboral respecto a ${previousMonthLabel}.`}
                  align="right"
                />
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {/* Ventas Mensuales */}
            <button
              type="button"
              onClick={() => {
                setActiveOperativaTab('reservas_voz');
                announceAriaLive('Abriendo módulo de Reservas & Ventas');
              }}
              className={`text-left bg-slate-800/50 hover:bg-slate-800/80 border rounded-xl p-3 transition-all group ${
                ventas.thresholdAlert
                  ? 'border-rose-500/60 ring-1 ring-rose-500/30'
                  : isSalesFocusedTab
                  ? 'border-emerald-500/50 ring-1 ring-emerald-500/20'
                  : 'border-slate-700/60 hover:border-emerald-500/50'
              }`}
              title="Pulsar para consultar reservas e ingresos en tiempo real"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                  <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{ventas.label}</span>
                  {isSalesFocusedTab && (
                    <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      Foco módulo
                    </span>
                  )}
                  {ventas.thresholdAlert && <ThresholdAlertBadge alert={ventas.thresholdAlert} compact />}
                </span>
                <span
                  tabIndex={0}
                  role="note"
                  aria-label={`Lógica de crecimiento Ventas: ((${formatEur(ventas.currentAmount)} - ${formatEur(ventas.previousAmount)}) / ${formatEur(ventas.previousAmount)}) * 100 = ${formatPct(ventas.monthlyChangePct)}`}
                  onClick={(e) => e.stopPropagation()}
                  className={`relative group/tip cursor-help inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-bold border focus:outline-none ${
                    ventas.isFavorable
                      ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                      : 'bg-rose-500/15 text-rose-300 border-rose-500/30'
                  }`}
                >
                  {ventas.monthlyChangePct >= 0 ? (
                    <TrendingUp className="w-3 h-3" />
                  ) : (
                    <TrendingDown className="w-3 h-3" />
                  )}
                  <span>
                    {ventasTrendLabel} {formatPct(ventas.monthlyChangePct)} vs. {previousMonthLabel}
                  </span>
                  <Info className="w-3 h-3 opacity-80" />
                  <CalculationTooltipPopover
                    title="Fórmula: Crecimiento de Ventas"
                    formula="((Actual − Mes Ant.) / Mes Ant.) × 100"
                    details={`((${formatEur(ventas.currentAmount)} − ${formatEur(ventas.previousAmount)}) / ${formatEur(ventas.previousAmount)}) × 100 = ${formatPct(ventas.monthlyChangePct)}`}
                    note="Base mensual ajustada en vivo por reservas activas × ticket medio."
                    align="right"
                  />
                </span>
              </div>

              <div className="mt-2 flex items-baseline justify-between gap-2">
                <div>
                  <span className="text-lg sm:text-xl font-bold text-emerald-400">
                    {formatEur(ventas.currentAmount)}
                  </span>
                  <span className="text-[11px] text-slate-400 ml-2">
                    vs. {previousMonthLabel}: {formatEur(ventas.previousAmount)} ({formatPct(ventas.monthlyChangePct)})
                  </span>
                </div>
                <ArrowUpRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-emerald-300 transition-colors shrink-0" />
              </div>

              {/* 7-Day Daily Sales Sparkline (Recharts) */}
              <div className="mt-2.5 pt-2 border-t border-slate-700/40">
                <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1">
                  <span className="font-medium text-slate-300">Tendencia últimos 7 días (Ventas)</span>
                  <span>
                    {dailySeries7d[0]?.fullDate} → Hoy
                  </span>
                </div>
                <div className="h-14 w-full min-w-0">
                  <ResponsiveContainer width="100%" height={56} minWidth={0}>
                    <AreaChart data={dailySeries7d} margin={{ top: 4, right: 2, left: 2, bottom: 0 }}>
                      <defs>
                        <linearGradient id={`ventas-spark-${activeOperativaTab}`} x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10b981" stopOpacity={0.35} />
                          <stop offset="95%" stopColor="#10b981" stopOpacity={0.02} />
                        </linearGradient>
                      </defs>
                      <Tooltip
                        content={<SparklineTooltip metric="ventas" />}
                        cursor={{ stroke: '#334155', strokeWidth: 1 }}
                      />
                      <Area
                        type="monotone"
                        dataKey="ventas"
                        stroke="#10b981"
                        strokeWidth={2}
                        fill={`url(#ventas-spark-${activeOperativaTab})`}
                        dot={false}
                        activeDot={{ r: 3.5, fill: '#34d399', stroke: '#0f172a', strokeWidth: 1.5 }}
                        animationDuration={350}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Relative Comparison Bar */}
              <div className="mt-2 space-y-1">
                <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden">
                  <svg viewBox="0 0 100 6" preserveAspectRatio="none" className="w-full h-full block">
                    <rect
                      x="0"
                      y="0"
                      width={Math.min(
                        100,
                        Math.round(
                          (ventas.currentAmount / Math.max(ventas.currentAmount, ventas.previousAmount, 1)) * 100
                        )
                      )}
                      height="6"
                      rx="3"
                      className="fill-emerald-500 transition-all duration-300"
                    />
                  </svg>
                </div>
                <div className="flex items-center justify-between text-[10px] text-slate-400 gap-2">
                  <span className="truncate">{ventas.driverSummary}</span>
                  <span className="shrink-0 text-slate-300">{ventas.targetHint}</span>
                </div>
              </div>
            </button>

            {/* Coste Laboral Mensual */}
            <button
              type="button"
              onClick={() => {
                setActiveOperativaTab('rrhh_turnos');
                announceAriaLive('Abriendo módulo de RRHH y Cuadrante de Turnos');
              }}
              className={`text-left bg-slate-800/50 hover:bg-slate-800/80 border rounded-xl p-3 transition-all group ${
                costeLaboral.thresholdAlert
                  ? costeLaboral.thresholdAlert.severity === 'critical'
                    ? 'border-rose-500/60 ring-1 ring-rose-500/30'
                    : 'border-amber-500/60 ring-1 ring-amber-500/25'
                  : isLaborFocusedTab
                  ? 'border-cyan-500/50 ring-1 ring-cyan-500/20'
                  : 'border-slate-700/60 hover:border-cyan-500/50'
              }`}
              title="Pulsar para gestionar turnos y control de coste laboral"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-cyan-300" />
                  <span>{costeLaboral.label}</span>
                  {isLaborFocusedTab && (
                    <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-cyan-500/20 text-cyan-200 border border-cyan-500/30">
                      Foco módulo
                    </span>
                  )}
                  {costeLaboral.thresholdAlert && (
                    <ThresholdAlertBadge alert={costeLaboral.thresholdAlert} compact />
                  )}
                </span>
                <div className="flex flex-wrap items-center justify-end gap-1.5">
                  {typeof costeLaboral.ratioDeltaPts === 'number' && (
                    <span
                      tabIndex={0}
                      role="note"
                      aria-label={`Lógica variación ratio laboral: ${costeLaboral.ratioPct?.toFixed(1)}% - ${costeLaboral.previousRatioPct?.toFixed(1)}% = ${formatPct(laborRatioDelta, ' p.p.')}`}
                      onClick={(e) => e.stopPropagation()}
                      className={`relative group/tip cursor-help inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-bold border focus:outline-none ${
                        costeLaboral.isFavorable
                          ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                          : 'bg-amber-500/15 text-amber-300 border-amber-500/30'
                      }`}
                    >
                      {laborRatioDelta <= 0 ? (
                        <TrendingDown className="w-3 h-3" />
                      ) : (
                        <TrendingUp className="w-3 h-3" />
                      )}
                      <span>
                        {laborRatioDelta <= 0 ? 'Descenso' : 'Subida'} {formatPct(laborRatioDelta, ' p.p.')} ratio
                      </span>
                      <Info className="w-3 h-3 opacity-80" />
                      <CalculationTooltipPopover
                        title="Fórmula: Variación del Ratio Laboral"
                        formula={`(Coste / Ventas) − Ratio ${previousMonthLabel}`}
                        details={`${costeLaboral.ratioPct?.toFixed(1)}% − ${costeLaboral.previousRatioPct?.toFixed(1)}% = ${formatPct(laborRatioDelta, ' p.p.')}`}
                        note={`Ratio actual = (${formatEur(costeLaboral.currentAmount)} / ${formatEur(ventas.currentAmount)}) × 100.`}
                        align="right"
                      />
                    </span>
                  )}
                  <span
                    tabIndex={0}
                    role="note"
                    aria-label={`Lógica variación Coste Laboral: ((${formatEur(costeLaboral.currentAmount)} - ${formatEur(costeLaboral.previousAmount)}) / ${formatEur(costeLaboral.previousAmount)}) * 100 = ${formatPct(costeLaboral.monthlyChangePct)}`}
                    onClick={(e) => e.stopPropagation()}
                    className={`relative group/tip cursor-help inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-bold border focus:outline-none ${
                      costeLaboral.monthlyChangePct <= ventas.monthlyChangePct
                        ? 'bg-cyan-500/15 text-cyan-200 border-cyan-500/30'
                        : 'bg-amber-500/15 text-amber-300 border-amber-500/30'
                    }`}
                  >
                    <span>
                      {laborSpendTrendLabel} {formatPct(costeLaboral.monthlyChangePct)} vs. {previousMonthLabel}
                    </span>
                    <Info className="w-3 h-3 opacity-80" />
                    <CalculationTooltipPopover
                      title="Fórmula: Variación Coste Laboral"
                      formula="((Coste Actual − Coste Ant.) / Coste Ant.) × 100"
                      details={`((${formatEur(costeLaboral.currentAmount)} − ${formatEur(costeLaboral.previousAmount)}) / ${formatEur(costeLaboral.previousAmount)}) × 100 = ${formatPct(costeLaboral.monthlyChangePct)}`}
                      note="Incluye horas de turnos confirmados, fichajes activos y gastos de nómina."
                      align="right"
                    />
                  </span>
                </div>
              </div>

              <div className="mt-2 flex items-baseline justify-between gap-2">
                <div>
                  <span className="text-lg sm:text-xl font-bold text-cyan-300">
                    {costeLaboral.ratioPct?.toFixed(1)}% s/ ventas
                  </span>
                  <span className="text-[11px] text-slate-400 ml-2">
                    ({formatEur(costeLaboral.currentAmount)} vs. {previousMonthLabel}: {formatEur(costeLaboral.previousAmount)} · {formatPct(costeLaboral.monthlyChangePct)})
                  </span>
                </div>
                <ArrowUpRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-cyan-300 transition-colors shrink-0" />
              </div>

              {/* 7-Day Daily Labor Cost Sparkline (Recharts) */}
              <div className="mt-2.5 pt-2 border-t border-slate-700/40">
                <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1">
                  <span className="font-medium text-slate-300">Tendencia últimos 7 días (Coste Laboral)</span>
                  <span>
                    {dailySeries7d[0]?.fullDate} → Hoy
                  </span>
                </div>
                <div className="h-14 w-full min-w-0">
                  <ResponsiveContainer width="100%" height={56} minWidth={0}>
                    <AreaChart data={dailySeries7d} margin={{ top: 4, right: 2, left: 2, bottom: 0 }}>
                      <defs>
                        <linearGradient id={`labor-spark-${activeOperativaTab}`} x1="0" y1="0" x2="0" y2="1">
                          <stop
                            offset="5%"
                            stopColor={(costeLaboral.ratioPct || 0) <= 35 ? '#22d3ee' : '#fbbf24'}
                            stopOpacity={0.35}
                          />
                          <stop
                            offset="95%"
                            stopColor={(costeLaboral.ratioPct || 0) <= 35 ? '#22d3ee' : '#fbbf24'}
                            stopOpacity={0.02}
                          />
                        </linearGradient>
                      </defs>
                      <Tooltip
                        content={<SparklineTooltip metric="costeLaboral" />}
                        cursor={{ stroke: '#334155', strokeWidth: 1 }}
                      />
                      <Area
                        type="monotone"
                        dataKey="costeLaboral"
                        stroke={(costeLaboral.ratioPct || 0) <= 35 ? '#22d3ee' : '#fbbf24'}
                        strokeWidth={2}
                        fill={`url(#labor-spark-${activeOperativaTab})`}
                        dot={false}
                        activeDot={{
                          r: 3.5,
                          fill: (costeLaboral.ratioPct || 0) <= 35 ? '#67e8f9' : '#fcd34d',
                          stroke: '#0f172a',
                          strokeWidth: 1.5,
                        }}
                        animationDuration={350}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Labor Cost Ratio Progress vs 35% Benchmark */}
              <div className="mt-2 space-y-1">
                <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden">
                  <svg viewBox="0 0 100 6" preserveAspectRatio="none" className="w-full h-full block">
                    <rect
                      x="0"
                      y="0"
                      width={Math.min(100, Math.round(((costeLaboral.ratioPct || 0) / 50) * 100))}
                      height="6"
                      rx="3"
                      className={`transition-all duration-300 ${
                        (costeLaboral.ratioPct || 0) <= 35 ? 'fill-cyan-400' : 'fill-amber-400'
                      }`}
                    />
                  </svg>
                </div>
                <div className="flex items-center justify-between text-[10px] text-slate-400 gap-2">
                  <span className="truncate">{costeLaboral.driverSummary}</span>
                  <span className="shrink-0 text-slate-300">{costeLaboral.targetHint}</span>
                </div>
              </div>
            </button>
          </div>
        </div>

        {/* Module-Specific Direct Actions & Voice Triggers */}
        <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-slate-800/60">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mr-1 hidden sm:inline">
            Acciones Rápidas:
          </span>
          {moduleConfig.actions.map((act, idx) => (
            <button
              key={idx}
              onClick={act.onClick}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all shadow-xs ${
                act.primary
                  ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/30'
                  : act.voice
                  ? 'bg-[#075e54]/80 hover:bg-[#128c7e] text-emerald-200 border border-emerald-600/40'
                  : 'bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700'
              }`}
            >
              <span>{act.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
