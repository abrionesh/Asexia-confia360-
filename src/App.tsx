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
import { PWAUpdatePrompt } from './components/pwa/PWAUpdatePrompt';
import { PositionalHelpFloatingBar } from './components/help/PositionalHelpFloatingBar';
import { ReputationModule } from './components/reputation/ReputationModule';
import { UniversalDrawer360 } from './components/navigation360/UniversalDrawer360';
import { ConfiaSidebar } from './components/home/ConfiaSidebar';
import { ConfiaHomeView } from './components/home/ConfiaHomeView';
import { ProfileExecutiveSummary } from './components/ProfileExecutiveSummary';
import { ModuleDashboardSummary } from './components/operativa/ModuleDashboardSummary';
import { UserProfileIdentityModal } from './components/UserProfileIdentityModal';
import { WhatsAppVoiceAssistant } from './components/chat/WhatsAppVoiceAssistant';
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
  Home,
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

  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = React.useState(false);

  return (
    <div
      className={`min-h-screen flex transition-colors duration-200 ${
        brandConfig.highContrast ? 'bg-slate-900 text-slate-100' : 'bg-[#F4F8FB] text-slate-800'
      }`}
      style={{ fontSize: `${brandConfig.fontScale * 100}%` }}
    >
      {/* Corporate Left Sidebar (Desktop permanent / Mobile off-canvas) */}
      <ConfiaSidebar
        isOpenMobile={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
      />

      {/* Main Content Column */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen overflow-x-hidden">
        {/* Accessibility Screen-Reader Live Region */}
        <AriaLiveAnnouncer />

        {/* Interactive QuickStart Tour Modal & Voice Guide */}
        <QuickStartTour />

        {/* Positional Help & System-Wide Floating Bar */}
        <PositionalHelpFloatingBar />

        {/* Universal 360 Transversal Floating Drawer */}
        <UniversalDrawer360 />

        {/* Global User Profile & Identity Modal (Confia360) */}
        <UserProfileIdentityModal />

        {/* WhatsApp-Style Voice & Text Floating Assistant */}
        <WhatsAppVoiceAssistant />

        {/* PWA Service Worker Update & Offline-Ready Prompt */}
        <PWAUpdatePrompt />

        {/* ========================================================= */}
        {/* VIEW: INICIO Y CATÁLOGO DE MÓDULOS ACTIVOS / DISPONIBLES   */}
        {/* ========================================================= */}
        {activeView === 'inicio' ? (
          <ConfiaHomeView onOpenMobileMenu={() => setIsMobileSidebarOpen(true)} />
        ) : (
          <>
            {/* Brand Header for Non-Inicio Views */}
            <Header />

            {/* Main Content Area */}
            <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-5 space-y-4 pb-28 sm:pb-16">
              {/* Tour Completion Banner: Touch anywhere to dismiss */}
              <TourCompletionBanner />

              {/* Contextual Back Button & Breadcrumb Banner */}
              <NavigationBackButton variant="banner" />

              {/* ========================================================= */}
              {/* VIEW 0: CUADRO DE MANDOS EJECUTIVO (COCKPIT 360 DASH-001) */}
              {/* ========================================================= */}
              {activeView === 'cockpit' && (
                <div className="space-y-4 animate-in fade-in duration-150">
                  <ProfileExecutiveSummary />
                  <CockpitDashboard />
                </div>
              )}

        {/* ========================================================= */}
        {/* VIEW 1: APP OPERATIVA PWA (EN VIVO PARA HOSTELERÍA)       */}
        {/* ========================================================= */}
        {activeView === 'operativa' && (
          <div className="space-y-4">
            {/* Cuadro de Mando del Propio Módulo con KPIs, Datos y Acciones Específicas */}
            <ModuleDashboardSummary />

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
          <section className="animate-in fade-in duration-200" aria-label="Módulo AsexIA Confia360 Reputación">
            <ReputationModule />
          </section>
        )}
      </main>
    </>
  )}

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
