import React, { useState } from 'react';
import {
  RolePerspective,
  StrategicKPIs,
  EconomicMetrics,
  ReservationMetrics,
  StaffMetrics,
  TacticalKPIs,
  OperationalKPIs,
  CockpitAlert,
} from '../../types/cockpit';
import {
  ROLE_PERSONAS_CONFIG,
  INITIAL_STRATEGIC_METRICS,
  INITIAL_ECONOMIC_METRICS,
  INITIAL_RESERVATION_METRICS,
  INITIAL_STAFF_METRICS,
  INITIAL_TACTICAL_METRICS,
  INITIAL_OPERATIONAL_METRICS,
  INITIAL_COCKPIT_ALERTS,
} from '../../services/cockpitData';
import { OwnerStrategicPerspective } from './OwnerStrategicPerspective';
import { ChefKitchenPerspective } from './ChefKitchenPerspective';
import { MaitreFloorPerspective } from './MaitreFloorPerspective';
import {
  Crown,
  ChefHat,
  ConciergeBell,
  Sparkles,
  HelpCircle,
  TrendingUp,
  Flame,
  Users,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  ArrowRight,
} from 'lucide-react';
import { PositionalHelpBeacon } from '../help/PositionalHelpBeacon';

export interface RoleDashboardProps {
  initialRole?: RolePerspective;
  selectedRole?: RolePerspective;
  onRoleChange?: (role: RolePerspective) => void;
  strategicMetrics?: StrategicKPIs;
  economicMetrics?: EconomicMetrics;
  reservationMetrics?: ReservationMetrics;
  staffMetrics?: StaffMetrics;
  tacticalMetrics?: TacticalKPIs;
  operationalMetrics?: OperationalKPIs;
  alerts?: CockpitAlert[];
  onActionClick?: (alert: CockpitAlert) => void;
}

