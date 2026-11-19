import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ApiService } from '../../services/api';
import { SyncStatusIndicator } from '../SyncQueueDrawer';
import {
  Camera,
  Upload,
  CheckCircle,
  AlertTriangle,
  ArrowRight,
  FileText,
  DollarSign,
  Layers,
  Sparkles,
  ShieldAlert,
  GitBranch,
  TrendingUp,
  TrendingDown,
  Utensils,
  Scale,
  Eye,
  Building2,
  MapPin,
  UserCheck,
  PackageCheck,
  FileCheck,
  Clock,
  Edit3,
  X,
  ChevronRight,
  CheckCircle2,
} from 'lucide-react';
import { ExpenseTicket, DocumentType, InvoiceStatus, InvoiceProductLine } from '../../types';
import { PositionalHelpBeacon } from '../help/PositionalHelpBeacon';
import { Invoice360Modal } from './Invoice360Modal';

export const getInvoiceStatusLabel = (st: InvoiceStatus): string => {
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

export const getInvoiceStatusBadgeClass = (st: InvoiceStatus): string => {
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

export const ThreeStepExpenseOCR: React.FC = () => {
  const { expenses, saveExpenseTicket, approveExpenseTicket, isOnline, setActiveView } = useApp();

  // 3-step state: 1. capture, 2. review, 3. complete
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [isProcessingOcr, setIsProcessingOcr] = useState(false);
  const [ticketImage, setTicketImage] = useState<string | null>(null);

  // 360 Sheet Modal Selection
  const [selectedInvoiceFor360, setSelectedInvoiceFor360] = useState<ExpenseTicket | null>(null);

  // Filter in bottom table
  const [statusFilter, setStatusFilter] = useState<'all' | 'en_disputa' | 'pendiente' | 'aprobada' | 'contabilizada' | 'pagada' | 'borrador'>('all');
  const [isProVersionEnabled, setIsProVersionEnabled] = useState<boolean>(true);

  // Extracted fields in step 2 (editable)
  const [docType, setDocType] = useState<DocumentType>('factura');
  const [invoiceStatus, setInvoiceStatus] = useState<InvoiceStatus>('pendiente_aprobacion');
  const [providerName, setProviderName] = useState('');
  const [invoiceNumber, setInvoiceNumber] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [dueDate, setDueDate] = useState('2026-11-15');
  const [taxBase, setTaxBase] = useState<number>(0);
  const [vatRate, setVatRate] = useState<number>(10);
  const [vatAmount, setVatAmount] = useState<number>(0);
  const [totalAmount, setTotalAmount] = useState<number>(0);
  const [category, setCategory] = useState('Materia Prima / Perecederos');
  const [auditAlert, setAuditAlert] = useState<string | null>(null);
  const [productLines, setProductLines] = useState<InvoiceProductLine[]>([]);

  // Quick sample images simulation for demo with 360 entities
  const sampleTickets = [
    {
      name: 'Factura Carnicería (Alerta Subida)',
      docType: 'factura' as DocumentType,
      status: 'en_disputa' as InvoiceStatus,
      provider: 'Distribuciones Cárnicas Sierra S.L.',
      num: 'FAC-2026-9021',
      base: 380.0,
      vat: 10,
      vatAm: 38.0,
      total: 418.0,
      category: 'Materia Prima / Perecederos',
      alert: '⚠️ Subida de Precio (+15.5% en Solomillo): El margen del plato "Solomillo al Foie" cae del 72% al 67%. Existen 2 proveedores más baratos en el mercado.',
      color: 'bg-rose-100 border-rose-300 text-rose-800',
      productLines: [
        {
          id: 'sample-p1',
          productName: 'Solomillo de Ternera Extra',
          category: 'Carnes Rojas',
          quantity: 12,
          unit: 'kg',
          unitPrice: 26.0,
          previousPrice: 22.5,
          priceVariationPct: 15.56,
          total: 312.0,
          linkedEscandalloId: 'esc-solomillo-foie',
          linkedDishName: 'Solomillo al Foie con Reducción',
          dishCostImpact: 1.4,
          dishMarginImpact: { beforePct: 72.0, afterPct: 67.0 },
          priceTrend: 'subida' as const,
          alert: 'Alarma de Margen: Caída de 5 puntos en plato estrella.',
          alternativeSuppliers: [
            {
              name: 'Carnes del Guadarrama S.A.',
              price: 23.8,
              priceDiffPct: -8.46,
              available: true,
              contact: '+34 91 854 22 10',
            },
            {
              name: 'Horeca Norte Cárnicos',
              price: 24.1,
              priceDiffPct: -7.31,
              available: true,
            },
          ],
        },
        {
          id: 'sample-p2',
          productName: 'Entrecot de Vaca Madurada',
          category: 'Carnes Rojas',
          quantity: 4,
          unit: 'kg',
          unitPrice: 17.0,
          previousPrice: 16.5,
          priceVariationPct: 3.03,
          total: 68.0,
          linkedEscandalloId: 'esc-entrecot-parrilla',
          linkedDishName: 'Entrecot a la Brasa con Patatas',
          dishCostImpact: 0.25,
          dishMarginImpact: { beforePct: 69.5, afterPct: 68.8 },
          priceTrend: 'estable' as const,
        },
      ],
    },
    {
      name: 'Factura Electricidad (Alerta Duplicada)',
      docType: 'factura' as DocumentType,
      status: 'pendiente_revision' as InvoiceStatus,
      provider: 'Iberdrola Clientes S.A.',
      num: 'IBER-2026-8841',
      base: 412.5,
      vat: 21,
      vatAm: 86.63,
      total: 499.13,
      category: 'Suministros (Luz/Gas/Agua)',
      alert: '⚠️ Alerta Agente Económico: He detectado 3 facturas de electricidad de importe idéntico este mes. ¿Fue un error o son locales diferentes?',
      color: 'bg-amber-100 border-amber-300 text-amber-900',
      productLines: [],
    },
    {
      name: 'Albarán Frutería y Huerta',
      docType: 'albaran' as DocumentType,
      status: 'pendiente_aprobacion' as InvoiceStatus,
      provider: 'Frutas y Verduras La Huerta Mayor',
      num: 'ALB-5510',
      base: 145.2,
      vat: 10,
      vatAm: 14.52,
      total: 159.72,
      category: 'Materia Prima / Perecederos',
      alert: null,
      color: 'bg-emerald-100 border-emerald-300 text-emerald-800',
      productLines: [
        {
          id: 'sample-p3',
          productName: 'Tomate Rosa de Barbastro',
          category: 'Verduras & Frescos',
          quantity: 20,
          unit: 'kg',
          unitPrice: 3.2,
          previousPrice: 3.2,
          priceVariationPct: 0.0,
          total: 64.0,
          linkedEscandalloId: 'esc-ensalada-tomate',
          linkedDishName: 'Ensalada de Tomate Rosa y Ventresca',
          dishCostImpact: 0.0,
          dishMarginImpact: { beforePct: 76.5, afterPct: 76.5 },
          priceTrend: 'estable' as const,
        },
        {
          id: 'sample-p4',
          productName: 'Aceite de Oliva Virgen Extra 5L (AOVE)',
          category: 'Aceites & Condimentos',
          quantity: 2,
          unit: 'garrafa',
          unitPrice: 40.6,
          previousPrice: 38.0,
          priceVariationPct: 6.84,
          total: 81.2,
          linkedEscandalloId: 'esc-base-cocina',
          linkedDishName: 'Uso Transversal en 14 Platos de Cocina',
          dishCostImpact: 0.12,
          dishMarginImpact: { beforePct: 71.0, afterPct: 70.4 },
          priceTrend: 'subida' as const,
          alternativeSuppliers: [
            {
              name: 'Cooperativa Oleícola Sur',
              price: 37.5,
              priceDiffPct: -7.64,
              available: true,
            },
          ],
        },
      ],
    },
  ];

  // Step 1: Capture
  const handleSelectSample = async (sample: typeof sampleTickets[0]) => {
    setIsProcessingOcr(true);
    setTicketImage(`data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="400"><rect width="300" height="400" fill="%23f8fafc" stroke="%23cbd5e1" stroke-width="2"/><text x="20" y="40" font-family="sans-serif" font-size="14" font-weight="bold" fill="%23022853">${sample.provider}</text><text x="20" y="80" font-family="sans-serif" font-size="12" fill="%2364748b">${sample.docType.toUpperCase()}: ${sample.num}</text><text x="20" y="110" font-family="sans-serif" font-size="12" fill="%2364748b">Total: ${sample.total} EUR</text></svg>`);
    
    // Call server OCR or simulate extraction
    try {
      const ocrResult = await ApiService.processEconomicOCR({ sampleText: sample.provider });
      setDocType(sample.docType);
      setInvoiceStatus(sample.status);
      setProviderName(ocrResult.providerName || sample.provider);
      setInvoiceNumber(ocrResult.invoiceNumber || sample.num);
      setDate(ocrResult.date || new Date().toISOString().split('T')[0]);
      setDueDate('2026-11-15');
      setTaxBase(ocrResult.taxBase || sample.base);
      setVatRate(ocrResult.vatRate || sample.vat);
      setVatAmount(ocrResult.vatAmount || sample.vatAm);
      setTotalAmount(ocrResult.totalAmount || sample.total);
      setCategory(ocrResult.suggestedCategory || sample.category);
      setAuditAlert(sample.alert || ocrResult.auditAlert);
      setProductLines(sample.productLines || []);
    } finally {
      setIsProcessingOcr(false);
      setStep(2); // Advance to Step 2: Revisión
    }
  };

  // Step 1: File input upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setTicketImage(reader.result as string);
        handleSelectSample(sampleTickets[0]);
      };
      reader.readAsDataURL(file);
    }
  };

  // Step 3: Envío con un toque
  const handleSubmitExpense = async () => {
    await saveExpenseTicket({
      providerName,
      documentType: docType,
      invoiceNumber: invoiceNumber || 'S/N-PROV',
      date,
      dueDate,
      taxBase,
      vatRate,
      vatAmount,
      totalAmount,
      category,
      suggestedCategory: category,
      status: invoiceStatus,
      auditAlert,
      productLines,
      hasEscandalloImpact: productLines.some(p => !!p.linkedDishName),
      linkedVenue: 'Restaurante Puerta del Sol (Centro)',
      paymentMethod: 'Transferencia a 30 días',
      isProVersionEnabled,
      createdBy: 'Empleado de Sala / Cocina',
      imageUrl: ticketImage || undefined,
    });
    setStep(3);
  };

  const handleOpen360ForCurrentReview = () => {
    setSelectedInvoiceFor360({
      id: 'current-review-temp',
      providerName: providerName || 'Distribuciones Cárnicas Sierra S.L.',
      documentType: docType,
      invoiceNumber: invoiceNumber || 'FAC-2026-9021',
      date,
      dueDate,
      taxBase,
      vatRate,
      vatAmount,
      totalAmount,
      category,
      suggestedCategory: category,
      status: invoiceStatus,
      syncStatus: 'synced',
      auditAlert,
      productLines,
      hasEscandalloImpact: productLines.some((p) => !!p.linkedDishName),
      linkedVenue: 'Restaurante Puerta del Sol (Centro)',
      paymentMethod: 'Transferencia a 30 días',
      isProVersionEnabled,
      createdBy: 'Empleado de Sala / Cocina',
      createdAt: new Date().toISOString(),
      imageUrl: ticketImage || undefined,
    });
  };

  const handleResetFlow = () => {
    setStep(1);
    setTicketImage(null);
    setProviderName('');
    setInvoiceNumber('');
    setAuditAlert(null);
    setProductLines([]);
  };

  return (
    <div className="space-y-6">
      
      {/* 3-Step Progress Header */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-lg font-bold font-brand text-[#022853]">Captura de Gastos OCR (Máx 3 Toques)</h2>
              <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-[#80D518]/20 text-[#022853] border border-[#80D518]/50">
                Flujo Optimizado
              </span>
              <PositionalHelpBeacon
                id="gastos_ocr_beacon"
                category="Compras & Facturas"
                title="Lectura y Conexión 360º de Facturas y Albaranes"
                content="Al hacer una foto a cualquier albarán o factura, el sistema lo categoriza automáticamente y lo asocia a todas las entidades del restaurante (proveedor, local, productos, escandallos, tesorería y turno). En la versión Pro, actualiza los productos, detecta si el distribuidor ha subido el precio, comprueba el impacto en el margen de beneficio del plato y te muestra otros proveedores alternativos del mercado para ahorrar."
                keyPoints={[
                  'Carga y categorización automática conectada a N entidades a la vez',
                  'Versión Pro: Creación/actualización de productos y control de subidas de precio',
                  'Auditoría de escandallos: Aviso inmediato si cae el margen de beneficio de tus platos',
                  'Comparativa con otros proveedores y tendencias del mercado',
                  'Modificación de datos, documento original y ciclo de estados (desde borrador hasta pago o disputa)',
                ]}
              />
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Fórmula simplificada de 3 toques: Cámara ➜ Revisión automática inteligente ➜ Envío con 1 toque.
            </p>
          </div>

          {/* Stepper pills */}
          <div className="flex items-center gap-2">
            {[
              { num: 1, label: '1. Captura' },
              { num: 2, label: '2. Revisión' },
              { num: 3, label: '3. Envío' },
            ].map((s) => (
              <div
                key={s.num}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                  step === s.num
                    ? 'bg-[#0067B9] text-white shadow-xs'
                    : step > s.num
                    ? 'bg-emerald-50 text-[#48A222] border border-emerald-200'
                    : 'bg-slate-100 text-slate-400'
                }`}
              >
                <span>{s.label}</span>
                {step > s.num && <CheckCircle className="w-3.5 h-3.5" />}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* STEP 1: CAPTURA CON BOTÓN GIGANTE */}
      {step === 1 && (
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs text-center space-y-6">
          <div className="max-w-md mx-auto">
            <h3 className="text-base font-bold text-[#022853] font-brand">Paso 1: Captura de Ticket o Factura</h3>
            <p className="text-xs text-slate-500 mt-1">
              Apunta la cámara al ticket arrugado o factura del repartidor. La IA extrae CIF, base, IVA y detecta posibles duplicados de tesorería.
            </p>
          </div>

          {/* Giant Camera Trigger Button */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-lg mx-auto">
            <label className="touch-target-min w-full sm:w-64 h-36 rounded-2xl bg-[#022853] hover:bg-[#0067B9] text-white cursor-pointer transition shadow-md flex flex-col items-center justify-center gap-2 group">
              <div className="w-14 h-14 rounded-full bg-white/10 group-hover:scale-110 group-hover:bg-[#80D518] group-hover:text-[#022853] flex items-center justify-center transition">
                <Camera className="w-7 h-7" />
              </div>
              <span className="text-sm font-black font-brand">Hacer Foto (Cámara)</span>
              <span className="text-[11px] text-blue-200">Botón táctil gigante</span>
              <input type="file" accept="image/*" capture="environment" onChange={handleFileUpload} className="sr-only" />
            </label>

            <label className="touch-target-min w-full sm:w-64 h-36 rounded-2xl border-2 border-dashed border-slate-300 hover:border-[#0067B9] hover:bg-blue-50/30 text-slate-700 cursor-pointer transition flex flex-col items-center justify-center gap-2">
              <Upload className="w-7 h-7 text-[#0067B9]" />
              <span className="text-sm font-bold">Subir Imagen o PDF</span>
              <span className="text-[11px] text-slate-400">Desde galería del dispositivo</span>
              <input type="file" accept="image/*,application/pdf" onChange={handleFileUpload} className="sr-only" />
            </label>
          </div>

          {/* Preset Fast Samples for Instant Demo */}
          <div className="pt-4 max-w-xl mx-auto border-t border-slate-100">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-3">
              O prueba un ticket de prueba en 1 clic:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {sampleTickets.map((st, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSelectSample(st)}
                  disabled={isProcessingOcr}
                  className="touch-target-min p-3 rounded-xl border border-slate-200 bg-slate-50 hover:bg-white hover:border-[#0067B9] text-left transition shadow-2xs"
                >
                  <span className="font-bold text-xs text-[#022853] block truncate">{st.name}</span>
                  <span className="text-[11px] text-slate-500 block">{st.total} €</span>
                  {st.alert && (
                    <span className="text-[10px] text-amber-700 font-bold block mt-1">⚠️ Con alerta</span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {isProcessingOcr && (
            <div className="p-4 rounded-xl bg-blue-50 text-[#0067B9] text-xs font-semibold flex items-center justify-center gap-2 animate-pulse">
              <Sparkles className="w-4 h-4 text-[#80D518]" />
              <span>Agente Económico escaneando ticket y auditando tesorería...</span>
            </div>
          )}
        </div>
      )}

      {/* STEP 2: REVISIÓN CON PANTALLA PARTIDA */}
      {step === 2 && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-base font-bold text-[#022853] font-brand">Paso 2: Revisión en Pantalla Partida</h3>
              <p className="text-xs text-slate-500">
                Compara la imagen con los datos leídos. Los campos faltantes o alertas se resaltan automáticamente en amarillo.
              </p>
            </div>
            <button
              onClick={handleResetFlow}
              className="text-xs font-semibold text-slate-500 hover:text-slate-800"
            >
              Cambiar imagen
            </button>
          </div>

          {/* Audit Alert Banner (If duplicate detected by Economic Agent) */}
          {auditAlert && (
            <div className="p-4 rounded-xl bg-amber-50 border-2 border-amber-300 text-amber-900 flex items-start gap-3">
              <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div className="text-xs">
                <span className="font-bold block text-sm">Alerta del Agente Económico (Tesorería & Fraude)</span>
                <p className="mt-0.5 text-amber-800">{auditAlert}</p>
              </div>
            </div>
          )}

          {/* Split Screen Layout: Left Ticket Visual, Right Extracted Fields */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            
            {/* Left: Ticket Mock/Image */}
            <div className="md:col-span-5 bg-slate-100 p-4 rounded-xl border border-slate-200 flex flex-col items-center justify-center min-h-[300px]">
              <div className="w-full max-w-[260px] bg-white p-4 rounded-lg shadow-md border border-slate-300 font-mono text-[11px] space-y-2 text-slate-700">
                <div className="border-b border-dashed border-slate-300 pb-2 text-center">
                  <span className="font-bold block text-xs">{providerName || 'TICKET SIMULADO'}</span>
                  <span className="text-[10px] text-slate-400">NIF / CIF: B-82910394</span>
                </div>
                <div className="flex justify-between">
                  <span>Factura:</span>
                  <span className="font-bold">{invoiceNumber || '---'}</span>
                </div>
                <div className="flex justify-between">
                  <span>Fecha:</span>
                  <span>{date}</span>
                </div>
                <div className="border-t border-dashed border-slate-300 pt-2 space-y-1">
                  <div className="flex justify-between">
                    <span>Base Imponible:</span>
                    <span>{taxBase.toFixed(2)} €</span>
                  </div>
                  <div className="flex justify-between">
                    <span>IVA ({vatRate}%):</span>
                    <span>{vatAmount.toFixed(2)} €</span>
                  </div>
                  <div className="flex justify-between text-xs font-bold text-[#022853] pt-1 border-t border-slate-200">
                    <span>TOTAL:</span>
                    <span>{totalAmount.toFixed(2)} €</span>
                  </div>
                </div>
              </div>
              <span className="text-[11px] text-slate-400 mt-3">Vista de captura digitalizada</span>
            </div>

            {/* Right: Editable Fields with Highlight on Missing */}
            <div className="md:col-span-7 space-y-4">
              
              {/* Document Type & Status Selector */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-slate-50 p-3 rounded-2xl border border-slate-200">
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
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Estado de Factura: <span className="text-[#0067B9] font-black">{getInvoiceStatusLabel(invoiceStatus)}</span>
                  </label>
                  <select
                    value={invoiceStatus}
                    onChange={(e) => setInvoiceStatus(e.target.value as InvoiceStatus)}
                    className="w-full text-xs font-bold px-3 py-2 rounded-xl border border-slate-300 bg-white"
                  >
                    <option value="borrador">Borrador (Escaneado Inicial)</option>
                    <option value="pendiente_revision">Pendiente de Revisión</option>
                    <option value="pendiente_aprobacion">Pendiente de Aprobación</option>
                    <option value="aprobada">Aprobada (Visto Bueno)</option>
                    <option value="contabilizada">Contabilizada (Asiento Firme)</option>
                    <option value="pagada">Pagada & Conciliada</option>
                    <option value="en_disputa">En Disputa / Reclamación</option>
                    <option value="rechazada">Rechazada / Anulada</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Proveedor / Emisor
                </label>
                <input
                  type="text"
                  value={providerName}
                  onChange={(e) => setProviderName(e.target.value)}
                  className={`w-full text-xs font-bold px-3 py-2 rounded-xl border ${
                    !providerName ? 'bg-amber-50 border-amber-400 ring-2 ring-amber-300/40' : 'border-slate-300'
                  }`}
                  placeholder="Ej. Distribuciones Cárnicas Sierra S.L."
                />
                {!providerName && (
                  <span className="text-[11px] text-amber-700 font-semibold mt-0.5 block">
                    ⚠️ Campo faltante: Por favor indica el nombre del proveedor.
                  </span>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Nº de Factura o Albarán
                  </label>
                  <input
                    type="text"
                    value={invoiceNumber}
                    onChange={(e) => setInvoiceNumber(e.target.value)}
                    className="w-full text-xs font-mono px-3 py-2 rounded-xl border border-slate-300"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Fecha de Emisión
                  </label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300"
                  />
                </div>
              </div>

              {/* Amounts Grid */}
              <div className="grid grid-cols-3 gap-2.5 bg-slate-50 p-3 rounded-xl border border-slate-200">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">Base Imponible (€)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={taxBase}
                    onChange={(e) => {
                      const base = parseFloat(e.target.value) || 0;
                      setTaxBase(base);
                      const am = (base * vatRate) / 100;
                      setVatAmount(am);
                      setTotalAmount(base + am);
                    }}
                    className="w-full text-xs font-bold px-2 py-1.5 rounded-lg border border-slate-300"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">IVA (%)</label>
                  <select
                    value={vatRate}
                    onChange={(e) => {
                      const rate = parseInt(e.target.value, 10);
                      setVatRate(rate);
                      const am = (taxBase * rate) / 100;
                      setVatAmount(am);
                      setTotalAmount(taxBase + am);
                    }}
                    className="w-full text-xs px-2 py-1.5 rounded-lg border border-slate-300"
                  >
                    <option value={10}>10% (Alimentos/Hostelería)</option>
                    <option value={21}>21% (General/Suministros)</option>
                    <option value={4}>4% (Superreducido)</option>
                    <option value={0}>0% (Exento)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-[#022853] mb-1">Total (€)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={totalAmount}
                    onChange={(e) => setTotalAmount(parseFloat(e.target.value) || 0)}
                    className="w-full text-xs font-black text-[#022853] px-2 py-1.5 rounded-lg border border-[#0067B9] bg-white"
                  />
                </div>
              </div>

              {/* Suggested Accounting Category */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center justify-between">
                  <span>Categorización Automática del Documento</span>
                  <span className="text-[10px] text-[#48A222] font-bold">✓ Clasificado automáticamente</span>
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full text-xs font-semibold px-3 py-2 rounded-xl border border-slate-300 bg-white"
                >
                  <option value="Materia Prima / Perecederos">Materia Prima / Perecederos (Carne, Pescado, Verduras)</option>
                  <option value="Bebidas y Licores">Bebidas y Licores</option>
                  <option value="Suministros (Luz/Gas/Agua)">Suministros (Luz, Gas, Agua)</option>
                  <option value="Mantenimiento y Maquinaria">Mantenimiento y Maquinaria de Cocina</option>
                  <option value="Servicios Profesionales">Servicios Profesionales y Asesoría</option>
                </select>
              </div>

              {/* CONEXIÓN MULTIENTIDAD: N Entidades Asociadas */}
              <div className="p-3.5 bg-blue-50/60 rounded-2xl border border-blue-200/80 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-black text-[#022853]">
                    <GitBranch className="w-4 h-4 text-[#0067B9]" />
                    <span>Asociación Automática a 6 Entidades del Sistema:</span>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-[#0067B9]">
                    Navegación 360º Activa
                  </span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-[11px]">
                  <div className="bg-white p-2 rounded-xl border border-blue-100 shadow-2xs">
                    <span className="text-[10px] text-slate-400 font-bold block uppercase">1. Proveedor</span>
                    <strong className="text-slate-800 truncate block">{providerName || 'Proveedor'}</strong>
                  </div>
                  <div className="bg-white p-2 rounded-xl border border-blue-100 shadow-2xs">
                    <span className="text-[10px] text-slate-400 font-bold block uppercase">2. Centro / Local</span>
                    <strong className="text-slate-800 truncate block">Puerta del Sol Centro</strong>
                  </div>
                  <div className="bg-white p-2 rounded-xl border border-blue-100 shadow-2xs">
                    <span className="text-[10px] text-slate-400 font-bold block uppercase">3. Productos (Pro)</span>
                    <strong className="text-slate-800 truncate block">{productLines.length || 1} vinculados</strong>
                  </div>
                  <div className="bg-white p-2 rounded-xl border border-blue-100 shadow-2xs">
                    <span className="text-[10px] text-slate-400 font-bold block uppercase">4. Escandallos</span>
                    <strong className="text-purple-700 truncate block">{productLines[0]?.linkedDishName || 'Platos carta'}</strong>
                  </div>
                  <div className="bg-white p-2 rounded-xl border border-blue-100 shadow-2xs">
                    <span className="text-[10px] text-slate-400 font-bold block uppercase">5. Tesorería (30d)</span>
                    <strong className="text-emerald-700 truncate block">{totalAmount.toFixed(2)} € vto</strong>
                  </div>
                  <div className="bg-white p-2 rounded-xl border border-blue-100 shadow-2xs">
                    <span className="text-[10px] text-slate-400 font-bold block uppercase">6. Turno Recepción</span>
                    <strong className="text-amber-800 truncate block">Turno Mañana OK</strong>
                  </div>
                </div>
              </div>

              {/* VERSIÓN PRO: PRODUCTOS, ESCANDALLOS, VERIFICACIÓN DE PRECIOS & PROVEEDORES ALTERNATIVOS */}
              <div className="p-4 bg-purple-50/70 rounded-2xl border-2 border-purple-200 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-purple-200/60 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-purple-200 text-purple-900">
                      Versión Pro
                    </span>
                    <span className="text-xs font-bold text-purple-950">
                      Escandallos, Precios & Comparativa de Proveedores
                    </span>
                  </div>
                  <label className="flex items-center gap-2 cursor-pointer self-start sm:self-auto text-xs font-bold text-purple-900">
                    <input
                      type="checkbox"
                      checked={isProVersionEnabled}
                      onChange={(e) => setIsProVersionEnabled(e.target.checked)}
                      className="rounded text-purple-600 focus:ring-purple-500"
                    />
                    <span>Auditoría Pro Activa</span>
                  </label>
                </div>

                {isProVersionEnabled && productLines.length > 0 && (
                  <div className="space-y-2.5">
                    {productLines.map((line) => {
                      const hasIncrease = (line.priceVariationPct || 0) > 5;
                      return (
                        <div key={line.id} className="bg-white p-3.5 rounded-xl border border-purple-200/90 shadow-2xs space-y-2 text-xs">
                          {/* Line Header */}
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
                            <div>
                              <strong className="text-slate-900 font-bold block">{line.productName}</strong>
                              <span className="text-[11px] text-slate-500">
                                {line.quantity} {line.unit} · Tarifa actual: <strong>{line.unitPrice.toFixed(2)} €</strong> / {line.unit}
                                {line.previousPrice && (
                                  <span className="text-slate-400 ml-1.5">
                                    (Anterior: {line.previousPrice.toFixed(2)} €)
                                  </span>
                                )}
                              </span>
                            </div>

                            <div className="flex items-center gap-2 self-start sm:self-auto">
                              {line.priceVariationPct !== undefined && (
                                <span
                                  className={`text-[10px] font-black px-2 py-0.5 rounded-full flex items-center gap-1 ${
                                    hasIncrease
                                      ? 'bg-rose-100 text-rose-800 border border-rose-300'
                                      : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                  }`}
                                >
                                  {hasIncrease ? <TrendingUp className="w-3 h-3 text-rose-600" /> : <TrendingDown className="w-3 h-3 text-emerald-600" />}
                                  <span>{line.priceVariationPct > 0 ? `+${line.priceVariationPct.toFixed(1)}%` : `${line.priceVariationPct.toFixed(1)}%`}</span>
                                </span>
                              )}
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-cyan-100 text-cyan-800">
                                Producto Creado / Actualizado
                              </span>
                            </div>
                          </div>

                          {/* Escandallo Impact Card with 360 Direct Link */}
                          {line.linkedDishName && (
                            <div className="p-2.5 bg-purple-50 rounded-lg border border-purple-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                              <div>
                                <span className="font-bold text-purple-950 block text-[11px]">
                                  🍽️ Escandallo: {line.linkedDishName}
                                </span>
                                {line.dishMarginImpact && (
                                  <span className="text-[10px] text-slate-600">
                                    Margen bruto del plato: de <strong className="text-emerald-700">{line.dishMarginImpact.beforePct}%</strong> ➜{' '}
                                    <strong className="text-rose-600">{line.dishMarginImpact.afterPct}%</strong> (Impacto ración: +{line.dishCostImpact?.toFixed(2)} €)
                                  </span>
                                )}
                              </div>
                              <button
                                type="button"
                                onClick={() => {
                                  setActiveView('cockpit');
                                }}
                                className="px-2.5 py-1 rounded-md bg-purple-700 hover:bg-purple-800 text-white font-bold text-[11px] flex items-center gap-1 self-start sm:self-auto shadow-2xs transition"
                              >
                                <Utensils className="w-3 h-3" />
                                <span>Ver Escandallo 360º</span>
                                <ChevronRight className="w-3 h-3" />
                              </button>
                            </div>
                          )}

                          {/* Alternative Suppliers */}
                          {line.alternativeSuppliers && line.alternativeSuppliers.length > 0 && (
                            <div className="pt-1 border-t border-slate-100 flex flex-wrap items-center justify-between gap-1 text-[11px]">
                              <span className="text-slate-500 font-semibold flex items-center gap-1">
                                <Scale className="w-3 h-3 text-[#0067B9]" />
                                <span>Existen <strong>{line.alternativeSuppliers.length} proveedores alternativos</strong> más baratos en el mercado:</span>
                              </span>
                              <span className="text-emerald-700 font-bold">
                                {line.alternativeSuppliers[0].name} ({line.alternativeSuppliers[0].price.toFixed(2)} €/kg, {line.alternativeSuppliers[0].priceDiffPct.toFixed(1)}%)
                              </span>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Botones de Acción: Ficha 360 y Guardar */}
              <div className="pt-2 flex flex-col sm:flex-row gap-2.5">
                <button
                  type="button"
                  onClick={handleOpen360ForCurrentReview}
                  className="touch-target-min flex-1 py-3 px-4 rounded-xl bg-slate-900 hover:bg-[#022853] text-white font-bold text-xs shadow-sm transition flex items-center justify-center gap-2"
                >
                  <Eye className="w-4 h-4 text-[#80D518]" />
                  <span>Ver Ficha 360º & Documento Original</span>
                </button>

                <button
                  onClick={handleSubmitExpense}
                  className="touch-target-min flex-1 py-3 px-4 rounded-xl bg-[#48A222] hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition flex items-center justify-center gap-2"
                >
                  <CheckCircle className="w-4 h-4 text-white" />
                  <span>3. Enviar a Aprobación (1 Toque)</span>
                </button>
              </div>

              <span className="text-[11px] text-slate-500 text-center block">
                {isOnline ? '🟢 Se enviará inmediatamente a la central' : '🔵 Se guardará en la cola offline para sincronización automática'}
              </span>

            </div>
          </div>
        </div>
      )}

      {/* STEP 3: COMPLETED SUCCESS VIEW */}
      {step === 3 && (
        <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-xs text-center space-y-4 max-w-lg mx-auto animate-in zoom-in-95 duration-200">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-[#48A222] flex items-center justify-center mx-auto">
            <CheckCircle className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-lg font-bold font-brand text-[#022853]">¡Documento Registrado con Éxito!</h3>
            <p className="text-xs text-slate-500 mt-1">
              {providerName} — <strong>{totalAmount.toFixed(2)} €</strong> ({category})
            </p>
          </div>
          <div className="p-3 bg-slate-50 rounded-xl text-xs text-slate-600 text-left border border-slate-200 space-y-1">
            <p>• <strong>Estado:</strong> {getInvoiceStatusLabel(invoiceStatus)}</p>
            <p>• <strong>Conexión 360º:</strong> Productos, escandallos y tesorería sincronizados</p>
            <p>• <strong>Modo:</strong> {isOnline ? '🟢 Sincronizado en Central' : '🔵 En Cola Offline Local'}</p>
          </div>
          <div className="pt-2 flex gap-3">
            <button
              onClick={handleResetFlow}
              className="flex-1 py-2.5 rounded-xl bg-[#022853] hover:bg-[#0067B9] text-white font-bold text-xs transition"
            >
              Capturar Otro Albarán o Factura
            </button>
          </div>
        </div>
      )}

      {/* Expense History & Approvals Table */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-[#48A222]" />
            <div>
              <h3 className="text-sm font-bold font-brand text-[#022853]">
                Registro de Albaranes, Facturas & Navegación 360º
              </h3>
              <p className="text-[11px] text-slate-500">
                Accede a la ficha 360º de cualquier documento para modificar datos, ver el original o auditar escandallos
              </p>
            </div>
          </div>
          <span className="text-xs text-slate-500 font-bold self-start sm:self-auto">
            {expenses.length} documentos registrados
          </span>
        </div>

        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          {[
            { id: 'all', label: `Todos (${expenses.length})` },
            { id: 'en_disputa', label: '⚠️ En Disputa / Alarmas' },
            { id: 'pendiente', label: 'Pendientes' },
            { id: 'aprobada', label: 'Aprobadas' },
            { id: 'contabilizada', label: 'Contabilizadas' },
            { id: 'pagada', label: 'Pagadas' },
            { id: 'borrador', label: 'Borradores' },
          ].map((f) => {
            const isActive = statusFilter === f.id;
            return (
              <button
                key={f.id}
                onClick={() => setStatusFilter(f.id as any)}
                className={`touch-target-min px-3 py-1.5 rounded-xl font-bold transition whitespace-nowrap ${
                  isActive
                    ? 'bg-[#0067B9] text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {f.label}
              </button>
            );
          })}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 bg-slate-50">
                <th className="py-2.5 px-3 font-semibold">Proveedor & Documento</th>
                <th className="py-2.5 px-3 font-semibold">Tipo</th>
                <th className="py-2.5 px-3 font-semibold">Categoría</th>
                <th className="py-2.5 px-3 font-semibold">Fecha / Vto</th>
                <th className="py-2.5 px-3 font-semibold text-right">Importe</th>
                <th className="py-2.5 px-3 font-semibold text-center">Estado Legal / Alerta</th>
                <th className="py-2.5 px-3 font-semibold text-right">Sync</th>
                <th className="py-2.5 px-3 font-semibold text-right">Ficha 360º & Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {expenses
                .filter((e) => {
                  if (statusFilter === 'all') return true;
                  if (statusFilter === 'en_disputa') return e.status === 'en_disputa' || !!e.auditAlert;
                  if (statusFilter === 'pendiente') return e.status === 'pendiente_revision' || e.status === 'pendiente_aprobacion' || e.status === 'pending_approval';
                  if (statusFilter === 'aprobada') return e.status === 'aprobada' || e.status === 'approved';
                  if (statusFilter === 'contabilizada') return e.status === 'contabilizada';
                  if (statusFilter === 'pagada') return e.status === 'pagada';
                  if (statusFilter === 'borrador') return e.status === 'borrador' || e.status === 'draft';
                  return true;
                })
                .map((e) => (
                  <tr key={e.id} className="hover:bg-slate-50/70 transition">
                    <td className="py-3 px-3">
                      <strong className="text-slate-900 block leading-tight">{e.providerName}</strong>
                      <span className="text-[10px] text-slate-400 font-mono">Nº {e.invoiceNumber}</span>
                    </td>
                    <td className="py-3 px-3">
                      <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
                        {e.documentType || 'factura'}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-slate-600">
                      <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-[11px] font-medium">
                        {e.category}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-slate-500">
                      <div>{e.date}</div>
                      {e.dueDate && <span className="text-[10px] text-slate-400">Vto: {e.dueDate}</span>}
                    </td>
                    <td className="py-3 px-3 text-right font-black text-slate-900">
                      {e.totalAmount.toFixed(2)} €
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${getInvoiceStatusBadgeClass(e.status)}`}>
                        {getInvoiceStatusLabel(e.status)}
                      </span>
                      {e.auditAlert && (
                        <span className="block text-[9px] text-rose-700 font-bold mt-0.5">
                          ⚠️ Alarma Activa
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-3 text-right">
                      <SyncStatusIndicator status={e.syncStatus} />
                    </td>
                    <td className="py-3 px-3 text-right space-x-1.5 whitespace-nowrap">
                      <button
                        onClick={() => setSelectedInvoiceFor360(e)}
                        className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-[#0067B9] text-white text-[11px] font-bold transition shadow-2xs"
                        title="Ver relaciones 360º, productos, escandallos y documento original"
                      >
                        Ficha 360º
                      </button>
                      {e.status !== 'aprobada' && e.status !== 'approved' && e.status !== 'pagada' && (
                        <button
                          onClick={() => approveExpenseTicket(e.id)}
                          className="px-2.5 py-1 rounded-lg bg-[#48A222] hover:bg-emerald-700 text-white text-[11px] font-bold transition shadow-2xs"
                        >
                          Aprobar
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* RENDER MODAL 360 CUANDO SE SELECCIONA CUALQUIER FACTURA O ALBARÁN */}
      {selectedInvoiceFor360 && (
        <Invoice360Modal
          invoice={selectedInvoiceFor360}
          onClose={() => setSelectedInvoiceFor360(null)}
        />
      )}

    </div>
  );
};
