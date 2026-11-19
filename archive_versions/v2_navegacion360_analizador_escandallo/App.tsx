import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { AriaLiveAnnouncer } from './components/AriaLiveAnnouncer';
import { ZeroTouchPunch } from './components/operativa/ZeroTouchPunch';
import { ThreeStepExpenseOCR } from './components/operativa/ThreeStepExpenseOCR';
import { VoiceReservationAgent } from './components/operativa/VoiceReservationAgent';
import { HRShiftAgent } from './components/operativa/HRShiftAgent';
import { EconomicAgentPanel } from './components/operativa/EconomicAgentPanel';
import { UXDesignSuite } from './components/director/UXDesignSuite';
import { AgileProjectPlan } from './components/director/AgileProjectPlan';
import { SoftwareArchitecture } from './components/director/SoftwareArchitecture';
import { SyncStatusMonitor } from './components/SyncStatusMonitor';
import { CockpitDashboard } from './components/cockpit/CockpitDashboard';
import { NavigationBackButton } from './components/NavigationBackButton';
import { QuickStartTour } from './components/pwa/QuickStartTour';
import { TourCompletionBanner } from './components/pwa/TourCompletionBanner';
import { PositionalHelpFloatingBar } from './components/help/PositionalHelpFloatingBar';
import { ReputationModule } from './components/reputation/ReputationModule';
import { UniversalDrawer360 } from './components/navigation360/UniversalDrawer360';
import {
  Fingerprint,
  Receipt,
  PhoneCall,
  Users,
  LineChart,
  Database,
  LayoutTemplate,
  Kanban,
  Cpu,
  Sparkles,
  LayoutDashboard,
  Star,
} from 'lucide-react';

