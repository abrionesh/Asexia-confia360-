export type TimePeriod = 'hoy' | 'semana' | 'mes' | 'trimestre' | 'ano' | 'personalizado';

export type ComparisonType =
  | 'ninguna'
  | 'periodo_anterior'
  | 'ano_anterior'
  | 'objetivo'
  | 'presupuesto';

export type UserRole =
  | 'superadmin'
  | 'admin_empresa'
  | 'gerente'
  | 'responsable_sala'
  | 'responsable_personal'
  | 'administracion'
  | 'contabilidad'
  | 'empleado'
  | 'auditor';

export type InformationLevel = 'estrategico' | 'tactico' | 'operacional' | 'matriz';

export type InformationDomain = 'todos' | 'financiero' | 'operaciones' | 'personal' | 'cocina_compras' | 'ia_documental';

export type RolePerspective = 'dueno' | 'cocinero' | 'jefe_sala' | 'gerente' | 'administracion';

export interface RolePersonaInfo {
  id: RolePerspective;
  title: string;
  subtitle: string;
  badge: string;
  priorityLevel: InformationLevel;
  primaryQuestions: string[];
  recommendedDomains: InformationDomain[];
}

export type AlertSeverity = 'red' | 'yellow' | 'blue'; // Red (Crítica), Yellow (Operativa), Blue (Oportunidad)

export interface CockpitAlert {
  id: string;
  severity: AlertSeverity;
  level: 'estrategico' | 'tactico' | 'operacional';
  title: string;
  description: string;
  originEntity: string;
  originId: string;
  module: 'finanzas' | 'sala' | 'personal' | 'compras' | 'documental' | 'marketing';
  actionLabel: string;
  financialImpact?: string;
  createdAt: string;
}

export interface StrategicKPIs {
  healthScore: number; // 0 - 100
  ebitdaEstimado: number;
  ebitdaMargenPct: number;
  laborCostRatio: number;
  foodBeverageCostRatio: number;
  ticketMedioGlobal: number;
  revPash: number;
  cumplimientoPresupuestoIngresos: number;
  cumplimientoPresupuestoGastos: number;
  retornoInversionIAMensual: number;
  runwayCajaDias: number;
  retencionClientesPct: number;
}

export interface VenueTacticalSummary {
  venueId: string;
  venueName: string;
  ingresos: number;
  gastos: number;
  margenPct: number;
  ocupacionPct: number;
  personalPlanificadoHoras: number;
  personalHorasReales: number;
  desviacionHoras: number;
  ticketsSinIva: number;
}

export interface TacticalKPIs {
  venues: VenueTacticalSummary[];
  materiaPrimaAlertasCount: number;
  desviacionHorasGlobal: number;
  costeHorasExtraEstimado: number;
  conversionAgenteVozPct: number;
  tasaNoShowsPct: number;
  precisionOcrPct: number;
  documentosEnRevision: number;
  proveedoresConSubidaPrecios: number;
}

export interface OperationalKPIs {
  servicioHoy: {
    reservasTotalesHoy: number;
    comensalesSentadosHoy: number;
    comensalesPendientesHoy: number;
    ocupacionSalasActualPct: number;
    mesasEnEspera: number;
    reservasRiesgoClima: number;
  };
  personalTurnoActual: {
    empleadosEnTurnoAhora: number;
    empleadosPlanificadosTurno: number;
    llegadasTardeHoy: number;
    turnosSinCubrirHoy: number;
    fichajesPendientesValidar: number;
    fichajesCorrectosPct: number;
  };
  operativaTerminalPwa: {
    itemsEnColaLocal: number;
    dispositivosConectados: number;
    ticketsEscaneadosHoyCaja: number;
    ticketsEnValidacionInmediata: number;
  };
  llamadasVozHoy: {
    llamadasHoy: number;
    reservasAutomaticasHoy: number;
    derivadasHumanoHoy: number;
  };
}

export interface EconomicMetrics {
  ingresos: number;
  ingresosVarPct: number;
  gastosAprobados: number;
  gastosVarPct: number;
  baseImponible: number;
  ivaSoportado: number;
  resultadoBruto: number;
  resultadoVarPct: number;
  cajaPrevista30d: number;
  gastosPendientes: number;
  gastosConfirmados: number;
  gastosPendientesSync: number;
}

export interface ReservationMetrics {
  creadas: number;
  confirmadas: number;
  pendientes: number;
  sentadas: number;
  noShows: number;
  canceladas: number;
  totalPax: number;
  tasaConfirmacionPct: number;
  tasaNoShowPct: number;
  ocupacionEstimadaPct: number;
  conversionVozPct: number;
  canales: { canal: string; reservas: number; pct: number }[];
}

export interface VoiceAIMetrics {
  llamadasRecibidas: number;
  llamadasCompletadas: number;
  llamadasCompletadasPct: number;
  transferidasHumano: number;
  transferidasHumanoPct: number;
  fallidas: number;
  duracionMediaSegundos: number;
  reservasCreadasVoz: number;
  revisionesPendientes: number;
  intencionFrecuente: string;
}

export interface StaffMetrics {
  empleadosActivos: number;
  turnosPublicados: number;
  turnosSinCubrir: number;
  horasPlanificadas: number;
  horasFichadas: number;
  desviacionHoras: number;
  fichajesCorrectosPct: number;
  fichajesPendientes: number;
  fichajesPendientesSync: number;
  llegadasTarde: number;
  pausasExcedidas: number;
  ausenciasPendientes: number;
  costePersonalSobreVentasPct: number;
}

export interface DocumentalMetrics {
  documentosCapturados: number;
  pendientesOCR: number;
  ocrFallidos: number;
  pendientesRevision: number;
  pendientesAprobacion: number;
  aprobados: number;
  archivosSinSincronizar: number;
  duplicadosPotenciales: number;
  ticketsSinIva: number;
}

export interface RosettaNode {
  id: string;
  type: 'kpi' | 'factura' | 'ingrediente' | 'inventario' | 'escandallo' | 'plato' | 'campana' | 'reserva' | 'cliente';
  title: string;
  subtitle: string;
  details: Record<string, string | number>;
  nextNodes: string[];
}
