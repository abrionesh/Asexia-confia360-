import React from 'react';
import {
  StrategicKPIs,
  TacticalKPIs,
  OperationalKPIs,
  EconomicMetrics,
  ReservationMetrics,
  StaffMetrics,
  InformationLevel,
  InformationDomain,
} from '../../types/cockpit';
import {
  Layers,
  DollarSign,
  Users,
  Utensils,
  Sparkles,
  PhoneCall,
  ArrowRight,
  TrendingUp,
  ShieldCheck,
  CheckCircle,
} from 'lucide-react';

interface LevelMatrix360ViewProps {
  strategicMetrics: StrategicKPIs;
  tacticalMetrics: TacticalKPIs;
  operationalMetrics: OperationalKPIs;
  economicMetrics: EconomicMetrics;
  reservationMetrics: ReservationMetrics;
  staffMetrics: StaffMetrics;
  onNavigateLevel: (level: InformationLevel) => void;
}

export const LevelMatrix360View: React.FC<LevelMatrix360ViewProps> = ({
  strategicMetrics,
  tacticalMetrics,
  operationalMetrics,
  economicMetrics,
  reservationMetrics,
  staffMetrics,
  onNavigateLevel,
}) => {
  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      
      {/* Banner Matriz 360 */}
      <div className="bg-gradient-to-r from-[#022853] via-[#0067B9] to-emerald-900 text-white rounded-3xl p-6 sm:p-7 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#80D518] text-[#022853]">
                Matriz Integral 3x5
              </span>
              <span className="text-xs text-blue-200">Alineación Estratégica, Táctica y Operacional</span>
            </div>
            <h3 className="text-2xl font-black font-brand">
              Cuadro de Mando Multidimensional 360º
            </h3>
            <p className="text-xs text-blue-100 max-w-2xl leading-relaxed">
              Visualiza en una sola vista cómo los objetivos de la Dirección General (Estratégico) se coordinan mediante planes intermedios (Táctico) y se ejecutan en tiempo real por el equipo en planta (Operacional).
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-xs border border-white/20 p-4 rounded-2xl flex items-center gap-3 self-start lg:self-auto">
            <Layers className="w-8 h-8 text-[#80D518]" />
            <div>
              <span className="text-[10px] uppercase font-bold text-blue-200 tracking-wider block">
                Estructura Organizativa
              </span>
              <span className="text-sm font-black text-white">3 Niveles · 5 Dominios</span>
              <span className="text-[10px] text-emerald-300 block">Dato único sin silos</span>
            </div>
          </div>
        </div>
      </div>

      {/* Matriz 3x5 Interactiva */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-5 overflow-x-auto">
        <div className="min-w-[800px] space-y-4">
          
          {/* Fila 1: NIVEL ESTRATÉGICO */}
          <div className="border border-blue-200 bg-blue-50/30 rounded-2xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[#0067B9]" />
                <h4 className="font-brand font-black text-sm text-[#022853] uppercase tracking-wider">
                  1. Nivel Estratégico (Dirección & Propietarios · Trimestral/Anual)
                </h4>
              </div>
              <button
                onClick={() => onNavigateLevel('estrategico')}
                className="text-xs font-bold text-[#0067B9] hover:underline flex items-center gap-1"
              >
                <span>Ver Nivel Estratégico Completo</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-5 gap-3 text-xs">
              
              {/* Financiero */}
              <div className="bg-white p-3 rounded-xl border border-slate-200 space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Finanzas</span>
                <span className="font-black text-[#022853] text-sm block">EBITDA {strategicMetrics.ebitdaMargenPct}%</span>
                <p className="text-[10px] text-slate-500">{strategicMetrics.ebitdaEstimado.toLocaleString('es-ES')} € netos</p>
              </div>

              {/* Sala & Clientes */}
              <div className="bg-white p-3 rounded-xl border border-slate-200 space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Sala & Clientes</span>
                <span className="font-black text-[#022853] text-sm block">RevPASH {strategicMetrics.revPash} €</span>
                <p className="text-[10px] text-slate-500">Ticket medio {strategicMetrics.ticketMedioGlobal} €</p>
              </div>

              {/* Personal & RRHH */}
              <div className="bg-white p-3 rounded-xl border border-slate-200 space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Personal</span>
                <span className="font-black text-[#022853] text-sm block">Labor Cost {strategicMetrics.laborCostRatio}%</span>
                <p className="text-[10px] text-slate-500">En rango óptimo sector</p>
              </div>

              {/* Cocina & Compras */}
              <div className="bg-white p-3 rounded-xl border border-slate-200 space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Cocina & Compras</span>
                <span className="font-black text-[#022853] text-sm block">F&B Cost {strategicMetrics.foodBeverageCostRatio}%</span>
                <p className="text-[10px] text-slate-500">Objetivo &lt; 30% cumplido</p>
              </div>

              {/* IA & Automatización */}
              <div className="bg-white p-3 rounded-xl border border-slate-200 space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Automatización IA</span>
                <span className="font-black text-emerald-700 text-sm block">+{strategicMetrics.retornoInversionIAMensual} €/mes</span>
                <p className="text-[10px] text-slate-500">Ahorro neto amortizado</p>
              </div>
            </div>
          </div>

          {/* Fila 2: NIVEL TÁCTICO */}
          <div className="border border-amber-200 bg-amber-50/30 rounded-2xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-amber-500" />
                <h4 className="font-brand font-black text-sm text-[#022853] uppercase tracking-wider">
                  2. Nivel Táctico (Gerencia & Jefes de Departamento · Semanal/Mensual)
                </h4>
              </div>
              <button
                onClick={() => onNavigateLevel('tactico')}
                className="text-xs font-bold text-amber-800 hover:underline flex items-center gap-1"
              >
                <span>Ver Nivel Táctico Completo</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-5 gap-3 text-xs">
              
              {/* Financiero */}
              <div className="bg-white p-3 rounded-xl border border-slate-200 space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Finanzas</span>
                <span className="font-black text-[#022853] text-sm block">2 Locales</span>
                <p className="text-[10px] text-slate-500">Centro 66% vs Retiro 64%</p>
              </div>

              {/* Sala & Clientes */}
              <div className="bg-white p-3 rounded-xl border border-slate-200 space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Sala & Clientes</span>
                <span className="font-black text-[#022853] text-sm block">4.7% No-Show</span>
                <p className="text-[10px] text-slate-500">88.1% tasa confirmación</p>
              </div>

              {/* Personal & RRHH */}
              <div className="bg-white p-3 rounded-xl border border-slate-200 space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Personal</span>
                <span className="font-black text-amber-800 text-sm block">+{tacticalMetrics.desviacionHorasGlobal}h Desviación</span>
                <p className="text-[10px] text-slate-500">Sobrecoste {tacticalMetrics.costeHorasExtraEstimado} €</p>
              </div>

              {/* Cocina & Compras */}
              <div className="bg-white p-3 rounded-xl border border-slate-200 space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Cocina & Compras</span>
                <span className="font-black text-amber-800 text-sm block">{tacticalMetrics.materiaPrimaAlertasCount} Escandallos</span>
                <p className="text-[10px] text-slate-500">Subida vacuno +14,2%</p>
              </div>

              {/* IA & Automatización */}
              <div className="bg-white p-3 rounded-xl border border-slate-200 space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Automatización IA</span>
                <span className="font-black text-emerald-700 text-sm block">{tacticalMetrics.precisionOcrPct}% OCR Acierto</span>
                <p className="text-[10px] text-slate-500">18 pendientes revisión</p>
              </div>
            </div>
          </div>

          {/* Fila 3: NIVEL OPERACIONAL */}
          <div className="border border-emerald-200 bg-emerald-50/30 rounded-2xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[#48A222]" />
                <h4 className="font-brand font-black text-sm text-[#022853] uppercase tracking-wider">
                  3. Nivel Operacional (Jefes de Turno & Sala/Cocina · En Vivo / Hoy)
                </h4>
              </div>
              <button
                onClick={() => onNavigateLevel('operacional')}
                className="text-xs font-bold text-emerald-800 hover:underline flex items-center gap-1"
              >
                <span>Ver Nivel Operacional Completo</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-5 gap-3 text-xs">
              
              {/* Financiero */}
              <div className="bg-white p-3 rounded-xl border border-slate-200 space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Finanzas</span>
                <span className="font-black text-[#022853] text-sm block">{operationalMetrics.operativaTerminalPwa.ticketsEscaneadosHoyCaja} Tickets Hoy</span>
                <p className="text-[10px] text-slate-500">Gastos menores de caja</p>
              </div>

              {/* Sala & Clientes */}
              <div className="bg-white p-3 rounded-xl border border-slate-200 space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Sala & Clientes</span>
                <span className="font-black text-[#022853] text-sm block">{operationalMetrics.servicioHoy.comensalesSentadosHoy} Sentados</span>
                <p className="text-[10px] text-slate-500">{operationalMetrics.servicioHoy.ocupacionSalasActualPct}% de capacidad</p>
              </div>

              {/* Personal & RRHH */}
              <div className="bg-white p-3 rounded-xl border border-slate-200 space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Personal</span>
                <span className="font-black text-[#022853] text-sm block">{operationalMetrics.personalTurnoActual.empleadosEnTurnoAhora} Presentes</span>
                <p className="text-[10px] text-slate-500">{operationalMetrics.personalTurnoActual.llegadasTardeHoy} llegadas tarde hoy</p>
              </div>

              {/* Cocina & Compras */}
              <div className="bg-white p-3 rounded-xl border border-slate-200 space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Cocina & Compras</span>
                <span className="font-black text-emerald-700 text-sm block">15 kg Merluza</span>
                <p className="text-[10px] text-slate-500">Sugerencia del día lista</p>
              </div>

              {/* IA & Automatización */}
              <div className="bg-white p-3 rounded-xl border border-slate-200 space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Automatización IA</span>
                <span className="font-black text-purple-700 text-sm block">{operationalMetrics.llamadasVozHoy.reservasAutomaticasHoy} Reservas Voz</span>
                <p className="text-[10px] text-slate-500">{operationalMetrics.operativaTerminalPwa.itemsEnColaLocal} cola local PWA</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