const AppContent: React.FC = () => {
  const {
    brandConfig,
    activeView,
    setActiveView,
    activeOperativaTab,
    setActiveOperativaTab,
    activeDirectorTab,
    setActiveDirectorTab,
  } = useApp();

  return (
    <div
      className={`min-h-screen flex flex-col transition-colors duration-200 ${
        brandConfig.highContrast ? 'bg-slate-900 text-slate-100' : 'bg-[#F3F7FA] text-slate-800'
      }`}
      style={{ fontSize: `${brandConfig.fontScale * 100}%` }}
    >
      {/* Brand Header */}
      <Header />

      {/* Accessibility Screen-Reader Live Region */}
      <AriaLiveAnnouncer />

      {/* Interactive QuickStart Tour Modal & Voice Guide */}
      <QuickStartTour />

      {/* Positional Help & System-Wide Floating Bar */}
      <PositionalHelpFloatingBar />

      {/* Universal 360 Transversal Floating Drawer */}
      <UniversalDrawer360 />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-5 space-y-4 pb-24 md:pb-8">
        
        {/* Tour Completion Banner: Touch anywhere to dismiss */}
        <TourCompletionBanner />

        {/* Contextual Back Button & Breadcrumb Banner */}
        <NavigationBackButton variant="banner" />
        
        {/* ========================================================= */}
        {/* VIEW 0: CUADRO DE MANDOS EJECUTIVO (COCKPIT 360 DASH-001) */}
        {/* ========================================================= */}
        {activeView === 'cockpit' && (
          <div className="animate-in fade-in duration-150">
            <CockpitDashboard />
          </div>
        )}

        {/* ========================================================= */}
        {/* VIEW 1: APP OPERATIVA PWA (EN VIVO PARA HOSTELERÍA)       */}
        {/* ========================================================= */}
        {activeView === 'operativa' && (
          <div className="space-y-4">
            
            {/* Core Universal Pyme vs Módulo Sectorial Hostelería Badge */}
            <div className="bg-slate-100/90 rounded-2xl px-4 py-2 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#0067B9] shrink-0" />
                <span className="font-bold text-slate-800">Core Universal Pyme:</span>
                <span className="text-slate-600">Presencia/Fichaje, Facturas & Gastos OCR, Tesorería y Cola Sync</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shrink-0" />
                <span className="font-bold text-slate-800">Módulo Sectorial:</span>
                <span className="text-amber-800 bg-amber-100 px-2 py-0.5 rounded-md font-bold text-[11px]">
                  Restauración (Escandallos & Sala)
                </span>
              </div>
            </div>

            {/* Redesigned Operative Navigation Menu Bar */}
            <div className="bg-white rounded-2xl p-1.5 sm:p-2 border border-slate-200 shadow-xs">
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-1.5 sm:gap-2">
                {[
                  {
                    id: 'fichaje',
                    label: 'Fichaje',
                    sub: 'Cero Toque',
                    icon: Fingerprint,
                    badgeColor: 'bg-emerald-100 text-emerald-800',
                  },
                  {
                    id: 'gastos',
                    label: 'OCR Gastos',
                    sub: '3 Pasos',
                    icon: Receipt,
                    badgeColor: 'bg-blue-100 text-blue-800',
                  },
                  {
                    id: 'reservas_voz',
                    label: 'Agente Sala',
                    sub: 'Voz 24/7',
                    icon: PhoneCall,
                    badgeColor: 'bg-purple-100 text-purple-800',
                  },
                  {
                    id: 'rrhh_turnos',
                    label: 'RRHH & Turnos',
                    sub: 'Chatbot PWA',
                    icon: Users,
                    badgeColor: 'bg-amber-100 text-amber-800',
                  },
                  {
                    id: 'economico_alertas',
                    label: 'Económico',
                    sub: 'Tesorería',
                    icon: LineChart,
                    badgeColor: 'bg-rose-100 text-rose-800',
                  },
                  {
                    id: 'monitor_sync',
                    label: 'Monitor Sync',
                    sub: 'Cola PWA',
                    icon: Database,
                    badgeColor: 'bg-emerald-100 text-emerald-800',
                  },
                ].map((item) => {
                  const Icon = item.icon;
                  const isActive = activeOperativaTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveOperativaTab(item.id as any)}
                      className={`touch-target-min relative rounded-xl p-2.5 sm:p-3 text-left transition-all duration-200 flex flex-col justify-between border ${
                        isActive
                          ? 'bg-[#0067B9] text-white border-[#0067B9] shadow-md ring-2 ring-[#0067B9]/20'
                          : 'bg-slate-50/70 hover:bg-white text-slate-700 border-slate-200/80 hover:border-slate-300'
                      }`}
                      aria-pressed={isActive}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                          isActive ? 'bg-white/20 text-[#80D518]' : 'bg-white text-[#0067B9] shadow-2xs border border-slate-200'
                        }`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <span className={`text-[10px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded-full ${
                          isActive ? 'bg-white/20 text-white' : item.badgeColor
                        }`}>
                          {item.sub}
                        </span>
                      </div>
                      <span className="font-brand font-bold text-xs sm:text-sm tracking-tight truncate block">
                        {item.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Active Operational Module Content */}
            <section className="animate-in fade-in duration-200" aria-label="Módulo operativo seleccionado">
              {activeOperativaTab === 'fichaje' && <ZeroTouchPunch />}
              {activeOperativaTab === 'gastos' && <ThreeStepExpenseOCR />}
              {activeOperativaTab === 'reservas_voz' && <VoiceReservationAgent />}
              {activeOperativaTab === 'rrhh_turnos' && <HRShiftAgent />}
              {activeOperativaTab === 'economico_alertas' && <EconomicAgentPanel />}
              {activeOperativaTab === 'monitor_sync' && <SyncStatusMonitor />}
            </section>
          </div>
        )}

        {/* ========================================================= */}
        {/* VIEW 2: SUITE DE DIRECCIÓN & ARQUITECTURA                 */}
        {/* ========================================================= */}
        {activeView === 'director' && (
          <div className="space-y-5">
            
            {/* Redesigned Director Navigation Bar */}
            <div className="bg-white rounded-2xl p-2 border border-slate-200 shadow-xs">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                {[
                  {
                    id: 'ux_ui_wireframes',
                    title: 'Diseño UX/UI & Wireframes',
                    desc: 'Prototipos Lo-Fi / Hi-Fi & WCAG 2.2 AA',
                    icon: LayoutTemplate,
                    accent: '#80D518',
                  },
                  {
                    id: 'project_plan_agile',
                    title: 'Plan de Proyecto Ágil',
                    desc: 'Alcance MVP, Roadmap & Matriz de Roles',
                    icon: Kanban,
                    accent: '#D6A52A',
                  },
                  {
                    id: 'software_architecture',
                    title: 'Arquitectura de Software',
                    desc: 'Modelo Móvil React/Node & Bus Dato Único',
                    icon: Cpu,
                    accent: '#0067B9',
                  },
                ].map((item) => {
                  const Icon = item.icon;
                  const isActive = activeDirectorTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveDirectorTab(item.id as any)}
                      className={`touch-target-min rounded-xl p-3 sm:p-4 text-left transition-all duration-200 border flex items-center gap-3.5 ${
                        isActive
                          ? 'bg-[#022853] text-white border-[#022853] shadow-md ring-2 ring-[#022853]/20'
                          : 'bg-slate-50/80 hover:bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                      }`}
                      aria-pressed={isActive}
                    >
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                        isActive ? 'bg-white/15 text-white' : 'bg-white text-[#022853] shadow-2xs border border-slate-200'
                      }`}>
                        <Icon className="w-5 h-5" style={{ color: isActive ? item.accent : undefined }} />
                      </div>
                      <div className="overflow-hidden">
                        <span className="font-brand font-bold text-xs sm:text-sm block truncate">
                          {item.title}
                        </span>
                        <span className={`text-[11px] block truncate ${isActive ? 'text-blue-200' : 'text-slate-500'}`}>
                          {item.desc}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Active Director Module Content */}
            <section className="animate-in fade-in duration-200" aria-label="Módulo de dirección seleccionado">
              {activeDirectorTab === 'ux_ui_wireframes' && <UXDesignSuite />}
              {activeDirectorTab === 'project_plan_agile' && <AgileProjectPlan />}
              {activeDirectorTab === 'software_architecture' && <SoftwareArchitecture />}
            </section>
          </div>
        )}

        {/* ========================================================= */}
        {/* VIEW 4: CONFIA360 REPUTACIÓN (FASES 1 A 4)                */}
        {/* ========================================================= */}
        {activeView === 'reputacion' && (
          <section className="animate-in fade-in duration-200" aria-label="Módulo ConfIA360 Reputación">
            <ReputationModule />
          </section>
        )}
      </main>

      {/* ========================================================= */}
      {/* MOBILE BOTTOM NAVIGATION BAR (FIXED ON SMARTPHONES)       */}
      {/* ========================================================= */}
      <nav
        className="md:hidden fixed bottom-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-md border-t border-slate-200 px-1 py-1.5 shadow-lg"
        aria-label="Navegación inferior móvil"
      >
        {activeView === 'cockpit' || activeView === 'reputacion' ? (
          <div className="grid grid-cols-4 gap-1">
            <button
              onClick={() => setActiveView('cockpit')}
              className={`touch-target-min flex flex-col items-center justify-center py-1.5 rounded-lg text-[10px] font-bold transition ${
                activeView === 'cockpit'
                  ? 'text-[#0067B9] bg-blue-50/80 font-black'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <LayoutDashboard className="w-4 h-4 mb-0.5" />
              <span>Cockpit</span>
            </button>
            <button
              onClick={() => setActiveView('operativa')}
              className="touch-target-min flex flex-col items-center justify-center py-1.5 rounded-lg text-[10px] font-bold text-slate-500 hover:text-slate-900"
            >
              <Fingerprint className="w-4 h-4 mb-0.5 text-slate-400" />
              <span>Operativa</span>
            </button>
            <button
              onClick={() => setActiveView('reputacion')}
              className={`touch-target-min flex flex-col items-center justify-center py-1.5 rounded-lg text-[10px] font-bold transition ${
                activeView === 'reputacion'
                  ? 'text-amber-700 bg-amber-50/80 font-black'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <Star className="w-4 h-4 mb-0.5 fill-amber-400 text-amber-500" />
              <span>Reputación</span>
            </button>
            <button
              onClick={() => setActiveView('director')}
              className="touch-target-min flex flex-col items-center justify-center py-1.5 rounded-lg text-[10px] font-bold text-slate-500 hover:text-slate-900"
            >
              <Cpu className="w-4 h-4 mb-0.5 text-slate-400" />
              <span>Suite</span>
            </button>
          </div>
        ) : activeView === 'operativa' ? (
          <div className="grid grid-cols-6 gap-0.5">
            {[
              { id: 'fichaje', label: 'Fichaje', icon: Fingerprint },
              { id: 'gastos', label: 'Gastos', icon: Receipt },
              { id: 'reservas_voz', label: 'Voz 24/7', icon: PhoneCall },
              { id: 'rrhh_turnos', label: 'Turnos', icon: Users },
              { id: 'economico_alertas', label: 'Tesorería', icon: LineChart },
              { id: 'monitor_sync', label: 'Sync PWA', icon: Database },
            ].map((m) => {
              const Icon = m.icon;
              const isActive = activeOperativaTab === m.id;
              return (
                <button
                  key={m.id}
                  onClick={() => setActiveOperativaTab(m.id as any)}
                  className={`touch-target-min flex flex-col items-center justify-center py-1 rounded-lg text-[9px] font-bold transition ${
                    isActive
                      ? 'text-[#0067B9] bg-blue-50/80 font-black'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                  aria-pressed={isActive}
                >
                  <Icon className={`w-4 h-4 mb-0.5 ${isActive ? 'text-[#0067B9]' : 'text-slate-400'}`} />
                  <span className="truncate max-w-[50px]">{m.label}</span>
                </button>
              );
            })}
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-1">
            {[
              { id: 'ux_ui_wireframes', label: 'Diseño UX', icon: LayoutTemplate },
              { id: 'project_plan_agile', label: 'Plan Ágil', icon: Kanban },
              { id: 'software_architecture', label: 'Arquitectura', icon: Cpu },
            ].map((d) => {
              const Icon = d.icon;
              const isActive = activeDirectorTab === d.id;
              return (
                <button
                  key={d.id}
                  onClick={() => setActiveDirectorTab(d.id as any)}
                  className={`touch-target-min flex flex-col items-center justify-center py-1.5 rounded-lg text-[11px] font-bold transition ${
                    isActive
                      ? 'text-[#022853] bg-slate-100 font-black'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                  aria-pressed={isActive}
                >
                  <Icon className={`w-4 h-4 mb-0.5 ${isActive ? 'text-[#022853]' : 'text-slate-400'}`} />
                  <span className="truncate">{d.label}</span>
                </button>
              );
            })}
          </div>
        )}
      </nav>

      {/* Footer info */}
      <footer className="border-t border-slate-200 bg-white/70 py-4 text-center text-xs text-slate-500 hidden md:block">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="font-bold text-[#022853]">{brandConfig.appName}</span>
            <span>· {brandConfig.tagline}</span>
          </div>
          <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#80D518]" />
            <span>PWA Offline-First · WCAG 2.2 AA · Guía de Marca Asexia</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
