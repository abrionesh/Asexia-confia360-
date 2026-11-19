export type SentimentType = 'positivo' | 'neutro' | 'critico';

export type PlatformType = 'google' | 'tripadvisor' | 'thefork' | 'instagram';

export type SurveyChannel = 'whatsapp' | 'email' | 'qr';

export type IncidentSeverity = 'baja' | 'media' | 'alta' | 'critica_alergeno';

export type IncidentArea = 'cocina' | 'sala' | 'reparto' | 'direccion';

export type IncidentReason =
  | 'comida_fria'
  | 'tardanza'
  | 'error_pedido'
  | 'trato'
  | 'alergeno'
  | 'delivery'
  | 'ambiente';

export interface ReputationSurvey {
  id: string;
  clienteId: string;
  clienteNombre: string;
  clienteTelefono: string;
  mesaOPedido: string;
  canal: SurveyChannel;
  puntuacion: number; // 1 to 5
  motivoPrincipal?: string;
  comentario?: string;
  fechaEnvio: string;
  fechaRespuesta?: string;
  estado: 'enviada' | 'respondida' | 'expirada';
  derivacion: 'publica_google' | 'incidencia_interna' | 'pendiente';
}

export interface PublicReview {
  id: string;
  plataforma: PlatformType;
  autor: string;
  puntuacion: number; // 1 to 5
  texto: string;
  fecha: string;
  sentimiento: SentimentType;
  motivos: string[];
  respuestaOficial?: string;
  borradorIa?: string;
  estado: 'nueva' | 'borrador_generado' | 'respondida' | 'escalada';
  platoMencionado?: string;
  camareroMencionado?: string;
  destacadaMarketing?: boolean;
}

export interface ReputationIncident {
  id: string;
  clienteId: string;
  clienteNombre: string;
  telefono: string;
  surveyId?: string;
  gravedad: IncidentSeverity;
  motivo: IncidentReason;
  descripcion: string;
  areaResponsable: IncidentArea;
  turnoId: string;
  turnoNombre: string;
  empleadoResponsable?: string;
  mesa?: string;
  estado: 'abierta' | 'en_gestion' | 'resuelta';
  compensacionOfrecida?: string;
  timestamp: string;
  resolucionTimestamp?: string;
  auditHash: string;
}

export interface CorrectiveTask {
  id: string;
  incidenciaId: string;
  titulo: string;
  descripcion: string;
  area: IncidentArea;
  responsable: string;
  turnoNombre: string;
  fechaLimite: string;
  estado: 'pendiente' | 'en_proceso' | 'completada';
  prioridad: 'urgente' | 'alta' | 'normal';
}

export interface LocalCompetitor {
  id: string;
  nombre: string;
  distanciaKm: number;
  ratingGoogle: number;
  totalResenas: number;
  volumenSemanal: number;
  diferencialVsNosotros: number;
  puntosFuertes: string;
  puntosDebiles: string;
}

export interface CustomerReputationProfile {
  clienteId: string;
  nombre: string;
  telefono: string;
  etiqueta: 'promotor' | 'en_riesgo' | 'recuperado' | 'habitual';
  totalVisitas: number;
  gastoHistorico: number;
  ultimaValoracion: number;
  encuestasRespondidas: number;
  historialIncidencias: number;
}

export interface StarDishMention {
  id: string;
  nombrePlato: string;
  mencionesPositivas: number;
  ratingMedio: number;
  margenActual: number;
  pvdVenta: number;
  palabrasClave: string[];
}

export interface ReputationKPIs {
  ratingConsolidado: number;
  totalResenasMes: number;
  tasaRespuesta: number;
  sentimientoDesglose: {
    positivo: number;
    neutro: number;
    critico: number;
  };
  intercepcionEfectividad: number; // Porcentaje de incidencias 1-3★ contenidas antes de llegar a Google
  npsScore: number;
  radarCausas: {
    comidaCocina: number;
    servicioSala: number;
    esperaTiempos: number;
    limpieza: number;
    precioCalidad: number;
  };
}
