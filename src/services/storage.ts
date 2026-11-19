import {
  AttendancePunch,
  ExpenseTicket,
  Reservation,
  EmployeeShift,
  SyncQueueItem,
  SyncConflict,
  BrandConfig,
  AgentInteraction,
} from '../types';

const STORAGE_KEYS = {
  PUNCHES: 'confia360_punches',
  EXPENSES: 'confia360_expenses',
  RESERVATIONS: 'confia360_reservations',
  SHIFTS: 'confia360_shifts',
  SYNC_QUEUE: 'confia360_sync_queue',
  SYNC_CONFLICTS: 'confia360_sync_conflicts',
  AGENT_INTERACTIONS: 'confia360_agent_interactions',
  BRAND_CONFIG: 'confia360_brand_config',
  OFFLINE_MODE_SIMULATION: 'confia360_offline_simulation',
};

// Default Brand Config following Asexia Brand Guide
export const DEFAULT_BRAND_CONFIG: BrandConfig = {
  appName: 'AsexIA Confia360',
  tagline: 'Tu negocio más seguro, digital y eficiente',
  venueName: 'Restaurante & Gastrobar Puerta del Sol',
  primaryColor: '#022853', // Asexia Navy
  accentColor: '#0067B9', // Asexia Blue
  successColor: '#48A222', // Asexia Green
  limeColor: '#80D518', // Asexia Lime
  goldColor: '#D6A52A', // Asexia Gold
  highContrast: false,
  fontScale: 1.0,
  soundFeedback: true,
  hapticFeedback: true,
};

// Initial Seed Data for MVP
const SEED_PUNCHES: AttendancePunch[] = [
  {
    id: 'punch-1',
    employeeId: 'emp-101',
    employeeName: 'Carlos Ruiz',
    type: 'entrada',
    timestamp: new Date(Date.now() - 4 * 3600 * 1000).toISOString(),
    gpsCoords: { lat: 40.4168, lng: -3.7038 },
    venueDistanceMeters: 28,
    isWithinRadius: true,
    venueName: 'Restaurante Puerta del Sol',
    syncStatus: 'synced',
    notes: 'Entrada puntual turno de mañana',
  },
  {
    id: 'punch-2',
    employeeId: 'emp-102',
    employeeName: 'Elena Morales',
    type: 'entrada',
    timestamp: new Date(Date.now() - 3.5 * 3600 * 1000).toISOString(),
    gpsCoords: { lat: 40.4169, lng: -3.7039 },
    venueDistanceMeters: 35,
    isWithinRadius: true,
    venueName: 'Restaurante Puerta del Sol',
    syncStatus: 'synced',
  },
];