export const RoleDashboard: React.FC<RoleDashboardProps> = ({
  initialRole = 'dueno',
  selectedRole,
  onRoleChange,
  strategicMetrics = INITIAL_STRATEGIC_METRICS,
  economicMetrics = INITIAL_ECONOMIC_METRICS,
  reservationMetrics = INITIAL_RESERVATION_METRICS,
  staffMetrics = INITIAL_STAFF_METRICS,
  tacticalMetrics = INITIAL_TACTICAL_METRICS,
  operationalMetrics = INITIAL_OPERATIONAL_METRICS,
  alerts = INITIAL_COCKPIT_ALERTS,
  onActionClick,
}) => {
  const [internalRole, setInternalRole] = useState<RolePerspective>(initialRole);
  const activeRole = selectedRole || internalRole;

  const handleRoleSelect = (role: RolePerspective) => {
    setInternalRole(role);
    if (onRoleChange) {
      onRoleChange(role);
    }
  };

  const handleActionClick = (alert: CockpitAlert) => {
    if (onActionClick) {
      onActionClick(alert);
    }
  };

  // Define the core personas focused on the hospitality experience
  const personas = [
    {
      id: 'dueno' as RolePerspective,
      name: 'Restaurant Owner',
      labelEs: 'Dueño / Empresario',
      sub: 'Estratégico · Rentabilidad, EBITDA & P&L',
      icon: Crown,
      badge: 'C-Level / Inversor',
      theme: {
        activeTab: 'bg-[#022853] text-white border-[#022853] shadow-md ring-2 ring-[#0067B9]/30',
        accentBg: 'bg-blue-50 text-[#022853] border-blue-200',
        badgeColor: 'bg-[#80D518] text-[#022853]',
        pillBg: 'bg-blue-50 text-blue-800',
      },
      stats: [
        { label: 'Health Score', value: `${strategicMetrics.healthScore}/100`, hint: 'Excelente solvencia' },
        { label: 'Margen EBITDA', value: `${strategicMetrics.ebitdaMargenPct}%`, hint: '16.119 € est.' },
        { label: 'Labor Cost', value: `${strategicMetrics.laborCostRatio}%`, hint: 'En rango óptimo (<35%)' },
        { label: 'Runway Caja', value: `${strategicMetrics.runwayCajaDias} Días`, hint: 'Tesorería asegurada' },
      ],
    },
    {
      id: 'cocinero' as RolePerspective,
      name: 'Chef Ejecutivo',
      labelEs: 'Jefe de Cocina / Chef',
      sub: 'Táctico-Operativo · Producción, Escandallos & Alérgenos',
      icon: ChefHat,
      badge: 'Cocina & Pase',
      theme: {
        activeTab: 'bg-amber-800 text-white border-amber-800 shadow-md ring-2 ring-amber-500/30',
        accentBg: 'bg-amber-50 text-amber-950 border-amber-200',
        badgeColor: 'bg-amber-300 text-amber-950',
        pillBg: 'bg-amber-50 text-amber-800',
      },
      stats: [
        { label: 'Previsión Pax Hoy', value: '161 Pax', hint: '124 comida · 37 cena' },
        { label: 'Alérgenos Críticos', value: '7 Mesas', hint: '3 celíacos · 2 marisco' },
        { label: 'Alerta Escandallo', value: '3 Platos', hint: 'Solomillo & Lubina' },
        { label: 'Mise en Place', value: '88% Listo', hint: 'Pase preparado' },
      ],
    },
    {
      id: 'jefe_sala' as RolePerspective,
      name: 'Waitstaff / Maître',
      labelEs: 'Jefe de Sala & Camareros',
      sub: 'Operacional en Vivo · Ocupación, Rangos & Servicio',
      icon: ConciergeBell,
      badge: 'Sala & Clientes',
      theme: {
        activeTab: 'bg-purple-900 text-white border-purple-900 shadow-md ring-2 ring-purple-500/30',
        accentBg: 'bg-purple-50 text-purple-950 border-purple-200',
        badgeColor: 'bg-purple-300 text-purple-950',
        pillBg: 'bg-purple-50 text-purple-800',
      },
      stats: [
        { label: 'Ocupación en Vivo', value: `${reservationMetrics.ocupacionEstimadaPct}%`, hint: '18 mesas activas' },
        { label: 'Riesgo Lluvia Terraza', value: '65% (15:00)', hint: 'Plan B Salón Interior' },
        { label: 'Fianzas Grupos', value: '2 Pendientes', hint: '8 comensales a confirmar' },
        { label: 'Camareros en Turno', value: '4 en Servicio', hint: '100% puntualidad' },
      ],
    },
  ];

  const currentPersonaConfig = ROLE_PERSONAS_CONFIG[activeRole] || ROLE_PERSONAS_CONFIG.dueno;
  const currentPersona = personas.find((p) => p.id === activeRole) || personas[0];

  return (
    <div className="space-y-6 animate-in fade-in duration-200" data-testid="role-dashboard">
      
      {/* ========================================================= */}
      {/* 1. CABECERA DEL ROLE DASHBOARD & SELECTOR DE PERSONA      */}
      {/* ========================================================= */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-xs space-y-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#80D518]" />
              <h2 className="text-xl font-black font-brand text-[#022853]">
                RoleDashboard: Información Adaptada por Rol
              </h2>
              <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#0067B9] text-white">
                Persona Views
              </span>
              <PositionalHelpBeacon
                id="role_dashboard_beacon"
                category="Vistas por Puesto"
                title="Información Adaptada a tu Puesto"
                content="Muestra la información exacta que necesitas para tu trabajo: el Dueño ve rentabilidad y caja; el Jefe de Cocina ve costes de platos y alérgenos; y el Encargado de Sala ve mesas y servicio de terraza."
                keyPoints={[
                  'Dueño: beneficio del día, coste de personal y dinero disponible',
                  'Jefe de Cocina: comensales previstos hoy, alérgenos y coste de ingredientes',
                  'Camareros y Sala: mesas ocupadas, reservas con fianza y previsión del tiempo',
                ]}
              />
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Organización cognitiva diseñada para resolver exactamente las preguntas diarias de cada perfil hostelero sin ruido ni sobrecarga informativa.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-bold text-slate-600 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200 self-start md:self-auto">
            <Sparkles className="w-4 h-4 text-[#80D518]" />
            <span>Persona Activa: <strong className="text-[#022853]">{currentPersona.name}</strong></span>
          </div>
        </div>

        {/* Botones de Selección de Persona (Restaurant Owner, Chef, Waitstaff) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {personas.map((persona) => {
            const Icon = persona.icon;
            const isSelected = activeRole === persona.id;

            return (
              <button
                key={persona.id}
                onClick={() => handleRoleSelect(persona.id)}
                className={`touch-target-min text-left p-4 rounded-2xl border transition-all duration-200 relative flex flex-col justify-between ${
                  isSelected
                    ? persona.theme.activeTab
                    : 'bg-slate-50/80 hover:bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                }`}
                aria-pressed={isSelected}
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                        isSelected
                          ? 'bg-white/20 text-white'
                          : 'bg-white text-[#0067B9] shadow-2xs border border-slate-200'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="font-brand font-black text-sm block leading-tight">
                        {persona.name}
                      </span>
                      <span className={`text-[11px] block truncate font-medium ${isSelected ? 'text-white/80' : 'text-slate-500'}`}>
                        {persona.labelEs}
                      </span>
                    </div>
                  </div>

                  <span
                    className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full shrink-0 ${
                      isSelected ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
                    }`}
                  >
                    {persona.badge}
                  </span>
                </div>

                <p className={`text-[11px] line-clamp-2 mt-1 leading-snug ${isSelected ? 'text-white/90' : 'text-slate-600'}`}>
                  {persona.sub}
                </p>

                {isSelected && (
                  <div className="mt-3 pt-2 border-t border-white/20 flex items-center justify-between text-[10px] font-bold text-white/90">
                    <span>Vista Activa</span>
                    <span className="flex items-center gap-1">
                      Mapeado <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Barra de KPIs Clave Rápidos de la Persona Seleccionada */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 pt-1">
          {currentPersona.stats.map((stat, idx) => (
            <div
              key={idx}
              className="bg-slate-50/80 border border-slate-200/80 rounded-2xl p-3 flex flex-col justify-between"
            >
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-500">
                {stat.label}
              </span>
              <div className="my-1">
                <span className="text-lg font-black font-brand text-[#022853]">
                  {stat.value}
                </span>
              </div>
              <span className="text-[10px] text-slate-500 truncate">
                {stat.hint}
              </span>
            </div>
          ))}
        </div>

        {/* Preguntas Diarias Clave que Responde este Dashboard de Rol */}
        <div className="bg-slate-50 rounded-2xl p-3.5 border border-slate-200 text-xs text-slate-700 space-y-2">
          <div className="flex items-center gap-1.5 text-[#022853] font-bold text-xs">
            <HelpCircle className="w-4 h-4 text-[#0067B9]" />
            <span>Preguntas Clave que responde la vista de {currentPersona.name}:</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-1.5">
            {currentPersonaConfig.primaryQuestions.map((q, qIdx) => (
              <div key={qIdx} className="flex items-start gap-2 bg-white p-2 rounded-xl border border-slate-200 text-[11px]">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#48A222] shrink-0 mt-0.5" />
                <span className="text-slate-800">{q}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 2. MAPEO DINÁMICO DE LA VISTA SEGÚN LA PERSONA HOSTELERA  */}
      {/* ========================================================= */}
      <div className="space-y-6" data-testid="role-mapped-view">
        {/* Persona 1: Restaurant Owner (Dueño / Empresario) */}
        {activeRole === 'dueno' && (
          <div className="animate-in fade-in duration-200">
            <OwnerStrategicPerspective
              strategicMetrics={strategicMetrics}
              economicMetrics={economicMetrics}
              strategicAlerts={alerts.filter((a) => a.level === 'estrategico')}
              onActionClick={handleActionClick}
            />
          </div>
        )}

        {/* Persona 2: Chef Ejecutivo (Jefe de Cocina) */}
        {activeRole === 'cocinero' && (
          <div className="animate-in fade-in duration-200">
            <ChefKitchenPerspective />
          </div>
        )}

        {/* Persona 3: Waitstaff / Jefe de Sala (Sala & Camareros) */}
        {activeRole === 'jefe_sala' && (
          <div className="animate-in fade-in duration-200">
            <MaitreFloorPerspective reservationMetrics={reservationMetrics} />
          </div>
        )}
      </div>

    </div>
  );
};
