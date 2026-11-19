import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  INITIAL_ECONOMIC_METRICS,
  INITIAL_RESERVATION_METRICS,
  INITIAL_VOICE_AI_METRICS,
  INITIAL_STAFF_METRICS,
  INITIAL_DOCUMENTAL_METRICS,
  INITIAL_COCKPIT_ALERTS,
  INITIAL_STRATEGIC_METRICS,
  INITIAL_TACTICAL_METRICS,
  INITIAL_OPERATIONAL_METRICS,
  ROLE_PERSONAS_CONFIG,
} from '../../services/cockpitData';
import {
  TimePeriod,
  ComparisonType,
  UserRole,
  CockpitAlert,
  InformationLevel,
  InformationDomain,
  RolePerspective,
} from '../../types/cockpit';
import { VoiceCockpitAssistant } from './VoiceCockpitAssistant';
import { CockpitAlertsEngine } from './CockpitAlertsEngine';
import { EconomicKPIsSection } from './EconomicKPIsSection';
import { ReservationsKPIsSection } from './ReservationsKPIsSection';
import { StaffKPIsSection } from './StaffKPIsSection';
import { VoiceAndDocKPIsSection } from './VoiceAndDocKPIsSection';
import { RosettaGraphExplorer } from './RosettaGraphExplorer';
import { DataExplorerTable } from './DataExplorerTable';
import { RolePerspectiveSelector } from './RolePerspectiveSelector';
import { OwnerStrategicPerspective } from './OwnerStrategicPerspective';
import { ChefKitchenPerspective } from './ChefKitchenPerspective';
import { MaitreFloorPerspective } from './MaitreFloorPerspective';
import { TacticalLevelView } from './TacticalLevelView';
import { OperationalLevelView } from './OperationalLevelView';
import { LevelMatrix360View } from './LevelMatrix360View';
import { RoleDashboard } from './RoleDashboard';
import { PositionalHelpBeacon } from '../help/PositionalHelpBeacon';
import {
  LayoutDashboard,
  Filter,
  RefreshCw,
  Building2,
  Calendar,
  Layers,
  UserCheck,
  GitBranch,
  Database,
  Sliders,
  DollarSign,
  PhoneCall,
  Users,
  AlertTriangle,
  RotateCcw,
  Crown,
  ChefHat,
  ConciergeBell,
  Briefcase,
  FileCheck2,
  Target,
  Clock,
  Sparkles,
} from 'lucide-react';