const SEED_EXPENSES: ExpenseTicket[] = [
  {
    id: 'exp-101',
    providerName: 'Distribuciones Cárnicas Sierra S.L.',
    documentType: 'factura',
    invoiceNumber: 'FAC-2026-9021',
    date: '2026-10-09',
    dueDate: '2026-11-09',
    taxBase: 380.0,
    vatRate: 10,
    vatAmount: 38.0,
    totalAmount: 418.0,
    category: 'Materia Prima / Perecederos',
    suggestedCategory: 'Materia Prima / Perecederos',
    status: 'en_disputa',
    syncStatus: 'synced',
    linkedVenue: 'Restaurante Puerta del Sol (Centro)',
    paymentMethod: 'Transferencia a 30 días',
    hasEscandalloImpact: true,
    auditAlert: '⚠️ Subida de Precio No Pactada (+15.5% en Solomillo): El margen del plato "Solomillo al Foie" cae del 72% al 67%. Existen 2 proveedores alternativos con menor precio.',
    productLines: [
      {
        id: 'prod-line-1',
        productName: 'Solomillo de Ternera Extra (Añojo)',
        category: 'Carnes Rojas',
        quantity: 12,
        unit: 'kg',
        unitPrice: 26.0,
        previousPrice: 22.5,
        priceVariationPct: 15.56,
        total: 312.0,
        linkedEscandalloId: 'esc-solomillo-foie',
        linkedDishName: 'Solomillo al Foie con Reducción de Pedro Ximénez',
        dishCostImpact: 1.4,
        dishMarginImpact: { beforePct: 72.0, afterPct: 67.0 },
        priceTrend: 'subida',
        alert: 'Alarma de Margen: Caída de 5 puntos en plato estrella. Se recomienda reclamar o ajustar PVP sugerido a 30,50 €.',
        alternativeSuppliers: [
          {
            name: 'Carnes del Guadarrama S.A.',
            price: 23.8,
            priceDiffPct: -8.46,
            available: true,
            contact: '+34 91 854 22 10',
          },
          {
            name: 'Horeca Norte Cárnicos',
            price: 24.1,
            priceDiffPct: -7.31,
            available: true,
            contact: '+34 91 662 11 00',
          },
        ],
      },
      {
        id: 'prod-line-2',
        productName: 'Entrecot de Vaca Madurada (30 días)',
        category: 'Carnes Rojas',
        quantity: 4,
        unit: 'kg',
        unitPrice: 17.0,
        previousPrice: 16.5,
        priceVariationPct: 3.03,
        total: 68.0,
        linkedEscandalloId: 'esc-entrecot-parrilla',
        linkedDishName: 'Entrecot a la Brasa con Patatas Rústicas',
        dishCostImpact: 0.25,
        dishMarginImpact: { beforePct: 69.5, afterPct: 68.8 },
        priceTrend: 'estable',
        alternativeSuppliers: [
          {
            name: 'Carnes del Guadarrama S.A.',
            price: 16.8,
            priceDiffPct: -1.18,
            available: true,
          },
        ],
      },
    ],
    createdBy: 'Mario Gómez (Jefe de Cocina)',
    createdAt: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
  },
  {
    id: 'exp-102',
    providerName: 'Frutas y Verduras La Huerta Mayor S.L.',
    documentType: 'albaran',
    invoiceNumber: 'ALB-2026-4412',
    date: '2026-10-11',
    dueDate: '2026-10-25',
    taxBase: 145.2,
    vatRate: 10,
    vatAmount: 14.52,
    totalAmount: 159.72,
    category: 'Materia Prima / Perecederos',
    suggestedCategory: 'Materia Prima / Perecederos',
    status: 'pendiente_aprobacion',
    syncStatus: 'synced',
    linkedVenue: 'Restaurante Puerta del Sol (Centro)',
    paymentMethod: 'Giro Domiciliado',
    hasEscandalloImpact: true,
    productLines: [
      {
        id: 'prod-line-3',
        productName: 'Tomate Rosa de Barbastro',
        category: 'Verduras & Frescos',
        quantity: 20,
        unit: 'kg',
        unitPrice: 3.2,
        previousPrice: 3.2,
        priceVariationPct: 0.0,
        total: 64.0,
        linkedEscandalloId: 'esc-ensalada-tomate',
        linkedDishName: 'Ensalada de Tomate Rosa y Ventresca del Cantábrico',
        dishCostImpact: 0.0,
        dishMarginImpact: { beforePct: 76.5, afterPct: 76.5 },
        priceTrend: 'estable',
        alternativeSuppliers: [
          {
            name: 'Mercamadrid Distribución Verde',
            price: 3.35,
            priceDiffPct: 4.69,
            available: true,
          },
        ],
      },
      {
        id: 'prod-line-4',
        productName: 'Aceite de Oliva Virgen Extra 5L (AOVE)',
        category: 'Aceites & Condimentos',
        quantity: 2,
        unit: 'garrafa',
        unitPrice: 40.6,
        previousPrice: 38.0,
        priceVariationPct: 6.84,
        total: 81.2,
        linkedEscandalloId: 'esc-base-cocina',
        linkedDishName: 'Uso Transversal en 14 Platos de Cocina',
        dishCostImpact: 0.12,
        dishMarginImpact: { beforePct: 71.0, afterPct: 70.4 },
        priceTrend: 'subida',
        alternativeSuppliers: [
          {
            name: 'Cooperativa Oleícola Sur',
            price: 37.5,
            priceDiffPct: -7.64,
            available: true,
          },
        ],
      },
    ],
    createdBy: 'Julián Ramos (Recepcionista Cocina)',
    createdAt: new Date(Date.now() - 6 * 3600 * 1000).toISOString(),
  },
  {
    id: 'exp-103',
    providerName: 'Iberdrola Clientes S.A.',
    documentType: 'factura',
    invoiceNumber: 'IBER-OCT-2026',
    date: '2026-10-10',
    dueDate: '2026-10-31',
    taxBase: 412.5,
    vatRate: 21,
    vatAmount: 86.63,
    totalAmount: 499.13,
    category: 'Suministros (Luz/Gas/Agua)',
    suggestedCategory: 'Suministros (Luz/Gas/Agua)',
    status: 'pendiente_revision',
    syncStatus: 'pending_offline',
    linkedVenue: 'Restaurante Puerta del Sol (Centro)',
    paymentMethod: 'Domiciliación Bancaria',
    hasEscandalloImpact: false,
    auditAlert: '⚠️ Alerta Agente Económico: Factura de electricidad recurrente con importe idéntico a factura del mes anterior. Comprobar lectura real del contador.',
    createdBy: 'Laura Sanz (Gerente)',
    createdAt: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
  },
];

