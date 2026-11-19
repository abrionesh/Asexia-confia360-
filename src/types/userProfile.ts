import { BusinessSector } from './modules';

export type UserRole =
  | 'autonomo_gerente'
  | 'comercial'
  | 'administracion'
  | 'gestoria'
  | 'operaciones_sector';

export interface UserRoleDefinition {
  id: UserRole;
  title: string;
  badge: string;
  shortDesc: string;
  description?: string;
  primaryFocus: string;
  color: string;
  accentBg: string;
  textColor: string;
  borderColor: string;
  iconName: string;
}

export interface BusinessIdentity {
  ownerName: string;
  ownerTitle: string;
  avatarInitials: string;
  cifNif: string;
  companyName: string;
  legalName?: string;
  tradeName: string;
  iaeEpigrafe: string;
  epigrafeIAE?: string;
  taxAddress: string;
  fiscalAddress?: string;
  postalCodeCity?: string;
  regime: string;
  verifactuStatus: 'certificado' | 'en_regla' | 'pruebas';
  assignedGestoria: string;
  gestoriaName?: string;
  gestoriaContact: string;
  gestorContact?: string;
  digitalCertificate?: string;
  digitalCertExpiry: string;
  certificateExpiry?: string;
  contactEmail: string;
  contactPhone: string;
  employeeCount: number;
  activitySector: BusinessSector;
  bankAccountIban: string;
  iban?: string;
  vatPeriod: 'trimestral' | 'mensual';
}

export const USER_ROLES: UserRoleDefinition[] = [
  {
    id: 'autonomo_gerente',
    title: 'Autónomo / Gerente',
    badge: 'Dirección 360º',
    shortDesc: 'Ventas, cobros pendientes, previsión fiscal, rentabilidad y alertas',
    primaryFocus: 'Supervisión integral de negocio, caja y toma de decisiones',
    color: 'emerald',
    accentBg: 'bg-emerald-500/15 text-emerald-300',
    textColor: 'text-emerald-400',
    borderColor: 'border-emerald-400/40',
    iconName: 'Crown',
  },
  {
    id: 'comercial',
    title: 'Responsable Comercial',
    badge: 'Pipeline & Clientes',
    shortDesc: 'Pipeline, presupuestos, clientes, conversión y actividad comercial',
    primaryFocus: 'Captación, cierre de ventas y fidelización de cuentas',
    color: 'blue',
    accentBg: 'bg-blue-500/15 text-blue-300',
    textColor: 'text-blue-400',
    borderColor: 'border-blue-400/40',
    iconName: 'TrendingUp',
  },
  {
    id: 'administracion',
    title: 'Administración',
    badge: 'Facturación & Caja',
    shortDesc: 'Facturas, vencimientos, conciliación bancaria, libros y documentos',
    primaryFocus: 'Control diario de cobros, pagos a proveedores y justificación',
    color: 'purple',
    accentBg: 'bg-purple-500/15 text-purple-300',
    textColor: 'text-purple-400',
    borderColor: 'border-purple-400/40',
    iconName: 'FileSpreadsheet',
  },
  {
    id: 'gestoria',
    title: 'Gestoría / Asesor',
    badge: 'Fiscal & Auditor',
    shortDesc: 'Cierre fiscal, inconsistencias, libros registro, modelos e incidencias',
    primaryFocus: 'Auditoría preventiva, modelos 303/130/111 y cuadre tributario',
    color: 'amber',
    accentBg: 'bg-amber-500/15 text-amber-300',
    textColor: 'text-amber-400',
    borderColor: 'border-amber-400/40',
    iconName: 'ShieldCheck',
  },
  {
    id: 'operaciones_sector',
    title: 'Responsable de Sector',
    badge: 'Operativa Diaria',
    shortDesc: 'KPIs operativos: reservas de sala, comandas, citas, stock y turnos',
    primaryFocus: 'Ejecución del servicio en sala, cocina, atención y personal',
    color: 'rose',
    accentBg: 'bg-rose-500/15 text-rose-300',
    textColor: 'text-rose-400',
    borderColor: 'border-rose-400/40',
    iconName: 'UtensilsCrossed',
  },
];

export const DEFAULT_BUSINESS_IDENTITY: BusinessIdentity = {
  ownerName: 'Carlos Méndez Gómez',
  ownerTitle: 'Gerente y Administrador Único',
  avatarInitials: 'CM',
  cifNif: 'B-87654321',
  companyName: 'Mesón El Roble & Gastro S.L.',
  legalName: 'Mesón El Roble & Gastro S.L.',
  tradeName: 'Mesón El Roble 360',
  iaeEpigrafe: '671.4 - Restaurantes de Dos Tenedores',
  epigrafeIAE: '671.4 - Restaurantes de Dos Tenedores',
  taxAddress: 'Calle Mayor 42, 28013 Madrid (España)',
  fiscalAddress: 'Calle Mayor 42',
  postalCodeCity: '28013 Madrid',
  regime: 'Estimación Directa Simplificada · IVA General (10% restauración / 21%)',
  verifactuStatus: 'certificado',
  assignedGestoria: 'MUNDOCONFIA Asesoría & Gestoría Digital Integrada',
  gestoriaName: 'MUNDOCONFIA Asesoría & Gestoría Digital Integrada',
  gestoriaContact: 'Raquel Sánchez (Colegiada nº 4.891)',
  gestorContact: 'Raquel Sánchez (Colegiada nº 4.891)',
  digitalCertificate: 'Certificado FNMT Activo',
  digitalCertExpiry: '18/12/2027 (FNMT-RCM con autofirma activa)',
  certificateExpiry: '18/12/2027',
  contactEmail: 'gerencia@mesonelroble.es',
  contactPhone: '+34 912 345 678 / +34 654 321 098',
  employeeCount: 12,
  activitySector: 'hosteleria',
  bankAccountIban: 'ES76 0049 1500 0512 3456 7890 (Santander Empresas)',
  iban: 'ES76 0049 1500 0512 3456 7890',
  vatPeriod: 'trimestral',
};
