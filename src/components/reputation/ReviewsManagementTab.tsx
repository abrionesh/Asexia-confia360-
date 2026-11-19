import React, { useState } from 'react';
import {
  Star,
  Sparkles,
  MessageSquare,
  Send,
  CheckCircle2,
  AlertTriangle,
  Copy,
  ExternalLink,
  Filter,
  Check,
  ChevronDown,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { PublicReview, SentimentType, PlatformType } from '../../types/reputation';
import {
  INITIAL_PUBLIC_REVIEWS,
  generateAiResponseDraft,
} from '../../services/reputationData';

export const ReviewsManagementTab: React.FC = () => {
  const { announceAriaLive } = useApp();

  const [reviews, setReviews] = useState<PublicReview[]>(INITIAL_PUBLIC_REVIEWS);
  const [selectedReviewId, setSelectedReviewId] = useState<string>(reviews[0]?.id || 'REV-01');
  const [filterPlatform, setFilterPlatform] = useState<PlatformType | 'todas'>('todas');
  const [filterSentiment, setFilterSentiment] = useState<SentimentType | 'todos'>('todos');
  const [responseDraft, setResponseDraft] = useState<string>('');
  const [selectedTone, setSelectedTone] = useState<'empatico' | 'protocolario' | 'agradecimiento'>('empatico');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const selectedReview = reviews.find((r) => r.id === selectedReviewId) || reviews[0];

  const handleGenerateDraft = (review: PublicReview, tone: 'empatico' | 'protocolario' | 'agradecimiento') => {
    const draft = generateAiResponseDraft(review, tone);
    setResponseDraft(draft);
    announceAriaLive(`Borrador generado con IA en tono ${tone}`);
  };

  const handlePublishResponse = () => {
    if (!responseDraft) return;
    const updated = reviews.map((r) =>
      r.id === selectedReviewId
        ? {
            ...r,
            estado: 'respondida' as const,
            respuestaOficial: responseDraft,
          }
        : r
    );
    setReviews(updated);
    announceAriaLive(`Respuesta oficial guardada para reseña de ${selectedReview.autor}`);
  };

  const handleCopyDraft = () => {
    if (responseDraft) {
      navigator.clipboard?.writeText(responseDraft);
      setCopiedId(selectedReviewId);
      setTimeout(() => setCopiedId(null), 2000);
      announceAriaLive('Borrador copiado al portapapeles');
    }
  };

  const filteredReviews = reviews.filter((r) => {
    if (filterPlatform !== 'todas' && r.plataforma !== filterPlatform) return false;
    if (filterSentiment !== 'todos' && r.sentimiento !== filterSentiment) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Top Filter and Platform Selector */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          <span className="text-xs font-black uppercase tracking-wider text-slate-500 mr-1 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" /> Canal:
          </span>
          {(['todas', 'google', 'tripadvisor', 'thefork', 'instagram'] as const).map((plat) => (
            <button
              key={plat}
              onClick={() => setFilterPlatform(plat)}
              className={`touch-target-min text-xs font-bold px-3 py-1.5 rounded-xl capitalize transition-all border ${
                filterPlatform === plat
                  ? 'bg-[#0067B9] text-white border-[#0067B9] shadow-xs'
                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
            >
              {plat}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-black uppercase tracking-wider text-slate-500 mr-1">
            Sentimiento:
          </span>
          {(['todos', 'positivo', 'critico'] as const).map((sent) => (
            <button
              key={sent}
              onClick={() => setFilterSentiment(sent)}
              className={`touch-target-min text-xs font-bold px-3 py-1.5 rounded-xl capitalize transition-all border ${
                filterSentiment === sent
                  ? 'bg-[#022853] text-white border-[#022853]'
                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
            >
              {sent}
            </button>
          ))}
        </div>
      </div>

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN: REVIEWS FEED (6 COLS) */}
        <div className="lg:col-span-6 space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-500 px-1 font-bold">
            <span>Bandeja Multicanal ({filteredReviews.length} reseñas)</span>
            <span>Ordenadas por fecha reciente</span>
          </div>

          <div className="space-y-3 max-h-[620px] overflow-y-auto pr-1">
            {filteredReviews.map((rev) => {
              const isSelected = rev.id === selectedReviewId;
              return (
                <div
                  key={rev.id}
                  onClick={() => {
                    setSelectedReviewId(rev.id);
                    setResponseDraft(rev.borradorIa || rev.respuestaOficial || '');
                  }}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-blue-50/40 border-[#0067B9] shadow-md ring-2 ring-[#0067B9]/20'
                      : 'bg-white border-slate-200 hover:border-slate-300 shadow-2xs'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                          rev.plataforma === 'google'
                            ? 'bg-blue-100 text-blue-800'
                            : rev.plataforma === 'tripadvisor'
                            ? 'bg-emerald-100 text-emerald-800'
                            : rev.plataforma === 'thefork'
                            ? 'bg-teal-100 text-teal-800'
                            : 'bg-pink-100 text-pink-800'
                        }`}
                      >
                        {rev.plataforma}
                      </span>
                      <h4 className="font-bold text-slate-900 text-sm">{rev.autor}</h4>
                    </div>

                    <div className="flex items-center gap-1 text-amber-500 font-bold font-mono text-xs">
                      {Array.from({ length: rev.puntuacion }).map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-current" />
                      ))}
                    </div>
                  </div>

                  <p className="text-xs text-slate-700 mt-2 line-clamp-3 leading-relaxed">
                    "{rev.texto}"
                  </p>

                  <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-[11px] pt-2 border-t border-slate-100">
                    <div className="flex items-center gap-2 text-slate-500">
                      <span>{rev.fecha}</span>
                      {rev.platoMencionado && (
                        <>
                          <span>·</span>
                          <span className="text-blue-700 font-bold">{rev.platoMencionado}</span>
                        </>
                      )}
                    </div>

                    <div>
                      {rev.estado === 'respondida' ? (
                        <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md font-bold text-[10px] border border-emerald-200">
                          <CheckCircle2 className="w-3 h-3" /> Respondida
                        </span>
                      ) : rev.estado === 'borrador_generado' ? (
                        <span className="inline-flex items-center gap-1 text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md font-bold text-[10px] border border-amber-200">
                          <Sparkles className="w-3 h-3" /> Borrador IA listo
                        </span>
                      ) : (
                        <span className="text-rose-700 bg-rose-50 px-2 py-0.5 rounded-md font-bold text-[10px] border border-rose-200">
                          Nueva
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* RIGHT COLUMN: DETAIL & AI RESPONSE ASSISTANT (6 COLS) */}
        {selectedReview && (
          <div className="lg:col-span-6 bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-100 text-[#0067B9] flex items-center justify-center font-bold text-xs">
                  IA
                </div>
                <div>
                  <h4 className="font-brand font-bold text-slate-900 text-sm">
                    Asistente de Respuestas Protocolizadas
                  </h4>
                  <p className="text-[11px] text-slate-500">
                    Genera respuestas personalizadas que protegen la marca y fidelizan al cliente.
                  </p>
                </div>
              </div>
            </div>

            {/* Selected Review Summary Card */}
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900 text-xs">
                  {selectedReview.autor} ({selectedReview.plataforma.toUpperCase()})
                </span>
                <span className="text-amber-600 font-bold font-mono text-xs flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 fill-current" /> {selectedReview.puntuacion}★
                </span>
              </div>
              <p className="text-xs text-slate-700 italic">
                "{selectedReview.texto}"
              </p>
              {selectedReview.motivos.length > 0 && (
                <div className="flex flex-wrap gap-1 pt-1">
                  {selectedReview.motivos.map((m, i) => (
                    <span
                      key={i}
                      className="text-[10px] bg-white text-slate-600 px-2 py-0.5 rounded-md border border-slate-200 font-mono"
                    >
                      #{m}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Response Tone Selectors */}
            <div className="space-y-1.5">
              <span className="text-xs font-bold text-slate-700 block">
                Selecciona el tono de respuesta con IA:
              </span>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'empatico', label: 'Empático & Cercano' },
                  { id: 'agradecimiento', label: 'Agradecido 5★' },
                  { id: 'protocolario', label: 'Protocolo Formal' },
                ].map((tone) => (
                  <button
                    key={tone.id}
                    onClick={() => {
                      setSelectedTone(tone.id as any);
                      handleGenerateDraft(selectedReview, tone.id as any);
                    }}
                    className={`text-xs font-bold p-2 rounded-xl border transition-all text-center ${
                      selectedTone === tone.id
                        ? 'bg-[#0067B9] text-white border-[#0067B9] shadow-xs'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {tone.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Response Textarea */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-800">
                  Borrador de Respuesta Oficial:
                </label>
                <button
                  onClick={() => handleGenerateDraft(selectedReview, selectedTone)}
                  className="text-[11px] font-bold text-[#0067B9] hover:underline flex items-center gap-1"
                >
                  <Sparkles className="w-3 h-3" /> Regenerar Borrador
                </button>
              </div>
              <textarea
                rows={5}
                value={responseDraft || selectedReview.borradorIa || selectedReview.respuestaOficial || ''}
                onChange={(e) => setResponseDraft(e.target.value)}
                placeholder="El borrador generado aparecerá aquí para que puedas editarlo antes de enviar..."
                className="w-full text-xs p-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#0067B9] focus:outline-none text-slate-800 leading-relaxed font-sans"
              />
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-2">
              <button
                onClick={handleCopyDraft}
                className="touch-target-min text-xs font-bold px-3 py-2 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 flex items-center gap-1.5"
              >
                {copiedId === selectedReviewId ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>¡Copiado!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copiar Texto</span>
                  </>
                )}
              </button>

              <button
                onClick={handlePublishResponse}
                className="touch-target-min bg-[#022853] hover:bg-[#0067B9] text-white font-black text-xs px-4 py-2 rounded-xl flex items-center gap-2 shadow-md transition"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Publicar Respuesta en {selectedReview.plataforma.toUpperCase()}</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
