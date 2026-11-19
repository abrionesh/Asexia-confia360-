import { EntityHubType } from '../services/dataModel360';

export type ModuleCategory = 'dia_a_dia' | 'sectorial' | 'gestion' | 'herramientas';

export type BusinessSector = 'hosteleria' | 'clinicas' | 'comercio' | 'servicios';

export type ModuleStatus = 'activo' | 'disponible' | 'proximamente';

export interface ConfiaModule {
  id: string;
  name: string;
  subtitle: string;
  description: string;
  category: ModuleCategory;
  sector?: BusinessSector;
  status: ModuleStatus;
  isCoreUniversal?: boolean;
  iconName: string;
  colorScheme: 'navy' | 'emerald' | 'amber' | 'blue' | 'purple' | 'rose' | 'slate';
  badgeCount?: number;
  badgeText?: string;
  badgeType?: 'warning' | 'info' | 'success' | 'neutral';
  targetView?: 'inicio' | 'operativa' | 'cockpit' | 'director' | 'reputacion';
  targetOperativaTab?: 'fichaje' | 'gastos' | 'reservas_voz' | 'rrhh_turnos' | 'economico_alertas' | 'monitor_sync';
  targetDirectorTab?: 'ux_ui_wireframes' | 'project_plan_agile' | 'software_architecture';
  drawerHub?: EntityHubType;
  isDefaultPinned?: boolean;
}

export interface QuickDailyAction {
  id: string;
  title: string;
  iconName: string;
  colorScheme: 'navy' | 'emerald' | 'amber' | 'blue' | 'purple';
  badge?: string | number;
  badgeColor?: string;
  isPinned: boolean;
  onClickAction: () => void;
}