export const CockpitDashboard: React.FC = () => {
  const { brandConfig, isOnline, triggerManualSync, isSyncingNow, announceAriaLive } = useApp();

  // Filters state per DASH-001
  const [selectedCompany, setSelectedCompany] = useState('Grupo ConfIA360 Gastro');
  const [selectedVenue, setSelectedVenue] = useState('Todos los locales');
  const [selectedPeriod, setSelectedPeriod] = useState<TimePeriod>('mes');
  const [selectedComparison, setSelectedComparison] = useState<ComparisonType>('periodo_anterior');
  const [selectedRole, setSelectedRole] = useState<UserRole>('gerente');

  // Multi-tier organization state
  const [activeLevel, setActiveLevel] = useState<InformationLevel | 'consolidado'>('estrategico');
  const [activeDomain, setActiveDomain] = useState<InformationDomain>('todos');
  const [activeRolePerspective, setActiveRolePerspective] = useState<RolePerspective>('dueno');
  const [activeTab, setActiveTab] = useState<'cockpit' | 'roles' | 'rosetta' | 'explorador'>('cockpit');

  const alerts = INITIAL_COCKPIT_ALERTS;

  const handleAlertAction = (alertItem: CockpitAlert) => {
    announceAriaLive(`Navegando a la entidad origen: ${alertItem.title}`);
    setActiveTab('rosetta');
  };

  const periodLabels: Record<TimePeriod, string> = {
    hoy: 'Hoy (12 Octubre)',
    semana: 'Esta Semana (Semana 41)',
    mes: 'Este Mes (Octubre 2026)',
    trimestre: 'Este Trimestre (Q4 2026)',
    ano: 'Este Año 2026',
    personalizado: 'Periodo Personalizado',
  };

  // Handler when user clicks on a Role lens
  const handleSelectRolePerspective = (role: RolePerspective) => {
    setActiveRolePerspective(role);
    announceAriaLive(`Cambiando a perspectiva de ${ROLE_PERSONAS_CONFIG[role].title}`);

    // Map role to primary level recommendation
    if (role === 'dueno') {
      setActiveLevel('estrategico');
      setSelectedRole('superadmin');
    } else if (role === 'cocinero') {
      setActiveLevel('tactico');
      setActiveDomain('cocina_compras');
    } else if (role === 'jefe_sala') {
      setActiveLevel('operacional');
      setActiveDomain('operaciones');
      setSelectedRole('responsable_sala');
    } else if (role === 'gerente') {
      setActiveLevel('tactico');
      setActiveDomain('todos');
      setSelectedRole('gerente');
    } else if (role === 'administracion') {
      setActiveLevel('estrategico');
      setActiveDomain('financiero');
      setSelectedRole('contabilidad');
    }
  };

  return (
    <div className="space-y-6">
      
      {/* ========================================================= */}
      {/* 1. CABECERA EJECUTIVA Y FILTROS GLOBALES (DASH-001)       */}
      {/* ========================================================= */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-xs space-y-4">
        
        {/* Title bar & Last sync metadata */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#80D518]" />
              <h2 className="text-xl font-black font-brand text-[#022853]">
                Cuadro de Mandos Ejecutivo (Cockpit 360)
              </h2>
              <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#0067B9] text-white">
                DASH-001
              </span>
              <PositionalHelpBeacon
                id="cockpit_intro"
                category="Dirección del Negocio"
                title="Panel de Mando del Restaurante"
                content="Muestra de un vistazo cómo va el día en el restaurante: ventas, gastos y situación en cocina y sala. Cambia de vista con un solo toque para ver solo lo que te interesa."
                keyPoints={[
                  'Para el Dueño: ventas de hoy, coste del personal y beneficio neto',
                  'Para el Jefe de Cocina: coste de los platos, ingredientes y alérgenos',
                  'Para el Jefe de Sala: mesas ocupadas, reservas y previsión meteorológica',
                ]}
              />
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Empresa: <strong>{selectedCompany}</strong> · Local: <strong>{selectedVenue}</strong> · Periodo: <strong>{periodLabels[selectedPeriod]}</strong>
            </p>
          </div>

          {/* Sync status & Last updated time */}
          <div className="flex items-center gap-3 text-xs text-slate-500 self-start md:self-auto">
            <span>Última actualización: <strong>14:32</strong></span>
            <span className="inline-flex items-center gap-1 font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
              <span className="w-2 h-2 rounded-full bg-[#48A222]" />
              <span>Sincronizado</span>
            </span>
            <button
              onClick={triggerManualSync}
              disabled={isSyncingNow || !isOnline}
              className="touch-target-min p-1.5 rounded-lg border hover:bg-slate-50 transition text-slate-700"
              title="Refrescar métricas"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncingNow ? 'animate-sync-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* Global Filter Bar (Selects) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5 text-xs">
          
          {/* Empresa */}
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Empresa</label>
            <select
              value={selectedCompany}
              onChange={(e) => setSelectedCompany(e.target.value)}
              className="w-full px-2.5 py-2 rounded-xl border border-slate-300 bg-white font-semibold text-slate-800"
            >
              <option value="Grupo ConfIA360 Gastro">Grupo ConfIA360 Gastro</option>
              <option value="Asexia Restauración S.L.">Asexia Restauración S.L.</option>
            </select>
          </div>

          {/* Locales */}
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Local</label>
            <select
              value={selectedVenue}
              onChange={(e) => setSelectedVenue(e.target.value)}
              className="w-full px-2.5 py-2 rounded-xl border border-slate-300 bg-white font-semibold text-slate-800"
            >
              <option value="Todos los locales">Todos los locales (Consolidado)</option>
              <option value="Local Centro (Puerta del Sol)">Local Centro (Puerta del Sol)</option>
              <option value="Local Terraza (Retiro)">Local Terraza (Retiro)</option>
            </select>
          </div>

          {/* Periodo */}
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Periodo</label>
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value as TimePeriod)}
              className="w-full px-2.5 py-2 rounded-xl border border-slate-300 bg-white font-semibold text-slate-800"
            >
              <option value="hoy">Hoy</option>
              <option value="semana">Esta Semana</option>
              <option value="mes">Este Mes (Octubre)</option>
              <option value="trimestre">Este Trimestre (Q4)</option>
              <option value="ano">Este Año</option>
              <option value="personalizado">Personalizado</option>
            </select>
          </div>

          {/* Comparar con */}
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Comparar Con</label>
            <select
              value={selectedComparison}
              onChange={(e) => setSelectedComparison(e.target.value as ComparisonType)}
              className="w-full px-2.5 py-2 rounded-xl border border-slate-300 bg-white font-semibold text-slate-800"
            >
              <option value="periodo_anterior">Periodo anterior equivalente</option>
              <option value="ano_anterior">Mismo periodo año anterior</option>
              <option value="objetivo">Objetivo configurado</option>
              <option value="presupuesto">Presupuesto configurado</option>
              <option value="ninguna">Sin comparación</option>
            </select>
          </div>

          {/* Rol de Usuario */}
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Perfil / Rol</label>
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value as UserRole)}
              className="w-full px-2.5 py-2 rounded-xl border border-[#0067B9] bg-blue-50/40 font-bold text-[#022853]"
            >
              <option value="superadmin">Superadmin / Dueño (Consolidado)</option>
              <option value="gerente">Gerente (Operación & Economía)</option>
              <option value="responsable_sala">Responsable de Sala / Maître</option>
              <option value="responsable_personal">Responsable de Personal (Turnos)</option>
              <option value="contabilidad">Contabilidad & Administración</option>
              <option value="auditor">Auditor (Solo Lectura)</option>
            </select>
          </div>
        </div>

        {/* View Switcher Pills */}
        <div className="flex flex-wrap gap-2 pt-1 border-t border-slate-100">
          <button
            onClick={() => setActiveTab('cockpit')}
            className={`touch-target-min px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
              activeTab === 'cockpit'
                ? 'bg-[#0067B9] text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Cabina del Avión (Cockpit Multinivel)</span>
          </button>

          <button
            onClick={() => setActiveTab('roles')}
            className={`touch-target-min px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
              activeTab === 'roles'
                ? 'bg-[#0067B9] text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <Crown className="w-4 h-4 text-[#80D518]" />
            <span>RoleDashboard (Owner · Chef · Waitstaff)</span>
          </button>

          <button
            onClick={() => setActiveTab('rosetta')}
            className={`touch-target-min px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
              activeTab === 'rosetta'
                ? 'bg-[#022853] text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <GitBranch className="w-4 h-4 text-[#80D518]" />
            <span>Navegación 360º de Grafo (Piedra Rosetta)</span>
          </button>

          <button
            onClick={() => setActiveTab('explorador')}
            className={`touch-target-min px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
              activeTab === 'explorador'
                ? 'bg-[#022853] text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <Database className="w-4 h-4 text-[#D6A52A]" />
            <span>Explorador de Datos 360º (Tabular & Export)</span>
          </button>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 2. PERSPECTIVAS POR ROLES ("PENSAR COMO...")               */}
      {/* ========================================================= */}
      {activeTab === 'cockpit' && (
        <RolePerspectiveSelector
          currentRole={activeRolePerspective}
          onSelectRole={handleSelectRolePerspective}
        />
      )}

      {/* ========================================================= */}
      {/* 3. SELECTOR DE NIVEL Y TIPO DE INFORMACIÓN                */}
      {/* ========================================================= */}
      {activeTab === 'cockpit' && (
        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs space-y-4">
          
          {/* EJE 1: NIVEL DE INFORMACIÓN (Estratégico, Táctico, Operacional, Matriz 360) */}
          <div className="space-y-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
              <span className="text-xs font-black uppercase tracking-wider text-[#022853] flex items-center gap-1.5">
                <Target className="w-4 h-4 text-[#0067B9]" />
                <span>Nivel Jerárquico de Información:</span>
              </span>
              <span className="text-[11px] text-slate-400">
                Organizado por horizonte de decisión y audiencia ejecutiva
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
              {[
                {
                  id: 'estrategico',
                  label: 'Estratégico',
                  sub: 'Dueño / C-Level',
                  icon: Crown,
                  activeColor: 'bg-[#022853] text-white border-[#022853]',
                },
                {
                  id: 'tactico',
                  label: 'Táctico',
                  sub: 'Gerencia / Áreas',
                  icon: Briefcase,
                  activeColor: 'bg-[#0067B9] text-white border-[#0067B9]',
                },
                {
                  id: 'operacional',
                  label: 'Operacional',
                  sub: 'Tiempo Real / Hoy',
                  icon: Clock,
                  activeColor: 'bg-[#48A222] text-white border-[#48A222]',
                },
                {
                  id: 'matriz',
                  label: 'Matriz 360º',
                  sub: 'Mapa 3x5 Integral',
                  icon: Layers,
                  activeColor: 'bg-purple-900 text-white border-purple-900',
                },
                {
                  id: 'consolidado',
                  label: 'Consolidado',
                  sub: 'Cuadro Continuo',
                  icon: LayoutDashboard,
                  activeColor: 'bg-slate-800 text-white border-slate-800',
                },
              ].map((lvl) => {
                const Icon = lvl.icon;
                const isSelected = activeLevel === lvl.id;
                return (
                  <button
                    key={lvl.id}
                    onClick={() => setActiveLevel(lvl.id as any)}
                    className={`p-2.5 rounded-2xl border text-left transition flex items-center gap-2.5 ${
                      isSelected
                        ? `${lvl.activeColor} shadow-sm ring-2 ring-blue-500/20`
                        : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                      isSelected ? 'bg-white/20 text-[#80D518]' : 'bg-white text-slate-600 border border-slate-200'
                    }`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="truncate">
                      <span className="font-brand font-black text-xs block truncate leading-tight">
                        {lvl.label}
                      </span>
                      <span className={`text-[10px] block truncate ${isSelected ? 'text-white/80' : 'text-slate-500'}`}>
                        {lvl.sub}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* EJE 2: TIPO / DOMINIO DE INFORMACIÓN (Filtro por Tipo) */}
          <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center gap-1.5 text-xs">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mr-1.5">
              Filtrar por Dominio / Tipo:
            </span>
            {[
              { id: 'todos', label: 'Todos los Dominios' },
              { id: 'financiero', label: '💰 Financiero & Caja' },
              { id: 'operaciones', label: '🍽️ Sala & Ocupación' },
              { id: 'personal', label: '👥 Personal & Horas' },
              { id: 'cocina_compras', label: '🍳 Cocina & Compras F&B' },
              { id: 'ia_documental', label: '🤖 IA & OCR Documental' },
            ].map((d) => (
              <button
                key={d.id}
                onClick={() => setActiveDomain(d.id as any)}
                className={`px-3 py-1.5 rounded-xl font-bold transition ${
                  activeDomain === d.id
                    ? 'bg-[#0067B9] text-white shadow-2xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {d.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 4. ASISTENTE DE VOZ DEL CUADRO DE MANDOS                   */}
      {/* ========================================================= */}
      {activeTab === 'cockpit' && (
        <VoiceCockpitAssistant
          economic={INITIAL_ECONOMIC_METRICS}
          reservations={INITIAL_RESERVATION_METRICS}
          staff={INITIAL_STAFF_METRICS}
          alerts={alerts}
          currentPeriod={periodLabels[selectedPeriod]}
        />
      )}

      {/* ========================================================= */}
      {/* 5. CONTENIDO DEL COCKPIT SEGÚN NIVEL SELECCIONADO         */}
      {/* ========================================================= */}
      {activeTab === 'cockpit' && (
        <div className="space-y-6">
          
          {/* Motor de Alertas Navegables (Metáfora Cabina de Avión) */}
          <CockpitAlertsEngine alerts={alerts} onActionClick={handleAlertAction} />

          {/* Renderizado por Nivel o Rol Especializado */}
          {activeRolePerspective === 'cocinero' && activeLevel === 'tactico' ? (
            <ChefKitchenPerspective />
          ) : activeRolePerspective === 'jefe_sala' && activeLevel === 'operacional' ? (
            <MaitreFloorPerspective reservationMetrics={INITIAL_RESERVATION_METRICS} />
          ) : activeLevel === 'estrategico' ? (
            <OwnerStrategicPerspective
              strategicMetrics={INITIAL_STRATEGIC_METRICS}
              economicMetrics={INITIAL_ECONOMIC_METRICS}
              strategicAlerts={alerts.filter((a) => a.level === 'estrategico')}
              onActionClick={handleAlertAction}
            />
          ) : activeLevel === 'tactico' ? (
            <TacticalLevelView
              tacticalMetrics={INITIAL_TACTICAL_METRICS}
              reservationMetrics={INITIAL_RESERVATION_METRICS}
              staffMetrics={INITIAL_STAFF_METRICS}
              alerts={alerts}
              selectedDomain={activeDomain}
              onActionClick={handleAlertAction}
            />
          ) : activeLevel === 'operacional' ? (
            <OperationalLevelView
              operationalMetrics={INITIAL_OPERATIONAL_METRICS}
              reservationMetrics={INITIAL_RESERVATION_METRICS}
              staffMetrics={INITIAL_STAFF_METRICS}
              alerts={alerts}
              selectedDomain={activeDomain}
              onActionClick={handleAlertAction}
            />
          ) : activeLevel === 'matriz' ? (
            <LevelMatrix360View
              strategicMetrics={INITIAL_STRATEGIC_METRICS}
              tacticalMetrics={INITIAL_TACTICAL_METRICS}
              operationalMetrics={INITIAL_OPERATIONAL_METRICS}
              economicMetrics={INITIAL_ECONOMIC_METRICS}
              reservationMetrics={INITIAL_RESERVATION_METRICS}
              staffMetrics={INITIAL_STAFF_METRICS}
              onNavigateLevel={(lvl) => setActiveLevel(lvl)}
            />
          ) : (
            /* Vista Consolidada Continua */
            <div className="space-y-6">
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-2xl text-xs text-blue-900 font-bold flex items-center justify-between">
                <span>Visualizando Cuadro de Mandos Consolidado Integral (Todas las áreas)</span>
                <span className="text-[10px] bg-white px-2 py-0.5 rounded-full border border-blue-200">
                  DASH-001 Completo
                </span>
              </div>
              <EconomicKPIsSection metrics={INITIAL_ECONOMIC_METRICS} />
              <ReservationsKPIsSection metrics={INITIAL_RESERVATION_METRICS} />
              <StaffKPIsSection metrics={INITIAL_STAFF_METRICS} />
              <VoiceAndDocKPIsSection
                voiceMetrics={INITIAL_VOICE_AI_METRICS}
                docMetrics={INITIAL_DOCUMENTAL_METRICS}
              />
            </div>
          )}
        </div>
      )}

      {/* ========================================================= */}
      {/* 6. ROLEDASHBOARD: VISTAS ADAPTADAS POR PERSONA HOSTELERA  */}
      {/* ========================================================= */}
      {activeTab === 'roles' && (
        <div className="animate-in fade-in duration-150">
          <RoleDashboard
            initialRole={activeRolePerspective}
            selectedRole={activeRolePerspective}
            onRoleChange={(role) => handleSelectRolePerspective(role)}
            strategicMetrics={INITIAL_STRATEGIC_METRICS}
            economicMetrics={INITIAL_ECONOMIC_METRICS}
            reservationMetrics={INITIAL_RESERVATION_METRICS}
            staffMetrics={INITIAL_STAFF_METRICS}
            tacticalMetrics={INITIAL_TACTICAL_METRICS}
            operationalMetrics={INITIAL_OPERATIONAL_METRICS}
            alerts={alerts}
            onActionClick={handleAlertAction}
          />
        </div>
      )}

      {/* ========================================================= */}
      {/* 7. GRAFO DE ROSSETTA Y EXPLORADOR DE DATOS TABULAR         */}
      {/* ========================================================= */}
      {activeTab === 'rosetta' && (
        <div className="animate-in fade-in duration-150">
          <RosettaGraphExplorer />
        </div>
      )}

      {activeTab === 'explorador' && (
        <div className="animate-in fade-in duration-150">
          <DataExplorerTable />
        </div>
      )}
    </div>
  );
};
