import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { CONFIA_MODULES, SECTOR_OPTIONS } from '../../data/confiaModules';
import { ConfiaModule, BusinessSector } from '../../types/modules';
import { FavoritesConfigModal } from './FavoritesConfigModal';
import {
  LayoutDashboard,
  Camera,
  Receipt,
  CalendarCheck,
  Sparkles,
  Utensils,
  Fingerprint,
  CalendarDays,
  PhoneCall,
  Users,
  Scale,
  Star,
  QrCode,
  ShoppingBag,
  PackageCheck,
  ShieldCheck,
  Store,
  Boxes,
  Briefcase,
  Clock,
  FileText,
  Building2,
  Percent,
  BarChart3,
  ShieldAlert,
  FolderArchive,
  FileSignature,
  Sliders,
  CheckCircle2,
  ChevronRight,
  ArrowUpRight,
  Search,
  Filter,
  Layers,
  HelpCircle,
  Menu,
  Wifi,
  WifiOff,
  RefreshCw,
  ChevronDown,
  UserCheck,
  MessageCircle,
  Plus,
} from 'lucide-react';
import { USER_ROLES } from '../../types/userProfile';

interface ConfiaHomeViewProps {
  onOpenMobileMenu?: () => void;
}

export const ConfiaHomeView: React.FC<ConfiaHomeViewProps> = ({ onOpenMobileMenu }) => {
  const {
    brandConfig,
    setActiveView,
    setActiveOperativaTab,
    setActiveDirectorTab,
    openDrawer360,
    activeSector,
    setActiveSector,
    moduleStatusFilter,
    setModuleStatusFilter,
    pinnedDailyActions,
    isOnline,
    pendingSyncCount,
    isSyncingNow,
    triggerManualSync,
    startTour,
    setIsReportModalOpen,
    activeRole,
    setActiveRole,
    businessIdentity,
    setIsIdentityModalOpen,
    openVoiceAssistant,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [isFavoritesModalOpen, setIsFavoritesModalOpen] = useState(false);
  const [activationNoticeModule, setActivationNoticeModule] = useState<ConfiaModule | null>(null);

  // Dynamic Icon mapping
  const renderIcon = (iconName: string, className = 'w-5 h-5') => {
    switch (iconName) {
      case 'LayoutDashboard': return <LayoutDashboard className={className} />;
      case 'Camera': return <Camera className={className} />;
      case 'Receipt': return <Receipt className={className} />;
      case 'CalendarCheck': return <CalendarCheck className={className} />;
      case 'Sparkles': return <Sparkles className={className} />;
      case 'Utensils': return <Utensils className={className} />;
      case 'Fingerprint': return <Fingerprint className={className} />;
      case 'CalendarDays': return <CalendarDays className={className} />;
      case 'PhoneCall': return <PhoneCall className={className} />;
      case 'Users': return <Users className={className} />;
      case 'Scale': return <Scale className={className} />;
      case 'Star': return <Star className={className} />;
      case 'QrCode': return <QrCode className={className} />;
      case 'ShoppingBag': return <ShoppingBag className={className} />;
      case 'PackageCheck': return <PackageCheck className={className} />;
      case 'ShieldCheck': return <ShieldCheck className={className} />;
      case 'Store': return <Store className={className} />;
      case 'Boxes': return <Boxes className={className} />;
      case 'Briefcase': return <Briefcase className={className} />;
      case 'Clock': return <Clock className={className} />;
      case 'FileText': return <FileText className={className} />;
      case 'Building2': return <Building2 className={className} />;
      case 'Percent': return <Percent className={className} />;
      case 'BarChart3': return <BarChart3 className={className} />;
      case 'ShieldAlert': return <ShieldAlert className={className} />;
      case 'FolderArchive': return <FolderArchive className={className} />;
      case 'FileSignature': return <FileSignature className={className} />;
      default: return <Layers className={className} />;
    }
  };

  // Color scheme mappings for icon backgrounds
  const getColorClasses = (scheme: string) => {
    switch (scheme) {
      case 'navy':
        return 'bg-[#022853] text-white shadow-xs';
      case 'emerald':
        return 'bg-emerald-500 text-white shadow-xs';
      case 'blue':
        return 'bg-[#0067B9] text-white shadow-xs';
      case 'purple':
        return 'bg-purple-600 text-white shadow-xs';
      case 'amber':
        return 'bg-amber-500 text-white shadow-xs';
      case 'rose':
        return 'bg-rose-500 text-white shadow-xs';
      default:
        return 'bg-slate-700 text-white shadow-xs';
    }
  };

  // Handle click on any module card
  const handleModuleClick = (mod: ConfiaModule) => {
    if (mod.status === 'disponible' || mod.status === 'proximamente') {
      setActivationNoticeModule(mod);
      return;
    }

    if (mod.drawerHub) {
      openDrawer360(mod.drawerHub);
      return;
    }

    if (mod.id === 'dia_ia') {
      startTour('voice_agent');
      return;
    }

    if (mod.targetView) {
      setActiveView(mod.targetView);
      if (mod.targetOperativaTab) {
        setActiveOperativaTab(mod.targetOperativaTab);
      }
      if (mod.targetDirectorTab) {
        setActiveDirectorTab(mod.targetDirectorTab);
      }
    }
  };

  // Filter modules based on search, status filter, and sector
  const matchesSearch = (mod: ConfiaModule) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      mod.name.toLowerCase().includes(q) ||
      mod.subtitle.toLowerCase().includes(q) ||
      mod.description.toLowerCase().includes(q)
    );
  };

  const matchesStatus = (mod: ConfiaModule) => {
    if (moduleStatusFilter === 'todos') return true;
    if (moduleStatusFilter === 'activos') return mod.status === 'activo';
    if (moduleStatusFilter === 'disponibles') return mod.status === 'disponible' || mod.status === 'proximamente';
    return true;
  };

  // "Tu día a día" actions: prioritize pinned
  const dailyModules = CONFIA_MODULES.filter(
    (m) => pinnedDailyActions.includes(m.id) && matchesSearch(m)
  );

  // Sectorial modules for the active sector
  const sectorialModules = CONFIA_MODULES.filter(
    (m) => m.category === 'sectorial' && m.sector === activeSector && matchesSearch(m) && matchesStatus(m)
  );

  // Core universal modules
  const coreModules = CONFIA_MODULES.filter(
    (m) => m.category === 'gestion' && matchesSearch(m) && matchesStatus(m)
  );

  const activeSectorObj = SECTOR_OPTIONS.find((s) => s.id === activeSector) || SECTOR_OPTIONS[0];

  // Global counts for filter badges
  const totalCount = CONFIA_MODULES.filter(
    (m) => m.category !== 'dia_a_dia' && (!m.sector || m.sector === activeSector)
  ).length;
  const activeCount = CONFIA_MODULES.filter(
    (m) => m.status === 'activo' && m.category !== 'dia_a_dia' && (!m.sector || m.sector === activeSector)
  ).length;
  const availableCount = totalCount - activeCount;

  return (
    <div className="min-h-screen bg-[#F4F8FB] text-slate-800 pb-16">
      {/* Top Bar (Cloud Sync & User bar) */}
      <div className="bg-white border-b border-slate-200/80 sticky top-0 z-30 px-4 sm:px-8 py-3 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-3">
          {/* Mobile hamburger button */}
          <button
            onClick={onOpenMobileMenu}
            className="lg:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100 focus:outline-hidden"
            aria-label="Abrir menú lateral"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Sync status pill */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-50 border border-slate-200 text-xs font-medium text-slate-700">
            <span
              className={`w-2 h-2 rounded-full ${
                isOnline ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'
              }`}
            />
            <span className="hidden sm:inline">
              {isOnline ? 'Todo sincronizado' : 'Modo Offline Seguro'}
            </span>
            <span className="sm:hidden">{isOnline ? 'Online' : 'Offline'}</span>
            {pendingSyncCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold">
                {pendingSyncCount} pendientes
              </span>
            )}
            <button
              onClick={() => triggerManualSync()}
              disabled={isSyncingNow}
              className="text-slate-400 hover:text-slate-700 ml-0.5"
              title="Sincronizar ahora"
            >
              <RefreshCw className={`w-3 h-3 ${isSyncingNow ? 'animate-spin text-[#0067B9]' : ''}`} />
            </button>
          </div>
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Search Input on header for quick discovery */}
          <div className="relative hidden md:block">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar módulo o función..."
              className="pl-8 pr-3 py-1.5 rounded-xl text-xs bg-slate-100/80 border border-slate-200 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#0067B9] w-40 lg:w-56 transition-all"
            />
          </div>

          {/* Selector de perfil activo */}
          <div className="relative hidden sm:block">
            <select
              value={activeRole}
              onChange={(e) => setActiveRole(e.target.value as any)}
              className="bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-800 font-bold text-xs py-1.5 pl-2 pr-6 rounded-xl appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#0067B9] transition-colors"
              title="Cambiar perfil activo (Autónomo, Comercial, Administración, Gestoría, Sector)"
              aria-label="Seleccionar perfil activo"
            >
              {USER_ROLES.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.badge}
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-1.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Executive Report Helper */}
          <button
            onClick={() => setIsReportModalOpen(true)}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold shadow-2xs transition-colors"
            title="Ver informe sobre qué es AsexIA Confia360"
          >
            <HelpCircle className="w-3.5 h-3.5 text-[#0067B9]" />
            <span className="hidden lg:inline">Informe AsexIA Confia360</span>
          </button>

          {/* Asistente Voz WhatsApp Button */}
          <button
            onClick={() => openVoiceAssistant()}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-800 text-xs font-bold shadow-2xs transition-colors group"
            title="Abrir Asistente de Voz y Navegación WhatsApp 360"
            aria-label="Asistente de Voz y Navegación WhatsApp 360"
          >
            <MessageCircle className="w-3.5 h-3.5 text-[#25D366] fill-current group-hover:scale-110 transition-transform" />
            <span className="hidden sm:inline">Voz WhatsApp</span>
          </button>

          {/* User Identity Button - Displays User Data When Clicked */}
          <button
            onClick={() => setIsIdentityModalOpen(true)}
            className="flex items-center gap-2 p-1 sm:px-2.5 sm:py-1 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-800 transition-all shadow-2xs group"
            title="Pulsar para ver datos de identidad, CIF, cuenta bancaria y certificado fiscal"
            aria-label="Ver mis datos de identidad"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#80D518] to-emerald-400 text-slate-900 font-black text-xs flex items-center justify-center ring-2 ring-white shadow-2xs">
              {businessIdentity.ownerName.charAt(0)}
            </div>
            <div className="text-left hidden md:block">
              <p className="text-xs font-bold text-slate-800 leading-none group-hover:text-[#0067B9] transition-colors">
                {businessIdentity.ownerName.split(' ')[0]}
              </p>
              <p className="text-[10px] text-slate-500 font-mono leading-none mt-0.5">{businessIdentity.cifNif}</p>
            </div>
          </button>
        </div>
      </div>

      {/* Main Content Hub Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 pt-6 sm:pt-8 space-y-8">
        
        {/* Welcome Banner & Status Tabs (Matching reference layout) */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-2 border-b border-slate-200/60">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[11px] font-extrabold tracking-wider uppercase text-[#0067B9] bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200/60">
                CONFIA 360 • ECOSISTEMA INTEGRAL
              </span>
              <span className="text-xs text-slate-400 hidden sm:inline">|</span>
              <span className="text-xs text-slate-500 font-medium hidden sm:inline">
                {brandConfig.venueName}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight">
              Hola, Soyasexia
            </h1>
            <p className="text-sm sm:text-base text-slate-500 mt-0.5">
              ¿Qué quieres hacer hoy en tu negocio?
            </p>
          </div>

          {/* Top Filter Buttons (Todos | Activos | Disponibles) */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="inline-flex p-1 bg-white rounded-2xl border border-slate-200 shadow-2xs">
              <button
                onClick={() => setModuleStatusFilter('todos')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  moduleStatusFilter === 'todos'
                    ? 'bg-[#022853] text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                }`}
              >
                <span>Todos</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                  moduleStatusFilter === 'todos' ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
                }`}>
                  {totalCount}
                </span>
              </button>

              <button
                onClick={() => setModuleStatusFilter('activos')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  moduleStatusFilter === 'activos'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                }`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span>Activos</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                  moduleStatusFilter === 'activos' ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
                }`}>
                  {activeCount}
                </span>
              </button>

              <button
                onClick={() => setModuleStatusFilter('disponibles')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  moduleStatusFilter === 'disponibles'
                    ? 'bg-[#0067B9] text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                }`}
              >
                <span>Disponibles</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                  moduleStatusFilter === 'disponibles' ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
                }`}>
                  {availableCount}
                </span>
              </button>
            </div>

            {/* Sector Selector Dropdown */}
            <div className="relative">
              <select
                value={activeSector}
                onChange={(e) => setActiveSector(e.target.value as BusinessSector)}
                className="appearance-none bg-white border border-slate-200 text-slate-800 text-xs font-bold py-2 pl-3.5 pr-8 rounded-2xl shadow-2xs hover:border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-[#0067B9] cursor-pointer"
              >
                {SECTOR_OPTIONS.map((sec) => (
                  <option key={sec.id} value={sec.id}>
                    Sector: {sec.name}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2.5 text-slate-500">
                <ChevronRight className="w-3.5 h-3.5 rotate-90" />
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 1: TU DÍA A DÍA (Quick Access) */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xs font-extrabold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                <span>Tu día a día</span>
                <span className="text-slate-300">•</span>
                <span className="normal-case font-medium text-slate-500">
                  Accesos frecuentes con notificaciones en vivo
                </span>
              </h2>
            </div>
            <button
              onClick={() => setIsFavoritesModalOpen(true)}
              className="flex items-center gap-1.5 text-xs font-bold text-[#0067B9] hover:text-[#022853] px-3 py-1 rounded-xl bg-blue-50/70 hover:bg-blue-100/60 transition-colors"
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Personalizar</span>
            </button>
          </div>

          {/* Large rounded action cards matching reference */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5 sm:gap-4">
            {dailyModules.map((item) => (
              <div
                key={item.id}
                onClick={() => handleModuleClick(item)}
                className="group relative bg-white rounded-3xl p-4 sm:p-5 border border-slate-200/90 shadow-2xs hover:shadow-md hover:border-blue-300/80 transition-all cursor-pointer flex flex-col justify-between min-h-[140px]"
              >
                {/* Top Tile Row: Icon square + Badge */}
                <div className="flex items-start justify-between">
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-105 ${getColorClasses(
                      item.colorScheme
                    )}`}
                  >
                    {renderIcon(item.iconName, 'w-6 h-6')}
                  </div>

                  {item.badgeCount !== undefined && item.badgeCount > 0 && (
                    <span className="w-6 h-6 rounded-full bg-rose-500 text-white font-extrabold text-xs flex items-center justify-center shadow-xs animate-bounce">
                      {item.badgeCount}
                    </span>
                  )}

                  {item.badgeText && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                      {item.badgeText}
                    </span>
                  )}
                </div>

                {/* Bottom title & arrow */}
                <div className="mt-3">
                  <h3 className="font-bold text-slate-900 text-sm sm:text-base group-hover:text-[#0067B9] transition-colors leading-snug">
                    {item.name}
                  </h3>
                  <p className="text-[11px] text-slate-500 truncate mt-0.5">
                    {item.subtitle}
                  </p>
                </div>
              </div>
            ))}

            {/* Customizer Placeholder Card */}
            <button
              onClick={() => setIsFavoritesModalOpen(true)}
              className="border-2 border-dashed border-slate-200 hover:border-[#0067B9] rounded-3xl p-4 flex flex-col items-center justify-center gap-2 text-slate-400 hover:text-[#0067B9] hover:bg-blue-50/20 transition-all min-h-[140px]"
            >
              <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center">
                <Plus className="w-5 h-5 text-slate-500" />
              </div>
              <span className="text-xs font-bold">Añadir acceso</span>
            </button>
          </div>
        </section>

        {/* SECTION 2: MÓDULOS SECTORIALES (HOSTELERÍA / RESTAURANTES O SECTOR SELECCIONADO) */}
        <section className="space-y-3 pt-2">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-1">
            <div className="flex items-center gap-2.5">
              <h2 className="text-xs font-extrabold text-slate-500 uppercase tracking-wider">
                Módulos Sectoriales: {activeSectorObj.name}
              </h2>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200">
                Específico de actividad
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Adaptados a las operaciones reales de {activeSectorObj.tag}
            </p>
          </div>

          {sectorialModules.length === 0 ? (
            <div className="bg-white rounded-3xl p-8 border border-slate-200 text-center space-y-2">
              <p className="text-sm font-semibold text-slate-700">
                No hay módulos que coincidan con los filtros aplicados.
              </p>
              <button
                onClick={() => setModuleStatusFilter('todos')}
                className="text-xs font-bold text-[#0067B9] hover:underline"
              >
                Ver todos los módulos
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {sectorialModules.map((item) => {
                const isActive = item.status === 'activo';
                return (
                  <div
                    key={item.id}
                    onClick={() => handleModuleClick(item)}
                    className={`group bg-white rounded-3xl p-5 border transition-all cursor-pointer flex flex-col justify-between ${
                      isActive
                        ? 'border-slate-200/90 shadow-2xs hover:shadow-md hover:border-blue-300'
                        : 'border-slate-200/60 opacity-80 hover:opacity-100 hover:border-slate-300 bg-slate-50/40'
                    }`}
                  >
                    <div>
                      {/* Card Top: Icon & Status */}
                      <div className="flex items-center justify-between mb-3.5">
                        <div
                          className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-105 ${getColorClasses(
                            item.colorScheme
                          )}`}
                        >
                          {renderIcon(item.iconName, 'w-5 h-5')}
                        </div>

                        <div className="flex items-center gap-2">
                          {isActive ? (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200/70">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                              Activo
                            </span>
                          ) : (
                            <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-500 border border-slate-200">
                              Próximamente
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Title & subtitle */}
                      <h3 className="font-bold text-slate-900 text-base group-hover:text-[#0067B9] transition-colors">
                        {item.name}
                      </h3>
                      <p className="text-xs font-medium text-slate-400 mt-0.5">
                        {item.subtitle}
                      </p>
                      <p className="text-xs text-slate-600 mt-2 line-clamp-2 leading-relaxed">
                        {item.description}
                      </p>
                    </div>

                    {/* Bottom Metadata & Drill-down button */}
                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                      {item.badgeText ? (
                        <span className="font-bold text-slate-700 bg-slate-100/90 px-2 py-0.5 rounded-md border border-slate-200/80">
                          {item.badgeText}
                        </span>
                      ) : (
                        <span className="text-slate-400">Sectorial</span>
                      )}

                      <div className="flex items-center gap-1 text-[#0067B9] font-bold group-hover:translate-x-0.5 transition-transform">
                        <span>{isActive ? 'Abrir módulo' : 'Solicitar demo'}</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* SECTION 3: GESTIÓN EMPRESARIAL & CORE UNIVERSAL */}
        <section className="space-y-3 pt-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-1">
            <div className="flex items-center gap-2.5">
              <h2 className="text-xs font-extrabold text-slate-500 uppercase tracking-wider">
                Gestión Empresarial • Core Universal AsexIA Confia360
              </h2>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 border border-blue-200">
                Core Pyme Universal
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Válido para cualquier pyme o autónomo (Clientes, Facturas, Gastos, Banca, Fiscal)
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {coreModules.map((item) => {
              const isActive = item.status === 'activo';
              return (
                <div
                  key={item.id}
                  onClick={() => handleModuleClick(item)}
                  className={`group bg-white rounded-3xl p-5 border transition-all cursor-pointer flex flex-col justify-between ${
                    isActive
                      ? 'border-slate-200/90 shadow-2xs hover:shadow-md hover:border-blue-300'
                      : 'border-slate-200/60 opacity-80 hover:opacity-100 hover:border-slate-300 bg-slate-50/40'
                  }`}
                >
                  <div>
                    {/* Card Top: Icon & Status */}
                    <div className="flex items-center justify-between mb-3.5">
                      <div
                        className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-105 ${getColorClasses(
                          item.colorScheme
                        )}`}
                      >
                        {renderIcon(item.iconName, 'w-5 h-5')}
                      </div>

                      {isActive ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          Activo
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 text-slate-500 border border-slate-200">
                          Disponible
                        </span>
                      )}
                    </div>

                    <h3 className="font-bold text-slate-900 text-sm sm:text-base group-hover:text-[#0067B9] transition-colors">
                      {item.name}
                    </h3>
                    <p className="text-[11px] font-semibold text-[#0067B9] mt-0.5">
                      {item.subtitle}
                    </p>
                    <p className="text-xs text-slate-600 mt-2 line-clamp-2 leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                    {item.badgeText ? (
                      <span className="font-semibold text-[11px] text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md">
                        {item.badgeText}
                      </span>
                    ) : (
                      <span className="text-[11px] text-slate-400">Core 360</span>
                    )}

                    <div className="flex items-center gap-1 text-[#0067B9] font-bold group-hover:translate-x-0.5 transition-transform text-xs">
                      <span>{isActive ? 'Abrir' : 'Ver'}</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* SECTION 4: INFORME EJECUTIVO & NAVEGACIÓN 360 BANNER */}
        <div className="bg-gradient-to-r from-[#022853] via-[#0067B9] to-[#022853] rounded-3xl p-6 sm:p-8 text-white shadow-lg relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl relative z-10">
            <span className="px-2.5 py-1 rounded-full bg-[#80D518]/25 text-[#80D518] border border-[#80D518]/40 text-xs font-bold tracking-wide uppercase">
              ARQUITECTURA DE DATOS ÚNICA
            </span>
            <h3 className="text-xl sm:text-2xl font-black tracking-tight text-white">
              ¿Por qué AsexIA Confia360 es diferente a un CRM o software tradicional?
            </h3>
            <p className="text-xs sm:text-sm text-blue-100/90 leading-relaxed">
              Trata de principio a final la información de autónomos y pymes con un core central universal y módulos sectoriales integrados. Permite desglosar cualquier total, seleccionar un registro y navegar en 360° por todas las entidades asociadas con alarmas y predicción.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0 relative z-10 w-full sm:w-auto">
            <button
              onClick={() => setIsReportModalOpen(true)}
              className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-white text-[#022853] font-bold text-xs hover:bg-blue-50 transition-all shadow-md flex items-center justify-center gap-2"
            >
              <FileText className="w-4 h-4 text-[#0067B9]" />
              <span>Ver Informe Completo</span>
            </button>
            <button
              onClick={() => openDrawer360('factura')}
              className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs border border-white/20 transition-all flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-[#80D518]" />
              <span>Probar Navegación360</span>
            </button>
          </div>
        </div>
      </div>

      {/* Modal for Customizing Favorites */}
      <FavoritesConfigModal
        isOpen={isFavoritesModalOpen}
        onClose={() => setIsFavoritesModalOpen(false)}
      />

      {/* Modal for Available Module Notice / Demo */}
      {activationNoticeModule && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-md p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div
                className={`w-12 h-12 rounded-2xl flex items-center justify-center ${getColorClasses(
                  activationNoticeModule.colorScheme
                )}`}
              >
                {renderIcon(activationNoticeModule.iconName, 'w-6 h-6')}
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#0067B9] bg-blue-50 px-2 py-0.5 rounded-md">
                  Módulo Disponible en Catálogo
                </span>
                <h3 className="font-bold text-slate-900 text-lg leading-tight mt-0.5">
                  {activationNoticeModule.name}
                </h3>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              {activationNoticeModule.description}
            </p>

            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs text-slate-700 space-y-1">
              <p className="font-bold text-slate-800">Integración con el Core AsexIA Confia360:</p>
              <p className="text-slate-600">
                Este módulo se activa sin duplicar datos ni requerir migraciones complejas. Utiliza la misma base de clientes, compras, asientos contables y cuadro de mando.
              </p>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setActivationNoticeModule(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
              >
                Cerrar
              </button>
              <button
                onClick={() => {
                  setActivationNoticeModule(null);
                  openDrawer360('factura');
                }}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-[#0067B9] hover:bg-[#022853] text-white shadow-xs"
              >
                Ver Demo en Navegación360
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
