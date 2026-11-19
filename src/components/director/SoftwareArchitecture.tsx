import React, { useState } from 'react';
import {
  Server,
  Database,
  Cpu,
  Layers,
  ShieldCheck,
  CheckCircle,
  Smartphone,
  Share2,
  RefreshCw,
  GitBranch,
  Terminal,
} from 'lucide-react';

export const SoftwareArchitecture: React.FC = () => {
  const [selectedTopic, setSelectedTopic] = useState<'stack' | 'mobile_db' | 'sync_engine' | 'schema'>('stack');

  return (
    <div className="space-y-8">
      
      {/* Executive Role Header */}
      <div className="bg-[#022853] rounded-3xl p-6 sm:p-8 text-white shadow-lg border border-white/10 relative overflow-hidden">
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0067B9] text-white text-xs font-bold border border-white/20">
            <Cpu className="w-3.5 h-3.5 text-[#80D518]" />
            <span>Rol: Arquitecto de Software Senior & Principal Engineer</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black font-brand tracking-tight">
            Arquitectura Tecnológica & Modelo Móvil Unificado
          </h2>
          <p className="text-xs sm:text-sm text-blue-100 leading-relaxed">
            Diseño arquitectónico desacoplado, offline-first y reactivo. La arquitectura vive completamente en el dispositivo móvil con capacidad de compartir datos entre módulos (fichajes, turnos, reservas y gastos) sin silos de información, sincronizando de forma asíncrona hacia la nube mediante una cola única transaccional.
          </p>
        </div>

        <div className="absolute right-4 -bottom-10 opacity-10 font-brand font-black text-9xl pointer-events-none select-none text-white">
          ARCH
        </div>
      </div>

      {/* Navigation Pills */}
      <div className="flex flex-wrap gap-2">
        {[
          { id: 'stack', label: '1. Comparativa & Justificación del Stack', icon: Layers },
          { id: 'mobile_db', label: '2. Arquitectura Móvil & Dato Único', icon: Smartphone },
          { id: 'sync_engine', label: '3. Motor de Sincronización & Conflictos', icon: RefreshCw },
          { id: 'schema', label: '4. Modelo de Entidades & SQL Local', icon: Database },
        ].map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => setSelectedTopic(item.id as any)}
              className={`touch-target-min flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition ${
                selectedTopic === item.id
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

      {/* TOPIC 1: COMPARATIVA DEL STACK TECNOLÓGICO */}
      {selectedTopic === 'stack' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h3 className="text-xl font-black font-brand text-[#022853]">
              Evaluación Rigurosa de Tecnologías & Selección Final
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Análisis comparativo de frameworks y motores para las condiciones operativas de AsexIA Confia360.
            </p>
          </div>

          <div className="space-y-6">
            {/* Frontend Comparison */}
            <div className="space-y-3">
              <h4 className="font-bold text-sm text-[#022853] flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-[#0067B9] text-white text-xs flex items-center justify-center font-bold">A</span>
                <span>Frontend: React vs Vue vs Angular</span>
              </h4>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                <div className="p-4 rounded-xl border-2 border-emerald-300 bg-emerald-50/50 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[#022853]">React 19 + TypeScript</span>
                    <span className="text-[10px] font-bold bg-[#48A222] text-white px-1.5 py-0.5 rounded">ELEGIDO</span>
                  </div>
                  <p className="text-slate-600">
                    <strong>Por qué se elige:</strong> Soporte nativo para PWA sin fricción, gestión de estado granular (Context/Zustand), ecosistema masivo de audio/cámara, compilación ultrarrápida con Vite, y tipos TypeScript compartidos isomórficamente con el backend.
                  </p>
                </div>

                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 opacity-70 space-y-2">
                  <span className="font-bold text-slate-700 block">Vue 3 (Composition API)</span>
                  <p className="text-slate-500">
                    Excelente reactividad, pero menor soporte institucional en librerías avanzadas de audio/VUX y menor integración directa con las herramientas oficiales de SDK de Google.
                  </p>
                </div>

                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 opacity-70 space-y-2">
                  <span className="font-bold text-slate-700 block">Angular (Signals)</span>
                  <p className="text-slate-500">
                    Bundle excesivamente pesado para conexiones 3G/4G móviles lentas en sótanos de restaurantes; curva de complejidad desproporcionada para el patrón offline-first.
                  </p>
                </div>
              </div>
            </div>

            {/* Backend Comparison */}
            <div className="space-y-3">
              <h4 className="font-bold text-sm text-[#022853] flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-[#022853] text-white text-xs flex items-center justify-center font-bold">B</span>
                <span>Backend: Node.js/Express vs Python/Django vs Java/Spring Boot</span>
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                <div className="p-4 rounded-xl border-2 border-emerald-300 bg-emerald-50/50 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[#022853]">Node.js + Express (TS)</span>
                    <span className="text-[10px] font-bold bg-[#48A222] text-white px-1.5 py-0.5 rounded">ELEGIDO</span>
                  </div>
                  <p className="text-slate-600">
                    <strong>Por qué se elige:</strong> Modelo I/O no bloqueante ideal para streaming de voz (VUX), procesamiento concurrente de miles de eventos de cola de sincronización sin bloqueo, soporte oficial de primer nivel con el SDK <code>@google/genai</code>.
                  </p>
                </div>

                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 opacity-70 space-y-2">
                  <span className="font-bold text-slate-700 block">Python / Django</span>
                  <p className="text-slate-500">
                    Fuerte en análisis de datos, pero la sobrecarga del ORM y el modelo síncrono por defecto añade latencia innecesaria en la ingesta masiva de colas de eventos offline.
                  </p>
                </div>

                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 opacity-70 space-y-2">
                  <span className="font-bold text-slate-700 block">Java / Spring Boot</span>
                  <p className="text-slate-500">
                    Excelente para banca, pero tiempos de arranque (cold starts) altos en entornos de contenedores elásticos (Cloud Run) y lentitud de iteración en prototipado rápido.
                  </p>
                </div>
              </div>
            </div>

            {/* Database Comparison */}
            <div className="space-y-3">
              <h4 className="font-bold text-sm text-[#022853] flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-[#48A222] text-white text-xs flex items-center justify-center font-bold">C</span>
                <span>Base de Datos: Híbrido Offline-First (IndexedDB Local + Cloud PostgreSQL/Firestore)</span>
              </h4>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-2">
                <p>
                  <strong>¿Por qué una base de datos puramente en la nube (ej. Postgres remoto directo) es un error fatal en hostelería?</strong>
                  Si el camarero está en una cámara frigorífica o el encargado está en el almacén del sótano sin cobertura, cualquier llamada SQL remota se queda colgada (timeout), congelando la UI.
                </p>
                <p>
                  <strong>Solución Arquitectónica:</strong> Modelo híbrido. En el móvil reside una base de datos reactiva local (IndexedDB / SQLite embebido) con persistencia garantizada. Todas las operaciones de usuario leen y escriben a 0ms de latencia. En segundo plano, un Worker transfiere las transacciones hacia la base de datos central PostgreSQL en la nube cuando hay red disponible.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TOPIC 2: ARQUITECTURA MÓVIL & DATO ÚNICO */}
      {selectedTopic === 'mobile_db' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h3 className="text-xl font-black font-brand text-[#022853]">
              Principio de "Dato Único" & Compartición Inter-Módulos en el Móvil
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Como exige el documento maestro, la arquitectura debe evitar silos de información entre módulos (fichajes, turnos, reservas y gastos).
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Visual Diagram */}
            <div className="p-6 rounded-2xl bg-[#022853] text-white space-y-4">
              <h4 className="font-brand font-bold text-sm text-center text-[#80D518]">
                Diagrama de Flujo del Bus de Datos Local en el Dispositivo
              </h4>

              <div className="space-y-3 text-xs">
                {/* Modules row */}
                <div className="grid grid-cols-2 gap-2 text-center">
                  <div className="p-2.5 rounded-xl bg-white/10 border border-white/20 font-bold">
                    📍 Fichaje Cero Toque
                  </div>
                  <div className="p-2.5 rounded-xl bg-white/10 border border-white/20 font-bold">
                    📅 Cuadrante de Turnos
                  </div>
                  <div className="p-2.5 rounded-xl bg-white/10 border border-white/20 font-bold">
                    🍽️ Reservas & Sala
                  </div>
                  <div className="p-2.5 rounded-xl bg-white/10 border border-white/20 font-bold">
                    🧾 OCR de Gastos
                  </div>
                </div>

                <div className="text-center font-bold text-[#80D518] text-sm">
                  ⬇ Eventos Reactivos Bidireccionales
                </div>

                {/* Central Reactive Store */}
                <div className="p-4 rounded-2xl bg-[#0067B9] text-white text-center border-2 border-[#80D518] shadow-md space-y-1">
                  <span className="font-black text-sm block">MOTOR REACTIVO LOCAL (DATO ÚNICO)</span>
                  <span className="text-[11px] text-blue-100 block">Single Source of Truth en Memoria / IndexedDB</span>
                  <span className="text-[10px] font-mono text-[#80D518]">No hay duplicidad de entidades</span>
                </div>

                <div className="text-center font-bold text-[#80D518] text-sm">
                  ⬇ Transacciones Asíncronas
                </div>

                {/* Sync Queue */}
                <div className="p-3 rounded-xl bg-white/10 border border-white/20 text-center">
                  <span className="font-bold text-xs block text-white">Cola Única de Sincronización (sync_queue)</span>
                  <span className="text-[10px] text-blue-200">Reintentos con Backoff Exponencial y Detección de Conflictos</span>
                </div>
              </div>
            </div>

            {/* Cross-module use cases */}
            <div className="space-y-3 text-xs">
              <h4 className="font-bold text-[#022853] text-sm">Casos de Uso de Compartición Transversal:</h4>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <span className="font-bold text-[#0067B9] block">1. Fichaje ↔ Cuadrante de Turnos:</span>
                <p className="text-slate-600">
                  Al fichar la entrada, el módulo de turnos actualiza de inmediato el estado del empleado a "En servicio en sala" sin esperar respuesta del servidor. Si hay desfase de hora, el Agente de RRHH lo detecta.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <span className="font-bold text-[#0067B9] block">2. Reservas de Sala ↔ Aforo y Personal en Turno:</span>
                <p className="text-slate-600">
                  El Agente de Voz 24/7 calcula la disponibilidad de mesas cruzando comensales con los camareros que han fichado entrada hoy. Si sólo hay 2 camareros activos, el aforo admisible se modula automáticamente.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <span className="font-bold text-[#0067B9] block">3. Gastos OCR ↔ Tesorería y Auditoría de Turno:</span>
                <p className="text-slate-600">
                  Los tickets de compra de emergencia (ej. compra de hielo en gasolinera) capturados por el jefe de cocina impactan en tiempo real en la conciliación del arqueo de caja del turno activo.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TOPIC 3: MOTOR DE SINCRONIZACIÓN & CONFLICTOS */}
      {selectedTopic === 'sync_engine' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h3 className="text-xl font-black font-brand text-[#022853]">
              Motor de Sincronización y Algoritmo de Resolución de Conflictos
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Mecanismos matemáticos y de negocio para asegurar integridad transaccional.
            </p>
          </div>

          <div className="space-y-4 text-xs">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <h4 className="font-bold text-slate-800 text-sm">Estrategia LWW (Last-Write-Wins) con Supervisión Asistida</h4>
              <p className="text-slate-600">
                1. <strong>Fichajes y Gastos:</strong> Son entidades de sólo adición (Append-Only Event Sourcing). No presentan conflictos destructivos porque cada evento tiene ID único (UUIDv4) y timestamp inmutable con firma GPS.
              </p>
              <p className="text-slate-600">
                2. <strong>Reservas concurrentes:</strong> Si la central asigna una mesa al mismo tiempo que el camarero offline en sala la ocupa, el motor detecta la colisión en la clave de recurso (Mesa + Slot Horario) y eleva la tarjeta a estado 🔴 Conflicto, ofreciendo al encargado la decisión de "Mantener Local" o "Aceptar Central".
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3.5 rounded-xl border border-slate-200 bg-white space-y-1">
                <span className="font-bold text-[#0067B9] block">Backoff Exponencial</span>
                <p className="text-slate-500 text-[11px]">Reintentos escalonados a 2s, 5s, 15s y 60s para no saturar la batería en zonas de señal débil.</p>
              </div>
              <div className="p-3.5 rounded-xl border border-slate-200 bg-white space-y-1">
                <span className="font-bold text-[#022853] block">Idempotencia Total</span>
                <p className="text-slate-500 text-[11px]">Cada petición incluye una cabecera <code>Idempotency-Key</code> para impedir duplicación de tickets en reintentos.</p>
              </div>
              <div className="p-3.5 rounded-xl border border-slate-200 bg-white space-y-1">
                <span className="font-bold text-[#48A222] block">Cache Precaching</span>
                <p className="text-slate-500 text-[11px]">Todos los assets HTML/CSS/JS y logos se pre-cargan vía Service Worker (CacheFirst).</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TOPIC 4: ESQUEMA SQL & MODELO DE ENTIDADES */}
      {selectedTopic === 'schema' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h3 className="text-xl font-black font-brand text-[#022853]">
              Modelo de Datos y Extensiones de Auditoría (Documento Maestro)
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Esquemas SQL exactos que sustentan la persistencia en el dispositivo móvil y la base central.
            </p>
          </div>

          <div className="bg-slate-900 rounded-2xl p-5 text-emerald-400 font-mono text-xs overflow-x-auto space-y-3 shadow-inner">
            <div className="text-slate-400">// Tabla de Interacciones de Agentes Especializados (Propuesta Auditoría AsexIA Confia360)</div>
            <pre className="text-slate-100 whitespace-pre-wrap">{`CREATE TABLE ai_agent_interactions (
  id TEXT PRIMARY KEY,
  agent_type TEXT NOT NULL, -- 'voice_reservations', 'chat_shifts', 'economic'
  interaction_data TEXT NOT NULL, -- JSON con transcripción, audio o slots
  user_id TEXT,
  module_ref TEXT, -- 'reservations', 'shifts', 'expenses'
  entity_id TEXT, -- ID de la reserva, turno o gasto creado
  status TEXT NOT NULL, -- 'pending_human_review', 'completed', 'failed'
  updated_at TEXT NOT NULL
);

-- Extensiones de la cola para soporte de accesibilidad y resolución de conflictos
ALTER TABLE sync_queue ADD COLUMN ui_notification_shown BOOLEAN DEFAULT 0;
ALTER TABLE sync_conflicts ADD COLUMN user_feedback TEXT;`}</pre>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600">
            <p className="font-bold text-slate-800 mb-1">Garantía de Compatibilidad SQLite / IndexedDB / Cloud SQL:</p>
            <p>
              Los esquemas están diseñados con tipos estándar universales (<code>TEXT</code>, <code>INTEGER</code>, <code>NUMERIC</code>), lo que permite que el mismo modelo relacional sea instanciado en <strong>IndexedDB (vía sql.js o SQLite WASM)</strong> en el navegador móvil y en <strong>PostgreSQL</strong> en la nube sin discrepancias de tipos.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