const SEED_RESERVATIONS: Reservation[] = [
  {
    id: 'res-301',
    customerName: 'Javier Domínguez',
    phone: '+34 622 114 889',
    guests: 4,
    date: '2026-10-10',
    time: '21:30',
    tableNumber: 'Mesa 12 (Terraza)',
    notes: '1 persona celíaca',
    status: 'confirmed',
    channel: 'voice_agent_24_7',
    syncStatus: 'synced',
    createdAt: new Date(Date.now() - 5 * 3600 * 1000).toISOString(),
  },
  {
    id: 'res-302',
    customerName: 'Beatriz Navarro',
    phone: '+34 688 901 223',
    guests: 6,
    date: '2026-10-11',
    time: '14:30',
    tableNumber: 'Mesa 4 (Interior)',
    notes: 'Cumpleaños familiar con carrito de bebé',
    status: 'confirmed',
    channel: 'voice_agent_24_7',
    syncStatus: 'synced',
    createdAt: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
  },
];

const SEED_SHIFTS: EmployeeShift[] = [
  {
    id: 'shift-1',
    employeeId: 'emp-101',
    employeeName: 'Carlos Ruiz',
    role: 'Camarero / Sala',
    date: '2026-10-11',
    startTime: '10:00',
    endTime: '16:30',
    venueName: 'Restaurante Puerta del Sol',
    status: 'pending_confirmation',
    vacationDaysLeft: 14,
  },
  {
    id: 'shift-2',
    employeeId: 'emp-102',
    employeeName: 'Elena Morales',
    role: 'Jefa de Rango / Sala',
    date: '2026-10-11',
    startTime: '13:00',
    endTime: '21:30',
    venueName: 'Restaurante Puerta del Sol',
    status: 'confirmed',
    vacationDaysLeft: 18,
  },
  {
    id: 'shift-3',
    employeeId: 'emp-103',
    employeeName: 'Mario Gómez',
    role: 'Jefe de Cocina',
    date: '2026-10-11',
    startTime: '11:00',
    endTime: '17:00',
    venueName: 'Restaurante Puerta del Sol',
    status: 'confirmed',
    vacationDaysLeft: 11,
  },
];

const SEED_SYNC_QUEUE: SyncQueueItem[] = [
  {
    id: 'queue-101',
    module: 'gastos',
    action: 'CREATE_EXPENSE_TICKET',
    data: { id: 'exp-102', provider: 'Iberdrola', amount: 499.13 },
    status: 'pending_offline',
    timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    retryCount: 1,
  },
  {
    id: 'queue-102',
    module: 'fichaje',
    action: 'REGISTER_PUNCH_OFFLINE',
    data: { employee: 'Carlos Ruiz', type: 'entrada', coords: [40.4168, -3.7038] },
    status: 'pending_offline',
    timestamp: new Date(Date.now() - 8 * 60 * 1000).toISOString(),
    retryCount: 0,
  },
];

