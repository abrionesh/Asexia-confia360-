import React, { useState } from 'react';
import {
  Share2,
  Instagram,
  Star,
  ChefHat,
  TrendingUp,
  MapPin,
  Copy,
  Check,
  Sparkles,
  ExternalLink,
  Layers,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import {
  INITIAL_PUBLIC_REVIEWS,
  INITIAL_STAR_DISHES,
  INITIAL_COMPETITORS,
} from '../../services/reputationData';

interface LocalMarketingTabProps {
  onOpenImpactDashboard?: (dishName: string) => void;
}

export const LocalMarketingTab: React.FC<LocalMarketingTabProps> = ({
  onOpenImpactDashboard,
}) => {
  const { announceAriaLive } = useApp();

  const [copiedReviewId, setCopiedReviewId] = useState<string | null>(null);

  // Filter 5-star reviews
  const featuredReviews = INITIAL_PUBLIC_REVIEWS.filter(
    (r) => r.puntuacion === 5 && r.destacadaMarketing
  );

  const starDishes = INITIAL_STAR_DISHES;
  const competitors = INITIAL_COMPETITORS;

  const handleCopySocialPost = (review: typeof featuredReviews[0]) => {
    const postText = `⭐⭐⭐⭐⭐ "${review.texto}"\n\n— ${review.autor} en ${review.plataforma.toUpperCase()}.\n\n¡Gracias por elegirnos y valorar el trabajo de todo el equipo de cocina y sala! Ven a probarlo tú también. Reserva tu mesa hoy en ConfiA360.\n\n#GastronomiaMadrid #ComerBien #ConfIA360`;
    navigator.clipboard?.writeText(postText);
    setCopiedReviewId(review.id);
    setTimeout(() => setCopiedReviewId(null), 2000);
    announceAriaLive('Post para redes sociales copiado al portapapeles');
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-gradient-to-r from-amber-600 via-orange-600 to-rose-600 text-white p-5 rounded-2xl shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/20 text-white text-xs font-black uppercase tracking-wider border border-white/30">
              <Sparkles className="w-3.5 h-3.5" /> Fase 4: Marketing Local & Crecimiento
            </div>
            <h3 className="text-lg sm:text-xl font-brand font-black text-white">
              Atracción de Clientes & Benchmark de Competencia
            </h3>
            <p className="text-xs text-amber-100 max-w-2xl">
              Convierte las mejores opiniones en imanes de reservas para Google Posts e Instagram, monitoriza los platos más alabados y vigila la evolución de los restaurantes competidores de tu barrio.
            </p>
          </div>
          <div className="bg-white/10 p-3 rounded-xl border border-white/20 text-xs text-white self-start md:self-auto">
            <span className="block font-bold">Posición en el Barrio:</span>
            <span className="font-mono text-lg font-black text-white">#1 en Retiro</span>
            <span className="text-[11px] block text-amber-100">4.82★ vs 4.55★ media zona</span>
          </div>
        </div>
      </div>

      {/* SECTION 1: RESEÑAS DESTACADAS LISTAS PARA REDES SOCIALES */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h4 className="font-brand font-bold text-slate-900 text-base flex items-center gap-2">
              <Share2 className="w-4 h-4 text-orange-600" />
              Reseñas 5★ Seleccionadas para Google Posts & Instagram
            </h4>
            <p className="text-xs text-slate-500">
              Copia el copy optimizado con hashtags para compartir en redes sociales y atraer nuevos comensales.
            </p>
          </div>
          <span className="text-xs font-bold font-mono text-emerald-700 bg-emerald-50 px-2 py-1 rounded-lg border border-emerald-200">
            {featuredReviews.length} seleccionadas
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {featuredReviews.map((rev) => (
            <div
              key={rev.id}
              className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:border-orange-300 transition-all flex flex-col justify-between shadow-2xs"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-orange-100 text-orange-800">
                    {rev.plataforma}
                  </span>
                  <div className="flex items-center text-amber-500">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-current" />
                    ))}
                  </div>
                </div>

                <p className="text-xs text-slate-700 italic leading-relaxed">
                  "{rev.texto}"
                </p>

                <div className="text-[11px] font-bold text-slate-900 pt-1">
                  — {rev.autor}
                </div>
              </div>

              <div className="pt-3 mt-2 border-t border-slate-200 flex items-center justify-between">
                {rev.platoMencionado && (
                  <span className="text-[10px] font-bold text-[#0067B9] truncate max-w-[140px]">
                    Plato: {rev.platoMencionado}
                  </span>
                )}
                <button
                  onClick={() => handleCopySocialPost(rev)}
                  className="touch-target-min text-xs font-bold px-2.5 py-1.5 rounded-lg bg-[#022853] hover:bg-[#0067B9] text-white flex items-center gap-1 transition"
                >
                  {copiedReviewId === rev.id ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-400" />
                      <span>Copiado</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span>Copiar Post</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 2: PLATOS ESTRELLA CON MÁS MENCIONES ESPONTÁNEAS */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h4 className="font-brand font-bold text-slate-900 text-base flex items-center gap-2">
              <ChefHat className="w-4 h-4 text-[#0067B9]" />
              Platos Estrella Más Mencionados & Margen
            </h4>
            <p className="text-xs text-slate-500">
              Correlación entre el éxito reputacional del plato y su rentabilidad real en escandallo.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {starDishes.map((dish) => (
            <div
              key={dish.id}
              className="p-4 rounded-xl border border-slate-200 bg-white hover:border-blue-400 transition-all shadow-2xs space-y-3"
            >
              <div className="flex items-start justify-between">
                <h5 className="font-bold text-slate-900 text-xs sm:text-sm line-clamp-2">
                  {dish.nombrePlato}
                </h5>
                <span className="text-amber-500 font-mono font-bold text-xs flex items-center gap-0.5 shrink-0">
                  <Star className="w-3.5 h-3.5 fill-current" /> {dish.ratingMedio}
                </span>
              </div>

              <div className="flex items-baseline justify-between text-xs font-mono">
                <span className="text-slate-500">PVD: <strong>{dish.pvdVenta.toFixed(2)} €</strong></span>
                <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  {dish.margenActual}% margen
                </span>
              </div>

              <div className="text-[11px] text-slate-600 bg-slate-50 p-2 rounded-lg border border-slate-200">
                <span className="font-bold text-slate-800 block text-[10px] uppercase">
                  {dish.mencionesPositivas} menciones espontáneas
                </span>
                <span className="italic text-[10px] text-slate-500">
                  Keywords: {dish.palabrasClave.join(', ')}
                </span>
              </div>

              {onOpenImpactDashboard && (
                <button
                  onClick={() => onOpenImpactDashboard(dish.nombrePlato)}
                  className="w-full text-center text-[11px] font-bold text-[#0067B9] hover:underline flex items-center justify-center gap-1 pt-1"
                >
                  <Layers className="w-3 h-3" /> Ver en ImpactDashboard
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 3: RADAR DE COMPETIDORES EN 1.5 KM */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h4 className="font-brand font-bold text-slate-900 text-base flex items-center gap-2">
              <MapPin className="w-4 h-4 text-rose-600" />
              Radar de Competidores Locales (Radio 1.5 km - Retiro / Salamanca)
            </h4>
            <p className="text-xs text-slate-500">
              Benchmark continuo frente a los restaurantes del entorno para anticipar movimientos y fijar precios.
            </p>
          </div>
          <span className="text-xs font-mono font-bold text-slate-600 bg-slate-100 px-2 py-1 rounded-lg">
            4 locales analizados
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border border-slate-200 rounded-xl overflow-hidden">
            <thead className="bg-slate-50 text-slate-700 uppercase font-black tracking-wider text-[10px]">
              <tr>
                <th className="p-3">Restaurante Competidor</th>
                <th className="p-3">Distancia</th>
                <th className="p-3">Rating Google</th>
                <th className="p-3">Total Reseñas</th>
                <th className="p-3">Diferencial vs Nosotros</th>
                <th className="p-3">Puntos Débiles Detectados (Oportunidad)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {/* Nuestra Fila */}
              <tr className="bg-blue-50/60 font-bold border-b border-blue-200">
                <td className="p-3 text-[#0067B9] flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#80D518]" />
                  <span>Nuestro Restaurante (ConfiA360)</span>
                </td>
                <td className="p-3 font-mono">0.0 km</td>
                <td className="p-3 font-mono text-amber-600">4.82★</td>
                <td className="p-3 font-mono">1.480</td>
                <td className="p-3 font-mono text-emerald-700">Líder de zona</td>
                <td className="p-3 text-slate-600 font-normal">Alta fidelización con intercepción proactiva</td>
              </tr>

              {/* Competidores */}
              {competitors.map((comp) => (
                <tr key={comp.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="p-3 font-bold text-slate-900">{comp.nombre}</td>
                  <td className="p-3 font-mono text-slate-600">{comp.distanciaKm} km</td>
                  <td className="p-3 font-mono text-slate-800 flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                    {comp.ratingGoogle}★
                  </td>
                  <td className="p-3 font-mono text-slate-600">{comp.totalResenas}</td>
                  <td className="p-3 font-mono font-bold text-rose-600">
                    {comp.diferencialVsNosotros.toFixed(2)}★
                  </td>
                  <td className="p-3 text-slate-600 italic">
                    {comp.puntosDebiles}
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
