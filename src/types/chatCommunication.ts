export interface ChatCommunication {
  id: string;
  sender: 'user' | 'assistant' | 'system';
  type: 'text' | 'voice' | 'action_card' | 'call_summary';
  text: string;
  voiceDuration?: number; // duration in seconds (e.g. 3, 5)
  voiceTranscript?: string; // transcription of the voice note
  timestamp: string; // e.g. "10:42"
  date: string; // e.g. "Hoy", "Ayer", or date string
  status?: 'sent' | 'delivered' | 'read'; // WhatsApp double checkmarks
  executedAction?: {
    actionKey: string;
    label: string;
    description: string;
    targetView?: 'inicio' | 'operativa' | 'cockpit' | 'director' | 'reputacion';
    targetTab?: string;
    targetDrawer?: string;
    isModal?: boolean;
    modalName?: string;
  };
}

export const INITIAL_WHATSAPP_MESSAGES: ChatCommunication[] = [
  {
    id: 'msg_welcome_1',
    sender: 'assistant',
    type: 'text',
    text: '👋 ¡Hola! Soy tu Asistente Confía360 en vivo (estilo WhatsApp). Puedes hablarme con tu voz 🎙️ o escribir cualquier consulta o acción.',
    timestamp: '10:00',
    date: 'Hoy',
    status: 'read',
  },
  {
    id: 'msg_welcome_2',
    sender: 'assistant',
    type: 'action_card',
    text: 'Todas nuestras comunicaciones y órdenes quedan guardadas aquí. Puedes pedirme navegar a cualquier parte:',
    timestamp: '10:01',
    date: 'Hoy',
    status: 'read',
    executedAction: {
      actionKey: 'fichaje',
      label: 'Presencia & Fichaje',
      description: 'Acceso directo a fichaje biométrico y jornada laboral',
      targetView: 'operativa',
      targetTab: 'fichaje',
    },
  },
];