// Helper to safely read and write JSON to localStorage
export const LocalDB = {
  getBrandConfig(): BrandConfig {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.BRAND_CONFIG);
      if (!saved) return DEFAULT_BRAND_CONFIG;
      const merged = { ...DEFAULT_BRAND_CONFIG, ...JSON.parse(saved) };
      if (['ConfiA360', 'ConfIA360', 'Confía360', 'Confia360'].includes(merged.appName)) {
        merged.appName = DEFAULT_BRAND_CONFIG.appName;
      }
      return merged;
    } catch {
      return DEFAULT_BRAND_CONFIG;
    }
  },

  saveBrandConfig(config: BrandConfig) {
    try {
      localStorage.setItem(STORAGE_KEYS.BRAND_CONFIG, JSON.stringify(config));
    } catch (e) {
      console.warn('Storage error:', e);
    }
  },

  getPunches(): AttendancePunch[] {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PUNCHES);
      return saved ? JSON.parse(saved) : SEED_PUNCHES;
    } catch {
      return SEED_PUNCHES;
    }
  },

  savePunches(punches: AttendancePunch[]) {
    try {
      localStorage.setItem(STORAGE_KEYS.PUNCHES, JSON.stringify(punches));
    } catch (e) {
      console.warn('Storage error:', e);
    }
  },

  getExpenses(): ExpenseTicket[] {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.EXPENSES);
      return saved ? JSON.parse(saved) : SEED_EXPENSES;
    } catch {
      return SEED_EXPENSES;
    }
  },

  saveExpenses(expenses: ExpenseTicket[]) {
    try {
      localStorage.setItem(STORAGE_KEYS.EXPENSES, JSON.stringify(expenses));
    } catch (e) {
      console.warn('Storage error:', e);
    }
  },

  getReservations(): Reservation[] {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.RESERVATIONS);
      return saved ? JSON.parse(saved) : SEED_RESERVATIONS;
    } catch {
      return SEED_RESERVATIONS;
    }
  },

  saveReservations(reservations: Reservation[]) {
    try {
      localStorage.setItem(STORAGE_KEYS.RESERVATIONS, JSON.stringify(reservations));
    } catch (e) {
      console.warn('Storage error:', e);
    }
  },

  getShifts(): EmployeeShift[] {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SHIFTS);
      return saved ? JSON.parse(saved) : SEED_SHIFTS;
    } catch {
      return SEED_SHIFTS;
    }
  },

  saveShifts(shifts: EmployeeShift[]) {
    try {
      localStorage.setItem(STORAGE_KEYS.SHIFTS, JSON.stringify(shifts));
    } catch (e) {
      console.warn('Storage error:', e);
    }
  },

  getSyncQueue(): SyncQueueItem[] {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SYNC_QUEUE);
      return saved ? JSON.parse(saved) : SEED_SYNC_QUEUE;
    } catch {
      return SEED_SYNC_QUEUE;
    }
  },

  saveSyncQueue(queue: SyncQueueItem[]) {
    try {
      localStorage.setItem(STORAGE_KEYS.SYNC_QUEUE, JSON.stringify(queue));
    } catch (e) {
      console.warn('Storage error:', e);
    }
  },

  getSyncConflicts(): SyncConflict[] {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SYNC_CONFLICTS);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  },

  saveSyncConflicts(conflicts: SyncConflict[]) {
    try {
      localStorage.setItem(STORAGE_KEYS.SYNC_CONFLICTS, JSON.stringify(conflicts));
    } catch (e) {
      console.warn('Storage error:', e);
    }
  },

  getAgentInteractions(): AgentInteraction[] {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.AGENT_INTERACTIONS);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  },

  saveAgentInteractions(interactions: AgentInteraction[]) {
    try {
      localStorage.setItem(STORAGE_KEYS.AGENT_INTERACTIONS, JSON.stringify(interactions));
    } catch (e) {
      console.warn('Storage error:', e);
    }
  },
};
