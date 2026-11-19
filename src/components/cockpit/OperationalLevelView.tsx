import React from 'react';
import {
  OperationalKPIs,
  ReservationMetrics,
  StaffMetrics,
  CockpitAlert,
  InformationDomain,
} from '../../types/cockpit';
import {
  Activity,
  Users,
  Utensils,
  Database,
  PhoneCall,
  Clock,
  AlertTriangle,
  CheckCircle,
  Wifi,
  Sparkles,
  ArrowRight,
} from 'lucide-react';

interface OperationalLevelViewProps {
  operationalMetrics: OperationalKPIs;
  reservationMetrics: ReservationMetrics;
  staffMetrics: StaffMetrics;
  alerts: CockpitAlert[];
  selectedDomain: InformationDomain;
  onActionClick: (alert: CockpitAlert) => void;
}

export const OperationalLevelView: React.FC<OperationalLevelViewProps> = ({
  operationalMetrics,
  reservationMetrics,
  staffMetrics,
  alerts,
  selectedDomain,
  onActionClick,
}) => {
  const { servicioHoy, personalTurnoActual, operativaTerminalPwa, llamadasVozHoy } = operationalMetrics;
  const operationalAlerts = alerts.filter(
    (a) => a.level === 'operacional' || a.severity === 'red'
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      
      {/* Banner de Nivel Operacional */}
      <div className="bg-gradient-to-r from-emerald-800 via-teal-900 to-[#022853] text-white rounded-3xl p-6 sm:p-7 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#80D518] text-[#022853]">
                Nivel Operacional · Tiempo Real
              </span>
              <span className="text-xs text-emerald-200">Horizonte: Turno Actual & Hoy</span>
            </div>
            <h3 className="text-2xl font-black font-brand">
              Panel de Vuelo en Planta, Servicio en Vivo & Fichajes
            </h3>
            <p className="text-xs text-emerald-100 max-w-2xl leading-relaxed">
              Diseñado para Jefes de Turno, Maîtres y Cocineros: visibilidad inmediata de lo que sucede en planta en este instante: comensales sentados, presencia de plantilla, terminales PWA móviles y llamadas entrantes.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-xs border border-white/20 p-4 rounded-2xl flex items-center gap-4 self-start lg:self-auto">
            <div className="w-3 h-3 rounded-full bg-[#80D518] animate-ping" />
            <div>
              <span className="text-[10px] uppercase font-bold text-emerald-200 tracking-wider block">
                Estado del Servicio
              </span>
              <span className="text-sm font-black text-white">Comidas en Marcha</span>
              <span className="text-[10px] text-emerald-300 block">Último pulso hace 12 segundos</span>
            </div>
          </div>
        </div>
      </div>

      {/* 4 Grandes Tarjetas de Planta Hoy */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* 1. Comensales Sentados Hoy */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Comensales Sentados Hoy
            </span>
            <span className="text-xs font-black px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
              {servicioHoy.ocupacionSalasActualPct}% Salón
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-black font-brand text-[#022853]">
            {servicioHoy.comensalesSentadosHoy} <span className="text-xs font-normal text-slate-500">/ {servicioHoy.reservasTotalesHoy} pax</span>
          </div>
          <div className="flex justify-between text-xs text-slate-500 pt-1 border-t border-slate-100">
            <span>Pendientes de llegada:</span>
            <strong className="text-[#0067B9]">{servicioHoy.comensalesPendientesHoy} pax</strong>
          </div>
        </div>

        {/* 2. Personal en Turno Ahora */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Personal en Turno
            </span>
            <span className="text-xs font-black px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
              {personalTurnoActual.empleadosEnTurnoAhora} de {personalTurnoActual.empleadosPlanificadosTurno}
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-black font-brand text-[#0067B9]">
            {personalTurnoActual.empleadosEnTurnoAhora} Presentes
          </div>
          <div className="flex justify-between text-xs text-slate-500 pt-1 border-t border-slate-100">
            <span>Turnos sin cubrir cena:</span>
            <strong className="text-rose-700">{personalTurnoActual.turnosSinCubrirHoy} vacante</strong>
          </div>
        </div>

        {/* 3. Cola Offline PWA en Terminales */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Terminales PWA en Sala
            </span>
            <span className="text-xs font-black px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
              {operativaTerminalPwa.dispositivosConectados} Activos
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-black font-brand text-[#48A222]">
            {operativaTerminalPwa.itemsEnColaLocal} En Cola Local
          </div>
          <div className="flex justify-between text-xs text-slate-500 pt-1 border-t border-slate-100">
            <span>Sincronizando en segundo plano:</span>
            <span className="text-emerald-700 font-bold">✓ Cero Bloqueo</span>
          </div>
        </div>

        {/* 4. Llamadas Agente de Voz Hoy */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Llamadas Voz Hoy (IA)
            </span>
            <span className="text-xs font-black px-2 py-0.5 rounded-full bg-purple-100 text-purple-800">
              24/7 Activo
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-black font-brand text-[#022853]">
            {llamadasVozHoy.llamadasHoy} Llamadas
          </div>
          <div className="flex justify-between text-xs text-slate-500 pt-1 border-t border-slate-100">
            <span>Reservas creadas automáticas:</span>
            <strong className="text-emerald-700 font-bold">{llamadasVozHoy.reservasAutomaticasHoy} pax</strong>
          </div>
        </div>
      </div>

      {/* Grid 2 Secciones Operativas: Monitor de Presencia/Fichajes & Tickets de Caja de Hoy */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Presencia en Sala & Puntualidad */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-[#0067B9]" />
              <h4 className="font-brand font-black text-base text-[#022853]">
                Control Horario & Puntualidad del Turno
              </h4>
            </div>
            <span className="text-xs font-bold text-slate-400">Fichaje Cero Toque</span>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs">
              <div>
                <span className="font-bold text-slate-800 block">Fichajes Correctos Geolocalizados</span>
                <span className="text-slate-500">Dentro del radio de 50 metros del local</span>
              </div>
              <span className="font-black text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                {personalTurnoActual.fichajesCorrectosPct}%
              </span>
            </div>

            <div className="flex justify-between items-center p-3 rounded-2xl bg-amber-50/60 border border-amber-200 text-xs">
              <div>
                <span className="font-bold text-amber-900 block">Llegadas Tarde Hoy</span>
                <span className="text-slate-500">Elena Gómez (18 min) y Marcos Sanz (12 min)</span>
              </div>
              <span className="font-black text-amber-800 bg-amber-100 px-2.5 py-1 rounded-full">
                {personalTurnoActual.llegadasTardeHoy} Retrasos
              </span>
            </div>

            <div className="flex justify-between items-center p-3 rounded-2xl bg-rose-50/60 border border-rose-200 text-xs">
              <div>
                <span className="font-bold text-rose-900 block">Fichajes Pendientes de Validación Legal</span>
                <span className="text-slate-500">Conflicto de fichaje duplicado por resolver</span>
              </div>
              <span className="font-black text-rose-800 bg-rose-100 px-2.5 py-1 rounded-full">
                {personalTurnoActual.fichajesPendientesValidar}
              </span>
            </div>
          </div>
        </div>

        {/* Tickets Rápidos de Gasto en Caja & OCR Intradía */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <Database className="w-5 h-5 text-emerald-600" />
              <h4 className="font-brand font-black text-base text-[#022853]">
                Gastos Menores de Caja (Tickets de Hoy)
              </h4>
            </div>
            <span className="text-xs font-bold text-slate-400">OCR 3 Pasos</span>
          </div>

          <div className="space-y-3">
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1 text-xs">
              <div className="flex justify-between font-bold text-slate-800">
                <span>Compra Urgente de Hielo & Limones (Mercado de la Paz)</span>
                <span className="text-[#022853]">42,50 €</span>
              </div>
              <div className="flex justify-between text-slate-500 text-[11px]">
                <span>Escaneado por David Ramos (10:14h)</span>
                <span className="text-emerald-700 font-bold">✓ OCR Verificado</span>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1 text-xs">
              <div className="flex justify-between font-bold text-slate-800">
                <span>Ferretería: Repuesto Bombilla Terraza</span>
                <span className="text-[#022853]">18,90 €</span>
              </div>
              <div className="flex justify-between text-slate-500 text-[11px]">
                <span>Escaneado por Laura Gil (11:05h)</span>
                <span className="text-blue-700 font-bold">◌ Pendiente de Aprobación</span>
              </div>
            </div>

            <div className="p-2.5 bg-blue-50 rounded-xl border border-blue-200 text-xs text-[#0067B9] flex items-center justify-between">
              <span>{operativaTerminalPwa.ticketsEnValidacionInmediata} tickets pendientes de firma del encargado</span>
              <button className="px-3 py-1 bg-[#0067B9] text-white font-bold rounded-lg hover:bg-blue-700 transition">
                Validar Todo
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Alertas Operacionales Inmediatas */}
      {operationalAlerts.length > 0 && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <AlertTriangle className="w-5 h-5 text-rose-600" />
            <h4 className="font-brand font-black text-base text-[#022853]">
              Alertas Inmediatas de Planta & Turno en Curso
            </h4>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {operationalAlerts.map((alert) => (
              <div
                key={alert.id}
                className="p-4 rounded-2xl border border-rose-200 bg-rose-50/50 flex flex-col justify-between space-y-2"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-rose-900">{alert.title}</span>
                    {alert.financialImpact && (
                      <span className="text-xs font-black text-rose-800 bg-rose-100 px-2 py-0.5 rounded-full">
                        {alert.financialImpact}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-600 mt-1">{alert.description}</p>
                </div>

                <div className="pt-2 border-t border-rose-100 flex justify-end">
                  <button
                    onClick={() => onActionClick(alert)}
                    className="text-xs font-bold text-[#0067B9] hover:underline flex items-center gap-1"
                  >
                    <span>{alert.actionLabel}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
