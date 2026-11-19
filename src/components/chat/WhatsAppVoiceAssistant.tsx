import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { USER_ROLES } from '../../types/userProfile';
import { ChatCommunication, INITIAL_WHATSAPP_MESSAGES } from '../../types/chatCommunication';
import {
  playMessageSentSound,
  playMessageReceivedSound,
  playVoiceNoteTone,
  speakAssistantResponse,
} from '../../services/soundEffects';
import {
  MessageCircle,
  Mic,
  MicOff,
  Send,
  X,
  ChevronDown,
  Volume2,
  VolumeX,
  Trash2,
  Play,
  Pause,
  CheckCheck,
  Check,
  Sparkles,
  Zap,
  ArrowRight,
  ExternalLink,
  ShieldCheck,
  Compass,
  Radio,
  FileText,
  Clock,
  RotateCcw,
  Phone,
  PhoneCall,
} from 'lucide-react';
import { GeminiLiveVoiceModal } from './GeminiLiveVoiceModal';

const STORAGE_KEY = 'confia360_chat_communications_v1';
const AUDIO_ENABLED_KEY = 'confia360_assistant_tts_enabled';

export const WhatsAppVoiceAssistant: React.FC = () => {
  const {
    activeRole,
    setActiveView,
    setActiveOperativaTab,
    openDrawer360,
    setIsReportModalOpen,
    setIsIdentityModalOpen,
    announceAriaLive,
    isVoiceAssistantOpen,
    setIsVoiceAssistantOpen,
    closeVoiceAssistant,
  } = useApp();

  // Communications State
  const [messages, setMessages] = useState<ChatCommunication[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // ignore
    }
    return INITIAL_WHATSAPP_MESSAGES;
  });

  // Save communications automatically whenever messages change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    } catch {
      // ignore
    }
  }, [messages]);

  // TTS audio response preference
  const [isTtsEnabled, setIsTtsEnabled] = useState<boolean>(() => {
    try {
      return localStorage.getItem(AUDIO_ENABLED_KEY) !== 'false';
    } catch {
      return true;
    }
  });

  const toggleTts = () => {
    setIsTtsEnabled((prev) => {
      const next = !prev;
      try {
        localStorage.setItem(AUDIO_ENABLED_KEY, String(next));
      } catch {
        // ignore
      }
      return next;
    });
  };

  // Input & Voice Recording State
  const [inputText, setInputText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [interimTranscript, setInterimTranscript] = useState('');
  const [micError, setMicError] = useState<string | null>(null);
  const [showVoiceFallbackModal, setShowVoiceFallbackModal] = useState(false);

  // Gemini Live Voice Call Modal State
  const [isLiveCallModalOpen, setIsLiveCallModalOpen] = useState(false);

  const handleLiveCallEnded = (summary: {
    durationSeconds: number;
    userTranscripts: string[];
    modelTranscripts: string[];
    detectedAction?: any;
  }) => {
    const durationText =
      summary.durationSeconds > 0
        ? `${summary.durationSeconds} seg`
        : 'Interacción rápida';

    const userLine =
      summary.userTranscripts.length > 0
        ? summary.userTranscripts[summary.userTranscripts.length - 1]
        : 'Conversación en vivo';

    const modelLine =
      summary.modelTranscripts.length > 0
        ? summary.modelTranscripts[summary.modelTranscripts.length - 1]
        : 'Sesión Gemini Live finalizada con éxito.';

    const callMsg: ChatCommunication = {
      id: `call_${Date.now()}`,
      sender: 'assistant',
      type: 'call_summary',
      text: `📞 Llamada de voz Gemini Live (${durationText})\n\n🗣️ Usuario: "${userLine}"\n✨ Asistente: "${modelLine}"`,
      voiceDuration: summary.durationSeconds,
      timestamp: getCurrentTime(),
      date: 'Hoy',
      status: 'read',
      executedAction: summary.detectedAction
        ? {
            actionKey: summary.detectedAction.section,
            label: summary.detectedAction.label,
            description: `Acción confirmada en la llamada de voz`,
            targetView:
              summary.detectedAction.section === 'fichaje' ||
              summary.detectedAction.section === 'gastos' ||
              summary.detectedAction.section === 'tesoreria' ||
              summary.detectedAction.section === 'reservas' ||
              summary.detectedAction.section === 'turnos'
                ? 'operativa'
                : 'cockpit',
            targetTab:
              summary.detectedAction.section === 'fichaje'
                ? 'fichaje'
                : summary.detectedAction.section === 'gastos'
                ? 'gastos'
                : summary.detectedAction.section === 'tesoreria'
                ? 'economico_alertas'
                : summary.detectedAction.section === 'reservas'
                ? 'reservas_voz'
                : summary.detectedAction.section === 'turnos'
                ? 'rrhh_turnos'
                : undefined,
            targetDrawer:
              summary.detectedAction.section === 'albaran' ? 'albaran' : undefined,
          }
        : undefined,
    };

    setMessages((prev) => [...prev, callMsg]);
    scrollToBottom();
  };

  // Voice Note Playback State
  const [playingVoiceId, setPlayingVoiceId] = useState<string | null>(null);
  const [playbackProgress, setPlaybackProgress] = useState<{ [id: string]: number }>({});
  const activeAudioStopRef = useRef<(() => void) | null>(null);

  // Web Speech API recognition reference
  const recognitionRef = useRef<any>(null);
  const recordingTimerRef = useRef<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom on new messages or opening
  const scrollToBottom = (smooth = true) => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: smooth ? 'smooth' : 'auto' });
    }, 80);
  };

  useEffect(() => {
    if (isVoiceAssistantOpen) {
      scrollToBottom(false);
      setTimeout(() => inputRef.current?.focus(), 250);
    }
  }, [isVoiceAssistantOpen]);

  // Format current time "HH:MM"
  const getCurrentTime = () => {
    const now = new Date();
    return `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
  };

  // Helper to execute actions based on command
  const processNavigationCommand = (rawText: string): {
    replyText: string;
    action?: ChatCommunication['executedAction'];
  } => {
    const text = rawText.toLowerCase().trim();

    // 1. Fichaje / Presencia
    if (
      text.includes('fich') ||
      text.includes('presenc') ||
      text.includes('entrad') ||
      text.includes('salid') ||
      text.includes('jornad')
    ) {
      setActiveView('operativa');
      setActiveOperativaTab('fichaje');
      return {
        replyText: '⏱️ Te he llevado a Presencia & Fichaje. Aquí puedes registrar tu entrada con un toque o consultar tus horas trabajadas.',
        action: {
          actionKey: 'fichaje',
          label: 'Presencia & Fichaje',
          description: 'Fichaje biométrico instantáneo y jornada laboral',
          targetView: 'operativa',
          targetTab: 'fichaje',
        },
      };
    }

    // 2. OCR / Gastos / Tickets
    if (
      text.includes('escan') ||
      text.includes('ticket') ||
      text.includes('gasto') ||
      text.includes('ocr') ||
      text.includes('albaran de compra') ||
      text.includes('foto')
    ) {
      setActiveView('operativa');
      setActiveOperativaTab('gastos');
      return {
        replyText: '🧾 Abriendo Facturas & Gastos OCR en 3 pasos. Sube o fotografía tu ticket para extraer automáticamente el importe, IVA y proveedor.',
        action: {
          actionKey: 'gastos',
          label: 'OCR Facturas & Gastos',
          description: 'Reconocimiento automático de tickets de gasto',
          targetView: 'operativa',
          targetTab: 'gastos',
        },
      };
    }

    // 3. Facturas Emitidas / Clientes / Ventas / Cobros
    if (
      text.includes('factur') ||
      text.includes('cobr') ||
      text.includes('vent') ||
      text.includes('ingres') ||
      text.includes('client') ||
      text.includes('emitir')
    ) {
      setActiveView('cockpit');
      return {
        replyText: '📊 Navegando al Cuadro de Mandos de Facturas & Cobros. Aquí puedes emitir nuevas facturas y revisar cobros pendientes.',
        action: {
          actionKey: 'facturacion',
          label: 'Facturación & Cobros',
          description: 'Cockpit 360 de ventas y facturas emitidas',
          targetView: 'cockpit',
        },
      };
    }

    // 4. Tesorería / Bancos / Saldo / Liquidez
    if (
      text.includes('tesor') ||
      text.includes('banc') ||
      text.includes('saldo') ||
      text.includes('liquid') ||
      text.includes('concili')
    ) {
      setActiveView('operativa');
      setActiveOperativaTab('economico_alertas');
      return {
        replyText: '🏦 Abriendo Tesorería & Bancos. Consulta el estado de liquidez, movimientos conciliados y alertas financieras.',
        action: {
          actionKey: 'tesoreria',
          label: 'Tesorería & Alertas',
          description: 'Flujo de caja, conciliación y alertas de liquidez',
          targetView: 'operativa',
          targetTab: 'economico_alertas',
        },
      };
    }

    // 5. Informe / Previsión Fiscal / IVA / IRPF
    if (
      text.includes('informe') ||
      text.includes('fiscal') ||
      text.includes('previs') ||
      text.includes('iva') ||
      text.includes('irpf') ||
      text.includes('trimestr') ||
      text.includes('cierre')
    ) {
      setIsReportModalOpen(true);
      return {
        replyText: '📑 Abriendo Informe Confía360 y Previsión Fiscal Trimestral. Estimación de IVA e IRPF lista para tu gestoría.',
        action: {
          actionKey: 'informe',
          label: 'Informe Confía360 & Previsión Fiscal',
          description: 'Modelos tributarios e informe ejecutivo oficial',
          isModal: true,
          modalName: 'report',
        },
      };
    }

    // 6. Reservas / Mesas / Agente de Sala
    if (
      text.includes('reserv') ||
      text.includes('mesa') ||
      text.includes('sala') ||
      text.includes('comedor') ||
      text.includes('agente voz')
    ) {
      setActiveView('operativa');
      setActiveOperativaTab('reservas_voz');
      return {
        replyText: '🍽️ Abriendo Recepción y Reservas de Sala 24/7. Gestiona comensales, depósitos y llamadas del agente telefónico.',
        action: {
          actionKey: 'reservas',
          label: 'Reservas de Sala 24/7',
          description: 'Gestión inteligente de mesas y llamadas de voz',
          targetView: 'operativa',
          targetTab: 'reservas_voz',
        },
      };
    }

    // 7. Turnos / Horarios / Empleados / RRHH
    if (
      text.includes('turn') ||
      text.includes('horari') ||
      text.includes('rrhh') ||
      text.includes('emplead') ||
      text.includes('personal') ||
      text.includes('camarer')
    ) {
      setActiveView('operativa');
      setActiveOperativaTab('rrhh_turnos');
      return {
        replyText: '👥 Abriendo Cuadrante de Turnos y RRHH. Organiza los servicios de mañana y noche y confirma asistencias.',
        action: {
          actionKey: 'turnos',
          label: 'Cuadrante de Turnos & RRHH',
          description: 'Planificación de turnos y personal del restaurante',
          targetView: 'operativa',
          targetTab: 'rrhh_turnos',
        },
      };
    }

    // 8. Cola de Sincronización / Monitor Sync / Offline
    if (
      text.includes('cola') ||
      text.includes('sync') ||
      text.includes('sincroniz') ||
      text.includes('offline') ||
      text.includes('conexion')
    ) {
      setActiveView('operativa');
      setActiveOperativaTab('monitor_sync');
      return {
        replyText: '📡 Abriendo Monitor de Cola de Sincronización PWA. Revisa las transacciones pendientes de sincronizar con el servidor.',
        action: {
          actionKey: 'sync',
          label: 'Monitor de Sincronización',
          description: 'Cola offline-first y resolución de conflictos',
          targetView: 'operativa',
          targetTab: 'monitor_sync',
        },
      };
    }

    // 9. Albarán / Traza 360 / Transversal
    if (
      text.includes('360') ||
      text.includes('albaran') ||
      text.includes('traza') ||
      text.includes('pedido') ||
      text.includes('proveedor')
    ) {
      openDrawer360('albaran');
      return {
        replyText: '📦 Abriendo el Hub Transversal 360º de Albaranes. Trazabilidad completa desde el pedido hasta el cobro.',
        action: {
          actionKey: 'albaran360',
          label: 'Hub Transversal Albarán 360',
          description: 'Navegación contextual 360º de pedidos y albaranes',
          targetDrawer: 'albaran',
        },
      };
    }

    // 10. Datos de Identidad / NIF / CIF / Empresa
    if (
      text.includes('identidad') ||
      text.includes('cif') ||
      text.includes('nif') ||
      text.includes('datos') ||
      text.includes('empresa') ||
      text.includes('cuenta') ||
      text.includes('iban')
    ) {
      setIsIdentityModalOpen(true);
      return {
        replyText: '👤 Abriendo tus Datos de Identidad y Empresa. Consulta tu NIF/CIF, Razón Social, IBAN y certificado digital.',
        action: {
          actionKey: 'identidad',
          label: 'Datos de Identidad & CIF',
          description: 'Expediente fiscal y bancario del negocio',
          isModal: true,
          modalName: 'identity',
        },
      };
    }

    // 11. Inicio / Home / Pantalla Principal
    if (text.includes('inici') || text.includes('home') || text.includes('panel') || text.includes('volver')) {
      setActiveView('inicio');
      return {
        replyText: '🏠 Te he llevado a la Pantalla Principal (Inicio). Aquí tienes el catálogo modular y resumen ejecutivo de Confía360.',
        action: {
          actionKey: 'inicio',
          label: 'Ir a Inicio',
          description: 'Pantalla principal de Confía360',
          targetView: 'inicio',
        },
      };
    }

    // Default conversational reply with helpful shortcuts
    setActiveView('cockpit');
    return {
      replyText: `Comprendido: "${rawText}". Te he llevado al Cuadro de Mandos principal. ¿Deseas consultar algún módulo específico como Fichaje, Facturas OCR, Tesorería o Albarán 360?`,
      action: {
        actionKey: 'cockpit',
        label: 'Cuadro de Mandos Principal',
        description: 'Visión global de tu negocio',
        targetView: 'cockpit',
      },
    };
  };

  // Re-trigger an action from past message
  const triggerPastAction = (action: NonNullable<ChatCommunication['executedAction']>) => {
    if (action.isModal) {
      if (action.modalName === 'report') setIsReportModalOpen(true);
      if (action.modalName === 'identity') setIsIdentityModalOpen(true);
    } else if (action.targetDrawer) {
      openDrawer360(action.targetDrawer as any);
    } else if (action.targetView) {
      setActiveView(action.targetView);
      if (action.targetTab) {
        setActiveOperativaTab(action.targetTab as any);
      }
    }
    announceAriaLive(`Navegado a ${action.label}`);
  };

  // Send a text message
  const handleSendTextMessage = (textToSend?: string) => {
    const query = (textToSend || inputText).trim();
    if (!query) return;

    // 1. Play sent chime
    playMessageSentSound();

    const newMsgId = `user_${Date.now()}`;
    const userMsg: ChatCommunication = {
      id: newMsgId,
      sender: 'user',
      type: 'text',
      text: query,
      timestamp: getCurrentTime(),
      date: 'Hoy',
      status: 'read',
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setInterimTranscript('');
    scrollToBottom();

    // 2. Process command and generate assistant reply
    setTimeout(() => {
      const { replyText, action } = processNavigationCommand(query);

      playMessageReceivedSound();
      speakAssistantResponse(replyText, isTtsEnabled);
      announceAriaLive(replyText);

      const assistantMsg: ChatCommunication = {
        id: `asst_${Date.now()}`,
        sender: 'assistant',
        type: action ? 'action_card' : 'text',
        text: replyText,
        timestamp: getCurrentTime(),
        date: 'Hoy',
        status: 'read',
        executedAction: action,
      };

      setMessages((prev) => [...prev, assistantMsg]);
      scrollToBottom();
    }, 450);
  };

  // Send a simulated or transcribed voice note
  const handleSendVoiceNote = (transcription: string, durationSec = 3) => {
    if (!transcription.trim()) return;

    playMessageSentSound();

    const userVoiceMsg: ChatCommunication = {
      id: `voice_${Date.now()}`,
      sender: 'user',
      type: 'voice',
      text: `🎤 Nota de voz (${durationSec}s)`,
      voiceDuration: durationSec,
      voiceTranscript: transcription,
      timestamp: getCurrentTime(),
      date: 'Hoy',
      status: 'read',
    };

    setMessages((prev) => [...prev, userVoiceMsg]);
    setIsRecording(false);
    setInterimTranscript('');
    setRecordingSeconds(0);
    scrollToBottom();

    // Process command and reply
    setTimeout(() => {
      const { replyText, action } = processNavigationCommand(transcription);

      playMessageReceivedSound();
      speakAssistantResponse(replyText, isTtsEnabled);
      announceAriaLive(replyText);

      const assistantMsg: ChatCommunication = {
        id: `asst_${Date.now()}`,
        sender: 'assistant',
        type: action ? 'action_card' : 'text',
        text: replyText,
        timestamp: getCurrentTime(),
        date: 'Hoy',
        status: 'read',
        executedAction: action,
      };

      setMessages((prev) => [...prev, assistantMsg]);
      scrollToBottom();
    }, 500);
  };

  // Toggle voice recording (Web Speech API + timer)
  const startRecording = async () => {
    setMicError(null);
    setRecordingSeconds(0);
    setInterimTranscript('');

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      // Browser does not support speech recognition, show voice simulation picker
      setShowVoiceFallbackModal(true);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'es-ES';

      recognition.onstart = () => {
        setIsRecording(true);
        // Start timer
        recordingTimerRef.current = setInterval(() => {
          setRecordingSeconds((sec) => sec + 1);
        }, 1000);
      };

      recognition.onresult = (event: any) => {
        let finalTrans = '';
        let interimTrans = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTrans += event.results[i][0].transcript;
          } else {
            interimTrans += event.results[i][0].transcript;
          }
        }

        const currentText = finalTrans || interimTrans;
        if (currentText) {
          setInterimTranscript(currentText);
        }
      };

      recognition.onerror = (e: any) => {
        console.warn('Speech recognition error:', e.error);
        if (e.error === 'not-allowed' || e.error === 'audio-capture') {
          setMicError('Micrófono bloqueado o sin permisos.');
          setShowVoiceFallbackModal(true);
        }
        stopRecordingCleanup();
      };

      recognition.onend = () => {
        // Recognition ended
        stopRecordingCleanup();
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err) {
      console.warn('Could not start speech recognition:', err);
      setShowVoiceFallbackModal(true);
      stopRecordingCleanup();
    }
  };

  const stopRecordingAndSend = () => {
    const finalTranscript = interimTranscript.trim();
    const duration = Math.max(2, recordingSeconds);

    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {
        // ignore
      }
    }
    stopRecordingCleanup();

    if (finalTranscript) {
      handleSendVoiceNote(finalTranscript, duration);
    } else {
      // Default sample voice command if speech was silence
      handleSendVoiceNote('Fichar entrada de jornada', duration);
    }
  };

  const cancelRecording = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {
        // ignore
      }
    }
    stopRecordingCleanup();
    setInterimTranscript('');
  };

  const stopRecordingCleanup = () => {
    setIsRecording(false);
    if (recordingTimerRef.current) {
      clearInterval(recordingTimerRef.current);
      recordingTimerRef.current = null;
    }
  };

  // Play a voice note bubble
  const togglePlayVoiceNote = (msgId: string, durationSec = 3) => {
    if (playingVoiceId === msgId) {
      // Stop currently playing
      if (activeAudioStopRef.current) {
        activeAudioStopRef.current();
        activeAudioStopRef.current = null;
      }
      setPlayingVoiceId(null);
      setPlaybackProgress((prev) => ({ ...prev, [msgId]: 0 }));
      return;
    }

    // Stop any other playing
    if (activeAudioStopRef.current) {
      activeAudioStopRef.current();
      activeAudioStopRef.current = null;
    }

    setPlayingVoiceId(msgId);
    setPlaybackProgress((prev) => ({ ...prev, [msgId]: 0 }));

    const stopFn = playVoiceNoteTone(
      durationSec,
      (progressPct) => {
        setPlaybackProgress((prev) => ({ ...prev, [msgId]: progressPct }));
      },
      () => {
        setPlayingVoiceId(null);
        setPlaybackProgress((prev) => ({ ...prev, [msgId]: 0 }));
        activeAudioStopRef.current = null;
      }
    );

    activeAudioStopRef.current = stopFn;
  };

  // Clear chat communications history
  const handleClearHistory = () => {
    if (window.confirm('¿Deseas vaciar el historial de comunicaciones con el Asistente?')) {
      const reset = INITIAL_WHATSAPP_MESSAGES;
      setMessages(reset);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(reset));
      } catch {
        // ignore
      }
    }
  };

  // Quick Action Chips tailored for active role
  const getQuickActionChips = () => {
    switch (activeRole) {
      case 'autonomo_gerente':
        return [
          { label: '⏱️ Fichar Jornada', query: 'Fichar entrada' },
          { label: '🧾 Escanear Gasto OCR', query: 'Escanear ticket de gasto' },
          { label: '📈 Previsión IVA/IRPF', query: 'Previsión fiscal trimestral' },
          { label: '🏦 Ver Tesorería', query: 'Ver saldo de tesorería' },
          { label: '👤 Mis Datos CIF', query: 'Ver datos de identidad' },
        ];
      case 'comercial':
        return [
          { label: '📊 Facturas & Cobros', query: 'Ver facturación y cobros' },
          { label: '➕ Emitir Factura', query: 'Emitir nueva factura' },
          { label: '📦 Albaranes 360', query: 'Abrir albarán 360' },
          { label: '⏱️ Fichar Jornada', query: 'Fichar jornada' },
        ];
      case 'administracion':
        return [
          { label: '🧾 Subir Factura OCR', query: 'Escanear factura OCR' },
          { label: '🏦 Conciliar Bancos', query: 'Conciliar tesorería' },
          { label: '📡 Cola de Sync', query: 'Monitor de cola sync' },
          { label: '📑 Informe Confía360', query: 'Abrir informe confía360' },
        ];
      case 'gestoria':
        return [
          { label: '📑 Informe Fiscal', query: 'Previsión fiscal e informe' },
          { label: '📊 Cierre de IVA', query: 'Cierre de IVA e IRPF' },
          { label: '📦 Traza Albarán 360', query: 'Trazabilidad albarán 360' },
          { label: '👤 Expediente NIF', query: 'Ver datos de empresa y NIF' },
        ];
      case 'operaciones_sector':
        return [
          { label: '🍽️ Reservas de Sala', query: 'Ver reservas de sala' },
          { label: '👥 Cuadrante Turnos', query: 'Turnos y horarios de empleados' },
          { label: '⏱️ Fichar Turno', query: 'Fichar entrada camarero' },
          { label: '📞 Agente de Sala', query: 'Agente de voz 24/7' },
        ];
      default:
        return [
          { label: '⏱️ Fichar', query: 'Fichar' },
          { label: '🧾 Escanear Gasto', query: 'Escanear gasto ocr' },
          { label: '📊 Facturación', query: 'Ver facturación' },
          { label: '📦 Albarán 360', query: 'Albarán 360' },
        ];
    }
  };

  // Sample voice commands for fallback picker
  const SAMPLE_VOICE_COMMANDS = [
    { label: '⏱️ Fichar entrada ahora', query: 'Fichar entrada ahora' },
    { label: '🧾 Escanear ticket de gasto OCR', query: 'Escanear ticket de gasto OCR' },
    { label: '📊 Ver facturas y cobros pendientes', query: 'Ver facturas y cobros pendientes' },
    { label: '🏦 Consultar tesorería y bancos', query: 'Consultar tesorería y bancos' },
    { label: '📑 Previsión fiscal e informe trimestral', query: 'Previsión fiscal e informe trimestral' },
    { label: '📦 Abrir albarán y trazabilidad 360', query: 'Abrir albarán 360' },
    { label: '🍽️ Ver reservas de mesas y sala', query: 'Ver reservas de sala' },
    { label: '👥 Horarios y turnos de personal', query: 'Turnos y horarios de empleados' },
    { label: '👤 Ver mis datos de identidad y CIF', query: 'Ver mis datos de identidad' },
    { label: '🏠 Volver a la pantalla de Inicio', query: 'Volver a inicio' },
  ];

  return (
    <>
      {/* ========================================================= */}
      {/* 1. FLOATING ACTION BUTTON (BOTÓN FLOTANTE ESTILO WHATSAPP) */}
      {/* ========================================================= */}
      <div className="fixed bottom-5 right-4 sm:right-6 z-50 flex items-center gap-2 select-none">
        {/* Gemini Live Direct Voice Call Trigger (Tablet/Desktop floating pill; accessible inside chat on mobile) */}
        {!isVoiceAssistantOpen && (
          <button
            type="button"
            onClick={() => setIsLiveCallModalOpen(true)}
            className="hidden sm:flex items-center gap-2 bg-gradient-to-r from-emerald-950 via-[#075e54] to-slate-900 text-white text-xs font-bold px-3 py-2 rounded-full shadow-2xl border border-[#25D366]/50 hover:scale-105 active:scale-95 transition-all group"
            title="Iniciar llamada de voz en vivo con Gemini Live (gemini-3.8-live)"
          >
            <span className="w-2 h-2 rounded-full bg-[#25D366] animate-ping" />
            <Phone className="w-3.5 h-3.5 text-[#25D366] fill-current" />
            <span className="hidden sm:inline">Voz en Vivo</span>
            <span className="text-[10px] bg-[#25D366] text-slate-950 font-black px-1.5 py-0.2 rounded-full uppercase">
              Live
            </span>
          </button>
        )}

        {/* WhatsApp Circular FAB */}
        <button
          onClick={() => setIsVoiceAssistantOpen(!isVoiceAssistantOpen)}
          className={`relative touch-target-min w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center shadow-2xl transition-all transform duration-200 active:scale-95 ${
            isVoiceAssistantOpen
              ? 'bg-slate-800 text-white hover:bg-slate-700 rotate-90 ring-4 ring-slate-800/20'
              : 'bg-gradient-to-tr from-[#128C7E] to-[#25D366] text-white hover:scale-105 ring-4 ring-[#25D366]/30 shadow-emerald-600/40'
          }`}
          aria-label={isVoiceAssistantOpen ? 'Cerrar Asistente de Voz' : 'Abrir Asistente de Voz y Navegación WhatsApp'}
          title={isVoiceAssistantOpen ? 'Cerrar chat' : 'Asistente de Voz & Texto (Estilo WhatsApp)'}
        >
          {isVoiceAssistantOpen ? (
            <X className="w-7 h-7" />
          ) : (
            <>
              {/* WhatsApp Chat & Mic Combined Icon */}
              <div className="relative flex items-center justify-center">
                <MessageCircle className="w-8 h-8 fill-current text-white" />
                <Mic className="w-4 h-4 text-[#075E54] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-black stroke-[3]" />
              </div>

              {/* Status Ping Badge */}
              <span className="absolute top-1 right-1 flex h-3.5 w-3.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-300 border-2 border-[#128C7E]"></span>
              </span>
            </>
          )}
        </button>
      </div>

      {/* ========================================================= */}
      {/* 2. WHATSAPP CHAT DRAWER / WINDOW (RESPONSIVE)              */}
      {/* ========================================================= */}
      {isVoiceAssistantOpen && (
        <div
          className="fixed z-50 transition-all duration-300 animate-in fade-in slide-in-from-bottom-6
            inset-x-0 bottom-0 top-16 sm:top-auto sm:inset-x-auto sm:bottom-24 sm:right-6 sm:w-[410px] sm:h-[640px] sm:max-h-[85vh]
            flex flex-col bg-[#0b141a] sm:rounded-3xl shadow-2xl border border-emerald-900/40 overflow-hidden"
          role="dialog"
          aria-label="Asistente Confía360 en vivo estilo WhatsApp"
        >
          {/* WhatsApp Header Bar */}
          <div className="bg-[#075E54] text-white px-4 py-3 flex items-center justify-between shadow-md select-none shrink-0 border-b border-emerald-800">
            <div className="flex items-center gap-3">
              {/* Contact Avatar */}
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#25D366] to-emerald-300 text-slate-900 font-black flex items-center justify-center shadow-inner">
                  <Sparkles className="w-5 h-5 text-[#075E54]" />
                </div>
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-[#25D366] rounded-full border-2 border-[#075E54]"></span>
              </div>

              {/* Contact Info */}
              <div className="leading-tight text-left">
                <div className="flex items-center gap-1.5">
                  <h3 className="font-bold text-sm tracking-wide text-white">Asistente Confía360</h3>
                  <span className="text-[10px] bg-[#25D366] text-[#075E54] font-black px-1.5 py-0.2 rounded-full uppercase">
                    360
                  </span>
                </div>
                <p className="text-[11px] text-emerald-100 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#25D366]"></span>
                  <span>En línea • Voz & Navegación activa</span>
                </p>
              </div>
            </div>

            {/* Header Action Icons */}
            <div className="flex items-center gap-1.5">
              {/* Gemini Live Voice Call Button */}
              <button
                onClick={() => setIsLiveCallModalOpen(true)}
                className="px-2.5 py-1.5 rounded-xl bg-gradient-to-tr from-[#128C7E] to-[#25D366] text-slate-950 font-bold hover:brightness-110 active:scale-95 transition shadow-sm flex items-center gap-1.5"
                title="Llamada de voz en tiempo real con Gemini Live (gemini-3.8-live)"
                aria-label="Llamar con Gemini Live"
              >
                <PhoneCall className="w-3.5 h-3.5 fill-current" />
                <span className="text-xs font-black">Live</span>
              </button>

              {/* TTS Speech Response Toggle */}
              <button
                onClick={toggleTts}
                className={`p-2 rounded-xl transition ${
                  isTtsEnabled ? 'bg-emerald-600/60 text-white' : 'text-emerald-200/60 hover:text-white'
                }`}
                title={isTtsEnabled ? 'Desactivar voz de respuesta (TTS)' : 'Activar voz de respuesta (TTS)'}
                aria-label={isTtsEnabled ? 'Desactivar audio' : 'Activar audio'}
              >
                {isTtsEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              </button>

              {/* Clear History */}
              <button
                onClick={handleClearHistory}
                className="p-2 text-emerald-200/60 hover:text-rose-300 rounded-xl transition"
                title="Vaciar historial de comunicaciones"
                aria-label="Vaciar historial"
              >
                <Trash2 className="w-4 h-4" />
              </button>

              {/* Minimize / Close */}
              <button
                onClick={closeVoiceAssistant}
                className="p-2 text-emerald-100 hover:text-white hover:bg-emerald-700/60 rounded-xl transition"
                title="Minimizar chat"
                aria-label="Cerrar chat"
              >
                <ChevronDown className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* WhatsApp Chat Body & Message Thread */}
          <div
            className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3.5 bg-[#0b141a] text-slate-100 relative"
            style={{
              backgroundImage:
                'radial-gradient(#128C7E 0.5px, transparent 0.5px), radial-gradient(#128C7E 0.5px, #0b141a 0.5px)',
              backgroundSize: '24px 24px',
              backgroundPosition: '0 0, 12px 12px',
            }}
          >
            {/* Gemini Live Interactive Call Banner */}
            <div className="bg-gradient-to-r from-emerald-950/90 via-[#075e54]/50 to-slate-900 border border-emerald-500/40 rounded-2xl p-3 shadow-lg select-none">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-full bg-[#25D366]/20 text-[#25D366] flex items-center justify-center border border-[#25D366]/40 shrink-0">
                    <Radio className="w-5 h-5 animate-pulse" />
                  </div>
                  <div className="text-left">
                    <div className="flex items-center gap-1.5">
                      <p className="text-xs font-bold text-white">Voz en Vivo 24/7</p>
                      <span className="text-[10px] bg-[#25D366] text-slate-950 font-black px-1.5 py-0.2 rounded-full uppercase">
                        Gemini Live
                      </span>
                    </div>
                    <p className="text-[11px] text-emerald-200/80 leading-tight">
                      Conversación hablada interactiva con <span className="font-mono text-emerald-300">gemini-3.8-live</span>.
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsLiveCallModalOpen(true)}
                  className="shrink-0 flex items-center gap-1 bg-[#25D366] text-slate-950 hover:bg-emerald-400 font-bold text-xs py-1.5 px-3 rounded-xl shadow transition transform active:scale-95"
                >
                  <Phone className="w-3.5 h-3.5 fill-current" />
                  <span>Llamar</span>
                </button>
              </div>
            </div>

            {/* Date Pill Separator */}
            <div className="flex justify-center my-1 select-none">
              <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-900/80 text-emerald-300/80 px-3 py-1 rounded-full border border-emerald-900/50 shadow-xs">
                Comunicaciones Guardadas • WhatsApp 360
              </span>
            </div>

            {/* Messages Loop */}
            {messages.map((msg) => {
              const isUser = msg.sender === 'user';

              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} transition-all`}
                >
                  {/* USER MESSAGE */}
                  {isUser ? (
                    <div className="max-w-[85%] sm:max-w-[82%] bg-[#005c4b] text-emerald-50 rounded-2xl rounded-tr-xs px-3.5 py-2.5 shadow-md border border-[#00705a]/60">
                      {msg.type === 'voice' ? (
                        /* WhatsApp Voice Note Bubble */
                        <div className="space-y-1.5 select-none">
                          <div className="flex items-center gap-3">
                            {/* Play/Pause Button */}
                            <button
                              onClick={() => togglePlayVoiceNote(msg.id, msg.voiceDuration || 3)}
                              className="w-9 h-9 rounded-full bg-[#25D366] text-[#075E54] flex items-center justify-center shadow transition transform active:scale-90 shrink-0"
                              title="Reproducir nota de voz"
                            >
                              {playingVoiceId === msg.id ? (
                                <Pause className="w-4 h-4 fill-current" />
                              ) : (
                                <Play className="w-4 h-4 fill-current ml-0.5" />
                              )}
                            </button>

                            {/* Voice Waveform & Progress */}
                            <div className="flex-1 min-w-[130px]">
                              <div className="flex items-center gap-0.5 h-6">
                                {[35, 60, 95, 45, 80, 50, 70, 90, 40, 65, 85, 55, 75, 45, 90, 60].map(
                                  (barH, idx) => {
                                    const progress = playbackProgress[msg.id] || 0;
                                    const barPct = (idx / 16) * 100;
                                    const isPassed = progress >= barPct;

                                    return (
                                      <span
                                        key={idx}
                                        style={{ height: `${barH}%` }}
                                        className={`w-1 rounded-full transition-colors ${
                                          playingVoiceId === msg.id && isPassed
                                            ? 'bg-[#25D366]'
                                            : 'bg-emerald-300/40'
                                        }`}
                                      />
                                    );
                                  }
                                )}
                              </div>
                              <div className="flex items-center justify-between text-[10px] text-emerald-200/70 font-mono mt-0.5">
                                <span>{`0:0${msg.voiceDuration || 3}`}</span>
                                <Mic className="w-3 h-3 text-[#25D366]" />
                              </div>
                            </div>
                          </div>

                          {/* Transcribed Text Badge */}
                          {msg.voiceTranscript && (
                            <div className="text-xs italic bg-[#00483a] text-emerald-100/90 px-2.5 py-1 rounded-xl border border-emerald-600/30">
                              "{msg.voiceTranscript}"
                            </div>
                          )}
                        </div>
                      ) : (
                        /* Text Message */
                        <p className="text-xs sm:text-sm whitespace-pre-wrap leading-relaxed">
                          {msg.text}
                        </p>
                      )}

                      {/* Timestamp & Double Blue Ticks */}
                      <div className="flex items-center justify-end gap-1 text-[10px] text-emerald-200/70 mt-1 select-none">
                        <span>{msg.timestamp}</span>
                        <CheckCheck className="w-3.5 h-3.5 text-[#53bdeb]" />
                      </div>
                    </div>
                  ) : (
                    /* ASSISTANT MESSAGE */
                    <div className="max-w-[88%] sm:max-w-[85%] bg-[#202c33] text-slate-100 rounded-2xl rounded-tl-xs px-3.5 py-2.5 shadow-md border border-slate-700/60">
                      <div className="flex items-center gap-1.5 mb-1 text-[11px] font-bold text-[#25D366]">
                        <span>Asistente Confía360</span>
                        <ShieldCheck className="w-3 h-3 text-[#25D366]" />
                      </div>

                      {msg.type === 'call_summary' ? (
                        <div className="space-y-2 select-none">
                          <div className="flex items-center justify-between pb-1.5 border-b border-emerald-500/20">
                            <div className="flex items-center gap-1.5">
                              <div className="w-6 h-6 rounded-full bg-[#25D366]/20 text-[#25D366] flex items-center justify-center">
                                <PhoneCall className="w-3 h-3" />
                              </div>
                              <span className="text-xs font-bold text-white">Llamada de Voz Gemini Live</span>
                            </div>
                            <span className="text-[10px] bg-emerald-950 text-emerald-300 font-mono px-2 py-0.5 rounded-full border border-emerald-800">
                              {msg.voiceDuration ? `${msg.voiceDuration}s` : 'En vivo'}
                            </span>
                          </div>

                          <p className="text-xs whitespace-pre-wrap leading-relaxed text-slate-200">
                            {msg.text}
                          </p>

                          <button
                            type="button"
                            onClick={() => setIsLiveCallModalOpen(true)}
                            className="w-full mt-1.5 flex items-center justify-center gap-1.5 bg-[#25D366]/20 hover:bg-[#25D366]/30 text-[#25D366] text-xs font-bold py-1.5 px-3 rounded-lg border border-[#25D366]/40 transition active:scale-98"
                          >
                            <Phone className="w-3.5 h-3.5 fill-current" />
                            <span>Volver a llamar con Gemini Live</span>
                          </button>
                        </div>
                      ) : (
                        <p className="text-xs sm:text-sm whitespace-pre-wrap leading-relaxed text-slate-100">
                          {msg.text}
                        </p>
                      )}

                      {/* Interactive Action Card if executed */}
                      {msg.executedAction && (
                        <div className="mt-2.5 p-2.5 rounded-xl bg-slate-900/90 border border-emerald-500/30 text-left space-y-1.5">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] uppercase font-bold text-emerald-400 flex items-center gap-1">
                              <Zap className="w-3 h-3 text-emerald-400" />
                              Acción Ejecutada
                            </span>
                            <span className="text-[10px] bg-emerald-950 text-emerald-300 font-mono px-1.5 py-0.2 rounded border border-emerald-800">
                              OK ✓
                            </span>
                          </div>

                          <p className="text-xs font-bold text-white">
                            {msg.executedAction.label}
                          </p>
                          <p className="text-[11px] text-slate-400 leading-tight">
                            {msg.executedAction.description}
                          </p>

                          <button
                            onClick={() => triggerPastAction(msg.executedAction!)}
                            className="w-full mt-1.5 touch-target-min flex items-center justify-center gap-1.5 bg-gradient-to-r from-[#128C7E] to-[#25D366] text-slate-950 text-xs font-bold py-1.5 px-3 rounded-lg shadow-sm hover:brightness-110 active:scale-98 transition"
                          >
                            <span>Abrir Pantalla</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}

                      <div className="flex items-center justify-end text-[10px] text-slate-400 mt-1 select-none">
                        <span>{msg.timestamp}</span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Action Chips Bar (Above Input) */}
          <div className="bg-[#111b21] px-3 py-2 border-t border-slate-800 overflow-x-auto no-scrollbar shrink-0">
            <div className="flex items-center gap-1.5 whitespace-nowrap">
              {getQuickActionChips().map((chip, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendTextMessage(chip.query)}
                  className="px-2.5 py-1 rounded-full text-xs font-semibold bg-[#202c33] text-emerald-300 border border-emerald-900/40 hover:bg-[#2a3942] hover:text-white transition active:scale-95 shrink-0"
                >
                  {chip.label}
                </button>
              ))}
            </div>
          </div>

          {/* Voice Fallback / Pre-recorded Voice Commands Modal */}
          {showVoiceFallbackModal && (
            <div className="bg-[#1f2c34] p-3 border-t border-emerald-600/40 shrink-0 space-y-2 animate-in fade-in">
              <div className="flex items-center justify-between text-xs text-emerald-200">
                <span className="font-bold flex items-center gap-1 text-[#25D366]">
                  <Mic className="w-3.5 h-3.5" />
                  Órdenes de voz rápidas (Acceso directo)
                </span>
                <button
                  onClick={() => setShowVoiceFallbackModal(false)}
                  className="p-1 text-slate-400 hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
              <p className="text-[11px] text-slate-300">
                {micError || 'Pulsa cualquier orden para enviarla como nota de voz ejecutiva:'}
              </p>
              <div className="grid grid-cols-2 gap-1.5 max-h-36 overflow-y-auto pr-1">
                {SAMPLE_VOICE_COMMANDS.map((cmd, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setShowVoiceFallbackModal(false);
                      handleSendVoiceNote(cmd.query, 3);
                    }}
                    className="text-left text-xs bg-[#111b21] hover:bg-[#2a3942] text-slate-100 p-2 rounded-xl border border-slate-700/60 truncate transition"
                  >
                    {cmd.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* WhatsApp Footer Input Bar */}
          <div className="bg-[#202c33] p-2.5 sm:p-3 border-t border-slate-700/60 shrink-0">
            {isRecording ? (
              /* ACTIVE VOICE RECORDING PANEL */
              <div className="flex items-center justify-between gap-3 bg-[#111b21] px-4 py-2 rounded-2xl border border-rose-500/50 animate-pulse">
                <div className="flex items-center gap-2 text-rose-400 text-xs font-bold">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping"></span>
                  <span>Grabando audio: 0:{String(recordingSeconds).padStart(2, '0')}</span>
                  {interimTranscript && (
                    <span className="text-white italic truncate max-w-[140px]">
                      "{interimTranscript}"
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={cancelRecording}
                    className="p-1.5 text-slate-400 hover:text-rose-400 transition"
                    title="Descartar nota de voz"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={stopRecordingAndSend}
                    className="p-2 bg-[#25D366] text-slate-900 font-bold rounded-full hover:scale-105 active:scale-95 transition shadow-md"
                    title="Enviar nota de voz"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              /* STANDARD TEXT & MIC INPUT FORM */
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendTextMessage();
                }}
                className="flex items-center gap-2"
              >
                {/* Voice Presets / Shortcuts Trigger */}
                <button
                  type="button"
                  onClick={() => setShowVoiceFallbackModal(!showVoiceFallbackModal)}
                  className="p-2 rounded-xl text-slate-400 hover:text-[#25D366] hover:bg-slate-700/50 transition shrink-0"
                  title="Ver órdenes de voz preparadas"
                >
                  <Sparkles className="w-5 h-5" />
                </button>

                {/* Text Input */}
                <input
                  ref={inputRef}
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Escribe un mensaje o di una orden..."
                  className="flex-1 bg-[#2a3942] text-slate-100 placeholder-slate-400 text-xs sm:text-sm py-2 px-3.5 rounded-xl border border-transparent focus:border-[#25D366] focus:outline-none transition shadow-inner"
                />

                {/* Send Button or Microphone Button */}
                {inputText.trim() ? (
                  <button
                    type="submit"
                    className="w-10 h-10 rounded-full bg-[#25D366] hover:bg-[#20ba5a] text-[#075E54] flex items-center justify-center transition transform active:scale-90 shadow-md shrink-0"
                    title="Enviar mensaje"
                  >
                    <Send className="w-4 h-4 ml-0.5" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={startRecording}
                    className="w-10 h-10 rounded-full bg-[#25D366] hover:bg-[#20ba5a] text-[#075E54] flex items-center justify-center transition transform active:scale-90 shadow-md shrink-0"
                    title="Pulsar para hablar (Nota de voz)"
                  >
                    <Mic className="w-5 h-5 font-black stroke-[2.5]" />
                  </button>
                )}
              </form>
            )}
          </div>
        </div>
      )}

      {/* Gemini Live API Real-Time Voice Modal */}
      <GeminiLiveVoiceModal
        isOpen={isLiveCallModalOpen}
        onClose={() => setIsLiveCallModalOpen(false)}
        onCallEnded={handleLiveCallEnded}
      />
    </>
  );
};
