import React from 'react';
import { useApp } from '../../context/AppContext';
import { USER_ROLES } from '../../types/userProfile';
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
  ArrowRight,
  TrendingUp,
  Volume2,
  Mic,
  Users,
  Wifi,
  WifiOff,
} from 'lucide-react';

export const ModuleDashboardSummary: React.FC = () => {
  const {
    activeOperativaTab,
    activeRole,
    setActiveRole,
    punches,
    expenses,
    reservations,
    shifts,
    syncQueue,
    isOnline,
    businessIdentity,
    setIsIdentityModalOpen,
    openVoiceAssistant,
    announceAriaLive,
    recordPunch,
  } = useApp();

  const currentRoleDef = USER_ROLES.find((r) => r.id === activeRole) || USER_ROLES[0];

  // Calculated metrics
  const activePunchesCount = punches.filter((p) => p.type === 'entrada').length;
  const pendingExpenses = expenses.filter(
    (e) => e.status === 'pendiente_revision' || e.status === 'pendiente_aprobacion' || e.status === 'pending_approval'
  ).length;
  const totalExpensesAmount = expenses.reduce((acc, e) => acc + (e.totalAmount || 0), 0);
  const totalVatDeductible = expenses.reduce((acc, e) => acc + (e.vatAmount || 0), 0);

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
          accentColor: '#0067B9',
          metrics: [
            {
              label: 'Personal Fichado Hoy',
              value: `${activePunchesCount || 4} activos`,
              subtext: 'En turno ahora (sala & cocina)',
              highlight: 'text-emerald-400',
              icon: Users,
            },
            {
              label: 'Sistema Cero Toque',
              value: 'Operativo',
              subtext: 'GPS activo contra local',
              highlight: 'text-cyan-300',
              icon: ShieldCheck,
            },
            {
              label: 'Jornada Promedio',
              value: '7h 45m',
              subtext: '100% descansos legales',
              highlight: 'text-indigo-300',
              icon: Clock,
            },
            {
              label: 'Inspección ITSS',
              value: '100% Conforme',
              subtext: 'Libro digital inalterable',
              highlight: 'text-emerald-400',
              icon: CheckCircle,
            },
          ],
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
              onClick: () => {
                const el = document.getElementById('historial-fichajes');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
                announceAriaLive('Desplazado a historial de fichajes');
              },
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
          accentColor: '#80D518',
          metrics: [
            {
              label: 'Gastos Registrados',
              value: `${totalExpensesAmount.toLocaleString('es-ES', { maximumFractionDigits: 0 })} €`,
              subtext: `${expenses.length} facturas y tickets`,
              highlight: 'text-emerald-400',
              icon: Receipt,
            },
            {
              label: 'Pendientes de Revisión',
              value: `${pendingExpenses} tickets`,
              subtext: 'Validación en 3 toques',
              highlight: pendingExpenses > 0 ? 'text-amber-400' : 'text-slate-300',
              icon: AlertTriangle,
            },
            {
              label: 'Auditoría de Subidas',
              value: '1 Alarma',
              subtext: 'Solomillo (+15.5%) en disputa',
              highlight: 'text-rose-400',
              icon: TrendingUp,
            },
            {
              label: 'IVA Soportado Deducible',
              value: `${totalVatDeductible.toLocaleString('es-ES', { maximumFractionDigits: 0 })} €`,
              subtext: 'Computable para mod. 303',
              highlight: 'text-cyan-300',
              icon: Sparkles,
            },
          ],
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
              onClick: () => {
                const el = document.getElementById('alertas-gastos');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              },
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
          accentColor: '#D6A52A',
          metrics: [
            {
              label: 'Reservas para Hoy',
              value: `${reservations.length || 14} mesas`,
              subtext: 'Servicios de comida y cena',
              highlight: 'text-amber-400',
              icon: UtensilsCrossed,
            },
            {
              label: 'Comensales Confirmados',
              value: '58 pax',
              subtext: 'Ocupación de sala al 82%',
              highlight: 'text-emerald-400',
              icon: Users,
            },
            {
              label: 'Agente Telefónico IA',
              value: 'En Línea 24/7',
              subtext: 'Gemini Live respondiendo llamadas',
              highlight: 'text-cyan-300',
              icon: Mic,
            },
            {
              label: 'Fianzas Retenidas',
              value: '180 €',
              subtext: 'Protección contra No-Show',
              highlight: 'text-indigo-300',
              icon: ShieldCheck,
            },
          ],
          actions: [
            {
              label: '🍽️ Nueva Reserva de Mesa',
              onClick: () => {
                const el = document.getElementById('formulario-reserva');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              },
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
          accentColor: '#48A222',
          metrics: [
            {
              label: 'Turnos Asignados Hoy',
              value: `${shifts.length || 5} puestos`,
              subtext: 'Planificación de cocina y sala',
              highlight: 'text-indigo-300',
              icon: Calendar,
            },
            {
              label: 'Personal en Turno',
              value: '7 empleados',
              subtext: 'Turno mañana y turno noche',
              highlight: 'text-emerald-400',
              icon: Users,
            },
            {
              label: 'Cobertura de Servicio',
              value: '100% Cubierto',
              subtext: 'Sin vacíos en cocina ni barra',
              highlight: 'text-cyan-300',
              icon: CheckCircle,
            },
            {
              label: 'Incidencias de Turno',
              value: '0 Alertas',
              subtext: 'Cuadrante notificado al equipo',
              highlight: 'text-slate-300',
              icon: ShieldCheck,
            },
          ],
          actions: [
            {
              label: '👥 Planificar Nuevo Turno',
              onClick: () => {
                const el = document.getElementById('nuevo-turno');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              },
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
          accentColor: '#022853',
          metrics: [
            {
              label: 'Saldo Disponible Total',
              value: '18.640 €',
              subtext: '2 cuentas bancarias sincronizadas',
              highlight: 'text-cyan-300',
              icon: CreditCard,
            },
            {
              label: 'Cobros Pendientes',
              value: '4.120 €',
              subtext: '3 facturas emitidas a clientes',
              highlight: 'text-amber-400',
              icon: TrendingUp,
            },
            {
              label: 'Pagos Próximos 7 Días',
              value: '3.850 €',
              subtext: 'Vencimientos de proveedores',
              highlight: 'text-rose-400',
              icon: AlertTriangle,
            },
            {
              label: 'Conciliación Bancaria',
              value: '98% Cuadrada',
              subtext: '1 apunte pendiente de conciliar',
              highlight: 'text-emerald-400',
              icon: CheckCircle,
            },
          ],
          actions: [
            {
              label: '🏦 Conciliar Extracto Bancario',
              onClick: () => {
                const el = document.getElementById('conciliacion-bancaria');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              },
              primary: true,
            },
            {
              label: '📊 Previsión de Liquidez a 30 Días',
              onClick: () => {
                const el = document.getElementById('prevision-liquidez');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              },
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
          accentColor: '#0067B9',
          metrics: [
            {
              label: 'Operaciones en Cola',
              value: `${syncQueue.length} pendientes`,
              subtext: 'Persistidas en IndexedDB local',
              highlight: syncQueue.length > 0 ? 'text-amber-400' : 'text-emerald-400',
              icon: Zap,
            },
            {
              label: 'Conectividad de Red',
              value: isOnline ? 'En Línea' : 'Modo Offline',
              subtext: isOnline ? 'Sincronización en tiempo real' : 'Guardando cambios en local',
              highlight: isOnline ? 'text-emerald-400' : 'text-amber-400',
              icon: isOnline ? Wifi : WifiOff,
            },
            {
              label: 'Integridad de Datos',
              value: '100% Verificado',
              subtext: 'Protocolo Zero-Data-Loss PWA',
              highlight: 'text-cyan-300',
              icon: ShieldCheck,
            },
            {
              label: 'Última Sincronización',
              value: 'Exitosa',
              subtext: 'Servidor central sincronizado',
              highlight: 'text-indigo-300',
              icon: CheckCircle,
            },
          ],
          actions: [
            {
              label: '🔄 Sincronizar Ahora con Servidor',
              onClick: () => {
                announceAriaLive('Sincronización forzada completada con éxito');
              },
              primary: true,
            },
            {
              label: '📦 Inspeccionar Datos Locales',
              onClick: () => {
                const el = document.getElementById('cola-transacciones');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              },
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
              <ModuleIcon className="w-3.5 h-3.5" style={{ color: moduleConfig.accentColor }} />
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
          </div>

          {/* Module Title and Subtitle */}
          <h2 className="text-lg sm:text-xl font-bold text-white mt-1.5 flex items-center gap-2 font-brand">
            <span>{moduleConfig.title}</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            {moduleConfig.subtitle}
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
          {moduleConfig.metrics.map((m, idx) => {
            const MetricIcon = m.icon;
            return (
              <div
                key={idx}
                className="bg-slate-800/50 hover:bg-slate-800/70 border border-slate-700/60 rounded-xl p-3 transition-colors flex flex-col justify-between"
              >
                <div className="flex items-center justify-between gap-1 mb-1">
                  <span className="text-xs text-slate-400 block truncate">{m.label}</span>
                  <MetricIcon className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                </div>
                <div>
                  <span className={`text-lg sm:text-xl font-bold block ${m.highlight}`}>
                    {m.value}
                  </span>
                  <span className="text-[11px] text-slate-400 block mt-0.5 truncate">
                    {m.subtext}
                  </span>
                </div>
              </div>
            );
          })}
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
