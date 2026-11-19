import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import {
  PhoneOff,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Sparkles,
  Zap,
  Radio,
  Minimize2,
  ChevronDown,
  ShieldCheck,
  Send,
  MessageSquare,
  ArrowRight,
  RefreshCw,
} from 'lucide-react';

interface GeminiLiveVoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCallEnded: (summary: {
    durationSeconds: number;
    userTranscripts: string[];
    modelTranscripts: string[];
    detectedAction?: any;
  }) => void;
}

export const GeminiLiveVoiceModal: React.FC<GeminiLiveVoiceModalProps> = ({
  isOpen,
  onClose,
  onCallEnded,
}) => {
  const {
    setActiveView,
    setActiveOperativaTab,
    openDrawer360,
    setIsReportModalOpen,
    setIsIdentityModalOpen,
    announceAriaLive,
  } = useApp();

  // Connection & Call State
  const [connectionStatus, setConnectionStatus] = useState<
    'connecting' | 'connected' | 'error' | 'disconnected'
  >('connecting');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [callSeconds, setCallSeconds] = useState<number>(0);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isSpeakerMuted, setIsSpeakerMuted] = useState<boolean>(false);
  const [isModelSpeaking, setIsModelSpeaking] = useState<boolean>(false);
  const [isUserSpeaking, setIsUserSpeaking] = useState<boolean>(false);

  // Live Transcripts
  const [liveUserTranscript, setLiveUserTranscript] = useState<string>('');
  const [liveModelTranscript, setLiveModelTranscript] = useState<string>('');
  const [historyItems, setHistoryItems] = useState<
    Array<{ sender: 'user' | 'model'; text: string; time: string }>
  >([]);

  // Detected Navigation Action
  const [detectedAction, setDetectedAction] = useState<{
    label: string;
    section: string;
    query: string;
  } | null>(null);

  // Audio Context & WebSocket References
  const wsRef = useRef<WebSocket | null>(null);
  const inputAudioCtxRef = useRef<AudioContext | null>(null);
  const outputAudioCtxRef = useRef<AudioContext | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  const nextStartTimeRef = useRef<number>(0);
  const activeSourcesRef = useRef<AudioBufferSourceNode[]>([]);
  const callTimerRef = useRef<any>(null);
  const isMutedRef = useRef<boolean>(false);
  const isSpeakerMutedRef = useRef<boolean>(false);

  // Audio Visualizer Volume Meter
  const [visualizerLevel, setVisualizerLevel] = useState<number>(10);
  const visualizerTimerRef = useRef<any>(null);

  // Sync refs with state
  useEffect(() => {
    isMutedRef.current = isMuted;
  }, [isMuted]);

  useEffect(() => {
    isSpeakerMutedRef.current = isSpeakerMuted;
  }, [isSpeakerMuted]);

  // Format call duration "MM:SS"
  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainder = secs % 60;
    return `${String(mins).padStart(2, '0')}:${String(remainder).padStart(2, '0')}`;
  };

  // -------------------------------------------------------------
  // Audio Encoding / Decoding Utilities (16kHz in, 24kHz out)
  // -------------------------------------------------------------
  const float32To16BitPCM = (float32Array: Float32Array): ArrayBuffer => {
    const buffer = new ArrayBuffer(float32Array.length * 2);
    const view = new DataView(buffer);
    for (let i = 0; i < float32Array.length; i++) {
      const s = Math.max(-1, Math.min(1, float32Array[i]));
      view.setInt16(i * 2, s < 0 ? s * 0x8000 : s * 0x7fff, true);
    }
    return buffer;
  };

  const arrayBufferToBase64 = (buffer: ArrayBuffer): string => {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
  };

  const base64To16BitPCM = (base64: string): Float32Array => {
    const binaryString = window.atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    const int16 = new Int16Array(bytes.buffer);
    const float32 = new Float32Array(int16.length);
    for (let i = 0; i < int16.length; i++) {
      float32[i] = int16[i] / 32768.0;
    }
    return float32;
  };

  // Process and detect navigation actions from transcript
  const checkNavigationAction = (text: string) => {
    const lower = text.toLowerCase();
    if (lower.includes('fich') || lower.includes('presenc') || lower.includes('jornad')) {
      setDetectedAction({ label: '⏱️ Presencia & Fichaje', section: 'fichaje', query: 'fichaje' });
    } else if (lower.includes('gasto') || lower.includes('ticket') || lower.includes('ocr')) {
      setDetectedAction({ label: '🧾 Facturas & Gastos OCR', section: 'gastos', query: 'gastos' });
    } else if (lower.includes('tesor') || lower.includes('banc') || lower.includes('saldo') || lower.includes('fiscal')) {
      setDetectedAction({ label: '🏦 Tesorería & Bancos', section: 'tesoreria', query: 'tesoreria' });
    } else if (lower.includes('reserv') || lower.includes('mesa') || lower.includes('sala')) {
      setDetectedAction({ label: '🍽️ Reservas de Sala', section: 'reservas', query: 'reservas' });
    } else if (lower.includes('turn') || lower.includes('horari') || lower.includes('personal')) {
      setDetectedAction({ label: '👥 Cuadrante de Turnos', section: 'turnos', query: 'turnos' });
    } else if (lower.includes('albaran') || lower.includes('360') || lower.includes('pedido')) {
      setDetectedAction({ label: '📦 Hub Albarán 360', section: 'albaran', query: 'albaran' });
    }
  };

  const executeActionNow = (action: { section: string; label: string }) => {
    if (action.section === 'fichaje') {
      setActiveView('operativa');
      setActiveOperativaTab('fichaje');
    } else if (action.section === 'gastos') {
      setActiveView('operativa');
      setActiveOperativaTab('gastos');
    } else if (action.section === 'tesoreria') {
      setActiveView('operativa');
      setActiveOperativaTab('economico_alertas');
    } else if (action.section === 'reservas') {
      setActiveView('operativa');
      setActiveOperativaTab('reservas_voz');
    } else if (action.section === 'turnos') {
      setActiveView('operativa');
      setActiveOperativaTab('rrhh_turnos');
    } else if (action.section === 'albaran') {
      openDrawer360('albaran');
    }
    announceAriaLive(`Navegado a ${action.label}`);
  };

  // Play audio chunk received from model via Web Audio API
  const playAudioChunk = async (base64Data: string) => {
    if (isSpeakerMutedRef.current) return;

    try {
      if (!outputAudioCtxRef.current) {
        outputAudioCtxRef.current = new (window.AudioContext ||
          (window as any).webkitAudioContext)({
          sampleRate: 24000,
        });
      }
      const ctx = outputAudioCtxRef.current;
      if (ctx.state === 'suspended') {
        await ctx.resume();
      }

      const float32Data = base64To16BitPCM(base64Data);
      const audioBuffer = ctx.createBuffer(1, float32Data.length, 24000);
      audioBuffer.getChannelData(0).set(float32Data);

      const source = ctx.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(ctx.destination);

      const currentTime = ctx.currentTime;
      if (nextStartTimeRef.current < currentTime) {
        nextStartTimeRef.current = currentTime;
      }

      source.start(nextStartTimeRef.current);
      nextStartTimeRef.current += audioBuffer.duration;
      activeSourcesRef.current.push(source);

      setIsModelSpeaking(true);

      source.onended = () => {
        const idx = activeSourcesRef.current.indexOf(source);
        if (idx > -1) activeSourcesRef.current.splice(idx, 1);
        if (activeSourcesRef.current.length === 0) {
          setIsModelSpeaking(false);
        }
      };
    } catch (err) {
      console.warn('Error playing audio chunk:', err);
    }
  };

  // Interruption handling (Gemini detected user speaking over model)
  const handleInterruption = () => {
    activeSourcesRef.current.forEach((src) => {
      try {
        src.stop();
      } catch {}
    });
    activeSourcesRef.current = [];
    if (outputAudioCtxRef.current) {
      nextStartTimeRef.current = outputAudioCtxRef.current.currentTime;
    }
    setIsModelSpeaking(false);
  };

  // -------------------------------------------------------------
  // Start Voice Call Session (WebSocket + Mic Stream)
  // -------------------------------------------------------------
  const startLiveSession = async () => {
    setConnectionStatus('connecting');
    setErrorMessage(null);
    setCallSeconds(0);
    setHistoryItems([]);
    setLiveUserTranscript('');
    setLiveModelTranscript('');

    // 1. Establish WebSocket connection to /ws/live
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${window.location.host}/ws/live`;

    let ws: WebSocket;
    try {
      ws = new WebSocket(wsUrl);
      wsRef.current = ws;
    } catch (err: any) {
      console.error('Failed to create WebSocket:', err);
      setConnectionStatus('error');
      setErrorMessage('No se pudo establecer el socket de voz con el servidor.');
      return;
    }

    ws.onopen = () => {
      console.log('Gemini Live WebSocket opened');
    };

    ws.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data);

        if (msg.type === 'connected') {
          setConnectionStatus('connected');
          // Start call timer
          callTimerRef.current = setInterval(() => {
            setCallSeconds((s) => s + 1);
          }, 1000);
        } else if (msg.type === 'audio' && msg.audio) {
          playAudioChunk(msg.audio);
        } else if (msg.type === 'interrupted') {
          handleInterruption();
        } else if (msg.type === 'model_transcription' && msg.text) {
          setLiveModelTranscript(msg.text);
          checkNavigationAction(msg.text);
          setHistoryItems((prev) => {
            const last = prev[prev.length - 1];
            if (last && last.sender === 'model') {
              return [
                ...prev.slice(0, -1),
                { ...last, text: `${last.text} ${msg.text}`.trim() },
              ];
            }
            return [
              ...prev,
              {
                sender: 'model',
                text: msg.text,
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              },
            ];
          });
        } else if (msg.type === 'user_transcription' && msg.text) {
          setLiveUserTranscript(msg.text);
          checkNavigationAction(msg.text);
          setHistoryItems((prev) => {
            const last = prev[prev.length - 1];
            if (last && last.sender === 'user') {
              return [
                ...prev.slice(0, -1),
                { ...last, text: `${last.text} ${msg.text}`.trim() },
              ];
            }
            return [
              ...prev,
              {
                sender: 'user',
                text: msg.text,
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              },
            ];
          });
        } else if (msg.type === 'status' && msg.status === 'no_api_key') {
          setConnectionStatus('connected');
          setErrorMessage(msg.message);
          // Set simulated welcoming greeting
          setLiveModelTranscript('Hola, estoy conectado en modo voz interactiva de Confía360.');
        } else if (msg.type === 'error') {
          setConnectionStatus('error');
          setErrorMessage(msg.message || 'Error en la sesión Gemini Live');
        } else if (msg.type === 'closed') {
          setConnectionStatus('disconnected');
        }
      } catch (err) {
        console.error('Error handling WebSocket message:', err);
      }
    };

    ws.onerror = (e) => {
      console.warn('WebSocket error:', e);
      setConnectionStatus('error');
      setErrorMessage('Incidencia conectando con el canal de audio en tiempo real.');
    };

    ws.onclose = () => {
      setConnectionStatus('disconnected');
    };

    // 2. Start Microphone Audio Capture (16kHz mono)
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          channelCount: 1,
          sampleRate: 16000,
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });
      mediaStreamRef.current = stream;

      const inputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({
        sampleRate: 16000,
      });
      inputAudioCtxRef.current = inputCtx;

      const source = inputCtx.createMediaStreamSource(stream);
      const processor = inputCtx.createScriptProcessor(4096, 1, 1);
      processorRef.current = processor;

      source.connect(processor);
      processor.connect(inputCtx.destination);

      processor.onaudioprocess = (e) => {
        if (isMutedRef.current) return;
        if (wsRef.current?.readyState !== WebSocket.OPEN) return;

        const channelData = e.inputBuffer.getChannelData(0);

        // Calculate simple volume level for visualizer
        let sum = 0;
        for (let i = 0; i < channelData.length; i += 8) {
          sum += Math.abs(channelData[i]);
        }
        const avg = sum / (channelData.length / 8);
        const levelPct = Math.min(100, Math.max(10, Math.round(avg * 400)));
        setVisualizerLevel(levelPct);
        setIsUserSpeaking(avg > 0.02);

        // Convert Float32 to 16-bit PCM little-endian
        const pcmBuffer = float32To16BitPCM(channelData);
        const base64Audio = arrayBufferToBase64(pcmBuffer);

        wsRef.current.send(
          JSON.stringify({
            type: 'audio',
            audio: base64Audio,
          })
        );
      };
    } catch (micErr: any) {
      console.warn('Microphone permission or capture error:', micErr);
      setErrorMessage(
        'Acceso al micrófono denegado o no disponible. Puedes interactuar escribiendo o verificar permisos.'
      );
    }
  };

  // End Call and Cleanup
  const endCall = () => {
    // Collect summaries
    const userTrans = historyItems
      .filter((h) => h.sender === 'user')
      .map((h) => h.text);
    const modelTrans = historyItems
      .filter((h) => h.sender === 'model')
      .map((h) => h.text);

    onCallEnded({
      durationSeconds: callSeconds,
      userTranscripts: userTrans,
      modelTranscripts: modelTrans,
      detectedAction,
    });

    cleanupAudioAndSocket();
    onClose();
  };

  const cleanupAudioAndSocket = () => {
    if (callTimerRef.current) {
      clearInterval(callTimerRef.current);
      callTimerRef.current = null;
    }
    if (visualizerTimerRef.current) {
      clearInterval(visualizerTimerRef.current);
      visualizerTimerRef.current = null;
    }

    // Stop active playback sources
    activeSourcesRef.current.forEach((src) => {
      try {
        src.stop();
      } catch {}
    });
    activeSourcesRef.current = [];

    // Disconnect mic processor
    if (processorRef.current) {
      try {
        processorRef.current.disconnect();
      } catch {}
      processorRef.current = null;
    }

    // Stop media tracks
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }

    // Close audio contexts
    if (inputAudioCtxRef.current) {
      try {
        inputAudioCtxRef.current.close();
      } catch {}
      inputAudioCtxRef.current = null;
    }

    if (outputAudioCtxRef.current) {
      try {
        outputAudioCtxRef.current.close();
      } catch {}
      outputAudioCtxRef.current = null;
    }

    // Close WebSocket
    if (wsRef.current) {
      try {
        wsRef.current.close();
      } catch {}
      wsRef.current = null;
    }
  };

  useEffect(() => {
    if (isOpen) {
      startLiveSession();
    } else {
      cleanupAudioAndSocket();
    }

    return () => {
      cleanupAudioAndSocket();
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in select-none"
      role="dialog"
      aria-label="Llamada de voz en vivo con Gemini Live"
    >
      <div className="relative w-full max-w-md h-[92vh] max-h-[700px] bg-[#0b141a] text-white rounded-3xl shadow-2xl border border-emerald-900/50 flex flex-col overflow-hidden">
        {/* WhatsApp Voice Call Top Bar */}
        <div className="p-4 flex items-center justify-between border-b border-emerald-950/80 bg-[#075e54]/30 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-emerald-500/20 text-[#25D366] flex items-center justify-center border border-emerald-500/30">
              <Radio className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-bold text-white tracking-wide">
                  Gemini Live 360
                </h2>
                <span className="text-[10px] bg-[#25D366] text-slate-950 font-black px-1.5 py-0.2 rounded-full uppercase">
                  gemini-3.8-live
                </span>
              </div>
              <p className="text-[11px] text-emerald-300 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-[#25D366]" />
                <span>Cifrado y procesado seguro en servidor</span>
              </p>
            </div>
          </div>

          <button
            onClick={endCall}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800/60 transition"
            title="Minimizar llamada"
          >
            <ChevronDown className="w-5 h-5" />
          </button>
        </div>

        {/* Central Audio Waves & Avatar Area */}
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center relative overflow-hidden">
          {/* Animated Concentric Rings */}
          <div className="relative flex items-center justify-center mb-6">
            {/* Outer Aura Ring */}
            <div
              className={`absolute rounded-full transition-all duration-300 ${
                isModelSpeaking
                  ? 'w-48 h-48 sm:w-56 sm:h-56 bg-emerald-500/20 animate-ping'
                  : isUserSpeaking
                  ? 'w-44 h-44 sm:w-52 sm:h-52 bg-teal-500/20 animate-pulse'
                  : 'w-36 h-36 bg-emerald-500/10'
              }`}
            />
            {/* Middle Ring */}
            <div
              className={`absolute rounded-full transition-all duration-300 ${
                isModelSpeaking
                  ? 'w-36 h-36 sm:w-44 sm:h-44 bg-[#25D366]/30'
                  : isUserSpeaking
                  ? 'w-32 h-32 sm:w-40 sm:h-40 bg-teal-400/25'
                  : 'w-28 h-28 bg-emerald-500/15'
              }`}
            />

            {/* Core Avatar */}
            <div
              className={`relative z-10 w-24 h-24 sm:w-28 sm:h-28 rounded-full flex items-center justify-center shadow-2xl transition-transform duration-300 ${
                isModelSpeaking
                  ? 'scale-110 bg-gradient-to-tr from-[#128C7E] to-[#25D366] text-slate-950 ring-4 ring-[#25D366]/40'
                  : isUserSpeaking
                  ? 'scale-105 bg-gradient-to-tr from-teal-600 to-emerald-400 text-white ring-4 ring-teal-400/30'
                  : 'bg-gradient-to-tr from-slate-800 to-slate-700 text-[#25D366] ring-2 ring-emerald-500/20'
              }`}
            >
              <Sparkles className="w-12 h-12" />
            </div>
          </div>

          {/* Caller Title & Status */}
          <h3 className="text-lg font-bold text-white mb-1">
            ConfiA360 Concierge Voz
          </h3>

          {/* Call Status Pill */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900/90 border border-emerald-500/30 text-xs font-semibold mb-2">
            {connectionStatus === 'connecting' && (
              <>
                <RefreshCw className="w-3 h-3 text-amber-400 animate-spin" />
                <span className="text-amber-300">Conectando Gemini Live...</span>
              </>
            )}
            {connectionStatus === 'connected' && (
              <>
                <span className="w-2 h-2 rounded-full bg-[#25D366] animate-pulse" />
                <span className="text-emerald-300 font-mono">
                  {formatTime(callSeconds)} •{' '}
                  {isModelSpeaking
                    ? 'Hablando Gemini Live'
                    : isUserSpeaking
                    ? 'Escuchando tu voz...'
                    : 'En línea (Di algo)'}
                </span>
              </>
            )}
            {connectionStatus === 'error' && (
              <span className="text-rose-400">Modo local / Reconexión</span>
            )}
            {connectionStatus === 'disconnected' && (
              <span className="text-slate-400">Llamada finalizada</span>
            )}
          </div>

          {/* Waveform Equalizer Bars */}
          <div className="flex items-center justify-center gap-1 h-8 my-2">
            {[20, 45, 80, 50, 95, 60, 85, 40, 70, 90, 55, 75, 35].map((val, idx) => {
              const height = isModelSpeaking
                ? Math.min(100, Math.max(15, (val * 1.2) % 100))
                : isUserSpeaking
                ? Math.min(100, Math.max(15, (visualizerLevel * (val / 50)) % 100))
                : 15;

              return (
                <span
                  key={idx}
                  style={{ height: `${height}%` }}
                  className={`w-1 rounded-full transition-all duration-150 ${
                    isModelSpeaking
                      ? 'bg-[#25D366]'
                      : isUserSpeaking
                      ? 'bg-teal-400'
                      : 'bg-emerald-950'
                  }`}
                />
              );
            })}
          </div>

          {/* Live Subtitle Transcript Banner */}
          <div className="w-full max-h-24 overflow-y-auto px-4 py-2 mt-2 bg-slate-900/80 rounded-2xl border border-emerald-900/50 text-left space-y-1 text-xs">
            {liveUserTranscript && (
              <p className="text-emerald-300 truncate">
                <span className="font-bold text-[#25D366]">Tú:</span> "{liveUserTranscript}"
              </p>
            )}
            {liveModelTranscript && (
              <p className="text-slate-200 line-clamp-2">
                <span className="font-bold text-teal-400">Gemini:</span> {liveModelTranscript}
              </p>
            )}
            {!liveUserTranscript && !liveModelTranscript && (
              <p className="text-slate-400 italic text-center text-[11px]">
                Habla naturalmente sobre turnos, fichaje, tickets OCR, tesorería o reservas...
              </p>
            )}
          </div>

          {/* Detected Action Prompt (1-Tap Nav) */}
          {detectedAction && (
            <div className="w-full mt-3 p-2.5 rounded-xl bg-emerald-950/80 border border-[#25D366]/40 flex items-center justify-between text-left animate-in slide-in-from-bottom-2">
              <div className="leading-tight">
                <span className="text-[10px] font-bold uppercase text-[#25D366] flex items-center gap-1">
                  <Zap className="w-3 h-3 text-[#25D366]" />
                  Acción Detectada
                </span>
                <p className="text-xs font-bold text-white">{detectedAction.label}</p>
              </div>
              <button
                onClick={() => executeActionNow(detectedAction)}
                className="flex items-center gap-1 bg-[#25D366] text-slate-950 text-xs font-bold px-3 py-1.5 rounded-lg shadow hover:bg-emerald-400 active:scale-95 transition"
              >
                <span>Abrir</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {errorMessage && (
            <p className="text-[11px] text-amber-300/90 mt-2 px-2 bg-amber-950/30 py-1 rounded-lg border border-amber-800/40">
              ℹ️ {errorMessage}
            </p>
          )}
        </div>

        {/* WhatsApp Call Bottom Action Controls */}
        <div className="p-4 sm:p-6 bg-[#075e54]/20 border-t border-emerald-950/80 flex items-center justify-around shrink-0">
          {/* Mute Mic */}
          <button
            onClick={() => setIsMuted(!isMuted)}
            className={`w-12 h-12 rounded-full flex items-center justify-center transition transform active:scale-90 ${
              isMuted
                ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                : 'bg-slate-800 text-slate-200 hover:text-white hover:bg-slate-700'
            }`}
            title={isMuted ? 'Activar micrófono' : 'Silenciar micrófono'}
            aria-label={isMuted ? 'Activar micrófono' : 'Silenciar micrófono'}
          >
            {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </button>

          {/* End Call Button (Red WhatsApp Pill) */}
          <button
            onClick={endCall}
            className="w-16 h-16 rounded-full bg-rose-600 hover:bg-rose-500 text-white flex items-center justify-center shadow-xl shadow-rose-950/50 transform active:scale-90 transition ring-4 ring-rose-500/20"
            title="Finalizar llamada"
            aria-label="Colgar llamada"
          >
            <PhoneOff className="w-7 h-7" />
          </button>

          {/* Speaker Mute / Toggle */}
          <button
            onClick={() => setIsSpeakerMuted(!isSpeakerMuted)}
            className={`w-12 h-12 rounded-full flex items-center justify-center transition transform active:scale-90 ${
              isSpeakerMuted
                ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                : 'bg-slate-800 text-slate-200 hover:text-white hover:bg-slate-700'
            }`}
            title={isSpeakerMuted ? 'Activar altavoz' : 'Silenciar altavoz'}
            aria-label={isSpeakerMuted ? 'Activar altavoz' : 'Silenciar altavoz'}
          >
            {isSpeakerMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
          </button>
        </div>
      </div>
    </div>
  );
};
