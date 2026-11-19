import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Home,
  LayoutDashboard,
  Receipt,
  Camera,
  CalendarCheck,
  UtensilsCrossed,
  FileText,
  ShieldAlert,
  FileQuestion,
  LogOut,
  Sliders,
  Sparkles,
  ChevronRight,
  X,
  PhoneCall,
  Users,
  Fingerprint,
} from 'lucide-react';

interface ConfiaSidebarProps {
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
}

export const ConfiaSidebar: React.FC<ConfiaSidebarProps> = ({
  isOpenMobile = false,
  onCloseMobile,
}) => {
  const {
    brandConfig,
    activeView,
    setActiveView,
    activeOperativaTab,
    setActiveOperativaTab,
    setIsReportModalOpen,
    openDrawer360,
    startTour,
    businessIdentity,
    setIsIdentityModalOpen,
  } = useApp();

  const handleNav = (action: () => void) => {
    action();
    if (onCloseMobile) onCloseMobile();
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div
          className="fixed inset-0 bg-slate-950/60 z-40 lg:hidden backdrop-blur-xs transition-opacity"
          onClick={onCloseMobile}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-[#022853] text-white flex flex-col justify-between transition-transform duration-300 ease-in-out border-r border-white/10 lg:static lg:translate-x-0 ${
          isOpenMobile ? 'translate-x-0 shadow-2xl' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Top Header & Branding */}
        <div className="flex flex-col">
          <div className="p-4 sm:p-5 border-b border-white/10 flex items-center justify-between">
            <button
              onClick={() => handleNav(() => setActiveView('inicio'))}
              className="flex items-center gap-3 text-left focus:outline-hidden group"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#0067B9] via-[#022853] to-[#021f42] border border-white/20 flex items-center justify-center shadow-md relative overflow-hidden shrink-0 group-hover:scale-105 transition-transform">
                <span className="font-brand font-black text-white text-xl tracking-tight">A</span>
                <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-[#80D518] border-2 border-[#022853]" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="font-brand font-black text-sm text-white tracking-wide leading-tight truncate">
                    {brandConfig.appName || 'AsexIA Confia360'}
                  </span>
                  <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-[#80D518]/25 text-[#80D518] border border-[#80D518]/50 uppercase tracking-wider shrink-0">
                    ECO
                  </span>
                </div>
                <p className="text-[11px] text-blue-200/80 truncate max-w-[150px]">
                  {brandConfig.venueName || 'Hostelería Demo'}
                </p>
              </div>
            </button>

            {/* Mobile Close Button */}
            <button
              onClick={onCloseMobile}
              className="lg:hidden p-1.5 text-blue-200 hover:text-white rounded-lg hover:bg-white/10"
              aria-label="Cerrar menú"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="p-3 space-y-1 overflow-y-auto max-h-[calc(100vh-210px)] scrollbar-thin">
            {/* INICIO (Hub de Módulos) */}
            <button
              onClick={() => handleNav(() => setActiveView('inicio'))}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                activeView === 'inicio'
                  ? 'bg-white text-[#022853] shadow-md ring-1 ring-white'
                  : 'text-blue-100/90 hover:bg-white/10 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <Home className={`w-4 h-4 ${activeView === 'inicio' ? 'text-[#022853]' : 'text-blue-300'}`} />
                <span>Inicio (Módulos)</span>
              </div>
              {activeView === 'inicio' && <ChevronRight className="w-3.5 h-3.5 text-[#022853]" />}
            </button>

            {/* CUADRO DE MANDOS */}
            <button
              onClick={() => handleNav(() => setActiveView('cockpit'))}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                activeView === 'cockpit'
                  ? 'bg-white text-[#022853] shadow-md ring-1 ring-white'
                  : 'text-blue-100/90 hover:bg-white/10 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <LayoutDashboard className={`w-4 h-4 ${activeView === 'cockpit' ? 'text-[#022853]' : 'text-blue-300'}`} />
                <span>Panel de control</span>
              </div>
              <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                360°
              </span>
            </button>

            <div className="pt-2 pb-1 px-3">
              <span className="text-[10px] font-bold text-blue-300/60 uppercase tracking-wider">
                Operaciones del día
              </span>
            </div>

            {/* GASTOS Y FACTURAS */}
            <button
              onClick={() =>
                handleNav(() => {
                  setActiveView('operativa');
                  setActiveOperativaTab('gastos');
                })
              }
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all ${
                activeView === 'operativa' && activeOperativaTab === 'gastos'
                  ? 'bg-white text-[#022853] font-bold shadow-md'
                  : 'text-blue-100/90 hover:bg-white/10 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <Receipt className="w-4 h-4 text-sky-300" />
                <span>Gastos y facturas</span>
              </div>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-rose-500/30 text-rose-200 border border-rose-400/40">
                3
              </span>
            </button>

            {/* CAPTURAR TICKET OCR */}
            <button
              onClick={() =>
                handleNav(() => {
                  setActiveView('operativa');
                  setActiveOperativaTab('gastos');
                })
              }
              className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium text-blue-100/90 hover:bg-white/10 hover:text-white transition-all"
            >
              <div className="flex items-center gap-3">
                <Camera className="w-4 h-4 text-emerald-300" />
                <span>Capturar ticket</span>
              </div>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-400/20 text-emerald-300">
                OCR
              </span>
            </button>

            {/* GESTIÓN DE AUSENCIAS / RRHH */}
            <button
              onClick={() =>
                handleNav(() => {
                  setActiveView('operativa');
                  setActiveOperativaTab('rrhh_turnos');
                })
              }
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all ${
                activeView === 'operativa' && activeOperativaTab === 'rrhh_turnos'
                  ? 'bg-white text-[#022853] font-bold shadow-md'
                  : 'text-blue-100/90 hover:bg-white/10 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <CalendarCheck className="w-4 h-4 text-purple-300" />
                <span>Gestión de ausencias</span>
              </div>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-amber-500/30 text-amber-200 border border-amber-400/40">
                1
              </span>
            </button>

            {/* FICHAJE / CONTROL HORARIO */}
            <button
              onClick={() =>
                handleNav(() => {
                  setActiveView('operativa');
                  setActiveOperativaTab('fichaje');
                })
              }
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all ${
                activeView === 'operativa' && activeOperativaTab === 'fichaje'
                  ? 'bg-white text-[#022853] font-bold shadow-md'
                  : 'text-blue-100/90 hover:bg-white/10 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <Fingerprint className="w-4 h-4 text-emerald-400" />
                <span>Control horario</span>
              </div>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-400/20 text-emerald-300">
                Legal
              </span>
            </button>

            <div className="pt-2 pb-1 px-3">
              <span className="text-[10px] font-bold text-blue-300/60 uppercase tracking-wider">
                Sector & Negocio
              </span>
            </div>

            {/* SECTORIAL: SALA Y RESERVAS */}
            <button
              onClick={() =>
                handleNav(() => {
                  setActiveView('operativa');
                  setActiveOperativaTab('reservas_voz');
                })
              }
              className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium text-blue-100/90 hover:bg-white/10 hover:text-white transition-all"
            >
              <div className="flex items-center gap-3">
                <UtensilsCrossed className="w-4 h-4 text-amber-300" />
                <span>Restaurante & Sala</span>
              </div>
              <span className="text-[10px] font-semibold text-blue-200">14 mesas</span>
            </button>

            {/* SECTORIAL: REPUTACIÓN Y RESEÑAS */}
            <button
              onClick={() => handleNav(() => setActiveView('reputacion'))}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all ${
                activeView === 'reputacion'
                  ? 'bg-white text-[#022853] font-bold shadow-md'
                  : 'text-blue-100/90 hover:bg-white/10 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>Reputación & Reviews</span>
              </div>
              <span className="text-[10px] font-bold text-amber-300">4.8 ★</span>
            </button>

            {/* CAJÓN TRANSVERSAL 360 */}
            <button
              onClick={() => handleNav(() => openDrawer360('factura'))}
              className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium text-blue-100/90 hover:bg-white/10 hover:text-white transition-all"
            >
              <div className="flex items-center gap-3">
                <FileText className="w-4 h-4 text-blue-300" />
                <span>Explorador 360°</span>
              </div>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#0067B9] text-white">
                Navegación360
              </span>
            </button>

            {/* AUDITORÍA Y ROSETTA GRAPH */}
            <button
              onClick={() => handleNav(() => setActiveView('director'))}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all ${
                activeView === 'director'
                  ? 'bg-white text-[#022853] font-bold shadow-md'
                  : 'text-blue-100/90 hover:bg-white/10 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <ShieldAlert className="w-4 h-4 text-purple-300" />
                <span>Auditoría & Sistema</span>
              </div>
            </button>

            {/* INFORME EJECUTIVO CONFIA360 */}
            <button
              onClick={() => handleNav(() => setIsReportModalOpen(true))}
              className="w-full flex items-center justify-between px-3.5 py-2 rounded-xl text-xs font-semibold text-emerald-300 bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-400/30 transition-all mt-2"
            >
              <div className="flex items-center gap-2">
                <FileQuestion className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="truncate">¿Qué es AsexIA Confia360?</span>
              </div>
              <span className="text-[10px] font-bold text-emerald-200">Doc</span>
            </button>
          </nav>
        </div>

        {/* Footer: User profile & identity details */}
        <div className="p-3 border-t border-white/10 bg-[#011c3c]/80">
          <button
            onClick={() => handleNav(() => setIsIdentityModalOpen(true))}
            className="w-full flex items-center justify-between p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all text-left group"
            title="Pulsar para ver datos de identidad, CIF, cuenta bancaria y certificado fiscal"
            aria-label="Ver mis datos de identidad y empresa"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#80D518] to-emerald-400 text-slate-900 font-black text-xs flex items-center justify-center shrink-0 shadow-xs">
                {businessIdentity.ownerName.charAt(0)}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-white truncate group-hover:text-[#80D518] transition-colors">
                  {businessIdentity.ownerName}
                </p>
                <p className="text-[10px] text-blue-200/70 truncate font-mono">{businessIdentity.cifNif}</p>
              </div>
            </div>
            <span className="text-[10px] font-bold text-[#80D518] px-1.5 py-0.5 rounded bg-[#80D518]/20 border border-[#80D518]/30">
              Datos
            </span>
          </button>
        </div>
      </aside>
    </>
  );
};
