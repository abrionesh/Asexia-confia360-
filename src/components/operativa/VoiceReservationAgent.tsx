import React, { useState, useCallback } from 'react';
import { useApp } from '../../context/AppContext';
import { ApiService } from '../../services/api';
import { SyncStatusIndicator } from '../SyncQueueDrawer';
import { useIndexedDbFormState } from '../../hooks/useIndexedDbFormState';
import {
  Mic,
  MicOff,
  PhoneCall,
  PhoneForwarded,
  Volume2,
  Calendar,
  Users,
  Clock,
  Sparkles,
  Send,
  AlertCircle,
  Hash,
  CheckCircle2,
  RefreshCw,
  X,
} from 'lucide-react';
import { Reservation } from '../../types';
import { PositionalHelpBeacon } from '../help/PositionalHelpBeacon';

interface VoiceCallLogEntry {
  sender: 'agent' | 'user' | 'system';
  text: string;
  time: string;
  fromOfflineFallback?: boolean;
}

interface ExtractedReservationData {
  guests: number | null;
  date: string | null;
  time: string | null;
  customerName: string | null;
  phone: string | null;
}

interface VoiceReservationDraftState extends Record<string, unknown> {
  transcript: string;
  callLog: VoiceCallLogEntry[];
  extractedData: ExtractedReservationData;
  failCount: number;
  isTransferredToHuman: boolean;
  alternativeTimes: string[];
  dtmfInput: string;
}

const INITIAL_CALL_LOG: VoiceCallLogEntry[] = [
  {
    sender: 'agent',
    text: '¡Hola! Bienvenido al servicio de reservas 24/7 de AsexIA Confia360. ¿Para cuántas personas y qué día u hora desea su mesa?',
    time: '12:00',
  },
];

const INITIAL_VOICE_DRAFT: VoiceReservationDraftState = {
  transcript: '',
  callLog: INITIAL_CALL_LOG,
  extractedData: {
    guests: null,
    date: null,
    time: null,
    customerName: null,
    phone: null,
  },
  failCount: 0,
  isTransferredToHuman: false,
  alternativeTimes: [],
  dtmfInput: '',
};

