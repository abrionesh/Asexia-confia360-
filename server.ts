import express from 'express';
import http from 'http';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Modality, LiveServerMessage } from '@google/genai';
import { WebSocketServer, WebSocket } from 'ws';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json({ limit: '15mb' }));

// Initialize GoogleGenAI client securely on server
let aiClient: GoogleGenAI | null = null;
if (process.env.GEMINI_API_KEY) {
  aiClient = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// -------------------------------------------------------------
// AGENT 1: Reservas y Sala (Conversational / Voice NLU)
// Extracts date, time, guests, name in 1 single turn; offers alternative slots; detects transfer
// -------------------------------------------------------------
app.post('/api/gemini/reservation-voice', async (req, res) => {
  try {
    const { transcript, currentReservation, failCount = 0, venueAvailability } = req.body;

    if (!transcript) {
      return res.status(400).json({ error: 'Falta transcripción' });
    }

    if (aiClient) {
      const prompt = `Eres el Agente de Reservas y Sala de ConfiA360 (Hostelería).
El usuario dijo: "${transcript}".
Estado actual de datos: ${JSON.stringify(currentReservation || {})}.
Fallas consecutivas previas en entender: ${failCount}.
Disponibilidad del restaurante: ${JSON.stringify(venueAvailability || { openHours: "13:00 - 16:30 y 20:00 - 23:30", fullHours: ["15:00"] })}.

Instrucciones:
1. Extrae en un solo turno:
   - guests (número de personas)
   - date (fecha en formato YYYY-MM-DD o día relativo entendido)
   - time (hora ej: 15:00 o 21:00)
   - customerName (nombre si lo dijo)
   - phone (teléfono si lo dio)
   - notes (alergias, terraza, cumpleaños)
2. Analiza si la hora solicitada coincide con horas llenas (por ejemplo las 15:00 está llena):
   - Si no hay disponibilidad, propone de forma amable 2 alternativas cercanas (ej. 14:30 o 15:30).
3. Detección de frustración o 2 fallos consecutivos:
   - Si el usuario muestra enfado ("quiero hablar con un humano", "no me entiendes", etc.) o si failCount >= 2, activa transferToHuman: true.
4. Responde con un mensaje hablado breve y cordial para el cliente en español.

Devuelve ÚNICAMENTE un objeto JSON válido con este formato:
{
  "extracted": {
    "guests": number | null,
    "date": string | null,
    "time": string | null,
    "customerName": string | null,
    "phone": string | null,
    "notes": string | null
  },
  "isComplete": boolean,
  "spokenResponse": string,
  "transferToHuman": boolean,
  "alternativeTimes": string[],
  "confidenceScore": number
}`;

      const aiResponse = await aiClient.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          temperature: 0.2,
        },
      });

      const responseText = aiResponse.text?.trim() || '{}';
      try {
        const parsed = JSON.parse(responseText);
        return res.json(parsed);
      } catch {
        // fallback json parse
      }
    }

    // Heuristic / Mock fallback for offline or no-key execution
    const lower = (transcript || '').toLowerCase();
    const guestsMatch = lower.match(/(\d+)\s*(personas|comensales|amigos|pax)/) || lower.match(/para\s*(\d+)/);
    const guests = guestsMatch ? parseInt(guestsMatch[1], 10) : (currentReservation?.guests || 4);

    const timeMatch = lower.match(/(\d{1,2}):?(\d{2})?\s*(h|horas|pm|am)?/) || lower.match(/a las\s*(\d{1,2})/);
    let time = currentReservation?.time || '21:00';
    if (timeMatch) {
      const hour = parseInt(timeMatch[1], 10);
      time = `${hour.toString().padStart(2, '0')}:00`;
    }

    const isFrustrated = lower.includes('humano') || lower.includes('persona') || lower.includes('mierda') || failCount >= 2;
    const isConflict = time === '15:00';

    res.json({
      extracted: {
        guests,
        date: currentReservation?.date || 'Este viernes',
        time,
        customerName: currentReservation?.customerName || null,
        phone: currentReservation?.phone || null,
        notes: null,
      },
      isComplete: !!currentReservation?.customerName,
      spokenResponse: isFrustrated
        ? 'Entiendo perfectamente. Le transfiero de inmediato con un compañero de recepción. Un momento por favor.'
        : isConflict
        ? `No tengo disponibilidad para ${guests} comensales a las ${time}, pero tengo mesa libre a las 14:30 o a las 15:30. ¿Alguna le conviene?`
        : `Tengo mesa confirmada para ${guests} personas a las ${time}. ¿A qué nombre prefiere que la anote?`,
      transferToHuman: isFrustrated,
      alternativeTimes: isConflict ? ['14:30', '15:30'] : [],
      confidenceScore: 0.95,
    });
  } catch (error) {
    console.error('Error in reservation-voice agent:', error);
    res.status(500).json({ error: 'Error procesando solicitud de voz' });
  }
});

