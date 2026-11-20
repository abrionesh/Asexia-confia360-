// API service for Gemini AI Agents and Server Integration

export interface ReservationVoiceRequest {
  transcript: string;
  currentReservation?: {
    guests?: number | null;
    date?: string | null;
    time?: string | null;
    customerName?: string | null;
    phone?: string | null;
  };
  failCount?: number;
  venueAvailability?: any;
}

export interface ReservationVoiceResponse {
  extracted: {
    guests: number | null;
    date: string | null;
    time: string | null;
    customerName: string | null;
    phone: string | null;
    notes: string | null;
  };
  isComplete: boolean;
  spokenResponse: string;
  transferToHuman: boolean;
  alternativeTimes: string[];
  confidenceScore: number;
  fromOfflineFallback?: boolean;
}

export interface HRAssistantRequest {
  message: string;
  employeeContext?: {
    name: string;
    role: string;
    vacationDaysLeft: number;
    nextShift: {
      date: string;
      time: string;
      location: string;
    };
  };
}

export interface HRAssistantResponse {
  replyMessage: string;
  actionType: 'none' | 'confirm_shift' | 'vacation_draft' | 'missed_punch_incident';
  actionPayload: {
    title: string;
    details: string;
    status: 'pending_manager_approval' | 'confirmed';
    daysCount?: number;
  } | null;
  fromOfflineFallback?: boolean;
}

export interface EconomicOCRRequest {
  imageBase64?: string;
  sampleText?: string;
}

export interface EconomicOCRResponse {
  providerName: string;
  invoiceNumber: string;
  date: string;
  taxBase: number;
  vatRate: number;
  vatAmount: number;
  totalAmount: number;
  suggestedCategory: string;
  auditAlert: string | null;
  requiresAttention: boolean;
  fromOfflineFallback?: boolean;
}

async function fetchWithTimeout(input: RequestInfo | URL, init: RequestInit = {}, timeoutMs = 9000): Promise<Response> {
  if (typeof AbortSignal !== 'undefined' && typeof AbortSignal.timeout === 'function') {
    return fetch(input, { ...init, signal: AbortSignal.timeout(timeoutMs) });
  }
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(input, { ...init, signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
}

export const ApiService = {
  async processReservationVoice(params: ReservationVoiceRequest): Promise<ReservationVoiceResponse> {
    try {
      const response = await fetchWithTimeout('/api/gemini/reservation-voice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      });
      if (!response.ok) {
        throw new Error('API server error');
      }
      return { ...(await response.json()), fromOfflineFallback: false };
    } catch {
      // Offline fallback: client-side intelligent heuristics
      const lower = params.transcript.toLowerCase();
      const guestsMatch = lower.match(/(\d+)\s*(personas|comensales|amigos|pax)/) || lower.match(/para\s*(\d+)/);
      const guests = guestsMatch ? parseInt(guestsMatch[1], 10) : (params.currentReservation?.guests || 4);

      const timeMatch = lower.match(/(\d{1,2}):?(\d{2})?\s*(h|horas|pm|am)?/) || lower.match(/a las\s*(\d{1,2})/);
      let time = params.currentReservation?.time || '21:00';
      if (timeMatch) {
        const hour = parseInt(timeMatch[1], 10);
        time = `${hour.toString().padStart(2, '0')}:00`;
      }

      const isConflict = time === '15:00';
      const isFrustrated = (params.failCount || 0) >= 2 || lower.includes('humano') || lower.includes('persona');

      return {
        extracted: {
          guests,
          date: 'Este viernes',
          time,
          customerName: params.currentReservation?.customerName || null,
          phone: params.currentReservation?.phone || null,
          notes: null,
        },
        isComplete: !!params.currentReservation?.customerName,
        spokenResponse: isFrustrated
          ? 'Comprendo perfectamente su situación. Le derivo con el encargado de sala de inmediato. Espere un segundo por favor.'
          : isConflict
          ? `Disculpe, para ${guests} comensales a las ${time} no dispongo de mesa libre. Tengo disponibilidad a las 14:30 o 15:30. ¿Le sirve alguna?`
          : `Perfecto. Mesa confirmada para ${guests} personas a las ${time}. ¿A qué nombre anoto la reserva?`,
        transferToHuman: isFrustrated,
        alternativeTimes: isConflict ? ['14:30', '15:30'] : [],
        confidenceScore: 0.9,
        fromOfflineFallback: true,
      };
    }
  },

  async processHRAssistant(params: HRAssistantRequest): Promise<HRAssistantResponse> {
    try {
      const response = await fetchWithTimeout('/api/gemini/hr-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      });
      if (!response.ok) {
        throw new Error('API server error');
      }
      return { ...(await response.json()), fromOfflineFallback: false };
    } catch {
      const emp = params.employeeContext || {
        name: 'Carlos Ruiz',
        role: 'Camarero',
        vacationDaysLeft: 14,
        nextShift: { date: 'Mañana', time: '10:00 - 16:30', location: 'Local Centro' },
      };
      const lower = params.message.toLowerCase();

      if (lower.includes('vacaciones') || lower.includes('días')) {
        return {
          replyMessage: `He comprobado tu saldo anual: te quedan ${emp.vacationDaysLeft} días laborables. He preparado la solicitud para el gerente de sala.`,
          actionType: 'vacation_draft',
          actionPayload: {
            title: 'Solicitud de Vacaciones',
            details: 'Periodo propuesto: 5 días laborables. Saldo restante: 9 días.',
            status: 'pending_manager_approval',
            daysCount: 5,
          },
          fromOfflineFallback: true,
        };
      } else if (lower.includes('fichar') || lower.includes('olvid')) {
        return {
          replyMessage: 'He registrado una propuesta de regularización por olvido de fichaje de entrada. Tu encargado la validará en el panel de control.',
          actionType: 'missed_punch_incident',
          actionPayload: {
            title: 'Incidencia de Fichaje Olvidado',
            details: 'Entrada manual estimada: 09:30. Motivo: Apertura de terraza urgente.',
            status: 'pending_manager_approval',
          },
          fromOfflineFallback: true,
        };
      }

      return {
        replyMessage: `Hola ${emp.name}, tienes turno asignado para ${emp.nextShift.date} de ${emp.nextShift.time} en ${emp.nextShift.location}.`,
        actionType: 'confirm_shift',
        actionPayload: {
          title: 'Confirmación de Turno',
          details: `${emp.nextShift.date} ${emp.nextShift.time}`,
          status: 'confirmed',
        },
        fromOfflineFallback: true,
      };
    }
  },

  async processEconomicOCR(params: EconomicOCRRequest): Promise<EconomicOCRResponse> {
    try {
      const response = await fetchWithTimeout('/api/gemini/economic-ocr', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      });
      if (!response.ok) {
        throw new Error('API server error');
      }
      return { ...(await response.json()), fromOfflineFallback: false };
    } catch {
      return {
        providerName: 'Distribuidora Horeca Central S.L.',
        invoiceNumber: 'HOR-2026-4401',
        date: new Date().toISOString().split('T')[0],
        taxBase: 350.0,
        vatRate: 10,
        vatAmount: 35.0,
        totalAmount: 385.0,
        suggestedCategory: 'Materia Prima / Perecederos',
        auditAlert: null,
        requiresAttention: false,
        fromOfflineFallback: true,
      };
    }
  },
};
