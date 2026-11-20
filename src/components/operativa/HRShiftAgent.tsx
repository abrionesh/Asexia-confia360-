import React, { useState, useCallback } from 'react';
import { useApp } from '../../context/AppContext';
import { ApiService } from '../../services/api';
import { useIndexedDbFormState } from '../../hooks/useIndexedDbFormState';
import {
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle,
  Send,
  MessageSquare,
  Sparkles,
  Palmtree,
  UserCheck,
  Building,
  RefreshCw,
  X,
} from 'lucide-react';
import { EmployeeShift } from '../../types';

interface HRChatMessage {
  sender: 'agent' | 'user';
  text: string;
  time: string;
  actionCard?: any;
  fromOfflineFallback?: boolean;
}

interface HRChatDraftState extends Record<string, unknown> {
  chatMessages: HRChatMessage[];
  inputMessage: string;
  vacationDays: number;
}

interface HRPendingSyncPayload extends Record<string, unknown> {
  message: string;
  vacationDaysSnapshot: number;
  createdTime: string;
}

const INITIAL_HR_CHAT_MESSAGES: HRChatMessage[] = [
  {
    sender: 'agent',
    text: '¡Hola Carlos! Soy tu asistente de RRHH y Turnos en AsexIA Confia360. Tienes un turno asignado mañana en el restaurante a las 10:00. ¿Deseas confirmarlo?',
    time: '09:00',
    actionCard: {
      type: 'confirm_shift',
      title: 'Turno de Mañana: 10:00 - 16:30',
      subtitle: 'Restaurante Puerta del Sol (Sala)',
    },
  },
];

const INITIAL_HR_DRAFT: HRChatDraftState = {
  chatMessages: INITIAL_HR_CHAT_MESSAGES,
  inputMessage: '',
  vacationDays: 14,
};

const INITIAL_HR_PENDING: HRPendingSyncPayload = {
  message: '',
  vacationDaysSnapshot: 14,
  createdTime: '',
};