// -------------------------------------------------------------
// AGENT 2: RRHH y Turnos (Chatbot PWA)
// Confirmación de turnos, cálculo de saldo de vacaciones y justificación de olvido de fichaje
// -------------------------------------------------------------
app.post('/api/gemini/hr-assistant', async (req, res) => {
  try {
    const { message, employeeContext } = req.body;
    const emp = employeeContext || {
      name: 'Carlos Ruiz',
      role: 'Camarero / Sala',
      vacationDaysLeft: 14,
      nextShift: { date: 'Mañana', time: '10:00 - 16:30', location: 'Local Centro (Restaurante ConfiA360)' },
    };

    if (aiClient) {
      const prompt = `Eres el Agente Inteligente de RRHH y Turnos de ConfiA360 para empleados de hostelería.
El empleado es: ${JSON.stringify(emp)}.
El mensaje del empleado es: "${message}".

Capacidades:
1. Confirmación de turno próximo.
2. Solicitud de vacaciones: calcula si los días solicitados caben en su saldo disponible (${emp.vacationDaysLeft} días), verifica cobertura del equipo y genera un borrador formal listo para aprobación del gerente.
3. Incidencia / Fichaje asistido por olvido: Si el empleado dice "se me olvidó fichar" o similar, genera un registro de incidencia formal especificando hora estimada y motivo para regularización del gerente.

Devuelve ÚNICAMENTE un objeto JSON con este formato:
{
  "replyMessage": string,
  "actionType": "none" | "confirm_shift" | "vacation_draft" | "missed_punch_incident",
  "actionPayload": {
    "title": string,
    "details": string,
    "status": "pending_manager_approval" | "confirmed",
    "daysCount"?: number
  } | null
}`;

      const aiResponse = await aiClient.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          temperature: 0.3,
        },
      });

      const parsed = JSON.parse(aiResponse.text?.trim() || '{}');
      return res.json(parsed);
    }

    // Heuristic fallback
    const lower = (message || '').toLowerCase();
    if (lower.includes('vacaciones') || lower.includes('días')) {
      res.json({
        replyMessage: `He verificado tu saldo actual (${emp.vacationDaysLeft} días disponibles). He preparado el borrador de solicitud de vacaciones para revisión del gerente de sala.`,
        actionType: 'vacation_draft',
        actionPayload: {
          title: 'Solicitud de Vacaciones',
          details: 'Periodo solicitado: 5 días laborables. Saldo restante estimado: 9 días.',
          status: 'pending_manager_approval',
          daysCount: 5,
        },
      });
    } else if (lower.includes('fichar') || lower.includes('olvid') || lower.includes('registro')) {
      res.json({
        replyMessage: 'No te preocupes. He generado un registro de incidencia por olvido de fichaje para que tu responsable valide la entrada de tu jornada.',
        actionType: 'missed_punch_incident',
        actionPayload: {
          title: 'Regularización de Fichaje',
          details: 'Fichaje de entrada retrospectivo. Motivo: Olvido en apertura de sala.',
          status: 'pending_manager_approval',
        },
      });
    } else {
      res.json({
        replyMessage: `Hola ${emp.name}. Recuerda que tu próximo turno es ${emp.nextShift.date} a las ${emp.nextShift.time} en ${emp.nextShift.location}. ¿Deseas confirmarlo ahora?`,
        actionType: 'confirm_shift',
        actionPayload: {
          title: 'Confirmación de Turno',
          details: `${emp.nextShift.date} (${emp.nextShift.time})`,
          status: 'confirmed',
        },
      });
    }
  } catch (error) {
    console.error('Error in HR agent:', error);
    res.status(500).json({ error: 'Error en agente de RRHH' });
  }
});

