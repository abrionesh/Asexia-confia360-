import React, { useState } from 'react';
import { Volume2, VolumeX, Mic, Send, Sparkles, HelpCircle } from 'lucide-react';
import { EconomicMetrics, ReservationMetrics, StaffMetrics, CockpitAlert } from '../../types/cockpit';

interface VoiceCockpitAssistantProps {
  economic: EconomicMetrics;
  reservations: ReservationMetrics;
  staff: StaffMetrics;
  alerts: CockpitAlert[];
  currentPeriod: string;
}

export const VoiceCockpitAssistant: React.FC<VoiceCockpitAssistantProps> = ({
  economic,
  reservations,
  staff,
  alerts,
  currentPeriod,
}) => {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [query, setQuery] = useState('');
  const [assistantReply, setAssistantReply] = useState<string | null>(null);

  // Generate executive summary text to speak
  const generateSummaryText = () => {
    const redAlertsCount = alerts.filter((a) => a.severity === 'red').length;
    return `Resumen ejecutivo para el periodo ${currentPeriod}. Ingresos totales: ${economic.ingresos.toLocaleString('es-ES')} euros, con un resultado provisional positivo de ${economic.resultadoBruto.toLocaleString('es-ES')} euros. La ocupación de sala alcanza el ${reservations.ocupacionEstimadaPct}% con ${reservations.confirmadas} reservas confirmadas. Los fichajes de personal están al ${staff.fichajesCorrectosPct}% de cumplimiento. Atención: tienes ${redAlertsCount} alertas rojas que requieren tu decisión.`;
  };

  const handleReadScreen = () => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      alert('Tu navegador no soporta síntesis de voz Web Speech.');
      return;
    }

    if (isPlayingAudio) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
      return;
    }

    window.speechSynthesis.cancel();
    const textToSpeak = generateSummaryText();
    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.lang = 'es-ES';
    utterance.rate = 1.05;
    utterance.onend = () => setIsPlayingAudio(false);
    utterance.onerror = () => setIsPlayingAudio(false);

    setIsPlayingAudio(true);
    window.speechSynthesis.speak(utterance);
    setAssistantReply(textToSpeak);
  };

  const handleAskQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    const lower = query.toLowerCase();
    let reply = '';

    if (lower.includes('dueño') || lower.includes('ebitda') || lower.includes('salud') || lower.includes('estratég')) {
      reply = `Visión Estratégica para la Propiedad: Índice de salud global del negocio en 92 sobre 100. EBITDA estimado de ${economic.resultadoBruto.toLocaleString('es-ES')} € con un margen del 65.6%. Labor Cost en 31.8% (dentro de benchmark óptimo) y tesorería asegurada para 45 días de runway.`;
    } else if (lower.includes('cocina') || lower.includes('chef') || lower.includes('escandallo') || lower.includes('merma') || lower.includes('alérgen')) {
      reply = `Visión de Cocina y Pase: 412 raciones estimadas hoy. Atención crítica: subida de carne de vacuno del 14.2% afectando al Lomo Bajo. En cámara tenemos 15 kg de merluza fresca que caducan hoy para activar como sugerencia del chef. Se han detectado 6 comensales celíacos y 1 aviso de anafilaxia a frutos secos en mesa 3.`;
    } else if (lower.includes('sala') || lower.includes('maitre') || lower.includes('maître') || lower.includes('lluvia') || lower.includes('terraza')) {
      reply = `Visión de Sala en Tiempo Real: Ocupación al 82% con 124 comensales ya sentados y 37 pendientes. Alerta meteorológica: 85% probabilidad de lluvia a las 21:00h en Terraza; Plan B de reubicación al Salón disponible con 14 plazas interiores. Mesa 3 ocupada por cliente VIP habitual Dr. Mendoza.`;
    } else if (lower.includes('ingreso') || lower.includes('venta') || lower.includes('factura')) {
      reply = `Los ingresos del periodo son ${economic.ingresos.toLocaleString('es-ES')} € (+${economic.ingresosVarPct}% vs anterior). Gastos aprobados: ${economic.gastosAprobados.toLocaleString('es-ES')} €.`;
    } else if (lower.includes('margen') || lower.includes('resultado') || lower.includes('beneficio')) {
      reply = `El resultado bruto provisional es de ${economic.resultadoBruto.toLocaleString('es-ES')} € (+${economic.resultadoVarPct}%), con una previsión de caja a 30 días de ${economic.cajaPrevista30d.toLocaleString('es-ES')} €.`;
    } else if (lower.includes('reserva') || lower.includes('mesa') || lower.includes('ocupaci')) {
      reply = `Hay ${reservations.confirmadas} reservas confirmadas (${reservations.totalPax} comensales en total), con una ocupación de sala del ${reservations.ocupacionEstimadaPct}%. Tasa de no-show: ${reservations.tasaNoShowPct}%.`;
    } else if (lower.includes('personal') || lower.includes('fichaje') || lower.includes('coste') || lower.includes('turno')) {
      reply = `El coste de personal se sitúa en el ${staff.costePersonalSobreVentasPct}% sobre ventas. El ${staff.fichajesCorrectosPct}% de los fichajes son correctos y hay ${staff.fichajesPendientes} incidencias activas.`;
    } else if (lower.includes('alerta') || lower.includes('urgente') || lower.includes('problema')) {
      const red = alerts.filter((a) => a.severity === 'red');
      reply = `Tienes ${red.length} alertas críticas: ${red.map((a) => a.title).join('; ')}.`;
    } else {
      reply = `En ${currentPeriod}: Ingresos ${economic.ingresos.toLocaleString('es-ES')} €, ${reservations.confirmadas} reservas confirmadas y ${staff.empleadosActivos} empleados activos en turno.`;
    }

    setAssistantReply(reply);

    // Speak reply
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(reply);
      utterance.lang = 'es-ES';
      utterance.rate = 1.1;
      window.speechSynthesis.speak(utterance);
    }

    setQuery('');
  };

  const handleQuickChip = (text: string) => {
    setQuery(text);
    // trigger ask directly
    setTimeout(() => {
      const fakeEvent = { preventDefault: () => {} } as React.FormEvent;
      // We call logic with text
      const lower = text.toLowerCase();
      let reply = '';
      if (lower.includes('dueño') || lower.includes('ebitda') || lower.includes('salud')) {
        reply = `Visión Estratégica: Salud del negocio 92/100, EBITDA ${economic.resultadoBruto.toLocaleString('es-ES')} € (margen 65.6%), Labor Cost en 31.8% y 45 días de runway de tesorería.`;
      } else if (lower.includes('cocina') || lower.includes('chef') || lower.includes('stock')) {
        reply = `Visión de Cocina: 412 raciones hoy. Solomillo con subida +14.2%. Merluza fresca (15 kg) próxima a caducar para sacar como sugerencia. Alérgenos: 6 celíacos y 1 intolerancia en mesa 3.`;
      } else if (lower.includes('sala') || lower.includes('lluvia')) {
        reply = `Visión de Sala: Ocupación 82% (124 comensales sentados). Lluvia prevista a las 21:00h en Terraza: Plan B de reubicación preparado en Salón interior.`;
      } else {
        reply = `Resumen: ${economic.ingresos.toLocaleString('es-ES')} € en ventas y ${reservations.confirmadas} reservas confirmadas.`;
      }
      setAssistantReply(reply);
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(reply);
        utterance.lang = 'es-ES';
        utterance.rate = 1.1;
        window.speechSynthesis.speak(utterance);
      }
      setQuery('');
    }, 50);
  };

  return (
    <div className="bg-gradient-to-r from-[#022853] via-[#0067B9] to-[#022853] rounded-3xl p-4 sm:p-5 text-white shadow-md border border-white/10 space-y-3">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-[#80D518] text-[#022853] flex items-center justify-center font-black shadow-sm">
            <Mic className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-brand font-black text-sm tracking-wide flex items-center gap-2">
              <span>Asistente de Voz del Cuadro de Mandos 360º</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/20 text-[#80D518]">
                VUX Ejecutivo
              </span>
            </h3>
            <p className="text-[11px] text-blue-100">
              Dicta preguntas sobre el negocio o escucha la síntesis de voz sin mirar la pantalla
            </p>
          </div>
        </div>

        {/* Listen to Screen (Oír la pantalla) Button */}
        <button
          onClick={handleReadScreen}
          className={`touch-target-min px-4 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 shadow-sm ${
            isPlayingAudio
              ? 'bg-rose-600 hover:bg-rose-700 text-white animate-pulse'
              : 'bg-[#80D518] hover:bg-[#72bf15] text-[#022853]'
          }`}
          aria-label={isPlayingAudio ? 'Detener lectura por voz' : 'Oír resumen ejecutivo del cuadro de mandos'}
        >
          {isPlayingAudio ? (
            <>
              <VolumeX className="w-4 h-4" />
              <span>Detener Audio</span>
            </>
          ) : (
            <>
              <Volume2 className="w-4 h-4" />
              <span>Oír la Pantalla (Resumen)</span>
            </>
          )}
        </button>
      </div>

      {/* Voice / Text Prompt Box */}
      <form onSubmit={handleAskQuestion} className="flex gap-2">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Pregunta por voz o texto: '¿Cuál es el margen de hoy?', '¿Hay facturas duplicadas?', '¿Cómo va la ocupación?'"
          className="flex-1 bg-white/10 border border-white/20 placeholder-blue-200/70 text-white text-xs px-3.5 py-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#80D518]"
        />
        <button
          type="submit"
          className="touch-target-min px-4 py-2.5 rounded-xl bg-white text-[#022853] hover:bg-slate-100 font-bold text-xs transition flex items-center gap-1.5 shrink-0"
        >
          <Send className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Consultar</span>
        </button>
      </form>

      {/* Quick Prompts by Role */}
      <div className="flex flex-wrap gap-1.5 pt-1">
        <span className="text-[10px] text-blue-200 font-bold self-center mr-1">Consultas Rápidas:</span>
        <button
          type="button"
          onClick={() => handleQuickChip('Dueño: ¿Cuál es el margen EBITDA y la salud del negocio?')}
          className="text-[11px] bg-white/10 hover:bg-white/20 text-white px-2.5 py-1 rounded-lg border border-white/15 transition flex items-center gap-1"
        >
          <span>👑 Dueño: EBITDA & Salud</span>
        </button>
        <button
          type="button"
          onClick={() => handleQuickChip('Cocina: ¿Qué materias primas han subido y qué stock caduca hoy?')}
          className="text-[11px] bg-white/10 hover:bg-white/20 text-white px-2.5 py-1 rounded-lg border border-white/15 transition flex items-center gap-1"
        >
          <span>👨‍🍳 Chef: Escandallos & Mermas</span>
        </button>
        <button
          type="button"
          onClick={() => handleQuickChip('Sala: ¿Cómo está la ocupación de mesas y la lluvia en terraza?')}
          className="text-[11px] bg-white/10 hover:bg-white/20 text-white px-2.5 py-1 rounded-lg border border-white/15 transition flex items-center gap-1"
        >
          <span>🛎️ Sala: Ocupación & Lluvia</span>
        </button>
      </div>

      {/* Audio speech transcript output */}
      {assistantReply && (
        <div className="bg-white/10 p-3 rounded-2xl border border-white/15 text-xs text-blue-50 flex items-start gap-2.5">
          <Sparkles className="w-4 h-4 text-[#80D518] shrink-0 mt-0.5" />
          <div className="flex-1">
            <span className="font-bold text-[#80D518] block text-[11px] mb-0.5">Respuesta de Voz del Asistente:</span>
            <p className="leading-relaxed">{assistantReply}</p>
          </div>
        </div>
      )}
    </div>
  );
};
