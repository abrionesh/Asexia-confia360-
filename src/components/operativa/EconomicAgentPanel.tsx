import React from 'react';
import { useApp } from '../../context/AppContext';
import { SyncStatusIndicator } from '../SyncQueueDrawer';
import {
  DollarSign,
  AlertTriangle,
  CheckCircle,
  FileSpreadsheet,
  PieChart,
  ShieldCheck,
  TrendingDown,
  Building,
} from 'lucide-react';

export const EconomicAgentPanel: React.FC = () => {
  const { expenses, approveExpenseTicket, brandConfig } = useApp();

  const totalMonthlySpend = expenses.reduce((acc, curr) => acc + curr.totalAmount, 0);
  const pendingApprovalCount = expenses.filter((e) => e.status !== 'approved').length;
  const duplicateAlerts = expenses.filter((e) => e.auditAlert);

  return (
    <div className="space-y-6">
      
      {/* Intro */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold font-brand text-[#022853]">Agente Económico & Auditor de Tesorería</h2>
            <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-[#D6A52A]/20 text-[#022853] border border-[#D6A52A]/40">
              Supervisión Humana
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1 max-w-xl">
            Asistente contable con OCR automatizado. Detecta facturas duplicadas, desviaciones de suministro y anomalías de precios antes de la aprobación del gerente.
          </p>
        </div>

        {/* Total Month Metric */}
        <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200">
          <div className="w-10 h-10 rounded-xl bg-[#0067B9] text-white flex items-center justify-center font-bold">
            <DollarSign className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Gasto Total Conciliado</span>
            <span className="text-base font-black text-[#022853]">{totalMonthlySpend.toFixed(2)} €</span>
          </div>
        </div>
      </div>

      {/* Anomaly & Duplicate Alerts Banner (From Audit Document) */}
      {duplicateAlerts.length > 0 && (
        <div className="bg-amber-50 rounded-2xl border-2 border-amber-300 p-5 shadow-xs space-y-3">
          <div className="flex items-center gap-2 text-amber-900 font-bold text-sm">
            <AlertTriangle className="w-5 h-5 text-amber-600" />
            <span>Alertas de Auditoría Contable Emitidas por el Agente Económico</span>
          </div>
          
          <div className="space-y-2">
            {duplicateAlerts.map((d) => (
              <div key={d.id} className="p-3 bg-white rounded-xl border border-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="text-xs">
                  <span className="font-bold text-amber-900 block">{d.providerName} (Fra: {d.invoiceNumber}) — {d.totalAmount.toFixed(2)} €</span>
                  <p className="text-amber-800 mt-0.5">{d.auditAlert}</p>
                </div>
                <div className="flex gap-2 shrink-0">
                  <button
                    onClick={() => approveExpenseTicket(d.id)}
                    className="px-3 py-1.5 rounded-lg bg-[#48A222] hover:bg-emerald-700 text-white font-bold text-xs transition"
                  >
                    Confirmar Factura
                  </button>
                  <button
                    onClick={() => alert(`Incidencia abierta para revisión con el proveedor ${d.providerName}.`)}
                    className="px-3 py-1.5 rounded-lg border border-amber-400 text-amber-900 hover:bg-amber-100 font-bold text-xs transition"
                  >
                    Reclamar a Proveedor
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Tickets por Revisar</span>
          <div className="text-2xl font-black text-[#022853]">{pendingApprovalCount}</div>
          <span className="text-[11px] text-amber-700 font-semibold">Requieren clic de aprobación humana</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Categoría Mayoritaria</span>
          <div className="text-2xl font-black text-[#0067B9]">Materia Prima</div>
          <span className="text-[11px] text-slate-500">Carnes, pescados y hortalizas frescas</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Ahorro en Desvíos</span>
          <div className="text-2xl font-black text-[#48A222]">8.4%</div>
          <span className="text-[11px] text-emerald-700 font-semibold">Detección anticipada de sobrecostes</span>
        </div>
      </div>

      {/* Detailed Expense Audit Table */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <FileSpreadsheet className="w-4 h-4 text-[#0067B9]" />
            <h3 className="text-sm font-bold font-brand text-[#022853]">Bandeja de Conciliación y Aprobación Gerencial</h3>
          </div>
          <span className="text-xs text-slate-500">
            Principio: Supervisión Humana 100% Garantizada
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 bg-slate-50">
                <th className="py-2.5 px-3 font-semibold">Proveedor</th>
                <th className="py-2.5 px-3 font-semibold">Base Imponible</th>
                <th className="py-2.5 px-3 font-semibold">IVA</th>
                <th className="py-2.5 px-3 font-semibold text-right">Total Factura</th>
                <th className="py-2.5 px-3 font-semibold">Categoría Sugerida</th>
                <th className="py-2.5 px-3 font-semibold text-center">Estado Auditoría</th>
                <th className="py-2.5 px-3 font-semibold text-right">Aprobación Humana</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {expenses.map((e) => (
                <tr key={e.id} className="hover:bg-slate-50/60 transition">
                  <td className="py-3 px-3">
                    <span className="font-bold text-slate-800 block">{e.providerName}</span>
                    <span className="text-[10px] text-slate-400">{e.invoiceNumber}</span>
                  </td>
                  <td className="py-3 px-3 text-slate-600 font-mono">
                    {e.taxBase.toFixed(2)} €
                  </td>
                  <td className="py-3 px-3 text-slate-600 font-mono">
                    {e.vatAmount.toFixed(2)} € ({e.vatRate}%)
                  </td>
                  <td className="py-3 px-3 text-right font-black text-slate-800">
                    {e.totalAmount.toFixed(2)} €
                  </td>
                  <td className="py-3 px-3 text-slate-700">
                    <span className="bg-slate-100 px-2 py-0.5 rounded text-[11px] font-medium">
                      {e.category}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-center">
                    {e.auditAlert ? (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-300">
                        ⚠️ Alerta Tesorería
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                        ✓ Sin anomalías
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-3 text-right">
                    {e.status === 'approved' ? (
                      <span className="text-emerald-700 font-bold inline-flex items-center gap-1">
                        <CheckCircle className="w-3.5 h-3.5" /> Aprobado
                      </span>
                    ) : (
                      <button
                        onClick={() => approveExpenseTicket(e.id)}
                        className="touch-target-min px-3 py-1.5 rounded-xl bg-[#0067B9] hover:bg-[#022853] text-white font-bold text-xs transition shadow-2xs"
                      >
                        Aprobar (1 Clic)
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
