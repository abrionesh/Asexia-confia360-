import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  AttendancePunch,
  ExpenseTicket,
  Reservation,
  EmployeeShift,
  SyncQueueItem,
  SyncConflict,
  BrandConfig,
  AgentInteraction,
  SyncStatus,
} from '../types';
import { LocalDB, DEFAULT_BRAND_CONFIG } from '../services/storage';
import { EntityHubType } from '../services/dataModel360';

export interface NavigationState {
  view: 'operativa' | 'cockpit' | 'director' | 'reputacion';
  operativaTab?: 'fichaje' | 'gastos' | 'reservas_voz' | 'rrhh_turnos' | 'economico_alertas' | 'monitor_sync';
  directorTab?: 'ux_ui_wireframes' | 'project_plan_agile' | 'software_architecture';
  title: string;
}

export const getScreenTitle = (
  view: 'operativa' | 'cockpit' | 'director' | 'reputacion',
  operativaTab?: 'fichaje' | 'gastos' | 'reservas_voz' | 'rrhh_turnos' | 'economico_alertas' | 'monitor_sync',
  directorTab?: 'ux_ui_wireframes' | 'project_plan_agile' | 'software_architecture'
): string => {
  if (view === 'reputacion') return 'ConfIA360 Reputación & Calidad';
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
  view: 'operativa' | 'cockpit' | 'director' | 'reputacion',
  operativaTab?: 'fichaje' | 'gastos' | 'reservas_voz' | 'rrhh_turnos' | 'economico_alertas' | 'monitor_sync',
  directorTab?: 'ux_ui_wireframes' | 'project_plan_agile' | 'software_architecture'
): string => {
  if (view === 'reputacion') {
    return 'Estás en ConfIA360 Reputación. Aquí gestionas la experiencia del comensal, encuestas automáticas de WhatsApp con firewall de quejas, reseñas multicanal de Google y TripAdvisor con respuestas asistidas por inteligencia artificial, y tareas operativas para cocina y sala.';
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
  activeView: 'operativa' | 'cockpit' | 'director' | 'reputacion';
  setActiveView: (view: 'operativa' | 'cockpit' | 'director' | 'reputacion') => void;
  activeOperativaTab: 'fichaje' | 'gastos' | 'reservas_voz' | 'rrhh_turnos' | 'economico_alertas' | 'monitor_sync';
  setActiveOperativaTab: (tab: 'fichaje' | 'gastos' | 'reservas_voz' | 'rrhh_turnos' | 'economico_alertas' | 'monitor_sync') => void;
  activeDirectorTab: 'ux_ui_wireframes' | 'project_plan_agile' | 'software_architecture';
  setActiveDirectorTab: (tab: 'ux_ui_wireframes' | 'project_plan_agile' | 'software_architecture') => void;

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

  // Sync Queue & Conflict Resolution
  syncQueue: SyncQueueItem[];
  syncConflicts: SyncConflict[];
  pendingSyncCount: number;
  isSyncingNow: boolean;
  triggerManualSync: () => Promise<void>;
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

const AppContext = createContext<AppContextType | null>(null);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Brand Configuration
  const [brandConfig, setBrandConfig] = useState<BrandConfig>(LocalDB.getBrandConfig);

  // Views & Tabs
  const [activeView, setActiveViewInternal] = useState<'operativa' | 'cockpit' | 'director' | 'reputacion'>('cockpit');
  const [activeOperativaTab, setActiveOperativaTabInternal] = useState<'fichaje' | 'gastos' | 'reservas_voz' | 'rrhh_turnos' | 'economico_alertas' | 'monitor_sync'>('fichaje');
  const [activeDirectorTab, setActiveDirectorTabInternal] = useState<'ux_ui_wireframes' | 'project_plan_agile' | 'software_architecture'>('ux_ui_wireframes');
  const [navigationHistory, setNavigationHistory] = useState<NavigationState[]>([]);
  const [isTourOpen, setIsTourOpen] = useState<boolean>(false);
  const [initialTourMode, setInitialTourMode] = useState<'tour' | 'voice_agent'>('tour');
  const [tourCompletionMessage, setTourCompletionMessage] = useState<string | null>(null);
  const [isPositionalHelpActive, setIsPositionalHelpActive] = useState<boolean>(false);
  const [isReadingCurrentScreen, setIsReadingCurrentScreen] = useState<boolean>(false);

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
    (view: 'operativa' | 'cockpit' | 'director' | 'reputacion', opTab: any, dirTab: any) => {
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
    (view: 'operativa' | 'cockpit' | 'director' | 'reputacion') => {
      if (view !== activeView) {
        pushStateToHistory(activeView, activeOperativaTab, activeDirectorTab);
        setActiveViewInternal(view);
      }
    },
    [activeView, activeOperativaTab, activeDirectorTab, pushStateToHistory]
  );

  const setActiveOperativaTab = useCallback(
    (tab: 'fichaje' | 'gastos' | 'reservas_voz' | 'rrhh_turnos' | 'economico_alertas' | 'monitor_sync') => {
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

  // Pending count calculation
  const pendingSyncCount = syncQueue.filter(item => item.status === 'pending_offline' || item.status === 'syncing').length;

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

    await new Promise(resolve => setTimeout(resolve, 1500));

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
  const addAgentInteraction = (interaction: Omit<AgentInteraction, 'id' | 'updatedAt'>) => {
    const newInt: AgentInteraction = {
      ...interaction,
      id: `ai-${Date.now()}`,
      updatedAt: new Date().toISOString(),
    };
    setAgentInteractions(prev => [newInt, ...prev]);
  };

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
        syncQueue,
        syncConflicts,
        pendingSyncCount,
        isSyncingNow,
        triggerManualSync,
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
