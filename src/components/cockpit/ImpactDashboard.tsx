import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Layers,
  ChefHat,
  Package,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Building2,
  DollarSign,
  ArrowRight,
  ShieldCheck,
  Star,
  CheckCircle2,
  HelpCircle,
  ExternalLink,
  Compass,
} from 'lucide-react';

export interface ImpactEntityItem {
  id: string;
  name: string;
  category: 'articulo' | 'plato' | 'receta' | 'proveedor';
  unit: string;
  currentCost: number;
  currentStock: number;
  minStock: number;
  stockUnit: string;
  supplierName: string;
  supplierRating: number;
  alternativeSuppliers: {
    name: string;
    price: number;
    differencePercent: number;
    leadTimeDays: number;
    rating: number;
  }[];
  participatesInRecipes: {
    recipeName: string;
    portionQty: string;
    costImpact: number;
    totalRecipeCost: number;
    sellingPrice: number;
    grossMarginPercent: number;
  }[];
  reputationImpact: {
    positiveMentions: number;
    negativeMentions: number;
    starRating: number;
    sentimentSummary: string;
  };
}

export const SAMPLE_IMPACT_ENTITIES: ImpactEntityItem[] = [
  {
    id: 'ART-01',
    name: 'Solomillo de Vaca Madurada (Lomo Alto)',
    category: 'articulo',
    unit: 'kg',
    currentCost: 24.8,
    currentStock: 18.5,
    minStock: 8.0,
    stockUnit: 'kg en cámara 1',
    supplierName: 'Cárnicas Guadarrama S.L.',
    supplierRating: 4.8,
    alternativeSuppliers: [
      {
        name: 'Distribuidores Sierra Norte',
        price: 23.9,
        differencePercent: -3.6,
        leadTimeDays: 1,
        rating: 4.6,
      },
      {
        name: 'Carnes de Ávila Gourmet',
        price: 26.2,
        differencePercent: 5.6,
        leadTimeDays: 2,
        rating: 4.9,
      },
    ],
    participatesInRecipes: [
      {
        recipeName: 'Solomillo al Carbón de Encina',
        portionQty: '0.280 kg',
        costImpact: 6.94,
        totalRecipeCost: 9.0,
        sellingPrice: 28.5,
        grossMarginPercent: 68.4,
      },
      {
        recipeName: 'Steak Tartar Clásico con Mostaza Antigua',
        portionQty: '0.180 kg',
        costImpact: 4.46,
        totalRecipeCost: 6.2,
        sellingPrice: 21.0,
        grossMarginPercent: 70.5,
      },
      {
        recipeName: 'Carpaccio de Vaca con Lascas de Idiazábal',
        portionQty: '0.090 kg',
        costImpact: 2.23,
        totalRecipeCost: 3.8,
        sellingPrice: 15.5,
        grossMarginPercent: 75.5,
      },
    ],
    reputationImpact: {
      positiveMentions: 42,
      negativeMentions: 1,
      starRating: 4.95,
      sentimentSummary: 'Elemento tractor de reseñas 5★ en Google ("mantequilla en boca"). Incidencia aislada por punto de cocción pasado en turno del domingo.',
    },
  },
  {
    id: 'ART-02',
    name: 'Queso Idiazábal D.O. Ahumado',
    category: 'articulo',
    unit: 'kg',
    currentCost: 16.5,
    currentStock: 9.2,
    minStock: 4.0,
    stockUnit: 'kg en cámara lácteos',
    supplierName: 'Lácteos y Quesos del Norte',
    supplierRating: 4.9,
    alternativeSuppliers: [
      {
        name: 'Queserías Tradicionales Vascas',
        price: 15.8,
        differencePercent: -4.2,
        leadTimeDays: 2,
        rating: 4.7,
      },
    ],
    participatesInRecipes: [
      {
        recipeName: 'Tarta de Queso Fluida Horneada',
        portionQty: '0.120 kg/ración',
        costImpact: 1.98,
        totalRecipeCost: 2.45,
        sellingPrice: 8.5,
        grossMarginPercent: 79.2,
      },
      {
        recipeName: 'Croquetas de Jamón con Velo de Idiazábal',
        portionQty: '0.040 kg/ración',
        costImpact: 0.66,
        totalRecipeCost: 3.64,
        sellingPrice: 14.0,
        grossMarginPercent: 74.0,
      },
    ],
    reputationImpact: {
      positiveMentions: 56,
      negativeMentions: 0,
      starRating: 4.98,
      sentimentSummary: 'Postre insignia viral en TripAdvisor e Instagram. 100% de comentarios positivos.',
    },
  },
  {
    id: 'ART-03',
    name: 'Atún Rojo Balfegó (Lomo)',
    category: 'articulo',
    unit: 'kg',
    currentCost: 38.0,
    currentStock: 6.4,
    minStock: 3.0,
    stockUnit: 'kg en cámara pescados',
    supplierName: 'Pescados y Mariscos La Lonja',
    supplierRating: 4.7,
    alternativeSuppliers: [
      {
        name: 'Balfegó Distribución Directa',
        price: 36.5,
        differencePercent: -3.9,
        leadTimeDays: 1,
        rating: 5.0,
      },
    ],
    participatesInRecipes: [
      {
        recipeName: 'Tartar de Atún Rojo Balfegó & Aguacate',
        portionQty: '0.160 kg',
        costImpact: 6.08,
        totalRecipeCost: 8.34,
        sellingPrice: 22.0,
        grossMarginPercent: 62.1,
      },
      {
        recipeName: 'Tataki de Atún con Sésamo Tostado',
        portionQty: '0.190 kg',
        costImpact: 7.22,
        totalRecipeCost: 9.6,
        sellingPrice: 24.5,
        grossMarginPercent: 60.8,
      },
    ],
    reputationImpact: {
      positiveMentions: 31,
      negativeMentions: 0,
      starRating: 4.88,
      sentimentSummary: 'Alta mención de frescura y trazabilidad de pesca sostenible.',
    },
  },
  {
    id: 'ART-04',
    name: 'Aceite de Oliva Virgen Extra Picual',
    category: 'articulo',
    unit: 'L',
    currentCost: 7.2,
    currentStock: 45.0,
    minStock: 20.0,
    stockUnit: 'L en economato seco',
    supplierName: 'Almazara Sierra Mágina',
    supplierRating: 4.9,
    alternativeSuppliers: [
      {
        name: 'Oleícola Central Jaén',
        price: 6.95,
        differencePercent: -3.5,
        leadTimeDays: 2,
        rating: 4.8,
      },
    ],
    participatesInRecipes: [
      {
        recipeName: 'Base de Salteados y Guisos (Mise en Place)',
        portionQty: '0.035 L',
        costImpact: 0.25,
        totalRecipeCost: 1.1,
        sellingPrice: 12.0,
        grossMarginPercent: 82.0,
      },
      {
        recipeName: 'Pan con Tomate de Colgar y AOVE',
        portionQty: '0.025 L',
        costImpact: 0.18,
        totalRecipeCost: 0.75,
        sellingPrice: 4.5,
        grossMarginPercent: 83.3,
      },
    ],
    reputationImpact: {
      positiveMentions: 18,
      negativeMentions: 0,
      starRating: 4.9,
      sentimentSummary: 'Calidad percibida alta en aperitivos de bienvenida.',
    },
  },
];

