import React from 'react';
import { useApp } from '../../context/AppContext';
import { CHEF_KITCHEN_DATA } from '../../services/cockpitData';
import {
  ChefHat,
  AlertTriangle,
  Flame,
  Clock,
  Sparkles,
  Users,
  CheckCircle2,
  TrendingUp,
  ShieldAlert,
  ArrowRight,
  Package,
  FileText,
  ChevronRight,
} from 'lucide-react';

export const ChefKitchenPerspective: React.FC = () => {
  const { setActiveView, setActiveOperativaTab, announceAriaLive } = useApp();
  const {
    miseEnPlaceHoy,
    alergenosHoyDeclarados,
    stockFrescoCaducidad,
    escandallosEnAlerta,
    equipoCocinaHoy,
  } = CHEF_KITCHEN_DATA;

  const handleJumpToSourceInvoice = (invoiceNum: string) => {
    setActiveView('operativa');
    setActiveOperativaTab('gastos');
    announceAriaLive(`Navegación 360º: Saltando a la factura de compra ${invoiceNum}`);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      
      {/* Banner de Presentación de Rol: Jefe de Cocina */}
      <div className="bg-gradient-to-r from-amber-700 via-orange-800 to-[#022853] text-white rounded-3xl p-6 sm:p-7 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-300 text-amber-950">
                Vista Jefe de Cocina / Chef Ejecutivo
              </span>
              <span className="text-xs text-orange-200">Horizonte: Turno de Hoy & Producción</span>
            </div>
            <h3 className="text-2xl font-black font-brand">
              Pase de Cocina, Escandallos & Control de Mermas
            </h3>
            <p className="text-xs text-orange-100 max-w-2xl leading-relaxed">
              Pensado para la pantalla de cocina: información limpia, rápida y de alto impacto sobre producción, alérgenos en reservas de hoy, control de costes de platos y rotación de producto fresco.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-xs border border-white/20 p-4 rounded-2xl flex items-center gap-3 self-start lg:self-auto">
            <ChefHat className="w-10 h-10 text-amber-300" />
            <div>
              <span className="text-[10px] uppercase font-bold text-orange-200 tracking-wider block">
                Servicio de Hoy
              </span>
              <span className="text-sm font-black text-white">412 Raciones Estimadas</span>
              <span className="text-[10px] text-amber-200 block">Comida 13:30h - 16:30h · Cena 20:30h - 23:45h</span>
            </div>
          </div>
        </div>
      </div>

      {/* Grid 2 Columnas: Alérgenos de Hoy & Alertas de Mermas / Caducidad */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Alérgenos Declarados en Reservas de Hoy (Seguridad Alimentaria) */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4 ring-2 ring-rose-500/10">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-rose-100 text-rose-700 flex items-center justify-center font-bold">
                <ShieldAlert className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-brand font-black text-base text-[#022853]">
                  Alérgenos e Intolerancias (Reservas de Hoy)
                </h4>
                <p className="text-xs text-slate-500">Detectados automáticamente por el Agente de Sala</p>
              </div>
            </div>
            <span className="text-xs font-black text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
              {alergenosHoyDeclarados.length} Avisos Activos
            </span>
          </div>

          <div className="space-y-3">
            {alergenosHoyDeclarados.map((item, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-2xl bg-rose-50/60 border border-rose-200 space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <span className="font-black text-xs text-rose-800 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-rose-600 animate-pulse" />
                    {item.tipo}
                  </span>
                  <span className="text-[11px] font-bold text-rose-700 bg-white px-2 py-0.5 rounded-md border border-rose-200">
                    {item.pax} Pax
                  </span>
                </div>
                <p className="text-xs text-slate-700 font-medium">
                  {item.observaciones}
                </p>
              </div>
            ))}
          </div>

          <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
            <span>Los avisos han sido transferidos automáticamente al sistema de comandas TPV de sala.</span>
          </div>
        </div>

        {/* Rotación de Stock Fresco & Sugerencias del Chef (Evitar Mermas) */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4 ring-2 ring-emerald-500/10">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                <Package className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-brand font-black text-base text-[#022853]">
                  Stock Fresco Próximo a Caducar
                </h4>
                <p className="text-xs text-slate-500">Cocina predictiva anti-desperdicio</p>
              </div>
            </div>
            <span className="text-xs font-black text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              Cero Mermas
            </span>
          </div>

          <div className="space-y-3">
            {stockFrescoCaducidad.map((prod, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-2xl bg-emerald-50/50 border border-emerald-200 space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-black text-xs text-emerald-900">{prod.producto}</span>
                    <span className="text-[10px] font-bold bg-white text-emerald-800 px-1.5 py-0.5 rounded border border-emerald-200">
                      {prod.cantidad}
                    </span>
                  </div>
                  <span className="text-[11px] font-black text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                    {prod.impacto}
                  </span>
                </div>
                <div className="text-xs text-slate-600 flex justify-between items-center pt-1 border-t border-emerald-100">
                  <span>Caducidad: <strong className="text-slate-800">{prod.caducidad}</strong></span>
                  <span className="text-emerald-800 font-bold">✓ {prod.accion}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="p-3 bg-blue-50 rounded-xl border border-blue-200 text-xs text-[#0067B9] flex items-center justify-between">
            <span>¿Publicar automáticamente como Sugerencia del Día en Carta Digital?</span>
            <button className="px-3 py-1 bg-[#0067B9] text-white font-bold rounded-lg hover:bg-blue-700 transition">
              Activar
            </button>
          </div>
        </div>
      </div>

      {/* Monitor de Mise en Place por Partidas (Producción en Vivo) */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <Flame className="w-5 h-5 text-orange-600" />
            <h4 className="font-brand font-black text-base text-[#022853]">
              Progreso de Mise en Place de Cocina (Turno Actual)
            </h4>
          </div>
          <span className="text-xs text-slate-500">Meta: Servicio Comidas 13:30h</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {miseEnPlaceHoy.map((partida, idx) => (
            <div
              key={idx}
              className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3"
            >
              <div className="flex justify-between items-start">
                <span className="font-brand font-bold text-xs text-slate-800">
                  {partida.partida}
                </span>
                <span
                  className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                    partida.avancePct === 100
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  {partida.avancePct}%
                </span>
              </div>

              <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-300 ${
                    partida.avancePct === 100 ? 'bg-[#48A222]' : 'bg-[#0067B9]'
                  }`}
                  style={{ width: `${partida.avancePct}%` }}
                />
              </div>

              <div className="text-[11px] text-slate-500 flex justify-between">
                <span>Raciones estimadas:</span>
                <strong className="text-slate-800">{partida.racionesEstimadas} pax</strong>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Control de Escandallos con Coste Desviado */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-amber-600" />
            <div>
              <h4 className="font-brand font-black text-base text-[#022853]">
                Escandallos en Riesgo por Subidas de Proveedores
              </h4>
              <p className="text-xs text-slate-500">Márgenes comprimidos detectados automáticamente por OCR</p>
            </div>
          </div>
          <span className="text-xs font-bold text-amber-800 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
            2 Platos Afectados
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {escandallosEnAlerta.map((plato, idx) => (
            <div
              key={idx}
              className="p-4 rounded-2xl border border-amber-200 bg-amber-50/40 space-y-2.5"
            >
              <div className="flex justify-between items-start">
                <div>
                  <span className="font-brand font-black text-sm text-[#022853] block">
                    {plato.plato}
                  </span>
                  <span className="text-xs text-slate-500">
                    Coste actual: <strong>{plato.costeTeorico}</strong> · PVP: <strong>{plato.pvp}</strong>
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-xs font-black text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full block">
                    Margen: {plato.margenActualPct}%
                  </span>
                  <span className="text-[10px] text-slate-400">Meta: {plato.margenObjetivoPct}%</span>
                </div>
              </div>

              <div className="p-2.5 bg-white rounded-xl border border-amber-200/80 text-xs text-slate-600">
                <strong>Motivo:</strong> {plato.motivo}
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-xs">
                <button
                  onClick={() => handleJumpToSourceInvoice('FAC-2026-9021')}
                  className="px-3 py-1.5 rounded-xl bg-purple-100 hover:bg-purple-200 text-purple-900 font-bold flex items-center gap-1.5 transition"
                  title="Navegación 360º: Ver factura de Distribuciones Cárnicas Sierra"
                >
                  <FileText className="w-3.5 h-3.5 text-purple-700" />
                  <span>Ver Factura 360º de Origen</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>

                <div className="flex items-center gap-2">
                  <button className="px-3 py-1.5 rounded-xl border border-slate-300 font-bold text-slate-700 hover:bg-slate-50">
                    Revisar Gramaje
                  </button>
                  <button className="px-3 py-1.5 rounded-xl bg-[#0067B9] text-white font-bold hover:bg-blue-700">
                    Ajustar PVP +1,50 €
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Equipo de Cocina en Turno */}
      <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-700">
        <div className="flex items-center gap-3">
          <Users className="w-5 h-5 text-[#0067B9]" />
          <div>
            <span className="font-bold text-slate-900">Equipo de Cocina Hoy: </span>
            <span>{equipoCocinaHoy.cocinerosEnTurno} Cocineros + {equipoCocinaHoy.ayudantes} Ayudantes (Total 6 en plantilla)</span>
          </div>
        </div>
        <div className="text-slate-500">
          Jefe: <strong>{equipoCocinaHoy.jefeCocina}</strong> · 2º: <strong>{equipoCocinaHoy.segundo}</strong>
        </div>
      </div>
    </div>
  );
};
