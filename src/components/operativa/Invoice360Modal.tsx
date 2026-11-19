import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ExpenseTicket, InvoiceStatus, DocumentType, InvoiceProductLine } from '../../types';
import {
  X,
  FileText,
  DollarSign,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  CheckCircle2,
  Clock,
  ArrowRight,
  ShieldAlert,
  Building2,
  Utensils,
  Layers,
  ChevronRight,
  Eye,
  Edit3,
  ExternalLink,
  Sparkles,
  Phone,
  Scale,
  RefreshCw,
  GitBranch,
  FileCheck,
  MapPin,
  UserCheck,
  PackageCheck,
} from 'lucide-react';

interface Invoice360ModalProps {
  invoice: ExpenseTicket;
  onClose: () => void;
}

export const Invoice360Modal: React.FC<Invoice360ModalProps> = ({ invoice, onClose }) => {
  const {
    updateExpenseTicket,
    setActiveView,
    setActiveOperativaTab,
    announceAriaLive,
  } = useApp();

  // Active sub-tab inside 360 sheet
  const [activeTab, setActiveTab] = useState<'360_relations' | 'products_escandallos' | 'edit_data' | 'document_preview'>('360_relations');

  // Editable local state
  const [currentStatus, setCurrentStatus] = useState<InvoiceStatus>(invoice.status);
  const [docType, setDocType] = useState<DocumentType>(invoice.documentType || 'factura');
  const [providerName, setProviderName] = useState(invoice.providerName);
  const [invoiceNumber, setInvoiceNumber] = useState(invoice.invoiceNumber);
  const [date, setDate] = useState(invoice.date);
  const [dueDate, setDueDate] = useState(invoice.dueDate || '2026-11-15');
  const [taxBase, setTaxBase] = useState(invoice.taxBase);
  const [vatRate, setVatRate] = useState(invoice.vatRate);
  const [vatAmount, setVatAmount] = useState(invoice.vatAmount);
  const [totalAmount, setTotalAmount] = useState(invoice.totalAmount);
  const [category, setCategory] = useState(invoice.category);
  const [notes, setNotes] = useState(invoice.notes || '');

  // Default product lines if none defined
  const productLines: InvoiceProductLine[] = invoice.productLines || [
    {
      id: 'default-line-1',
      productName: 'Materia Prima Principal (Albarán)',
      category: 'Alimentación',
      quantity: 10,
      unit: 'kg',
      unitPrice: invoice.taxBase / 10,
      previousPrice: (invoice.taxBase / 10) * 0.9,
      priceVariationPct: 11.1,
      total: invoice.taxBase,
      linkedEscandalloId: 'esc-general',
      linkedDishName: 'Platos Especiales de la Carta',
      dishCostImpact: 0.85,
      dishMarginImpact: { beforePct: 71.5, afterPct: 67.2 },
      priceTrend: 'subida',
      alert: 'Alarma de Margen: Subida de coste detectada en escandallo general.',
      alternativeSuppliers: [
        {
          name: 'Distribuciones Horeca Central',
          price: (invoice.taxBase / 10) * 0.92,
          priceDiffPct: -8.0,
          available: true,
        },
      ],
    },
  ];

  const handleStatusChange = (newStatus: InvoiceStatus) => {
    setCurrentStatus(newStatus);
    updateExpenseTicket(invoice.id, { status: newStatus });
    announceAriaLive(`Estado de factura cambiado a: ${getStatusLabel(newStatus)}`);
  };

  const handleSaveChanges = () => {
    updateExpenseTicket(invoice.id, {
      documentType: docType,
      providerName,
      invoiceNumber,
      date,
      dueDate,
      taxBase,
      vatRate,
      vatAmount,
      totalAmount,
      category,
      notes,
      status: currentStatus,
    });
    announceAriaLive('Cambios de la factura guardados correctamente');
    onClose();
  };

  const getStatusLabel = (st: InvoiceStatus): string => {
    switch (st) {
      case 'borrador':
      case 'draft':
        return 'Borrador (Escaneado)';
      case 'pendiente_revision':
        return 'Pendiente de Revisión';
      case 'pendiente_aprobacion':
      case 'pending_approval':
        return 'Pendiente de Aprobación';
      case 'aprobada':
      case 'approved':
        return 'Aprobada (Visto Bueno)';
      case 'contabilizada':
        return 'Contabilizada (Asiento Firme)';
      case 'pagada':
        return 'Pagada & Conciliada';
      case 'en_disputa':
        return 'En Disputa / Reclamación';
      case 'rechazada':
      case 'rejected':
        return 'Rechazada / Anulada';
      default:
        return st;
    }
  };

  const getStatusBadgeColor = (st: InvoiceStatus): string => {
    switch (st) {
      case 'aprobada':
      case 'approved':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case 'contabilizada':
        return 'bg-teal-100 text-teal-800 border-teal-300 font-bold';
      case 'pagada':
        return 'bg-emerald-200 text-emerald-900 border-emerald-400 font-black';
      case 'en_disputa':
        return 'bg-rose-100 text-rose-800 border-rose-300 animate-pulse font-black';
      case 'pendiente_revision':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'pendiente_aprobacion':
      case 'pending_approval':
        return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'borrador':
      case 'draft':
        return 'bg-slate-100 text-slate-700 border-slate-300';
      case 'rechazada':
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-300';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-300';
    }
  };

  // 360 Direct Jump navigation helpers
  const handleJumpToChefKitchen = () => {
    setActiveView('cockpit');
    announceAriaLive('Saltando al Cuadro de Mandos con perspectiva de Jefe de Cocina');
    onClose();
  };

  const handleJumpToOwnerDashboard = () => {
    setActiveView('cockpit');
    announceAriaLive('Saltando al Cuadro de Mandos con perspectiva de Dueño para ver EBITDA');
    onClose();
  };

  const handleJumpToTreasury = () => {
    setActiveOperativaTab('economico_alertas');
    announceAriaLive('Saltando a Tesorería y Previsión de Pagos a 30 días');
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Ficha 360 de ${invoice.providerName}`}
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/80 backdrop-blur-xs animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-white/20 overflow-hidden flex flex-col max-h-[94vh]">
        
        {/* Header Ribbon */}
        <div className="bg-gradient-to-r from-[#022853] via-[#0067B9] to-[#022853] text-white p-5 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1.5">
                <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#80D518] text-[#022853] shadow-xs">
                  Versión Pro · Navegación 360º
                </span>
                <span className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full border ${getStatusBadgeColor(currentStatus)}`}>
                  {getStatusLabel(currentStatus)}
                </span>
                <span className="text-xs text-blue-200 font-mono">
                  {docType.toUpperCase()}: {invoice.invoiceNumber}
                </span>
              </div>
              <h2 className="font-brand font-black text-xl sm:text-2xl text-white leading-tight">
                {invoice.providerName}
              </h2>
              <p className="text-xs text-blue-100 mt-0.5">
                Fecha: <strong>{invoice.date}</strong> · Vto: <strong>{invoice.dueDate || '30 días'}</strong> · Total: <strong>{invoice.totalAmount.toFixed(2)} €</strong> ({invoice.category})
              </p>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-center">
              <button
                onClick={onClose}
                className="touch-target-min w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition"
                aria-label="Cerrar ficha 360 de documento"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Sub-tabs Selector */}
          <div className="flex items-center gap-1.5 mt-4 pt-3 border-t border-white/15 overflow-x-auto pb-1">
            {[
              { id: '360_relations', label: '1. Relaciones 360º & Impacto', icon: GitBranch },
              { id: 'products_escandallos', label: '2. Productos & Escandallos (Pro)', icon: Utensils },
              { id: 'edit_data', label: '3. Modificar Datos & Estados', icon: Edit3 },
              { id: 'document_preview', label: '4. Ver Documento Escaneado', icon: Eye },
            ].map((t) => {
              const Icon = t.icon;
              const isActive = activeTab === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => setActiveTab(t.id as any)}
                  className={`touch-target-min flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                    isActive
                      ? 'bg-[#80D518] text-[#022853] shadow-xs font-black'
                      : 'text-blue-100 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{t.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Modal Body Container */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5 flex-1">
          
          {/* TAB 1: RELACIONES 360º & IMPACTO MULTI-ENTIDAD */}
          {activeTab === '360_relations' && (
            <div className="space-y-5">
              
              {/* Highlight Banner on Impact */}
              {invoice.auditAlert && (
                <div className="p-4 rounded-2xl bg-amber-50 border-2 border-amber-300 text-amber-950 flex items-start gap-3 shadow-xs">
                  <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  <div className="text-xs space-y-1">
                    <span className="font-black text-sm text-[#022853] block">
                      Alarma Multientidad del Negocio Detectada:
                    </span>
                    <p className="text-amber-900 leading-relaxed font-medium">
                      {invoice.auditAlert}
                    </p>
                  </div>
                </div>
              )}

              {/* 360 Entities Relationship Grid */}
              <div>
                <div className="flex items-center justify-between mb-2.5">
                  <span className="text-[11px] font-black uppercase tracking-wider text-[#022853] block">
                    Entidades Vinculadas a este Documento ({invoice.category}):
                  </span>
                  <span className="text-xs text-slate-500 font-semibold">
                    Principio Navegación 360º (Cero Pantallas Aisladas)
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  
                  {/* Entity 1: Proveedor */}
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black uppercase text-[#0067B9]">Entidad 1 · Proveedor</span>
                      <Building2 className="w-4 h-4 text-[#0067B9]" />
                    </div>
                    <strong className="text-sm font-bold text-slate-900 block leading-tight">
                      {invoice.providerName}
                    </strong>
                    <p className="text-[11px] text-slate-500">
                      Histórico: 8 facturas/albaranes este año · Calificación: 4.8★
                    </p>
                    <div className="pt-1 flex items-center justify-between">
                      <span className="text-[10px] text-slate-400">Tendencia: +15.5%</span>
                      <button
                        onClick={handleJumpToOwnerDashboard}
                        className="text-[11px] font-bold text-[#0067B9] hover:underline flex items-center gap-1"
                      >
                        <span>Ver en Cockpit</span>
                        <ChevronRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>

                  {/* Entity 2: Centro / Restaurante */}
                  <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black uppercase text-blue-700">Entidad 2 · Centro / Local</span>
                      <MapPin className="w-4 h-4 text-blue-700" />
                    </div>
                    <strong className="text-sm font-bold text-slate-900 block leading-tight">
                      {invoice.linkedVenue || 'Restaurante Puerta del Sol (Centro)'}
                    </strong>
                    <p className="text-[11px] text-slate-600">
                      Almacén: Cocina Principal & Cámara Fría Nº 2
                    </p>
                    <div className="pt-1 flex items-center justify-between">
                      <span className="text-[10px] text-blue-800 font-bold">Imputación directa</span>
                      <button
                        onClick={handleJumpToOwnerDashboard}
                        className="text-[11px] font-bold text-blue-700 hover:underline flex items-center gap-1"
                      >
                        <span>Ver Local</span>
                        <ChevronRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>

                  {/* Entity 3: Productos Creados / Actualizados */}
                  <div className="p-4 rounded-2xl bg-cyan-50/70 border border-cyan-200 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black uppercase text-cyan-800">Entidad 3 · Productos (Pro)</span>
                      <PackageCheck className="w-4 h-4 text-cyan-700" />
                    </div>
                    <strong className="text-sm font-bold text-slate-900 block leading-tight">
                      {productLines.length} productos sincronizados
                    </strong>
                    <p className="text-[11px] text-slate-600">
                      {productLines[0]?.productName} ({productLines[0]?.quantity} {productLines[0]?.unit})
                    </p>
                    <div className="pt-1 flex items-center justify-between">
                      <span className="text-[10px] text-cyan-900 font-bold">Tarifa actualizada</span>
                      <button
                        onClick={() => setActiveTab('products_escandallos')}
                        className="text-[11px] font-bold text-cyan-700 hover:underline flex items-center gap-1"
                      >
                        <span>Ver Fichas</span>
                        <ChevronRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>

                  {/* Entity 4: Escandallos & Platos de Cocina */}
                  <div className="p-4 rounded-2xl bg-purple-50/80 border border-purple-200 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black uppercase text-purple-700">Entidad 4 · Escandallos Chef</span>
                      <Utensils className="w-4 h-4 text-purple-700" />
                    </div>
                    <strong className="text-sm font-bold text-slate-900 block leading-tight">
                      {productLines[0]?.linkedDishName || 'Solomillo al Foie con Reducción'}
                    </strong>
                    <p className="text-[11px] text-purple-900">
                      Margen: <span className="line-through text-slate-400">72%</span> ➜ <strong className="text-rose-600 font-bold">67%</strong> (Afectado)
                    </p>
                    <div className="pt-1 flex items-center justify-between">
                      <span className="text-[10px] text-rose-600 font-bold">⚠️ Alarma margen</span>
                      <button
                        onClick={handleJumpToChefKitchen}
                        className="text-[11px] font-bold text-purple-700 hover:underline flex items-center gap-1"
                      >
                        <span>Ir a Cocina</span>
                        <ChevronRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>

                  {/* Entity 5: Tesorería & Finanzas */}
                  <div className="p-4 rounded-2xl bg-emerald-50/80 border border-emerald-200 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black uppercase text-emerald-700">Entidad 5 · Tesorería</span>
                      <DollarSign className="w-4 h-4 text-emerald-700" />
                    </div>
                    <strong className="text-sm font-bold text-slate-900 block leading-tight">
                      Impacto en Caja: {invoice.totalAmount.toFixed(2)} €
                    </strong>
                    <p className="text-[11px] text-slate-600">
                      Vencimiento: {invoice.dueDate || '30 días'} · Cuenta: {invoice.category}
                    </p>
                    <div className="pt-1 flex items-center justify-between">
                      <span className="text-[10px] text-emerald-800 font-bold">Previsión 30d</span>
                      <button
                        onClick={handleJumpToTreasury}
                        className="text-[11px] font-bold text-emerald-700 hover:underline flex items-center gap-1"
                      >
                        <span>Ver Tesorería</span>
                        <ChevronRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>

                  {/* Entity 6: Turno & Recepción de Mercancía */}
                  <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black uppercase text-amber-800">Entidad 6 · Recepción Turno</span>
                      <UserCheck className="w-4 h-4 text-amber-700" />
                    </div>
                    <strong className="text-sm font-bold text-slate-900 block leading-tight">
                      {invoice.createdBy || 'Julián Ramos (Recepción)'}
                    </strong>
                    <p className="text-[11px] text-slate-600">
                      Turno: Mañana · Albarán físico cotejado en muelle
                    </p>
                    <div className="pt-1 flex items-center justify-between">
                      <span className="text-[10px] text-amber-800 font-bold">Cotejo OK</span>
                      <button
                        onClick={() => {
                          setActiveView('operativa');
                          setActiveOperativaTab('rrhh_turnos');
                          onClose();
                        }}
                        className="text-[11px] font-bold text-amber-800 hover:underline flex items-center gap-1"
                      >
                        <span>Ver Turno</span>
                        <ChevronRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>

                </div>
              </div>

              {/* Status Workflow Selector Box */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black uppercase tracking-wider text-[#022853]">
                    Estados Posibles de la Factura / Albarán:
                  </span>
                  <span className="text-[11px] text-slate-500">
                    Actual: <strong className="text-[#0067B9]">{getStatusLabel(currentStatus)}</strong>
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-1.5">
                  {[
                    { id: 'borrador', label: 'Borrador', icon: Clock, desc: 'Escaneo inicial' },
                    { id: 'pendiente_revision', label: 'Revisión', icon: Edit3, desc: 'Datos dudosos' },
                    { id: 'pendiente_aprobacion', label: 'Aprobación', icon: Clock, desc: 'Esperando visto bueno' },
                    { id: 'aprobada', label: 'Aprobada', icon: CheckCircle2, desc: 'Validada por gerencia' },
                    { id: 'contabilizada', label: 'Contabilizada', icon: FileCheck, desc: 'En asiento oficial' },
                    { id: 'pagada', label: 'Pagada', icon: DollarSign, desc: 'Conciliada en banco' },
                    { id: 'en_disputa', label: 'En Disputa', icon: ShieldAlert, desc: 'Reclamación abierta' },
                    { id: 'rechazada', label: 'Rechazada', icon: X, desc: 'Anulada / Devuelta' },
                  ].map((st) => {
                    const isSelected = currentStatus === st.id;
                    const Icon = st.icon;
                    return (
                      <button
                        key={st.id}
                        type="button"
                        onClick={() => handleStatusChange(st.id as InvoiceStatus)}
                        className={`touch-target-min flex flex-col items-center justify-center p-2 rounded-xl text-[10px] font-bold border transition ${
                          isSelected
                            ? 'bg-[#0067B9] text-white border-[#0067B9] shadow-sm'
                            : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-200'
                        }`}
                        title={st.desc}
                      >
                        <Icon className="w-3.5 h-3.5 mb-1" />
                        <span className="truncate">{st.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: PRODUCTOS, ESCANDALLOS & PROVEEDORES ALTERNATIVOS (VERSIÓN PRO) */}
          {activeTab === 'products_escandallos' && (
            <div className="space-y-5">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <div>
                  <h3 className="text-sm font-bold text-[#022853] font-brand">
                    Líneas de Producto Extraídas y Actualización Automática de Escandallos
                  </h3>
                  <p className="text-xs text-slate-500">
                    En la versión Pro, cada producto actualiza el coste de la materia prima, audita si hay subida de precios y comprueba proveedores alternativos.
                  </p>
                </div>
                <span className="text-[11px] font-black px-2.5 py-1 rounded-full bg-purple-100 text-purple-800 self-start sm:self-auto">
                  {productLines.length} productos identificados
                </span>
              </div>

              {/* Product Lines Cards */}
              <div className="space-y-4">
                {productLines.map((line) => {
                  const hasIncrease = (line.priceVariationPct || 0) > 5;
                  return (
                    <div
                      key={line.id}
                      className="p-4 sm:p-5 rounded-2xl border bg-white shadow-xs space-y-4 border-slate-200"
                    >
                      {/* Line Title & Price variation */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div className="flex items-center gap-2.5">
                          <span className="w-8 h-8 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-xs">
                            {line.quantity} {line.unit}
                          </span>
                          <div>
                            <strong className="text-sm font-bold text-slate-900 block">
                              {line.productName}
                            </strong>
                            <span className="text-[11px] text-slate-400">
                              Categoría: {line.category} · Total línea: {line.total.toFixed(2)} €
                            </span>
                          </div>
                        </div>

                        {/* Price Check Badge */}
                        <div className="flex items-center gap-2">
                          <div className="text-right">
                            <span className="text-xs font-bold text-slate-900 block">
                              {line.unitPrice.toFixed(2)} € / {line.unit}
                            </span>
                            {line.previousPrice && (
                              <span className="text-[10px] text-slate-400">
                                Anterior: {line.previousPrice.toFixed(2)} €
                              </span>
                            )}
                          </div>
                          {line.priceVariationPct !== undefined && (
                            <span
                              className={`text-[11px] font-black px-2 py-0.5 rounded-full flex items-center gap-1 ${
                                hasIncrease
                                  ? 'bg-rose-100 text-rose-800 border border-rose-300'
                                  : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                              }`}
                            >
                              {hasIncrease ? <TrendingUp className="w-3 h-3 text-rose-600" /> : <TrendingDown className="w-3 h-3 text-emerald-600" />}
                              <span>{line.priceVariationPct > 0 ? `+${line.priceVariationPct.toFixed(1)}%` : `${line.priceVariationPct.toFixed(1)}%`}</span>
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Escandallo Impact Card */}
                      {line.linkedDishName && (
                        <div className="p-3.5 bg-purple-50/70 rounded-xl border border-purple-200 space-y-2 text-xs">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Utensils className="w-4 h-4 text-purple-700" />
                              <span className="font-bold text-purple-950">
                                Escandallo Afectado: {line.linkedDishName}
                              </span>
                            </div>
                            <span className="text-[11px] font-bold text-purple-700 bg-white px-2 py-0.5 rounded-lg border border-purple-200">
                              Impacto Ración: +{line.dishCostImpact?.toFixed(2)} €
                            </span>
                          </div>

                          {line.dishMarginImpact && (
                            <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-[11px] text-slate-700 border-t border-purple-200/60">
                              <span>
                                Margen bruto del plato: de <strong className="text-emerald-700">{line.dishMarginImpact.beforePct}%</strong> a{' '}
                                <strong className="text-rose-600">{line.dishMarginImpact.afterPct}%</strong>
                              </span>
                              {line.alert && (
                                <span className="font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-200">
                                  {line.alert}
                                </span>
                              )}
                            </div>
                          )}

                          <div className="pt-1.5 flex justify-end border-t border-purple-200/40">
                            <button
                              onClick={handleJumpToChefKitchen}
                              className="px-3 py-1 rounded-lg bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs flex items-center gap-1.5 shadow-2xs transition"
                            >
                              <Utensils className="w-3.5 h-3.5" />
                              <span>Acceder al Escandallo (Navegación 360º)</span>
                              <ChevronRight className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Alternative Suppliers Comparison */}
                      {line.alternativeSuppliers && line.alternativeSuppliers.length > 0 && (
                        <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-[11px] font-black uppercase text-slate-600 flex items-center gap-1.5">
                              <Scale className="w-3.5 h-3.5 text-[#0067B9]" />
                              <span>Comparativa con Otros Proveedores del Mercado:</span>
                            </span>
                            <span className="text-[10px] text-slate-500 font-semibold">
                              Oportunidades de Ahorro
                            </span>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {line.alternativeSuppliers.map((alt, aIdx) => (
                              <div
                                key={aIdx}
                                className="bg-white p-2.5 rounded-xl border border-slate-200 flex items-center justify-between text-xs"
                              >
                                <div>
                                  <strong className="text-slate-800 block text-[11px]">{alt.name}</strong>
                                  <span className="text-[10px] text-slate-400">
                                    Precio: <strong className="text-slate-700">{alt.price.toFixed(2)} €</strong> / {line.unit}
                                  </span>
                                </div>
                                <div className="text-right">
                                  <span className={`text-[11px] font-black px-2 py-0.5 rounded-md ${
                                    alt.priceDiffPct < 0 ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-700'
                                  }`}>
                                    {alt.priceDiffPct.toFixed(1)}%
                                  </span>
                                  {alt.contact && (
                                    <span className="text-[9px] text-slate-400 block mt-0.5">
                                      {alt.contact}
                                    </span>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                    </div>
                  );
                })}
              </div>

            </div>
          )}

          {/* TAB 3: MODIFICACIÓN DE DATOS & ESTADOS */}
          {activeTab === 'edit_data' && (
            <div className="space-y-4">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="text-sm font-bold text-[#022853] font-brand">
                  Modificación de Datos de la Factura
                </h3>
                <p className="text-xs text-slate-500">
                  Cualquier corrección se sincronizará automáticamente en la contabilidad y en los escandallos asociados.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Tipo de Documento</label>
                  <select
                    value={docType}
                    onChange={(e) => setDocType(e.target.value as DocumentType)}
                    className="w-full text-xs font-bold px-3 py-2 rounded-xl border border-slate-300 bg-white"
                  >
                    <option value="factura">Factura Comercial</option>
                    <option value="albaran">Albarán de Entrega</option>
                    <option value="ticket_simplificado">Ticket Simplificado</option>
                    <option value="factura_rectificativa">Factura Rectificativa</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Proveedor / Emisor</label>
                  <input
                    type="text"
                    value={providerName}
                    onChange={(e) => setProviderName(e.target.value)}
                    className="w-full text-xs font-semibold px-3 py-2 rounded-xl border border-slate-300"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Nº de Documento</label>
                  <input
                    type="text"
                    value={invoiceNumber}
                    onChange={(e) => setInvoiceNumber(e.target.value)}
                    className="w-full text-xs font-mono px-3 py-2 rounded-xl border border-slate-300"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Fecha Emisión</label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Fecha Vencimiento</label>
                  <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Base Imponible (€)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={taxBase}
                    onChange={(e) => {
                      const base = parseFloat(e.target.value) || 0;
                      setTaxBase(base);
                      const vat = (base * vatRate) / 100;
                      setVatAmount(vat);
                      setTotalAmount(base + vat);
                    }}
                    className="w-full text-xs font-bold px-3 py-2 rounded-xl border border-slate-300"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#022853] mb-1">Total (€)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={totalAmount}
                    onChange={(e) => setTotalAmount(parseFloat(e.target.value) || 0)}
                    className="w-full text-xs font-black text-[#022853] px-3 py-2 rounded-xl border border-[#0067B9] bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Observaciones / Motivo de Disputa</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={2}
                  placeholder="Ej: Pendiente abono de 32 € por solomillo con exceso de merma..."
                  className="w-full text-xs p-3 rounded-xl border border-slate-300"
                />
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleSaveChanges}
                  className="px-5 py-2.5 rounded-xl bg-[#0067B9] hover:bg-[#022853] text-white text-xs font-bold shadow-sm transition"
                >
                  Guardar Modificaciones (Sincronizar)
                </button>
              </div>

            </div>
          )}

          {/* TAB 4: VISUALIZACIÓN DEL DOCUMENTO RELACIONADO */}
          {activeTab === 'document_preview' && (
            <div className="space-y-4 text-center">
              <div className="border-b border-slate-100 pb-3 text-left">
                <h3 className="text-sm font-bold text-[#022853] font-brand">
                  Visualización del Documento Original Digitalizado
                </h3>
                <p className="text-xs text-slate-500">
                  Documento digitalizado almacenado en caché local protegida con acceso offline.
                </p>
              </div>

              {/* Render Document Mock / Real Image */}
              <div className="max-w-md mx-auto bg-slate-100 p-6 rounded-2xl border border-slate-300 shadow-inner">
                <div className="bg-white p-6 rounded-xl shadow-md border border-slate-300 text-left font-mono text-xs space-y-3 text-slate-800">
                  <div className="border-b border-dashed border-slate-300 pb-3 text-center">
                    <span className="font-black text-sm block text-[#022853]">{invoice.providerName}</span>
                    <span className="text-[10px] text-slate-400">NIF / CIF: B-82910394 · Registro Mercantil Madrid</span>
                    <span className="text-[11px] font-bold text-slate-600 block mt-1">
                      {docType.toUpperCase()}: {invoice.invoiceNumber}
                    </span>
                  </div>

                  <div className="flex justify-between text-[11px]">
                    <span>Fecha Emisión:</span>
                    <span>{invoice.date}</span>
                  </div>
                  <div className="flex justify-between text-[11px]">
                    <span>Forma de Pago:</span>
                    <span>{invoice.paymentMethod || 'Transferencia'}</span>
                  </div>

                  <div className="border-t border-b border-dashed border-slate-300 py-2.5 my-2 space-y-1.5">
                    {productLines.map((p, idx) => (
                      <div key={idx} className="flex justify-between text-[11px]">
                        <span className="truncate max-w-[180px]">{p.productName} ({p.quantity} {p.unit})</span>
                        <span className="font-bold">{p.total.toFixed(2)} €</span>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-1 text-right text-[11px]">
                    <div className="flex justify-between">
                      <span>Base Imponible:</span>
                      <span>{invoice.taxBase.toFixed(2)} €</span>
                    </div>
                    <div className="flex justify-between">
                      <span>IVA ({invoice.vatRate}%):</span>
                      <span>{invoice.vatAmount.toFixed(2)} €</span>
                    </div>
                    <div className="flex justify-between text-sm font-black text-[#022853] pt-1 border-t border-slate-300">
                      <span>TOTAL:</span>
                      <span>{invoice.totalAmount.toFixed(2)} €</span>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-dashed border-slate-300 text-center text-[10px] text-slate-400">
                    Documento auditado por el motor ConfiA360 · Firma digital hash verificada
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Footer Actions Ribbon */}
        <div className="bg-slate-50 border-t border-slate-200 px-5 sm:px-6 py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold text-slate-600">
              Navegar en 360º a:
            </span>
            <button
              onClick={handleJumpToChefKitchen}
              className="text-xs text-purple-700 hover:text-purple-900 font-bold underline"
            >
              Escandallos Chef
            </button>
            <span className="text-slate-300">·</span>
            <button
              onClick={handleJumpToOwnerDashboard}
              className="text-xs text-[#0067B9] hover:text-[#022853] font-bold underline"
            >
              Margen EBITDA Dueño
            </button>
            <span className="text-slate-300">·</span>
            <button
              onClick={handleJumpToTreasury}
              className="text-xs text-emerald-700 hover:text-emerald-900 font-bold underline"
            >
              Tesorería 30d
            </button>
          </div>

          <button
            onClick={onClose}
            className="touch-target-min px-4 py-2 rounded-xl bg-[#022853] hover:bg-[#0067B9] text-white text-xs font-bold transition shadow-xs"
          >
            Cerrar Ficha 360
          </button>
        </div>

      </div>
    </div>
  );
};