// -------------------------------------------------------------
// AGENT 3: Agente Económico y OCR de Gastos
// Extrae datos de ticket/factura en 3 pasos, detecta duplicados/anomalías de tesorería
// -------------------------------------------------------------
app.post('/api/gemini/economic-ocr', async (req, res) => {
  try {
    const { imageBase64, sampleText } = req.body;

    if (aiClient && imageBase64) {
      const mimeMatch = imageBase64.match(/^data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+);base64,/);
      const mimeType = mimeMatch ? mimeMatch[1] : 'image/jpeg';
      const cleanBase64 = imageBase64.replace(/^data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+);base64,/, '');

      const prompt = `Eres el Agente Económico y Auditor de Facturas de ConfiA360 para hostelería.
Analiza este ticket/factura gastronómica o de suministro.
1. Extrae:
   - providerName (Nombre del emisor o proveedor)
   - invoiceNumber (Número de factura o ticket)
   - date (Fecha formato YYYY-MM-DD)
   - taxBase (Base imponible en número decimal)
   - vatRate (Porcentaje de IVA: 10% hostelería/alimentos o 21% general)
   - vatAmount (Cuota de IVA en número decimal)
   - totalAmount (Total importe con impuestos en euros)
   - category (Sugiere una categoría contable: 'Materia Prima / Perecederos', 'Bebidas y Licores', 'Suministros (Luz/Gas/Agua)', 'Mantenimiento y Maquinaria', 'Servicios Profesionales')
2. Auditoría de tesorería y anomalías:
   - Comprueba si parece haber un gasto recurrente duplicado o advertencia para el gerente.
   - Genera un resumen conciso para que el gerente solo necesite pulsar "Aprobar" en 1 toque.

Devuelve ÚNICAMENTE un JSON con:
{
  "providerName": string,
  "invoiceNumber": string,
  "date": string,
  "taxBase": number,
  "vatRate": number,
  "vatAmount": number,
  "totalAmount": number,
  "suggestedCategory": string,
  "auditAlert": string | null,
  "requiresAttention": boolean
}`;

      const aiResponse = await aiClient.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: [
          {
            inlineData: {
              mimeType,
              data: cleanBase64,
            },
          },
          {
            text: prompt,
          },
        ],
        config: {
          responseMimeType: 'application/json',
        },
      });

      const parsed = JSON.parse(aiResponse.text?.trim() || '{}');
      return res.json(parsed);
    }

    // Heuristic / Mock simulated OCR result
    const samples = [
      {
        providerName: 'Iberdrola Clientes S.A.',
        invoiceNumber: 'IBER-2026-8841',
        date: new Date().toISOString().split('T')[0],
        taxBase: 412.50,
        vatRate: 21,
        vatAmount: 86.63,
        totalAmount: 499.13,
        suggestedCategory: 'Suministros (Luz/Gas/Agua)',
        auditAlert: '⚠️ Alerta de Tesorería: He detectado 2 facturas de electricidad de importe casi idéntico en los últimos 30 días. Verifica si corresponde a dos locales distintos (Local Centro y Local Terraza).',
        requiresAttention: true,
      },
      {
        providerName: 'Distribuciones Cárnicas Sierra S.L.',
        invoiceNumber: 'DC-9921',
        date: new Date().toISOString().split('T')[0],
        taxBase: 380.00,
        vatRate: 10,
        vatAmount: 38.00,
        totalAmount: 418.00,
        suggestedCategory: 'Materia Prima / Perecederos',
        auditAlert: null,
        requiresAttention: false,
      },
      {
        providerName: 'Bodegas & Vinos Rioja Alta',
        invoiceNumber: 'FAC-4109',
        date: new Date().toISOString().split('T')[0],
        taxBase: 245.00,
        vatRate: 21,
        vatAmount: 51.45,
        totalAmount: 296.45,
        suggestedCategory: 'Bebidas y Licores',
        auditAlert: null,
        requiresAttention: false,
      },
    ];

    const pick = samples[Math.floor(Math.random() * samples.length)];
    res.json(pick);
  } catch (error) {
    console.error('Error in economic OCR agent:', error);
    res.status(500).json({ error: 'Error procesando OCR' });
  }
});

// Health endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    appName: 'ConfiA360',
    branding: 'Asexia Digitalización',
    geminiActive: !!aiClient,
    timestamp: new Date().toISOString(),
  });
});

const server = http.createServer(app);

// -------------------------------------------------------------
// GEMINI LIVE API: Real-time Bidirectional Voice Conversations
// Uses WebSocket on /ws/live and model 'gemini-3.8-live'
// -------------------------------------------------------------
const wss = new WebSocketServer({ noServer: true });

