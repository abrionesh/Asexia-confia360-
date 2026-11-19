import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Sparkles,
  X,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Fingerprint,
  Receipt,
  PhoneCall,
  Database,
  LayoutDashboard,
  Smartphone,
  Wifi,
  ShieldCheck,
  RotateCcw,
  Compass,
  Volume2,
  VolumeX,
  Mic,
  MicOff,
  Send,
  Bot,
  ExternalLink,
  HelpCircle,
  Play,
  Square,
  Radio,
  GitBranch,
  Star,
} from 'lucide-react';

export interface TourStep {
  id: string;
  moduleBadge: string;
  title: string;
  description: string;
  keyHighlights: string[];
  icon: React.ComponentType<{ className?: string }>;
  targetView: 'operativa' | 'cockpit' | 'director' | 'reputacion';
  targetOperativaTab?: 'fichaje' | 'gastos' | 'reservas_voz' | 'rrhh_turnos' | 'economico_alertas' | 'monitor_sync';
  targetDirectorTab?: 'ux_ui_wireframes' | 'project_plan_agile' | 'software_architecture';
  accentColor: string;
  badgeBg: string;
}

const TOUR_STEPS: TourStep[] = [
  {
    id: 'intro_offline',
    moduleBadge: 'Tu Restaurante Siempre Activo',
    title: 'Bienvenido a ConfiA360: Tu Restaurante en Marcha',
    description:
      'ConfiA360 está pensada para el ritmo real de un restaurante. Si la conexión a internet o el Wi-Fi falla en la cocina, en la bodega o en la terraza, todo sigue funcionando igual de rápido. Los fichajes, los pedidos y las cuentas se guardan en el teléfono y se mandan solos en cuanto vuelva la señal.',
    keyHighlights: [
      'El servicio nunca se detiene: atiende a los clientes y organiza el turno sin depender de internet',
      'Instálala en el móvil o tablet como cualquier aplicación de tu teléfono',
      'Tranquilidad total: nada se borra ni se pierde si se corta la luz o el Wi-Fi',
    ],
    icon: Smartphone,
    targetView: 'operativa',
    targetOperativaTab: 'fichaje',
    accentColor: '#80D518',
    badgeBg: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
  },
  {
    id: 'fichaje_cero_toque',
    moduleBadge: 'Equipo & Personal',
    title: 'Fichaje Rápido de Empleados',
    description:
      'Tus cocineros, camareros y personal de sala fichan la entrada, la salida y sus descansos con un solo toque desde su propio teléfono. El sistema comprueba que están físicamente en el restaurante para cumplir con la ley de control horario sin necesidad de aparatos caros en la pared.',
    keyHighlights: [
      'Cumple la ley de registro de jornada de forma sencilla y sin papeles',
      'Funciona incluso en el sótano o la cocina sin cobertura',
      'Registra la hora exacta de entrada y salida de cada turno de trabajo',
    ],
    icon: Fingerprint,
    targetView: 'operativa',
    targetOperativaTab: 'fichaje',
    accentColor: '#0067B9',
    badgeBg: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
  },
  {
    id: 'ocr_gastos_3_pasos',
    moduleBadge: 'Albaranes, Facturas & Escandallos (Pro)',
    title: 'Albaranes, Facturas y Control 360º de Platos',
    description:
      'Al cargar cualquier documento (foto a un albarán, factura o ticket), se categoriza solo y se conecta a todas las entidades del restaurante a la vez: proveedor, local, productos, escandallos, tesorería y turno de recepción. En la versión Pro, se actualizan las fichas de los productos, se auditan las subidas de precio, se recalcula el margen del plato en el escandallo y salta una alarma si el margen cae, presentándote si hay otros proveedores más baratos en el mercado.',
    keyHighlights: [
      'Asociación automática a 6 entidades del sistema: cero pantallas aisladas',
      'Versión Pro: Actualiza productos, vigila subidas de precios y protege el margen de tus platos',
      'Comparativa de proveedores alternativos y tendencias de precios en el mercado',
      'Modifica datos, visualiza el documento original y gestiona sus 8 estados (borrador, revisión, aprobación, contabilizada, pagada o en disputa)',
    ],
    icon: Receipt,
    targetView: 'operativa',
    targetOperativaTab: 'gastos',
    accentColor: '#D6A52A',
    badgeBg: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
  },
  {
    id: 'reservas_voz_24_7',
    moduleBadge: 'Mesas & Reservas',
    title: 'Recepción de Reservas Telefónicas 24 Horas',
    description:
      'Un recepcionista virtual atiende el teléfono del restaurante a cualquier hora del día y de la noche. Apunta mesas para comidas y cenas, anota alergias e intolerancias de los clientes, y pide una fianza para grupos para que nadie te deje una mesa colgada.',
    keyHighlights: [
      'No pierdas llamadas ni reservas cuando el restaurante está lleno o cerrado',
      'Avisos claros de alérgenos que van directos a cocina para evitar sustos',
      'Pide señal o fianza a grupos para evitar que reserven y no aparezcan',
    ],
    icon: PhoneCall,
    targetView: 'operativa',
    targetOperativaTab: 'reservas_voz',
    accentColor: '#9333EA',
    badgeBg: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
  },
  {
    id: 'monitor_sync_offline',
    moduleBadge: 'Guardado Seguro',
    title: 'Envío y Guardado de Datos del Restaurante',
    description:
      'Aquí puedes ver los datos que se están guardando mientras trabajas. Si dos personas modifican la misma información a la vez mientras no hay internet, el sistema te ayuda a elegir cuál guardar con un solo botón, sin perder datos.',
    keyHighlights: [
      'Comprueba qué movimientos están pendientes de enviarse a la central',
      'Si dos personas tocan la misma comanda o mesa, tú decides cuál conservar',
      'Prueba cómo responde tu restaurante apagando y encendiendo la conexión de prueba',
    ],
    icon: Database,
    targetView: 'operativa',
    targetOperativaTab: 'monitor_sync',
    accentColor: '#10B981',
    badgeBg: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
  },
  {
    id: 'cockpit_360_roles',
    moduleBadge: 'Dirección del Restaurante',
    title: 'Panel de Mando para Dueño, Cocina y Sala',
    description:
      'Cada persona del restaurante ve solo lo que le importa para trabajar mejor: el dueño ve los beneficios, ventas y costes del personal; el jefe de cocina revisa los costes de platos, ingredientes y alérgenos del día; y el encargado de sala ve las mesas ocupadas y la terraza.',
    keyHighlights: [
      'Tres vistas pensadas para cada puesto: Dueño, Jefe de Cocina y Encargado de Sala',
      'De un vistazo sabes si el restaurante está ganando dinero hoy',
      'Escucha el resumen de cómo va el día con el botón de voz',
    ],
    icon: LayoutDashboard,
    targetView: 'cockpit',
    accentColor: '#80D518',
    badgeBg: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
  },
  {
    id: 'modelo_relacional_360',
    moduleBadge: 'Grafo & Modelo de Datos 360º',
    title: 'Modelo Relacional 360º: Cero Pantallas Aisladas',
    description:
      'ConfiA360 interconecta las 10 entidades maestras del restaurante de forma bidireccional: Factura, Línea de Factura, Artículo/Producto, Receta, Plato/Escandallo, Reserva, Cliente CRM, Turno RRHH, Gastos y Documento. Desde cualquier entidad accedes a todo su impacto y la aplicación navega en directo a la pantalla real en segundo plano.',
    keyHighlights: [
      'Factura: navega a Proveedor, Documento, Líneas, Pagos, IVA, Aprobaciones (8 estados) y Auditoría',
      'Línea de Factura: conecta a Artículo/Producto, Lote, Coste, Existencias, Receta y Producto de venta',
      'Artículo, Receta y Escandallo: actualiza costes, alerta de subidas y compara proveedores alternativos',
      'Reserva, Turno y Gastos: conecta a Cliente CRM, Fichajes, Cupones, Auditoría y Contabilidad',
    ],
    icon: GitBranch,
    targetView: 'cockpit',
    accentColor: '#0067B9',
    badgeBg: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
  },
  {
    id: 'confia360_reputacion',
    moduleBadge: 'Reputación & Experiencia 360º',
    title: 'ConfIA360 Reputación: Calidad & Reseñas',
    description:
      'Capa transversal que conecta el servicio real con WhatsApp, Google Business Profile y TripAdvisor. Incorpora firewall bipolar: las valoraciones 4–5★ se derivan a Google Maps con 1 clic, mientras que las notas 1–3★ se interceptan privadamente como incidencias internas para que el gerente las resuelva antes de que se publiquen en internet, asignando tareas correctivas a cocina y sala.',
    keyHighlights: [
      'Encuestas automáticas WhatsApp post-servicio o entrega a domicilio',
      'Intercepción privada de quejas con aviso push inmediato al gerente',
      'Asistente de respuestas protocolizadas con IA y multicanal (Google, TripAdvisor, TheFork)',
      'Tareas operativas KDS asignadas a turnos y partidas de cocina',
      'ImpactDashboard transversal para inspeccionar recetas, stock, margen y reputación',
    ],
    icon: Star,
    targetView: 'reputacion',
    accentColor: '#F59E0B',
    badgeBg: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
  },
];

