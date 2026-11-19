import React, { useState } from 'react';
import {
  Smartphone,
  Send,
  Star,
  CheckCircle2,
  AlertTriangle,
  ShieldAlert,
  ArrowRight,
  ExternalLink,
  MessageSquare,
  QrCode,
  Mail,
  RefreshCw,
  Clock,
  Sparkles,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import {
  ReputationSurvey,
  IncidentReason,
} from '../../types/reputation';
import { INITIAL_SURVEYS } from '../../services/reputationData';

interface FeedbackSimulatorTabProps {
  onIncidentCreated?: (incidentId: string) => void;
  onSwitchTab?: (tabId: string) => void;
}

export const FeedbackSimulatorTab: React.FC<FeedbackSimulatorTabProps> = ({
  onIncidentCreated,
  onSwitchTab,
}) => {
  const { announceAriaLive } = useApp();

  // Surveys state
  const [surveys, setSurveys] = useState<ReputationSurvey[]>(INITIAL_SURVEYS);

  // WhatsApp Simulator State
  const [simCustomerName, setSimCustomerName] = useState('Alejandro Morales');
  const [simTable, setSimTable] = useState('Mesa 4 (Comida)');
  const [simRating, setSimRating] = useState<number>(0);
  const [simReason, setSimReason] = useState<IncidentReason>('comida_fria');
  const [simComment, setSimComment] = useState('');
  const [simStep, setSimStep] = useState<'rating' | 'feedback_high' | 'feedback_low' | 'completed'>('rating');
  const [completedResult, setCompletedResult] = useState<'google_review' | 'private_incident' | null>(null);

  const handleSelectRating = (stars: number) => {
    setSimRating(stars);
    if (stars >= 4) {
      setSimStep('feedback_high');
      announceAriaLive(`Puntuación de ${stars} estrellas seleccionada. Canalizando hacia reseña pública en Google.`);
    } else {
      setSimStep('feedback_low');
      announceAriaLive(`Puntuación de ${stars} estrellas seleccionada. Activando intercepción privada de calidad.`);
    }
  };

  const handleCompleteSurvey = () => {
    if (simRating >= 4) {
      // 4-5 Stars -> Public Review Channel
      const newSurvey: ReputationSurvey = {
        id: `SRV-${Date.now().toString().slice(-4)}`,
        clienteId: 'CLI-SIM',
        clienteNombre: simCustomerName,
        clienteTelefono: '+34 654 000 111',
        mesaOPedido: simTable,
        canal: 'whatsapp',
        puntuacion: simRating,
        comentario: simComment || 'Comida y servicio excelentes.',
        fechaEnvio: 'Ahora',
        fechaRespuesta: 'Ahora',
        estado: 'respondida',
        derivacion: 'publica_google',
      };
      setSurveys([newSurvey, ...surveys]);
      setCompletedResult('google_review');
      setSimStep('completed');
      announceAriaLive('Encuesta completada: Comensal redirigido a Google Review con éxito');
    } else {
      // 1-3 Stars -> Private Incident Firewall
      const newSurvey: ReputationSurvey = {
        id: `SRV-${Date.now().toString().slice(-4)}`,
        clienteId: 'CLI-SIM',
        clienteNombre: simCustomerName,
        clienteTelefono: '+34 654 000 111',
        mesaOPedido: simTable,
        canal: 'whatsapp',
        puntuacion: simRating,
        motivoPrincipal: simReason,
        comentario: simComment || 'Retraso o disconformidad en servicio.',
        fechaEnvio: 'Ahora',
        fechaRespuesta: 'Ahora',
        estado: 'respondida',
        derivacion: 'incidencia_interna',
      };
      setSurveys([newSurvey, ...surveys]);
      setCompletedResult('private_incident');
      setSimStep('completed');
      announceAriaLive('Incidencia privada interceptada. Tarea correctiva creada en KDS y alerta enviada a gerencia.');
      if (onIncidentCreated) {
        onIncidentCreated(`INC-${Date.now().toString().slice(-4)}`);
      }
    }
  };

  const handleResetSimulator = () => {
    setSimRating(0);
    setSimComment('');
    setSimStep('rating');
    setCompletedResult(null);
  };

  return (
    <div className="space-y-6">
      {/* Introduction banner */}
      <div className="bg-gradient-to-r from-blue-900 via-[#022853] to-[#0067B9] text-white p-5 rounded-2xl shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#80D518]/25 text-[#80D518] text-xs font-black uppercase tracking-wider border border-[#80D518]/40">
              <Sparkles className="w-3.5 h-3.5" />
              Fase 1: Captura & Firewall Bipolar
            </div>
            <h3 className="text-lg sm:text-xl font-brand font-black text-white">
              Encuesta Post-Servicio & Intercepción Automática
            </h3>
            <p className="text-xs text-blue-200 max-w-2xl">
              Al cerrar la comanda o entregar el pedido, el sistema dispara automáticamente una encuesta por WhatsApp. Las notas de <strong>4–5★</strong> invitan a publicar en Google Maps. Las notas de <strong>1–3★</strong> son interceptadas inmediatamente como incidencia interna para que el gerente contacte al cliente antes de que la queja trascienda.
            </p>
          </div>
          <div className="bg-white/10 p-3 rounded-xl border border-white/15 text-xs text-blue-100 self-start md:self-auto">
            <span className="block font-bold text-white">Retención Privada:</span>
            <span className="font-mono text-lg font-black text-[#80D518]">91.2%</span>
            <span className="text-[11px] block text-blue-200">quejas contenidas</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN: LIVE WHATSAPP PHONE SIMULATOR (5 COLS) */}
        <div className="lg:col-span-5 bg-slate-900 rounded-3xl p-4 sm:p-5 shadow-2xl border-4 border-slate-800 text-slate-100">
          {/* Phone Speaker & Notch */}
          <div className="flex items-center justify-between pb-3 px-2 border-b border-slate-800 text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-bold text-white">WhatsApp Bot · ConfiA360</span>
            </div>
            <span className="font-mono text-[10px]">15:42</span>
          </div>

          {/* WhatsApp Chat Container */}
          <div className="py-4 space-y-3 min-h-[420px] flex flex-col justify-between">
            {/* Outgoing Message from Restaurant */}
            <div className="space-y-2">
              <div className="bg-[#054640] p-3 rounded-2xl rounded-tl-none max-w-[90%] text-xs text-slate-100 border border-emerald-600/30 shadow-md">
                <p className="font-bold text-[#25D366] text-[11px] mb-1">
                  Asistente Virtual · {simCustomerName}
                </p>
                <p>
                  ¡Hola {simCustomerName.split(' ')[0]}! Esperamos que hayas disfrutado tu comida en{' '}
                  <strong>{simTable}</strong>.
                </p>
                <p className="mt-1">
                  ¿Cómo valorarías tu experiencia gastronómica hoy del 1 al 5?
                </p>
                <span className="text-[10px] text-slate-400 block text-right mt-1">15:40 ✓✓</span>
              </div>

              {/* Step 1: Star Rating Buttons */}
              {simStep === 'rating' && (
                <div className="bg-slate-800/90 p-3 rounded-2xl border border-slate-700 space-y-2 animate-in fade-in">
                  <span className="text-[11px] font-bold text-slate-300 block text-center">
                    Toca para puntuar (Simula la respuesta del comensal):
                  </span>
                  <div className="flex items-center justify-center gap-1.5 sm:gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onClick={() => handleSelectRating(star)}
                        className={`touch-target-min w-11 h-11 rounded-xl flex flex-col items-center justify-center text-xs font-black transition-all transform active:scale-95 border ${
                          star >= 4
                            ? 'bg-emerald-950/70 hover:bg-emerald-800 border-emerald-500/50 text-emerald-300'
                            : 'bg-rose-950/70 hover:bg-rose-800 border-rose-500/50 text-rose-300'
                        }`}
                      >
                        <Star className={`w-4 h-4 ${star >= 4 ? 'fill-emerald-400 text-emerald-400' : 'fill-rose-400 text-rose-400'}`} />
                        <span className="text-[10px] mt-0.5">{star}★</span>
                      </button>
                    ))}
                  </div>
                  <div className="flex justify-between text-[10px] text-slate-400 px-1 pt-1">
                    <span className="text-rose-400">1–3★ Intercepción interna</span>
                    <span className="text-emerald-400">4–5★ Reseña Google</span>
                  </div>
                </div>
              )}

              {/* Step 2A: High Rating (4–5 Stars) -> Public Derivation */}
              {simStep === 'feedback_high' && (
                <div className="bg-[#054640] p-3 rounded-2xl rounded-tl-none max-w-[95%] text-xs text-slate-100 border border-emerald-500/40 space-y-2 animate-in slide-in-from-bottom-2">
                  <div className="flex items-center gap-1.5 text-emerald-300 font-bold text-xs">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>¡Muchísimas gracias por tus {simRating} estrellas!</span>
                  </div>
                  <p className="text-[11px] text-slate-200">
                    Nos ayuda enormemente que otros clientes conozcan tu experiencia en Google Maps.
                  </p>
                  <input
                    type="text"
                    value={simComment}
                    onChange={(e) => setSimComment(e.target.value)}
                    placeholder="Escribe un comentario opcional (ej: el solomillo fue brutal)..."
                    className="w-full text-xs p-2 rounded-lg bg-slate-900 border border-slate-700 text-white placeholder-slate-500"
                  />
                  <div className="pt-1 flex gap-2">
                    <button
                      onClick={handleCompleteSurvey}
                      className="touch-target-min flex-1 bg-[#25D366] hover:bg-[#20ba5a] text-[#022853] font-black text-xs py-2 px-3 rounded-xl flex items-center justify-center gap-1.5 shadow-md"
                    >
                      <span>Publicar en Google Maps</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={handleResetSimulator}
                      className="text-xs text-slate-400 hover:text-white px-2"
                    >
                      Volver
                    </button>
                  </div>
                </div>
              )}

              {/* Step 2B: Low Rating (1–3 Stars) -> Private Incident Firewall */}
              {simStep === 'feedback_low' && (
                <div className="bg-rose-950/80 p-3 rounded-2xl rounded-tl-none max-w-[95%] text-xs text-slate-100 border border-rose-500/40 space-y-2 animate-in slide-in-from-bottom-2">
                  <div className="flex items-center gap-1.5 text-rose-300 font-bold text-xs">
                    <AlertTriangle className="w-4 h-4" />
                    <span>Lamentamos sinceramente tu experiencia ({simRating}★)</span>
                  </div>
                  <p className="text-[11px] text-slate-300">
                    No queremos que te marches con mal sabor de boca. ¿Cuál ha sido el motivo principal?
                  </p>
                  
                  <div className="grid grid-cols-2 gap-1.5 pt-1">
                    {[
                      { id: 'comida_fria', label: 'Comida fría / punto' },
                      { id: 'tardanza', label: 'Tiempos de espera' },
                      { id: 'error_pedido', label: 'Error en la comanda' },
                      { id: 'trato', label: 'Atención en sala' },
                      { id: 'alergeno', label: 'Incidencia alérgeno' },
                    ].map((m) => (
                      <button
                        key={m.id}
                        onClick={() => setSimReason(m.id as IncidentReason)}
                        className={`text-[10px] font-bold p-1.5 rounded-lg border text-left transition ${
                          simReason === m.id
                            ? 'bg-rose-800 text-white border-rose-400 font-black'
                            : 'bg-slate-900/80 text-slate-300 border-slate-700 hover:border-slate-500'
                        }`}
                      >
                        {m.label}
                      </button>
                    ))}
                  </div>

                  <textarea
                    rows={2}
                    value={simComment}
                    onChange={(e) => setSimComment(e.target.value)}
                    placeholder="Cuéntanos brevemente qué ocurrió para que el gerente lo solucione..."
                    className="w-full text-xs p-2 rounded-lg bg-slate-900 border border-slate-700 text-white placeholder-slate-500"
                  />

                  <div className="pt-1 flex gap-2">
                    <button
                      onClick={handleCompleteSurvey}
                      className="touch-target-min flex-1 bg-rose-600 hover:bg-rose-500 text-white font-black text-xs py-2 px-3 rounded-xl flex items-center justify-center gap-1.5 shadow-md"
                    >
                      <ShieldAlert className="w-3.5 h-3.5" />
                      <span>Enviar a Gerencia (Privado)</span>
                    </button>
                    <button
                      onClick={handleResetSimulator}
                      className="text-xs text-slate-400 hover:text-white px-2"
                    >
                      Volver
                    </button>
                  </div>
                </div>
              )}

              {/* Step 3: Completed Outcome */}
              {simStep === 'completed' && (
                <div className="bg-slate-800 p-4 rounded-2xl border border-slate-700 space-y-3 animate-in zoom-in-95">
                  {completedResult === 'google_review' ? (
                    <div className="text-center space-y-2">
                      <div className="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                        <CheckCircle2 className="w-6 h-6" />
                      </div>
                      <h4 className="font-bold text-emerald-400 text-sm">
                        ¡Reseña 5★ Derivada a Google Maps!
                      </h4>
                      <p className="text-[11px] text-slate-300">
                        El cliente ha abierto la ficha pública con invitación de café en su próxima visita. Se registra en CRM como <strong>Promotor Activo</strong>.
                      </p>
                    </div>
                  ) : (
                    <div className="text-center space-y-2">
                      <div className="w-10 h-10 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center mx-auto">
                        <ShieldAlert className="w-6 h-6" />
                      </div>
                      <h4 className="font-bold text-rose-400 text-sm">
                        Intercepción Privada Completada
                      </h4>
                      <p className="text-[11px] text-slate-300">
                        La queja <strong>NO se ha publicado en internet</strong>. Se ha abierto la incidencia interna y enviado notificación push al Jefe de Cocina y Gerente para contacto inmediato en &lt;15 min.
                      </p>
                    </div>
                  )}

                  <button
                    onClick={handleResetSimulator}
                    className="w-full text-xs font-bold py-2 rounded-xl bg-slate-700 hover:bg-slate-600 text-white flex items-center justify-center gap-1.5"
                  >
                    <RefreshCw className="w-3.5 h-3.5" /> Probar Otra Simulación
                  </button>
                </div>
              )}
            </div>

            {/* Simulator Controls & Target Customer */}
            <div className="pt-3 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
              <span>Simulando comensal: <strong>{simCustomerName}</strong></span>
              <button
                onClick={() => {
                  setSimCustomerName(simCustomerName === 'Alejandro Morales' ? 'Beatriz Domínguez' : 'Alejandro Morales');
                  setSimTable(simTable.includes('Mesa 4') ? 'Mesa 12 (Comida)' : 'Mesa 4 (Comida)');
                  handleResetSimulator();
                }}
                className="text-[#80D518] hover:underline font-bold"
              >
                Cambiar Comensal
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: RECENT LIVE SURVEYS FEED & AUDIT TRAIL (7 COLS) */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
            <div>
              <h4 className="font-brand font-bold text-slate-900 text-base">
                Bandeja de Encuestas Disparadas ({surveys.length})
              </h4>
              <p className="text-xs text-slate-500">
                Historial de encuestas post-visita con estado de entrega y derivación.
              </p>
            </div>
            <span className="text-xs font-mono text-slate-600 bg-slate-100 px-2 py-1 rounded-lg self-start sm:self-auto font-bold">
              Canal: WhatsApp / QR / Email
            </span>
          </div>

          <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1 divide-y divide-slate-100">
            {surveys.map((srv) => (
              <div key={srv.id} className="pt-3 first:pt-0 space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    {srv.canal === 'whatsapp' && (
                      <span className="text-emerald-600 font-bold flex items-center gap-1 text-[11px]">
                        <MessageSquare className="w-3.5 h-3.5" /> WhatsApp
                      </span>
                    )}
                    {srv.canal === 'qr' && (
                      <span className="text-blue-600 font-bold flex items-center gap-1 text-[11px]">
                        <QrCode className="w-3.5 h-3.5" /> QR Carta
                      </span>
                    )}
                    {srv.canal === 'email' && (
                      <span className="text-purple-600 font-bold flex items-center gap-1 text-[11px]">
                        <Mail className="w-3.5 h-3.5" /> Email
                      </span>
                    )}
                    <span className="font-bold text-slate-900">{srv.clienteNombre}</span>
                    <span className="text-slate-400 font-mono text-[10px]">({srv.mesaOPedido})</span>
                  </div>

                  <span className="font-mono text-[10px] text-slate-400">{srv.fechaEnvio}</span>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1">
                    {srv.puntuacion > 0 ? (
                      <div className="flex items-center text-amber-500">
                        {Array.from({ length: srv.puntuacion }).map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-current" />
                        ))}
                        <span className="font-bold text-slate-800 ml-1 font-mono">{srv.puntuacion}★</span>
                      </div>
                    ) : (
                      <span className="text-slate-400 italic text-[11px]">Pendiente de respuesta</span>
                    )}
                  </div>

                  <div>
                    {srv.derivacion === 'publica_google' && (
                      <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                        Derivada a Google Maps
                      </span>
                    )}
                    {srv.derivacion === 'incidencia_interna' && (
                      <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 border border-rose-200">
                        ⚠️ Incidencia Privada
                      </span>
                    )}
                    {srv.derivacion === 'pendiente' && (
                      <span className="text-[10px] font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                        Enviada (espera)
                      </span>
                    )}
                  </div>
                </div>

                {srv.comentario && (
                  <p className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-200/80 italic">
                    "{srv.comentario}"
                  </p>
                )}
              </div>
            ))}
          </div>

          <div className="p-3 bg-blue-50/60 rounded-xl border border-blue-200 text-xs text-blue-900 flex items-center justify-between">
            <span className="font-bold">
              Las incidencias privadas alimentan automáticamente el KDS de cocina y sala.
            </span>
            <button
              onClick={() => onSwitchTab && onSwitchTab('kds')}
              className="text-[#0067B9] font-black hover:underline flex items-center gap-1"
            >
              Ir a KDS <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
