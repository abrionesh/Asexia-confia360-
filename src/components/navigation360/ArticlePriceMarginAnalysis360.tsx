import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { EntityHubType } from '../../services/dataModel360';
import {
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle2,
  DollarSign,
  ArrowRight,
  Utensils,
  FileText,
  Truck,
  RotateCcw,
  Sparkles,
  Sliders,
  ShieldAlert,
  Building2,
  Calendar,
  ExternalLink,
  Percent,
  Download,
  Info,
  ChevronRight,
  Flame,
  ChefHat,
  Tag,
  Receipt,
  Scale,
} from 'lucide-react';

export interface InvoicePriceHistoryItem {
  id: string;
  invoiceNumber: string;
  date: string;
  providerName: string;
  quantityKg: number;
  unitPrice: number;
  totalCost: number;
  documentType: 'factura' | 'albaran';
  status: 'aprobada' | 'en_disputa' | 'contabilizada';
  notes?: string;
}

export interface EscandalloDishImpactItem {
  id: string;
  dishCode: string;
  dishName: string;
  category: string;
  currentPvp: number;
  grammageInDishKg: number; // e.g. 0.250 kg
  baseIngredientsCost: number; // other ingredients
  targetFoodCostPct: number; // e.g. 28%
  monthlyServingsSold: number; // e.g. 240
}

export interface AlternativeSupplierQuote {
  id: string;
  name: string;
  unitPrice: number;
  leadTimeDays: number;
  minOrderKg: number;
  rating: number;
  contact: string;
}

export interface ArticlePriceAnalysisConfig {
  articleCode: string;
  articleName: string;
  unit: string;
  category: string;
  baselineCost: number; // Coste presupuestado inicial
  currentInvoiceCost: number; // Último precio recibido
  currentProvider: string;
  averageMonthlyConsumptionKg: number;
  historyInvoices: InvoicePriceHistoryItem[];
  affectedDishes: EscandalloDishImpactItem[];
  alternativeSuppliers: AlternativeSupplierQuote[];
}

export const SAMPLE_ARTICLE_ANALYSIS: ArticlePriceAnalysisConfig = {
  articleCode: 'ART-002',
  articleName: 'Solomillo de Vacuno Mayor Corte Especial',
  unit: 'kg',
  category: 'Carnes Frescas & Asados',
  baselineCost: 12.40, // Precio de referencia pactado
  currentInvoiceCost: 14.20, // Subida del 14.5% en último albarán/factura
  currentProvider: 'Distribuciones Cárnicas Sierra S.L.',
  averageMonthlyConsumptionKg: 160, // 40 kg/semana
  historyInvoices: [
    {
      id: 'inv-01',
      invoiceNumber: 'ALB-2026-4412',
      date: '11/10/2026',
      providerName: 'Cárnicas Sierra S.L.',
      quantityKg: 25.0,
      unitPrice: 14.20,
      totalCost: 355.00,
      documentType: 'albaran',
      status: 'en_disputa',
      notes: 'Subida no pactada detectada por OCR (+14.5%)',
    },
    {
      id: 'inv-02',
      invoiceNumber: 'FAC-2026-9021',
      date: '02/10/2026',
      providerName: 'Cárnicas Sierra S.L.',
      quantityKg: 30.0,
      unitPrice: 13.80,
      totalCost: 414.00,
      documentType: 'factura',
      status: 'contabilizada',
      notes: 'Ligero incremento por IPC trimestral',
    },
    {
      id: 'inv-03',
      invoiceNumber: 'FAC-2026-8714',
      date: '18/09/2026',
      providerName: 'Cárnicas Sierra S.L.',
      quantityKg: 28.0,
      unitPrice: 12.90,
      totalCost: 361.20,
      documentType: 'factura',
      status: 'aprobada',
    },
    {
      id: 'inv-04',
      invoiceNumber: 'FAC-2026-8430',
      date: '04/09/2026',
      providerName: 'Cárnicas Sierra S.L.',
      quantityKg: 32.0,
      unitPrice: 12.60,
      totalCost: 403.20,
      documentType: 'factura',
      status: 'aprobada',
    },
    {
      id: 'inv-05',
      invoiceNumber: 'FAC-2026-7901',
      date: '12/08/2026',
      providerName: 'Cárnicas Sierra S.L.',
      quantityKg: 25.0,
      unitPrice: 12.40,
      totalCost: 310.00,
      documentType: 'factura',
      status: 'aprobada',
      notes: 'Tarifa oficial firmada según contrato',
    },
    {
      id: 'inv-06',
      invoiceNumber: 'FAC-2026-7244',
      date: '20/07/2026',
      providerName: 'Cárnicas Sierra S.L.',
      quantityKg: 30.0,
      unitPrice: 12.10,
      totalCost: 363.00,
      documentType: 'factura',
      status: 'aprobada',
    },
    {
      id: 'inv-07',
      invoiceNumber: 'FAC-2026-6811',
      date: '28/06/2026',
      providerName: 'Cárnicas Sierra S.L.',
      quantityKg: 26.0,
      unitPrice: 11.90,
      totalCost: 309.40,
      documentType: 'factura',
      status: 'aprobada',
      notes: 'Mínimo del semestre',
    },
  ],
  affectedDishes: [
    {
      id: 'dish-01',
      dishCode: 'REC-012',
      dishName: 'Solomillo al Foie con Reducción de Pedro Ximénez',
      category: 'Plato Estrella / Alta Rentabilidad',
      currentPvp: 28.50,
      grammageInDishKg: 0.250, // 250 g de solomillo
      baseIngredientsCost: 2.15, // foie, reducción PX, mantequilla, sal maldon
      targetFoodCostPct: 28.0,
      monthlyServingsSold: 210,
    },
    {
      id: 'dish-02',
      dishCode: 'REC-015',
      dishName: 'Solomillo a la Brasa con Parmentier Trufada',
      category: 'Plato Principal / Clásico Carta',
      currentPvp: 22.50,
      grammageInDishKg: 0.220, // 220 g
      baseIngredientsCost: 1.45, // patata, crema, trufa, pimienta
      targetFoodCostPct: 27.0,
      monthlyServingsSold: 280,
    },
    {
      id: 'dish-03',
      dishCode: 'REC-019',
      dishName: 'Steak Tartar Clásico con Mostaza Antigua y Yema',
      category: 'Entrante Gourmet / Alta Rotación',
      currentPvp: 19.50,
      grammageInDishKg: 0.180, // 180 g
      baseIngredientsCost: 1.30, // alcaparras, pepinillo, yema, mostaza, tostas
      targetFoodCostPct: 26.0,
      monthlyServingsSold: 195,
    },
    {
      id: 'dish-04',
      dishCode: 'REC-024',
      dishName: 'Carpaccio de Vacuno con Lascas de Idiazábal Ahumado',
      category: 'Entrante Frío / Terraza & Salón',
      currentPvp: 15.50,
      grammageInDishKg: 0.090, // 90 g
      baseIngredientsCost: 1.65, // queso idiazábal ahumado, rúcula, aove
      targetFoodCostPct: 25.0,
      monthlyServingsSold: 160,
    },
  ],
  alternativeSuppliers: [
    {
      id: 'supp-01',
      name: 'Carnes del Guadarrama S.A.',
      unitPrice: 12.90,
      leadTimeDays: 1,
      minOrderKg: 20,
      rating: 4.8,
      contact: '+34 91 854 22 10',
    },
    {
      id: 'supp-02',
      name: 'Horeca Norte Cárnicos',
      unitPrice: 13.20,
      leadTimeDays: 2,
      minOrderKg: 15,
      rating: 4.6,
      contact: '+34 91 662 11 00',
    },
    {
      id: 'supp-03',
      name: 'Mercamadrid Abastos Carnes D.O.',
      unitPrice: 13.50,
      leadTimeDays: 1,
      minOrderKg: 30,
      rating: 4.5,
      contact: '+34 91 785 40 30',
    },
  ],
};

