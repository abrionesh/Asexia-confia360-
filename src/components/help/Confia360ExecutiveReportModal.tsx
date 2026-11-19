import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  X,
  Compass,
  Layers,
  Users,
  ShieldAlert,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Building2,
  FileText,
  DollarSign,
  Utensils,
  Receipt,
  Scale,
  BrainCircuit,
  Workflow,
  ExternalLink,
} from 'lucide-react';

interface Confia360ExecutiveReportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Confia360ExecutiveReportModal: React.FC<Confia360ExecutiveReportModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { openDrawer360, setActiveView, setActiveOperativaTab } = useApp();
  const [activeTab, setActiveTab] = useState<'vision' | 'core_sectorial' | 'cuadro_mando' | 'navegacion360' | 'alarmas'>(
    'vision'
  );

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="confia360-report-title"
    >
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-4xl w-full max-h-[92vh] flex flex-col overflow-hidden">
        
        {/* MODAL HEADER */}
        <div className="bg-[#022853] text-white p-5 sm:p-6 border-b border-blue-900 flex items-start justify-between gap-4 shrink-0">
          <div>
            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
              <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-[#80D518] text-[#022853] font-mono">
                Informe Ejecutivo de Arquitectura
              </span>
              <span className="text-[10px] font-mono text-blue-200 bg-white/10 px-2 py-0.5 rounded-md">
                Ecosistema Digital 360º
              </span>
            </div>
            <h2 id="confia360-report-title" className="text-xl sm:text-2xl font-black font-brand text-white">
              ¿Qué es Confía360?
            </h2>
            <p className="text-xs sm:text-sm text-blue-100 mt-1 max-w-2xl leading-relaxed">
              Tratamiento de la información de negocio de principio a fin para autónomos y pymes: desde la captación y facturación hasta el desglose granular y la toma de decisiones.
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-white/70 hover:text-white hover:bg-white/15 transition shrink-0"
            aria-label="Cerrar informe"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* NAVIGATION TABS */}
        <div className="bg-slate-100 border-b border-slate-200 px-4 sm:px-6 py-2 flex items-center gap-1.5 overflow-x-auto scrollbar-none shrink-0">
          {[
            { id: 'vision' as const, label: '1. Visión & Concepto', icon: BrainCircuit },
            { id: 'core_sectorial' as const, label: '2. Core vs Módulos Sectoriales', icon: Layers },
            { id: 'cuadro_mando' as const, label: '3. Cuadro de Mando por Rol', icon: Users },
            { id: 'navegacion360' as const, label: '4. Navegación 360º & Desglose', icon: Compass },
            { id: 'alarmas' as const, label: '5. Alarmas & Predicción', icon: ShieldAlert },
          ].map((tab) => {
            const Icon = tab.icon;
            const isCurrent = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`touch-target-min text-xs font-bold px-3 py-2 rounded-xl transition flex items-center gap-1.5 shrink-0 ${
                  isCurrent
                    ? 'bg-[#0067B9] text-white shadow-xs font-black'
                    : 'bg-white hover:bg-slate-200 text-slate-700'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isCurrent ? 'text-[#80D518]' : 'text-slate-500'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* SCROLLABLE BODY CONTENT */}
        <div className="p-5 sm:p-7 overflow-y-auto space-y-6 flex-1 text-slate-700 text-sm leading-relaxed">

          {/* TAB 1: VISIÓN Y CONCEPTO CENTRAL */}
          {activeTab === 'vision' && (
            <div className="space-y-5 animate-in fade-in duration-150">
              <div className="bg-blue-50/70 border border-blue-200 rounded-2xl p-5 space-y-2">
                <span className="text-xs font-black uppercase text-[#0067B9] tracking-wider block">
                  Definición Clave
                </span>
                <p className="text-slate-900 font-bold text-base leading-snug">
                  "Confía360 no es una aplicación aislada de facturación ni un simple CRM: es un ecosistema digital de gestión integral diseñado para tratar la información del negocio de principio a fin."
                </p>
                <p className="text-xs text-slate-600">
                  Cubre todo el ciclo vital: captación $\rightarrow$ presupuestación $\rightarrow$ facturación $\rightarrow$ recepción de compras/albaranes $\rightarrow$ gastos $\rightarrow$ conciliación bancaria $\rightarrow$ fiscalidad preventiva $\rightarrow$ toma de decisiones.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                  <div className="w-8 h-8 rounded-xl bg-[#022853] text-[#80D518] flex items-center justify-center font-bold">
                    1
                  </div>
                  <h4 className="font-black text-slate-900 text-sm">Información Única y Conectada</h4>
                  <p className="text-xs text-slate-600">
                    Un único dato —un cliente, una factura o un albarán— alimenta automáticamente las ventas, el stock, la tesorería, la fiscalidad y los márgenes de escandallo.
                  </p>
                </div>

                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                  <div className="w-8 h-8 rounded-xl bg-[#0067B9] text-white flex items-center justify-center font-bold">
                    2
                  </div>
                  <h4 className="font-black text-slate-900 text-sm">Cero Islas de Información</h4>
                  <p className="text-xs text-slate-600">
                    Elimina la necesidad de exportar hojas Excel o saltar entre herramientas desintegradas. La relación entre cada dato es transitable en dos clics.
                  </p>
                </div>

                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                  <div className="w-8 h-8 rounded-xl bg-[#80D518] text-[#022853] flex items-center justify-center font-bold">
                    3
                  </div>
                  <h4 className="font-black text-slate-900 text-sm">Tratamiento de Principio a Fin</h4>
                  <p className="text-xs text-slate-600">
                    Desde la recepción física en muelle o la reserva del cliente hasta el modelo fiscal de la gestoría y el análisis de rentabilidad del dueño.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: CORE UNIVERSAL VS MÓDULOS SECTORIALES */}
          {activeTab === 'core_sectorial' && (
            <div className="space-y-5 animate-in fade-in duration-150">
              <p className="text-xs text-slate-600">
                La arquitectura de Confía360 separa limpiamente lo que es común a cualquier negocio de lo que es específico a su actividad económica:
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Core Universal */}
                <div className="p-5 rounded-2xl bg-slate-50 border-2 border-slate-200 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-[#0067B9]" />
                    <h4 className="font-black text-slate-900 text-base">Core Universal (Para Todo Negocio)</h4>
                  </div>
                  <p className="text-xs text-slate-600">
                    Base operativa estándar válida para cualquier autónomo o pequeña y mediana empresa:
                  </p>
                  <ul className="space-y-2 text-xs text-slate-700">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span><strong>Gestión de Clientes y Proveedores</strong> (fichas maestras)</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span><strong>Facturación Electrónica & Verifactu</strong> (trazabilidad y hash)</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span><strong>Digitalización de Gastos & OCR</strong> (extracción de tickets/facturas)</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span><strong>Presencia & Fichaje</strong> (geolocalización y registro horario)</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span><strong>Banca, Tesorería y Libros Registros</strong> (conciliación)</span>
                    </li>
                  </ul>
                </div>

                {/* Módulos Sectoriales */}
                <div className="p-5 rounded-2xl bg-amber-50/60 border-2 border-amber-200 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-amber-600" />
                    <h4 className="font-black text-slate-900 text-base">Módulos Sectoriales Integrados</h4>
                  </div>
                  <p className="text-xs text-slate-600">
                    Adaptan el sistema a las operaciones reales del sector sin forzar a todos los clientes a la misma estructura:
                  </p>
                  <div className="space-y-2 text-xs">
                    <div className="bg-white p-2.5 rounded-xl border border-amber-200/80">
                      <strong className="text-slate-900 block font-bold">Sector Hostelería / Restauración (Activo en este proyecto):</strong>
                      <span className="text-slate-600 text-[11px]">
                        Albaranes de muelle, recetarios, escandallos con merma, platos de carta, turnos de sala/cocina y reservas con reputación.
                      </span>
                    </div>
                    <div className="bg-white/70 p-2.5 rounded-xl border border-slate-200">
                      <strong className="text-slate-700 block font-bold">Otros Sectores Conectables:</strong>
                      <span className="text-slate-500 text-[11px]">
                        Clínicas (citas e historiales), Comercios (TPV y stock físico), Servicios Profesionales (proyectos y horas imputadas).
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: CUADROS DE MANDO POR PERFIL */}
          {activeTab === 'cuadro_mando' && (
            <div className="space-y-5 animate-in fade-in duration-150">
              <p className="text-xs text-slate-600">
                Cada rol ve la información prioritaria para su función operativa, evitando la saturación con datos que no le competen:
              </p>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border border-slate-200 rounded-2xl overflow-hidden">
                  <thead className="bg-[#022853] text-white uppercase text-[10px] tracking-wider">
                    <tr>
                      <th className="p-3">Perfil / Rol</th>
                      <th className="p-3">Información Prioritaria en Pantalla</th>
                      <th className="p-3">Pregunta Principal que Responde</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    <tr className="hover:bg-slate-50">
                      <td className="p-3 font-bold text-slate-900 flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-[#80D518]" />
                        <span>Autónomo / Gerente</span>
                      </td>
                      <td className="p-3 text-slate-700">
                        Ventas, cobros pendientes, rentabilidad global, previsión fiscal y alertas críticas.
                      </td>
                      <td className="p-3 font-mono text-[11px] text-blue-900">
                        ¿Cómo va el negocio hoy y cuánto dinero queda libre?
                      </td>
                    </tr>
                    <tr className="hover:bg-slate-50">
                      <td className="p-3 font-bold text-slate-900 flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-purple-600" />
                        <span>Jefe de Cocina / Operaciones</span>
                      </td>
                      <td className="p-3 text-slate-700">
                        Subidas en albaranes, rotación de escandallos, mermas y Food Cost real vs teórico.
                      </td>
                      <td className="p-3 font-mono text-[11px] text-purple-900">
                        ¿Mis platos siguen dando el margen fijado?
                      </td>
                    </tr>
                    <tr className="hover:bg-slate-50">
                      <td className="p-3 font-bold text-slate-900 flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-amber-600" />
                        <span>Responsable de Sala / Comercial</span>
                      </td>
                      <td className="p-3 text-slate-700">
                        Ocupación de mesas, reservas con reseñas asociadas, ticket medio y conversión.
                      </td>
                      <td className="p-3 font-mono text-[11px] text-amber-900">
                        ¿Tenemos la sala llena y los clientes satisfechos?
                      </td>
                    </tr>
                    <tr className="hover:bg-slate-50">
                      <td className="p-3 font-bold text-slate-900 flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-blue-600" />
                        <span>Administración</span>
                      </td>
                      <td className="p-3 text-slate-700">
                        Facturas pendientes de pago, vencimientos, conciliación bancaria y archivo digital.
                      </td>
                      <td className="p-3 font-mono text-[11px] text-blue-900">
                        ¿Está todo contabilizado y los pagos al día?
                      </td>
                    </tr>
                    <tr className="hover:bg-slate-50">
                      <td className="p-3 font-bold text-slate-900 flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-600" />
                        <span>Gestoría / Auditor</span>
                      </td>
                      <td className="p-3 text-slate-700">
                        Cierre fiscal trimestral, modelos tributarios, libros registros y discrepancias.
                      </td>
                      <td className="p-3 font-mono text-[11px] text-emerald-900">
                        ¿Hay saltos de factura o descuadres de IVA?
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 4: NAVEGACIÓN 360º & DESGLOSE */}
          {activeTab === 'navegacion360' && (
            <div className="space-y-5 animate-in fade-in duration-150">
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-5 space-y-3">
                <span className="text-xs font-black uppercase text-[#0067B9] tracking-wider block">
                  El Principio Rector de Usabilidad: Navegación360
                </span>
                <p className="text-slate-800 text-sm font-medium leading-relaxed">
                  Desde cualquier cifra agregada, el usuario puede <strong>desglosar los registros individuales</strong> que componen ese total, seleccionar cualquiera de ellos para ver su ficha y saltar inmediatamente a las <strong>entidades asociadas</strong> en la cadena de negocio.
                </p>
              </div>

              {/* Step by Step Diagram */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-2.5 text-xs">
                <div className="p-3.5 bg-white rounded-2xl border border-slate-200 shadow-2xs space-y-1.5">
                  <span className="text-[10px] font-black uppercase text-slate-400 block font-mono">Paso 1</span>
                  <strong className="text-slate-900 block font-bold">1. Total Agregado</strong>
                  <p className="text-slate-500 text-[11px]">
                    El usuario observa en el cuadro de mandos: "Gasto en Materia Prima: 418,00 €".
                  </p>
                </div>

                <div className="p-3.5 bg-white rounded-2xl border border-slate-200 shadow-2xs space-y-1.5">
                  <span className="text-[10px] font-black uppercase text-slate-400 block font-mono">Paso 2</span>
                  <strong className="text-slate-900 block font-bold">2. Desglose en 1 Clic</strong>
                  <p className="text-slate-500 text-[11px]">
                    Pulsa "Ver desglose" y se despliegan los 4 documentos/facturas que suman esa cifra.
                  </p>
                </div>

                <div className="p-3.5 bg-white rounded-2xl border border-slate-200 shadow-2xs space-y-1.5">
                  <span className="text-[10px] font-black uppercase text-slate-400 block font-mono">Paso 3</span>
                  <strong className="text-slate-900 block font-bold">3. Ficha de Detalle</strong>
                  <p className="text-slate-500 text-[11px]">
                    Selecciona `ALB-4412` o `ART-002` y accede a sus datos maestros y hash criptográfico.
                  </p>
                </div>

                <div className="p-3.5 bg-white rounded-2xl border border-slate-200 shadow-2xs space-y-1.5">
                  <span className="text-[10px] font-black uppercase text-slate-400 block font-mono">Paso 4</span>
                  <strong className="text-slate-900 block font-bold">4. Salto a Entidades 360º</strong>
                  <p className="text-slate-500 text-[11px]">
                    Salta a receta $\rightarrow$ plato $\rightarrow$ escandallo $\rightarrow$ reseñas de clientes.
                  </p>
                </div>
              </div>

              {/* Live Test Trigger */}
              <div className="p-4 bg-slate-100 rounded-2xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <span className="text-xs text-slate-700 font-medium">
                  Prueba la Navegación 360º ahora mismo abriendo el Cajón Transversal:
                </span>
                <button
                  onClick={() => {
                    onClose();
                    openDrawer360('articulo_producto');
                  }}
                  className="touch-target-min px-4 py-2 rounded-xl bg-[#0067B9] hover:bg-[#022853] text-white text-xs font-bold transition flex items-center justify-center gap-2 shadow-xs shrink-0"
                >
                  <Compass className="w-4 h-4 text-[#80D518]" />
                  <span>Abrir Cajón Transversal 360º</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 5: ALARMAS Y PREDICCIÓN */}
          {activeTab === 'alarmas' && (
            <div className="space-y-5 animate-in fade-in duration-150">
              <p className="text-xs text-slate-600">
                Confía360 convierte el registro contable en avisos accionables y predicciones para evitar sorpresas antes del cierre:
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-rose-50/60 rounded-2xl border border-rose-200 space-y-2">
                  <div className="flex items-center gap-2 text-rose-800 font-bold text-sm">
                    <ShieldAlert className="w-4 h-4 text-rose-600" />
                    <span>Alarmas Preventivas Accionables</span>
                  </div>
                  <ul className="space-y-1.5 text-xs text-rose-900">
                    <li>• Subidas de precios no pactadas detectadas por OCR en albaranes.</li>
                    <li>• Erosión de margen y exceso de Food Cost en platos estrella.</li>
                    <li>• Saltos de numeración o facturas sin NIF que incumplen Verifactu.</li>
                    <li>• Descuadres entre el libro de gastos y los extractos bancarios.</li>
                  </ul>
                </div>

                <div className="p-4 bg-emerald-50/60 rounded-2xl border border-emerald-200 space-y-2">
                  <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm">
                    <Scale className="w-4 h-4 text-emerald-600" />
                    <span>Predicción y Simulación "What-If"</span>
                  </div>
                  <ul className="space-y-1.5 text-xs text-emerald-900">
                    <li>• Estimación del IVA e IRPF a pagar al final del trimestre.</li>
                    <li>• Previsión de tesorería y necesidad de caja a 30 días.</li>
                    <li>• Simulador de PVP en carta si el coste de compra continúa subiendo.</li>
                    <li>• Impacto proyectado en reseñas si se cambia de proveedor de producto.</li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* MODAL FOOTER */}
        <div className="bg-slate-50 p-4 sm:p-5 border-t border-slate-200 flex items-center justify-between gap-3 shrink-0">
          <span className="text-xs text-slate-500 font-mono hidden sm:inline">
            Confía360 · Sistema Certificado para Pymes y Autónomos
          </span>
          <div className="flex items-center gap-2 ml-auto">
            <button
              onClick={onClose}
              className="touch-target-min px-4 py-2 rounded-xl bg-slate-900 hover:bg-[#022853] text-white text-xs font-bold transition"
            >
              Entendido
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