export const HRShiftAgent: React.FC = () => {
  const { shifts, confirmEmployeeShift, isOnline, announceAriaLive, addAgentInteraction } = useApp();

  const [isTyping, setIsTyping] = useState(false);

  const {
    formState: draft,
    setFormState: setDraft,
    updateField,
    hasRecoveredDraft,
    dismissRecoveredNotice,
    clearDraft,
  } = useIndexedDbFormState<HRChatDraftState>({
    formId: 'operativa_rrhh_chat',
    module: 'rrhh_turnos',
    initialState: INITIAL_HR_DRAFT,
    isOnline,
    isDraftDirty: (state) =>
      state.inputMessage.trim().length > 0 ||
      state.chatMessages.length > 1 ||
      state.vacationDays !== 14,
  });

  const { chatMessages, inputMessage, vacationDays } = draft;
  const setInputMessage = (val: string) => updateField('inputMessage', val);

  const syncPendingHRRequest = useCallback(
    async (payload: HRPendingSyncPayload) => {
      if (!payload.message.trim()) return;
      const response = await ApiService.processHRAssistant({
        message: payload.message,
        employeeContext: {
          name: 'Carlos Ruiz',
          role: 'Camarero / Sala',
          vacationDaysLeft: payload.vacationDaysSnapshot,
          nextShift: {
            date: 'Mañana (11 de Octubre)',
            time: '10:00 - 16:30',
            location: 'Restaurante Puerta del Sol',
          },
        },
      });

      if (response.fromOfflineFallback) {
        throw new Error('La solicitud RRHH sigue sin conectividad directa con la central.');
      }

      addAgentInteraction({
        agentType: 'chat_shifts',
        interactionData: JSON.stringify({
          userPrompt: payload.message,
          response,
          syncedFromIndexedDb: true,
        }),
        userId: 'emp-101',
        moduleRef: 'shifts',
        status: 'completed',
      });

      setDraft((prev) => ({
        ...prev,
        chatMessages: [
          ...prev.chatMessages,
          {
            sender: 'agent',
            text: `Solicitud sincronizada con central: ${response.replyMessage}`,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            actionCard: response.actionPayload,
            fromOfflineFallback: false,
          },
        ],
      }));
    },
    [addAgentInteraction, setDraft]
  );

  const {
    pendingSubmissionsCount,
    isSyncingPending,
    queueSubmission,
    flushPendingSubmissions,
  } = useIndexedDbFormState<HRPendingSyncPayload>({
    formId: 'operativa_rrhh_pending_sync',
    module: 'rrhh_turnos',
    initialState: INITIAL_HR_PENDING,
    isOnline,
    onSyncPending: syncPendingHRRequest,
    isDraftDirty: () => false,
  });

  // Quick preset queries for employees
  const employeePresets = [
    'Quiero pedir vacaciones del 10 al 15 de noviembre',
    'No he podido fichar a las 09:30 porque se me olvidó al descargar el camión',
    'Confirmar mi turno de mañana',
    '¿Cuántos días de vacaciones me quedan disponibles?',
  ];

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim()) return;

    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setDraft((prev) => ({
      ...prev,
      chatMessages: [...prev.chatMessages, { sender: 'user', text: textToSend, time }],
      inputMessage: '',
    }));
    setIsTyping(true);

    try {
      const response = await ApiService.processHRAssistant({
        message: textToSend,
        employeeContext: {
          name: 'Carlos Ruiz',
          role: 'Camarero / Sala',
          vacationDaysLeft: vacationDays,
          nextShift: {
            date: 'Mañana (11 de Octubre)',
            time: '10:00 - 16:30',
            location: 'Restaurante Puerta del Sol',
          },
        },
      });

      const daysToDeduct =
        response.actionType === 'vacation_draft' && response.actionPayload?.daysCount
          ? response.actionPayload.daysCount
          : 0;

      setDraft((prev) => ({
        ...prev,
        vacationDays: Math.max(0, prev.vacationDays - daysToDeduct),
        chatMessages: [
          ...prev.chatMessages,
          {
            sender: 'agent',
            text: response.replyMessage,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            actionCard: response.actionPayload,
            fromOfflineFallback: response.fromOfflineFallback,
          },
        ],
      }));

      announceAriaLive(response.replyMessage);

      if (!isOnline || response.fromOfflineFallback) {
        await queueSubmission({
          message: textToSend,
          vacationDaysSnapshot: vacationDays,
          createdTime: time,
        });
      } else {
        addAgentInteraction({
          agentType: 'chat_shifts',
          interactionData: JSON.stringify({ userPrompt: textToSend, response }),
          userId: 'emp-101',
          moduleRef: 'shifts',
          status: 'completed',
        });
      }
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Intro */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold font-brand text-[#022853]">Agente de RRHH, Turnos & Vacaciones</h2>
            <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-[#0067B9]/15 text-[#0067B9]">
              Chatbot PWA
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1 max-w-xl">
            Notificaciones de turnos, cálculo inteligente de saldo de vacaciones con validación de cobertura de equipo y regularización asistida de fichajes olvidados.
          </p>
        </div>

        {/* Vacation Balance Counter Card */}
        <div className="flex items-center gap-3 bg-emerald-50 p-3 rounded-xl border border-emerald-200">
          <div className="w-10 h-10 rounded-xl bg-[#48A222] text-white flex items-center justify-center font-bold">
            <Palmtree className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider block">Saldo de Vacaciones</span>
            <span className="text-base font-black text-emerald-900">{vacationDays} días disponibles</span>
          </div>
        </div>
      </div>

      {/* IndexedDB Offline Draft & Pending Sync Notices */}
      {(hasRecoveredDraft || pendingSubmissionsCount > 0) && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
          {hasRecoveredDraft && (
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-blue-50 border border-blue-200 text-[#022853]">
              <Clock className="w-4 h-4 text-[#0067B9] shrink-0" />
              <span>Conversación y borrador de RRHH recuperados desde IndexedDB.</span>
              <button
                type="button"
                onClick={() => clearDraft()}
                className="ml-1 font-bold text-rose-700 hover:underline"
              >
                Reiniciar
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
                {pendingSubmissionsCount === 1 ? 'solicitud RRHH pendiente' : 'solicitudes RRHH pendientes'} en IndexedDB
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
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Chatbot Interface (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 shadow-xs p-5 flex flex-col h-[520px]">
          
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#022853] flex items-center justify-center text-white font-bold text-xs">
                HR
              </div>
              <div>
                <h3 className="text-xs font-bold text-[#022853]">Asistente de Empleado AsexIA Confia360</h3>
                <span className="text-[10px] text-slate-400">Carlos Ruiz (Sala) · En línea</span>
              </div>
            </div>
            <span className="text-[11px] text-[#48A222] font-bold bg-emerald-50 px-2 py-0.5 rounded-full">
              PWA Notificaciones
            </span>
          </div>

          {/* Chat Messages Log */}
          <div className="flex-1 overflow-y-auto p-2 space-y-3.5 my-3">
            {chatMessages.map((msg, index) => (
              <div
                key={index}
                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[85%] p-3.5 rounded-2xl text-xs space-y-2 shadow-2xs ${
                    msg.sender === 'user'
                      ? 'bg-[#0067B9] text-white rounded-br-xs'
                      : 'bg-slate-100 text-slate-800 rounded-bl-xs border border-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 text-[10px] opacity-80 font-semibold">
                    <span className="flex items-center gap-1.5">
                      <span>{msg.sender === 'user' ? 'Carlos Ruiz' : '🤖 Asistente RRHH'}</span>
                      {msg.sender === 'agent' && msg.fromOfflineFallback !== undefined && (
                        <span
                          className={`px-1.5 py-0.2 rounded text-[9px] font-bold ${
                            msg.fromOfflineFallback
                              ? 'bg-amber-100 text-amber-800 border border-amber-300'
                              : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                          }`}
                        >
                          {msg.fromOfflineFallback ? 'Respaldo Local' : 'IA Central'}
                        </span>
                      )}
                    </span>
                    <span>{msg.time}</span>
                  </div>
                  <p className="leading-relaxed">{msg.text}</p>

                  {/* Interactive Action Card if Agent generated one */}
                  {msg.actionCard && (
                    <div className="mt-2 p-2.5 rounded-xl bg-white text-slate-800 border border-slate-200 space-y-1.5 shadow-xs">
                      <div className="flex items-center gap-1.5 font-bold text-xs text-[#022853]">
                        <UserCheck className="w-3.5 h-3.5 text-[#48A222]" />
                        <span>{msg.actionCard.title}</span>
                      </div>
                      <p className="text-[11px] text-slate-600">{msg.actionCard.details || msg.actionCard.subtitle}</p>
                      
                      {msg.actionCard.type === 'confirm_shift' && (
                        <button
                          onClick={() => confirmEmployeeShift('shift-1')}
                          className="mt-1 w-full py-1.5 rounded-lg bg-[#48A222] hover:bg-emerald-700 text-white font-bold text-xs transition"
                        >
                          Confirmar Asistencia
                        </button>
                      )}

                      {msg.actionCard.status === 'pending_manager_approval' && (
                        <span className="inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-300">
                          Borrador listo para firma de Gerente
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex items-center gap-2 p-2 text-xs text-[#0067B9] animate-pulse">
                <Sparkles className="w-3.5 h-3.5 text-[#80D518]" />
                <span>Asistente verificando cuadrante y saldo...</span>
              </div>
            )}
          </div>

          {/* Quick Presets for Employees */}
          <div className="pt-2 border-t border-slate-100 space-y-2">
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-[11px]">
              <span className="text-slate-400 font-bold whitespace-nowrap">Consultas frecuentes:</span>
              {employeePresets.map((preset, i) => (
                <button
                  key={i}
                  onClick={() => handleSendMessage(preset)}
                  disabled={isTyping}
                  className="px-2.5 py-1 rounded-full bg-slate-100 hover:bg-blue-50 hover:text-[#0067B9] text-slate-700 font-medium whitespace-nowrap border border-slate-200 transition"
                >
                  "{preset.slice(0, 30)}..."
                </button>
              ))}
            </div>

            {/* Input Bar */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage(inputMessage);
              }}
              className="flex gap-2"
            >
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Escribe tu consulta de turnos, vacaciones o incidencia..."
                disabled={isTyping}
                className="flex-1 text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-[#0067B9] focus:ring-2 focus:ring-[#0067B9]/20"
              />
              <button
                type="submit"
                disabled={!inputMessage.trim() || isTyping}
                className="touch-target-min px-4 py-2.5 rounded-xl bg-[#0067B9] hover:bg-[#022853] text-white font-bold text-xs transition flex items-center justify-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Enviar</span>
              </button>
            </form>
          </div>
        </div>

        {/* Right: Shifts Schedule & Team Calendar (5 cols) */}
        <div id="nuevo-turno" className="lg:col-span-5 space-y-4 scroll-mt-6">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold font-brand uppercase tracking-wider text-[#022853]">
                Cuadrante Semanal de Sala & Cocina
              </h3>
              <span className="text-[10px] font-bold text-[#0067B9]">Semana 41</span>
            </div>

            <div className="space-y-3">
              {shifts.map((s) => (
                <div
                  key={s.id}
                  className="p-3 rounded-xl border border-slate-200 bg-slate-50/70 hover:bg-white transition shadow-2xs space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-bold text-xs text-slate-800 block">{s.employeeName}</span>
                      <span className="text-[10px] text-slate-500">{s.role}</span>
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      s.status === 'confirmed'
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                        : 'bg-amber-100 text-amber-800 border border-amber-200'
                    }`}>
                      {s.status === 'confirmed' ? '✓ Confirmado' : '⏳ Pendiente'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-600 bg-white p-2 rounded-lg border border-slate-200">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-[#0067B9]" />
                      {s.date}: {s.startTime} - {s.endTime}
                    </span>
                    <span className="text-[11px] font-semibold text-slate-500">{s.vacationDaysLeft} días vac.</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
