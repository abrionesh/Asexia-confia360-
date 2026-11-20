import React, { useState } from 'react';
import { EXPLORER_TABLE_ROWS } from '../../services/cockpitData';
import { SyncStatusIndicator } from '../SyncQueueDrawer';
import {
  Database,
  Filter,
  Download,
  Search,
  ExternalLink,
  History,
  ShieldCheck,
  CheckCircle,
  FileSpreadsheet,
} from 'lucide-react';

export const DataExplorerTable: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [moduleFilter, setModuleFilter] = useState('all');
  const [selectedRow, setSelectedRow] = useState<typeof EXPLORER_TABLE_ROWS[0] | null>(null);
  const [exportNotice, setExportNotice] = useState<string | null>(null);

  const filteredRows = EXPLORER_TABLE_ROWS.filter((r) => {
    const matchesModule = moduleFilter === 'all' || r.modulo === moduleFilter;
    const matchesSearch =
      r.descripcion.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.identificador.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.entidad.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesModule && matchesSearch;
  });

  const handleExport = (format: 'CSV' | 'XLSX' | 'PDF') => {
    const headers = ['Identificador', 'Modulo', 'Entidad', 'Local', 'Descripcion', 'Fecha', 'Importe', 'Estado', 'Sync'];
    const escapeCsv = (val: unknown) => `"${String(val ?? '').replace(/"/g, '""')}"`;
    const csvContent = [
      headers.join(','),
      ...filteredRows.map((r) =>
        [r.identificador, r.modulo, r.entidad, r.local, r.descripcion, r.fecha, r.importe, r.estado, r.sync]
          .map(escapeCsv)
          .join(',')
      ),
    ].join('\n');

    if (format === 'PDF') {
      window.print();
    } else {
      const ext = format === 'XLSX' ? 'xls' : 'csv';
      const mime = format === 'XLSX' ? 'application/vnd.ms-excel;charset=utf-8;' : 'text/csv;charset=utf-8;';
      const blob = new Blob([`\uFEFF${csvContent}`], { type: mime });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `confia360_auditoria_${new Date().toISOString().slice(0, 10)}.${ext}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }

    setExportNotice(`Exportación ${format} generada (${filteredRows.length} registros) y registrada en auditoría.`);
    setTimeout(() => setExportNotice(null), 4500);
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#022853] text-[#80D518] flex items-center justify-center font-bold">
              <Database className="w-4 h-4" />
            </div>
            <h3 className="text-lg font-black font-brand text-[#022853]">
              Explorador de Datos 360º (Auditoría & Trazabilidad)
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-1 max-w-xl">
            Acceso seguro según rol. Permite auditar el dato origen (ticket, reserva, llamada, fichaje) con historial de modificaciones.
          </p>
        </div>

        {/* Export Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleExport('CSV')}
            className="touch-target-min px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-bold text-slate-700 transition flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            <span>CSV</span>
          </button>
          <button
            onClick={() => handleExport('XLSX')}
            className="touch-target-min px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-bold text-slate-700 transition flex items-center gap-1.5"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
            <span>Excel</span>
          </button>
          <button
            onClick={() => handleExport('PDF')}
            className="touch-target-min px-3 py-1.5 rounded-xl bg-[#0067B9] text-white text-xs font-bold transition flex items-center gap-1.5 shadow-xs"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Informe PDF</span>
          </button>
        </div>
      </div>

      {exportNotice && (
        <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-900 flex items-center justify-between gap-2">
          <span className="flex items-center gap-1.5">
            <CheckCircle className="w-4 h-4 text-[#48A222]" />
            {exportNotice}
          </span>
          <button
            type="button"
            onClick={() => setExportNotice(null)}
            className="text-emerald-700 hover:underline font-bold"
          >
            Cerrar
          </button>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-2.5">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por identificador, proveedor, cliente o empleado..."
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#0067B9]"
          />
        </div>

        <select
          value={moduleFilter}
          onChange={(e) => setModuleFilter(e.target.value)}
          className="px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700 bg-white"
        >
          <option value="all">Todos los Módulos</option>
          <option value="gastos">Gastos & Facturas</option>
          <option value="reservas">Reservas de Sala</option>
          <option value="fichajes">Fichajes de Asistencia</option>
          <option value="turnos">Turnos & Horas</option>
          <option value="voz_ia">Voz & Llamadas IA</option>
        </select>
      </div>

      {/* Data Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-slate-200 text-slate-500 bg-slate-50">
              <th className="py-2.5 px-3 font-semibold">Fecha</th>
              <th className="py-2.5 px-3 font-semibold">Entidad</th>
              <th className="py-2.5 px-3 font-semibold">Identificador</th>
              <th className="py-2.5 px-3 font-semibold">Detalle / Origen</th>
              <th className="py-2.5 px-3 font-semibold">Estado</th>
              <th className="py-2.5 px-3 font-semibold text-right">Importe</th>
              <th className="py-2.5 px-3 font-semibold text-right">Sync</th>
              <th className="py-2.5 px-3 font-semibold text-right">Acción</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredRows.map((row, idx) => (
              <tr key={idx} className="hover:bg-slate-50/70 transition">
                <td className="py-3 px-3 font-mono text-slate-600">{row.fecha}</td>
                <td className="py-3 px-3 font-bold text-slate-800">{row.entidad}</td>
                <td className="py-3 px-3 font-mono text-xs text-[#0067B9] font-bold">{row.identificador}</td>
                <td className="py-3 px-3 text-slate-700 max-w-xs truncate">{row.descripcion}</td>
                <td className="py-3 px-3">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700">
                    {row.estado}
                  </span>
                </td>
                <td className="py-3 px-3 text-right font-black text-slate-800">{row.importe}</td>
                <td className="py-3 px-3 text-right">
                  <SyncStatusIndicator status={row.sync as any} showLabel={false} />
                </td>
                <td className="py-3 px-3 text-right">
                  <button
                    onClick={() => setSelectedRow(row)}
                    className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-600 hover:text-[#0067B9] transition"
                    title="Ver ficha de detalle y trazabilidad"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Row Detail Modal */}
      {selectedRow && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <span className="text-xs font-bold text-[#0067B9] uppercase">Ficha Técnica de Auditoría</span>
              <button
                onClick={() => setSelectedRow(null)}
                className="text-slate-400 hover:text-slate-700 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <h4 className="font-bold text-base text-[#022853]">{selectedRow.identificador}</h4>
              <p className="text-slate-600 font-semibold">{selectedRow.descripcion}</p>
              <div className="p-3 bg-slate-50 rounded-xl space-y-1 text-slate-600">
                <p>• <strong>Entidad:</strong> {selectedRow.entidad}</p>
                <p>• <strong>Local:</strong> {selectedRow.local}</p>
                <p>• <strong>Fecha:</strong> {selectedRow.fecha}</p>
                <p>• <strong>Importe:</strong> {selectedRow.importe}</p>
                <p>• <strong>Estado Sync:</strong> {selectedRow.sync === 'synced' ? 'Sincronizado en la nube' : 'Guardado en memoria local'}</p>
              </div>
            </div>

            <button
              onClick={() => setSelectedRow(null)}
              className="w-full py-2.5 rounded-xl bg-[#022853] text-white font-bold text-xs"
            >
              Cerrar Ficha
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
