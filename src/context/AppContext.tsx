import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import {
  AttendancePunch,
  ExpenseTicket,
  Reservation,
  EmployeeShift,
  SyncQueueItem,
  SyncConflict,
  BrandConfig,
  AgentInteraction,
  OperativaTabId,
  OperativaModuleKPI,
  MonthlyPerformanceSummary,
  OperationalThresholdsConfig,
} from '../types';
import { LocalDB, DEFAULT_BRAND_CONFIG } from '../services/storage';
import { ApiService } from '../services/api';
import { INITIAL_ECONOMIC_METRICS, INITIAL_STRATEGIC_METRICS } from '../services/cockpitData';
import {
  IndexedDbFormsStore,
  IndexedDbFormDraft,
  IndexedDbPendingSubmission,
} from '../services/indexedDbForms';
import { EntityHubType } from '../services/dataModel360';
import { BusinessSector } from '../types/modules';
import { UserRole, BusinessIdentity, DEFAULT_BUSINESS_IDENTITY } from '../types/userProfile';

export interface NavigationState {
  view: 'inicio' | 'operativa' | 'cockpit' | 'director' | 'reputacion';
  operativaTab?: OperativaTabId;
  directorTab?: 'ux_ui_wireframes' | 'project_plan_agile' | 'software_architecture';
  title: string;
}

export const getScreenTitle = (
  view: 'inicio' | 'operativa' | 'cockpit' | 'director' | 'reputacion',
  operativaTab?: OperativaTabId,
  directorTab?: 'ux_ui_wireframes' | 'project_plan_agile' | 'software_architecture'
): string => {
  if (view === 'inicio') return 'Inicio y Catálogo de Módulos AsexIA Confia360';
  if (view === 'reputacion') return 'AsexIA Confia360 Reputación & Calidad';
  if (view === 'cockpit') return 'Cuadro de Mandos del Restaurante';
  if (view === 'director') {
    if (directorTab === 'ux_ui_wireframes') return 'Diseño de Pantallas del Restaurante';
    if (directorTab === 'project_plan_agile') return 'Plan de Proyecto y Tareas';
    return 'Arquitectura del Sistema';
  }
  switch (operativaTab) {
    case 'fichaje': return 'Fichaje del Personal';
    case 'gastos': return 'Control de Facturas y Gastos con Foto';
    case 'reservas_voz': return 'Recepción y Reservas de Mesas 24h';
    case 'rrhh_turnos': return 'Turnos y Horarios del Equipo';
    case 'economico_alertas': return 'Tesorería y Dinero en Caja';
    case 'monitor_sync': return 'Guardado y Sincronización de Datos';
    default: return 'Aplicación del Restaurante';
  }
};

export const getScreenAudioDescription = (
  view: 'inicio' | 'operativa' | 'cockpit' | 'director' | 'reputacion',
  operativaTab?: OperativaTabId,
  directorTab?: 'ux_ui_wireframes' | 'project_plan_agile' | 'software_architecture'
): string => {
  if (view === 'inicio') {
    return 'Estás en el Inicio de AsexIA Confia360. Aquí puedes consultar y gestionar los módulos activos y disponibles para tu negocio, acceder rápidamente a tus tareas del día a día y explorar las soluciones sectoriales.';
  }
  if (view === 'reputacion') {
    return 'Estás en AsexIA Confia360 Reputación. Aquí gestionas la experiencia del comensal, encuestas automáticas de WhatsApp con firewall de quejas, reseñas multicanal de Google y TripAdvisor con respuestas asistidas por inteligencia artificial, y tareas operativas para cocina y sala.';
  }
  if (view === 'cockpit') {
    return 'Estás en el Cuadro de Mandos del Restaurante. Aquí consultas de un vistazo las ventas del día, el coste del personal y el beneficio neto, con pantallas adaptadas para el Dueño, el Jefe de Cocina y el Encargado de Sala.';
  }
  if (view === 'director') {
    return 'Estás en la Suite de Planificación y Arquitectura del Restaurante, con el diseño visual de pantallas y la organización técnica del sistema.';
  }
  switch (operativaTab) {
    case 'fichaje':
      return 'Estás en la pantalla de Fichaje del Personal. Cocineros y camareros registran su entrada, descansos y salida con un solo toque desde el móvil, cumpliendo la ley incluso si no hay cobertura en cocina o bodega.';
    case 'gastos':
      return 'Estás en el Control de Facturas y Gastos. Saca una foto a los albaranes y facturas de tus proveedores de carne, pescado o verdura; el sistema lee los importes y el IVA automáticamente sin tener que teclear nada.';
    case 'reservas_voz':
      return 'Estás en la Recepción de Reservas 24 Horas. Un asistente atiende las llamadas por ti en cualquier momento, anota comensales, alergias alimentarias y solicita fianza a grupos para evitar que te dejen mesas vacías.';
    case 'rrhh_turnos':
      return 'Estás en Turnos y Horarios del Equipo. Organiza los turnos de camareros y cocina de toda la semana y confirma quién entra en cada servicio de comida o cena.';
    case 'economico_alertas':
      return 'Estás en Tesorería y Dinero en Caja. Revisa los cobros, facturas pendientes de proveedores y alertas para que nunca te falte liquidez en el negocio.';
    case 'monitor_sync':
      return 'Estás en Guardado y Sincronización. Muestra las operaciones guardadas en el teléfono pendientes de enviarse cuando vuelva el internet, y te permite elegir qué dato conservar si dos personas modifican lo mismo.';
    default:
      return 'Estás en la aplicación operativa del restaurante.';
  }
};

interface AppContextType {
  // Brand Configuration & Accessibility
  brandConfig: BrandConfig;
  updateBrandConfig: (config: Partial<BrandConfig>) => void;
  toggleHighContrast: () => void;
  setFontScale: (scale: number) => void;

  // Navigation & View Modes
  activeView: 'inicio' | 'operativa' | 'cockpit' | 'director' | 'reputacion';
  setActiveView: (view: 'inicio' | 'operativa' | 'cockpit' | 'director' | 'reputacion') => void;
  activeOperativaTab: OperativaTabId;
  setActiveOperativaTab: (tab: OperativaTabId) => void;
  activeDirectorTab: 'ux_ui_wireframes' | 'project_plan_agile' | 'software_architecture';
  setActiveDirectorTab: (tab: 'ux_ui_wireframes' | 'project_plan_agile' | 'software_architecture') => void;

  // Confia360 Home & Modules State
  activeSector: BusinessSector;
  setActiveSector: (sector: BusinessSector) => void;
  moduleStatusFilter: 'todos' | 'activos' | 'disponibles';
  setModuleStatusFilter: (filter: 'todos' | 'activos' | 'disponibles') => void;
  pinnedDailyActions: string[];
  togglePinDailyAction: (id: string) => void;
  isReportModalOpen: boolean;
  setIsReportModalOpen: (open: boolean) => void;

  // User Profile & Roles (Navegación y Cuadro de Mando por Perfil)
  activeRole: UserRole;
  setActiveRole: (role: UserRole) => void;
  businessIdentity: BusinessIdentity;
  updateBusinessIdentity: (data: Partial<BusinessIdentity>) => void;
  isIdentityModalOpen: boolean;
  setIsIdentityModalOpen: (open: boolean) => void;

  // WhatsApp-like Floating Voice & Text Assistant
  isVoiceAssistantOpen: boolean;
  setIsVoiceAssistantOpen: (open: boolean) => void;
  openVoiceAssistant: () => void;
  closeVoiceAssistant: () => void;

  // History Stack & Retroceso (Back Button)
  navigationHistory: NavigationState[];
  canGoBack: boolean;
  previousNavigationState: NavigationState | null;
  goBack: () => void;
  currentScreenTitle: string;

  // Onboarding & QuickStart Tour
  isTourOpen: boolean;
  setIsTourOpen: (isOpen: boolean) => void;
  initialTourMode: 'tour' | 'voice_agent';
  startTour: (initialMode?: 'tour' | 'voice_agent') => void;
  tourCompletionMessage: string | null;
  showTourCompletionMessage: (msg?: string) => void;
  dismissTourCompletionMessage: () => void;

  // Screen Narration & Audio
  isReadingCurrentScreen: boolean;
  toggleReadCurrentScreen: () => void;
  currentScreenAudioDescription: string;

  // Positional Help & In-Context Tooltips
  isPositionalHelpActive: boolean;
  togglePositionalHelp: () => void;
  setPositionalHelpActive: (active: boolean) => void;

  // Connectivity & Offline First
  isOnline: boolean;
  isSimulatedOffline: boolean;
  toggleSimulatedOffline: () => void;
  ariaLiveMessage: string;
  announceAriaLive: (msg: string) => void;
  dismissAriaLive: () => void;

  // Data & Entities (Unified Single Source of Truth)
  punches: AttendancePunch[];
  expenses: ExpenseTicket[];
  reservations: Reservation[];
  shifts: EmployeeShift[];
  agentInteractions: AgentInteraction[];
  getActiveModuleKPIs: (tab?: OperativaTabId, role?: UserRole) => OperativaModuleKPI[];
  getOperativaModuleKPIs: (tab?: OperativaTabId, role?: UserRole) => OperativaModuleKPI[];
  getAllOperativaModuleKPIs: (role?: UserRole) => Record<OperativaTabId, OperativaModuleKPI[]>;
  currentOperativaKPIs: OperativaModuleKPI[];
  monthlyPerformanceKPIs: MonthlyPerformanceSummary;
  operationalThresholds: OperationalThresholdsConfig;
  updateOperationalThresholds: (updates: Partial<OperationalThresholdsConfig>) => void;

  // Sync Queue & Conflict Resolution
  syncQueue: SyncQueueItem[];
  syncConflicts: SyncConflict[];
  idbDrafts: IndexedDbFormDraft[];
  idbPendingSubmissions: IndexedDbPendingSubmission[];
  pendingSyncCount: number;
  isSyncingNow: boolean;
  triggerManualSync: () => Promise<void>;
  discardIdbDraft: (formId: string) => Promise<void>;
  resolveConflict: (conflictId: string, choice: 'keep_local' | 'accept_server') => void;
  clearResolvedQueue: () => void;
  simulateConflictDemo: () => void;

  // Universal 360 Floating Drawer Navigation (v2.0)
  isDrawer360Open: boolean;
  drawer360Hub: EntityHubType;
  drawer360History: EntityHubType[];
  openDrawer360: (hub?: EntityHubType) => void;
  closeDrawer360: () => void;
  navigateDrawer360: (hub: EntityHubType) => void;
  goBackDrawer360: () => void;
  appVersion: string;

  // Core Actions
  recordPunch: (type: 'entrada' | 'salida' | 'pausa') => Promise<{ success: boolean; message: string; punch: AttendancePunch }>;
  saveExpenseTicket: (expense: Omit<ExpenseTicket, 'id' | 'createdAt' | 'syncStatus'>) => Promise<ExpenseTicket>;
  approveExpenseTicket: (id: string) => void;
  updateExpenseTicket: (id: string, updates: Partial<ExpenseTicket>) => void;
  createReservation: (resData: Omit<Reservation, 'id' | 'createdAt' | 'syncStatus'>) => Promise<Reservation>;
  confirmEmployeeShift: (shiftId: string) => void;
  addAgentInteraction: (interaction: Omit<AgentInteraction, 'id' | 'updatedAt'>) => void;
}

