import React from 'react';
import { useApp } from '../context/AppContext';
import { USER_ROLES } from '../types/userProfile';
import {
  TrendingUp,
  Clock,
  Receipt,
  Building,
  CreditCard,
  CheckCircle,
  FileText,
  Users,
  UtensilsCrossed,
  ArrowRight,
  Sparkles,
  Mic,
  Calendar,
  Zap,
  MessageCircle,
} from 'lucide-react';

export const ProfileExecutiveSummary: React.FC = () => {
  const {
    activeRole,
    setActiveRole,
    setActiveView,
    setActiveOperativaTab,
    openDrawer360,
    setIsReportModalOpen,
    setIsIdentityModalOpen,
    punches,
    expenses,
    reservations,
    shifts,
    syncQueue,
    businessIdentity,
    announceAriaLive,
    openVoiceAssistant,
  } = useApp();

  const currentRoleDef = USER_ROLES.find((r) => r.id === activeRole) || USER_ROLES[0];

  // Calculated dynamic metrics
  const pendingExpenses = expenses.filter(
    (e) => e.status === 'pendiente_revision' || e.status === 'pendiente_aprobacion' || e.status === 'pending_approval'
  ).length;

  const activePunchesCount = punches.filter((p) => p.type === 'entrada').length;

  const navigateTo = (view: 'inicio' | 'cockpit' | 'operativa' | 'director' | 'reputacion', tab?: any) => {
    setActiveView(view);
    if (tab && view === 'operativa') {
      setActiveOperativaTab(tab);
    }
  };

  return (
    <div className="bg-gradient-to-br from-slate-900 via-slate-850 to-indigo-950/30 border border-slate-800 rounded-2xl shadow-xl p-4 sm:p-5 mb-6 text-slate-100 transition-all">
      {/* Top Bar inside Executive Summary: Role switcher tabs */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pb-4 border-b border-slate-800/80">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 text-[11px] font-bold uppercase tracking-wider rounded-md bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              Cuadro de Mando por Perfil
            </span>
            <button
              onClick={() => setIsIdentityModalOpen(true)}
              className="text-xs text-indigo-300 hover:text-white hover:underline transition-colors flex items-center gap-1"
              title="Pulsar para ver datos de identidad"
            >
              <span>{businessIdentity.companyName}</span>
              <span className="font-mono text-slate-400">({businessIdentity.cifNif})</span>
            </button>
            <button
              onClick={() => openVoiceAssistant()}
              className="px-2 py-0.5 text-[11px] font-bold rounded-md bg-[#25D366]/20 text-emerald-300 hover:bg-[#25D366]/30 hover:text-white border border-[#25D366]/40 transition-colors flex items-center gap-1 shadow-xs ml-1"
              title="Abrir Asistente de Voz y Navegación WhatsApp 360"
            >
              <MessageCircle className="w-3 h-3 fill-current text-[#25D366]" />
              <span>Voz WhatsApp</span>
            </button>
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-white mt-1 flex items-center gap-2">
            <span>{currentRoleDef.title}</span>
            <span className="text-xs font-normal text-slate-400 hidden sm:inline">
              — {currentRoleDef.shortDesc}
            </span>
          </h2>
        </div>

        {/* Profile Tabs Switcher */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 no-scrollbar">
          {USER_ROLES.map((r) => {
            const isActive = activeRole === r.id;
            return (
              <button
                key={r.id}
                onClick={() => {
                  setActiveRole(r.id);
                  announceAriaLive(`Cambiado a perfil ${r.title}`);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all border ${
                  isActive
                    ? 'bg-indigo-600 text-white border-indigo-500 shadow-md shadow-indigo-600/30 ring-1 ring-indigo-400/40'
                    : 'bg-slate-800/80 hover:bg-slate-750 text-slate-300 border-slate-700/60 hover:border-slate-600'
                }`}
              >
                {r.badge}
              </button>
            );
          })}
        </div>
      </div>

      {/* Role-Specific Live Data Cards */}
      <div className="pt-4">
        {activeRole === 'autonomo_gerente' && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-slate-800/50 border border-slate-700/60 rounded-xl p-3">
                <span className="text-xs text-slate-400 block">Ventas Trimestre</span>
                <span className="text-lg sm:text-xl font-bold text-emerald-400">34.250 €</span>
                <span className="text-[11px] text-slate-400 block mt-0.5">38 facturas emitidas</span>
              </div>
              <div className="bg-slate-800/50 border border-slate-700/60 rounded-xl p-3">
                <span className="text-xs text-slate-400 block">Cobros Pendientes</span>
                <span className="text-lg sm:text-xl font-bold text-amber-400">4.120 €</span>
                <span className="text-[11px] text-slate-400 block mt-0.5">3 clientes pendientes</span>
              </div>
              <div className="bg-slate-800/50 border border-slate-700/60 rounded-xl p-3">
                <span className="text-xs text-slate-400 block">Previsión IVA / IRPF</span>
                <span className="text-lg sm:text-xl font-bold text-indigo-300">3.480 €</span>
                <span className="text-[11px] text-slate-400 block mt-0.5">Cierre estimado mod. 303</span>
              </div>
              <div className="bg-slate-800/50 border border-slate-700/60 rounded-xl p-3">
                <span className="text-xs text-slate-400 block">Saldo Tesorería</span>
                <span className="text-lg sm:text-xl font-bold text-cyan-300">18.640 €</span>
                <span className="text-[11px] text-emerald-400 flex items-center gap-1 mt-0.5">
                  <CheckCircle className="w-3 h-3" /> Bancos al día
                </span>
              </div>
            </div>

            {/* Direct Actions */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <button
                onClick={() => navigateTo('operativa', 'fichaje')}
                className="px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow"
              >
                <Clock className="w-3.5 h-3.5" /> Fichar Jornada
              </button>
              <button
                onClick={() => navigateTo('operativa', 'gastos')}
                className="px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <Receipt className="w-3.5 h-3.5 text-indigo-400" /> Subir Gasto OCR
              </button>
              <button
                onClick={() => navigateTo('cockpit')}
                className="px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <TrendingUp className="w-3.5 h-3.5 text-emerald-400" /> Facturar Cliente
              </button>
              <button
                onClick={() => setIsReportModalOpen(true)}
                className="px-3.5 py-1.5 rounded-lg bg-indigo-950/60 hover:bg-indigo-900/60 text-indigo-200 border border-indigo-700/60 text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5 text-indigo-400" /> Informe Fiscal AsexIA Confia360
              </button>
              <button
                onClick={() => openDrawer360('albaran')}
                className="px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors ml-auto"
              >
                Hub Transversal 360 <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {activeRole === 'comercial' && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-slate-800/50 border border-slate-700/60 rounded-xl p-3">
                <span className="text-xs text-slate-400 block">Facturas Este Mes</span>
                <span className="text-lg sm:text-xl font-bold text-emerald-400">14.820 €</span>
                <span className="text-[11px] text-slate-400 block mt-0.5">18 emitidas</span>
              </div>
              <div className="bg-slate-800/50 border border-slate-700/60 rounded-xl p-3">
                <span className="text-xs text-slate-400 block">Vencidos Reclamables</span>
                <span className="text-lg sm:text-xl font-bold text-rose-400">2.350 €</span>
                <span className="text-[11px] text-rose-300 block mt-0.5">2 avisos automáticos</span>
              </div>
              <div className="bg-slate-800/50 border border-slate-700/60 rounded-xl p-3">
                <span className="text-xs text-slate-400 block">Presupuestos Abiertos</span>
                <span className="text-lg sm:text-xl font-bold text-amber-300">5 presupuestos</span>
                <span className="text-[11px] text-slate-400 block mt-0.5">9.200 € potenciales</span>
              </div>
              <div className="bg-slate-800/50 border border-slate-700/60 rounded-xl p-3">
                <span className="text-xs text-slate-400 block">Albaranes Cruzados</span>
                <span className="text-lg sm:text-xl font-bold text-indigo-300">12 verificados</span>
                <span className="text-[11px] text-indigo-200 flex items-center gap-1 mt-0.5">
                  <CheckCircle className="w-3 h-3" /> Traza 360 OK
                </span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 pt-1">
              <button
                onClick={() => navigateTo('cockpit')}
                className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow"
              >
                <TrendingUp className="w-3.5 h-3.5" /> Nueva Factura / Presupuesto
              </button>
              <button
                onClick={() => openDrawer360('albaran')}
                className="px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <FileText className="w-3.5 h-3.5 text-indigo-400" /> Consultar Albarán Traza 360
              </button>
              <button
                onClick={() => navigateTo('operativa', 'economico_alertas')}
                className="px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <CreditCard className="w-3.5 h-3.5 text-cyan-400" /> Reclamación Cobros
              </button>
            </div>
          </div>
        )}

        {activeRole === 'administracion' && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-slate-800/50 border border-slate-700/60 rounded-xl p-3">
                <span className="text-xs text-slate-400 block">Tickets OCR Procesados</span>
                <span className="text-lg sm:text-xl font-bold text-indigo-300">{expenses.length} tickets</span>
                <span className="text-[11px] text-slate-400 block mt-0.5">Deducción 100% verificada</span>
              </div>
              <div className="bg-slate-800/50 border border-slate-700/60 rounded-xl p-3">
                <span className="text-xs text-slate-400 block">Pendientes Revisión</span>
                <span className="text-lg sm:text-xl font-bold text-amber-400">{pendingExpenses} tickets</span>
                <span className="text-[11px] text-slate-400 block mt-0.5">Validación 3 pasos</span>
              </div>
              <div className="bg-slate-800/50 border border-slate-700/60 rounded-xl p-3">
                <span className="text-xs text-slate-400 block">Conciliación Bancaria</span>
                <span className="text-lg sm:text-xl font-bold text-emerald-400">98% Cuadrado</span>
                <span className="text-[11px] text-slate-400 block mt-0.5">1 apunte pendiente</span>
              </div>
              <div className="bg-slate-800/50 border border-slate-700/60 rounded-xl p-3">
                <span className="text-xs text-slate-400 block">Cola Sync Offline</span>
                <span className="text-lg sm:text-xl font-bold text-cyan-300">{syncQueue.length} en cola</span>
                <span className="text-[11px] text-emerald-400 flex items-center gap-1 mt-0.5">
                  <CheckCircle className="w-3 h-3" /> PWA local persistida
                </span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 pt-1">
              <button
                onClick={() => navigateTo('operativa', 'gastos')}
                className="px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow"
              >
                <Receipt className="w-3.5 h-3.5" /> Escaneo y Validación OCR
              </button>
              <button
                onClick={() => navigateTo('operativa', 'economico_alertas')}
                className="px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <CreditCard className="w-3.5 h-3.5 text-cyan-400" /> Conciliar Remesas SEPA
              </button>
              <button
                onClick={() => navigateTo('operativa', 'monitor_sync')}
                className="px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <Zap className="w-3.5 h-3.5 text-amber-400" /> Monitor Sincronización
              </button>
            </div>
          </div>
        )}

        {activeRole === 'gestoria' && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-slate-800/50 border border-slate-700/60 rounded-xl p-3">
                <span className="text-xs text-slate-400 block">Liquidación Mod. 303</span>
                <span className="text-lg sm:text-xl font-bold text-indigo-300">2.140 € IVA</span>
                <span className="text-[11px] text-slate-400 block mt-0.5">Trimestre en curso</span>
              </div>
              <div className="bg-slate-800/50 border border-slate-700/60 rounded-xl p-3">
                <span className="text-xs text-slate-400 block">Retenciones IRPF 130</span>
                <span className="text-lg sm:text-xl font-bold text-indigo-300">1.340 €</span>
                <span className="text-[11px] text-slate-400 block mt-0.5">20% rendimiento neto</span>
              </div>
              <div className="bg-slate-800/50 border border-slate-700/60 rounded-xl p-3">
                <span className="text-xs text-slate-400 block">Certificado Digital</span>
                <span className="text-lg sm:text-xl font-bold text-emerald-400">Activo FNMT</span>
                <span className="text-[11px] text-slate-400 block mt-0.5">Caduca: 12/2027</span>
              </div>
              <div className="bg-slate-800/50 border border-slate-700/60 rounded-xl p-3">
                <span className="text-xs text-slate-400 block">Auditoría 360</span>
                <span className="text-lg sm:text-xl font-bold text-emerald-400">100% Conforme</span>
                <span className="text-[11px] text-emerald-400 flex items-center gap-1 mt-0.5">
                  <CheckCircle className="w-3 h-3" /> Sin descuadres
                </span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 pt-1">
              <button
                onClick={() => setIsReportModalOpen(true)}
                className="px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow"
              >
                <FileText className="w-3.5 h-3.5" /> Descargar Dossier Fiscal Trimestral
              </button>
              <button
                onClick={() => setIsIdentityModalOpen(true)}
                className="px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <Building className="w-3.5 h-3.5 text-indigo-400" /> Ficha Mercantil & IAE
              </button>
              <button
                onClick={() => openDrawer360('factura')}
                className="px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                Auditar Trazabilidad Facturas <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {activeRole === 'operaciones_sector' && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-slate-800/50 border border-slate-700/60 rounded-xl p-3">
                <span className="text-xs text-slate-400 block">Reservas de Sala Hoy</span>
                <span className="text-lg sm:text-xl font-bold text-amber-400">{reservations.length || 14} mesas</span>
                <span className="text-[11px] text-slate-400 block mt-0.5">58 comensales previstos</span>
              </div>
              <div className="bg-slate-800/50 border border-slate-700/60 rounded-xl p-3">
                <span className="text-xs text-slate-400 block">Personal en Sala</span>
                <span className="text-lg sm:text-xl font-bold text-emerald-400">{activePunchesCount || 4} activos</span>
                <span className="text-[11px] text-emerald-300 block mt-0.5">Fichaje Cero Toque OK</span>
              </div>
              <div className="bg-slate-800/50 border border-slate-700/60 rounded-xl p-3">
                <span className="text-xs text-slate-400 block">Turnos de Hoy</span>
                <span className="text-lg sm:text-xl font-bold text-indigo-300">{shifts.length || 5} cuadrantes</span>
                <span className="text-[11px] text-slate-400 block mt-0.5">Cocina & Sala cubiertos</span>
              </div>
              <div className="bg-slate-800/50 border border-slate-700/60 rounded-xl p-3">
                <span className="text-xs text-slate-400 block">Agente Sala 24/7</span>
                <span className="text-lg sm:text-xl font-bold text-cyan-300">Operativo</span>
                <span className="text-[11px] text-cyan-200 flex items-center gap-1 mt-0.5">
                  <Mic className="w-3 h-3" /> Voz en tiempo real
                </span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 pt-1">
              <button
                onClick={() => navigateTo('operativa', 'reservas_voz')}
                className="px-3.5 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow"
              >
                <UtensilsCrossed className="w-3.5 h-3.5" /> Plano y Reservas de Sala
              </button>
              <button
                onClick={() => navigateTo('operativa', 'fichaje')}
                className="px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow"
              >
                <Clock className="w-3.5 h-3.5" /> Fichaje de Camareros
              </button>
              <button
                onClick={() => navigateTo('operativa', 'rrhh_turnos')}
                className="px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <Calendar className="w-3.5 h-3.5 text-indigo-400" /> Cuadrante de Turnos
              </button>
              <button
                onClick={() => navigateTo('operativa', 'reservas_voz')}
                className="px-3.5 py-1.5 rounded-lg bg-cyan-950/60 hover:bg-cyan-900/60 text-cyan-200 border border-cyan-700/60 text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <Mic className="w-3.5 h-3.5 text-cyan-400" /> Agente de Voz Sala
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
