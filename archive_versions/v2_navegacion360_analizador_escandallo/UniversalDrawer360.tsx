import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  ENTITY_HUBS_360,
  EntityHubType,
  EntityRelationLink,
  getAllEntityHubs,
} from '../../services/dataModel360';
import { ArticlePriceMarginAnalysis360 } from './ArticlePriceMarginAnalysis360';
import {
  X,
  ArrowLeft,
  ArrowRight,
  ExternalLink,
  ShieldCheck,
  Layers,
  Package,
  Utensils,
  Calendar,
  User,
  Clock,
  DollarSign,
  FileCheck,
  FileText,
  Sparkles,
  Star,
  Megaphone,
  Truck,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Compass,
  ChevronRight,
  History,
  CheckCircle2,
  Filter,
  Activity,
  Maximize2,
  Scale,
  Sliders,
} from 'lucide-react';

export const UniversalDrawer360: React.FC = () => {
  const {
    isDrawer360Open,
    drawer360Hub,
    drawer360History,
    closeDrawer360,
    navigateDrawer360,
    goBackDrawer360,
    setActiveView,
    setActiveOperativaTab,
    announceAriaLive,
  } = useApp();

  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>('todos');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [articleDrawerTab, setArticleDrawerTab] = useState<'comparador' | 'relaciones'>('comparador');

  // Auto-expand when viewing article to provide comfortable analysis space
  useEffect(() => {
    if (drawer360Hub === 'articulo_producto') {
      setIsExpanded(true);
      setArticleDrawerTab('comparador');
    }
  }, [drawer360Hub]);

  // Close with Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isDrawer360Open) {
        closeDrawer360();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isDrawer360Open, closeDrawer360]);

  if (!isDrawer360Open) return null;

  const currentHubData = ENTITY_HUBS_360[drawer360Hub] || ENTITY_HUBS_360['albaran'];
  const allHubs = getAllEntityHubs();

  const getHubIcon = (hubType: EntityHubType, className: string = 'w-5 h-5') => {
    switch (hubType) {
      case 'albaran':
        return <Truck className={`${className} text-amber-600`} />;
      case 'factura':
        return <FileText className={`${className} text-[#0067B9]`} />;
      case 'linea_factura':
        return <Layers className={`${className} text-indigo-600`} />;
      case 'articulo_producto':
        return <Package className={`${className} text-amber-600`} />;
      case 'receta':
        return <Utensils className={`${className} text-rose-600`} />;
      case 'plato_escandallo':
        return <Utensils className={`${className} text-purple-600`} />;
      case 'reserva':
        return <Calendar className={`${className} text-[#0067B9]`} />;
      case 'cliente':
        return <User className={`${className} text-[#D6A52A]`} />;
      case 'turno':
        return <Clock className={`${className} text-emerald-600`} />;
      case 'gastos':
        return <DollarSign className={`${className} text-teal-600`} />;
      case 'documento':
        return <FileCheck className={`${className} text-blue-700`} />;
      case 'reputacion':
        return <Star className={`${className} text-amber-500 fill-amber-400`} />;
      case 'campana':
        return <Megaphone className={`${className} text-violet-600`} />;
      default:
        return <Sparkles className={`${className} text-slate-600`} />;
    }
  };

  const getHubLabel = (hubType: EntityHubType): string => {
    const found = allHubs.find((h) => h.id === hubType);
    return found ? found.short : hubType;
  };

  const handleJumpToLiveScreen = (rel: EntityRelationLink) => {
    if (rel.actionTargetView) {
      setActiveView(rel.actionTargetView);
      if (rel.actionOperativaTab) {
        setActiveOperativaTab(rel.actionOperativaTab);
      }
      announceAriaLive(`Navegando a pantalla en vivo: ${rel.actionModuleName || rel.label}`);
      // Keep drawer open or minimized so user doesn't lose context
    }
  };

  // Filter relations
  const filteredRelations = (currentHubData.navigableRelations || []).filter((rel) => {
    if (activeCategoryFilter !== 'todos') {
      if (activeCategoryFilter === 'costes_financiero' && rel.category !== 'costes_financiero') return false;
      if (activeCategoryFilter === 'calidad_reputacion' && rel.category !== 'calidad_reputacion') return false;
      if (activeCategoryFilter === 'trazabilidad' && rel.category !== 'trazabilidad') return false;
      if (activeCategoryFilter === 'operativa' && rel.category !== 'operativa') return false;
    }

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      const matchLabel = rel.label.toLowerCase().includes(term);
      const matchDesc = rel.description.toLowerCase().includes(term);
      const matchBadge = rel.badge && rel.badge.toLowerCase().includes(term);
      return matchLabel || matchDesc || matchBadge;
    }

    return true;
  });

  // Check if current entity is part of product trilogy
  const isTrilogyEntity = ['articulo_producto', 'receta', 'plato_escandallo', 'albaran'].includes(drawer360Hub);

  return (
    <div
      className="fixed inset-0 z-50 overflow-hidden flex justify-end bg-slate-900/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="drawer360-title"
    >
      {/* Click outside to close */}
      <div
        className="flex-1 cursor-pointer"
        onClick={closeDrawer360}
        aria-hidden="true"
      />

      {/* Drawer Surface */}
      <div
        className={`w-full ${
          isExpanded ? 'max-w-4xl' : 'max-w-2xl'
        } bg-white shadow-2xl h-full flex flex-col border-l border-slate-200 transition-all duration-300 transform translate-x-0 overflow-hidden`}
      >
        {/* TOP BAR: Breadcrumbs, Expand & Close */}
        <div className="bg-[#022853] text-white p-3.5 sm:p-4 border-b border-blue-900/60 flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-none py-1">
            <button
              onClick={goBackDrawer360}
              disabled={drawer360History.length <= 1}
              className={`p-1.5 rounded-lg border text-xs font-bold flex items-center gap-1 transition shrink-0 ${
                drawer360History.length > 1
                  ? 'bg-white/10 hover:bg-white/20 text-white border-white/20'
                  : 'opacity-40 cursor-not-allowed border-transparent text-white/50'
              }`}
              title="Volver a la entidad anterior"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Atrás</span>
            </button>

            {/* Breadcrumb Jump Trail */}
            <div className="flex items-center gap-1.5 text-xs overflow-x-auto whitespace-nowrap pl-1">
              <span className="text-[10px] uppercase font-black tracking-wider text-[#80D518] flex items-center gap-1 mr-1">
                <Compass className="w-3 h-3" /> 360º:
              </span>
              {drawer360History.map((hub, idx) => {
                const isLast = idx === drawer360History.length - 1;
                return (
                  <React.Fragment key={`${hub}-${idx}`}>
                    {idx > 0 && <ChevronRight className="w-3 h-3 text-white/40 shrink-0" />}
                    <button
                      onClick={() => navigateDrawer360(hub)}
                      className={`text-xs px-2 py-0.5 rounded-md font-bold transition flex items-center gap-1 ${
                        isLast
                          ? 'bg-[#80D518] text-[#022853] font-black shadow-2xs'
                          : 'text-white/80 hover:text-white hover:bg-white/10'
                      }`}
                      title={`Ir a ${getHubLabel(hub)}`}
                    >
                      {getHubLabel(hub)}
                    </button>
                  </React.Fragment>
                );
              })}
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            {/* Version indicator badge */}
            <span
              className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-blue-900/80 text-blue-200 border border-blue-700/60 hidden sm:inline-block"
              title="Versión 2.0 con backup v1 guardado"
            >
              v2.0 Universal
            </span>

            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition hidden md:block"
              title={isExpanded ? 'Contraer cajón' : 'Expandir cajón'}
            >
              <Maximize2 className="w-4 h-4" />
            </button>

            <button
              onClick={closeDrawer360}
              className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/15 transition"
              title="Cerrar cajón transversal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* QUICK HUB SWITCHER BAR (13 HUBS) */}
        <div className="bg-slate-100/90 border-b border-slate-200 px-3 py-2 flex items-center gap-1.5 overflow-x-auto scrollbar-none shrink-0">
          <span className="text-[10px] font-black uppercase text-slate-500 tracking-wider shrink-0 mr-1 flex items-center gap-1">
            <Layers className="w-3 h-3" /> Saltar a Hub:
          </span>
          {allHubs.map((hub) => {
            const isCurrent = drawer360Hub === hub.id;
            return (
              <button
                key={hub.id}
                onClick={() => navigateDrawer360(hub.id)}
                className={`text-xs px-2.5 py-1 rounded-lg font-bold shrink-0 transition flex items-center gap-1.5 border ${
                  isCurrent
                    ? 'bg-[#0067B9] text-white border-[#0067B9] shadow-xs'
                    : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'
                }`}
              >
                {getHubIcon(hub.id, 'w-3.5 h-3.5')}
                <span>{hub.short}</span>
              </button>
            );
          })}
        </div>

        {/* SCROLLABLE MAIN CONTENT */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
          {/* ENTITY HERO HEADER */}
          <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-start justify-between gap-3 flex-wrap sm:flex-nowrap">
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center shrink-0 border border-slate-200 shadow-2xs">
                  {getHubIcon(drawer360Hub, 'w-7 h-7')}
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className="text-xs font-mono font-black uppercase px-2 py-0.5 rounded bg-slate-900 text-white">
                      {currentHubData.code}
                    </span>
                    {currentHubData.statusBadge && (
                      <span
                        className={`text-xs font-bold px-2 py-0.5 rounded-full border ${currentHubData.statusBadge.color}`}
                      >
                        {currentHubData.statusBadge.label}
                      </span>
                    )}
                  </div>
                  <h2 id="drawer360-title" className="text-base sm:text-lg font-black text-slate-900 leading-tight">
                    {currentHubData.title}
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
                    {currentHubData.subtitle}
                  </p>
                </div>
              </div>
            </div>

            {/* AUDIT & SHA-256 STRIP */}
            <div className="bg-slate-50 rounded-xl p-2.5 border border-slate-200 text-slate-600 text-[11px] flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-1.5 font-mono">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="font-bold text-slate-800">Auditoría Criptográfica:</span>
                <span className="text-slate-500 truncate max-w-[140px] sm:max-w-none">
                  {currentHubData.auditInfo.hash}
                </span>
              </div>
              <div className="flex items-center gap-3 text-slate-500">
                <span>Por: <strong className="text-slate-700">{currentHubData.auditInfo.lastUser}</strong></span>
                <span>{currentHubData.auditInfo.timestamp}</span>
              </div>
            </div>
          </div>

          {/* DUAL MODE SELECTOR FOR ARTICLE: LIVE COMPARATOR VS 360 RELATIONS */}
          {drawer360Hub === 'articulo_producto' && (
            <div className="bg-slate-100 p-1.5 rounded-2xl flex items-center gap-1.5 border border-slate-200 shadow-2xs">
              <button
                onClick={() => setArticleDrawerTab('comparador')}
                className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 ${
                  articleDrawerTab === 'comparador'
                    ? 'bg-[#022853] text-white shadow-xs font-black'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/70'
                }`}
              >
                <Scale className="w-4 h-4 text-[#80D518]" />
                <span>Comparador en Vivo: Coste vs Facturas & Escandallo</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-[#80D518] text-[#022853] font-black">
                  Activo
                </span>
              </button>
              <button
                onClick={() => setArticleDrawerTab('relaciones')}
                className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 ${
                  articleDrawerTab === 'relaciones'
                    ? 'bg-[#022853] text-white shadow-xs font-black'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/70'
                }`}
              >
                <Compass className="w-4 h-4 text-[#0067B9]" />
                <span>Red Relacional 360º ({filteredRelations.length})</span>
              </button>
            </div>
          )}

          {/* RENDER ARTICLE PRICE & ESCANDALLO ANALYSIS IF IN COMPARATOR MODE */}
          {drawer360Hub === 'articulo_producto' && articleDrawerTab === 'comparador' && (
            <div className="space-y-4">
              <ArticlePriceMarginAnalysis360 onNavigateHub={navigateDrawer360} />
            </div>
          )}

          {/* TRILOGY OF PRODUCT / CHAIN OF TRACEABILITY (When applicable) */}
          {isTrilogyEntity && (drawer360Hub !== 'articulo_producto' || articleDrawerTab === 'relaciones') && (
            <div className="bg-gradient-to-r from-blue-50/70 via-indigo-50/50 to-purple-50/70 rounded-2xl p-4 border border-blue-200/80 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-black uppercase tracking-wider text-[#022853] flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-[#0067B9]" />
                  Cadena de Trazabilidad & Trilogía de Producto
                </span>
                <span className="text-[10px] font-bold text-blue-700 bg-blue-100/80 px-2 py-0.5 rounded-full">
                  Cero Pantallas Aisladas
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  {
                    hub: 'albaran' as EntityHubType,
                    title: '1. Albarán',
                    sub: 'Recepción Muelle',
                    icon: Truck,
                    color: 'text-amber-700',
                  },
                  {
                    hub: 'articulo_producto' as EntityHubType,
                    title: '2. Artículo',
                    sub: 'Materia Prima Stock',
                    icon: Package,
                    color: 'text-amber-600',
                  },
                  {
                    hub: 'receta' as EntityHubType,
                    title: '3. Receta',
                    sub: 'Escandallo & Merma',
                    icon: Utensils,
                    color: 'text-rose-600',
                  },
                  {
                    hub: 'plato_escandallo' as EntityHubType,
                    title: '4. Plato Carta',
                    sub: 'Venta & PVP',
                    icon: Utensils,
                    color: 'text-purple-600',
                  },
                ].map((step) => {
                  const Icon = step.icon;
                  const isCurrent = drawer360Hub === step.hub;
                  return (
                    <button
                      key={step.hub}
                      onClick={() => navigateDrawer360(step.hub)}
                      className={`p-2 rounded-xl text-left border transition ${
                        isCurrent
                          ? 'bg-[#022853] text-white border-[#022853] shadow-xs'
                          : 'bg-white hover:bg-slate-50 text-slate-800 border-slate-200'
                      }`}
                    >
                      <div className="flex items-center gap-1.5 mb-1">
                        <Icon className={`w-3.5 h-3.5 ${isCurrent ? 'text-[#80D518]' : step.color}`} />
                        <span className={`text-[11px] font-bold truncate ${isCurrent ? 'text-white' : 'text-slate-900'}`}>
                          {step.title}
                        </span>
                      </div>
                      <span className={`text-[10px] block truncate ${isCurrent ? 'text-blue-200' : 'text-slate-500'}`}>
                        {step.sub}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* STANDARD METRICS & RELATIONS (Shown for all other hubs or in relaciones tab) */}
          {(drawer360Hub !== 'articulo_producto' || articleDrawerTab === 'relaciones') && (
            <>
              {/* KEY METRICS GRID */}
              <div className="space-y-2">
                <h3 className="text-xs font-black uppercase text-slate-500 tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#0067B9]" />
                  Métricas Maestras de la Entidad
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {Object.entries(currentHubData.keyMetrics || {}).map(([key, value]) => (
                    <div
                      key={key}
                      className="bg-slate-50/90 rounded-xl p-3 border border-slate-200/80 flex flex-col justify-between"
                    >
                      <span className="text-[11px] font-medium text-slate-500 truncate block">{key}</span>
                      <span className="text-xs sm:text-sm font-bold text-slate-900 mt-1 block truncate">
                        {String(value)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* PRO FEATURES: COMPARADOR & IMPACTO (if present) */}
              {currentHubData.proFeatures && currentHubData.proFeatures.enabled && (
                <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
                      <AlertTriangle className="w-4 h-4 text-amber-600" />
                      Auditoría Proactiva de Precios & Impacto de Escandallo
                    </span>
                    <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-amber-200 text-amber-900">
                      Alerta Inteligente
                    </span>
                  </div>

                  {currentHubData.proFeatures.priceAuditNotice && (
                    <p className="text-xs text-amber-800 font-medium">
                      {currentHubData.proFeatures.priceAuditNotice}
                    </p>
                  )}

                  {/* Trigger to jump to real-time comparator */}
                  {drawer360Hub === 'articulo_producto' && (
                    <button
                      onClick={() => setArticleDrawerTab('comparador')}
                      className="w-full py-2 px-3 rounded-xl bg-[#0067B9] hover:bg-[#022853] text-white text-xs font-bold flex items-center justify-center gap-2 transition shadow-xs"
                    >
                      <Scale className="w-4 h-4 text-[#80D518]" />
                      <span>Abrir Comparador en Tiempo Real de Costes & Escandallos</span>
                    </button>
                  )}

                  {currentHubData.proFeatures.alternativeSuppliers && (
                    <div className="space-y-1.5 pt-1">
                      <span className="text-[11px] font-bold text-slate-700 block">
                        Proveedores Alternativos Auditados:
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {currentHubData.proFeatures.alternativeSuppliers.map((supp, sIdx) => (
                          <div
                            key={sIdx}
                            className="bg-white p-2.5 rounded-xl border border-amber-200/80 text-xs flex items-center justify-between"
                          >
                            <div>
                              <strong className="block text-slate-900 font-bold">{supp.name}</strong>
                              <span className="text-slate-500 text-[10px]">{supp.deliveryDays}</span>
                            </div>
                            <div className="text-right">
                              <span className="font-mono font-bold text-slate-900 block">{supp.unitPrice}</span>
                              <span className="text-emerald-700 font-bold text-[10px] flex items-center justify-end gap-0.5">
                                <TrendingDown className="w-3 h-3" />
                                {supp.differencePct}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* RELATIONS SECTION WITH FILTER TABS */}
              <div className="space-y-3">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <h3 className="text-xs font-black uppercase text-slate-500 tracking-wider flex items-center gap-1.5">
                    <Compass className="w-3.5 h-3.5 text-[#0067B9]" />
                    Relaciones Bidireccionales 360º ({filteredRelations.length})
                  </h3>

                  {/* Category Filter Pills */}
                  <div className="flex items-center gap-1 text-[11px] font-bold">
                    {[
                      { id: 'todos', label: 'Todos' },
                      { id: 'costes_financiero', label: 'Costes' },
                      { id: 'calidad_reputacion', label: 'Reputación' },
                      { id: 'trazabilidad', label: 'Trazabilidad' },
                      { id: 'operativa', label: 'Operativa' },
                    ].map((f) => (
                      <button
                        key={f.id}
                        onClick={() => setActiveCategoryFilter(f.id)}
                        className={`px-2 py-0.5 rounded-md transition ${
                          activeCategoryFilter === f.id
                            ? 'bg-[#0067B9] text-white'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        {f.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Filtered Relations Cards */}
                <div className="space-y-2">
                  {filteredRelations.map((rel) => {
                    const targetHubInfo = allHubs.find((h) => h.id === rel.targetHub);

                    return (
                      <div
                        key={rel.id}
                        className={`rounded-2xl p-3.5 sm:p-4 border transition-all hover:shadow-sm ${
                          rel.impactScore === 'alerta'
                            ? 'bg-amber-50/50 border-amber-200 hover:border-amber-300'
                            : rel.impactScore === 'oportunidad'
                            ? 'bg-emerald-50/40 border-emerald-200 hover:border-emerald-300'
                            : 'bg-white border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-start gap-2.5">
                            <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center shrink-0 border border-slate-200 mt-0.5">
                              {getHubIcon(rel.targetHub, 'w-4 h-4')}
                            </div>
                            <div>
                              <div className="flex items-center gap-1.5 flex-wrap mb-0.5">
                                <span className="text-[10px] font-bold text-slate-500 uppercase">
                                  {targetHubInfo?.short || rel.targetHub}
                                </span>
                                {rel.badge && (
                                  <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-slate-200 text-slate-800">
                                    {rel.badge}
                                  </span>
                                )}
                              </div>
                              <h4 className="text-xs sm:text-sm font-bold text-slate-900">
                                {rel.label}
                              </h4>
                              <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                                {rel.description}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* ACTION BUTTONS: Drill-Down 360 vs Live Screen Jump */}
                        <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between flex-wrap gap-2">
                          <button
                            onClick={() => navigateDrawer360(rel.targetHub)}
                            className="touch-target-min text-xs font-bold text-[#0067B9] hover:text-[#022853] flex items-center gap-1 py-1 px-2 rounded-lg hover:bg-blue-50 transition"
                          >
                            <span>Explorar en 360º</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>

                          {rel.actionTargetView && (
                            <button
                              onClick={() => handleJumpToLiveScreen(rel)}
                              className="touch-target-min text-xs font-bold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-2.5 py-1 rounded-lg flex items-center gap-1.5 transition border border-slate-200"
                              title={`Abrir módulo en vivo: ${rel.actionModuleName || rel.label}`}
                            >
                              <ExternalLink className="w-3 h-3 text-[#0067B9]" />
                              <span>Ir a pantalla en vivo</span>
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </>
          )}
        </div>

        {/* BOTTOM DOCKED ACTIONS */}
        <div className="bg-slate-50 p-3 sm:p-4 border-t border-slate-200 flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2">
            <button
              onClick={closeDrawer360}
              className="text-xs font-bold px-3 py-2 rounded-xl border border-slate-300 text-slate-700 hover:bg-white transition"
            >
              Cerrar
            </button>
            <span className="text-[11px] text-slate-500 hidden sm:inline">
              Presiona <kbd className="px-1 py-0.5 rounded bg-slate-200 text-slate-700 font-mono text-[10px]">Esc</kbd> para salir
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Direct jump to Cockpit Graph Explorer */}
            <button
              onClick={() => {
                setActiveView('cockpit');
                closeDrawer360();
              }}
              className="text-xs font-bold px-3 py-2 rounded-xl bg-[#0067B9] text-white hover:bg-[#022853] transition shadow-xs flex items-center gap-1.5"
            >
              <Compass className="w-3.5 h-3.5" />
              <span>Ver Grafo en Cockpit</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