export const DEFAULT_OPERATIONAL_THRESHOLDS: OperationalThresholdsConfig = {
  minGpsCompliancePct: 90,
  minActiveEmployeesPunched: 1,
  maxAuditAlertsAllowed: 0,
  maxPendingExpensesAllowed: 1,
  minOccupancyPct: 20,
  minShiftCoveragePct: 80,
  minAccountingSyncPct: 90,
  maxPendingSyncCount: 0,
  maxUnresolvedConflicts: 0,
  minSalesMonthlyChangePct: 0,
  maxLaborCostRatioPct: 35,
  minNetMarginAfterLaborPct: 65,
};

const AppContext = createContext<AppContextType | null>(null);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Brand Configuration
  const [brandConfig, setBrandConfig] = useState<BrandConfig>(LocalDB.getBrandConfig);
  const [operationalThresholds, setOperationalThresholds] = useState<OperationalThresholdsConfig>(
    DEFAULT_OPERATIONAL_THRESHOLDS
  );

  const updateOperationalThresholds = useCallback((updates: Partial<OperationalThresholdsConfig>) => {
    setOperationalThresholds((prev) => ({ ...prev, ...updates }));
  }, []);

  // Views & Tabs
  const [activeView, setActiveViewInternal] = useState<'inicio' | 'operativa' | 'cockpit' | 'director' | 'reputacion'>('inicio');
  const [activeOperativaTab, setActiveOperativaTabInternal] = useState<OperativaTabId>('fichaje');
  const [activeDirectorTab, setActiveDirectorTabInternal] = useState<'ux_ui_wireframes' | 'project_plan_agile' | 'software_architecture'>('ux_ui_wireframes');
  const [navigationHistory, setNavigationHistory] = useState<NavigationState[]>([]);
  const [isTourOpen, setIsTourOpen] = useState<boolean>(false);
  const [initialTourMode, setInitialTourMode] = useState<'tour' | 'voice_agent'>('tour');
  const [tourCompletionMessage, setTourCompletionMessage] = useState<string | null>(null);
  const [isPositionalHelpActive, setIsPositionalHelpActive] = useState<boolean>(false);
  const [isReadingCurrentScreen, setIsReadingCurrentScreen] = useState<boolean>(false);

  // Confia360 Home & Modules State
  const [activeSector, setActiveSector] = useState<BusinessSector>('hosteleria');
  const [moduleStatusFilter, setModuleStatusFilter] = useState<'todos' | 'activos' | 'disponibles'>('todos');
  const [isReportModalOpen, setIsReportModalOpen] = useState<boolean>(false);
  const [pinnedDailyActions, setPinnedDailyActions] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('confia360_pinned_daily_actions');
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return ['dia_panel', 'dia_capturar', 'dia_gastos', 'dia_ausencias', 'dia_ia'];
  });

  const togglePinDailyAction = useCallback((id: string) => {
    setPinnedDailyActions((prev) => {
      const next = prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id];
      try {
        localStorage.setItem('confia360_pinned_daily_actions', JSON.stringify(next));
      } catch {
        // ignore
      }
      return next;
    });
  }, []);

  // User Profile & Business Identity (Confia360)
  const [activeRole, setActiveRole] = useState<UserRole>(() => {
    try {
      const saved = localStorage.getItem('confia360_active_role');
      if (saved) return saved as UserRole;
    } catch {
      // ignore
    }
    return 'autonomo_gerente';
  });

  const handleSetActiveRole = useCallback((role: UserRole) => {
    setActiveRole(role);
    try {
      localStorage.setItem('confia360_active_role', role);
    } catch {
      // ignore
    }
  }, []);

  const [businessIdentity, setBusinessIdentity] = useState<BusinessIdentity>(() => {
    try {
      const saved = localStorage.getItem('confia360_business_identity');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return DEFAULT_BUSINESS_IDENTITY;
  });

  const updateBusinessIdentity = useCallback((data: Partial<BusinessIdentity>) => {
    setBusinessIdentity((prev) => {
      const updated = { ...prev, ...data };
      try {
        localStorage.setItem('confia360_business_identity', JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });
  }, []);

  const [isIdentityModalOpen, setIsIdentityModalOpen] = useState<boolean>(false);

  // WhatsApp-like Floating Voice & Text Assistant State
  const [isVoiceAssistantOpen, setIsVoiceAssistantOpen] = useState<boolean>(false);
  const openVoiceAssistant = useCallback(() => setIsVoiceAssistantOpen(true), []);
  const closeVoiceAssistant = useCallback(() => setIsVoiceAssistantOpen(false), []);

  // Universal 360 Floating Drawer Navigation (v2.0)
  const [isDrawer360Open, setIsDrawer360Open] = useState<boolean>(false);
  const [drawer360Hub, setDrawer360Hub] = useState<EntityHubType>('albaran');
  const [drawer360History, setDrawer360History] = useState<EntityHubType[]>(['albaran']);

  // Network & Offline Simulation
  const [browserOnline, setBrowserOnline] = useState<boolean>(typeof navigator !== 'undefined' ? navigator.onLine : true);
  const [isSimulatedOffline, setIsSimulatedOffline] = useState<boolean>(false);
  const [ariaLiveMessage, setAriaLiveMessage] = useState<string>('');
  const [isSyncingNow, setIsSyncingNow] = useState<boolean>(false);

  // Entities
  const [punches, setPunches] = useState<AttendancePunch[]>(LocalDB.getPunches);
  const [expenses, setExpenses] = useState<ExpenseTicket[]>(LocalDB.getExpenses);
  const [reservations, setReservations] = useState<Reservation[]>(LocalDB.getReservations);
  const [shifts, setShifts] = useState<EmployeeShift[]>(LocalDB.getShifts);
  const [agentInteractions, setAgentInteractions] = useState<AgentInteraction[]>(LocalDB.getAgentInteractions);

  // Sync Queue & Conflicts
  const [syncQueue, setSyncQueue] = useState<SyncQueueItem[]>(LocalDB.getSyncQueue);
  const [syncConflicts, setSyncConflicts] = useState<SyncConflict[]>(LocalDB.getSyncConflicts);
  const [idbDrafts, setIdbDrafts] = useState<IndexedDbFormDraft[]>([]);
  const [idbPendingSubmissions, setIdbPendingSubmissions] = useState<IndexedDbPendingSubmission[]>([]);
  const flushIdbRef = React.useRef<() => Promise<void>>(async () => {});

  // Effective Online State
  const effectiveOnline = browserOnline && !isSimulatedOffline;

  // ARIA Live helper
  const announceAriaLive = useCallback((message: string) => {
    setAriaLiveMessage(message);
  }, []);

  const dismissAriaLive = useCallback(() => {
    setAriaLiveMessage('');
  }, []);

  // History & Navigation Wrappers
  const currentScreenTitle = getScreenTitle(activeView, activeOperativaTab, activeDirectorTab);
  const currentScreenAudioDescription = getScreenAudioDescription(activeView, activeOperativaTab, activeDirectorTab);

  const startTour = useCallback((mode: 'tour' | 'voice_agent' = 'tour') => {
    setInitialTourMode(mode);
    setIsTourOpen(true);
  }, []);

  const showTourCompletionMessage = useCallback((msg?: string) => {
    setTourCompletionMessage(
      msg || '🎉 ¡Tutorial completado! Tu restaurante ya está listo para operar sin fallos. Toca en cualquier parte de este aviso para quitarlo.'
    );
  }, []);

  const dismissTourCompletionMessage = useCallback(() => {
    setTourCompletionMessage(null);
  }, []);

  // Universal 360 Drawer Navigation Callbacks (v2.0)
  const openDrawer360 = useCallback((hub?: EntityHubType) => {
    const target = hub || 'albaran';
    setDrawer360Hub(target);
    setDrawer360History([target]);
    setIsDrawer360Open(true);
    announceAriaLive(`Cajón transversal 360 abierto para entidad ${target}`);
  }, [announceAriaLive]);

  const closeDrawer360 = useCallback(() => {
    setIsDrawer360Open(false);
  }, []);

  const navigateDrawer360 = useCallback((hub: EntityHubType) => {
    setDrawer360Hub(hub);
    setDrawer360History((prev) => [...prev, hub]);
    announceAriaLive(`Navegando en 360 a ${hub}`);
  }, [announceAriaLive]);

  const goBackDrawer360 = useCallback(() => {
    setDrawer360History((prev) => {
      if (prev.length <= 1) return prev;
      const nextHistory = [...prev];
      nextHistory.pop();
      const prevHub = nextHistory[nextHistory.length - 1];
      setDrawer360Hub(prevHub);
      announceAriaLive(`Retrocediendo en 360 a ${prevHub}`);
      return nextHistory;
    });
  }, [announceAriaLive]);

  // Screen Narration using SpeechSynthesis
  const toggleReadCurrentScreen = useCallback(() => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    if (isReadingCurrentScreen) {
      window.speechSynthesis.cancel();
      setIsReadingCurrentScreen(false);
      announceAriaLive('Lectura de pantalla pausada.');
      return;
    }

    window.speechSynthesis.cancel();
    const textToRead = `${currentScreenTitle}. ${currentScreenAudioDescription}`;
    const utterance = new SpeechSynthesisUtterance(textToRead);
    utterance.lang = 'es-ES';
    utterance.rate = 1.05;
    utterance.pitch = 1.0;

    utterance.onstart = () => {
      setIsReadingCurrentScreen(true);
      announceAriaLive(`Leyendo pantalla: ${currentScreenTitle}`);
    };
    utterance.onend = () => {
      setIsReadingCurrentScreen(false);
    };
    utterance.onerror = () => {
      setIsReadingCurrentScreen(false);
    };

    window.speechSynthesis.speak(utterance);
  }, [isReadingCurrentScreen, currentScreenTitle, currentScreenAudioDescription, announceAriaLive]);

  const togglePositionalHelp = useCallback(() => {
    setIsPositionalHelpActive((prev) => {
      const next = !prev;
      setAriaLiveMessage(
        next
          ? 'Modo de ayuda posicional activado. Pulsa en las balizas interactivas para ver detalles de cada elemento.'
          : 'Modo de ayuda posicional desactivado.'
      );
      return next;
    });
  }, []);

  const pushStateToHistory = useCallback(
    (view: 'inicio' | 'operativa' | 'cockpit' | 'director' | 'reputacion', opTab: any, dirTab: any) => {
      const stateItem: NavigationState = {
        view,
        operativaTab: opTab,
        directorTab: dirTab,
        title: getScreenTitle(view, opTab, dirTab),
      };
      setNavigationHistory((prev) => {
        const last = prev[prev.length - 1];
        if (
          last &&
          last.view === stateItem.view &&
          last.operativaTab === stateItem.operativaTab &&
          last.directorTab === stateItem.directorTab
        ) {
          return prev;
        }
        return [...prev.slice(-20), stateItem];
      });
    },
    []
  );

  const setActiveView = useCallback(
    (view: 'inicio' | 'operativa' | 'cockpit' | 'director' | 'reputacion') => {
      if (view !== activeView) {
        pushStateToHistory(activeView, activeOperativaTab, activeDirectorTab);
        setActiveViewInternal(view);
      }
    },
    [activeView, activeOperativaTab, activeDirectorTab, pushStateToHistory]
  );

  const setActiveOperativaTab = useCallback(
    (tab: OperativaTabId) => {
      if (tab !== activeOperativaTab || activeView !== 'operativa') {
        pushStateToHistory(activeView, activeOperativaTab, activeDirectorTab);
        setActiveViewInternal('operativa');
        setActiveOperativaTabInternal(tab);
      }
    },
    [activeView, activeOperativaTab, activeDirectorTab, pushStateToHistory]
  );

  const setActiveDirectorTab = useCallback(
    (tab: 'ux_ui_wireframes' | 'project_plan_agile' | 'software_architecture') => {
      if (tab !== activeDirectorTab || activeView !== 'director') {
        pushStateToHistory(activeView, activeOperativaTab, activeDirectorTab);
        setActiveViewInternal('director');
        setActiveDirectorTabInternal(tab);
      }
    },
    [activeView, activeOperativaTab, activeDirectorTab, pushStateToHistory]
  );

  const goBack = useCallback(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsReadingCurrentScreen(false);
    }
    setNavigationHistory((prev) => {
      if (prev.length === 0) return prev;
      const targetState = prev[prev.length - 1];
      const newHistory = prev.slice(0, prev.length - 1);

      setActiveViewInternal(targetState.view);
      if (targetState.operativaTab) {
        setActiveOperativaTabInternal(targetState.operativaTab);
      }
      if (targetState.directorTab) {
        setActiveDirectorTabInternal(targetState.directorTab);
      }
      setAriaLiveMessage(`Retrocediendo a ${targetState.title}`);
      return newHistory;
    });
  }, []);

  // Hardware / Browser Back button integration (PWA Friendly)
  useEffect(() => {
    const handlePopState = () => {
      if (navigationHistory.length > 0) {
        goBack();
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [navigationHistory, goBack]);

  const canGoBack = navigationHistory.length > 0;
  const previousNavigationState = navigationHistory.length > 0 ? navigationHistory[navigationHistory.length - 1] : null;

  // Sync storage on change
  useEffect(() => {
    LocalDB.saveBrandConfig(brandConfig);
  }, [brandConfig]);

  useEffect(() => {
    LocalDB.savePunches(punches);
  }, [punches]);

  useEffect(() => {
    LocalDB.saveExpenses(expenses);
  }, [expenses]);

  useEffect(() => {
    LocalDB.saveReservations(reservations);
  }, [reservations]);

  useEffect(() => {
    LocalDB.saveShifts(shifts);
  }, [shifts]);

  useEffect(() => {
    LocalDB.saveSyncQueue(syncQueue);
  }, [syncQueue]);

  useEffect(() => {
    LocalDB.saveSyncConflicts(syncConflicts);
  }, [syncConflicts]);

  // Network Event Listeners
  useEffect(() => {
    const handleOnline = () => {
      setBrowserOnline(true);
      announceAriaLive('Conexión a internet restablecida. Cola de sincronización lista.');
    };
    const handleOffline = () => {
      setBrowserOnline(false);
      announceAriaLive('Modo sin conexión activado. La aplicación continuará funcionando en modo local.');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [announceAriaLive]);

  // Hydrate & subscribe to IndexedDB operational form drafts and pending submissions
  const refreshIdbState = useCallback(async () => {
    const [drafts, pending] = await Promise.all([
      IndexedDbFormsStore.getAllDrafts(),
      IndexedDbFormsStore.getPendingSubmissions(),
    ]);
    setIdbDrafts(drafts);
    setIdbPendingSubmissions(pending);
  }, []);

  useEffect(() => {
    refreshIdbState();
    return IndexedDbFormsStore.subscribe(() => {
      refreshIdbState();
    });
  }, [refreshIdbState]);

  const discardIdbDraft = useCallback(
    async (formId: string) => {
      await IndexedDbFormsStore.deleteDraft(formId);
      await refreshIdbState();
      announceAriaLive('Borrador offline eliminado de IndexedDB.');
    },
    [announceAriaLive, refreshIdbState]
  );

  // Pending count calculation (LocalDB queue + IndexedDB pending submissions)
  const pendingSyncCount =
    syncQueue.filter(item => item.status === 'pending_offline' || item.status === 'syncing').length +
    idbPendingSubmissions.length;

  // Toggle simulated offline
  const toggleSimulatedOffline = () => {
    setIsSimulatedOffline(prev => {
      const next = !prev;
      if (next) {
        announceAriaLive('Simulación offline activada. Los datos se guardarán en la cola local.');
      } else {
        announceAriaLive('Simulación offline desactivada. Listo para sincronizar con el servidor.');
      }
      return next;
    });
  };

  const updateBrandConfig = (partial: Partial<BrandConfig>) => {
    setBrandConfig(prev => ({ ...prev, ...partial }));
  };

  const toggleHighContrast = () => {
    setBrandConfig(prev => ({ ...prev, highContrast: !prev.highContrast }));
  };

  const setFontScale = (scale: number) => {
    setBrandConfig(prev => ({ ...prev, fontScale: scale }));
  };

  // Perform Manual or Automatic Sync
  const triggerManualSync = async () => {
    if (!effectiveOnline) {
      announceAriaLive('No se puede sincronizar mientras el dispositivo esté sin conexión.');
      return;
    }

    setIsSyncingNow(true);
    announceAriaLive('Sincronizando cola de operaciones con la base de datos central...');

    // Mark pending items as syncing
    setSyncQueue(prev =>
      prev.map(item => (item.status === 'pending_offline' ? { ...item, status: 'syncing' } : item))
    );

    await flushIdbRef.current();
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Update statuses to synced
    setSyncQueue(prev =>
      prev.map(item => (item.status === 'syncing' ? { ...item, status: 'synced', retryCount: item.retryCount + 1 } : item))
    );

    // Also update entities
    setPunches(prev => prev.map(p => ({ ...p, syncStatus: 'synced' })));
    setExpenses(prev => prev.map(e => ({ ...e, syncStatus: 'synced' })));
    setReservations(prev => prev.map(r => ({ ...r, syncStatus: 'synced' })));

    setIsSyncingNow(false);
    announceAriaLive('Sincronización completada con éxito. Todos los registros están al día en la central.');
  };

  // Resolve conflict
  const resolveConflict = (conflictId: string, choice: 'keep_local' | 'accept_server') => {
    setSyncConflicts(prev => prev.filter(c => c.id !== conflictId));
    announceAriaLive(`Conflicto resuelto aplicando: ${choice === 'keep_local' ? 'Versión local del dispositivo' : 'Versión central del servidor'}.`);
  };

  const clearResolvedQueue = () => {
    setSyncQueue(prev => prev.filter(item => item.status !== 'synced'));
  };

  // Simulate Conflict Demo
  const simulateConflictDemo = () => {
    const conflictId = `conf-${Date.now()}`;
    const newConflict: SyncConflict = {
      id: conflictId,
      queueItemId: 'queue-demo',
      module: 'reservas',
      localData: { customerName: 'Javier Domínguez', guests: 6, time: '21:30' },
      serverData: { customerName: 'Javier Domínguez (Modificado en central)', guests: 4, time: '21:00' },
      reason: 'El cliente llamó por centralita mientras el camarero actualizaba la mesa offline.',
      timestamp: new Date().toISOString(),
      resolved: false,
    };
    setSyncConflicts(prev => [newConflict, ...prev]);
    announceAriaLive('Atención: Se ha detectado un conflicto de concurrencia en la reserva de Javier Domínguez. Requiere decisión del supervisor.');
  };

  // 1. FICHAJE CERO TOQUE
  const recordPunch = async (type: 'entrada' | 'salida' | 'pausa') => {
    const isOnlineNow = effectiveOnline;
    const punchId = `punch-${Date.now()}`;

    // Haptic feedback if enabled and supported
    if (brandConfig.hapticFeedback && typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate([100, 50, 100]);
      } catch {
        // ignore
      }
    }

    // Mock geolocation check (Restaurante radius: 150m)
    // Realistic GPS simulation within local area
    const venueDistanceMeters = Math.floor(Math.random() * 65) + 10;
    const isWithinRadius = venueDistanceMeters <= 150;

    const newPunch: AttendancePunch = {
      id: punchId,
      employeeId: 'emp-101',
      employeeName: 'Carlos Ruiz',
      type,
      timestamp: new Date().toISOString(),
      gpsCoords: { lat: 40.4168, lng: -3.7038 },
      venueDistanceMeters,
      isWithinRadius,
      venueName: brandConfig.venueName,
      syncStatus: isOnlineNow ? 'synced' : 'pending_offline',
      notes: isWithinRadius ? 'Geolocalización válida en perímetro' : 'Fuera de radio asignado',
    };

    setPunches(prev => [newPunch, ...prev]);

    // If offline, add to Sync Queue
    if (!isOnlineNow) {
      const queueItem: SyncQueueItem = {
        id: `queue-${Date.now()}`,
        module: 'fichaje',
        action: 'REGISTER_PUNCH_OFFLINE',
        data: newPunch,
        status: 'pending_offline',
        timestamp: new Date().toISOString(),
        retryCount: 0,
      };
      setSyncQueue(prev => [queueItem, ...prev]);
      announceAriaLive('Fichaje guardado localmente. Se sincronizará automáticamente cuando recupere conexión.');
    } else {
      announceAriaLive(`Fichaje de ${type} confirmado y sincronizado en tiempo real.`);
    }

    return {
      success: true,
      message: isOnlineNow
        ? `Fichaje de ${type} registrado con éxito y sincronizado.`
        : `Fichaje de ${type} guardado en memoria local (Sin conexión). Sincronización diferida.`,
      punch: newPunch,
    };
  };

  // 2. OCR DE GASTOS EN 3 PASOS
  const saveExpenseTicket = async (expenseData: Omit<ExpenseTicket, 'id' | 'createdAt' | 'syncStatus'>) => {
    const isOnlineNow = effectiveOnline;
    const expId = `exp-${Date.now()}`;

    const newExpense: ExpenseTicket = {
      ...expenseData,
      id: expId,
      createdAt: new Date().toISOString(),
      syncStatus: isOnlineNow ? 'synced' : 'pending_offline',
    };

    setExpenses(prev => [newExpense, ...prev]);

    if (!isOnlineNow) {
      const queueItem: SyncQueueItem = {
        id: `queue-${Date.now()}`,
        module: 'gastos',
        action: 'CREATE_EXPENSE_TICKET',
        data: newExpense,
        status: 'pending_offline',
        timestamp: new Date().toISOString(),
        retryCount: 0,
      };
      setSyncQueue(prev => [queueItem, ...prev]);
      announceAriaLive('Gasto registrado en modo offline. Pendiente de envío al recuperar conexión.');
    } else {
      announceAriaLive('Gasto enviado a aprobación correctamente.');
    }

    return newExpense;
  };

  const approveExpenseTicket = (id: string) => {
    setExpenses(prev =>
      prev.map(e => (e.id === id ? { ...e, status: 'aprobada' as const, syncStatus: effectiveOnline ? 'synced' : 'pending_offline' } : e))
    );
    announceAriaLive('Gasto aprobado y conciliado contablemente.');
  };

  const updateExpenseTicket = (id: string, updates: Partial<ExpenseTicket>) => {
    setExpenses(prev =>
      prev.map(e => (e.id === id ? { ...e, ...updates } : e))
    );
    announceAriaLive('Documento y entidades actualizadas con éxito.');
  };

  // 3. RESERVAS & SALA
  const createReservation = async (resData: Omit<Reservation, 'id' | 'createdAt' | 'syncStatus'>) => {
    const isOnlineNow = effectiveOnline;
    const resId = `res-${Date.now()}`;

    const newRes: Reservation = {
      ...resData,
      id: resId,
      createdAt: new Date().toISOString(),
      syncStatus: isOnlineNow ? 'synced' : 'pending_offline',
    };

    setReservations(prev => [newRes, ...prev]);

    if (!isOnlineNow) {
      const queueItem: SyncQueueItem = {
        id: `queue-${Date.now()}`,
        module: 'reservas',
        action: 'CREATE_RESERVATION',
        data: newRes,
        status: 'pending_offline',
        timestamp: new Date().toISOString(),
        retryCount: 0,
      };
      setSyncQueue(prev => [queueItem, ...prev]);
      announceAriaLive('Reserva registrada en local sin conexión.');
    } else {
      announceAriaLive(`Reserva para ${newRes.guests} comensales confirmada y anotada en la sala.`);
    }

    return newRes;
  };

  // 4. SHIFTS
  const confirmEmployeeShift = (shiftId: string) => {
    setShifts(prev =>
      prev.map(s => (s.id === shiftId ? { ...s, status: 'confirmed' as const } : s))
    );
    announceAriaLive('Turno confirmado por el empleado.');
  };

  // 5. AGENT INTERACTIONS
  const addAgentInteraction = useCallback((interaction: Omit<AgentInteraction, 'id' | 'updatedAt'>) => {
    const newInt: AgentInteraction = {
      ...interaction,
      id: `ai-${Date.now()}`,
      updatedAt: new Date().toISOString(),
    };
    setAgentInteractions(prev => [newInt, ...prev]);
  }, []);

  // Global IndexedDB Pending Flush (runs even if the originating form tab is unmounted)
  const flushAllIdbPending = useCallback(async () => {
    if (!effectiveOnline) return;
    const pending = await IndexedDbFormsStore.getPendingSubmissions<Record<string, any>>();
    for (const item of pending) {
      if (item.status === 'syncing') continue;
      if (!IndexedDbFormsStore.acquireSubmissionLock(item.id)) continue;
      try {
        await IndexedDbFormsStore.updateSubmissionStatus(item.id, 'syncing');
        if (item.formId === 'operativa_gastos_ocr') {
          const d = item.payload;
          await saveExpenseTicket({
            providerName: d.providerName || 'Proveedor sin especificar',
            documentType: d.docType || 'factura',
            invoiceNumber: d.invoiceNumber || 'S/N-PROV',
            date: d.date || new Date().toISOString().split('T')[0],
            dueDate: d.dueDate || '2026-11-15',
            taxBase: Number(d.taxBase || 0),
            vatRate: Number(d.vatRate || 10),
            vatAmount: Number(d.vatAmount || 0),
            totalAmount: Number(d.totalAmount || 0),
            category: d.category || 'Materia Prima / Perecederos',
            suggestedCategory: d.category || 'Materia Prima / Perecederos',
            status: d.invoiceStatus || 'pendiente_aprobacion',
            auditAlert: d.auditAlert ?? null,
            productLines: Array.isArray(d.productLines) ? d.productLines : [],
            hasEscandalloImpact: Array.isArray(d.productLines) && d.productLines.some((p: any) => !!p.linkedDishName),
            linkedVenue: 'Restaurante Puerta del Sol (Centro)',
            paymentMethod: 'Transferencia a 30 días',
            isProVersionEnabled: Boolean(d.isProVersionEnabled),
            createdBy: 'Empleado de Sala / Cocina',
            imageUrl: d.ticketImage || undefined,
          });
        } else if (item.formId === 'operativa_reservas_voz') {
          const data = item.payload?.extractedData;
          if (data?.guests && data?.time && data?.customerName) {
            await createReservation({
              customerName: data.customerName,
              phone: data.phone || '+34 600 000 000',
              guests: Number(data.guests),
              date: data.date || '2026-10-16',
              time: data.time,
              tableNumber: 'Mesa asignada por Sala',
              status: 'confirmed',
              channel: 'voice_agent_24_7',
              notes: 'Sincronizado desde cola offline IndexedDB',
            });
          }
        } else if (item.formId === 'operativa_rrhh_pending_sync') {
          const msg = item.payload?.message;
          if (msg) {
            const response = await ApiService.processHRAssistant({
              message: msg,
              employeeContext: {
                name: 'Carlos Ruiz',
                role: 'Camarero / Sala',
                vacationDaysLeft: Number(item.payload?.vacationDaysSnapshot ?? 14),
                nextShift: {
                  date: 'Mañana (11 de Octubre)',
                  time: '10:00 - 16:30',
                  location: 'Restaurante Puerta del Sol',
                },
              },
            });
            if (response.fromOfflineFallback) {
              throw new Error('Servidor IA no disponible todavía.');
            }
            addAgentInteraction({
              agentType: 'chat_shifts',
              interactionData: JSON.stringify({
                userPrompt: msg,
                response,
                syncedFromIndexedDb: true,
              }),
              userId: 'emp-101',
              moduleRef: 'shifts',
              status: 'completed',
            });
          }
        } else if (item.formId === 'operativa_fichaje_cero_toque') {
          const punchId = item.payload?.punchId;
          const note = item.payload?.note;
          if (punchId) {
            setPunches(prev =>
              prev.map(p =>
                p.id === punchId
                  ? {
                      ...p,
                      syncStatus: 'synced',
                      notes: note ? `${p.notes || 'Fichaje'} · ${note}` : p.notes,
                    }
                  : p
              )
            );
          }
        }
        await IndexedDbFormsStore.updateSubmissionStatus(item.id, 'synced');
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Error sincronizando IndexedDB';
        await IndexedDbFormsStore.updateSubmissionStatus(item.id, 'pending_offline', message);
      } finally {
        IndexedDbFormsStore.releaseSubmissionLock(item.id);
      }
    }
    await refreshIdbState();
  }, [effectiveOnline, addAgentInteraction, refreshIdbState]);

  flushIdbRef.current = flushAllIdbPending;

  useEffect(() => {
    if (effectiveOnline && idbPendingSubmissions.length > 0) {
      flushAllIdbPending();
    }
  }, [effectiveOnline, idbPendingSubmissions.length, flushAllIdbPending]);

  const monthlyPerformanceKPIs = useMemo<MonthlyPerformanceSummary>(() => {
    const parseShiftHours = (startTime: string, endTime: string): number => {
      const [sh, sm] = startTime.split(':').map(Number);
      const [eh, em] = endTime.split(':').map(Number);
      if ([sh, sm, eh, em].some((n) => Number.isNaN(n))) return 6.5;
      let diff = eh * 60 + em - (sh * 60 + sm);
      if (diff <= 0) diff += 24 * 60;
      return diff / 60;
    };

    // 1. Ventas Mensuales (baseline mensual + variación en tiempo real por reservas activas)
    const activeReservations = reservations.filter((r) => r.status !== 'cancelled');
    const activeGuests = activeReservations.reduce((acc, r) => acc + (r.guests || 0), 0);
    const seedGuestsBaseline = 10; // res-301 (4) + res-302 (6)
    const ticketMedio = INITIAL_STRATEGIC_METRICS.ticketMedioGlobal; // 59.66 €
    const liveSalesDelta = (activeGuests - seedGuestsBaseline) * ticketMedio;

    const currentSales = Math.max(0, INITIAL_ECONOMIC_METRICS.ingresos + liveSalesDelta);
    const previousSales = Number(
      (INITIAL_ECONOMIC_METRICS.ingresos / (1 + INITIAL_ECONOMIC_METRICS.ingresosVarPct / 100)).toFixed(2)
    );
    const salesMonthlyChangePct =
      previousSales > 0 ? Number((((currentSales - previousSales) / previousSales) * 100).toFixed(1)) : 0;

    // 2. Coste Laboral Mensual (cuadrante de turnos, fichajes activos y partidas de personal)
    const totalShiftHours = shifts.reduce((acc, s) => acc + parseShiftHours(s.startTime, s.endTime), 0);
    const seedShiftHoursBaseline = 21; // 6.5h + 8.5h + 6h
    const entryPunchesCount = punches.filter((p) => p.type === 'entrada').length;
    const seedPunchesBaseline = 2;
    const extraLaborHoursCost =
      (totalShiftHours - seedShiftHoursBaseline) * 18.5 + (entryPunchesCount - seedPunchesBaseline) * 42;
    const payrollExpensesSum = expenses
      .filter((e) => /personal|nómina|nomina|rrhh|laboral|seguridad social/i.test(`${e.category} ${e.providerName}`))
      .reduce((acc, e) => acc + (e.totalAmount || 0), 0);

    const baselineCurrentLabor = INITIAL_ECONOMIC_METRICS.ingresos * (INITIAL_STRATEGIC_METRICS.laborCostRatio / 100);
    const currentLaborCost = Math.max(0, baselineCurrentLabor + extraLaborHoursCost + payrollExpensesSum);

    const previousLaborRatioPct = 34.2; // Mes anterior antes de optimizar turnos con Confia360
    const previousLaborCost = Number((previousSales * (previousLaborRatioPct / 100)).toFixed(2));
    const laborMonthlyChangePct =
      previousLaborCost > 0
        ? Number((((currentLaborCost - previousLaborCost) / previousLaborCost) * 100).toFixed(1))
        : 0;

    const currentLaborRatioPct =
      currentSales > 0 ? Number(((currentLaborCost / currentSales) * 100).toFixed(1)) : 0;
    const ratioDeltaPts = Number((currentLaborRatioPct - previousLaborRatioPct).toFixed(1));

    const now = new Date();
    const prevDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);
    const currentMonthLabel = capitalize(now.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' }));
    const previousMonthLabel = capitalize(prevDate.toLocaleDateString('es-ES', { month: 'long' }));

    // 3. Serie diaria de los últimos 7 días (Ventas y Coste Laboral) reactiva a los datos en vivo
    const avgDailySales = INITIAL_ECONOMIC_METRICS.ingresos / 30;
    const avgDailyLabor = baselineCurrentLabor / 30;
    // Pesos realistas por día de la semana en hostelería (Dom..Sáb: 0..6)
    const weekdaySalesWeights = [1.18, 0.72, 0.78, 0.88, 0.96, 1.24, 1.38];
    const weekdayLaborWeights = [1.06, 0.85, 0.88, 0.92, 0.98, 1.12, 1.19];

    const dailySeries7d = Array.from({ length: 7 }, (_, idx) => {
      const offsetDays = 6 - idx;
      const d = new Date(now);
      d.setDate(now.getDate() - offsetDays);
      const dow = d.getDay();
      const isToday = offsetDays === 0;

      const baseVentas = avgDailySales * weekdaySalesWeights[dow];
      const baseLabor = avgDailyLabor * weekdayLaborWeights[dow];

      const dailyVentas = Math.max(0, Math.round(baseVentas + (isToday ? liveSalesDelta : 0)));
      const dailyLabor = Math.max(
        0,
        Math.round(baseLabor + (isToday ? Math.max(-baseLabor * 0.4, extraLaborHoursCost + payrollExpensesSum * 0.15) : 0))
      );
      const dailyRatio = dailyVentas > 0 ? Number(((dailyLabor / dailyVentas) * 100).toFixed(1)) : 0;

      const shortWeekday = capitalize(d.toLocaleDateString('es-ES', { weekday: 'short' })).replace('.', '');
      return {
        dayLabel: isToday ? 'Hoy' : shortWeekday,
        fullDate: d.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit' }),
        ventas: dailyVentas,
        costeLaboral: dailyLabor,
        laborRatioPct: dailyRatio,
      };
    });

    return {
      currentMonthLabel,
      previousMonthLabel,
      ventas: {
        id: 'ventas',
        label: 'Ventas Mensuales',
        currentAmount: Number(currentSales.toFixed(0)),
        previousAmount: Number(previousSales.toFixed(0)),
        monthlyChangePct: salesMonthlyChangePct,
        isFavorable: salesMonthlyChangePct >= 0,
        targetHint: `Objetivo mensual: +5,0% · Ticket medio ${ticketMedio.toFixed(2)} €`,
        driverSummary: `${activeReservations.length} reservas activas (${activeGuests} pax) · Base multi-local integrada`,
        thresholdAlert:
          salesMonthlyChangePct < operationalThresholds.minSalesMonthlyChangePct
            ? {
                metricKey: 'ventas',
                currentValue: salesMonthlyChangePct,
                thresholdValue: operationalThresholds.minSalesMonthlyChangePct,
                unit: '%',
                direction: 'min',
                severity: 'critical',
                message: `Crecimiento de ventas (${salesMonthlyChangePct.toFixed(1)}%) por debajo del mínimo operativo (${operationalThresholds.minSalesMonthlyChangePct.toFixed(1)}%).`,
              }
            : undefined,
      },
      costeLaboral: {
        id: 'coste_laboral',
        label: 'Coste Laboral',
        currentAmount: Number(currentLaborCost.toFixed(0)),
        previousAmount: Number(previousLaborCost.toFixed(0)),
        monthlyChangePct: laborMonthlyChangePct,
        ratioPct: currentLaborRatioPct,
        previousRatioPct: previousLaborRatioPct,
        ratioDeltaPts,
        isFavorable: ratioDeltaPts <= 0,
        targetHint: `Ratio óptimo < ${operationalThresholds.maxLaborCostRatioPct.toFixed(1)}% s/ ventas (mes ant.: ${previousLaborRatioPct.toFixed(1)}%)`,
        driverSummary: `${shifts.length} turnos (${totalShiftHours.toFixed(1)}h) · ${entryPunchesCount} fichajes entrada · ${businessIdentity.employeeCount} emp.`,
        thresholdAlert:
          currentLaborRatioPct > operationalThresholds.maxLaborCostRatioPct
            ? {
                metricKey: 'coste_laboral',
                currentValue: currentLaborRatioPct,
                thresholdValue: operationalThresholds.maxLaborCostRatioPct,
                unit: '%',
                direction: 'max',
                severity: currentLaborRatioPct > operationalThresholds.maxLaborCostRatioPct + 5 ? 'critical' : 'warning',
                message: `Ratio de coste laboral (${currentLaborRatioPct.toFixed(1)}%) supera el umbral máximo (${operationalThresholds.maxLaborCostRatioPct.toFixed(1)}%).`,
              }
            : undefined,
      },
      netMarginAfterLaborPct: Number((100 - currentLaborRatioPct).toFixed(1)),
      dailySeries7d,
    };
  }, [reservations, shifts, punches, expenses, businessIdentity.employeeCount, operationalThresholds]);

  // Role-priority map & Dynamic KPIs calculator explicitly mapped to activeOperativaTab + activeRole
  const getOperativaModuleKPIs = useCallback(
    (tab: OperativaTabId = activeOperativaTab, role: UserRole = activeRole): OperativaModuleKPI[] => {
      const formatEur = (amount: number) =>
        `${amount.toLocaleString('es-ES', { minimumFractionDigits: 0, maximumFractionDigits: 0 })} €`;
      const formatSignedPct = (val: number) =>
        `${val > 0 ? '+' : ''}${val.toLocaleString('es-ES', { minimumFractionDigits: 1, maximumFractionDigits: 1 })}%`;

      const ROLE_PRIORITY_KPI_MAP: Record<UserRole, Record<OperativaTabId, string>> = {
        autonomo_gerente: {
          fichaje: 'fichaje-activos',
          gastos: 'gastos-auditoria',
          reservas_voz: 'reservas-comensales',
          rrhh_turnos: 'rrhh-confirmados',
          economico_alertas: 'eco-alertas',
          monitor_sync: 'sync-pendientes',
        },
        comercial: {
          fichaje: 'fichaje-activos',
          gastos: 'gastos-total',
          reservas_voz: 'reservas-confirmadas',
          rrhh_turnos: 'rrhh-confirmados',
          economico_alertas: 'eco-aprobado',
          monitor_sync: 'sync-sincronizados',
        },
        administracion: {
          fichaje: 'fichaje-ultimo',
          gastos: 'gastos-pendientes',
          reservas_voz: 'reservas-revision',
          rrhh_turnos: 'rrhh-asignados',
          economico_alertas: 'eco-pendiente',
          monitor_sync: 'sync-pendientes',
        },
        gestoria: {
          fichaje: 'fichaje-itss',
          gastos: 'gastos-iva',
          reservas_voz: 'reservas-revision',
          rrhh_turnos: 'rrhh-vacaciones',
          economico_alertas: 'eco-sync',
          monitor_sync: 'sync-conflictos',
        },
        operaciones_sector: {
          fichaje: 'fichaje-gps',
          gastos: 'gastos-auditoria',
          reservas_voz: 'reservas-canal-voz',
          rrhh_turnos: 'rrhh-confirmados',
          economico_alertas: 'eco-alertas',
          monitor_sync: 'sync-conectividad',
        },
      };

      const priorityId = ROLE_PRIORITY_KPI_MAP[role]?.[tab];
      const markPriority = (items: OperativaModuleKPI[]): OperativaModuleKPI[] => {
        const tagged = items.map((item) => ({
          ...item,
          isRolePriority: item.id === priorityId,
        }));
        return [...tagged].sort((a, b) => Number(b.isRolePriority) - Number(a.isRolePriority));
      };

      const kpiCalculatorsByTab: Record<OperativaTabId, () => OperativaModuleKPI[]> = {
        fichaje: () => {
          const entryPunches = punches.filter((p) => p.type === 'entrada').length;
          const uniqueEmployees = new Set(punches.map((p) => p.employeeId)).size;
          const withinRadiusCount = punches.filter((p) => p.isWithinRadius).length;
          const gpsCompliancePct = punches.length > 0 ? Math.round((withinRadiusCount / punches.length) * 100) : 100;
          const latestPunch = punches[0];
          const pendingPunches = punches.filter((p) => p.syncStatus !== 'synced').length;
          const idbPunchPending = idbPendingSubmissions.filter((item) => item.module === 'fichaje').length;
          const idbPunchDrafts = idbDrafts.filter((d) => d.module === 'fichaje' && d.dirty).length;
          const latestTypeLabel =
            latestPunch?.type === 'entrada'
              ? 'En jornada'
              : latestPunch?.type === 'pausa'
              ? 'En descanso'
              : latestPunch?.type === 'salida'
              ? 'Salida registrada'
              : 'Sin registros';

          return [
            {
              id: 'fichaje-activos',
              label: 'Personal Fichado Hoy',
              value: `${uniqueEmployees || entryPunches} activos`,
              subtext: `${entryPunches} entradas · Coste Laboral ${monthlyPerformanceKPIs.costeLaboral.ratioPct?.toFixed(1)}% s/ ventas`,
              highlight: 'text-emerald-400',
              iconKey: 'users',
              targetElementId: 'historial-fichajes',
              calculationFormula: `Empleados únicos (${uniqueEmployees}) con registro hoy. Ratio Coste Laboral = (${formatEur(monthlyPerformanceKPIs.costeLaboral.currentAmount)} / ${formatEur(monthlyPerformanceKPIs.ventas.currentAmount)}) × 100 = ${monthlyPerformanceKPIs.costeLaboral.ratioPct?.toFixed(1)}%.`,
              thresholdAlert:
                (uniqueEmployees || entryPunches) < operationalThresholds.minActiveEmployeesPunched
                  ? {
                      metricKey: 'minActiveEmployeesPunched',
                      currentValue: uniqueEmployees || entryPunches,
                      thresholdValue: operationalThresholds.minActiveEmployeesPunched,
                      unit: ' emp.',
                      direction: 'min',
                      severity: 'critical',
                      message: `Personal fichado (${uniqueEmployees || entryPunches}) por debajo del mínimo operativo (${operationalThresholds.minActiveEmployeesPunched}).`,
                    }
                  : undefined,
            },
            {
              id: 'fichaje-gps',
              label: 'Perímetro GPS Local',
              value: `${gpsCompliancePct}% en radio`,
              subtext: `${withinRadiusCount}/${punches.length} fichajes validados (<150m)`,
              highlight: gpsCompliancePct >= operationalThresholds.minGpsCompliancePct ? 'text-cyan-300' : 'text-amber-400',
              iconKey: 'shield_check',
              targetElementId: 'historial-fichajes',
              calculationFormula: `(% Validación GPS) = (${withinRadiusCount} en radio ≤150m / ${punches.length} fichajes totales) × 100 = ${gpsCompliancePct}%.`,
              thresholdAlert:
                gpsCompliancePct < operationalThresholds.minGpsCompliancePct
                  ? {
                      metricKey: 'minGpsCompliancePct',
                      currentValue: gpsCompliancePct,
                      thresholdValue: operationalThresholds.minGpsCompliancePct,
                      unit: '%',
                      direction: 'min',
                      severity: gpsCompliancePct < 75 ? 'critical' : 'warning',
                      message: `Validación GPS (${gpsCompliancePct}%) bajo el umbral mínimo (${operationalThresholds.minGpsCompliancePct}%).`,
                    }
                  : undefined,
            },
            {
              id: 'fichaje-ultimo',
              label: 'Último Estado Registrado',
              value: latestTypeLabel,
              subtext: latestPunch
                ? `${latestPunch.employeeName} · ${new Date(latestPunch.timestamp).toLocaleTimeString('es-ES', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}`
                : 'Esperando primer fichaje',
              highlight: 'text-indigo-300',
              iconKey: 'clock',
              drawerHub: 'turno',
              calculationFormula: `Derivado del último evento cronológico en la lista de fichajes (${punches.length} registros ordenados por marca temporal).`,
            },
            {
              id: 'fichaje-itss',
              label: 'Respaldo Offline & ITSS',
              value: pendingPunches + idbPunchPending === 0 ? '100% Sincronizado' : `${pendingPunches + idbPunchPending} pendientes`,
              subtext:
                idbPunchDrafts > 0
                  ? `${idbPunchDrafts} nota(s) guardada(s) en IndexedDB`
                  : `Impacto Coste Laboral: ${formatEur(monthlyPerformanceKPIs.costeLaboral.currentAmount)}/mes`,
              highlight: pendingPunches + idbPunchPending > 0 ? 'text-amber-400' : 'text-emerald-400',
              iconKey: 'check_circle',
              targetElementId: 'historial-fichajes',
              calculationFormula: `Pendientes = ${pendingPunches} fichajes sin sincronizar + ${idbPunchPending} en cola IndexedDB. Variación Coste Laboral: ${formatSignedPct(monthlyPerformanceKPIs.costeLaboral.monthlyChangePct)} vs. ${monthlyPerformanceKPIs.previousMonthLabel}.`,
              thresholdAlert:
                pendingPunches + idbPunchPending > operationalThresholds.maxPendingSyncCount
                  ? {
                      metricKey: 'maxPendingSyncCount',
                      currentValue: pendingPunches + idbPunchPending,
                      thresholdValue: operationalThresholds.maxPendingSyncCount,
                      unit: ' reg.',
                      direction: 'max',
                      severity: 'warning',
                      message: `Existen ${pendingPunches + idbPunchPending} fichaje(s) pendientes de sincronización (umbral máx.: ${operationalThresholds.maxPendingSyncCount}).`,
                    }
                  : undefined,
            },
          ];
        },

        gastos: () => {
          const totalAmount = expenses.reduce((acc, e) => acc + (e.totalAmount || 0), 0);
          const pendingApproval = expenses.filter(
            (e) =>
              e.status === 'pendiente_revision' ||
              e.status === 'pendiente_aprobacion' ||
              e.status === 'pending_approval'
          );
          const auditAlerts = expenses.filter((e) => Boolean(e.auditAlert) || e.status === 'en_disputa');
          const totalVat = expenses.reduce((acc, e) => acc + (e.vatAmount || 0), 0);
          const idbExpensePending = idbPendingSubmissions.filter((item) => item.module === 'gastos').length;
          const idbExpenseDrafts = idbDrafts.filter((d) => d.module === 'gastos' && d.dirty).length;
          const salesSharePct =
            monthlyPerformanceKPIs.ventas.currentAmount > 0
              ? ((totalAmount / monthlyPerformanceKPIs.ventas.currentAmount) * 100).toFixed(1)
              : '0.0';
          const alertSubtext =
            auditAlerts.length > 0
              ? `${auditAlerts[0].providerName.split(' ').slice(0, 3).join(' ')} requiere revisión`
              : 'Precios de escandallo estables';

          return [
            {
              id: 'gastos-total',
              label: 'Gastos Registrados',
              value: formatEur(totalAmount),
              subtext: `${expenses.length} docs (${salesSharePct}% s/ Ventas) · ${idbExpenseDrafts} borrador(es)`,
              highlight: 'text-emerald-400',
              iconKey: 'receipt',
              targetElementId: 'alertas-gastos',
              calculationFormula: `Suma de ${expenses.length} tickets/facturas (${formatEur(totalAmount)}). Peso sobre Ventas = (${formatEur(totalAmount)} / ${formatEur(monthlyPerformanceKPIs.ventas.currentAmount)}) × 100 = ${salesSharePct}%.`,
            },
            {
              id: 'gastos-pendientes',
              label: 'Pendientes de Revisión',
              value: `${pendingApproval.length + idbExpensePending} docs`,
              subtext:
                idbExpensePending > 0
                  ? `${pendingApproval.length} en panel + ${idbExpensePending} offline`
                  : 'Listos para validar en 3 pasos',
              highlight: pendingApproval.length + idbExpensePending > 0 ? 'text-amber-400' : 'text-slate-300',
              iconKey: 'alert_triangle',
              targetElementId: 'alertas-gastos',
              calculationFormula: `Documentos en revisión/aprobación (${pendingApproval.length}) + envíos OCR en cola offline IndexedDB (${idbExpensePending}).`,
              thresholdAlert:
                pendingApproval.length + idbExpensePending > operationalThresholds.maxPendingExpensesAllowed
                  ? {
                      metricKey: 'maxPendingExpensesAllowed',
                      currentValue: pendingApproval.length + idbExpensePending,
                      thresholdValue: operationalThresholds.maxPendingExpensesAllowed,
                      unit: ' docs',
                      direction: 'max',
                      severity: 'warning',
                      message: `Facturas por aprobar (${pendingApproval.length + idbExpensePending}) superan el límite operativo (${operationalThresholds.maxPendingExpensesAllowed}).`,
                    }
                  : undefined,
            },
            {
              id: 'gastos-auditoria',
              label: 'Auditoría & Disputas',
              value: `${auditAlerts.length} ${auditAlerts.length === 1 ? 'Alerta' : 'Alertas'}`,
              subtext: alertSubtext,
              highlight: auditAlerts.length > 0 ? 'text-rose-400' : 'text-emerald-400',
              iconKey: 'trending_up',
              drawerHub: 'plato_escandallo',
              calculationFormula: `Facturas con alerta de desviación de precio en escandallo o estado 'en_disputa' (${auditAlerts.length} de ${expenses.length}).`,
              thresholdAlert:
                auditAlerts.length > operationalThresholds.maxAuditAlertsAllowed
                  ? {
                      metricKey: 'maxAuditAlertsAllowed',
                      currentValue: auditAlerts.length,
                      thresholdValue: operationalThresholds.maxAuditAlertsAllowed,
                      unit: ' alertas',
                      direction: 'max',
                      severity: 'critical',
                      message: `Se han detectado ${auditAlerts.length} anomalía(s) de auditoría (máx. permitido: ${operationalThresholds.maxAuditAlertsAllowed}).`,
                    }
                  : undefined,
            },
            {
              id: 'gastos-iva',
              label: 'IVA Soportado Deducible',
              value: formatEur(totalVat),
              subtext: `Computable mod. 303 · Ventas ${formatEur(monthlyPerformanceKPIs.ventas.currentAmount)}`,
              highlight: 'text-cyan-300',
              iconKey: 'sparkles',
              drawerHub: 'albaran',
              calculationFormula: `Suma del IVA desglosado en ${expenses.length} documentos (${formatEur(totalVat)}). Crecimiento Ventas: ${formatSignedPct(monthlyPerformanceKPIs.ventas.monthlyChangePct)} vs. ${monthlyPerformanceKPIs.previousMonthLabel}.`,
            },
          ];
        },

        reservas_voz: () => {
          const confirmedReservations = reservations.filter((r) => r.status === 'confirmed');
          const waitlistReservations = reservations.filter((r) => r.status === 'waitlist');
          const confirmedGuests = confirmedReservations.reduce((acc, r) => acc + (r.guests || 0), 0);
          const venueCapacity = 70;
          const occupancyPct = Math.min(100, Math.round((confirmedGuests / venueCapacity) * 100));
          const voiceChannelCount = reservations.filter((r) => r.channel === 'voice_agent_24_7').length;
          const pendingVoiceReview = agentInteractions.filter(
            (a) => a.agentType === 'voice_reservations' && a.status === 'pending_human_review'
          ).length;
          const idbResPending = idbPendingSubmissions.filter((item) => item.module === 'reservas_voz').length;
          const idbResDrafts = idbDrafts.filter((d) => d.module === 'reservas_voz' && d.dirty).length;

          return [
            {
              id: 'reservas-confirmadas',
              label: 'Reservas Confirmadas',
              value: `${confirmedReservations.length} mesas`,
              subtext: `${reservations.length} totales (${waitlistReservations.length} en lista espera)`,
              highlight: 'text-amber-400',
              iconKey: 'utensils_crossed',
              targetElementId: 'libro-reservas',
              calculationFormula: `Reservas con estado 'confirmed' (${confirmedReservations.length}) sobre ${reservations.length} totales (${waitlistReservations.length} en lista de espera).`,
            },
            {
              id: 'reservas-comensales',
              label: 'Comensales & Ventas Mes',
              value: `${confirmedGuests} pax`,
              subtext: `Ocupación ${occupancyPct}% · Ventas ${formatEur(monthlyPerformanceKPIs.ventas.currentAmount)} (${formatSignedPct(monthlyPerformanceKPIs.ventas.monthlyChangePct)})`,
              highlight: occupancyPct < operationalThresholds.minOccupancyPct ? 'text-amber-400' : 'text-emerald-400',
              iconKey: 'users',
              targetElementId: 'libro-reservas',
              calculationFormula: `Ocupación = (${confirmedGuests} pax / ${venueCapacity} plazas) × 100 = ${occupancyPct}%. Crecimiento Ventas = ((${formatEur(monthlyPerformanceKPIs.ventas.currentAmount)} − ${formatEur(monthlyPerformanceKPIs.ventas.previousAmount)}) / ${formatEur(monthlyPerformanceKPIs.ventas.previousAmount)}) × 100 = ${formatSignedPct(monthlyPerformanceKPIs.ventas.monthlyChangePct)}.`,
              thresholdAlert:
                occupancyPct < operationalThresholds.minOccupancyPct
                  ? {
                      metricKey: 'minOccupancyPct',
                      currentValue: occupancyPct,
                      thresholdValue: operationalThresholds.minOccupancyPct,
                      unit: '%',
                      direction: 'min',
                      severity: 'warning',
                      message: `Ocupación actual (${occupancyPct}%) por debajo del umbral objetivo (${operationalThresholds.minOccupancyPct}%).`,
                    }
                  : undefined,
            },
            {
              id: 'reservas-canal-voz',
              label: 'Agente Telefónico 24/7',
              value: effectiveOnline ? `${voiceChannelCount} vía Voz IA` : 'Respaldo Local',
              subtext: effectiveOnline ? 'Recepción automática en línea' : 'Cola offline IndexedDB activa',
              highlight: effectiveOnline ? 'text-cyan-300' : 'text-amber-400',
              iconKey: 'mic',
              targetElementId: 'formulario-reserva',
              calculationFormula: `Reservas captadas automáticamente por el canal 'voice_agent_24_7' (${voiceChannelCount} de ${reservations.length}).`,
            },
            {
              id: 'reservas-revision',
              label: 'Revisiones & Pendientes',
              value: `${pendingVoiceReview + waitlistReservations.length + idbResPending} gestiones`,
              subtext:
                idbResPending > 0
                  ? `${idbResPending} en cola offline por sincronizar`
                  : idbResDrafts > 0
                  ? `${idbResDrafts} borrador(es) de llamada en IndexedDB`
                  : `${pendingVoiceReview} alertas IA · ${waitlistReservations.length} espera`,
              highlight:
                pendingVoiceReview + waitlistReservations.length + idbResPending > 0
                  ? 'text-amber-400'
                  : 'text-indigo-300',
              iconKey: 'shield_check',
              targetElementId: 'formulario-reserva',
              calculationFormula: `Suma de interacciones IA por revisar (${pendingVoiceReview}) + lista de espera (${waitlistReservations.length}) + reservas offline en IndexedDB (${idbResPending}).`,
            },
          ];
        },

        rrhh_turnos: () => {
          const totalShifts = shifts.length;
          const confirmedShifts = shifts.filter((s) => s.status === 'confirmed').length;
          const pendingShifts = shifts.filter((s) => s.status !== 'confirmed').length;
          const coveragePct = totalShifts > 0 ? Math.round((confirmedShifts / totalShifts) * 100) : 100;
          const avgVacationDays =
            totalShifts > 0
              ? (shifts.reduce((acc, s) => acc + (s.vacationDaysLeft || 0), 0) / totalShifts).toFixed(1)
              : '0';
          const hrInteractionsCount = agentInteractions.filter((a) => a.agentType === 'chat_shifts').length;
          const idbHrPending = idbPendingSubmissions.filter((item) => item.module === 'rrhh_turnos').length;
          const idbHrDrafts = idbDrafts.filter((d) => d.module === 'rrhh_turnos' && d.dirty).length;

          return [
            {
              id: 'rrhh-asignados',
              label: 'Turnos & Coste Laboral',
              value: `${totalShifts} puestos`,
              subtext: `Coste Laboral ${formatEur(monthlyPerformanceKPIs.costeLaboral.currentAmount)} (${monthlyPerformanceKPIs.costeLaboral.ratioPct?.toFixed(1)}% s/ ventas)`,
              highlight:
                (monthlyPerformanceKPIs.costeLaboral.ratioPct ?? 0) > operationalThresholds.maxLaborCostRatioPct
                  ? 'text-amber-400'
                  : 'text-indigo-300',
              iconKey: 'calendar',
              targetElementId: 'nuevo-turno',
              calculationFormula: `Ratio Coste Laboral = (${formatEur(monthlyPerformanceKPIs.costeLaboral.currentAmount)} / ${formatEur(monthlyPerformanceKPIs.ventas.currentAmount)}) × 100 = ${monthlyPerformanceKPIs.costeLaboral.ratioPct?.toFixed(1)}%, ajustado en vivo por horas de ${totalShifts} turnos y fichajes.`,
              thresholdAlert: monthlyPerformanceKPIs.costeLaboral.thresholdAlert,
            },
            {
              id: 'rrhh-confirmados',
              label: 'Turnos Confirmados',
              value: `${confirmedShifts}/${totalShifts} (${coveragePct}%)`,
              subtext: pendingShifts > 0 ? `${pendingShifts} pendiente(s) de confirmar` : 'Todo el equipo confirmado',
              highlight: coveragePct >= operationalThresholds.minShiftCoveragePct ? 'text-emerald-400' : 'text-amber-400',
              iconKey: 'check_circle',
              targetElementId: 'nuevo-turno',
              calculationFormula: `Cobertura = (${confirmedShifts} turnos confirmados / ${totalShifts} turnos totales) × 100 = ${coveragePct}%.`,
              thresholdAlert:
                coveragePct < operationalThresholds.minShiftCoveragePct
                  ? {
                      metricKey: 'minShiftCoveragePct',
                      currentValue: coveragePct,
                      thresholdValue: operationalThresholds.minShiftCoveragePct,
                      unit: '%',
                      direction: 'min',
                      severity: coveragePct < 50 ? 'critical' : 'warning',
                      message: `Cobertura de turnos confirmados (${coveragePct}%) por debajo del umbral (${operationalThresholds.minShiftCoveragePct}%).`,
                    }
                  : undefined,
            },
            {
              id: 'rrhh-vacaciones',
              label: 'Saldo Medio Vacaciones',
              value: `${avgVacationDays} días`,
              subtext: `Variación Coste Laboral: ${formatSignedPct(monthlyPerformanceKPIs.costeLaboral.monthlyChangePct)}`,
              highlight: 'text-cyan-300',
              iconKey: 'users',
              drawerHub: 'turno',
              calculationFormula: `Media de días pendientes entre ${totalShifts} turnos (${avgVacationDays}d). Variación Coste Laboral = ((${formatEur(monthlyPerformanceKPIs.costeLaboral.currentAmount)} − ${formatEur(monthlyPerformanceKPIs.costeLaboral.previousAmount)}) / ${formatEur(monthlyPerformanceKPIs.costeLaboral.previousAmount)}) × 100 = ${formatSignedPct(monthlyPerformanceKPIs.costeLaboral.monthlyChangePct)}.`,
            },
            {
              id: 'rrhh-consultas',
              label: 'Consultas & Borradores',
              value: `${hrInteractionsCount + idbHrPending} registros`,
              subtext:
                idbHrPending > 0
                  ? `${idbHrPending} consulta(s) offline en cola`
                  : `${idbHrDrafts} borrador(es) activo(s) en IndexedDB`,
              highlight: idbHrPending > 0 ? 'text-amber-400' : 'text-slate-300',
              iconKey: 'shield_check',
              targetElementId: 'nuevo-turno',
              calculationFormula: `Interacciones de chat RRHH procesadas (${hrInteractionsCount}) + solicitudes en cola offline IndexedDB (${idbHrPending}).`,
            },
          ];
        },

        economico_alertas: () => {
          const totalExpenses = expenses.reduce((acc, e) => acc + (e.totalAmount || 0), 0);
          const approvedStatuses = new Set(['aprobada', 'approved', 'contabilizada', 'pagada']);
          const approvedExpenses = expenses.filter((e) => approvedStatuses.has(e.status));
          const approvedAmount = approvedExpenses.reduce((acc, e) => acc + (e.totalAmount || 0), 0);
          const pendingExpenses = expenses.filter(
            (e) =>
              e.status === 'pendiente_revision' ||
              e.status === 'pendiente_aprobacion' ||
              e.status === 'pending_approval'
          );
          const pendingAmount = pendingExpenses.reduce((acc, e) => acc + (e.totalAmount || 0), 0);
          const alertExpenses = expenses.filter((e) => Boolean(e.auditAlert) || e.status === 'en_disputa');
          const alertExposure = alertExpenses.reduce((acc, e) => acc + (e.totalAmount || 0), 0);
          const syncedCount = expenses.filter((e) => e.syncStatus === 'synced').length;
          const syncedPct = expenses.length > 0 ? Math.round((syncedCount / expenses.length) * 100) : 100;

          return [
            {
              id: 'eco-aprobado',
              label: 'Gasto Conciliado / Aprobado',
              value: formatEur(approvedAmount),
              subtext: `${approvedExpenses.length}/${expenses.length} fras (${formatEur(totalExpenses)}) · Ventas ${formatEur(monthlyPerformanceKPIs.ventas.currentAmount)}`,
              highlight: 'text-cyan-300',
              iconKey: 'credit_card',
              drawerHub: 'gastos',
              calculationFormula: `Suma de ${approvedExpenses.length} facturas aprobadas/pagadas (${formatEur(approvedAmount)}) sobre un total de ${formatEur(totalExpenses)}. Ventas mes: ${formatSignedPct(monthlyPerformanceKPIs.ventas.monthlyChangePct)} vs. ${monthlyPerformanceKPIs.previousMonthLabel}.`,
            },
            {
              id: 'eco-pendiente',
              label: 'Facturas por Aprobar',
              value: formatEur(pendingAmount),
              subtext: `${pendingExpenses.length} doc(s) · Margen tras personal ${monthlyPerformanceKPIs.netMarginAfterLaborPct.toFixed(1)}%`,
              highlight: pendingExpenses.length > 0 ? 'text-amber-400' : 'text-emerald-400',
              iconKey: 'trending_up',
              targetElementId: 'conciliacion-bancaria',
              calculationFormula: `Importe de ${pendingExpenses.length} documentos sin visto bueno (${formatEur(pendingAmount)}). Margen tras personal = 100% − ${monthlyPerformanceKPIs.costeLaboral.ratioPct?.toFixed(1)}% = ${monthlyPerformanceKPIs.netMarginAfterLaborPct.toFixed(1)}%.`,
              thresholdAlert:
                monthlyPerformanceKPIs.netMarginAfterLaborPct < operationalThresholds.minNetMarginAfterLaborPct
                  ? {
                      metricKey: 'minNetMarginAfterLaborPct',
                      currentValue: monthlyPerformanceKPIs.netMarginAfterLaborPct,
                      thresholdValue: operationalThresholds.minNetMarginAfterLaborPct,
                      unit: '%',
                      direction: 'min',
                      severity: 'warning',
                      message: `Margen tras personal (${monthlyPerformanceKPIs.netMarginAfterLaborPct.toFixed(1)}%) por debajo del mínimo (${operationalThresholds.minNetMarginAfterLaborPct.toFixed(1)}%).`,
                    }
                  : undefined,
            },
            {
              id: 'eco-alertas',
              label: 'Alertas de Tesorería',
              value: `${alertExpenses.length} (${formatEur(alertExposure)})`,
              subtext:
                alertExpenses.length > 0
                  ? 'Desviaciones de precio o lectura'
                  : `Coste Laboral controlado: ${monthlyPerformanceKPIs.costeLaboral.ratioPct?.toFixed(1)}%`,
              highlight: alertExpenses.length > 0 ? 'text-rose-400' : 'text-emerald-400',
              iconKey: 'alert_triangle',
              targetElementId: 'prevision-liquidez',
              calculationFormula: `${alertExpenses.length} documento(s) con alerta de auditoría o disputa por valor de ${formatEur(alertExposure)}. Ratio Coste Laboral = ${monthlyPerformanceKPIs.costeLaboral.ratioPct?.toFixed(1)}% (${formatSignedPct(monthlyPerformanceKPIs.costeLaboral.ratioDeltaPts ?? 0).replace('%', ' p.p.')}).`,
              thresholdAlert:
                alertExpenses.length > operationalThresholds.maxAuditAlertsAllowed
                  ? {
                      metricKey: 'maxAuditAlertsAllowed',
                      currentValue: alertExpenses.length,
                      thresholdValue: operationalThresholds.maxAuditAlertsAllowed,
                      unit: ' alertas',
                      direction: 'max',
                      severity: 'critical',
                      message: `Alertas activas de tesorería (${alertExpenses.length}) requieren revisión (umbral: ${operationalThresholds.maxAuditAlertsAllowed}).`,
                    }
                  : undefined,
            },
            {
              id: 'eco-sync',
              label: 'Sincronización Contable',
              value: `${syncedPct}% Cuadrado`,
              subtext: `${syncedCount}/${expenses.length} registros en central`,
              highlight: syncedPct >= operationalThresholds.minAccountingSyncPct ? 'text-emerald-400' : 'text-amber-400',
              iconKey: 'check_circle',
              targetElementId: 'conciliacion-bancaria',
              calculationFormula: `% Cuadrado = (${syncedCount} documentos sincronizados / ${expenses.length} documentos totales) × 100 = ${syncedPct}%.`,
              thresholdAlert:
                syncedPct < operationalThresholds.minAccountingSyncPct
                  ? {
                      metricKey: 'minAccountingSyncPct',
                      currentValue: syncedPct,
                      thresholdValue: operationalThresholds.minAccountingSyncPct,
                      unit: '%',
                      direction: 'min',
                      severity: 'warning',
                      message: `Cuadre contable (${syncedPct}%) inferior al umbral mínimo (${operationalThresholds.minAccountingSyncPct}%).`,
                    }
                  : undefined,
            },
          ];
        },

        monitor_sync: () => {
          const queuePending = syncQueue.filter(
            (item) => item.status === 'pending_offline' || item.status === 'syncing'
          ).length;
          const syncedQueueCount = syncQueue.filter((item) => item.status === 'synced').length;
          const syncedEntitiesCount =
            punches.filter((p) => p.syncStatus === 'synced').length +
            expenses.filter((e) => e.syncStatus === 'synced').length +
            reservations.filter((r) => r.syncStatus === 'synced').length;
          const activeDraftsCount = idbDrafts.filter((d) => d.dirty).length;
          const unresolvedConflicts = syncConflicts.filter((c) => !c.resolved).length;

          return [
            {
              id: 'sync-pendientes',
              label: 'Operaciones Pendientes',
              value: `${pendingSyncCount} pendientes`,
              subtext: `${queuePending} en cola local · ${idbPendingSubmissions.length} en IndexedDB`,
              highlight: pendingSyncCount > 0 ? 'text-amber-400' : 'text-emerald-400',
              iconKey: 'zap',
              targetElementId: 'cola-transacciones',
              calculationFormula: `Pendientes totales = ${queuePending} operaciones en cola local + ${idbPendingSubmissions.length} formularios diferidos en IndexedDB.`,
              thresholdAlert:
                pendingSyncCount > operationalThresholds.maxPendingSyncCount
                  ? {
                      metricKey: 'maxPendingSyncCount',
                      currentValue: pendingSyncCount,
                      thresholdValue: operationalThresholds.maxPendingSyncCount,
                      unit: ' ops',
                      direction: 'max',
                      severity: 'warning',
                      message: `${pendingSyncCount} operación(es) pendiente(s) superan el umbral (${operationalThresholds.maxPendingSyncCount}).`,
                    }
                  : undefined,
            },
            {
              id: 'sync-conectividad',
              label: 'Conectividad & Borradores',
              value: effectiveOnline ? 'En Línea' : 'Modo Offline',
              subtext: effectiveOnline
                ? `Sincronización activa · ${activeDraftsCount} borrador(es)`
                : `Guardando en local · ${activeDraftsCount} borrador(es)`,
              highlight: effectiveOnline ? 'text-emerald-400' : 'text-amber-400',
              iconKey: effectiveOnline ? 'wifi' : 'wifi_off',
              targetElementId: 'cola-transacciones',
              calculationFormula: `Estado combinado de red del navegador + simulador offline, junto a ${activeDraftsCount} borrador(es) con cambios sin enviar.`,
              thresholdAlert: !effectiveOnline
                ? {
                    metricKey: 'connectivity',
                    currentValue: 0,
                    thresholdValue: 1,
                    unit: '',
                    direction: 'min',
                    severity: 'warning',
                    message: 'Dispositivo operando sin conexión; cola diferida en IndexedDB.',
                  }
                : undefined,
            },
            {
              id: 'sync-conflictos',
              label: 'Conflictos de Concurrencia',
              value: unresolvedConflicts === 0 ? '0 Conflictos' : `${unresolvedConflicts} por resolver`,
              subtext:
                unresolvedConflicts === 0
                  ? 'Protocolo Zero-Data-Loss íntegro'
                  : 'Requiere decisión del supervisor',
              highlight: unresolvedConflicts > 0 ? 'text-rose-400' : 'text-cyan-300',
              iconKey: unresolvedConflicts > 0 ? 'alert_triangle' : 'shield_check',
              targetElementId: 'cola-transacciones',
              calculationFormula: `Conteo de colisiones de edición local vs. servidor pendientes de resolución manual (${unresolvedConflicts}).`,
              thresholdAlert:
                unresolvedConflicts > operationalThresholds.maxUnresolvedConflicts
                  ? {
                      metricKey: 'maxUnresolvedConflicts',
                      currentValue: unresolvedConflicts,
                      thresholdValue: operationalThresholds.maxUnresolvedConflicts,
                      unit: ' conf.',
                      direction: 'max',
                      severity: 'critical',
                      message: `Conflictos sin resolver (${unresolvedConflicts}) superan el máximo permitido (${operationalThresholds.maxUnresolvedConflicts}).`,
                    }
                  : undefined,
            },
            {
              id: 'sync-sincronizados',
              label: 'Registros Sincronizados',
              value: `${syncedEntitiesCount + syncedQueueCount} totales`,
              subtext: `${syncedEntitiesCount} entidades · Ventas ${formatEur(monthlyPerformanceKPIs.ventas.currentAmount)}`,
              highlight: 'text-indigo-300',
              iconKey: 'check_circle',
              targetElementId: 'cola-transacciones',
              calculationFormula: `Total sincronizado = ${syncedEntitiesCount} entidades (fichajes + gastos + reservas) + ${syncedQueueCount} eventos procesados en cola.`,
            },
          ];
        },
      };

      const calculator = kpiCalculatorsByTab[tab] ?? kpiCalculatorsByTab.monitor_sync;
      return markPriority(calculator());
    },
    [
      activeOperativaTab,
      activeRole,
      punches,
      expenses,
      reservations,
      shifts,
      agentInteractions,
      syncQueue,
      syncConflicts,
      idbDrafts,
      idbPendingSubmissions,
      pendingSyncCount,
      effectiveOnline,
      monthlyPerformanceKPIs,
      operationalThresholds,
    ]
  );

  const precalculatedModuleKPIs = useMemo<Record<OperativaTabId, OperativaModuleKPI[]>>(
    () => ({
      fichaje: getOperativaModuleKPIs('fichaje', activeRole),
      gastos: getOperativaModuleKPIs('gastos', activeRole),
      reservas_voz: getOperativaModuleKPIs('reservas_voz', activeRole),
      rrhh_turnos: getOperativaModuleKPIs('rrhh_turnos', activeRole),
      economico_alertas: getOperativaModuleKPIs('economico_alertas', activeRole),
      monitor_sync: getOperativaModuleKPIs('monitor_sync', activeRole),
    }),
    [getOperativaModuleKPIs, activeRole]
  );

  const getActiveModuleKPIs = useCallback(
    (tab: OperativaTabId = activeOperativaTab, role: UserRole = activeRole): OperativaModuleKPI[] => {
      if (role === activeRole) {
        return precalculatedModuleKPIs[tab] ?? precalculatedModuleKPIs.monitor_sync;
      }
      return getOperativaModuleKPIs(tab, role);
    },
    [activeOperativaTab, activeRole, precalculatedModuleKPIs, getOperativaModuleKPIs]
  );

  const getAllOperativaModuleKPIs = useCallback(
    (role: UserRole = activeRole): Record<OperativaTabId, OperativaModuleKPI[]> =>
      role === activeRole
        ? precalculatedModuleKPIs
        : {
            fichaje: getOperativaModuleKPIs('fichaje', role),
            gastos: getOperativaModuleKPIs('gastos', role),
            reservas_voz: getOperativaModuleKPIs('reservas_voz', role),
            rrhh_turnos: getOperativaModuleKPIs('rrhh_turnos', role),
            economico_alertas: getOperativaModuleKPIs('economico_alertas', role),
            monitor_sync: getOperativaModuleKPIs('monitor_sync', role),
          },
    [precalculatedModuleKPIs, getOperativaModuleKPIs, activeRole]
  );

  const currentOperativaKPIs = useMemo(
    () => getActiveModuleKPIs(activeOperativaTab, activeRole),
    [getActiveModuleKPIs, activeOperativaTab, activeRole]
  );

  return (
    <AppContext.Provider
      value={{
        brandConfig,
        updateBrandConfig,
        toggleHighContrast,
        setFontScale,
        activeView,
        setActiveView,
        activeOperativaTab,
        setActiveOperativaTab,
        activeDirectorTab,
        setActiveDirectorTab,
        activeSector,
        setActiveSector,
        moduleStatusFilter,
        setModuleStatusFilter,
        pinnedDailyActions,
        togglePinDailyAction,
        isReportModalOpen,
        setIsReportModalOpen,
        activeRole,
        setActiveRole: handleSetActiveRole,
        businessIdentity,
        updateBusinessIdentity,
        isIdentityModalOpen,
        setIsIdentityModalOpen,
        isVoiceAssistantOpen,
        setIsVoiceAssistantOpen,
        openVoiceAssistant,
        closeVoiceAssistant,
        navigationHistory,
        canGoBack,
        previousNavigationState,
        goBack,
        currentScreenTitle,
        isTourOpen,
        setIsTourOpen,
        initialTourMode,
        startTour,
        tourCompletionMessage,
        showTourCompletionMessage,
        dismissTourCompletionMessage,
        isReadingCurrentScreen,
        toggleReadCurrentScreen,
        currentScreenAudioDescription,
        isPositionalHelpActive,
        togglePositionalHelp,
        setPositionalHelpActive: setIsPositionalHelpActive,
        isOnline: effectiveOnline,
        isSimulatedOffline,
        toggleSimulatedOffline,
        ariaLiveMessage,
        announceAriaLive,
        dismissAriaLive,
        isDrawer360Open,
        drawer360Hub,
        drawer360History,
        openDrawer360,
        closeDrawer360,
        navigateDrawer360,
        goBackDrawer360,
        appVersion: 'v2.0-navegacion360',
        punches,
        expenses,
        reservations,
        shifts,
        agentInteractions,
        getActiveModuleKPIs,
        getOperativaModuleKPIs,
        getAllOperativaModuleKPIs,
        currentOperativaKPIs,
        monthlyPerformanceKPIs,
        operationalThresholds,
        updateOperationalThresholds,
        syncQueue,
        syncConflicts,
        idbDrafts,
        idbPendingSubmissions,
        pendingSyncCount,
        isSyncingNow,
        triggerManualSync,
        discardIdbDraft,
        resolveConflict,
        clearResolvedQueue,
        simulateConflictDemo,
        recordPunch,
        saveExpenseTicket,
        approveExpenseTicket,
        updateExpenseTicket,
        createReservation,
        confirmEmployeeShift,
        addAgentInteraction,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
