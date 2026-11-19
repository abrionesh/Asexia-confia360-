import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  LayoutDashboard,
  MessageSquare,
  Sparkles,
  ChefHat,
  Share2,
  Layers,
  Star,
  ShieldCheck,
  Bell,
  RefreshCw,
  ExternalLink,
} from 'lucide-react';
import { ReputationOverviewTab } from './ReputationOverviewTab';
import { FeedbackSimulatorTab } from './FeedbackSimulatorTab';
import { ReviewsManagementTab } from './ReviewsManagementTab';
import { OperationsKDSTab } from './OperationsKDSTab';
import { LocalMarketingTab } from './LocalMarketingTab';
import { ImpactDashboard } from '../cockpit/ImpactDashboard';

export type ReputationTabType = 'overview' | 'feedback' | 'reviews' | 'kds' | 'marketing' | 'impact';

export const ReputationModule: React.FC = () => {
  const { announceAriaLive, brandConfig, setActiveView } = useApp();
  const [activeTab, setActiveTab] = useState<ReputationTabType>('overview');
  const [impactDishInitial, setImpactDishInitial] = useState<string>('ART-01');

  const handleTabChange = (tab: ReputationTabType) => {
    setActiveTab(tab);
    announceAriaLive(`Cambiando a pestaña de reputación: ${tab}`);
  };

  const handleOpenImpactDashboard = (dishName: string) => {
    // Map dish name to sample impact entity if applicable
    if (dishName.toLowerCase().includes('solomillo')) {
      setImpactDishInitial('ART-01');
    } else if (dishName.toLowerCase().includes('tarta') || dishName.toLowerCase().includes('queso')) {
      setImpactDishInitial('ART-02');
    } else if (dishName.toLowerCase().includes('atún') || dishName.toLowerCase().includes('balfegó')) {
      setImpactDishInitial('ART-03');
    } else {
      setImpactDishInitial('ART-04');
    }
    setActiveTab('impact');
    announceAriaLive(`Abriendo ImpactDashboard para ${dishName}`);
  };

  return (
    <div className="space-y-6" data-testid="confia360-reputacion-module">
      {/* Top Header of the Reputation Module */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#022853] via-[#0067B9] to-[#80D518] flex items-center justify-center text-white shadow-md">
              <Star className="w-6 h-6 fill-amber-400 text-amber-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-brand font-black text-lg sm:text-xl text-[#022853]">
                  AsexIA Confia360 Reputación
                </span>
                <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#80D518]/20 text-[#022853] border border-[#80D518]/40">
                  Fases 1 a 4
                </span>
                <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded-full bg-blue-100 text-[#0067B9] border border-blue-200 hidden sm:inline">
                  Google · TripAdvisor · TheFork · CRM
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Capa transversal de experiencia del comensal: encuestas WhatsApp, intercepción privada, KDS y marketing local.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start md:self-auto">
            <div className="bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200 text-xs flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-slate-600 font-medium">Local: <strong>{brandConfig.venueName}</strong></span>
              <span className="font-mono font-bold text-amber-600">4.82★</span>
            </div>

            <button
              onClick={() => handleTabChange('impact')}
              className={`touch-target-min text-xs font-bold px-3 py-1.5 rounded-xl border transition flex items-center gap-1.5 ${
                activeTab === 'impact'
                  ? 'bg-[#0067B9] text-white border-[#0067B9] shadow-xs'
                  : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'
              }`}
              title="Abrir ImpactDashboard transversal"
            >
              <Layers className="w-3.5 h-3.5 text-[#80D518]" />
              <span className="hidden sm:inline">ImpactDashboard</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation Menu */}
        <div className="mt-4 pt-3 border-t border-slate-100 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-1.5 sm:gap-2">
          {[
            {
              id: 'overview',
              label: 'Dashboard & KPIs',
              sub: '4.82★ Consolidado',
              icon: LayoutDashboard,
              badgeColor: 'bg-blue-100 text-blue-800',
            },
            {
              id: 'feedback',
              label: 'Encuestas WhatsApp',
              sub: 'Firewall Bipolar',
              icon: MessageSquare,
              badgeColor: 'bg-emerald-100 text-emerald-800',
            },
            {
              id: 'reviews',
              label: 'Reseñas & Asistente IA',
              sub: 'Google / TripAdv',
              icon: Sparkles,
              badgeColor: 'bg-purple-100 text-purple-800',
            },
            {
              id: 'kds',
              label: 'Operaciones & KDS',
              sub: 'Tareas Turno',
              icon: ChefHat,
              badgeColor: 'bg-rose-100 text-rose-800',
            },
            {
              id: 'marketing',
              label: 'Marketing Local',
              sub: 'Platos & Radar',
              icon: Share2,
              badgeColor: 'bg-amber-100 text-amber-800',
            },
            {
              id: 'impact',
              label: 'ImpactDashboard',
              sub: 'Inspector 360',
              icon: Layers,
              badgeColor: 'bg-teal-100 text-teal-800',
            },
          ].map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleTabChange(item.id as ReputationTabType)}
                className={`touch-target-min relative rounded-xl p-2.5 sm:p-3 text-left transition-all duration-200 flex flex-col justify-between border ${
                  isActive
                    ? 'bg-[#022853] text-white border-[#022853] shadow-md ring-2 ring-[#022853]/20'
                    : 'bg-slate-50/70 hover:bg-white text-slate-700 border-slate-200/80 hover:border-slate-300'
                }`}
                aria-pressed={isActive}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors ${
                      isActive
                        ? 'bg-white/20 text-[#80D518]'
                        : 'bg-white text-[#022853] shadow-2xs border border-slate-200'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  <span
                    className={`text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded-full ${
                      isActive ? 'bg-white/20 text-white' : item.badgeColor
                    }`}
                  >
                    {item.sub}
                  </span>
                </div>
                <span className="font-brand font-bold text-xs sm:text-sm tracking-tight truncate block">
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Content Display */}
      <div className="animate-in fade-in duration-200">
        {activeTab === 'overview' && (
          <ReputationOverviewTab onSwitchTab={(tabId) => handleTabChange(tabId as any)} />
        )}

        {activeTab === 'feedback' && (
          <FeedbackSimulatorTab onSwitchTab={(tabId) => handleTabChange(tabId as any)} />
        )}

        {activeTab === 'reviews' && <ReviewsManagementTab />}

        {activeTab === 'kds' && <OperationsKDSTab />}

        {activeTab === 'marketing' && (
          <LocalMarketingTab
            onOpenImpactDashboard={(dish) => handleOpenImpactDashboard(dish)}
          />
        )}

        {activeTab === 'impact' && (
          <ImpactDashboard
            initialEntityId={impactDishInitial}
            onNavigateToModule={(view, tab) => {
              if (view === 'reputacion') {
                setActiveTab('overview');
              } else {
                setActiveView(view as any);
              }
            }}
          />
        )}
      </div>
    </div>
  );
};
