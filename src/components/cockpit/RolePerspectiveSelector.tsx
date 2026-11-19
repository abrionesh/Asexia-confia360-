import React from 'react';
import { RolePerspective } from '../../types/cockpit';
import { ROLE_PERSONAS_CONFIG } from '../../services/cockpitData';
import {
  Crown,
  ChefHat,
  ConciergeBell,
  Briefcase,
  FileCheck2,
  HelpCircle,
  Sparkles,
  ArrowRight,
} from 'lucide-react';

interface RolePerspectiveSelectorProps {
  currentRole: RolePerspective;
  onSelectRole: (role: RolePerspective) => void;
}

export const RolePerspectiveSelector: React.FC<RolePerspectiveSelectorProps> = ({
  currentRole,
  onSelectRole,
}) => {
  const roleIcons: Record<RolePerspective, React.ComponentType<{ className?: string }>> = {
    dueno: Crown,
    cocinero: ChefHat,
    jefe_sala: ConciergeBell,
    gerente: Briefcase,
    administracion: FileCheck2,
  };

  const activePersona = ROLE_PERSONAS_CONFIG[currentRole];

  return (
    <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-xs space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-[#0067B9]/10 text-[#0067B9]">
              <Sparkles className="w-4 h-4" />
            </span>
            <h3 className="text-base font-black font-brand text-[#022853]">
              Perspectiva de Gestión por Rol en Hostelería
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Cada rol responde a necesidades y horizontes distintos: cambia de perspectiva para ver el negocio con los ojos de cada responsable.
          </p>
        </div>
        <span className="text-[11px] font-bold text-slate-400 self-start sm:self-auto bg-slate-50 px-2.5 py-1 rounded-full border border-slate-200">
          5 Roles Especializados
        </span>
      </div>

      {/* Role Selection Buttons Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
        {(Object.keys(ROLE_PERSONAS_CONFIG) as RolePerspective[]).map((roleKey) => {
          const config = ROLE_PERSONAS_CONFIG[roleKey];
          const Icon = roleIcons[roleKey];
          const isSelected = currentRole === roleKey;

          return (
            <button
              key={roleKey}
              onClick={() => onSelectRole(roleKey)}
              className={`p-3 rounded-2xl border text-left transition-all duration-200 flex flex-col justify-between ${
                isSelected
                  ? 'bg-[#022853] text-white border-[#022853] shadow-md ring-2 ring-[#022853]/20'
                  : 'bg-slate-50/70 hover:bg-white text-slate-700 border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors ${
                    isSelected
                      ? 'bg-white/15 text-[#80D518]'
                      : 'bg-white text-[#0067B9] border border-slate-200 shadow-2xs'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <span
                  className={`text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded-full ${
                    isSelected
                      ? 'bg-white/20 text-white'
                      : 'bg-slate-200/80 text-slate-600'
                  }`}
                >
                  {config.badge.split('·')[0].trim()}
                </span>
              </div>

              <div>
                <span className="block font-brand font-black text-xs sm:text-sm tracking-tight truncate">
                  {config.title}
                </span>
                <span
                  className={`text-[10px] line-clamp-1 mt-0.5 ${
                    isSelected ? 'text-slate-300' : 'text-slate-500'
                  }`}
                >
                  {config.subtitle}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Role Context Callout: "¿Qué se pregunta este rol y cómo necesita la información?" */}
      {activePersona && (
        <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="text-xs font-black uppercase tracking-wider text-[#0067B9]">
                Foco prioritario de {activePersona.title}:
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                Nivel {activePersona.priorityLevel.toUpperCase()}
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1 text-xs text-slate-600">
              {activePersona.primaryQuestions.map((q, idx) => (
                <div key={idx} className="flex items-start gap-1.5">
                  <span className="text-[#80D518] font-bold mt-0.5">●</span>
                  <span className="font-medium">{q}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
