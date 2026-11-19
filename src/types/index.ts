export type SyncStatus = 'synced' | 'syncing' | 'pending_offline' | 'conflict';

export interface SyncQueueItem {
  id: string;
  module: 'fichaje' | 'gastos' | 'reservas' | 'turnos';
  action: string;
  data: any;
  status: SyncStatus;
  timestamp: string;
  retryCount: number;
  errorMessage?: string;
}

export interface SyncConflict {
  id: string;
  queueItemId: string;
  module: string;
  localData: any;
  serverData: any;
  reason: string;
  timestamp: string;
  resolved: boolean;
}

export interface AttendancePunch {
  id: string;
  employeeId: string;
  employeeName: string;
  type: 'entrada' | 'salida' | 'pausa';
  timestamp: string;
  gpsCoords: { lat: number; lng: number };
  venueDistanceMeters: number;
  isWithinRadius: boolean;
  venueName: string;
  syncStatus: SyncStatus;
  notes?: string;
}

export type DocumentType = 'factura' | 'albaran' | 'ticket_simplificado' | 'factura_rectificativa';

export type InvoiceStatus =
  | 'borrador'
  | 'pendiente_revision'
  | 'pendiente_aprobacion'
  | 'aprobada'
  | 'contabilizada'
  | 'pagada'
  | 'en_disputa'
  | 'rechazada'
  | 'draft'
  | 'pending_approval'
  | 'approved'
  | 'rejected';

export interface AlternativeSupplier {
  name: string;
  price: number;
  priceDiffPct: number;
  available: boolean;
  contact?: string;
}

export interface LinkedEntityRef {
  id: string;
  type: 'proveedor' | 'centro' | 'producto' | 'escandallo' | 'tesoreria' | 'empleado_turno';
  name: string;
  role: string;
  statusBadge?: string;
  impactSummary?: string;
  targetView?: 'operativa' | 'cockpit' | 'director';
  targetTab?: string;
}

export interface InvoiceProductLine {
  id: string;
  productName: string;
  category: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  previousPrice?: number;
  priceVariationPct?: number; // Ej: +15.5%
  total: number;
  linkedEscandalloId?: string;
  linkedDishName?: string;
  dishCostImpact?: number; // Coste adicional por ración
  dishMarginImpact?: { beforePct: number; afterPct: number }; // 72% -> 67%
  alternativeSuppliers?: AlternativeSupplier[];
  priceTrend?: 'subida' | 'estable' | 'bajada';
  alert?: string;
  isNewProductCreated?: boolean;
}

export interface ExpenseTicket {
  id: string;
  providerName: string;
  documentType?: DocumentType;
  invoiceNumber: string;
  date: string;
  dueDate?: string;
  taxBase: number;
  vatRate: number;
  vatAmount: number;
  totalAmount: number;
  category: string;
  suggestedCategory: string;
  imageUrl?: string;
  status: InvoiceStatus;
  syncStatus: SyncStatus;
  auditAlert?: string | null;
  productLines?: InvoiceProductLine[];
  linkedVenue?: string;
  paymentMethod?: string;
  hasEscandalloImpact?: boolean;
  linkedEntities?: LinkedEntityRef[];
  isProVersionEnabled?: boolean;
  notes?: string;
  createdBy: string;
  createdAt: string;
}

export interface Reservation {
  id: string;
  customerName: string;
  phone: string;
  guests: number;
  date: string;
  time: string;
  tableNumber?: string;
  notes?: string;
  status: 'confirmed' | 'waitlist' | 'cancelled';
  channel: 'voice_agent_24_7' | 'manual' | 'online_web';
  syncStatus: SyncStatus;
  createdAt: string;
}

export interface EmployeeShift {
  id: string;
  employeeId: string;
  employeeName: string;
  role: string;
  date: string;
  startTime: string;
  endTime: string;
  venueName: string;
  status: 'pending_confirmation' | 'confirmed' | 'swapped';
  vacationDaysLeft: number;
}

export interface AgentInteraction {
  id: string;
  agentType: 'voice_reservations' | 'chat_shifts' | 'economic';
  interactionData: string;
  userId: string;
  moduleRef: 'reservations' | 'shifts' | 'expenses';
  entityId?: string;
  status: 'pending_human_review' | 'completed' | 'failed';
  updatedAt: string;
}

export interface BrandConfig {
  appName: string;
  tagline: string;
  venueName: string;
  primaryColor: string; // Asexia Navy #022853
  accentColor: string; // Asexia Blue #0067B9
  successColor: string; // Asexia Green #48A222
  limeColor: string; // Asexia Lime #80D518
  goldColor: string; // Asexia Gold #D6A52A
  highContrast: boolean;
  fontScale: number; // 1.0, 1.25, 1.5, 2.0 (WCAG dynamic font scaling)
  soundFeedback: boolean;
  hapticFeedback: boolean;
}