interface VoiceAgentNavigationTarget {
  view: 'operativa' | 'cockpit' | 'director' | 'reputacion';
  operativaTab?: 'fichaje' | 'gastos' | 'reservas_voz' | 'rrhh_turnos' | 'economico_alertas' | 'monitor_sync';
  directorTab?: 'ux_ui_wireframes' | 'project_plan_agile' | 'software_architecture';
  moduleName: string;
  explanation: string;
}

const LOCAL_STORAGE_TOUR_KEY = 'confia360_pwa_tour_seen_v1';

export const QuickStartTour: React.FC = () => {
  const {
    isTourOpen,
    setIsTourOpen,
    initialTourMode,
    showTourCompletionMessage,
    setActiveView,
    setActiveOperativaTab,
    setActiveDirectorTab,
    announceAriaLive,
  } = useApp();

  const [currentStep, setCurrentStep] = useState<number>(0);
  const [dontShowAgain, setDontShowAgain] = useState<boolean>(true);
  const [activeTabMode, setActiveTabMode] = useState<'tour' | 'voice_agent'>('tour');

  // Sync mode with trigger
  useEffect(() => {
    if (isTourOpen) {
      setActiveTabMode(initialTourMode);
    }
  }, [isTourOpen, initialTourMode]);

  // Audio Playback State (TTS for Tour)
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);

  // Voice Agent State (Ask & Navigate)
  const [voiceQuery, setVoiceQuery] = useState<string>('');
  const [isListeningMic, setIsListeningMic] = useState<boolean>(false);
  const [voiceErrorMessage, setVoiceErrorMessage] = useState<string | null>(null);
  const [agentAnswer, setAgentAnswer] = useState<{
    query: string;
    target: VoiceAgentNavigationTarget;
  } | null>(null);

  const speechRecognitionRef = useRef<any>(null);

  // Stop any playing TTS
  const stopAudio = useCallback(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
    }
  }, []);

  // Text-To-Speech helper
  const speakText = useCallback((textToSpeak: string, onEnd?: () => void) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.lang = 'es-ES';
    utterance.rate = 1.05;
    utterance.pitch = 1.0;

    utterance.onstart = () => setIsPlayingAudio(true);
    utterance.onend = () => {
      setIsPlayingAudio(false);
      onEnd?.();
    };
    utterance.onerror = () => setIsPlayingAudio(false);

    window.speechSynthesis.speak(utterance);
  }, []);

  // Play audio of the current tour step
  const handleToggleStepAudio = () => {
    if (isPlayingAudio) {
      stopAudio();
    } else {
      const step = TOUR_STEPS[currentStep];
      const script = `${step.title}. ${step.description}. Aspectos clave: ${step.keyHighlights.join(', ')}`;
      speakText(script);
    }
  };

  // Check on first visit if tour should automatically launch
  useEffect(() => {
    try {
      const hasSeenTour = localStorage.getItem(LOCAL_STORAGE_TOUR_KEY);
      if (!hasSeenTour) {
        const timer = setTimeout(() => {
          setIsTourOpen(true);
          announceAriaLive('Iniciando tour guiado de bienvenida de ConfiA360 PWA');
        }, 800);
        return () => clearTimeout(timer);
      }
    } catch {
      // Ignore local storage error in private mode
    }
  }, [setIsTourOpen, announceAriaLive]);

  // Sync app view and tab when step changes so the user sees the real feature in background
  useEffect(() => {
    if (!isTourOpen || activeTabMode !== 'tour') return;

    const step = TOUR_STEPS[currentStep];
    if (step) {
      setActiveView(step.targetView);
      if (step.targetOperativaTab) {
        setActiveOperativaTab(step.targetOperativaTab);
      }
      announceAriaLive(`Paso ${currentStep + 1} de ${TOUR_STEPS.length}: ${step.title}`);
    }

    // Stop audio on step change so speech doesn't overlap
    stopAudio();
  }, [currentStep, isTourOpen, activeTabMode, setActiveView, setActiveOperativaTab, announceAriaLive, stopAudio]);

  const handleClose = useCallback(() => {
    stopAudio();
    if (dontShowAgain) {
      try {
        localStorage.setItem(LOCAL_STORAGE_TOUR_KEY, 'true');
      } catch {
        // Safe ignore
      }
    }
    setIsTourOpen(false);
    showTourCompletionMessage(
      '🎉 ¡Tutorial completado! Tu restaurante ya está listo para operar sin fallos. Toca en cualquier parte de este aviso para quitarlo.'
    );
    announceAriaLive('Tour guiado finalizado');
  }, [dontShowAgain, setIsTourOpen, showTourCompletionMessage, announceAriaLive, stopAudio]);

  const handleNext = () => {
    if (currentStep < TOUR_STEPS.length - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      handleClose();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  // Web Speech API for voice queries
  const handleToggleListening = () => {
    setVoiceErrorMessage(null);

    if (isListeningMic) {
      speechRecognitionRef.current?.stop();
      setIsListeningMic(false);
      return;
    }

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setVoiceErrorMessage(
        'Tu navegador no soporta entrada de voz por micrófono. Puedes escribir tu duda en el recuadro o tocar una pregunta rápida.'
      );
      announceAriaLive('Entrada por voz no disponible en este navegador. Escribe tu duda en el recuadro.');
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = 'es-ES';
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        setIsListeningMic(true);
        announceAriaLive('Escuchando tu pregunta sobre el restaurante...');
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setVoiceQuery(transcript);
        processVoiceQuery(transcript);
      };

      recognition.onerror = () => {
        setIsListeningMic(false);
        setVoiceErrorMessage('No se ha detectado voz o no se concedieron permisos. Prueba a escribir tu pregunta.');
      };

      recognition.onend = () => {
        setIsListeningMic(false);
      };

      speechRecognitionRef.current = recognition;
      recognition.start();
    } catch {
      setIsListeningMic(false);
      setVoiceErrorMessage('No se ha podido iniciar el micrófono. Puedes escribir tu duda en el cuadro de texto.');
    }
  };

  // Hospitality Knowledge Intent Resolver: matches queries in clear restaurant terms
  const processVoiceQuery = (queryText: string) => {
    const q = queryText.toLowerCase().trim();
    if (!q) return;

    let target: VoiceAgentNavigationTarget;

    if (
      q.includes('fich') ||
      q.includes('hora') ||
      q.includes('gps') ||
      q.includes('jornada') ||
      q.includes('reloj') ||
      q.includes('asistencia') ||
      q.includes('entrad') ||
      q.includes('salid')
    ) {
      target = {
        view: 'operativa',
        operativaTab: 'fichaje',
        moduleName: 'Fichaje del Personal',
        explanation:
          'En Fichaje del Personal, cocineros y camareros marcan su entrada, descansos y salida en 1 segundo desde su móvil, cumpliendo la ley laboral sin necesidad de aparatos caros en la pared.',
      };
    } else if (
      q.includes('escandallo') ||
      q.includes('margen') ||
      q.includes('plato') ||
      q.includes('receta') ||
      q.includes('pro') ||
      q.includes('subida') ||
      q.includes('coste')
    ) {
      target = {
        view: 'operativa',
        operativaTab: 'gastos',
        moduleName: 'Albaranes, Escandallos & Versión Pro',
        explanation:
          'En la versión Pro, cada albarán o factura actualiza el coste de los platos en sus escandallos. Si el distribuidor sube el precio de la carne o verdura, el sistema recalcula el margen de beneficio y activa una alarma para proteger tu ganancia, mostrándote además si hay otros proveedores más baratos en el mercado.',
      };
    } else if (
      q.includes('estado') ||
      q.includes('contabiliz') ||
      q.includes('disputa') ||
      q.includes('aprobac') ||
      q.includes('borrador')
    ) {
      target = {
        view: 'operativa',
        operativaTab: 'gastos',
        moduleName: 'Estados de Factura & Albaranes',
        explanation:
          'Al cargar cualquier documento, el sistema lo categoriza y lo asocia a 6 entidades a la vez. Puedes modificar datos y gestionar sus 8 estados: borrador, revisión, aprobación, aprobada, contabilizada, pagada, en disputa o rechazada.',
      };
    } else if (
      q.includes('modelo') ||
      q.includes('relacion') ||
      q.includes('grafo') ||
      q.includes('rosetta') ||
      q.includes('360')
    ) {
      target = {
        view: 'cockpit',
        moduleName: 'Modelo Relacional 360º (Piedra Rosetta)',
        explanation:
          'El modelo de datos conecta 10 entidades maestras sin pantallas aisladas: Factura (Proveedor, documento, líneas, pagos, IVA, aprobaciones y audit); Línea (Artículo, lote, coste, existencias, receta y venta); Artículo (Proveedores, stock, recetas, escandallos); Receta (Ingredientes, mermas, alérgenos); Plato/Escandallo (Margen, campañas, cupones); Reserva (Cliente, llamada voz, fianza); Cliente (Consumos, RGPD); Turno (Empleado, fichajes, ausencias); Gastos (Centro coste, IVA); y Documento (Todas las N entidades asociadas con auditoría).',
      };
    } else if (
      q.includes('linea de factura') ||
      q.includes('lineas')
    ) {
      target = {
        view: 'operativa',
        operativaTab: 'gastos',
        moduleName: 'Líneas de Factura & Escandallos',
        explanation:
          'Desde cada Línea de factura puedes navegar a: Artículo/producto maestro, Lote con fecha de caducidad, Coste unitario y desviación, Existencias en tiempo real, Receta donde se elabora y Producto final de venta en la carta digital.',
      };
    } else if (
      q.includes('document') ||
      q.includes('asocia') ||
      q.includes('categoriz')
    ) {
      target = {
        view: 'operativa',
        operativaTab: 'gastos',
        moduleName: 'Digitalización & Asociación N-a-N',
        explanation:
          'Al cargar cualquier documento, el sistema lo categoriza automáticamente y lo asocia a las N entidades que corresponda (proveedor, local, productos, escandallos, tesorería y turno de recepción), con hash criptográfico de auditoría y sincronización offline.',
      };
    } else if (
      q.includes('gasto') ||
      q.includes('ticket') ||
      q.includes('ocr') ||
      q.includes('factura') ||
      q.includes('iva') ||
      q.includes('proveedor') ||
      q.includes('albar') ||
      q.includes('compra') ||
      q.includes('mercado') ||
      q.includes('alternativ')
    ) {
      target = {
        view: 'operativa',
        operativaTab: 'gastos',
        moduleName: 'Control de Facturas y Gastos',
        explanation:
          'En Facturas y Gastos puedes hacer una foto a los albaranes y facturas de la compra de carne, pescado o verdura. El sistema lee solo la base y el IVA para que no teclees nada y no pagues dos veces al proveedor, comparando precios de mercado.',
      };
    } else if (
      q.includes('reserva') ||
      q.includes('llamada') ||
      q.includes('telefono') ||
      q.includes('mesa') ||
      q.includes('comensal') ||
      q.includes('fianza') ||
      q.includes('no show') ||
      q.includes('noshow') ||
      q.includes('alerg')
    ) {
      target = {
        view: 'operativa',
        operativaTab: 'reservas_voz',
        moduleName: 'Recepción y Reservas 24 Horas',
        explanation:
          'En Reservas de Mesas tienes un asistente virtual que atiende el teléfono a cualquier hora, anota comensales y alergias para cocina, y pide fianza para evitar que te dejen mesas colgadas.',
      };
    } else if (
      q.includes('turno') ||
      q.includes('cuadrante') ||
      q.includes('vacaci') ||
      q.includes('cambio') ||
      q.includes('rrhh') ||
      q.includes('personal') ||
      q.includes('empleado') ||
      q.includes('camarero')
    ) {
      target = {
        view: 'operativa',
        operativaTab: 'rrhh_turnos',
        moduleName: 'Turnos y Horarios del Equipo',
        explanation:
          'En Turnos del Equipo puedes ver quién trabaja hoy en cocina y sala, coordinar los cuadrantes de comidas y cenas y gestionar cambios de día entre compañeros.',
      };
    } else if (
      q.includes('tesorer') ||
      q.includes('caja') ||
      q.includes('prevision') ||
      q.includes('econom') ||
      q.includes('dinero') ||
      q.includes('pago') ||
      q.includes('cobro')
    ) {
      target = {
        view: 'operativa',
        operativaTab: 'economico_alertas',
        moduleName: 'Tesorería y Dinero en Caja',
        explanation:
          'En Tesorería y Dinero en Caja puedes consultar los pagos a proveedores previstos y el dinero disponible a 30 días para anticiparte y que nunca te falte liquidez.',
      };
    } else if (
      q.includes('offline') ||
      q.includes('cola') ||
      q.includes('sync') ||
      q.includes('conexion') ||
      q.includes('wifi') ||
      q.includes('internet') ||
      q.includes('conflicto') ||
      q.includes('cobertura') ||
      q.includes('guardad')
    ) {
      target = {
        view: 'operativa',
        operativaTab: 'monitor_sync',
        moduleName: 'Guardado y Sincronización de Datos',
        explanation:
          'En Guardado de Datos puedes comprobar que todo lo que anotas en cocina o bodega sin cobertura se guarda en el teléfono y se manda solo cuando vuelve la conexión.',
      };
    } else if (
      q.includes('dueño') ||
      q.includes('chef') ||
      q.includes('cocina') ||
      q.includes('sala') ||
      q.includes('maitre') ||
      q.includes('ebitda') ||
      q.includes('cockpit') ||
      q.includes('cuadro de mando') ||
      q.includes('rentabil') ||
      q.includes('rol') ||
      q.includes('beneficio') ||
      q.includes('venta')
    ) {
      target = {
        view: 'cockpit',
        moduleName: 'Cuadro de Mandos del Restaurante',
        explanation:
          'En el Cuadro de Mandos puedes ver de un vistazo si el restaurante está ganando dinero hoy, con pantallas a medida para el Dueño (ventas y margen), el Jefe de Cocina (coste de platos y alérgenos) y el Jefe de Sala (mesas y terraza).',
      };
    } else if (
      q.includes('reputaci') ||
      q.includes('reseña') ||
      q.includes('resena') ||
      q.includes('google') ||
      q.includes('tripadvisor') ||
      q.includes('whatsapp') ||
      q.includes('queja') ||
      q.includes('incidencia') ||
      q.includes('estrella') ||
      q.includes('firewall') ||
      q.includes('kds') ||
      q.includes('competidor')
    ) {
      target = {
        view: 'reputacion',
        moduleName: 'ConfIA360 Reputación & Calidad',
        explanation:
          'En ConfIA360 Reputación gestionas la experiencia del comensal. Envía encuestas por WhatsApp tras la cuenta; si puntúan 4 o 5 estrellas les invita a dejar reseña en Google, y si puntúan de 1 a 3 estrellas intercepta la queja en privado para que gerencia y cocina lo resuelvan de inmediato sin que llegue a internet.',
      };
    } else if (
      q.includes('arquitect') ||
      q.includes('react') ||
      q.includes('node') ||
      q.includes('base de dato') ||
      q.includes('tecnolog')
    ) {
      target = {
        view: 'director',
        directorTab: 'software_architecture',
        moduleName: 'Arquitectura del Sistema',
        explanation:
          'Muestra cómo está construida la aplicación del restaurante para funcionar sin caídas y almacenar los datos de forma segura en cada teléfono.',
      };
    } else if (
      q.includes('plan') ||
      q.includes('agil') ||
      q.includes('mvp') ||
      q.includes('roadmap') ||
      q.includes('proyecto')
    ) {
      target = {
        view: 'director',
        directorTab: 'project_plan_agile',
        moduleName: 'Plan de Proyecto y Tareas',
        explanation:
          'Organiza las tareas prioritarias del restaurante y el calendario de trabajo del equipo.',
      };
    } else {
      // Default fallback match
      target = {
        view: 'cockpit',
        moduleName: 'Cuadro de Mandos del Restaurante',
        explanation: `Para "${queryText}", la mejor pantalla es el Cuadro de Mandos, donde ves reunidas las ventas, las mesas y la actividad de la cocina.`,
      };
    }

    setAgentAnswer({
      query: queryText,
      target,
    });

    // Sincronización en directo: la app navega en directo a la pantalla en segundo plano
    setActiveView(target.view);
    if (target.operativaTab) {
      setActiveOperativaTab(target.operativaTab);
    }
    if (target.directorTab) {
      setActiveDirectorTab(target.directorTab);
    }
    announceAriaLive(`Navegando en directo a ${target.moduleName} en segundo plano`);

    // Speak the explanation aloud
    speakText(target.explanation);
  };

  // Perform immediate navigation to the resolved module
  const handleNavigateToTarget = (target: VoiceAgentNavigationTarget) => {
    stopAudio();
    setActiveView(target.view);
    if (target.operativaTab) {
      setActiveOperativaTab(target.operativaTab);
    }
    if (target.directorTab) {
      setActiveDirectorTab(target.directorTab);
    }
    announceAriaLive(`Navegando a ${target.moduleName}`);
    handleClose();
  };

  // Keyboard navigation (Esc, Arrows)
  useEffect(() => {
    if (!isTourOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleClose();
      } else if (activeTabMode === 'tour') {
        if (e.key === 'ArrowRight') {
          handleNext();
        } else if (e.key === 'ArrowLeft') {
          handlePrev();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isTourOpen, currentStep, activeTabMode, handleClose]);

  if (!isTourOpen) return null;

  const step = TOUR_STEPS[currentStep];
  const StepIcon = step.icon;
  const isLastStep = currentStep === TOUR_STEPS.length - 1;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Tour guiado y Agente de Voz de ConfiA360 PWA"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-xs animate-in fade-in duration-200"
    >
      {/* Tour Card Box */}
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-white/20 overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header Ribbon with Mode Switcher & Close button */}
        <div className="relative bg-gradient-to-r from-[#022853] via-[#0067B9] to-[#022853] text-white p-5 sm:p-6">
          
          <div className="flex items-center justify-between gap-3 mb-3">
            {/* Mode Segmented Switcher */}
            <div className="flex items-center bg-white/10 p-1 rounded-xl border border-white/20">
              <button
                onClick={() => {
                  stopAudio();
                  setActiveTabMode('tour');
                }}
                className={`touch-target-min flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition ${
                  activeTabMode === 'tour'
                    ? 'bg-[#80D518] text-[#022853] shadow-xs font-black'
                    : 'text-blue-100 hover:text-white'
                }`}
              >
                <Compass className="w-3.5 h-3.5" />
                <span>Tour Paso a Paso</span>
              </button>
              
              <button
                onClick={() => {
                  stopAudio();
                  setActiveTabMode('voice_agent');
                }}
                className={`touch-target-min flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition ${
                  activeTabMode === 'voice_agent'
                    ? 'bg-[#80D518] text-[#022853] shadow-xs font-black'
                    : 'text-blue-100 hover:text-white'
                }`}
              >
                <Bot className="w-3.5 h-3.5" />
                <span>Agente de Voz: Pregunta & Llévame</span>
              </button>
            </div>

            <div className="flex items-center gap-2">
              {/* Audio Playback Button (SpeechSynthesis) */}
              {activeTabMode === 'tour' && (
                <button
                  onClick={handleToggleStepAudio}
                  className={`touch-target-min flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-bold transition border ${
                    isPlayingAudio
                      ? 'bg-[#80D518] text-[#022853] border-[#80D518] animate-pulse'
                      : 'bg-white/15 text-white border-white/20 hover:bg-white/25'
                  }`}
                  title={isPlayingAudio ? 'Pausar audio del tutorial' : 'Oír este paso con síntesis de voz'}
                  aria-label={isPlayingAudio ? 'Detener lectura en voz alta' : 'Escuchar este paso'}
                >
                  {isPlayingAudio ? (
                    <>
                      <Square className="w-3.5 h-3.5 fill-current" />
                      <span className="hidden sm:inline font-black">Pausar Audio</span>
                    </>
                  ) : (
                    <>
                      <Volume2 className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Oír Tutorial</span>
                    </>
                  )}
                </button>
              )}

              {/* Close Button */}
              <button
                onClick={handleClose}
                className="touch-target-min w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/80 hover:text-white transition"
                aria-label="Cerrar tour guiado"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {activeTabMode === 'tour' ? (
            <div>
              <div className="flex items-start gap-3.5 mt-2">
                <div className="w-12 h-12 rounded-2xl bg-white/15 border border-white/20 flex items-center justify-center shrink-0 shadow-inner">
                  <StepIcon className="w-6 h-6 text-[#80D518]" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full border ${step.badgeBg}`}>
                      {step.moduleBadge}
                    </span>
                    <span className="text-[11px] text-blue-200 font-bold">
                      {currentStep + 1} de {TOUR_STEPS.length}
                    </span>
                  </div>
                  <h3 className="font-brand font-black text-xl text-white leading-tight">
                    {step.title}
                  </h3>
                </div>
              </div>

              {/* Progress bar */}
              <div className="mt-4 w-full bg-white/15 rounded-full h-1.5 overflow-hidden">
                <div
                  className="bg-[#80D518] h-full transition-all duration-300 rounded-full"
                  style={{ width: `${((currentStep + 1) / TOUR_STEPS.length) * 100}%` }}
                />
              </div>
            </div>
          ) : (
            <div>
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-[#80D518] text-[#022853] flex items-center justify-center shrink-0 shadow-md">
                  <Bot className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-brand font-black text-xl text-white leading-tight">
                    Agente de Voz & Navegación Guiada
                  </h3>
                  <p className="text-xs text-blue-100 mt-0.5">
                    Pregunta sobre cualquier módulo con tu voz o por escrito y el agente te explicará el contenido y te llevará directamente allí.
                  </p>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Tab 1: Tour Guiado Paso a Paso */}
        {activeTabMode === 'tour' && (
          <>
            <div className="p-5 sm:p-6 space-y-4 overflow-y-auto">
              <p className="text-sm text-slate-700 leading-relaxed font-normal">
                {step.description}
              </p>

              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80 space-y-2">
                <span className="text-[11px] font-black uppercase tracking-wider text-[#022853] block">
                  Puntos Clave del Módulo:
                </span>
                <ul className="space-y-2">
                  {step.keyHighlights.map((hl, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-xs text-slate-700 leading-snug">
                      <CheckCircle2 className="w-4 h-4 text-[#48A222] shrink-0 mt-0.5" />
                      <span>{hl}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Contextual Banner Note */}
              <div className="flex items-center justify-between p-3 bg-blue-50/80 border border-blue-200/80 rounded-xl text-xs text-blue-900">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#0067B9] shrink-0" />
                  <span>
                    La aplicación navega en directo a <strong>{step.title}</strong> en segundo plano para que veas la pantalla real.
                  </span>
                </div>
                {isPlayingAudio && (
                  <span className="flex items-center gap-1 text-[10px] font-black text-[#0067B9] uppercase bg-white px-2 py-0.5 rounded-full border border-blue-200">
                    <Radio className="w-3 h-3 text-red-500 animate-pulse" />
                    Reproduciendo
                  </span>
                )}
              </div>
            </div>

            {/* Footer Actions */}
            <div className="bg-slate-50 border-t border-slate-200 px-5 sm:px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              
              {/* Checkbox Don't show again */}
              <label className="flex items-center gap-2 text-xs text-slate-600 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={dontShowAgain}
                  onChange={(e) => setDontShowAgain(e.target.checked)}
                  className="rounded text-[#0067B9] focus:ring-[#0067B9] w-4 h-4 border-slate-300"
                />
                <span>No volver a mostrar al iniciar</span>
              </label>

              {/* Step buttons */}
              <div className="flex items-center gap-2 self-end sm:self-auto">
                {currentStep > 0 && (
                  <button
                    onClick={handlePrev}
                    className="touch-target-min px-3.5 py-2 rounded-xl text-xs font-bold text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 transition flex items-center gap-1.5"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Anterior</span>
                  </button>
                )}

                <button
                  onClick={handleClose}
                  className="touch-target-min px-3 py-2 rounded-xl text-xs font-bold text-slate-500 hover:text-slate-800 transition"
                >
                  Saltar tour
                </button>

                <button
                  onClick={handleNext}
                  className="touch-target-min px-4 py-2 rounded-xl text-xs font-bold text-white bg-[#0067B9] hover:bg-[#022853] shadow-sm transition flex items-center gap-1.5"
                >
                  <span>{isLastStep ? '¡Empezar a Usar!' : 'Siguiente'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>
          </>
        )}

        {/* Tab 2: Agente de Voz & Preguntas con Auto-Navegación ("Llevarte allí") */}
        {activeTabMode === 'voice_agent' && (
          <div className="p-5 sm:p-6 space-y-4 overflow-y-auto">
            
            {/* Voice Input Box & Form */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                processVoiceQuery(voiceQuery);
              }}
              className="space-y-3"
            >
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <input
                    type="text"
                    value={voiceQuery}
                    onChange={(e) => setVoiceQuery(e.target.value)}
                    placeholder="Pregunta algo, ej: '¿Cómo ficho?' o 'Quiero escanear facturas'..."
                    className="w-full text-xs sm:text-sm pl-4 pr-10 py-3 rounded-2xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#0067B9] bg-slate-50 focus:bg-white transition"
                  />
                  {voiceQuery && (
                    <button
                      type="button"
                      onClick={() => setVoiceQuery('')}
                      className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {/* Mic SpeechRecognition Button */}
                <button
                  type="button"
                  onClick={handleToggleListening}
                  className={`touch-target-min px-4 rounded-2xl flex items-center justify-center transition border ${
                    isListeningMic
                      ? 'bg-red-500 text-white border-red-600 animate-pulse ring-2 ring-red-400/40'
                      : 'bg-blue-50 text-[#0067B9] border-blue-200 hover:bg-blue-100'
                  }`}
                  title={isListeningMic ? 'Detener micrófono' : 'Hablar por micrófono'}
                  aria-label={isListeningMic ? 'Detener escucha' : 'Activar micrófono'}
                >
                  {isListeningMic ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                </button>

                {/* Send Button */}
                <button
                  type="submit"
                  disabled={!voiceQuery.trim()}
                  className="touch-target-min px-4 py-3 rounded-2xl bg-[#0067B9] text-white hover:bg-[#022853] disabled:opacity-40 disabled:cursor-not-allowed font-bold text-xs flex items-center gap-1.5 shadow-sm transition"
                >
                  <Send className="w-4 h-4" />
                  <span className="hidden sm:inline">Preguntar</span>
                </button>
              </div>

              {voiceErrorMessage && (
                <div className="flex items-center justify-between gap-2 text-xs text-amber-900 bg-amber-50 p-2.5 rounded-xl border border-amber-200">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0" />
                    <span>{voiceErrorMessage}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setVoiceErrorMessage(null)}
                    className="text-amber-700 hover:text-amber-950 p-0.5"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              {isListeningMic && (
                <div className="flex items-center gap-2 text-xs font-bold text-red-600 bg-red-50 p-2.5 rounded-xl border border-red-200 animate-pulse">
                  <Radio className="w-4 h-4" />
                  <span>Escuchando tu voz... Habla con normalidad en español.</span>
                </div>
              )}
            </form>

            {/* Quick Prompt Chips */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
                O pulsa una pregunta rápida sobre el negocio para oír la respuesta y llevarte:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {[
                  '¿Cuáles son las 10 relaciones del modelo de datos?',
                  '¿A qué entidades navega una línea de factura?',
                  '¿Cómo fichan los empleados su entrada y salida?',
                  '¿Qué pasa al cargar un albarán o factura?',
                  '¿Cómo funciona la versión Pro con escandallos y márgenes?',
                  '¿Cómo funciona el firewall de reseñas y WhatsApp en ConfIA360 Reputación?',
                  '¿Qué estados posibles puede tener una factura?',
                  '¿Cómo detecta subidas de precio y proveedores alternativos?',
                  '¿Qué es la Navegación 360º de ConfiA360?',
                  '¿Cómo atiende las reservas el recepcionista virtual?',
                  '¿Dónde veo si el restaurante da beneficios hoy?',
                ].map((chipPrompt, cIdx) => (
                  <button
                    key={cIdx}
                    onClick={() => {
                      setVoiceQuery(chipPrompt);
                      processVoiceQuery(chipPrompt);
                    }}
                    className="touch-target-min text-[11px] bg-slate-100 hover:bg-blue-50 hover:text-[#0067B9] text-slate-700 px-3 py-1.5 rounded-xl border border-slate-200 transition font-medium text-left"
                  >
                    {chipPrompt}
                  </button>
                ))}
              </div>
            </div>

            {/* Agent Response Card & Direct Navigation Button ("Llevarte allí") */}
            {agentAnswer && (
              <div className="bg-gradient-to-br from-blue-50/90 to-indigo-50/70 border border-blue-200 rounded-3xl p-5 space-y-3.5 shadow-xs animate-in slide-in-from-bottom-2 duration-200">
                
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="w-7 h-7 rounded-xl bg-[#0067B9] text-white flex items-center justify-center">
                      <Bot className="w-4 h-4" />
                    </span>
                    <div>
                      <span className="text-[10px] uppercase font-black text-[#0067B9] tracking-wider block">
                        Respuesta del Agente ConfiA360
                      </span>
                      <strong className="text-xs font-bold text-slate-900">
                        {agentAnswer.target.moduleName}
                      </strong>
                    </div>
                  </div>

                  {/* Audio Speaker for Agent Answer */}
                  <button
                    onClick={() => speakText(agentAnswer.target.explanation)}
                    className="touch-target-min p-2 rounded-xl bg-white hover:bg-blue-100 text-[#0067B9] border border-blue-200 transition"
                    title="Repetir respuesta en voz alta"
                    aria-label="Repetir explicación por voz"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>

                <p className="text-xs text-slate-800 leading-relaxed bg-white/80 p-3.5 rounded-2xl border border-blue-100">
                  {agentAnswer.target.explanation}
                </p>

                {/* Contextual Live Navigation Notice */}
                <div className="flex items-center gap-2 p-2.5 bg-blue-100/70 border border-blue-200 rounded-xl text-xs text-blue-950 font-medium">
                  <Sparkles className="w-4 h-4 text-[#0067B9] shrink-0" />
                  <span>
                    La aplicación navega en directo a <strong>{agentAnswer.target.moduleName}</strong> en segundo plano para que veas la pantalla real.
                  </span>
                </div>

                {/* Direct Action Button: Take user there */}
                <div className="pt-1 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <span className="text-[11px] text-slate-500">
                    Pulsa para saltar directamente a la pantalla:
                  </span>
                  
                  <button
                    onClick={() => handleNavigateToTarget(agentAnswer.target)}
                    className="touch-target-min px-4 py-2.5 rounded-2xl bg-[#022853] hover:bg-[#0067B9] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition"
                  >
                    <span>Llevarme a {agentAnswer.target.moduleName}</span>
                    <ArrowRight className="w-4 h-4 text-[#80D518]" />
                  </button>
                </div>

              </div>
            )}

            {!agentAnswer && (
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-center text-xs text-slate-500">
                <HelpCircle className="w-6 h-6 text-slate-300 mx-auto mb-1.5" />
                <span>Haz una pregunta por voz o selecciona un botón para que el agente te explique el módulo y te transporte en 1 clic.</span>
              </div>
            )}

          </div>
        )}

      </div>
    </div>
  );
};