export const VoiceReservationAgent: React.FC = () => {
  const { reservations, createReservation, isOnline, announceAriaLive, addAgentInteraction } = useApp();

  const [isCalling, setIsCalling] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [showDTMFKeypad, setShowDTMFKeypad] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [completedBanner, setCompletedBanner] = useState<{
    customerName: string;
    guests: number;
    date: string;
    time: string;
    queuedOffline: boolean;
  } | null>(null);

  const syncPendingReservation = useCallback(
    async (payload: VoiceReservationDraftState) => {
      const { extractedData: data } = payload;
      if (!data.guests || !data.time || !data.customerName) return;
      await createReservation({
        customerName: data.customerName,
        phone: data.phone || '+34 600 000 000',
        guests: data.guests,
        date: data.date || '2026-10-16',
        time: data.time,
        tableNumber: 'Mesa asignada por Sala',
        status: 'confirmed',
        channel: 'voice_agent_24_7',
        notes: 'Procesado mediante Agente NLU en un solo turno',
      });
    },
    [createReservation]
  );

  const {
    formState: draft,
    setFormState: setDraft,
    updateField,
    hasRecoveredDraft,
    dismissRecoveredNotice,
    pendingSubmissionsCount,
    isSyncingPending,
    queueSubmission,
    flushPendingSubmissions,
    clearDraft,
  } = useIndexedDbFormState<VoiceReservationDraftState>({
    formId: 'operativa_reservas_voz',
    module: 'reservas_voz',
    initialState: INITIAL_VOICE_DRAFT,
    isOnline,
    onSyncPending: syncPendingReservation,
    isDraftDirty: (state) =>
      state.transcript.trim().length > 0 ||
      state.dtmfInput.trim().length > 0 ||
      state.callLog.length > 1 ||
      state.extractedData.guests !== null ||
      state.extractedData.date !== null ||
      state.extractedData.time !== null ||
      state.extractedData.customerName !== null ||
      state.extractedData.phone !== null ||
      state.failCount > 0 ||
      state.isTransferredToHuman,
  });

  const {
    transcript,
    callLog,
    extractedData,
    failCount,
    isTransferredToHuman,
    alternativeTimes,
    dtmfInput,
  } = draft;

  const setTranscript = (val: string) => updateField('transcript', val);

  // Quick voice simulation presets
  const presetPhrases = [
    'Quiero una mesa para 6 personas el viernes a las 15:00',
    'Hola, necesitamos mesa para 4 personas este viernes a las 21:00',
    'Quiero mesa para 2 a nombre de Lucía Fernández al teléfono 611223344 a las 21:30',
    'Me llamo Roberto y quiero hablar con una persona de carne y hueso ya',
  ];

  // Speech synthesis for agent audio playback
  const speakText = (text: string) => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'es-ES';
        utterance.rate = 1.05;
        window.speechSynthesis.speak(utterance);
      } catch {
        // ignore
      }
    }
  };

  const handleStartCall = () => {
    setCompletedBanner(null);
    setIsCalling(true);
    const greeting = '¡Hola! Bienvenido al asistente de reservas 24/7. ¿Para cuántas personas y qué fecha u hora busca mesa?';
    setDraft((prev) => ({
      ...prev,
      isTransferredToHuman: false,
      failCount: 0,
      callLog: [
        { sender: 'agent', text: greeting, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) },
      ],
    }));
    speakText(greeting);
    announceAriaLive('Llamada telefónica iniciada con el agente inteligente de reservas.');
  };

  const handleProcessUserSpeech = async (userText: string) => {
    if (!userText.trim()) return;

    setCompletedBanner(null);
    setIsProcessing(true);
    const timeNow = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // Append user turn to log and clear transcript in IndexedDB-backed draft
    const logAfterUser: VoiceCallLogEntry[] = [...callLog, { sender: 'user', text: userText, time: timeNow }];
    setDraft((prev) => ({
      ...prev,
      callLog: [...prev.callLog, { sender: 'user', text: userText, time: timeNow }],
      transcript: '',
    }));

    try {
      const response = await ApiService.processReservationVoice({
        transcript: userText,
        currentReservation: extractedData,
        failCount,
      });

      // Update extracted entity slots
      const merged: ExtractedReservationData = {
        guests: response.extracted.guests ?? extractedData.guests,
        date: response.extracted.date ?? extractedData.date,
        time: response.extracted.time ?? extractedData.time,
        customerName: response.extracted.customerName ?? extractedData.customerName,
        phone: response.extracted.phone ?? extractedData.phone,
      };
      const nextAlternatives = response.alternativeTimes || [];

      if (response.transferToHuman) {
        const transferMsg = 'Transfiriendo llamada a un encargado humano de sala. Registrando transcripción de auditoría...';
        const updatedLog: VoiceCallLogEntry[] = [
          ...logAfterUser,
          {
            sender: 'agent',
            text: response.spokenResponse,
            time: timeNow,
            fromOfflineFallback: response.fromOfflineFallback,
          },
          { sender: 'system', text: transferMsg, time: timeNow },
        ];
        setDraft((prev) => ({
          ...prev,
          extractedData: merged,
          alternativeTimes: nextAlternatives,
          isTransferredToHuman: true,
          callLog: updatedLog,
        }));
        speakText(response.spokenResponse);
        announceAriaLive(response.spokenResponse);

        addAgentInteraction({
          agentType: 'voice_reservations',
          interactionData: JSON.stringify({ userText, response, log: updatedLog }),
          userId: 'user-guest',
          moduleRef: 'reservations',
          status: 'pending_human_review',
        });
        return;
      }

      const finalLog: VoiceCallLogEntry[] = [
        ...logAfterUser,
        {
          sender: 'agent',
          text: response.spokenResponse,
          time: timeNow,
          fromOfflineFallback: response.fromOfflineFallback,
        },
      ];

      // If reservation has enough data, submit (online directly or queued in IndexedDB offline)
      if (merged.guests && merged.time && merged.customerName) {
        const snapshotDraft: VoiceReservationDraftState = {
          ...draft,
          transcript: '',
          extractedData: merged,
          alternativeTimes: nextAlternatives,
          callLog: finalLog,
        };
        const { queuedOffline } = await queueSubmission(snapshotDraft);
        setCompletedBanner({
          customerName: merged.customerName,
          guests: merged.guests,
          date: merged.date || '2026-10-16',
          time: merged.time,
          queuedOffline,
        });
      } else {
        setDraft((prev) => ({
          ...prev,
          extractedData: merged,
          alternativeTimes: nextAlternatives,
          callLog: finalLog,
        }));
      }

      speakText(response.spokenResponse);
      announceAriaLive(response.spokenResponse);
    } catch {
      setDraft((prev) => ({ ...prev, failCount: prev.failCount + 1 }));
    } finally {
      setIsProcessing(false);
    }
  };

  // DTMF Keypad (Accessibility fallback for speech/hearing impaired)
  const handleDTMFPress = (digit: string) => {
    setDraft((prev) => ({ ...prev, dtmfInput: prev.dtmfInput + digit }));
    announceAriaLive(`Dígito ${digit} pulsado`);
  };

  const handleDTMFSubmit = () => {
    if (!dtmfInput) return;
    const currentInput = dtmfInput;
    updateField('dtmfInput', '');
    handleProcessUserSpeech(`Selección por teclado DTMF: ${currentInput} comensales.`);
  };

  return (
    <div className="space-y-6">
      
      {/* Intro Header */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold font-brand text-[#022853]">Agente de Voz & Sala 24/7 (VUX NLU)</h2>
            <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-[#80D518]/20 text-[#022853] border border-[#80D518]/40">
              NLU Monoturno
            </span>
            <PositionalHelpBeacon
              id="voz_reservas_beacon"
              category="Atención Telefónica"
              title="Recepción de Reservas 24 Horas"
              content="Atiende llamadas de clientes cuando el restaurante está lleno o cerrado. Anota nombre, comensales, fecha y alergias de los clientes, y puede pedir fianza para evitar mesas vacías."
              keyPoints={[
                'Apunta la reserva al instante entendiendo frases como: Mesa para 4 el sábado a las dos',
                'Avisa a cocina de intolerancias y alergias alimentarias',
                'Pasa la llamada al encargado de sala si el cliente lo prefiere',
              ]}
            />
          </div>
          <p className="text-xs text-slate-500 mt-1 max-w-xl">
            Procesa comensales, fecha y hora en una sola frase del cliente ("Quiero mesa para 6 el viernes a las 15:00"). Con alternativas ante aforo completo, fallback DTMF y transferencia humana.
          </p>
        </div>

        {/* Start / Stop Call Button */}
        <div>
          {!isCalling ? (
            <button
              onClick={handleStartCall}
              className="touch-target-min inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#48A222] hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition"
            >
              <PhoneCall className="w-4 h-4 text-white" />
              <span>Simular Llamada Entrante</span>
            </button>
          ) : (
            <button
              onClick={() => {
                setIsCalling(false);
                if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
                  window.speechSynthesis.cancel();
                }
              }}
              className="touch-target-min inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md transition"
            >
              <PhoneForwarded className="w-4 h-4" />
              <span>Colgar Llamada</span>
            </button>
          )}
        </div>
      </div>

      {/* IndexedDB Offline Draft, Pending Sync & Completion Notices */}
      {(hasRecoveredDraft || pendingSubmissionsCount > 0 || completedBanner) && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
          {hasRecoveredDraft && (
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-blue-50 border border-blue-200 text-[#022853]">
              <Clock className="w-4 h-4 text-[#0067B9] shrink-0" />
              <span>Borrador de llamada y slots recuperado desde IndexedDB.</span>
              <button
                type="button"
                onClick={() => clearDraft()}
                className="ml-1 font-bold text-rose-700 hover:underline"
              >
                Descartar
              </button>
              <button
                type="button"
                onClick={dismissRecoveredNotice}
                className="text-slate-400 hover:text-slate-700"
                aria-label="Ocultar aviso"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {pendingSubmissionsCount > 0 && (
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-amber-50 border border-amber-200 text-amber-900">
              <RefreshCw className={`w-4 h-4 text-amber-700 shrink-0 ${isSyncingPending ? 'animate-spin' : ''}`} />
              <span>
                <strong>{pendingSubmissionsCount}</strong>{' '}
                {pendingSubmissionsCount === 1 ? 'reserva pendiente' : 'reservas pendientes'} en cola IndexedDB
              </span>
              {isOnline && !isSyncingPending && (
                <button
                  type="button"
                  onClick={() => flushPendingSubmissions()}
                  className="ml-1 px-2 py-0.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-bold text-[11px] transition"
                >
                  Sincronizar
                </button>
              )}
            </div>
          )}

          {completedBanner && (
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900">
              <CheckCircle2 className="w-4 h-4 text-[#48A222] shrink-0" />
              <span>
                Reserva de <strong>{completedBanner.customerName}</strong> ({completedBanner.guests} pax · {completedBanner.time}){' '}
                {completedBanner.queuedOffline
                  ? 'guardada en IndexedDB para sincronización automática.'
                  : 'confirmada en sala.'}
              </span>
              <button
                type="button"
                onClick={() => setCompletedBanner(null)}
                className="text-emerald-700 hover:text-emerald-900"
                aria-label="Cerrar aviso de reserva"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      )}

      {/* Main Call Interface */}
      <div id="formulario-reserva" className="grid grid-cols-1 lg:grid-cols-12 gap-6 scroll-mt-6">
        
        {/* Left: Interactive Call & Conversation Feed (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 shadow-xs p-5 flex flex-col h-[520px]">
          
          {/* Call Header bar */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <div className={`w-3 h-3 rounded-full ${isCalling ? 'bg-emerald-500 animate-ping' : 'bg-slate-300'}`} />
              <div>
                <h3 className="text-xs font-bold text-[#022853]">
                  {isCalling ? '📞 Llamada en Curso (Canal Voz 24/7)' : 'Línea Disponible'}
                </h3>
                <span className="text-[10px] text-slate-400">Audio bidireccional · NLU Inteligente</span>
              </div>
            </div>

            {/* Accessibility DTMF Toggle Button */}
            <button
              onClick={() => setShowDTMFKeypad(!showDTMFKeypad)}
              className={`touch-target-min px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 border transition ${
                showDTMFKeypad ? 'bg-[#0067B9] text-white border-[#0067B9]' : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
              }`}
              title="Accesibilidad para personas con dificultad de habla o audición"
              aria-label="Abrir teclado numérico DTMF"
            >
              <Hash className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Teclado DTMF</span>
            </button>
          </div>

          {/* Conversation Feed */}
          <div className="flex-1 overflow-y-auto p-2 space-y-3 my-3">
            {callLog.map((entry, idx) => (
              <div
                key={idx}
                className={`flex flex-col ${
                  entry.sender === 'user' ? 'items-end' : entry.sender === 'system' ? 'items-center' : 'items-start'
                }`}
              >
                {entry.sender === 'system' ? (
                  <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-[11px] font-bold max-w-sm text-center">
                    {entry.text}
                  </div>
                ) : (
                  <div
                    className={`max-w-[85%] p-3 rounded-2xl text-xs space-y-1 shadow-2xs ${
                      entry.sender === 'user'
                        ? 'bg-[#0067B9] text-white rounded-br-xs'
                        : 'bg-slate-100 text-slate-800 rounded-bl-xs border border-slate-200'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 text-[10px] opacity-80 font-semibold">
                      <span className="flex items-center gap-1.5">
                        <span>{entry.sender === 'user' ? '👤 Cliente (Llamante)' : '🤖 Agente AsexIA Confia360'}</span>
                        {entry.sender === 'agent' && entry.fromOfflineFallback !== undefined && (
                          <span
                            className={`px-1.5 py-0.2 rounded text-[9px] font-bold ${
                              entry.fromOfflineFallback
                                ? 'bg-amber-100 text-amber-800 border border-amber-300'
                                : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                            }`}
                          >
                            {entry.fromOfflineFallback ? 'Respaldo Local' : 'IA Central'}
                          </span>
                        )}
                      </span>
                      <span>{entry.time}</span>
                    </div>
                    <p className="leading-relaxed">{entry.text}</p>
                  </div>
                )}
              </div>
            ))}

            {isProcessing && (
              <div className="flex items-center gap-2 p-2 text-xs text-[#0067B9] animate-pulse">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Analizando intención conversacional...</span>
              </div>
            )}
          </div>

          {/* Alternative time slots offer if conflict */}
          {alternativeTimes.length > 0 && (
            <div className="bg-amber-50 p-2.5 rounded-xl border border-amber-200 mb-3 flex items-center justify-between text-xs">
              <span className="text-amber-800 font-semibold">
                Mesas alternativas disponibles:
              </span>
              <div className="flex gap-2">
                {alternativeTimes.map((t) => (
                  <button
                    key={t}
                    onClick={() => handleProcessUserSpeech(`Me viene bien la hora de las ${t}`)}
                    className="px-2.5 py-1 rounded bg-white border border-amber-300 font-bold text-[#022853] hover:bg-amber-100 transition"
                  >
                    {t} h
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* User Input controls & speech simulation */}
          <div className="pt-2 border-t border-slate-100 space-y-2">
            
            {/* Quick Presets for fast testing */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-[11px]">
              <span className="text-slate-400 font-bold whitespace-nowrap">Ejemplos:</span>
              {presetPhrases.map((phrase, i) => (
                <button
                  key={i}
                  onClick={() => handleProcessUserSpeech(phrase)}
                  disabled={!isCalling || isProcessing}
                  className="px-2.5 py-1 rounded-full bg-slate-100 hover:bg-blue-50 hover:text-[#0067B9] text-slate-700 font-medium whitespace-nowrap border border-slate-200 transition"
                >
                  "{phrase.slice(0, 32)}..."
                </button>
              ))}
            </div>

            {/* Text message / voice simulated input bar */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleProcessUserSpeech(transcript);
              }}
              className="flex gap-2"
            >
              <input
                type="text"
                value={transcript}
                onChange={(e) => setTranscript(e.target.value)}
                placeholder={isCalling ? 'Escribe o simula lo que dice el cliente...' : 'Inicia la llamada primero...'}
                disabled={!isCalling || isProcessing}
                className="flex-1 text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-[#0067B9] focus:ring-2 focus:ring-[#0067B9]/20"
              />
              <button
                type="submit"
                disabled={!isCalling || !transcript.trim() || isProcessing}
                className="touch-target-min px-4 py-2.5 rounded-xl bg-[#0067B9] hover:bg-[#022853] text-white font-bold text-xs transition flex items-center justify-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Enviar</span>
              </button>
            </form>
          </div>
        </div>

        {/* Right: Extracted NLU Slots & DTMF Panel (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          
          {/* Extracted Slots Card */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold font-brand uppercase tracking-wider text-[#022853]">
                Slots Extraídos en Monoturno
              </h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                Auditoría en Vivo
              </span>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="flex items-center gap-2 text-slate-600 font-semibold">
                  <Users className="w-4 h-4 text-[#0067B9]" />
                  Comensales (Pax):
                </span>
                <span className="font-black text-slate-800">
                  {extractedData.guests ? `${extractedData.guests} personas` : 'Pendiente'}
                </span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="flex items-center gap-2 text-slate-600 font-semibold">
                  <Clock className="w-4 h-4 text-[#0067B9]" />
                  Hora solicitada:
                </span>
                <span className="font-black text-slate-800">
                  {extractedData.time ? `${extractedData.time} h` : 'Pendiente'}
                </span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="flex items-center gap-2 text-slate-600 font-semibold">
                  <Calendar className="w-4 h-4 text-[#0067B9]" />
                  Fecha:
                </span>
                <span className="font-black text-slate-800">
                  {extractedData.date || 'Pendiente'}
                </span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="flex items-center gap-2 text-slate-600 font-semibold">
                  <Users className="w-4 h-4 text-[#0067B9]" />
                  Nombre de Titular:
                </span>
                <span className="font-black text-slate-800">
                  {extractedData.customerName || 'Pendiente'}
                </span>
              </div>
            </div>

            {/* Transfer condition badge */}
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-slate-600 space-y-1">
              <div className="flex items-center justify-between">
                <span>Fallos consecutivos:</span>
                <span className="font-bold text-slate-800">{failCount} de 2 máx.</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Estado de transferencia:</span>
                <span className={`font-bold ${isTransferredToHuman ? 'text-rose-600' : 'text-[#48A222]'}`}>
                  {isTransferredToHuman ? 'Transferido a Humano' : 'Atendido por IA'}
                </span>
              </div>
            </div>
          </div>

          {/* Accessibility DTMF Fallback Pad */}
          {showDTMFKeypad && (
            <div className="bg-white rounded-2xl border-2 border-[#0067B9]/30 shadow-xs p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#022853]">Teclado DTMF Accesible</span>
                <span className="text-[10px] text-slate-500">Para marcación sin voz</span>
              </div>

              <div className="grid grid-cols-3 gap-2">
                {['1', '2', '3', '4', '5', '6', '7', '8', '9', '*', '0', '#'].map((d) => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => handleDTMFPress(d)}
                    className="touch-target-min py-3 text-sm font-bold rounded-xl bg-slate-50 hover:bg-slate-200 border border-slate-200 text-slate-800 transition active:scale-95"
                  >
                    {d}
                  </button>
                ))}
              </div>

              {dtmfInput && (
                <div className="flex gap-2 pt-1">
                  <div className="flex-1 bg-slate-100 p-2 rounded-xl text-center font-mono font-bold text-sm">
                    {dtmfInput}
                  </div>
                  <button
                    onClick={handleDTMFSubmit}
                    className="px-3 rounded-xl bg-[#48A222] text-white font-bold text-xs"
                  >
                    Validar
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Booked Reservations Table */}
      <div id="libro-reservas" className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs scroll-mt-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-[#0067B9]" />
            <h3 className="text-sm font-bold font-brand text-[#022853]">Libro de Reservas de Sala</h3>
          </div>
          <span className="text-xs text-slate-500">
            {reservations.length} reservas registradas
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 bg-slate-50">
                <th className="py-2.5 px-3 font-semibold">Cliente</th>
                <th className="py-2.5 px-3 font-semibold">Comensales</th>
                <th className="py-2.5 px-3 font-semibold">Fecha & Hora</th>
                <th className="py-2.5 px-3 font-semibold">Canal</th>
                <th className="py-2.5 px-3 font-semibold">Mesa / Notas</th>
                <th className="py-2.5 px-3 font-semibold text-right">Sync</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {reservations.map((r) => (
                <tr key={r.id} className="hover:bg-slate-50/60 transition">
                  <td className="py-3 px-3">
                    <span className="font-bold text-slate-800 block">{r.customerName}</span>
                    <span className="text-[10px] text-slate-400">{r.phone}</span>
                  </td>
                  <td className="py-3 px-3 font-bold text-[#0067B9]">
                    {r.guests} pax
                  </td>
                  <td className="py-3 px-3 text-slate-700">
                    {r.date} a las {r.time}
                  </td>
                  <td className="py-3 px-3">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-[#0067B9] border border-blue-200">
                      Voz 24/7 NLU
                    </span>
                  </td>
                  <td className="py-3 px-3 text-slate-500">
                    {r.notes || r.tableNumber || 'Mesa estándar'}
                  </td>
                  <td className="py-3 px-3 text-right">
                    <SyncStatusIndicator status={r.syncStatus} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
