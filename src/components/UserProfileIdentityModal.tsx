import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { USER_ROLES } from '../types/userProfile';
import {
  X,
  User,
  Building,
  ShieldCheck,
  CreditCard,
  Briefcase,
  FileText,
  MapPin,
  Save,
  CheckCircle,
  Clock,
  Sparkles,
  ExternalLink,
  Phone,
  Mail,
  ChevronRight,
} from 'lucide-react';

export const UserProfileIdentityModal: React.FC = () => {
  const {
    isIdentityModalOpen,
    setIsIdentityModalOpen,
    businessIdentity,
    updateBusinessIdentity,
    activeRole,
    setActiveRole,
    announceAriaLive,
  } = useApp();

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(businessIdentity);
  const [saveSuccess, setSaveSuccess] = useState(false);

  if (!isIdentityModalOpen) return null;

  const currentRoleDef = USER_ROLES.find((r) => r.id === activeRole) || USER_ROLES[0];

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateBusinessIdentity(formData);
    setIsEditing(false);
    setSaveSuccess(true);
    announceAriaLive('Datos de identidad mercantil y fiscal actualizados correctamente');
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleChange = (field: keyof typeof businessIdentity, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="identity-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn"
      onClick={() => setIsIdentityModalOpen(false)}
    >
      <div
        className="relative w-full max-w-3xl max-h-[92vh] flex flex-col bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden text-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-gradient-to-r from-slate-900 via-slate-850 to-indigo-950/40">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
              <Building className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 id="identity-modal-title" className="text-xl font-bold tracking-tight text-white">
                  Identidad Fiscal & Mercantil
                </h2>
                <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Verificada
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Datos operativos del negocio sincronizados con el ecosistema AsexIA Confia360
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsIdentityModalOpen(false)}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800/80 transition-colors"
            aria-label="Cerrar ventana de identidad"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {saveSuccess && (
            <div className="p-3.5 rounded-xl bg-emerald-950/50 border border-emerald-500/40 text-emerald-200 text-sm flex items-center gap-2.5 animate-fadeIn">
              <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0" />
              <span>Los cambios de identidad fiscal se han guardado y sincronizado localmente.</span>
            </div>
          )}

          {/* Quick Profile Selector inside Identity */}
          <div className="bg-slate-800/60 rounded-xl p-4 border border-slate-700/60">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Rol Activo de Operación
              </span>
              <span className="text-xs text-indigo-400">Cambia de perfil para adaptar tu vista</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
              {USER_ROLES.map((role) => {
                const isActive = activeRole === role.id;
                return (
                  <button
                    key={role.id}
                    onClick={() => {
                      setActiveRole(role.id);
                      announceAriaLive(`Perfil activo cambiado a ${role.title}`);
                    }}
                    className={`p-2.5 rounded-lg text-left transition-all border text-xs font-medium flex flex-col justify-between ${
                      isActive
                        ? 'bg-indigo-600/30 border-indigo-500 text-white shadow-sm ring-1 ring-indigo-500/50'
                        : 'bg-slate-900/50 border-slate-700/60 text-slate-300 hover:bg-slate-800 hover:border-slate-600'
                    }`}
                  >
                    <span className="font-semibold block truncate">{role.title}</span>
                    <span className="text-[10px] text-slate-400 mt-1 line-clamp-1">{role.badge}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Business Details Form or Display */}
          {isEditing ? (
            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Nombre Comercial</label>
                  <input
                    type="text"
                    value={formData.companyName}
                    onChange={(e) => handleChange('companyName', e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white text-sm focus:border-indigo-500 focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Razón Social Legal</label>
                  <input
                    type="text"
                    value={formData.legalName}
                    onChange={(e) => handleChange('legalName', e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white text-sm focus:border-indigo-500 focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Titular Autónomo / Administrador</label>
                  <input
                    type="text"
                    value={formData.ownerName}
                    onChange={(e) => handleChange('ownerName', e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white text-sm focus:border-indigo-500 focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">NIF / CIF</label>
                  <input
                    type="text"
                    value={formData.cifNif}
                    onChange={(e) => handleChange('cifNif', e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white text-sm focus:border-indigo-500 focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Epígrafe IAE & Actividad</label>
                  <input
                    type="text"
                    value={formData.epigrafeIAE}
                    onChange={(e) => handleChange('epigrafeIAE', e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white text-sm focus:border-indigo-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Cuenta Bancaria Principal (IBAN)</label>
                  <input
                    type="text"
                    value={formData.iban}
                    onChange={(e) => handleChange('iban', e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white text-sm focus:border-indigo-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Domicilio Fiscal</label>
                  <input
                    type="text"
                    value={formData.fiscalAddress}
                    onChange={(e) => handleChange('fiscalAddress', e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white text-sm focus:border-indigo-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Código Postal y Localidad</label>
                  <input
                    type="text"
                    value={formData.postalCodeCity}
                    onChange={(e) => handleChange('postalCodeCity', e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white text-sm focus:border-indigo-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Gestoría Asignada</label>
                  <input
                    type="text"
                    value={formData.gestoriaName}
                    onChange={(e) => handleChange('gestoriaName', e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white text-sm focus:border-indigo-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Gestor de Referencia</label>
                  <input
                    type="text"
                    value={formData.gestorContact}
                    onChange={(e) => handleChange('gestorContact', e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white text-sm focus:border-indigo-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 text-sm text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg transition-all flex items-center gap-2 shadow-lg shadow-indigo-600/30"
                >
                  <Save className="w-4 h-4" />
                  Guardar Datos
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Card 1: Identificación Legal */}
                <div className="bg-slate-850/80 border border-slate-800 p-4 rounded-xl space-y-3">
                  <div className="flex items-center gap-2 text-indigo-400 font-semibold text-xs tracking-wider uppercase">
                    <User className="w-4 h-4" />
                    Titularidad & CIF
                  </div>
                  <div className="space-y-1.5">
                    <div>
                      <span className="text-[11px] text-slate-400">Titular Autónomo</span>
                      <p className="text-sm font-medium text-white">{businessIdentity.ownerName}</p>
                    </div>
                    <div className="flex justify-between items-center">
                      <div>
                        <span className="text-[11px] text-slate-400">NIF / CIF</span>
                        <p className="text-sm font-mono font-medium text-white">{businessIdentity.cifNif}</p>
                      </div>
                      <span className="px-2 py-0.5 text-[11px] font-mono bg-slate-800 text-slate-300 rounded border border-slate-700">
                        Régimen: Directa Simplificada
                      </span>
                    </div>
                    <div>
                      <span className="text-[11px] text-slate-400">Razón Social y Comercial</span>
                      <p className="text-sm text-slate-200">
                        {businessIdentity.companyName} <span className="text-slate-400">({businessIdentity.legalName})</span>
                      </p>
                    </div>
                  </div>
                </div>

                {/* Card 2: Domicilio & IAE */}
                <div className="bg-slate-850/80 border border-slate-800 p-4 rounded-xl space-y-3">
                  <div className="flex items-center gap-2 text-indigo-400 font-semibold text-xs tracking-wider uppercase">
                    <MapPin className="w-4 h-4" />
                    Domicilio Fiscal & Actividad
                  </div>
                  <div className="space-y-1.5">
                    <div>
                      <span className="text-[11px] text-slate-400">Dirección</span>
                      <p className="text-sm text-white">
                        {businessIdentity.fiscalAddress}, {businessIdentity.postalCodeCity}
                      </p>
                    </div>
                    <div>
                      <span className="text-[11px] text-slate-400">Epígrafe IAE</span>
                      <p className="text-sm font-medium text-slate-200">{businessIdentity.epigrafeIAE}</p>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-emerald-400">
                      <CheckCircle className="w-3.5 h-3.5" />
                      Censo de Actividades Económicas AEAT OK
                    </div>
                  </div>
                </div>

                {/* Card 3: Bancos & Tesorería */}
                <div className="bg-slate-850/80 border border-slate-800 p-4 rounded-xl space-y-3">
                  <div className="flex items-center gap-2 text-indigo-400 font-semibold text-xs tracking-wider uppercase">
                    <CreditCard className="w-4 h-4" />
                    Cuenta Bancaria Principal (SEPA)
                  </div>
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center">
                      <span className="text-[11px] text-slate-400">IBAN Operativo</span>
                      <span className="px-1.5 py-0.5 text-[10px] bg-indigo-950/60 text-indigo-300 rounded border border-indigo-800">
                        Conciliación Auto
                      </span>
                    </div>
                    <p className="text-sm font-mono tracking-wide text-white font-semibold">
                      {businessIdentity.iban}
                    </p>
                    <p className="text-xs text-slate-400">
                      Entidad adherida a transferencias inmediatas y adeudos B2B.
                    </p>
                  </div>
                </div>

                {/* Card 4: Certificado & Gestoría */}
                <div className="bg-slate-850/80 border border-slate-800 p-4 rounded-xl space-y-3">
                  <div className="flex items-center gap-2 text-indigo-400 font-semibold text-xs tracking-wider uppercase">
                    <Briefcase className="w-4 h-4" />
                    Gestoría & Firma Telemática
                  </div>
                  <div className="space-y-1.5">
                    <div>
                      <span className="text-[11px] text-slate-400">Asesor Colegiado</span>
                      <p className="text-sm text-white font-medium">
                        {businessIdentity.gestoriaName} — {businessIdentity.gestorContact}
                      </p>
                    </div>
                    <div className="flex justify-between items-center pt-1 border-t border-slate-800">
                      <span className="text-xs text-slate-300">{businessIdentity.digitalCertificate}</span>
                      <span className="text-xs text-emerald-400 flex items-center gap-1">
                        <Clock className="w-3 h-3" /> Cad: {businessIdentity.certificateExpiry}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-800">
                <div className="text-xs text-slate-400">
                  ¿Necesitas modificar datos para modelos fiscales oficiales?
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setFormData(businessIdentity);
                      setIsEditing(true);
                    }}
                    className="px-4 py-2 text-xs font-semibold bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 rounded-lg transition-colors flex items-center gap-1.5"
                  >
                    Modificar Datos
                  </button>
                  <button
                    onClick={() => {
                      announceAriaLive('Ficha técnica de identidad descargada');
                      setIsIdentityModalOpen(false);
                    }}
                    className="px-4 py-2 text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition-colors flex items-center gap-1.5 shadow"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    Aceptar & Cerrar
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
