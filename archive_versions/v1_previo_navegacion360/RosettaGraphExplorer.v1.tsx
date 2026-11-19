import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ENTITY_HUBS_360, EntityHubType, EntityRelationLink } from '../../services/dataModel360';
import {
  GitBranch,
  ArrowRight,
  ArrowLeft,
  FileText,
  Package,
  Layers,
  Utensils,
  Calendar,
  User,
  Clock,
  DollarSign,
  FileCheck,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle2,
  Building2,
  PhoneCall,
  Search,
  BadgeAlert,
  ArrowUpRight,
  Info,
} from 'lucide-react';

export const RosettaGraphExplorer: React.FC = () => {
  const { setActiveView, setActiveOperativaTab, announceAriaLive } = useApp();

  const [currentHubId, setCurrentHubId] = useState<EntityHubType>('factura');
  const [history, setHistory] = useState<EntityHubType[]>(['factura']);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [navigationToast, setNavigationToast] = useState<{
    moduleName: string;
    message: string;
  } | null>(null);

  const currentHub = ENTITY_HUBS_360[currentHubId] || ENTITY_HUBS_360['factura'];

  const handleNavigateHub = (targetHub: EntityHubType) => {
    if (ENTITY_HUBS_360[targetHub]) {
      setCurrentHubId(targetHub);
      setHistory((prev) => [...prev, targetHub]);
    }
  };

  const handleBack = () => {
    if (history.length > 1) {
      const nextHistory = [...history];
      nextHistory.pop();
      const prevId = nextHistory[nextHistory.length - 1];
      setHistory(nextHistory);
      setCurrentHubId(prevId);
    }
  };

  const handleDirectRealNavigation = (relation: EntityRelationLink) => {
    const targetModule = relation.actionModuleName || 'Módulo del Restaurante';
    const message = `La aplicación navega en directo a ${targetModule} en segundo plano para que veas la pantalla real.`;
    
    setNavigationToast({
      moduleName: targetModule,
      message,
    });
    announceAriaLive(message);

    // Apply background screen navigation
    if (relation.actionTargetView) {
      setActiveView(relation.actionTargetView);
      if (relation.actionOperativaTab) {
        setActiveOperativaTab(relation.actionOperativaTab);
      }
    }

    // Auto dismiss toast after 6 seconds
    setTimeout(() => {
      setNavigationToast(null);
    }, 6000);
  };

  const getHubIcon = (hubType: EntityHubType, className: string = 'w-5 h-5') => {
    switch (hubType) {
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
      default:
        return <Sparkles className={`${className} text-slate-600`} />;
    }
  };

  const allHubsList: { id: EntityHubType; label: string; short: string }[] = [
    { id: 'factura', label: '1. Factura / Albarán', short: 'Factura' },
    { id: 'linea_factura', label: '2. Línea de Factura', short: 'Línea' },
    { id: 'articulo_producto', label: '3. Artículo / Producto', short: 'Producto' },
    { id: 'receta', label: '4. Receta de Cocina', short: 'Receta' },
    { id: 'plato_escandallo', label: '5. Plato / Escandallo', short: 'Escandallo' },
    { id: 'reserva', label: '6. Reserva de Sala', short: 'Reserva' },
    { id: 'cliente', label: '7. Cliente CRM', short: 'Cliente' },
    { id: 'turno', label: '8. Turno RRHH', short: 'Turno' },
    { id: 'gastos', label: '9. Gastos Operativos', short: 'Gastos' },
    { id: 'documento', label: '10. Documento Digital', short: 'Documento' },
  ];

  const filteredRelations = currentHub.navigableRelations.filter((rel) => {
    if (!searchTerm.trim()) return true;
    const term = searchTerm.toLowerCase();
    return (
      rel.label.toLowerCase().includes(term) ||
      rel.description.toLowerCase().includes(term) ||
      (rel.badge && rel.badge.toLowerCase().includes(term))
    );
  });

  return (
    <div className="bg-white rounded-3xl p-5 sm:p-8 border border-slate-200 shadow-xs space-y-6">
      
      {/* Toast Notification of Real Screen Navigation */}
      {navigationToast && (
        <div className="p-4 rounded-2xl bg-[#022853] text-white border-2 border-[#80D518] shadow-lg flex items-center justify-between gap-3 animate-in slide-in-from-top duration-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#80D518] text-[#022853] flex items-center justify-center font-bold shrink-0">
              <ExternalLink className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-[#80D518] block">
                Navegación en Directo 360º Activa
              </span>
              <p className="text-xs sm:text-sm font-bold text-white mt-0.5">
                {navigationToast.message}
              </p>
            </div>
          </div>
          <button
            onClick={() => setNavigationToast(null)}
            className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold text-white transition shrink-0"
          >
            Entendido
          </button>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#022853] text-[#80D518] flex items-center justify-center font-bold shadow-xs">
              <GitBranch className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-black font-brand text-[#022853]">
                  Navegación 360º de Grafo: "La Piedra Rosetta"
                </h3>
                <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#80D518]/20 text-[#022853] border border-[#80D518]">
                  10 Entidades Maestras
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1 max-w-3xl">
                Principio rector: Cero pantallas aisladas. A través de cualquier entidad ves todas las relaciones donde participa y su impacto en tiempo real. Salta con 1 clic a la pantalla real en segundo plano.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start lg:self-auto">
          {history.length > 1 && (
            <button
              onClick={handleBack}
              className="touch-target-min px-3.5 py-2 rounded-xl border border-slate-300 bg-white hover:bg-slate-100 text-slate-700 text-xs font-bold transition flex items-center gap-1.5 shadow-2xs"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-[#0067B9]" />
              <span>Volver atrás ({history[history.length - 2]})</span>
            </button>
          )}
        </div>
      </div>

      {/* 10 Core Entity Hubs Selector (Pills) */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-black uppercase tracking-wider text-slate-500">
            Selecciona la Entidad Origen (Desde donde deseas explorar):
          </span>
          <span className="text-[11px] text-slate-400 font-medium">
            10 Nodos End-to-End
          </span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
          {allHubsList.map((step) => {
            const isCurrent = step.id === currentHubId;
            return (
              <button
                key={step.id}
                onClick={() => handleNavigateHub(step.id)}
                className={`p-2.5 rounded-2xl text-left border transition flex items-center gap-2 ${
                  isCurrent
                    ? 'bg-[#022853] text-white border-[#022853] shadow-xs ring-2 ring-[#0067B9]/30'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                }`}
              >
                <div
                  className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 ${
                    isCurrent ? 'bg-white/10 text-[#80D518]' : 'bg-white border border-slate-200'
                  }`}
                >
                  {getHubIcon(step.id, 'w-3.5 h-3.5')}
                </div>
                <div className="truncate">
                  <span className="font-bold text-xs block truncate leading-tight">
                    {step.short}
                  </span>
                  <span className={`text-[10px] block truncate ${isCurrent ? 'text-slate-300' : 'text-slate-400'}`}>
                    {step.label.split('.')[0]}. Hub
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Hub Detailed Card */}
      <div className="p-6 rounded-3xl bg-slate-50 border-2 border-slate-200/90 space-y-6 shadow-2xs animate-in fade-in duration-150">
        
        {/* Hub Header */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-white border border-slate-200 flex items-center justify-center shrink-0 shadow-xs">
              {getHubIcon(currentHub.hubType, 'w-7 h-7')}
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#0067B9] text-white">
                  Entidad Maestra #{currentHub.code}
                </span>
                {currentHub.statusBadge && (
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${currentHub.statusBadge.color}`}>
                    {currentHub.statusBadge.label}
                  </span>
                )}
                {currentHub.hubType === 'factura' && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                    Ciclo: 8 Estados Soportados
                  </span>
                )}
              </div>
              <h4 className="text-lg sm:text-xl font-black font-brand text-[#022853] mt-1">
                {currentHub.title}
              </h4>
              <p className="text-xs text-slate-600 mt-0.5">{currentHub.subtitle}</p>
            </div>
          </div>

          <div className="text-right sm:text-right shrink-0">
            <span className="text-[10px] text-slate-400 block font-semibold">Trazabilidad Criptográfica</span>
            <span className="text-[11px] font-mono text-slate-600 bg-white px-2 py-1 rounded-md border border-slate-200 inline-block mt-0.5">
              {currentHub.auditInfo.hash.slice(0, 16)}...
            </span>
          </div>
        </div>

        {/* Technical Data Attributes (6 KPIs) */}
        <div>
          <span className="text-[11px] font-black uppercase tracking-wider text-slate-500 block mb-2">
            Atributos y Datos Técnicos de la Entidad:
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
            {Object.entries(currentHub.keyMetrics).map(([key, val]) => (
              <div key={key} className="bg-white p-3 rounded-2xl border border-slate-200 shadow-2xs">
                <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider truncate">
                  {key}
                </span>
                <span className="text-xs font-black text-slate-900 block mt-1 truncate">
                  {val}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Versión Pro Highlights (Price Audits, Escandallo Margins & Supplier Alternatives) */}
        {currentHub.proFeatures && currentHub.proFeatures.enabled && (
          <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-50/90 via-purple-50/70 to-blue-50/80 border-2 border-amber-300/80 space-y-3.5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-[#D6A52A] text-white flex items-center justify-center font-bold text-xs">
                  ★
                </div>
                <div>
                  <span className="text-xs font-black font-brand text-[#022853]">
                    Capacidades Versión Pro ConfiA360: Impacto de Precios, Escandallos & Proveedores
                  </span>
                  <span className="text-[11px] text-slate-600 block">
                    Al cargar el albarán/factura, se actualizan productos, se verifican precios y se auditan márgenes de cocina
                  </span>
                </div>
              </div>
              <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-amber-500 text-white">
                Versión Pro Activa
              </span>
            </div>

            {/* Price Alert & Margin Impact */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
              {currentHub.proFeatures.priceAuditNotice && (
                <div className="p-3 bg-white rounded-xl border border-rose-200 flex items-start gap-2.5">
                  <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[11px] font-black text-rose-800 block">
                      Alerta de Subida de Precios
                    </span>
                    <p className="text-xs text-rose-900 mt-0.5">
                      {currentHub.proFeatures.priceAuditNotice}
                    </p>
                  </div>
                </div>
              )}

              {currentHub.proFeatures.escandalloImpact && (
                <div className="p-3 bg-white rounded-xl border border-purple-200 flex items-start gap-2.5">
                  <Utensils className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <span className="text-[11px] font-black text-purple-800 block">
                      Escandallo: {currentHub.proFeatures.escandalloImpact.dishName}
                    </span>
                    <div className="flex items-center gap-3 text-xs mt-0.5">
                      <span className="text-slate-600">
                        Coste: <strong>{currentHub.proFeatures.escandalloImpact.theoreticalCost}</strong>
                      </span>
                      <span className="text-purple-700 font-bold">
                        Margen Actual: {currentHub.proFeatures.escandalloImpact.currentMarginPct}% (Objetivo: {currentHub.proFeatures.escandalloImpact.targetMarginPct}%)
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Alternative Suppliers Comparison & Trends */}
            {currentHub.proFeatures.alternativeSuppliers && currentHub.proFeatures.alternativeSuppliers.length > 0 && (
              <div className="pt-2 border-t border-amber-200/60">
                <span className="text-[11px] font-bold text-slate-700 block mb-1.5 flex items-center gap-1.5">
                  <span>Comparativa de Proveedores Alternativos en el Mercado:</span>
                  <span className="text-[10px] text-emerald-700 font-black bg-emerald-100 px-1.5 py-0.2 rounded">
                    Oportunidad de Ahorro
                  </span>
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {currentHub.proFeatures.alternativeSuppliers.map((supp, sIdx) => (
                    <div
                      key={sIdx}
                      className="p-2.5 bg-white rounded-xl border border-slate-200 flex items-center justify-between gap-2 text-xs"
                    >
                      <div>
                        <span className="font-bold text-slate-900 block">{supp.name}</span>
                        <span className="text-[10px] text-slate-500 block">{supp.deliveryDays}</span>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="font-black text-slate-900 block">{supp.unitPrice}</span>
                        <span
                          className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                            supp.trend === 'down'
                              ? 'bg-emerald-100 text-emerald-700'
                              : 'bg-blue-100 text-blue-700'
                          }`}
                        >
                          {supp.differencePct} ({supp.trend === 'down' ? 'Más Barato' : 'Similar'})
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Navigable Relations Section: "Desde esta entidad debe poder navegar a:" */}
        <div className="pt-2 border-t border-slate-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
            <div>
              <h5 className="text-sm font-black font-brand text-[#022853] flex items-center gap-1.5">
                <span>Desde {currentHub.title.split(':')[0]} debe poder navegar a:</span>
                <span className="text-[10px] font-bold text-[#0067B9] bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
                  {currentHub.navigableRelations.length} Destinos 360º
                </span>
              </h5>
              <p className="text-xs text-slate-500">
                Haz clic en cualquier relación para saltar en el grafo o abrir la pantalla real en segundo plano.
              </p>
            </div>

            {/* Quick search inside relations */}
            <div className="relative w-full sm:w-64">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Filtrar relaciones..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 rounded-xl border border-slate-300 text-xs bg-white focus:outline-none focus:border-[#0067B9]"
              />
            </div>
          </div>

          {/* Relations Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {filteredRelations.map((rel) => {
              return (
                <div
                  key={rel.id}
                  className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-[#0067B9] transition shadow-2xs hover:shadow-xs flex flex-col justify-between gap-3 group"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <div className="flex items-center gap-2">
                        {getHubIcon(rel.targetHub, 'w-4 h-4')}
                        <span className="text-xs font-black text-[#022853] group-hover:text-[#0067B9] transition">
                          {rel.label}
                        </span>
                      </div>
                      {rel.badge && (
                        <span className="text-[10px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200 shrink-0">
                          {rel.badge}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {rel.description}
                    </p>
                  </div>

                  {/* Actions Bar */}
                  <div className="pt-2.5 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
                    <button
                      onClick={() => handleNavigateHub(rel.targetHub)}
                      className="touch-target-min text-[11px] font-bold text-[#0067B9] hover:text-[#022853] flex items-center gap-1 transition"
                    >
                      <span>Inspeccionar Hub ({rel.targetHub})</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>

                    {rel.actionModuleName && (
                      <button
                        onClick={() => handleDirectRealNavigation(rel)}
                        className="touch-target-min px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-[#022853] text-slate-700 hover:text-white text-[11px] font-bold transition flex items-center gap-1.5 border border-slate-200"
                        title={`Ir a ${rel.actionModuleName} en pantalla real`}
                      >
                        <ExternalLink className="w-3 h-3 text-[#0067B9] group-hover:text-[#80D518]" />
                        <span>Ver en Pantalla Real</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* Model Relational Summary Guide for Users & Audit */}
      <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-2">
        <div className="flex items-center gap-2">
          <Info className="w-4 h-4 text-[#0067B9] shrink-0" />
          <span className="font-bold text-slate-800">
            Resumen Arquitectural del Modelo de Relaciones ConfiA360:
          </span>
        </div>
        <p className="text-[11px] leading-relaxed">
          Cada entidad actúa como un <strong>nodo vivo bidireccional</strong>. Por ejemplo, al subir una factura se actualiza automáticamente el inventario del artículo, se recalcula el margen del plato en su escandallo, se actualiza el vencimiento en tesorería y se audita el turno del empleado receptor.
        </p>
      </div>

    </div>
  );
};