interface ImpactDashboardProps {
  initialEntityId?: string;
  onNavigateToModule?: (view: string, tab?: string) => void;
}

export const ImpactDashboard: React.FC<ImpactDashboardProps> = ({
  initialEntityId = 'ART-01',
  onNavigateToModule,
}) => {
  const { setActiveView, setActiveOperativaTab, announceAriaLive, openDrawer360 } = useApp();
  const [selectedEntityId, setSelectedEntityId] = useState<string>(initialEntityId);
  const [activeSubTab, setActiveSubTab] = useState<'recetas' | 'stock' | 'margenes' | 'proveedores' | 'reputacion'>('recetas');

  const currentEntity =
    SAMPLE_IMPACT_ENTITIES.find((e) => e.id === selectedEntityId) || SAMPLE_IMPACT_ENTITIES[0];

  const handleSelectEntity = (id: string, name: string) => {
    setSelectedEntityId(id);
    announceAriaLive(`ImpactDashboard actualizado para ${name}`);
  };

  const handleJumpToModule = (view: 'operativa' | 'cockpit' | 'director' | 'reputacion', tab?: any) => {
    if (onNavigateToModule) {
      onNavigateToModule(view, tab);
    } else {
      setActiveView(view);
      if (view === 'operativa' && tab) {
        setActiveOperativaTab(tab);
      }
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden" data-testid="impact-dashboard">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#022853] via-[#01356f] to-[#0067B9] text-white p-4 sm:p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center border border-white/20">
              <Layers className="w-5 h-5 text-[#80D518]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#80D518]/25 text-[#80D518] border border-[#80D518]/40">
                  Transversal 360º
                </span>
                <span className="text-xs text-blue-200">Cero Pantallas Aisladas</span>
              </div>
              <h3 className="font-brand font-black text-lg sm:text-xl text-white">
                ImpactDashboard: Análisis de Impacto Global
              </h3>
            </div>
          </div>
          <div className="text-xs text-blue-200 bg-white/10 px-3 py-1.5 rounded-xl border border-white/15 self-start sm:self-auto">
            <span>Selecciona un artículo para ver recetas, stock, márgenes y reputación</span>
          </div>
        </div>

        {/* Entity Selector Quick Chips */}
        <div className="mt-4 flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
          <span className="text-xs font-bold text-blue-200 shrink-0">Inspeccionar:</span>
          {SAMPLE_IMPACT_ENTITIES.map((ent) => (
            <button
              key={ent.id}
              onClick={() => handleSelectEntity(ent.id, ent.name)}
              className={`touch-target-min text-xs font-bold px-3 py-1.5 rounded-xl transition-all shrink-0 flex items-center gap-1.5 border ${
                selectedEntityId === ent.id
                  ? 'bg-[#80D518] text-[#022853] border-[#80D518] shadow-md font-black'
                  : 'bg-white/10 text-white hover:bg-white/20 border-white/15'
              }`}
            >
              <span>{ent.name.split('(')[0].trim()}</span>
              <span className="text-[10px] opacity-75 font-mono">({ent.currentCost.toFixed(2)}€/{ent.unit})</span>
            </button>
          ))}
        </div>
      </div>

      {/* Selected Entity Identity Summary Bar */}
      <div className="bg-slate-50 border-b border-slate-200 px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-3">
          <div className="font-black text-slate-900 text-sm">{currentEntity.name}</div>
          <span className="text-slate-400">·</span>
          <span className="text-slate-600 font-medium">Proveedor: <strong className="text-slate-800">{currentEntity.supplierName}</strong></span>
          <span className="text-slate-400">·</span>
          <span className="text-slate-600 font-medium">Existencias: <strong className="text-emerald-700 font-mono">{currentEntity.currentStock} {currentEntity.unit}</strong></span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleJumpToModule('operativa', 'gastos')}
            className="inline-flex items-center gap-1 text-[11px] font-bold text-[#0067B9] hover:underline"
          >
            Ver Facturas OCR <ExternalLink className="w-3 h-3" />
          </button>
          <span className="text-slate-300">|</span>
          <button
            onClick={() => handleJumpToModule('reputacion')}
            className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 hover:underline"
          >
            Ver Reseñas <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
          </button>
          <span className="text-slate-300">|</span>
          <button
            onClick={() => openDrawer360('articulo_producto')}
            className="inline-flex items-center gap-1.5 text-[11px] font-bold text-white bg-[#022853] hover:bg-[#0067B9] px-3 py-1 rounded-lg transition shadow-2xs"
            title="Abrir este artículo en el Comparador 360º de Costes y Escandallos en Vivo"
          >
            <Compass className="w-3.5 h-3.5 text-[#80D518]" />
            <span>Comparador 360º Costes & Escandallos</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-slate-200 px-4 sm:px-6 bg-white">
        <div className="flex space-x-1 sm:space-x-4 overflow-x-auto">
          {[
            { id: 'recetas', label: 'Recetas & Escandallos', icon: ChefHat, count: currentEntity.participatesInRecipes.length },
            { id: 'stock', label: 'Stock & Almacén', icon: Package, badge: `${currentEntity.currentStock} ${currentEntity.unit}` },
            { id: 'margenes', label: 'Márgenes de Venta', icon: DollarSign, badge: 'PVD' },
            { id: 'proveedores', label: 'Comparativa Proveedores', icon: Building2, count: currentEntity.alternativeSuppliers.length + 1 },
            { id: 'reputacion', label: 'Impacto en Reputación', icon: Star, badge: `${currentEntity.reputationImpact.starRating}★` },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeSubTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveSubTab(tab.id as any)}
                className={`py-3 px-2 sm:px-3 text-xs sm:text-sm font-bold border-b-2 flex items-center gap-1.5 whitespace-nowrap transition-colors ${
                  isActive
                    ? 'border-[#0067B9] text-[#0067B9]'
                    : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-[#0067B9]' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
                {tab.count !== undefined && (
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                    isActive ? 'bg-blue-100 text-[#0067B9]' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {tab.count}
                  </span>
                )}
                {tab.badge && (
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                    isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Contents */}
      <div className="p-4 sm:p-6">
        
        {/* SUBTAB 1: RECETAS */}
        {activeSubTab === 'recetas' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-bold text-slate-900 text-sm">
                  Recetas y platos que consumen este ingrediente ({currentEntity.participatesInRecipes.length})
                </h4>
                <p className="text-xs text-slate-500">
                  Un cambio de coste de compra en factura impacta automáticamente en el escandallo de estos platos.
                </p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border border-slate-200 rounded-xl overflow-hidden">
                <thead className="bg-slate-50 text-slate-700 uppercase font-black tracking-wider text-[10px]">
                  <tr>
                    <th className="p-3">Receta / Plato de Carta</th>
                    <th className="p-3">Dosis Ración</th>
                    <th className="p-3">Coste Dosis</th>
                    <th className="p-3">Coste Plato Total</th>
                    <th className="p-3">Precio Venta (PVD)</th>
                    <th className="p-3 text-right">Margen Bruto</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {currentEntity.participatesInRecipes.map((r, idx) => (
                    <tr key={idx} className="hover:bg-blue-50/40 transition-colors">
                      <td className="p-3 font-bold text-slate-900 flex items-center gap-2">
                        <ChefHat className="w-3.5 h-3.5 text-[#0067B9]" />
                        <span>{r.recipeName}</span>
                      </td>
                      <td className="p-3 font-mono text-slate-600">{r.portionQty}</td>
                      <td className="p-3 font-mono font-bold text-slate-800">{r.costImpact.toFixed(2)} €</td>
                      <td className="p-3 font-mono text-slate-600">{r.totalRecipeCost.toFixed(2)} €</td>
                      <td className="p-3 font-mono font-bold text-slate-900">{r.sellingPrice.toFixed(2)} €</td>
                      <td className="p-3 text-right">
                        <span className="font-mono font-black text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                          {r.grossMarginPercent.toFixed(1)}%
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* SUBTAB 2: STOCK */}
        {activeSubTab === 'stock' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[11px] text-slate-500 font-bold uppercase tracking-wider block">Existencias Actuales</span>
                <div className="mt-1 flex items-baseline gap-2">
                  <span className="text-2xl font-black text-slate-900 font-mono">{currentEntity.currentStock}</span>
                  <span className="text-xs text-slate-600 font-bold">{currentEntity.unit}</span>
                </div>
                <span className="text-[11px] text-slate-500 mt-1 block">{currentEntity.stockUnit}</span>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[11px] text-slate-500 font-bold uppercase tracking-wider block">Stock Mínimo Alerta</span>
                <div className="mt-1 flex items-baseline gap-2">
                  <span className="text-2xl font-black text-amber-700 font-mono">{currentEntity.minStock}</span>
                  <span className="text-xs text-slate-600 font-bold">{currentEntity.unit}</span>
                </div>
                <span className="text-[11px] text-emerald-600 font-bold mt-1 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Nivel óptimo (+{currentEntity.currentStock - currentEntity.minStock} {currentEntity.unit} sobre mínimo)
                </span>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[11px] text-slate-500 font-bold uppercase tracking-wider block">Valor Monetario Stock</span>
                <div className="mt-1 flex items-baseline gap-2">
                  <span className="text-2xl font-black text-slate-900 font-mono">
                    {(currentEntity.currentStock * currentEntity.currentCost).toFixed(2)} €
                  </span>
                </div>
                <span className="text-[11px] text-slate-500 mt-1 block">A precio medio ponderado de compra</span>
              </div>
            </div>

            <div className="p-3 bg-blue-50/60 rounded-xl border border-blue-200/80 text-xs text-blue-900 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#0067B9] shrink-0" />
                <span>Trazabilidad APPCC activa: Lote vigente auditado con registro sanitario.</span>
              </div>
              <button
                onClick={() => handleJumpToModule('operativa', 'gastos')}
                className="text-[11px] font-black text-[#0067B9] hover:underline flex items-center gap-1"
              >
                Auditar Lotes <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        )}

        {/* SUBTAB 3: MARGENES */}
        {activeSubTab === 'margenes' && (
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-black uppercase text-emerald-900">Sensibilidad de Margen</span>
                  <h4 className="font-bold text-slate-900 text-sm mt-0.5">
                    ¿Qué ocurre si el proveedor sube el coste un +10%?
                  </h4>
                  <p className="text-xs text-slate-600 mt-1">
                    Un incremento de {(currentEntity.currentCost * 0.1).toFixed(2)} €/{currentEntity.unit} reduciría el margen medio de los platos en 1.4 puntos porcentuales si no se repercute en carta.
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-xs text-slate-500 block">Coste Compra Actual</span>
                  <span className="text-xl font-black font-mono text-slate-900">{currentEntity.currentCost.toFixed(2)} €/{currentEntity.unit}</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {currentEntity.participatesInRecipes.map((r, i) => (
                <div key={i} className="p-3 rounded-xl border border-slate-200 bg-white shadow-2xs">
                  <div className="text-xs font-bold text-slate-900 truncate">{r.recipeName}</div>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-xs text-slate-500">PVD: <strong>{r.sellingPrice} €</strong></span>
                    <span className="text-xs font-mono font-black text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      {r.grossMarginPercent}%
                    </span>
                  </div>
                  <div className="mt-2 text-[11px] text-slate-500 flex justify-between">
                    <span>Materia prima total:</span>
                    <span className="font-mono">{r.totalRecipeCost.toFixed(2)} €</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SUBTAB 4: COMPARATIVA PROVEEDORES */}
        {activeSubTab === 'proveedores' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-bold text-slate-900 text-sm">
                  Comparador de Precios & Proveedores Homologados
                </h4>
                <p className="text-xs text-slate-500">
                  Precios actualizados a partir del OCR de facturas y ofertas pactadas.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Proveedor Actual */}
              <div className="p-4 rounded-xl border-2 border-[#0067B9] bg-blue-50/20">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#0067B9] text-white">
                    Proveedor Actual
                  </span>
                  <span className="text-xs font-mono font-bold text-amber-600 flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 fill-current" /> {currentEntity.supplierRating}
                  </span>
                </div>
                <h5 className="font-bold text-slate-900 text-sm mt-2">{currentEntity.supplierName}</h5>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="text-2xl font-black font-mono text-slate-900">{currentEntity.currentCost.toFixed(2)} €</span>
                  <span className="text-xs text-slate-500 font-bold">/ {currentEntity.unit}</span>
                </div>
                <p className="text-[11px] text-slate-500 mt-1">Plazo de entrega: 24h · Pago a 30 días</p>
              </div>

              {/* Proveedores Alternativos */}
              {currentEntity.alternativeSuppliers.map((alt, idx) => (
                <div key={idx} className="p-4 rounded-xl border border-slate-200 bg-white">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                      Alternativa Homologada
                    </span>
                    <span className="text-xs font-mono font-bold text-slate-600 flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" /> {alt.rating}
                    </span>
                  </div>
                  <h5 className="font-bold text-slate-900 text-sm mt-2">{alt.name}</h5>
                  <div className="mt-2 flex items-baseline gap-2">
                    <span className="text-2xl font-black font-mono text-slate-900">{alt.price.toFixed(2)} €</span>
                    <span className="text-xs text-slate-500 font-bold">/ {currentEntity.unit}</span>
                    <span className={`text-xs font-bold font-mono px-1.5 py-0.5 rounded ${
                      alt.differencePercent < 0 ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                    }`}>
                      {alt.differencePercent > 0 ? `+${alt.differencePercent}%` : `${alt.differencePercent}%`}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Plazo de entrega: {alt.leadTimeDays} días
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SUBTAB 5: REPUTACION */}
        {activeSubTab === 'reputacion' && (
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-gradient-to-r from-amber-50 via-yellow-50 to-orange-50 border border-amber-200">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-amber-500 text-white flex items-center justify-center font-black text-xl shadow-xs">
                    {currentEntity.reputationImpact.starRating}★
                  </div>
                  <div>
                    <h5 className="font-bold text-slate-900 text-sm">
                      Impacto Directo en la Experiencia del Cliente
                    </h5>
                    <div className="flex items-center gap-3 text-xs text-slate-600 mt-0.5">
                      <span className="text-emerald-700 font-bold">
                        +{currentEntity.reputationImpact.positiveMentions} menciones positivas
                      </span>
                      <span>·</span>
                      <span className="text-rose-600 font-bold">
                        {currentEntity.reputationImpact.negativeMentions} incidencias
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => handleJumpToModule('reputacion')}
                  className="touch-target-min text-xs font-black bg-[#022853] text-white px-3 py-2 rounded-xl hover:bg-[#0067B9] transition flex items-center gap-1.5"
                >
                  <span>Abrir AsexIA Confia360 Reputación</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="mt-3 p-3 bg-white/80 rounded-xl border border-amber-200/60 text-xs text-slate-800 font-medium">
                {currentEntity.reputationImpact.sentimentSummary}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