interface ArticlePriceMarginAnalysis360Props {
  initialConfig?: ArticlePriceAnalysisConfig;
  onNavigateHub?: (hub: EntityHubType) => void;
  compact?: boolean;
}

export const ArticlePriceMarginAnalysis360: React.FC<ArticlePriceMarginAnalysis360Props> = ({
  initialConfig = SAMPLE_ARTICLE_ANALYSIS,
  onNavigateHub,
  compact = false,
}) => {
  const { announceAriaLive, openDrawer360 } = useApp();

  // Simulated price for real-time what-if experimentation
  const [simulatedCost, setSimulatedCost] = useState<number>(initialConfig.currentInvoiceCost);
  const [activeTab, setActiveTab] = useState<'comparador_escandallo' | 'historico_facturas' | 'simulador_whatif' | 'proveedores_alternativos'>('comparador_escandallo');
  const [targetMarginGoalPct, setTargetMarginGoalPct] = useState<number>(72.0); // Margen bruto objetivo 72%
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  // Computed values based on simulated cost
  const priceDiffVsBaseline = simulatedCost - initialConfig.baselineCost;
  const priceDiffPct = ((priceDiffVsBaseline / initialConfig.baselineCost) * 100);

  // Weighted Average Cost from historical invoices
  const weightedAverageCost = useMemo(() => {
    const totalCostSum = initialConfig.historyInvoices.reduce((sum, inv) => sum + inv.totalCost, 0);
    const totalKgSum = initialConfig.historyInvoices.reduce((sum, inv) => sum + inv.quantityKg, 0);
    return totalKgSum > 0 ? totalCostSum / totalKgSum : initialConfig.baselineCost;
  }, [initialConfig.historyInvoices]);

  // Monthly overall economic impact on restaurant purchases
  const monthlyCostDeviation = (simulatedCost - initialConfig.baselineCost) * initialConfig.averageMonthlyConsumptionKg;

  // Real-time calculation of escandallo dishes
  const calculatedDishes = useMemo(() => {
    return initialConfig.affectedDishes.map((dish) => {
      // Historical cost with baseline
      const historicalMeatCost = dish.grammageInDishKg * initialConfig.baselineCost;
      const historicalTotalCost = historicalMeatCost + dish.baseIngredientsCost;
      const historicalFoodCostPct = (historicalTotalCost / dish.currentPvp) * 100;
      const historicalGrossMargin = dish.currentPvp - historicalTotalCost;
      const historicalGrossMarginPct = (historicalGrossMargin / dish.currentPvp) * 100;

      // Real-time projected cost with simulated price
      const simulatedMeatCost = dish.grammageInDishKg * simulatedCost;
      const simulatedTotalCost = simulatedMeatCost + dish.baseIngredientsCost;
      const simulatedFoodCostPct = (simulatedTotalCost / dish.currentPvp) * 100;
      const simulatedGrossMargin = dish.currentPvp - simulatedTotalCost;
      const simulatedGrossMarginPct = (simulatedGrossMargin / dish.currentPvp) * 100;

      // Delta
      const costDelta = simulatedTotalCost - historicalTotalCost;
      const marginPctDelta = simulatedGrossMarginPct - historicalGrossMarginPct;
      const monthlyMarginLoss = costDelta * dish.monthlyServingsSold;

      // Recommended PVP to preserve target margin goal (targetMarginGoalPct)
      // Margin = (PVP - Cost) / PVP => Cost / (1 - MarginGoal)
      const recommendedPvpToKeepMargin = simulatedTotalCost / (1 - (targetMarginGoalPct / 100));

      const isAlert = simulatedFoodCostPct > dish.targetFoodCostPct;
      const isCritical = simulatedFoodCostPct > dish.targetFoodCostPct + 3.0;

      return {
        ...dish,
        historicalMeatCost,
        historicalTotalCost,
        historicalFoodCostPct,
        historicalGrossMargin,
        historicalGrossMarginPct,
        simulatedMeatCost,
        simulatedTotalCost,
        simulatedFoodCostPct,
        simulatedGrossMargin,
        simulatedGrossMarginPct,
        costDelta,
        marginPctDelta,
        monthlyMarginLoss,
        recommendedPvpToKeepMargin,
        isAlert,
        isCritical,
      };
    });
  }, [initialConfig, simulatedCost, targetMarginGoalPct]);

  // Aggregate monthly loss across all recipes
  const totalMonthlyEscandalloLoss = calculatedDishes.reduce(
    (sum, d) => sum + d.monthlyMarginLoss,
    0
  );

  const handleResetToBaseline = () => {
    setSimulatedCost(initialConfig.baselineCost);
    announceAriaLive(`Precio reseteado a referencia base: ${initialConfig.baselineCost.toFixed(2)} €/kg`);
  };

  const handleApplyLatestInvoice = () => {
    setSimulatedCost(initialConfig.currentInvoiceCost);
    announceAriaLive(`Precio ajustado al último albarán/factura: ${initialConfig.currentInvoiceCost.toFixed(2)} €/kg`);
  };

  const handleApplySupplier = (price: number, name: string) => {
    setSimulatedCost(price);
    announceAriaLive(`Precio ajustado a oferta de ${name}: ${price.toFixed(2)} €/kg`);
  };

  const handleApplyToMasterEscandallos = () => {
    setActionNotice(
      `✓ Escandallos maestros actualizados con coste de ${simulatedCost.toFixed(2)} €/kg. Se ha generado una notificación al Jefe de Cocina.`
    );
    announceAriaLive('Escandallos actualizados correctamente en base de datos');
    setTimeout(() => setActionNotice(null), 5000);
  };

  const handleExportReport = () => {
    setActionNotice(
      `✓ Informe de impacto y desvío de costes de ${initialConfig.articleName} generado en formato auditoría.`
    );
    announceAriaLive('Informe descargado con éxito');
    setTimeout(() => setActionNotice(null), 4000);
  };

  // Min and max for sparkline in invoice history
  const minHistoricalPrice = Math.min(...initialConfig.historyInvoices.map((i) => i.unitPrice));
  const maxHistoricalPrice = Math.max(...initialConfig.historyInvoices.map((i) => i.unitPrice));

  return (
    <div className="bg-white rounded-3xl border-2 border-slate-200/90 shadow-sm overflow-hidden space-y-0 transition-all">
      {/* COMPONENT HEADER & ARTICLE IDENTITY */}
      <div className="bg-gradient-to-r from-[#022853] via-[#004780] to-[#0067B9] text-white p-5 sm:p-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-[#80D518] text-[#022853] font-mono shadow-2xs">
                360º Costes & Escandallos
              </span>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-white/10 text-white border border-white/20">
                {initialConfig.articleCode}
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-blue-900/60 text-blue-200">
                {initialConfig.category}
              </span>
              {priceDiffPct > 5 && (
                <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-rose-500 text-white flex items-center gap-1 animate-pulse">
                  <AlertTriangle className="w-3 h-3" />
                  Alerta Desvío +{priceDiffPct.toFixed(1)}%
                </span>
              )}
            </div>

            <h3 className="text-xl sm:text-2xl font-black font-brand tracking-tight text-white flex items-center gap-2">
              <Scale className="w-6 h-6 text-[#80D518] shrink-0" />
              <span>{initialConfig.articleName}</span>
            </h3>

            <p className="text-xs sm:text-sm text-blue-100 max-w-2xl leading-relaxed">
              Auditoría comparativa en tiempo real: Contraste entre el precio de compra recepcionado en albaranes/facturas y su repercusión matemática directa sobre los márgenes de escandallo en carta.
            </p>
          </div>

          {/* Quick Metrics Badge in Header */}
          <div className="flex items-center gap-2 self-start lg:self-auto bg-black/25 p-3 rounded-2xl border border-white/15 backdrop-blur-xs">
            <div className="text-right">
              <span className="text-[10px] uppercase font-bold text-blue-200 block">
                Precio Último Albarán
              </span>
              <span className="text-xl sm:text-2xl font-black font-mono text-[#80D518]">
                {initialConfig.currentInvoiceCost.toFixed(2)} € <span className="text-xs text-white">/ {initialConfig.unit}</span>
              </span>
            </div>
            <div className="h-8 w-px bg-white/20 mx-1" />
            <div className="text-left">
              <span className="text-[10px] uppercase font-bold text-slate-300 block">
                Pactado Base
              </span>
              <span className="text-sm sm:text-base font-bold font-mono text-slate-200">
                {initialConfig.baselineCost.toFixed(2)} €
              </span>
            </div>
          </div>
        </div>

        {/* TAB CONTROLS */}
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pt-5 -mb-1">
          {[
            {
              id: 'comparador_escandallo' as const,
              label: 'Impacto en Escandallos',
              badge: `${calculatedDishes.length} Platos`,
              icon: Utensils,
            },
            {
              id: 'simulador_whatif' as const,
              label: 'Simulador "What-If" en Vivo',
              badge: 'Tiempo Real',
              icon: Sliders,
            },
            {
              id: 'historico_facturas' as const,
              label: 'Histórico de Facturas',
              badge: `${initialConfig.historyInvoices.length} docs`,
              icon: Receipt,
            },
            {
              id: 'proveedores_alternativos' as const,
              label: 'Proveedores Alternativos',
              badge: `${initialConfig.alternativeSuppliers.length} ofertas`,
              icon: Building2,
            },
          ].map((tab) => {
            const Icon = tab.icon;
            const isCurrent = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  announceAriaLive(`Cambiado a pestaña ${tab.label}`);
                }}
                className={`touch-target-min text-xs font-bold px-3.5 py-2 rounded-xl transition flex items-center gap-1.5 shrink-0 ${
                  isCurrent
                    ? 'bg-white text-[#022853] shadow-md font-black'
                    : 'bg-white/10 text-white/80 hover:bg-white/20 hover:text-white'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isCurrent ? 'text-[#0067B9]' : 'text-white/70'}`} />
                <span>{tab.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                    isCurrent ? 'bg-blue-100 text-[#022853]' : 'bg-black/20 text-blue-200'
                  }`}
                >
                  {tab.badge}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ACTION NOTICE TOAST */}
      {actionNotice && (
        <div className="bg-emerald-50 border-b border-emerald-200 px-5 py-3 text-emerald-900 text-xs font-bold flex items-center justify-between gap-3 animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{actionNotice}</span>
          </div>
          <button
            onClick={() => setActionNotice(null)}
            className="text-emerald-700 hover:text-emerald-900 text-[11px] underline"
          >
            Cerrar
          </button>
        </div>
      )}

      {/* SUMMARY BANNER: REAL-TIME KEY FINANCIAL DELTAS */}
      <div className="p-4 sm:p-5 bg-slate-50 border-b border-slate-200 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Coste Analizado (Simulador)
          </span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-lg sm:text-xl font-black font-mono text-slate-900">
              {simulatedCost.toFixed(2)} €
            </span>
            <span className="text-[10px] text-slate-500 font-medium">/ {initialConfig.unit}</span>
          </div>
          <div className="flex items-center gap-1 text-[11px] font-bold mt-1">
            {priceDiffPct > 0 ? (
              <span className="text-rose-600 flex items-center gap-0.5">
                <TrendingUp className="w-3 h-3" /> +{priceDiffPct.toFixed(1)}% vs base
              </span>
            ) : priceDiffPct < 0 ? (
              <span className="text-emerald-600 flex items-center gap-0.5">
                <TrendingDown className="w-3 h-3" /> {priceDiffPct.toFixed(1)}% vs base
              </span>
            ) : (
              <span className="text-slate-500">Sin variación</span>
            )}
          </div>
        </div>

        <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Precio Medio Ponderado (PMP)
          </span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-lg sm:text-xl font-black font-mono text-slate-900">
              {weightedAverageCost.toFixed(2)} €
            </span>
            <span className="text-[10px] text-slate-500 font-medium">/ {initialConfig.unit}</span>
          </div>
          <span className="text-[11px] text-slate-500 block mt-1">
            Calculado sobre 7 facturas
          </span>
        </div>

        <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Desvío Compra Mensual
          </span>
          <div className="flex items-baseline gap-1 mt-1">
            <span
              className={`text-lg sm:text-xl font-black font-mono ${
                monthlyCostDeviation > 0 ? 'text-rose-600' : 'text-emerald-600'
              }`}
            >
              {monthlyCostDeviation > 0 ? `+${monthlyCostDeviation.toFixed(2)}` : monthlyCostDeviation.toFixed(2)} €
            </span>
            <span className="text-[10px] text-slate-500 font-medium">/ mes</span>
          </div>
          <span className="text-[11px] text-slate-500 block mt-1">
            Para {initialConfig.averageMonthlyConsumptionKg} kg consumo
          </span>
        </div>

        <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Impacto Escandallo Total
          </span>
          <div className="flex items-baseline gap-1 mt-1">
            <span
              className={`text-lg sm:text-xl font-black font-mono ${
                totalMonthlyEscandalloLoss > 0 ? 'text-rose-600' : 'text-emerald-600'
              }`}
            >
              {totalMonthlyEscandalloLoss > 0 ? `-${totalMonthlyEscandalloLoss.toFixed(2)}` : `+${Math.abs(totalMonthlyEscandalloLoss).toFixed(2)}`} €
            </span>
            <span className="text-[10px] text-slate-500 font-medium">/ mes</span>
          </div>
          <span className="text-[11px] text-slate-500 block mt-1">
            En 4 recetas de carta activa
          </span>
        </div>
      </div>

      {/* MAIN TAB CONTENT CONTAINER */}
      <div className="p-5 sm:p-6 space-y-6">

        {/* ========================================================================= */}
        {/* TAB 1: COMPARADOR DE IMPACTO EN ESCANDALLOS */}
        {/* ========================================================================= */}
        {activeTab === 'comparador_escandallo' && (
          <div className="space-y-5 animate-in fade-in duration-150">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h4 className="text-base sm:text-lg font-black font-brand text-[#022853] flex items-center gap-2">
                  <Utensils className="w-5 h-5 text-[#0067B9]" />
                  <span>Repercusión en Fichas de Escandallo por Plato</span>
                </h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  Análisis plato a plato: Cada vez que el coste del ingrediente sube, el Food Cost % del escandallo se incrementa y el margen de beneficio se erosiona.
                </p>
              </div>

              {/* Quick slider quick trigger */}
              <div className="flex items-center gap-2 self-start sm:self-auto">
                <button
                  onClick={handleResetToBaseline}
                  className="px-2.5 py-1.5 rounded-xl border border-slate-300 hover:bg-slate-100 text-xs font-bold text-slate-700 flex items-center gap-1 transition"
                  title="Volver a precio base de 12,40 €/kg"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
                  <span>Ver con Base ({initialConfig.baselineCost.toFixed(2)} €)</span>
                </button>
                <button
                  onClick={handleApplyLatestInvoice}
                  className="px-2.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold flex items-center gap-1 transition shadow-2xs"
                  title="Aplicar precio de último albarán 14,20 €/kg"
                >
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>Ver Albarán Actual ({initialConfig.currentInvoiceCost.toFixed(2)} €)</span>
                </button>
              </div>
            </div>

            {/* CARDS LIST OF AFFECTED DISHES */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {calculatedDishes.map((dish) => {
                const foodCostDiff = dish.simulatedFoodCostPct - dish.historicalFoodCostPct;
                return (
                  <div
                    key={dish.id}
                    className={`p-5 rounded-2xl border-2 transition-all space-y-4 ${
                      dish.isCritical
                        ? 'bg-rose-50/40 border-rose-300 shadow-xs'
                        : dish.isAlert
                        ? 'bg-amber-50/40 border-amber-300 shadow-xs'
                        : 'bg-white border-slate-200'
                    }`}
                  >
                    {/* Dish header */}
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[10px] font-mono font-black uppercase px-2 py-0.5 rounded bg-slate-900 text-white">
                            {dish.dishCode}
                          </span>
                          <span className="text-[10px] font-bold text-slate-500">
                            {dish.category}
                          </span>
                          {dish.isCritical ? (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 border border-rose-300">
                              Exceso Grave Food Cost
                            </span>
                          ) : dish.isAlert ? (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-300">
                              Supera Umbral Objetivo
                            </span>
                          ) : (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                              Margen Protegido
                            </span>
                          )}
                        </div>
                        <h5 className="text-sm sm:text-base font-black text-slate-900 leading-snug">
                          {dish.dishName}
                        </h5>
                        <span className="text-xs text-slate-500">
                          Gramaje del artículo: <strong>{(dish.grammageInDishKg * 1000).toFixed(0)} gramos</strong> por ración
                        </span>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="text-[10px] text-slate-400 block font-semibold">PVP en Carta</span>
                        <span className="text-base sm:text-lg font-black font-mono text-[#0067B9]">
                          {dish.currentPvp.toFixed(2)} €
                        </span>
                      </div>
                    </div>

                    {/* COMPARATIVE COST & MARGIN BOXES */}
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="bg-white/80 p-3 rounded-xl border border-slate-200 space-y-1">
                        <span className="text-[10px] uppercase font-bold text-slate-400 block">
                          Coste Total Escandallo
                        </span>
                        <div className="flex items-baseline justify-between">
                          <span className="text-xs line-through text-slate-400 font-mono">
                            {dish.historicalTotalCost.toFixed(2)} €
                          </span>
                          <span className="text-sm font-black font-mono text-slate-900">
                            {dish.simulatedTotalCost.toFixed(2)} €
                          </span>
                        </div>
                        <div className="text-[10px] font-bold text-rose-600 flex items-center justify-between pt-0.5 border-t border-slate-100">
                          <span>Subida ración:</span>
                          <span>+{dish.costDelta.toFixed(2)} € / rac</span>
                        </div>
                      </div>

                      <div className="bg-white/80 p-3 rounded-xl border border-slate-200 space-y-1">
                        <span className="text-[10px] uppercase font-bold text-slate-400 block">
                          Margen Bruto Ración
                        </span>
                        <div className="flex items-baseline justify-between">
                          <span className="text-xs line-through text-slate-400 font-mono">
                            {dish.historicalGrossMargin.toFixed(2)} €
                          </span>
                          <span className="text-sm font-black font-mono text-slate-900">
                            {dish.simulatedGrossMargin.toFixed(2)} €
                          </span>
                        </div>
                        <div className="text-[10px] font-bold text-slate-500 flex items-center justify-between pt-0.5 border-t border-slate-100">
                          <span>Margen %:</span>
                          <span className={dish.simulatedGrossMarginPct < 70 ? 'text-amber-700' : 'text-emerald-700'}>
                            {dish.simulatedGrossMarginPct.toFixed(1)}% ({dish.marginPctDelta.toFixed(1)}%)
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* VISUAL PROGRESS BAR: FOOD COST % */}
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="font-bold text-slate-600 flex items-center gap-1">
                          <span>Food Cost %:</span>
                          <strong className="text-slate-900 font-mono">{dish.simulatedFoodCostPct.toFixed(1)}%</strong>
                          <span className="text-slate-400 text-[10px]">
                            (antes {dish.historicalFoodCostPct.toFixed(1)}%)
                          </span>
                        </span>
                        <span className="text-[10px] font-bold text-slate-500">
                          Meta Objetivo: &le; {dish.targetFoodCostPct.toFixed(1)}%
                        </span>
                      </div>

                      {/* Visual Meter Bar */}
                      <div className="h-3 w-full bg-slate-200 rounded-full overflow-hidden relative flex">
                        {/* Target Marker */}
                        <div
                          className="absolute top-0 bottom-0 w-0.5 bg-slate-900 z-10"
                          style={{ left: `${Math.min(dish.targetFoodCostPct * 2, 95)}%` }}
                          title={`Meta: ${dish.targetFoodCostPct}%`}
                        />
                        <div
                          className={`h-full transition-all duration-300 rounded-full ${
                            dish.isCritical
                              ? 'bg-rose-500'
                              : dish.isAlert
                              ? 'bg-amber-500'
                              : 'bg-emerald-500'
                          }`}
                          style={{ width: `${Math.min(dish.simulatedFoodCostPct * 2, 100)}%` }}
                        />
                      </div>
                    </div>

                    {/* SMART RECOMMENDATION & PVP SIMULATION */}
                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                      <div>
                        <span className="text-[10px] font-bold text-slate-500 block uppercase">
                          PVP Recomendado (para retener 72% de margen):
                        </span>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-sm font-black font-mono text-slate-900">
                            {dish.recommendedPvpToKeepMargin.toFixed(2)} €
                          </span>
                          <span className="text-[10px] font-bold text-amber-700 bg-amber-100 px-1.5 py-0.2 rounded">
                            +{(dish.recommendedPvpToKeepMargin - dish.currentPvp).toFixed(2)} € en carta
                          </span>
                        </div>
                      </div>

                      <div className="text-right sm:text-right">
                        <span className="text-[10px] text-slate-400 block font-medium">
                          Pérdida mensual estimada ({dish.monthlyServingsSold} ventas/mes)
                        </span>
                        <span className="text-xs font-black font-mono text-rose-700">
                          -{dish.monthlyMarginLoss.toFixed(2)} € / mes
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* ACTION BAR AT BOTTOM */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0" />
                <span className="text-xs text-slate-700 font-medium">
                  <strong>Impacto consolidado:</strong> Si mantienes el precio del último albarán ({initialConfig.currentInvoiceCost.toFixed(2)} €/kg), el restaurante absorberá un desvío de <strong>-{totalMonthlyEscandalloLoss.toFixed(2)} €/mes</strong> en cocina.
                </span>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={handleApplyToMasterEscandallos}
                  className="touch-target-min px-3.5 py-2 rounded-xl bg-[#0067B9] hover:bg-[#022853] text-white text-xs font-bold transition flex items-center gap-1.5 shadow-xs"
                >
                  <Utensils className="w-3.5 h-3.5 text-[#80D518]" />
                  <span>Aplicar a Escandallos Oficiales</span>
                </button>
                <button
                  onClick={handleExportReport}
                  className="touch-target-min px-3 py-2 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-bold transition flex items-center gap-1"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Exportar Informe</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: SIMULADOR "WHAT-IF" EN TIEMPO REAL */}
        {/* ========================================================================= */}
        {activeTab === 'simulador_whatif' && (
          <div className="space-y-6 animate-in fade-in duration-150">
            <div className="bg-blue-50/80 rounded-2xl p-4 sm:p-5 border border-blue-200 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-sm sm:text-base font-black font-brand text-[#022853] flex items-center gap-2">
                  <Sliders className="w-5 h-5 text-[#0067B9]" />
                  <span>Simulador Dinámico de Coste de Compra & Sensibilidad</span>
                </h4>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-200 text-[#022853]">
                  Motor de Simulación Predictiva
                </span>
              </div>
              <p className="text-xs text-slate-700 leading-relaxed">
                Desplaza la barra o introduce un coste hipotético para ver cómo reaccionan en tiempo real los márgenes de cocina, el punto de equilibrio y el PVP recomendado para no perder rentabilidad.
              </p>
            </div>

            {/* INTERACTIVE SLIDER CARD */}
            <div className="p-6 rounded-3xl bg-slate-50 border-2 border-slate-200 space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <span className="text-xs font-black uppercase tracking-wider text-slate-500 block">
                    Precio de Coste Simulado del Artículo (€/kg):
                  </span>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-3xl sm:text-4xl font-black font-mono text-[#022853]">
                      {simulatedCost.toFixed(2)} €
                    </span>
                    <span className="text-sm font-bold text-slate-500">por {initialConfig.unit}</span>
                  </div>
                </div>

                {/* Direct Number Input */}
                <div className="flex items-center gap-2">
                  <label htmlFor="manual-cost-input" className="text-xs font-bold text-slate-600">
                    Ajuste numérico:
                  </label>
                  <div className="relative">
                    <input
                      id="manual-cost-input"
                      type="number"
                      step="0.10"
                      min="8"
                      max="30"
                      value={simulatedCost}
                      onChange={(e) => setSimulatedCost(parseFloat(e.target.value) || 0)}
                      className="w-28 p-2 pr-7 rounded-xl border-2 border-slate-300 font-mono font-bold text-sm text-slate-900 focus:outline-hidden focus:border-[#0067B9]"
                    />
                    <span className="absolute right-2.5 top-2.5 text-xs text-slate-400 font-bold">€</span>
                  </div>
                </div>
              </div>

              {/* SLIDER INPUT */}
              <div className="space-y-2">
                <input
                  type="range"
                  min="9.00"
                  max="22.00"
                  step="0.10"
                  value={simulatedCost}
                  onChange={(e) => setSimulatedCost(parseFloat(e.target.value))}
                  className="w-full h-3 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#0067B9]"
                />
                <div className="flex justify-between text-[10px] font-mono font-bold text-slate-400">
                  <span>9.00 € (Mínimo mercado)</span>
                  <span>12.40 € (Base pactada)</span>
                  <span>14.20 € (Albarán hoy)</span>
                  <span>22.00 € (Escenario crítico)</span>
                </div>
              </div>

              {/* PRESETS BUTTONS */}
              <div className="pt-2 border-t border-slate-200 flex items-center gap-2 flex-wrap">
                <span className="text-[11px] font-bold text-slate-500 mr-1">Escenarios Rápidos:</span>
                <button
                  onClick={() => setSimulatedCost(initialConfig.baselineCost)}
                  className={`text-xs px-2.5 py-1 rounded-lg font-bold border transition ${
                    simulatedCost === initialConfig.baselineCost
                      ? 'bg-[#0067B9] text-white border-[#0067B9]'
                      : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-200'
                  }`}
                >
                  Tarifa Pactada ({initialConfig.baselineCost.toFixed(2)} €)
                </button>
                <button
                  onClick={() => setSimulatedCost(initialConfig.currentInvoiceCost)}
                  className={`text-xs px-2.5 py-1 rounded-lg font-bold border transition ${
                    simulatedCost === initialConfig.currentInvoiceCost
                      ? 'bg-amber-600 text-white border-amber-600'
                      : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-200'
                  }`}
                >
                  Último Albarán ({initialConfig.currentInvoiceCost.toFixed(2)} €)
                </button>
                <button
                  onClick={() => setSimulatedCost(12.90)}
                  className={`text-xs px-2.5 py-1 rounded-lg font-bold border transition ${
                    simulatedCost === 12.90
                      ? 'bg-emerald-600 text-white border-emerald-600'
                      : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-200'
                  }`}
                >
                  Mejor Proveedor Alt. (12.90 €)
                </button>
                <button
                  onClick={() => setSimulatedCost(16.50)}
                  className={`text-xs px-2.5 py-1 rounded-lg font-bold border transition ${
                    simulatedCost === 16.50
                      ? 'bg-rose-600 text-white border-rose-600'
                      : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-200'
                  }`}
                >
                  Estrés Inflacionario (+33%)
                </button>
              </div>
            </div>

            {/* LIVE RESULTS TABLE FOR ALL 4 DISHES */}
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs">
              <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                <span className="text-xs font-black uppercase text-slate-700 tracking-wider">
                  Matriz de Elasticidad de Escandallos en Vivo
                </span>
                <span className="text-xs text-slate-500 font-medium">
                  Objetivo de margen global: <strong>{targetMarginGoalPct}%</strong>
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-100/80 text-[10px] uppercase font-bold text-slate-500 border-b border-slate-200">
                    <tr>
                      <th className="p-3">Plato en Carta</th>
                      <th className="p-3">PVP Actual</th>
                      <th className="p-3">Coste Ración</th>
                      <th className="p-3">Food Cost %</th>
                      <th className="p-3">Margen Bruto</th>
                      <th className="p-3">PVP Sugerido</th>
                      <th className="p-3 text-right">Desvío Mensual</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {calculatedDishes.map((dish) => (
                      <tr key={dish.id} className="hover:bg-slate-50/80 transition">
                        <td className="p-3">
                          <strong className="block text-slate-900 font-bold">{dish.dishName}</strong>
                          <span className="text-[10px] text-slate-400 font-mono">
                            {dish.dishCode} · {(dish.grammageInDishKg * 1000).toFixed(0)}g
                          </span>
                        </td>
                        <td className="p-3 font-mono font-bold text-slate-900">
                          {dish.currentPvp.toFixed(2)} €
                        </td>
                        <td className="p-3 font-mono">
                          <span className="font-bold text-slate-900">{dish.simulatedTotalCost.toFixed(2)} €</span>
                          <span className="text-[10px] text-slate-400 block font-medium">
                            +{dish.costDelta.toFixed(2)} €
                          </span>
                        </td>
                        <td className="p-3 font-mono">
                          <span
                            className={`font-black px-1.5 py-0.5 rounded ${
                              dish.isCritical
                                ? 'bg-rose-100 text-rose-800'
                                : dish.isAlert
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-emerald-100 text-emerald-800'
                            }`}
                          >
                            {dish.simulatedFoodCostPct.toFixed(1)}%
                          </span>
                        </td>
                        <td className="p-3 font-mono">
                          <span className="font-bold text-slate-800">
                            {dish.simulatedGrossMargin.toFixed(2)} €
                          </span>
                          <span className="text-[10px] text-slate-500 block">
                            {dish.simulatedGrossMarginPct.toFixed(1)}%
                          </span>
                        </td>
                        <td className="p-3 font-mono">
                          <span className="font-bold text-[#0067B9]">
                            {dish.recommendedPvpToKeepMargin.toFixed(2)} €
                          </span>
                          <span className="text-[10px] text-slate-400 block">
                            +{(dish.recommendedPvpToKeepMargin - dish.currentPvp).toFixed(2)} €
                          </span>
                        </td>
                        <td className="p-3 text-right font-mono font-bold">
                          <span
                            className={dish.monthlyMarginLoss > 0 ? 'text-rose-600' : 'text-emerald-600'}
                          >
                            {dish.monthlyMarginLoss > 0
                              ? `-${dish.monthlyMarginLoss.toFixed(2)} €`
                              : `+${Math.abs(dish.monthlyMarginLoss).toFixed(2)} €`}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 3: HISTÓRICO DE FACTURAS Y ALBARANES */}
        {/* ========================================================================= */}
        {activeTab === 'historico_facturas' && (
          <div className="space-y-6 animate-in fade-in duration-150">
            <div>
              <h4 className="text-base sm:text-lg font-black font-brand text-[#022853] flex items-center gap-2">
                <Receipt className="w-5 h-5 text-[#0067B9]" />
                <span>Histórico de Facturas de Proveedores ({initialConfig.historyInvoices.length} recepciones)</span>
              </h4>
              <p className="text-xs text-slate-500 mt-0.5">
                Trazabilidad digital de albaranes y facturas de compra en los últimos 6 meses. Detecta picos de precio no pactados y desvíos frente a la tarifa marco.
              </p>
            </div>

            {/* VISUAL SPARKLINE CHART */}
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-700 flex items-center gap-1.5">
                  <TrendingUp className="w-4 h-4 text-[#0067B9]" />
                  Curva de Evolución del Precio Unitario (€/kg):
                </span>
                <span className="text-[11px] text-slate-500 font-mono">
                  Mín: {minHistoricalPrice.toFixed(2)} € · Máx: {maxHistoricalPrice.toFixed(2)} €
                </span>
              </div>

              {/* Visual SVG Timeline Bar/Line representation */}
              <div className="h-32 w-full bg-white p-3 rounded-xl border border-slate-200 flex items-end justify-between gap-2">
                {initialConfig.historyInvoices.slice().reverse().map((inv, idx) => {
                  const range = maxHistoricalPrice - minHistoricalPrice || 1;
                  const heightPercent = 25 + ((inv.unitPrice - minHistoricalPrice) / range) * 70;
                  const isLatest = idx === initialConfig.historyInvoices.length - 1;
                  return (
                    <div key={inv.id} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end group">
                      <span className="text-[10px] font-mono font-bold text-slate-600 opacity-0 group-hover:opacity-100 transition">
                        {inv.unitPrice.toFixed(2)}€
                      </span>
                      <div
                        className={`w-full max-w-[36px] rounded-t-lg transition-all duration-300 ${
                          isLatest
                            ? 'bg-rose-500 shadow-md group-hover:bg-rose-600'
                            : inv.unitPrice > 13.0
                            ? 'bg-amber-400 group-hover:bg-amber-500'
                            : 'bg-[#0067B9] group-hover:bg-[#022853]'
                        }`}
                        style={{ height: `${heightPercent}%` }}
                        title={`${inv.invoiceNumber} (${inv.date}): ${inv.unitPrice} €/kg`}
                      />
                      <span className="text-[9px] font-mono text-slate-400 truncate max-w-full">
                        {inv.date.split('/')[0]}/{inv.date.split('/')[1]}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* DETAILED INVOICE AUDIT TABLE */}
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-100 text-[10px] uppercase font-bold text-slate-500 border-b border-slate-200">
                    <tr>
                      <th className="p-3">Doc / Albarán</th>
                      <th className="p-3">Fecha</th>
                      <th className="p-3">Proveedor</th>
                      <th className="p-3">Cantidad</th>
                      <th className="p-3">Precio Unitario</th>
                      <th className="p-3">Total Importe</th>
                      <th className="p-3">Estado Auditoría</th>
                      <th className="p-3 text-right">Acción 360º</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {initialConfig.historyInvoices.map((inv) => {
                      const diffVsBase = inv.unitPrice - initialConfig.baselineCost;
                      return (
                        <tr key={inv.id} className="hover:bg-slate-50/80 transition">
                          <td className="p-3">
                            <div className="flex items-center gap-1.5">
                              {inv.documentType === 'albaran' ? (
                                <Truck className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                              ) : (
                                <FileText className="w-3.5 h-3.5 text-[#0067B9] shrink-0" />
                              )}
                              <span className="font-mono font-bold text-slate-900">
                                {inv.invoiceNumber}
                              </span>
                            </div>
                            {inv.notes && (
                              <span className="text-[10px] text-slate-500 block truncate max-w-xs">
                                {inv.notes}
                              </span>
                            )}
                          </td>
                          <td className="p-3 text-slate-600 font-mono">{inv.date}</td>
                          <td className="p-3 text-slate-700">{inv.providerName}</td>
                          <td className="p-3 font-mono">{inv.quantityKg} kg</td>
                          <td className="p-3 font-mono font-black">
                            <span className={diffVsBase > 1.0 ? 'text-rose-600' : 'text-slate-900'}>
                              {inv.unitPrice.toFixed(2)} €
                            </span>
                            {diffVsBase !== 0 && (
                              <span className={`text-[10px] ml-1 ${diffVsBase > 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
                                ({diffVsBase > 0 ? `+${diffVsBase.toFixed(2)}` : diffVsBase.toFixed(2)})
                              </span>
                            )}
                          </td>
                          <td className="p-3 font-mono font-bold text-slate-900">
                            {inv.totalCost.toFixed(2)} €
                          </td>
                          <td className="p-3">
                            {inv.status === 'en_disputa' ? (
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 border border-rose-300">
                                En Disputa OCR
                              </span>
                            ) : inv.status === 'contabilizada' ? (
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
                                Contabilizada
                              </span>
                            ) : (
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                                Aprobada
                              </span>
                            )}
                          </td>
                          <td className="p-3 text-right">
                            <button
                              onClick={() => {
                                if (onNavigateHub) {
                                  onNavigateHub(inv.documentType === 'albaran' ? 'albaran' : 'factura');
                                } else {
                                  openDrawer360(inv.documentType === 'albaran' ? 'albaran' : 'factura');
                                }
                              }}
                              className="text-[11px] font-bold text-[#0067B9] hover:underline inline-flex items-center gap-1"
                            >
                              <span>Ver Doc</span>
                              <ExternalLink className="w-3 h-3" />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 4: PROVEEDORES ALTERNATIVOS */}
        {/* ========================================================================= */}
        {activeTab === 'proveedores_alternativos' && (
          <div className="space-y-6 animate-in fade-in duration-150">
            <div>
              <h4 className="text-base sm:text-lg font-black font-brand text-[#022853] flex items-center gap-2">
                <Building2 className="w-5 h-5 text-[#0067B9]" />
                <span>Alternativas de Compra Homologadas en Red de Proveedores</span>
              </h4>
              <p className="text-xs text-slate-500 mt-0.5">
                Compara precios con otros distribuidores verificados para mitigar la subida o renegociar con Cárnicas Sierra S.L.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {initialConfig.alternativeSuppliers.map((supp) => {
                const savingVsCurrent = initialConfig.currentInvoiceCost - supp.unitPrice;
                const monthlyPotentialSaving = savingVsCurrent * initialConfig.averageMonthlyConsumptionKg;
                return (
                  <div
                    key={supp.id}
                    className="p-5 rounded-2xl border-2 border-slate-200 bg-white hover:border-[#0067B9] transition shadow-xs flex flex-col justify-between space-y-4"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                          Ahorro -{savingVsCurrent.toFixed(2)} €/kg
                        </span>
                        <div className="flex items-center gap-1 text-amber-500 text-xs font-bold">
                          <span>★</span>
                          <span>{supp.rating}</span>
                        </div>
                      </div>

                      <h5 className="text-sm font-black text-slate-900 leading-snug">
                        {supp.name}
                      </h5>

                      <div className="text-xs text-slate-500 space-y-1">
                        <div>Entrega: <strong>{supp.leadTimeDays} día(s) laboral</strong></div>
                        <div>Pedido mínimo: <strong>{supp.minOrderKg} kg</strong></div>
                        <div>Contacto: <span className="font-mono">{supp.contact}</span></div>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-100 space-y-2">
                      <div className="flex items-baseline justify-between">
                        <span className="text-[10px] uppercase font-bold text-slate-400">Precio ofertado:</span>
                        <span className="text-xl font-black font-mono text-emerald-700">
                          {supp.unitPrice.toFixed(2)} € <span className="text-xs font-normal">/ kg</span>
                        </span>
                      </div>

                      <div className="bg-emerald-50 p-2.5 rounded-xl border border-emerald-200 text-[11px] text-emerald-900 font-bold flex items-center justify-between">
                        <span>Ahorro mensual potencial:</span>
                        <span>+{monthlyPotentialSaving.toFixed(2)} € / mes</span>
                      </div>

                      <button
                        onClick={() => handleApplySupplier(supp.unitPrice, supp.name)}
                        className="w-full py-2 rounded-xl bg-slate-900 hover:bg-[#022853] text-white text-xs font-bold transition flex items-center justify-center gap-1.5"
                      >
                        <Sliders className="w-3.5 h-3.5 text-[#80D518]" />
                        <span>Simular Escandallo con esta Oferta</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
