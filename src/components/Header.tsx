import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { PWAInstallButton } from './pwa/PWAInstallButton';
import { SyncQueueDrawer } from './SyncQueueDrawer';
import { BrandSettingsModal } from './BrandSettingsModal';
import { NavigationBackButton } from './NavigationBackButton';
import {
  Wifi,
  WifiOff,
  Sliders,
  Smartphone,
  Briefcase,
  RefreshCw,
  Menu,
  X,
  ShieldCheck,
  Compass,
  Lightbulb,
  Volume2,
  Square,
  Bot,
  Star,
  Info,
  Home,
  ChevronDown,
  UserCheck,
  MessageCircle,
} from 'lucide-react';
import { PushNotificationManager } from './pwa/PushNotificationManager';
import { Confia360ExecutiveReportModal } from './help/Confia360ExecutiveReportModal';
import { UserProfileIdentityModal } from './UserProfileIdentityModal';
import { USER_ROLES } from '../types/userProfile';

export const Header: React.FC = () => {
  const {
    brandConfig,
    activeView,
    setActiveView,
    isOnline,
    isSimulatedOffline,
    toggleSimulatedOffline,
    pendingSyncCount,
    isSyncingNow,
    startTour,
    canGoBack,
    isPositionalHelpActive,
    togglePositionalHelp,
    isReadingCurrentScreen,
    toggleReadCurrentScreen,
    openDrawer360,
    isReportModalOpen,
    setIsReportModalOpen,
    activeRole,
    setActiveRole,
    businessIdentity,
    setIsIdentityModalOpen,
    openVoiceAssistant,
  } = useApp();

  const [isQueueOpen, setIsQueueOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-40 bg-[#022853] text-white shadow-lg border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-18">
            
            {/* Logo and Brand Identity */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setActiveView('inicio')}
                className="flex items-center gap-2.5 text-left focus:outline-none focus:ring-2 focus:ring-[#80D518] rounded-xl p-1"
                aria-label="Ir a inicio de AsexIA Confia360"
              >
                <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-[#0067B9] via-[#022853] to-[#022853] border border-white/20 flex items-center justify-center shadow-md overflow-hidden shrink-0">
                  <span className="font-brand font-black text-white text-xl tracking-tight">A</span>
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-[#80D518] border-2 border-[#022853]" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-brand font-black text-sm sm:text-base text-white tracking-wide whitespace-nowrap">
                      {brandConfig.appName}
                    </span>
                    <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded-full bg-[#80D518]/25 text-[#80D518] border border-[#80D518]/50 uppercase tracking-wider">
                      PWA
                    </span>
                  </div>
                  <p className="text-[11px] text-blue-200 hidden sm:block truncate max-w-[220px]">
                    {brandConfig.venueName}
                  </p>
                </div>
              </button>

              {/* Botón de Retroceso en Cabecera */}
              <NavigationBackButton variant="header" />

              {/* Main Mode Segmented Control (Desktop & Tablet) */}
              <nav className="hidden lg:flex items-center bg-[#011c3c] p-1 rounded-xl border border-white/15 ml-4 shadow-inner" aria-label="Navegación principal">
                <button
                  onClick={() => setActiveView('inicio')}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    activeView === 'inicio'
                      ? 'bg-white text-[#022853] shadow-sm ring-1 ring-white/20'
                      : 'text-blue-200 hover:text-white hover:bg-white/5'
                  }`}
                  aria-pressed={activeView === 'inicio'}
                >
                  <Home className={`w-3.5 h-3.5 ${activeView === 'inicio' ? 'text-[#022853]' : 'text-blue-300'}`} />
                  <span>Inicio (Módulos)</span>
                </button>
                <button
                  onClick={() => setActiveView('cockpit')}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    activeView === 'cockpit'
                      ? 'bg-[#0067B9] text-white shadow-sm ring-1 ring-white/20'
                      : 'text-blue-200 hover:text-white hover:bg-white/5'
                  }`}
                  aria-pressed={activeView === 'cockpit'}
                >
                  <span className="w-2 h-2 rounded-full bg-[#80D518]" />
                  <span>Cuadro de Mandos (Cockpit 360)</span>
                </button>
                <button
                  onClick={() => setActiveView('operativa')}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    activeView === 'operativa'
                      ? 'bg-[#0067B9] text-white shadow-sm ring-1 ring-white/20'
                      : 'text-blue-200 hover:text-white hover:bg-white/5'
                  }`}
                  aria-pressed={activeView === 'operativa'}
                >
                  <Smartphone className="w-3.5 h-3.5 text-[#80D518]" />
                  <span>Gestión Operativa (Core & Sectorial)</span>
                </button>
                <button
                  onClick={() => setActiveView('reputacion')}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    activeView === 'reputacion'
                      ? 'bg-[#0067B9] text-white shadow-sm ring-1 ring-white/20'
                      : 'text-blue-200 hover:text-white hover:bg-white/5'
                  }`}
                  aria-pressed={activeView === 'reputacion'}
                >
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span>Reputación & Encuestas</span>
                </button>
                <button
                  onClick={() => setActiveView('director')}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    activeView === 'director'
                      ? 'bg-[#0067B9] text-white shadow-sm ring-1 ring-white/20'
                      : 'text-blue-200 hover:text-white hover:bg-white/5'
                  }`}
                  aria-pressed={activeView === 'director'}
                >
                  <Briefcase className="w-3.5 h-3.5 text-[#D6A52A]" />
                  <span>Arquitectura & Docs</span>
                </button>
              </nav>
            </div>

            {/* Right Action Bar */}
            <div className="flex items-center gap-2 sm:gap-2.5">
              
              {/* Selector de Perfil & Datos de Identidad (Confia360) */}
              <div className="flex items-center gap-1 bg-[#011c3c]/90 border border-white/20 p-1 rounded-xl shadow-xs">
                {/* Selector de perfil activo */}
                <div className="relative">
                  <select
                    value={activeRole}
                    onChange={(e) => setActiveRole(e.target.value as any)}
                    className="bg-transparent text-white font-bold text-xs py-1 pl-2 pr-6 rounded-lg appearance-none cursor-pointer focus:outline-none focus:ring-1 focus:ring-[#80D518]"
                    title="Cambiar perfil activo (Autónomo, Comercial, Administración, Gestoría, Sector)"
                    aria-label="Seleccionar perfil activo"
                  >
                    {USER_ROLES.map((r) => (
                      <option key={r.id} value={r.id} className="bg-slate-900 text-white">
                        {r.title}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-blue-300 absolute right-1.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>

                {/* Botón de Identidad del Usuario - Abre datos fiscales y mercantiles al pulsar */}
                <button
                  onClick={() => setIsIdentityModalOpen(true)}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/35 border border-emerald-400/40 text-xs font-semibold text-emerald-300 hover:text-white transition shadow-sm"
                  title="Pulsar para ver datos de identidad, CIF, cuenta bancaria y certificado fiscal"
                  aria-label="Ver mis datos de identidad"
                >
                  <UserCheck className="w-3.5 h-3.5 text-[#80D518]" />
                  <div className="text-left hidden md:block">
                    <div className="text-[11px] font-bold leading-none">{businessIdentity.ownerName.split(' ')[0]}</div>
                    <div className="text-[9px] text-emerald-200 font-mono leading-none">{businessIdentity.cifNif}</div>
                  </div>
                  <span className="md:hidden text-[10px] font-bold">Identidad</span>
                </button>
              </div>

              {/* Botón WhatsApp 360 Asistente de Voz & Texto */}
              <button
                onClick={openVoiceAssistant}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-[#25D366]/20 hover:bg-[#25D366]/35 text-emerald-300 hover:text-white border border-[#25D366]/40 transition text-xs font-bold shadow-xs group"
                title="Abrir Asistente de Voz y Navegación WhatsApp 360"
                aria-label="Asistente de Voz y Navegación WhatsApp 360"
              >
                <div className="relative">
                  <MessageCircle className="w-3.5 h-3.5 fill-current text-[#25D366] group-hover:scale-110 transition-transform" />
                  <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full bg-[#80D518] animate-ping"></span>
                </div>
                <span className="hidden lg:inline text-[#80D518] group-hover:text-white transition-colors">Voz WhatsApp</span>
              </button>
              
              {/* Network Simulation Toggle */}
              <button
                onClick={toggleSimulatedOffline}
                className={`touch-target-min inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition shadow-xs ${
                  isSimulatedOffline
                    ? 'bg-amber-500/20 text-amber-300 border-amber-400/50 hover:bg-amber-500/30'
                    : 'bg-emerald-500/15 text-emerald-300 border-emerald-400/35 hover:bg-emerald-500/25'
                }`}
                title={isSimulatedOffline ? 'Reanudar conexión normal' : 'Simular cocina sin señal o corte de fibra'}
                aria-label={isSimulatedOffline ? 'Conexión simulada desconectada' : 'Conexión online activa'}
              >
                {isSimulatedOffline ? (
                  <>
                    <WifiOff className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                    <span className="hidden sm:inline">Offline Simulado</span>
                    <span className="sm:hidden">Offline</span>
                  </>
                ) : (
                  <>
                    <Wifi className="w-3.5 h-3.5 text-[#80D518]" />
                    <span className="hidden sm:inline">En Línea</span>
                    <span className="sm:hidden">Online</span>
                  </>
                )}
              </button>

              {/* Push Notifications Manager PWA */}
              <PushNotificationManager />

              {/* Universal 360 Drawer Launcher */}
              <button
                onClick={() => openDrawer360()}
                className="touch-target-min inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-black bg-gradient-to-r from-[#0067B9] to-[#022853] hover:from-[#005599] hover:to-[#011c3c] text-white border border-[#80D518]/60 shadow-md transition"
                title="Abrir Cajón Transversal de Navegación 360º"
                aria-label="Abrir navegación 360"
              >
                <Compass className="w-3.5 h-3.5 text-[#80D518]" />
                <span className="hidden md:inline">Cajón 360º</span>
                <span className="md:hidden">360º</span>
              </button>

              {/* Botón Informe Ejecutivo AsexIA Confia360 */}
              <button
                onClick={() => setIsReportModalOpen(true)}
                className="touch-target-min inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-bold bg-[#80D518]/20 hover:bg-[#80D518]/30 text-[#80D518] border border-[#80D518]/50 shadow-2xs transition"
                title="Ver informe ejecutivo y arquitectura del ecosistema AsexIA Confia360"
                aria-label="Abrir informe AsexIA Confia360"
              >
                <Info className="w-3.5 h-3.5" />
                <span className="hidden xl:inline">¿Qué es AsexIA Confia360?</span>
                <span className="xl:hidden">Informe</span>
              </button>

              {/* Screen Audio Narration Button (Oír Pantalla) */}
              <button
                onClick={toggleReadCurrentScreen}
                className={`touch-target-min inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-bold transition shadow-xs border ${
                  isReadingCurrentScreen
                    ? 'bg-[#80D518] text-[#022853] border-[#80D518] animate-pulse font-black'
                    : 'bg-white/10 hover:bg-white/20 text-white/90 border-white/15'
                }`}
                title={isReadingCurrentScreen ? 'Detener lectura en voz alta de esta pantalla' : 'Oír explicación de esta pantalla con voz'}
                aria-label={isReadingCurrentScreen ? 'Detener lectura en voz alta' : 'Oír esta pantalla'}
              >
                {isReadingCurrentScreen ? (
                  <>
                    <Square className="w-3.5 h-3.5 fill-current" />
                    <span className="hidden xl:inline">Pausar</span>
                  </>
                ) : (
                  <>
                    <Volume2 className="w-3.5 h-3.5 text-[#80D518]" />
                    <span className="hidden xl:inline">Oír Pantalla</span>
                  </>
                )}
              </button>

              {/* Guided Tour Trigger Button */}
              <button
                onClick={() => startTour('tour')}
                className="touch-target-min inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-bold bg-[#0067B9]/45 hover:bg-[#0067B9]/70 text-white border border-blue-400/40 transition shadow-xs"
                title="Iniciar tour guiado de AsexIA Confia360 PWA"
                aria-label="Abrir tour guiado de la aplicación"
              >
                <Compass className="w-3.5 h-3.5 text-[#80D518]" />
                <span className="hidden md:inline">Tour Guiado</span>
                <span className="md:hidden">Tour</span>
              </button>

              {/* Voice Agent Trigger Button (Preguntar y Llevarte) */}
              <button
                onClick={() => startTour('voice_agent')}
                className="touch-target-min inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-bold bg-[#0067B9]/45 hover:bg-[#0067B9]/70 text-white border border-blue-400/40 transition shadow-xs"
                title="Preguntar con voz al asistente y viajar al módulo"
                aria-label="Abrir asistente de voz"
              >
                <Bot className="w-3.5 h-3.5 text-[#80D518]" />
                <span className="hidden md:inline">Agente Voz</span>
                <span className="md:hidden">Voz</span>
              </button>

              {/* Positional Help Toggle Button */}
              <button
                onClick={togglePositionalHelp}
                className={`touch-target-min inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-bold transition shadow-xs border ${
                  isPositionalHelpActive
                    ? 'bg-amber-400 text-slate-950 border-amber-400 font-black ring-2 ring-amber-400/40'
                    : 'bg-white/10 hover:bg-white/20 text-white/90 border-white/15'
                }`}
                title={isPositionalHelpActive ? 'Desactivar balizas de ayuda posicional' : 'Activar balizas de ayuda posicional en pantalla'}
                aria-label="Alternar ayuda posicional"
                aria-pressed={isPositionalHelpActive}
              >
                <Lightbulb className={`w-3.5 h-3.5 ${isPositionalHelpActive ? 'fill-current text-slate-950' : 'text-amber-400'}`} />
                <span className="hidden lg:inline">Ayuda Posicional</span>
                <span className={`text-[10px] font-black uppercase px-1 py-0.2 rounded-full ${
                  isPositionalHelpActive ? 'bg-slate-900 text-amber-300' : 'bg-white/20 text-white'
                }`}>
                  {isPositionalHelpActive ? 'ON' : 'OFF'}
                </span>
              </button>

              {/* Sync Queue Drawer Trigger */}
              <button
                onClick={() => setIsQueueOpen(true)}
                className={`touch-target-min relative inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition border ${
                  pendingSyncCount > 0
                    ? 'bg-blue-600/35 text-white border-blue-400 hover:bg-blue-600/50 ring-2 ring-blue-400/30'
                    : 'bg-white/10 text-white/90 border-white/15 hover:bg-white/20'
                }`}
                aria-label={`Cola de sincronización: ${pendingSyncCount} elementos pendientes`}
              >
                <RefreshCw className={`w-3.5 h-3.5 text-[#80D518] ${isSyncingNow ? 'animate-sync-spin' : ''}`} />
                <span className="hidden md:inline">Cola:</span>
                <span className={`px-1.5 py-0.5 rounded-full text-[11px] font-black ${
                  pendingSyncCount > 0 ? 'bg-[#80D518] text-[#022853]' : 'bg-white/20 text-white'
                }`}>
                  {pendingSyncCount}
                </span>
              </button>

              {/* PWA Install Button (Desktop/Tablet) */}
              <div className="hidden sm:block">
                <PWAInstallButton />
              </div>

              {/* Settings / Brand Modal */}
              <button
                onClick={() => setIsSettingsOpen(true)}
                className="touch-target-min p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition border border-white/10"
                title="Configuración de Marca (Parametrizable) y Accesibilidad WCAG"
                aria-label="Abrir configuración de marca AsexIA Confia360 y accesibilidad"
              >
                <Sliders className="w-4 h-4" />
              </button>

              {/* Mobile Menu Hamburger */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden touch-target-min p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition border border-white/10"
                aria-label="Abrir menú de navegación móvil"
                aria-expanded={mobileMenuOpen}
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Mobile Dropdown Panel for Main Views */}
          {mobileMenuOpen && (
            <div className="lg:hidden py-3 border-t border-white/10 space-y-2 animate-in slide-in-from-top-2 duration-150">
              <div className="text-[11px] font-bold uppercase tracking-wider text-blue-200 px-1">
                Selecciona Modo de Aplicación:
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
                <button
                  onClick={() => {
                    setActiveView('inicio');
                    setMobileMenuOpen(false);
                  }}
                  className={`p-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition ${
                    activeView === 'inicio'
                      ? 'bg-white text-[#022853] shadow-md'
                      : 'bg-[#011c3c] text-blue-100 border border-white/10'
                  }`}
                >
                  <Home className={`w-4 h-4 ${activeView === 'inicio' ? 'text-[#022853]' : 'text-blue-300'}`} />
                  <span>Inicio (Módulos)</span>
                </button>
                <button
                  onClick={() => {
                    setActiveView('cockpit');
                    setMobileMenuOpen(false);
                  }}
                  className={`p-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition ${
                    activeView === 'cockpit'
                      ? 'bg-[#0067B9] text-white shadow-md'
                      : 'bg-[#011c3c] text-blue-100 border border-white/10'
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-[#80D518]" />
                  <span>Cuadro de Mandos (Cockpit)</span>
                </button>
                <button
                  onClick={() => {
                    setActiveView('operativa');
                    setMobileMenuOpen(false);
                  }}
                  className={`p-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition ${
                    activeView === 'operativa'
                      ? 'bg-[#0067B9] text-white shadow-md'
                      : 'bg-[#011c3c] text-blue-100 border border-white/10'
                  }`}
                >
                  <Smartphone className="w-4 h-4 text-[#80D518]" />
                  <span>App Operativa</span>
                </button>
                <button
                  onClick={() => {
                    setActiveView('director');
                    setMobileMenuOpen(false);
                  }}
                  className={`p-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition ${
                    activeView === 'director'
                      ? 'bg-[#0067B9] text-white shadow-md'
                      : 'bg-[#011c3c] text-blue-100 border border-white/10'
                  }`}
                >
                  <Briefcase className="w-4 h-4 text-[#D6A52A]" />
                  <span>Suite Dirección</span>
                </button>
                <button
                  onClick={() => {
                    setActiveView('reputacion');
                    setMobileMenuOpen(false);
                  }}
                  className={`p-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition ${
                    activeView === 'reputacion'
                      ? 'bg-[#0067B9] text-white shadow-md'
                      : 'bg-[#011c3c] text-blue-100 border border-white/10'
                  }`}
                >
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <span>Reputación (AsexIA Confia360)</span>
                </button>
              </div>

              <div className="pt-2 flex items-center justify-between text-xs text-blue-200 px-1">
                <span>{brandConfig.venueName}</span>
                <span className="text-[#80D518] font-bold">PWA Offline-First</span>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Sync Queue Drawer, Brand Settings Modal, Identity Modal & Confia360 Executive Report */}
      <SyncQueueDrawer isOpen={isQueueOpen} onClose={() => setIsQueueOpen(false)} />
      <BrandSettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
      <Confia360ExecutiveReportModal isOpen={isReportModalOpen} onClose={() => setIsReportModalOpen(false)} />
      <UserProfileIdentityModal />
    </>
  );
};
