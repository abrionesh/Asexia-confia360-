import React from 'react';
import { VoiceAIMetrics, DocumentalMetrics } from '../../types/cockpit';
import {
  PhoneCall,
  FileText,
  AlertTriangle,
  CheckCircle,
  Clock,
  Scan,
  Sparkles,
  ShieldAlert,
} from 'lucide-react';

export const VoiceAndDocKPIsSection: React.FC<{
  voiceMetrics: VoiceAIMetrics;
  docMetrics: DocumentalMetrics;
}> = ({ voiceMetrics, docMetrics }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      
      {/* Voice & AI Cockpit Panel */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b pb-3">
          <div className="flex items-center gap-2">
            <PhoneCall className="w-5 h-5 text-[#0067B9]" />
            <h4 className="font-brand font-bold text-sm text-[#022853]">
              Agente de Voz 24/7 & Calidad IA
            </h4>
          </div>
          <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
            {voiceMetrics.llamadasCompletadasPct}% Éxito NLU
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
          <div className="p-3 rounded-2xl bg-slate-50 border space-y-0.5">
            <span className="text-slate-400 text-[10px] font-bold uppercase">Llamadas Atendidas</span>
            <div className="text-xl font-black text-[#022853]">{voiceMetrics.llamadasRecibidas}</div>
            <span className="text-[10px] text-slate-500">Total recibidas</span>
          </div>

          <div className="p-3 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-0.5">
            <span className="text-emerald-800 text-[10px] font-bold uppercase">Completadas por IA</span>
            <div className="text-xl font-black text-[#48A222]">{voiceMetrics.llamadasCompletadas}</div>
            <span className="text-[10px] text-emerald-700">Sin intervención</span>
          </div>

          <div className="p-3 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-0.5">
            <span className="text-amber-800 text-[10px] font-bold uppercase">Derivadas a Humano</span>
            <div className="text-xl font-black text-amber-700">{voiceMetrics.transferidasHumanoPct}%</div>
            <span className="text-[10px] text-amber-800">12 transferidas</span>
          </div>
        </div>

        <div className="bg-slate-50 p-3 rounded-xl border text-xs text-slate-600 space-y-1">
          <div className="flex justify-between">
            <span>Duración media de conversación:</span>
            <span className="font-bold text-slate-800">{voiceMetrics.duracionMediaSegundos} seg</span>
          </div>
          <div className="flex justify-between">
            <span>Intención predominante:</span>
            <span className="font-bold text-[#0067B9]">{voiceMetrics.intencionFrecuente}</span>
          </div>
          <div className="flex justify-between">
            <span>Revisiones humanas pendientes:</span>
            <span className="font-bold text-amber-700">{voiceMetrics.revisionesPendientes} audios</span>
          </div>
        </div>
      </div>

      {/* Documental & OCR Auditor Panel */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b pb-3">
          <div className="flex items-center gap-2">
            <Scan className="w-5 h-5 text-[#48A222]" />
            <h4 className="font-brand font-bold text-sm text-[#022853]">
              Bandeja Documental & Auditoría OCR
            </h4>
          </div>
          <span className="text-xs font-bold text-[#0067B9] bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
            {docMetrics.documentosCapturados} Documentos
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
          <div className="p-3 rounded-2xl bg-slate-50 border space-y-0.5">
            <span className="text-slate-400 text-[10px] font-bold uppercase">Por Revisar</span>
            <div className="text-xl font-black text-[#022853]">{docMetrics.pendientesRevision}</div>
            <span className="text-[10px] text-slate-500">Tickets subidos</span>
          </div>

          <div className="p-3 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-0.5">
            <span className="text-amber-800 text-[10px] font-bold uppercase">Por Aprobar</span>
            <div className="text-xl font-black text-amber-700">{docMetrics.pendientesAprobacion}</div>
            <span className="text-[10px] text-amber-800">Pendiente gerente</span>
          </div>

          <div className="p-3 rounded-2xl bg-rose-50/70 border border-rose-200 space-y-0.5">
            <span className="text-rose-800 text-[10px] font-bold uppercase">OCR Fallido / Falta IVA</span>
            <div className="text-xl font-black text-rose-600">{docMetrics.ticketsSinIva + docMetrics.ocrFallidos}</div>
            <span className="text-[10px] text-rose-700">Requiere recaptura</span>
          </div>
        </div>

        <div className="bg-slate-50 p-3 rounded-xl border text-xs text-slate-600 space-y-1">
          <div className="flex justify-between">
            <span>Archivos pendientes de sincronizar:</span>
            <span className="font-bold text-[#0067B9]">{docMetrics.archivosSinSincronizar} locales</span>
          </div>
          <div className="flex justify-between">
            <span>Duplicados detectados:</span>
            <span className="font-bold text-amber-700">{docMetrics.duplicadosPotenciales} ticket en conflicto</span>
          </div>
          <div className="flex justify-between">
            <span>Documentos aprobados y conciliados:</span>
            <span className="font-bold text-emerald-700">{docMetrics.aprobados} facturas OK</span>
          </div>
        </div>
      </div>
    </div>
  );
};