wss.on('connection', async (clientWs: WebSocket) => {
  console.log('[Live API] Client connected to voice session');

  if (!aiClient) {
    clientWs.send(
      JSON.stringify({
        type: 'status',
        status: 'no_api_key',
        message: 'Clave GEMINI_API_KEY no detectada en servidor. Operando en modo local interactivo.',
      })
    );
    return;
  }

  let session: any = null;

  try {
    session = await aiClient.live.connect({
      model: 'gemini-3.8-live',
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Aoede' },
          },
        },
        systemInstruction: `Eres el Asistente de Voz en Vivo de ConfiA360 para hostelería y pymes en España.
Tu labor es conversar en tiempo real con el usuario de manera natural, ejecutiva, cálida y en español fluido.
Puedes responder sobre:
1. Presencia y Fichaje laboral: cómo fichar con cero toque, estado de jornada, horas trabajadas.
2. Facturas y Gastos OCR: procesamiento de tickets, albaranes, IVA e IRPF.
3. Tesorería y Bancos: saldo de tesorería, alertas de duplicados, conciliación y previsión fiscal.
4. Reservas de Sala y Mesas: estado del comedor, comensales, gestión de turnos de comida y cena.
5. Cuadrante de Turnos y RRHH: horarios de empleados y personal del restaurante.
6. Albarán 360 y Trazabilidad Transversal: pedidos de proveedores hasta cobro final.

DIRECTRICES DE CONVERSACIÓN HABLADA:
- Respuestas breves (1 a 3 oraciones directas) y naturales para conversación por voz sin demoras.
- Si el usuario te pide navegar o ejecutar una acción (ej. "fichar", "ver facturas", "mirar reservas", "ver tesorería", "abrir albarán"), confírmalo con claridad.`,
        outputAudioTranscription: {},
        inputAudioTranscription: {},
      },
      callbacks: {
        onopen: () => {
          if (clientWs.readyState === WebSocket.OPEN) {
            clientWs.send(
              JSON.stringify({
                type: 'connected',
                model: 'gemini-3.8-live',
                message: 'Sesión Gemini Live activa. Puedes empezar a hablar.',
              })
            );
          }
        },
        onmessage: (message: LiveServerMessage) => {
          if (clientWs.readyState !== WebSocket.OPEN) return;

          // Process parts in modelTurn (audio and text)
          const parts = message.serverContent?.modelTurn?.parts || [];
          for (const part of parts) {
            if (part.inlineData?.data) {
              clientWs.send(
                JSON.stringify({
                  type: 'audio',
                  audio: part.inlineData.data,
                  mimeType: part.inlineData.mimeType || 'audio/pcm;rate=24000',
                })
              );
            }
            if (part.text) {
              clientWs.send(
                JSON.stringify({
                  type: 'model_transcription',
                  text: part.text,
                })
              );
            }
          }

          // Handle server-side transcriptions
          if (message.serverContent?.outputAudioTranscription?.text) {
            clientWs.send(
              JSON.stringify({
                type: 'model_transcription',
                text: message.serverContent.outputAudioTranscription.text,
              })
            );
          }

          if (message.serverContent?.inputAudioTranscription?.text) {
            clientWs.send(
              JSON.stringify({
                type: 'user_transcription',
                text: message.serverContent.inputAudioTranscription.text,
              })
            );
          }

          // Handle interruption
          if (message.serverContent?.interrupted) {
            clientWs.send(JSON.stringify({ type: 'interrupted' }));
          }

          // Handle turn complete
          if (message.serverContent?.turnComplete) {
            clientWs.send(JSON.stringify({ type: 'turn_complete' }));
          }
        },
        onerror: (err: any) => {
          console.error('[Live API] Session error:', err);
          if (clientWs.readyState === WebSocket.OPEN) {
            clientWs.send(
              JSON.stringify({
                type: 'error',
                message: 'Incidencia en la conexión con Gemini Live.',
              })
            );
          }
        },
        onclose: () => {
          if (clientWs.readyState === WebSocket.OPEN) {
            clientWs.send(JSON.stringify({ type: 'closed' }));
          }
        },
      },
    });

    clientWs.on('message', (raw) => {
      try {
        const payload = JSON.parse(raw.toString());
        if (payload.type === 'audio' && payload.audio) {
          session?.sendRealtimeInput({
            audio: {
              data: payload.audio,
              mimeType: 'audio/pcm;rate=16000',
            },
          });
        } else if (payload.type === 'text' && payload.text) {
          session?.sendClientContent({
            turns: [
              {
                role: 'user',
                parts: [{ text: payload.text }],
              },
            ],
            turnComplete: true,
          });
        }
      } catch (e) {
        console.error('[Live API] Error handling client packet:', e);
      }
    });

    clientWs.on('close', () => {
      if (session) {
        try {
          session.close();
        } catch {}
      }
    });
  } catch (err: any) {
    console.error('[Live API] Failed to initialize session:', err);
    if (clientWs.readyState === WebSocket.OPEN) {
      clientWs.send(
        JSON.stringify({
          type: 'error',
          message: `Error al conectar con Gemini Live (${err?.message || 'Error de red'}).`,
        })
      );
    }
  }
});

// Upgrade handling for /ws/live
server.on('upgrade', (request, socket, head) => {
  try {
    const url = new URL(request.url || '', `http://${request.headers.host || 'localhost'}`);
    if (url.pathname === '/ws/live') {
      wss.handleUpgrade(request, socket, head, (ws) => {
        wss.emit('connection', ws, request);
      });
      return;
    }
  } catch {
    socket.destroy();
  }
});

// Setup Vite middlewares in development or serve static in production
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        ws: {
          server,
        },
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  server.listen(PORT, '0.0.0.0', () => {
    console.log(`ConfiA360 server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
