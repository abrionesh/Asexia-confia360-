import React, { useState } from 'react';
import {
  Briefcase,
  Calendar,
  CheckCircle2,
  Users,
  Target,
  Clock,
  Sparkles,
  ShieldCheck,
  Code,
  Server,
  Layers,
  Award,
} from 'lucide-react';

export const AgileProjectPlan: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'mvp' | 'roadmap' | 'team' | 'criterios'>('mvp');

  return (
    <div className="space-y-8">
      
      {/* Executive Role Header */}
      <div className="bg-[#022853] rounded-3xl p-6 sm:p-8 text-white shadow-lg border border-white/10 relative overflow-hidden">
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D6A52A]/20 text-[#D6A52A] text-xs font-bold border border-[#D6A52A]/30">
            <Briefcase className="w-3.5 h-3.5" />
            <span>Rol: Director de Proyecto Senior (PMP / Agile Coach)</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black font-brand tracking-tight">
            Plan de Desarrollo Ágil ConfiA360
          </h2>
          <p className="text-xs sm:text-sm text-blue-100 leading-relaxed">
            Estrategia ágil basada en ciclos iterativos de 2 semanas (Scrum/Kanban híbrido). Enfoque en time-to-market sin comprometer la solidez de la arquitectura offline-first, los agentes de IA supervisada y el cumplimiento normativo laboral y fiscal.
          </p>
        </div>

        <div className="absolute right-4 -bottom-10 opacity-10 font-brand font-black text-9xl pointer-events-none select-none text-white">
          PM
        </div>
      </div>

      {/* Navigation Pills */}
      <div className="flex flex-wrap gap-2">
        {[
          { id: 'mvp', label: '1. Alcance Crítico del MVP', icon: Target },
          { id: 'roadmap', label: '2. Roadmap de Sprints', icon: Calendar },
          { id: 'team', label: '3. Asignación de Roles Senior', icon: Users },
          { id: 'criterios', label: '4. Criterios de Aceptación (Auditoría)', icon: ShieldCheck },
        ].map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as any)}
              className={`touch-target-min flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition ${
                activeTab === item.id
                  ? 'bg-[#0067B9] text-white shadow-xs'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: ALCANCE CRÍTICO DEL MVP */}
      {activeTab === 'mvp' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h3 className="text-xl font-black font-brand text-[#022853]">
              Definición del Producto Mínimo Viable (MVP)
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Las 5 capacidades innegociables para salir a producción en el sector hostelería y retail.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            <div className="p-5 rounded-2xl border-2 border-emerald-200 bg-emerald-50/40 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#48A222] text-white font-bold flex items-center justify-center">
                1
              </div>
              <h4 className="font-bold text-sm text-[#022853]">Fichaje "Cero Toque" Offline</h4>
              <p className="text-xs text-slate-600">
                Geofencing GPS en segundo plano con radio de 150m. Guarda en cola local si se pierde conexión y emite anuncio auditivo ARIA live.
              </p>
              <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                MVP Crítico · Cumplimiento Ley de Fichaje
              </span>
            </div>

            <div className="p-5 rounded-2xl border-2 border-blue-200 bg-blue-50/40 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#0067B9] text-white font-bold flex items-center justify-center">
                2
              </div>
              <h4 className="font-bold text-sm text-[#022853]">Captura OCR de Tickets en 3 Pasos</h4>
              <p className="text-xs text-slate-600">
                Reducción de 12 pasos a 3 toques: Cámara ➜ Revisión en pantalla partida con clasificación contable automática ➜ Envío a aprobación.
              </p>
              <span className="text-[10px] font-bold text-[#0067B9] bg-blue-100 px-2 py-0.5 rounded">
                MVP Crítico · Control de Costes
              </span>
            </div>

            <div className="p-5 rounded-2xl border-2 border-purple-200 bg-purple-50/40 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#022853] text-white font-bold flex items-center justify-center">
                3
              </div>
              <h4 className="font-bold text-sm text-[#022853]">Agente de Voz & Sala 24/7</h4>
              <p className="text-xs text-slate-600">
                NLU conversacional monoturno para reservas telefónicas, alternativas automáticas por aforo y transferencia tras 2 fallos.
              </p>
              <span className="text-[10px] font-bold text-purple-800 bg-purple-100 px-2 py-0.5 rounded">
                MVP Crítico · Cero Mesas Vacías
              </span>
            </div>

            <div className="p-5 rounded-2xl border-2 border-amber-200 bg-amber-50/40 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-amber-600 text-white font-bold flex items-center justify-center">
                4
              </div>
              <h4 className="font-bold text-sm text-[#022853]">Cola de Sincronización Universal</h4>
              <p className="text-xs text-slate-600">
                Visualización estandarizada de estados (🟢, ⏳, 🔵, 🔴), badge superior "3 pendientes" y resolución asistida de conflictos.
              </p>
              <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded">
                MVP Crítico · Cero Pérdida de Datos
              </span>
            </div>

            <div className="p-5 rounded-2xl border-2 border-slate-300 bg-slate-50 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-slate-700 text-white font-bold flex items-center justify-center">
                5
              </div>
              <h4 className="font-bold text-sm text-[#022853]">Accesibilidad WCAG 2.2 AA</h4>
              <p className="text-xs text-slate-600">
                Áreas táctiles mínimas de 48x48dp, contraste superior a 4.5:1, escalado dinámico al 200% y soporte de TalkBack/VoiceOver.
              </p>
              <span className="text-[10px] font-bold text-slate-800 bg-slate-200 px-2 py-0.5 rounded">
                MVP Crítico · Inclusión y Ergonomía
              </span>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: ROADMAP DE SPRINTS */}
      {activeTab === 'roadmap' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h3 className="text-xl font-black font-brand text-[#022853]">
              Roadmap de Entregas Iterativas (Sprints 1 a 4)
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Planificación temporal con entregas continuas funcionales y verificables.
            </p>
          </div>

          <div className="space-y-4">
            {[
              {
                sprint: 'Sprint 1 (Semanas 1-2)',
                title: 'Fundación Offline-First, PWA y Fichaje Cero Toque',
                deliverables: [
                  'Configuración PWA con Workbox y vite-plugin-pwa (Service Worker + Manifest)',
                  'Base de datos local reactiva unificada (Dato único entre módulos)',
                  'Módulo de fichaje con validación GPS en background y haptic feedback',
                  'Cola de sincronización transaccional y visualizador de estados (🟢, ⏳, 🔵)',
                ],
                status: 'Completado en MVP',
                color: 'bg-emerald-50 border-emerald-300 text-emerald-800',
              },
              {
                sprint: 'Sprint 2 (Semanas 3-4)',
                title: 'OCR de Gastos en 3 Pasos y Agente Económico',
                deliverables: [
                  'Captura de tickets con botón gigante ergonómico',
                  'Integración de Gemini 3.8 Flash para OCR multimodal y sugerencia contable',
                  'Detección de facturas de suministros duplicadas y alertas de tesorería',
                  'Flujo de aprobación humana en un solo toque',
                ],
                status: 'Completado en MVP',
                color: 'bg-blue-50 border-blue-300 text-blue-800',
              },
              {
                sprint: 'Sprint 3 (Semanas 5-6)',
                title: 'Agente de Sala VUX 24/7 y Agente de RRHH / Turnos',
                deliverables: [
                  'Pipeline NLU monoturno para reservas telefónicas',
                  'Fallback accesible DTMF por teclado para problemas auditivos/habla',
                  'Chatbot PWA de empleado para saldo de vacaciones y regularización de fichaje',
                  'Protocolo de transferencia humana tras 2 fallos',
                ],
                status: 'Completado en MVP',
                color: 'bg-purple-50 border-purple-300 text-purple-800',
              },
              {
                sprint: 'Sprint 4 (Semanas 7-8)',
                title: 'Auditoría WCAG 2.2 AA, Multiempresa y Hardening',
                deliverables: [
                  'Verificación con lectores de pantalla VoiceOver y TalkBack en entornos de cocina',
                  'Soporte multi-local / multiempresa con segregación de datos en servidor',
                  'Stress-testing de resolución de conflictos de concurrencia',
                  'Certificación de marca e insignias de cumplimiento normativo Asexia',
                ],
                status: 'Próxima Iteración',
                color: 'bg-slate-50 border-slate-300 text-slate-700',
              },
            ].map((sp, idx) => (
              <div key={idx} className={`p-5 rounded-2xl border-2 ${sp.color} space-y-2`}>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs uppercase tracking-wider">{sp.sprint}</span>
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-white shadow-2xs">
                    {sp.status}
                  </span>
                </div>
                <h4 className="font-black text-sm text-[#022853]">{sp.title}</h4>
                <ul className="text-xs space-y-1 list-disc pl-5 opacity-90">
                  {sp.deliverables.map((d, dIdx) => (
                    <li key={dIdx}>{d}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: ASIGNACIÓN DE ROLES SENIOR */}
      {activeTab === 'team' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h3 className="text-xl font-black font-brand text-[#022853]">
              Matriz de Responsabilidades del Equipo Experto Senior
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Asignación clara de entregables por perfil de ingeniería y diseño.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
            
            {/* Frontend Senior */}
            <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50 space-y-2">
              <div className="flex items-center gap-2">
                <Code className="w-4 h-4 text-[#0067B9]" />
                <h4 className="font-bold text-sm text-[#022853]">Ingeniero Frontend Senior (PWA & React)</h4>
              </div>
              <p className="text-slate-600">
                <strong>Responsabilidades:</strong> Construcción de la SPA en React 19 + TypeScript, integración de Service Worker mediante <code>vite-plugin-pwa</code>, gestión reactiva del almacenamiento local (IndexedDB) y soporte offline estricto sin bloqueo visual.
              </p>
            </div>

            {/* Backend Senior */}
            <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50 space-y-2">
              <div className="flex items-center gap-2">
                <Server className="w-4 h-4 text-[#022853]" />
                <h4 className="font-bold text-sm text-[#022853]">Ingeniero Backend & AI Senior</h4>
              </div>
              <p className="text-slate-600">
                <strong>Responsabilidades:</strong> Endpoints Express seguros, integración server-side de <code>@google/genai</code> para los 3 agentes (Voz, RRHH y OCR de gastos), motor de conciliación de la cola de sincronización y resolución de conflictos concurrentes.
              </p>
            </div>

            {/* QA & Accessibility Senior */}
            <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50 space-y-2">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#48A222]" />
                <h4 className="font-bold text-sm text-[#022853]">Especialista QA & Accesibilidad Senior</h4>
              </div>
              <p className="text-slate-600">
                <strong>Responsabilidades:</strong> Auditoría WCAG 2.2 AA (anuncios ARIA live polite, ratios de contraste &gt; 4.5:1, áreas táctiles &gt; 48px), pruebas de penetración en red intermitente (Packet Loss / Offline) y validación de fallbacks DTMF.
              </p>
            </div>

            {/* UX/UI Senior */}
            <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50 space-y-2">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-[#D6A52A]" />
                <h4 className="font-bold text-sm text-[#022853]">Diseñador UX/UI & VUX Senior</h4>
              </div>
              <p className="text-slate-600">
                <strong>Responsabilidades:</strong> Sistema de diseño con la guía oficial de marca Asexia, arquitectura conversacional de voz, diseño de pantalla partida para revisión de tickets y prototipado ergonómico para uso con una sola mano.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: CRITERIOS DE ACEPTACIÓN */}
      {activeTab === 'criterios' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h3 className="text-xl font-black font-brand text-[#022853]">
              Checklist de Criterios de Aceptación (Documento Maestro & Auditoría)
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Verificación funcional del 100% de los puntos identificados en la auditoría de ConfiA360.
            </p>
          </div>

          <div className="space-y-3">
            {[
              {
                category: 'Usabilidad y Offline',
                item: 'El usuario puede ver visualmente (mediante colores e iconos) el estado de sincronización de cualquier elemento (🟢, ⏳, 🔵, 🔴).',
                verified: true,
              },
              {
                category: 'Usabilidad y Offline',
                item: 'El flujo de captura de un gasto (cámara -> OCR -> envío) toma un máximo de 3 toques en pantalla.',
                verified: true,
              },
              {
                category: 'Accesibilidad y Lectura de Pantalla',
                item: 'Un usuario con lector de pantalla (VoiceOver/TalkBack) puede completar un fichaje sin ayuda visual gracias a anuncios ARIA live polite.',
                verified: true,
              },
              {
                category: 'Accesibilidad y Lectura de Pantalla',
                item: 'Todos los botones de acción crítica tienen un área táctil mínima de 48x48dp.',
                verified: true,
              },
              {
                category: 'UX Voz y Agentes',
                item: 'El Agente de Voz de Reservas procesa múltiples datos en una sola intervención del usuario (fecha, hora y comensales en una sola frase).',
                verified: true,
              },
              {
                category: 'UX Voz y Agentes',
                item: 'Si el Agente de Voz falla 2 veces en reconocer la intención, transfiere a un humano o permite entrada interactiva por teclado DTMF.',
                verified: true,
              },
              {
                category: 'UX Voz y Agentes',
                item: 'El Agente Económico (OCR) sugiere automáticamente la categoría del gasto y el usuario valida con un solo toque (supervisión humana).',
                verified: true,
              },
            ].map((c, i) => (
              <div
                key={i}
                className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 flex items-start gap-3"
              >
                <div className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0 mt-0.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </div>
                <div className="flex-1 text-xs">
                  <span className="font-bold text-[10px] uppercase tracking-wider text-[#0067B9] block">
                    {c.category}
                  </span>
                  <span className="font-semibold text-slate-800">{c.item}</span>
                </div>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full shrink-0">
                  Implementado ✓
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
