import React, { useState } from 'react';
import {
  Smartphone,
  Layers,
  Eye,
  CheckCircle,
  AlertTriangle,
  Mic,
  DollarSign,
  Fingerprint,
  RefreshCw,
  Palette,
  Maximize2,
  Sliders,
} from 'lucide-react';

export const UXDesignSuite: React.FC = () => {
  const [fidelityMode, setFidelityMode] = useState<'lofi' | 'hifi'>('hifi');
  const [selectedFlow, setSelectedFlow] = useState<'fichaje' | 'ocr' | 'voz' | 'estados'>('fichaje');

  return (
    <div className="space-y-8">
      
      {/* Executive Role Header */}
      <div className="bg-[#022853] rounded-3xl p-6 sm:p-8 text-white shadow-lg border border-white/10 relative overflow-hidden">
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#80D518]/20 text-[#80D518] text-xs font-bold border border-[#80D518]/30">
            <Eye className="w-3.5 h-3.5" />
            <span>Rol: Diseñador UX/UI & VUX Senior</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black font-brand tracking-tight">
            Diseño de Experiencia & Wireframes AsexIA Confia360
          </h2>
          <p className="text-xs sm:text-sm text-blue-100 leading-relaxed">
            Arquitectura de información y diseño centrado en el usuario de hostelería: cero fricción bajo condiciones extremas (ruido en sala, grasa o vapor en cocina, desconexión en sótanos y sol en terrazas). Cumplimiento riguroso de WCAG 2.2 AA y guía de marca Asexia.
          </p>
        </div>
        
        {/* Decorative graphic */}
        <div className="absolute right-4 -bottom-10 opacity-10 font-brand font-black text-9xl pointer-events-none select-none text-white">
          UX
        </div>
      </div>

      {/* Interactive Controls: Fidelity Switcher & Flow Selector */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        
        {/* Flow selector buttons */}
        <div className="flex flex-wrap gap-2">
          {[
            { id: 'fichaje', label: '1. Fichaje Cero Toque', icon: Fingerprint },
            { id: 'ocr', label: '2. OCR Gastos (3 Pasos)', icon: DollarSign },
            { id: 'voz', label: '3. Agente Voz NLU (VUX)', icon: Mic },
            { id: 'estados', label: '4. Sistema Estados Offline', icon: RefreshCw },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setSelectedFlow(item.id as any)}
                className={`touch-target-min flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition ${
                  selectedFlow === item.id
                    ? 'bg-[#0067B9] text-white shadow-xs'
                    : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Lo-Fi vs Hi-Fi Toggle */}
        <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 shrink-0">
          <button
            onClick={() => setFidelityMode('lofi')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
              fidelityMode === 'lofi'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            📐 Baja Fidelidad (Wireframe)
          </button>
          <button
            onClick={() => setFidelityMode('hifi')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
              fidelityMode === 'hifi'
                ? 'bg-[#022853] text-white shadow-xs'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            🎨 Alta Fidelidad (Brand Asexia)
          </button>
        </div>
      </div>

      {/* Main Flow Presentation Canvas */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
        
        {/* FLOW 1: FICHAJE CERO TOQUE */}
        {selectedFlow === 'fichaje' && (
          <div className="space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-[#0067B9]">Flujo Crítico 1</span>
              <h3 className="text-xl font-black font-brand text-[#022853] mt-0.5">
                Fichaje Inteligente "Cero Toque" (Mobile-First)
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                <strong>Premisa UX:</strong> El empleado llega apresurado al servicio. El sistema no debe requerir contraseñas complejas ni confirmaciones redundantes. Al pulsar "Fichar Entrada", el GPS se consulta en segundo plano sin bloquear al usuario.
              </p>
            </div>

            {/* Wireframe Comparison */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Wireframe Mockup Frame */}
              <div className={`p-6 rounded-2xl border-2 transition ${
                fidelityMode === 'lofi'
                  ? 'border-dashed border-slate-400 bg-slate-50 font-mono'
                  : 'border-slate-200 bg-[#F3F7FA]'
              }`}>
                <div className="max-w-xs mx-auto bg-white rounded-3xl p-5 shadow-md border border-slate-300 space-y-4">
                  {/* Phone Mock Header */}
                  <div className="flex items-center justify-between border-b pb-2 text-[11px] text-slate-400">
                    <span>9:41 AM</span>
                    <span className={fidelityMode === 'hifi' ? 'text-emerald-600 font-bold' : ''}>● AsexIA Confia360 PWA</span>
                  </div>

                  {fidelityMode === 'lofi' ? (
                    // Lo-Fi Wireframe
                    <div className="space-y-3 text-center">
                      <div className="h-6 bg-slate-200 rounded w-3/4 mx-auto" />
                      <div className="h-3 bg-slate-100 rounded w-1/2 mx-auto" />
                      
                      <div className="p-4 border-2 border-dashed border-slate-400 rounded-xl space-y-2 my-4">
                        <div className="w-12 h-12 rounded-full border-2 border-slate-400 mx-auto flex items-center justify-center font-bold">
                          [BTN]
                        </div>
                        <div className="font-bold text-xs">[ BOTÓN GIGANTE FICHAJE ENTRADA ]</div>
                        <div className="text-[10px] text-slate-500">Min 48x48dp · GPS Background</div>
                      </div>

                      <div className="h-10 bg-slate-100 border border-slate-300 rounded-lg p-2 text-[10px] text-left">
                        [Toast / ARIA Live]: Fichaje guardado localmente (Offline).
                      </div>
                    </div>
                  ) : (
                    // Hi-Fi Prototype
                    <div className="space-y-4 text-center">
                      <div className="flex items-center justify-between">
                        <span className="font-brand font-black text-sm text-[#022853]">AsexIA Confia360</span>
                        <span className="w-2.5 h-2.5 rounded-full bg-[#48A222]" title="Sincronizado" />
                      </div>

                      <div className="p-5 rounded-2xl bg-[#022853] text-white shadow-lg space-y-2">
                        <div className="w-14 h-14 rounded-full bg-[#48A222] text-white font-black text-xl flex items-center justify-center mx-auto shadow-md">
                          ▶
                        </div>
                        <h4 className="font-brand font-black text-base">Fichar Entrada</h4>
                        <p className="text-[11px] text-blue-200">1 Toque · GPS 150m · Haptic</p>
                      </div>

                      <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-left text-[11px] text-emerald-800 flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-[#48A222] shrink-0" />
                        <span>Fichaje registrado. Se sincronizará si cae la cobertura.</span>
                      </div>
                    </div>
                  )}
                </div>
                <p className="text-[11px] text-center text-slate-400 mt-3">
                  {fidelityMode === 'lofi' ? 'Blueprint Funcional de Baja Fidelidad' : 'Prototipo Hi-Fi Asexia Navy / Lime'}
                </p>
              </div>

              {/* UX Rationale & Technical Standards */}
              <div className="space-y-4 text-xs text-slate-600">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                  <h4 className="font-bold text-slate-800 text-sm flex items-center gap-1.5">
                    <CheckCircle className="w-4 h-4 text-[#0067B9]" />
                    Decisiones de Diseño UX
                  </h4>
                  <ul className="space-y-1.5 list-disc pl-4 text-slate-600">
                    <li><strong>Cero pantallas intermedias:</strong> No pide seleccionar turno ni confirmación si la distancia GPS está dentro de 150m.</li>
                    <li><strong>Haptic Feedback:</strong> Disparo de vibración táctil para confirmación inmediata incluso con ruido ensordecedor de vajilla.</li>
                    <li><strong>Persistencia Optimista:</strong> El estado cambia al instante a "Entrada activa", sin esperar la latencia de red.</li>
                  </ul>
                </div>

                <div className="p-4 rounded-xl bg-blue-50/60 border border-blue-200 space-y-2">
                  <h4 className="font-bold text-[#022853] text-sm flex items-center gap-1.5">
                    <Sliders className="w-4 h-4 text-[#0067B9]" />
                    Accesibilidad WCAG 2.2 AA Aplicada
                  </h4>
                  <ul className="space-y-1.5 list-disc pl-4 text-slate-700">
                    <li>Área táctil física de 80x80dp (supera el mínimo WCAG de 48x48dp).</li>
                    <li>Ratio de contraste 7.2:1 (Blanco sobre Navy `#022853`), cumpliendo el estándar AAA.</li>
                    <li>Anuncio automático por sintetizador para TalkBack y VoiceOver mediante <code>aria-live="polite"</code>.</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* FLOW 2: OCR GASTOS EN 3 PASOS */}
        {selectedFlow === 'ocr' && (
          <div className="space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-[#0067B9]">Flujo Crítico 2</span>
              <h3 className="text-xl font-black font-brand text-[#022853] mt-0.5">
                Simplificación del OCR de Gastos de 12 Pasos a 3 Toques
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                <strong>Premisa UX:</strong> El flujo original de 12 pasos provocaba abandono y tickets perdidos en los bolsillos de los camareros. El nuevo flujo consta estrictamente de 3 acciones: 1) Captura con botón gigante, 2) Revisión en pantalla partida con campos faltantes en amarillo, 3) Envío en 1 toque.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Step 1 Card */}
              <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50 space-y-3">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#0067B9] text-white">Toque 1: Captura</span>
                <div className="h-32 rounded-xl bg-[#022853] text-white flex flex-col items-center justify-center p-3 text-center">
                  <div className="w-10 h-10 rounded-full bg-[#80D518] text-[#022853] font-black flex items-center justify-center text-lg mb-1">
                    📷
                  </div>
                  <span className="font-bold text-xs">Botón Gigante</span>
                  <span className="text-[10px] text-blue-200">Cámara / Galería</span>
                </div>
                <p className="text-[11px] text-slate-600">Disparo directo con botón ergonómico ubicado al alcance del pulgar.</p>
              </div>

              {/* Step 2 Card */}
              <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50 space-y-3">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#0067B9] text-white">Toque 2: Revisión</span>
                <div className="h-32 rounded-xl bg-white border border-slate-300 p-2 text-[10px] space-y-1 overflow-hidden">
                  <div className="font-bold text-[#022853]">Pantalla Partida</div>
                  <div className="bg-amber-100 text-amber-900 p-1 rounded font-semibold text-[9px]">
                    ⚠️ Amarillo: Campos a validar
                  </div>
                  <div className="text-slate-500 truncate">Iberdrola Clientes · 499.13 €</div>
                  <div className="text-slate-500 truncate">IVA 21% · Cat: Suministros</div>
                </div>
                <p className="text-[11px] text-slate-600">La IA pre-rellena el 95% de los datos y sugiere categoría contable.</p>
              </div>

              {/* Step 3 Card */}
              <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50 space-y-3">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#48A222] text-white">Toque 3: Envío</span>
                <div className="h-32 rounded-xl bg-[#48A222] text-white flex flex-col items-center justify-center p-3 text-center">
                  <div className="w-10 h-10 rounded-full bg-white text-[#48A222] font-black flex items-center justify-center text-lg mb-1">
                    ✓
                  </div>
                  <span className="font-bold text-xs">Enviar a Aprobación</span>
                  <span className="text-[10px] text-emerald-100">Guardado en Cola</span>
                </div>
                <p className="text-[11px] text-slate-600">Si no hay conexión a internet, se encola automáticamente en local.</p>
              </div>
            </div>
          </div>
        )}

        {/* FLOW 3: VUX VOZ NLU */}
        {selectedFlow === 'voz' && (
          <div className="space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-[#0067B9]">Flujo Crítico 3</span>
              <h3 className="text-xl font-black font-brand text-[#022853] mt-0.5">
                VUX Conversacional (Voice UX) y Árbol de Contingencia
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                <strong>Premisa VUX:</strong> Los IVRs tradicionales con árboles rígidos ("Pulse 1 para comensales...") frustran al comensal. El agente AsexIA Confia360 comprende lenguaje natural y extrae todas las variables en un solo turno de conversación.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 text-xs">
                <h4 className="font-bold text-[#022853] text-sm">Flujo de Diálogo Monoturno</h4>
                <div className="space-y-2">
                  <div className="bg-blue-100 p-2.5 rounded-xl text-[#022853]">
                    <strong>Cliente:</strong> "Quiero mesa para 6 personas este viernes a las 15:00"
                  </div>
                  <div className="bg-white p-2.5 rounded-xl border border-slate-200 text-slate-700">
                    <strong>Agente NLU:</strong> Extrae (Guests=6, Date=Viernes, Time=15:00) en 1 turno.
                  </div>
                  <div className="bg-amber-50 border border-amber-200 p-2.5 rounded-xl text-amber-900">
                    <strong>Heurística de Aforo:</strong> "Para 6 a las 15:00 está completo, pero dispongo de mesa a las 14:30 o 15:30. ¿Alguna le sirve?"
                  </div>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 text-xs">
                <h4 className="font-bold text-[#022853] text-sm">Protocolo de Contingencia & DTMF</h4>
                <div className="space-y-2">
                  <div className="p-2.5 rounded-xl bg-white border border-slate-200 text-slate-700">
                    <strong>Regla de 2 Fallos:</strong> Si el agente no reconoce la intención en 2 turnos consecutivos, se ejecuta transferencia asistida inmediata al responsable humano de sala.
                  </div>
                  <div className="p-2.5 rounded-xl bg-white border border-slate-200 text-slate-700">
                    <strong>Accesibilidad DTMF:</strong> Permite marcación por teclado para personas con dificultades de habla o en entornos con ruido extremo.
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* FLOW 4: ESTADOS VISUALES UNIVERSALES */}
        {selectedFlow === 'estados' && (
          <div className="space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-[#0067B9]">Flujo Crítico 4</span>
              <h3 className="text-xl font-black font-brand text-[#022853] mt-0.5">
                Sistema de Estados Visuales Universales (Offline-First)
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Toda entidad de AsexIA Confia360 (fichaje, gasto, reserva, turno) posee una representación cromática estandarizada y un badge no intrusivo en el header.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 rounded-2xl border-2 border-emerald-300 bg-emerald-50 text-emerald-900 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="w-3.5 h-3.5 rounded-full bg-[#48A222]" />
                  <span className="font-bold text-xs uppercase">Sincronizado</span>
                </div>
                <p className="text-xs text-emerald-800">El dato existe de forma idéntica en el almacenamiento local y en el servidor central.</p>
              </div>

              <div className="p-4 rounded-2xl border-2 border-amber-300 bg-amber-50 text-amber-900 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="w-3.5 h-3.5 rounded-full bg-amber-500 animate-ping" />
                  <span className="font-bold text-xs uppercase">Sincronizando</span>
                </div>
                <p className="text-xs text-amber-800">Transacción en tránsito en segundo plano por el worker de red.</p>
              </div>

              <div className="p-4 rounded-2xl border-2 border-blue-300 bg-blue-50 text-blue-900 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="w-3.5 h-3.5 rounded-full bg-[#0067B9]" />
                  <span className="font-bold text-xs uppercase">Pendiente Offline</span>
                </div>
                <p className="text-xs text-blue-800">Guardado de forma segura en local. Esperando reconexión sin bloquear al operario.</p>
              </div>

              <div className="p-4 rounded-2xl border-2 border-rose-300 bg-rose-50 text-rose-900 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="w-3.5 h-3.5 rounded-full bg-rose-600 animate-pulse" />
                  <span className="font-bold text-xs uppercase">Conflicto</span>
                </div>
                <p className="text-xs text-rose-800">Divergencia entre servidor y local. Notificación visible para resolución asistida.</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* WCAG 2.2 AA Contrast & Palette Reference Table */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-4">
        <div className="flex items-center gap-2">
          <Palette className="w-5 h-5 text-[#0067B9]" />
          <h3 className="text-base font-bold font-brand text-[#022853]">
            Paleta Oficial Asexia & Ratio de Contraste WCAG 2.2 AA
          </h3>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-xs">
          <div className="p-3 rounded-xl bg-[#022853] text-white">
            <span className="font-bold block">Asexia Navy</span>
            <span className="font-mono text-[10px] opacity-80">#022853</span>
            <span className="text-[10px] block mt-1 text-[#80D518]">Ratio 14.8:1 (AAA)</span>
          </div>

          <div className="p-3 rounded-xl bg-[#0067B9] text-white">
            <span className="font-bold block">Asexia Blue</span>
            <span className="font-mono text-[10px] opacity-80">#0067B9</span>
            <span className="text-[10px] block mt-1 text-white">Ratio 4.9:1 (AA)</span>
          </div>

          <div className="p-3 rounded-xl bg-[#48A222] text-white">
            <span className="font-bold block">Asexia Green</span>
            <span className="font-mono text-[10px] opacity-80">#48A222</span>
            <span className="text-[10px] block mt-1 text-white">Ratio 4.6:1 (AA)</span>
          </div>

          <div className="p-3 rounded-xl bg-[#80D518] text-[#022853]">
            <span className="font-bold block">Asexia Lime</span>
            <span className="font-mono text-[10px] opacity-80">#80D518</span>
            <span className="text-[10px] block mt-1 font-semibold">Acentos y CTA</span>
          </div>

          <div className="p-3 rounded-xl bg-[#F3F7FA] text-slate-800 border border-slate-200">
            <span className="font-bold block">Asexia Ice</span>
            <span className="font-mono text-[10px] opacity-80">#F3F7FA</span>
            <span className="text-[10px] block mt-1 text-slate-500">Fondos Suaves</span>
          </div>

          <div className="p-3 rounded-xl bg-[#D6A52A] text-white">
            <span className="font-bold block">Asexia Gold</span>
            <span className="font-mono text-[10px] opacity-80">#D6A52A</span>
            <span className="text-[10px] block mt-1 font-semibold">Cumplimiento Legal</span>
          </div>
        </div>
      </div>
    </div>
  );
};
