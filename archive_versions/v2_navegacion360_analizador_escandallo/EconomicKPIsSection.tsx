import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { EconomicMetrics } from '../../types/cockpit';
import { EntityHubType } from '../../services/dataModel360';
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  Calendar,
  PieChart,
  BarChart3,
  CheckCircle,
  Clock,
  ArrowUpRight,
  Info,
  Compass,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Layers,
  ArrowRight,
  Receipt,
  Truck,
  User,
  AlertTriangle,
} from 'lucide-react';

export const EconomicKPIsSection: React.FC<{ metrics: EconomicMetrics }> = ({ metrics }) => {
  const { openDrawer360, announceAriaLive } = useApp();
  const [showFormulaModal, setShowFormulaModal] = useState(false);
  const [breakdownMetric, setBreakdownMetric] = useState<'ingresos' | 'gastos' | 'resultado' | 'caja' | null>('gastos');

  return (
    <div className="space-y-6">
      
      {/* 4 Main Big Economic Cards (DASH-001 Section 3) with 360 Drill-Down Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* 1. Ingresos */}
        <div className={`p-5 rounded-3xl border transition shadow-xs space-y-2 flex flex-col justify-between ${
          breakdownMetric === 'ingresos' ? 'bg-blue-50/70 border-[#0067B9] ring-2 ring-[#0067B9]/30' : 'bg-white border-slate-200'
        }`}>
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Ingresos Facturados
              </span>
              <span className="text-xs font-black px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                +{metrics.ingresosVarPct}% vs ant.
              </span>
            </div>
            <div className="text-2xl sm:text-3xl font-black font-brand text-[#022853] mt-1">
              {metrics.ingresos.toLocaleString('es-ES', { minimumFractionDigits: 2 })} €
            </div>
            <div className="text-[11px] text-slate-400 mt-1">
              Facturas emitidas autorizadas
            </div>
          </div>
          <button
            onClick={() => setBreakdownMetric(breakdownMetric === 'ingresos' ? null : 'ingresos')}
            className={`w-full mt-2 py-1.5 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 border ${
              breakdownMetric === 'ingresos'
                ? 'bg-[#0067B9] text-white border-[#0067B9]'
                : 'bg-slate-50 hover:bg-slate-100 text-[#0067B9] border-blue-200'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>{breakdownMetric === 'ingresos' ? 'Cerrar Desglose' : 'Desglosar en 360º'}</span>
            <ChevronDown className={`w-3 h-3 transition-transform ${breakdownMetric === 'ingresos' ? 'rotate-180' : ''}`} />
          </button>
        </div>

        {/* 2. Gastos Aprobados */}
        <div className={`p-5 rounded-3xl border transition shadow-xs space-y-2 flex flex-col justify-between ${
          breakdownMetric === 'gastos' ? 'bg-blue-50/70 border-[#0067B9] ring-2 ring-[#0067B9]/30' : 'bg-white border-slate-200'
        }`}>
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Gastos Aprobados
              </span>
              <span className="text-xs font-black px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                {metrics.gastosVarPct}% vs ant.
              </span>
            </div>
            <div className="text-2xl sm:text-3xl font-black font-brand text-[#0067B9] mt-1">
              {metrics.gastosAprobados.toLocaleString('es-ES', { minimumFractionDigits: 2 })} €
            </div>
            
            {/* Offline-First Breakdown */}
            <div className="bg-slate-50 p-2 rounded-xl text-[10px] space-y-0.5 border border-slate-200 mt-2">
              <div className="flex justify-between text-slate-600 font-semibold">
                <span>✓ Central:</span>
                <span className="font-bold">{metrics.gastosConfirmados.toLocaleString('es-ES')} €</span>
              </div>
              <div className="flex justify-between text-blue-700 font-bold">
                <span>◌ PWA Sync:</span>
                <span>{metrics.gastosPendientesSync.toLocaleString('es-ES')} €</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => setBreakdownMetric(breakdownMetric === 'gastos' ? null : 'gastos')}
            className={`w-full mt-2 py-1.5 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 border ${
              breakdownMetric === 'gastos'
                ? 'bg-[#0067B9] text-white border-[#0067B9]'
                : 'bg-slate-50 hover:bg-slate-100 text-[#0067B9] border-blue-200'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>{breakdownMetric === 'gastos' ? 'Cerrar Desglose' : 'Desglosar en 360º'}</span>
            <ChevronDown className={`w-3 h-3 transition-transform ${breakdownMetric === 'gastos' ? 'rotate-180' : ''}`} />
          </button>
        </div>

        {/* 3. Resultado Bruto Provisional */}
        <div className={`p-5 rounded-3xl border transition shadow-xs space-y-2 flex flex-col justify-between ${
          breakdownMetric === 'resultado' ? 'bg-blue-50/70 border-[#0067B9] ring-2 ring-[#0067B9]/30' : 'bg-white border-slate-200 ring-2 ring-[#80D518]/30'
        }`}>
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#022853] uppercase tracking-wider">
                Resultado Provisional
              </span>
              <span className="text-xs font-black px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                +{metrics.resultadoVarPct}%
              </span>
            </div>
            <div className="text-2xl sm:text-3xl font-black font-brand text-[#48A222] mt-1">
              {metrics.resultadoBruto.toLocaleString('es-ES', { minimumFractionDigits: 2 })} €
            </div>
            <div className="text-[11px] text-slate-500 mt-1">
              Ingresos menos Gastos aprobados
            </div>
          </div>

          <button
            onClick={() => setBreakdownMetric(breakdownMetric === 'resultado' ? null : 'resultado')}
            className={`w-full mt-2 py-1.5 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 border ${
              breakdownMetric === 'resultado'
                ? 'bg-[#0067B9] text-white border-[#0067B9]'
                : 'bg-slate-50 hover:bg-slate-100 text-[#0067B9] border-blue-200'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>{breakdownMetric === 'resultado' ? 'Cerrar Desglose' : 'Desglosar Márgenes'}</span>
            <ChevronDown className={`w-3 h-3 transition-transform ${breakdownMetric === 'resultado' ? 'rotate-180' : ''}`} />
          </button>
        </div>

        {/* 4. Caja Prevista a 30 Días */}
        <div className={`p-5 rounded-3xl border transition shadow-xs space-y-2 flex flex-col justify-between ${
          breakdownMetric === 'caja' ? 'bg-blue-50/70 border-[#0067B9] ring-2 ring-[#0067B9]/30' : 'bg-white border-slate-200'
        }`}>
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Caja Prevista (30d)
              </span>
              <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full">
                Tesorería
              </span>
            </div>
            <div className="text-2xl sm:text-3xl font-black font-brand text-[#022853] mt-1">
              {metrics.cajaPrevista30d.toLocaleString('es-ES', { minimumFractionDigits: 2 })} €
            </div>
            <div className="text-[11px] text-slate-500 mt-1">
              Vencimientos a 7, 15 y 30 días
            </div>
          </div>

          <button
            onClick={() => setBreakdownMetric(breakdownMetric === 'caja' ? null : 'caja')}
            className={`w-full mt-2 py-1.5 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 border ${
              breakdownMetric === 'caja'
                ? 'bg-[#0067B9] text-white border-[#0067B9]'
                : 'bg-slate-50 hover:bg-slate-100 text-[#0067B9] border-blue-200'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>{breakdownMetric === 'caja' ? 'Cerrar Desglose' : 'Desglosar Tesorería'}</span>
            <ChevronDown className={`w-3 h-3 transition-transform ${breakdownMetric === 'caja' ? 'rotate-180' : ''}`} />
          </button>
        </div>
      </div>

      {/* INTERACTIVE DRILL-DOWN PANEL: NAVEGACIÓN 360º DE TOTAL AGREGADO A REGISTROS */}
      {breakdownMetric && (
        <div className="bg-slate-50 border-2 border-blue-200 rounded-3xl p-5 sm:p-6 shadow-sm space-y-4 animate-in fade-in duration-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-3">
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <Compass className="w-5 h-5 text-[#0067B9]" />
                <h4 className="font-brand font-black text-slate-900 text-sm sm:text-base">
                  Navegación 360º: Registros que componen {breakdownMetric === 'ingresos' ? 'los Ingresos Facturados' : breakdownMetric === 'gastos' ? 'los Gastos y Albaranes Aprobados' : breakdownMetric === 'resultado' ? 'el Resultado Provisional' : 'la Previsión de Tesorería'}
                </h4>
                <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#80D518] text-[#022853]">
                  Desglose Directo
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Haz clic en <strong>"Explorar en 360º"</strong> en cualquiera de los registros para abrir su ficha completa en el Cajón Transversal y saltar a sus entidades asociadas (factura $\rightarrow$ albarán $\rightarrow$ artículo $\rightarrow$ receta $\rightarrow$ plato).
              </p>
            </div>

            <button
              onClick={() => setBreakdownMetric(null)}
              className="text-xs font-bold text-slate-600 hover:text-slate-900 bg-white px-3 py-1.5 rounded-xl border border-slate-200 transition self-start sm:self-auto"
            >
              Cerrar panel
            </button>
          </div>

          {/* Records Table for GASTOS */}
          {breakdownMetric === 'gastos' && (
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-100 text-[10px] uppercase font-bold text-slate-500 border-b border-slate-200">
                    <tr>
                      <th className="p-3">Doc / Ref</th>
                      <th className="p-3">Proveedor / Emisor</th>
                      <th className="p-3">Concepto / Categoría</th>
                      <th className="p-3">Importe</th>
                      <th className="p-3">Estado</th>
                      <th className="p-3 text-right">Navegación 360º</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {[
                      {
                        code: 'ALB-2026-4412',
                        type: 'albaran' as EntityHubType,
                        supplier: 'Distribuciones Cárnicas Sierra S.L.',
                        concept: 'Solomillo Vacuno Mayor (25 kg) · Recepción en muelle',
                        amount: '355,00 €',
                        statusBadge: 'Alerta Precio (+14.5%)',
                        statusColor: 'bg-amber-100 text-amber-800',
                      },
                      {
                        code: 'FAC-2026-9021',
                        type: 'factura' as EntityHubType,
                        supplier: 'Distribuciones Cárnicas Sierra S.L.',
                        concept: 'Factura mensual Carnes Rojas Extra',
                        amount: '418,00 €',
                        statusBadge: 'En Disputa OCR',
                        statusColor: 'bg-rose-100 text-rose-800',
                      },
                      {
                        code: 'FAC-2026-8812',
                        type: 'factura' as EntityHubType,
                        supplier: 'Pescados y Mariscos La Lonja S.L.',
                        concept: 'Atún Rojo Balfegó (6 kg) y Lubina Salvaje',
                        amount: '680,00 €',
                        statusBadge: 'Contabilizada',
                        statusColor: 'bg-blue-100 text-blue-800',
                      },
                      {
                        code: 'FAC-2026-8740',
                        type: 'factura' as EntityHubType,
                        supplier: 'Distribuciones Hosteleras Central',
                        concept: 'Bebidas, Vinos D.O. Ribera y Refrescos',
                        amount: '1.240,00 €',
                        statusBadge: 'Aprobada',
                        statusColor: 'bg-emerald-100 text-emerald-800',
                      },
                      {
                        code: 'ART-002',
                        type: 'articulo_producto' as EntityHubType,
                        supplier: 'Cárnicas Sierra S.L.',
                        concept: 'Artículo Stock: Solomillo de Vacuno Mayor Corte Especial',
                        amount: '14,20 € / kg',
                        statusBadge: 'Impacto Escandallo',
                        statusColor: 'bg-purple-100 text-purple-800',
                      },
                    ].map((row, idx) => (
                      <tr key={idx} className="hover:bg-slate-50 transition">
                        <td className="p-3 font-mono font-bold text-slate-900">
                          {row.code}
                        </td>
                        <td className="p-3 font-medium text-slate-800">
                          {row.supplier}
                        </td>
                        <td className="p-3 text-slate-600">
                          {row.concept}
                        </td>
                        <td className="p-3 font-mono font-black text-slate-900">
                          {row.amount}
                        </td>
                        <td className="p-3">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${row.statusColor}`}>
                            {row.statusBadge}
                          </span>
                        </td>
                        <td className="p-3 text-right">
                          <button
                            onClick={() => {
                              openDrawer360(row.type);
                              announceAriaLive(`Abriendo ficha 360 de ${row.code}`);
                            }}
                            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-[#0067B9] hover:bg-[#022853] text-white text-xs font-bold transition shadow-2xs"
                          >
                            <Compass className="w-3.5 h-3.5 text-[#80D518]" />
                            <span>Explorar en 360º</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Records Table for INGRESOS */}
          {breakdownMetric === 'ingresos' && (
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-100 text-[10px] uppercase font-bold text-slate-500 border-b border-slate-200">
                    <tr>
                      <th className="p-3">Factura / Ticket</th>
                      <th className="p-3">Cliente / Origen</th>
                      <th className="p-3">Concepto</th>
                      <th className="p-3">Importe</th>
                      <th className="p-3">Cobro</th>
                      <th className="p-3 text-right">Navegación 360º</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {[
                      {
                        code: 'FAC-E2026-0042',
                        type: 'factura' as EntityHubType,
                        client: 'Grupo Tecnoiberia S.L. (NIF B88123412)',
                        concept: 'Cena de Empresa & Menú Degustación Maridado (32 pax)',
                        amount: '1.450,00 €',
                        payment: 'Transferencia Cobrada',
                      },
                      {
                        code: 'RES-089',
                        type: 'reserva' as EntityHubType,
                        client: 'D. Carlos Mendoza (Cliente VIP)',
                        concept: 'Reserva Salón Privado Mesa 4 + Solomillo al Foie',
                        amount: '380,00 €',
                        payment: 'Tarjeta Cobrada',
                      },
                      {
                        code: 'CLI-001',
                        type: 'cliente' as EntityHubType,
                        client: 'Asociación Empresarial Centro',
                        concept: 'Evento corporativo cóctel mensual',
                        amount: '2.800,00 €',
                        payment: 'Pagaré 15 días',
                      },
                    ].map((row, idx) => (
                      <tr key={idx} className="hover:bg-slate-50 transition">
                        <td className="p-3 font-mono font-bold text-slate-900">{row.code}</td>
                        <td className="p-3 font-medium text-slate-800">{row.client}</td>
                        <td className="p-3 text-slate-600">{row.concept}</td>
                        <td className="p-3 font-mono font-black text-slate-900">{row.amount}</td>
                        <td className="p-3 text-emerald-700 font-bold">{row.payment}</td>
                        <td className="p-3 text-right">
                          <button
                            onClick={() => openDrawer360(row.type)}
                            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-[#0067B9] hover:bg-[#022853] text-white text-xs font-bold transition shadow-2xs"
                          >
                            <Compass className="w-3.5 h-3.5 text-[#80D518]" />
                            <span>Explorar en 360º</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Records Table for RESULTADO & CAJA */}
          {(breakdownMetric === 'resultado' || breakdownMetric === 'caja') && (
            <div className="bg-white rounded-2xl border border-slate-200 p-4 space-y-3">
              <span className="text-xs text-slate-600 block">
                Composición de los márgenes y previsión de liquidez a 30 días calculada desde las entidades maestras:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                  <div>
                    <strong className="block text-slate-900 font-bold">Margen en Carta:</strong>
                    <span className="text-slate-500 text-[11px]">4 Platos Analizados</span>
                  </div>
                  <button
                    onClick={() => openDrawer360('plato_escandallo')}
                    className="text-xs font-bold text-[#0067B9] hover:underline flex items-center gap-1"
                  >
                    <span>Ver Platos 360º</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                  <div>
                    <strong className="block text-slate-900 font-bold">Escandallos Cocina:</strong>
                    <span className="text-slate-500 text-[11px]">Desvío Food Cost</span>
                  </div>
                  <button
                    onClick={() => openDrawer360('receta')}
                    className="text-xs font-bold text-[#0067B9] hover:underline flex items-center gap-1"
                  >
                    <span>Ver Recetas 360º</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                  <div>
                    <strong className="block text-slate-900 font-bold">Auditoría Precios:</strong>
                    <span className="text-slate-500 text-[11px]">Comparador en vivo</span>
                  </div>
                  <button
                    onClick={() => openDrawer360('articulo_producto')}
                    className="text-xs font-bold text-[#0067B9] hover:underline flex items-center gap-1"
                  >
                    <span>Ver Artículo 360º</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Sub-metrics: Base Imponible, IVA Soportado, Gastos pendientes */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs flex justify-between items-center">
          <div>
            <span className="text-slate-500 block">Base Imponible Soportada</span>
            <span className="font-bold text-sm text-slate-800 font-mono mt-0.5 block">
              {metrics.baseImponible.toLocaleString('es-ES')} €
            </span>
          </div>
          <span className="text-[10px] font-bold bg-white px-2 py-1 rounded-lg border">Gasto Neto</span>
        </div>

        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs flex justify-between items-center">
          <div>
            <span className="text-slate-500 block">IVA Soportado Deducible</span>
            <span className="font-bold text-sm text-slate-800 font-mono mt-0.5 block">
              {metrics.ivaSoportado.toLocaleString('es-ES')} €
            </span>
          </div>
          <span className="text-[10px] font-bold bg-white px-2 py-1 rounded-lg border">Hacienda</span>
        </div>

        <div className="bg-amber-50 p-4 rounded-2xl border border-amber-200 text-xs flex justify-between items-center">
          <div>
            <span className="text-amber-800 font-semibold block">Gastos Pendientes Aprobación</span>
            <span className="font-bold text-sm text-amber-900 font-mono mt-0.5 block">
              {metrics.gastosPendientes.toLocaleString('es-ES')} €
            </span>
          </div>
          <span className="text-[10px] font-bold bg-white text-amber-800 px-2 py-1 rounded-lg border border-amber-300">
            En Borrador
          </span>
        </div>
      </div>

      {/* Visual Charts: Evolución Económica & Distribución de Gastos */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Evolución Económica (7 cols) */}
        <div className="lg:col-span-7 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-[#0067B9]" />
              <h4 className="font-brand font-bold text-sm text-[#022853]">
                Evolución Económica Mensual (Ingresos vs Gastos vs Margen)
              </h4>
            </div>
            <span className="text-xs text-slate-400 font-mono">Sem 1 a 4</span>
          </div>

          {/* Realistic Bar Chart Visual */}
          <div className="space-y-3 pt-2">
            {[
              { label: 'Semana 1', ing: 6100, gas: 2150, res: 3950 },
              { label: 'Semana 2', ing: 5900, gas: 2020, res: 3880 },
              { label: 'Semana 3', ing: 6450, gas: 2180, res: 4270 },
              { label: 'Semana 4 (Actual)', ing: 6130, gas: 2110, res: 4020 },
            ].map((week) => (
              <div key={week.label} className="space-y-1 text-xs">
                <div className="flex justify-between font-bold text-slate-700">
                  <span>{week.label}</span>
                  <span className="text-emerald-700">Resultado: +{week.res.toLocaleString()} €</span>
                </div>
                <div className="h-6 w-full bg-slate-100 rounded-lg overflow-hidden flex">
                  <div
                    style={{ width: `${(week.ing / 7000) * 60}%` }}
                    className="bg-[#0067B9] h-full flex items-center pl-2 text-[10px] font-bold text-white truncate"
                    title={`Ingresos: ${week.ing} €`}
                  >
                    Ing: {week.ing} €
                  </div>
                  <div
                    style={{ width: `${(week.gas / 7000) * 40}%` }}
                    className="bg-rose-500 h-full flex items-center pl-2 text-[10px] font-bold text-white truncate"
                    title={`Gastos: ${week.gas} €`}
                  >
                    Gas: {week.gas} €
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Distribución de Gastos por Categoría (5 cols) */}
        <div className="lg:col-span-5 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <PieChart className="w-5 h-5 text-[#48A222]" />
              <h4 className="font-brand font-bold text-sm text-[#022853]">
                Distribución de Gastos
              </h4>
            </div>
            <span className="text-xs font-bold text-slate-500">Total: 8.460 €</span>
          </div>

          <div className="space-y-3 pt-1 text-xs">
            {[
              { cat: 'Materia Prima / Perecederos', pct: 48, eur: 4060.92, col: 'bg-[#0067B9]' },
              { cat: 'Bebidas y Bodega', pct: 22, eur: 1861.25, col: 'bg-[#48A222]' },
              { cat: 'Suministros (Luz, Gas, Agua)', pct: 16, eur: 1353.64, col: 'bg-amber-500' },
              { cat: 'Mantenimiento & Alquiler', pct: 10, eur: 846.02, col: 'bg-purple-600' },
              { cat: 'Servicios Profesionales', pct: 4, eur: 338.42, col: 'bg-slate-400' },
            ].map((c) => (
              <div key={c.cat} className="space-y-1">
                <div className="flex justify-between">
                  <span className="font-bold text-slate-700">{c.cat}</span>
                  <span className="font-mono text-slate-500 font-semibold">{c.eur.toLocaleString('es-ES', { maximumFractionDigits: 0 })} € ({c.pct}%)</span>
                </div>
                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div className={`h-full ${c.col}`} style={{ width: `${c.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
