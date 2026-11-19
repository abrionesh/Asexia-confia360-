import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Bell,
  BellRing,
  BellOff,
  WifiOff,
  CheckCircle2,
  AlertTriangle,
  Clock,
  DollarSign,
  Users,
  ShieldAlert,
  Send,
  Trash2,
  Volume2,
} from 'lucide-react';

export interface PushNotificationItem {
  id: string;
  category: 'tesoreria' | 'turnos' | 'reputacion';
  title: string;
  body: string;
  timestamp: string;
  read: boolean;
  offlineQueued: boolean;
  priority: 'critica' | 'alta' | 'media';
  actionUrl?: string;
}

const STORAGE_KEY_NOTIFS = 'confia360_push_notifications_v1';

export const INITIAL_NOTIFICATIONS: PushNotificationItem[] = [
  {
    id: 'PUSH-101',
    category: 'tesoreria',
    title: '⚠️ Alerta de Tesorería: Factura Guadarrama vence en 24h',
    body: 'Vencimiento de 1.840,50 € mañana. Saldo proyectado en cuenta operativo correcto.',
    timestamp: 'Hoy, 15:10',
    read: false,
    offlineQueued: false,
    priority: 'critica',
  },
  {
    id: 'PUSH-102',
    category: 'turnos',
    title: '🔄 Cambio de Turno Urgente: Partida Calientes',
    body: 'Marta Ruiz solicita intercambio de turno de cena con Carlos Vega. Pendiente de aprobación.',
    timestamp: 'Hoy, 14:45',
    read: false,
    offlineQueued: false,
    priority: 'alta',
  },
  {
    id: 'PUSH-103',
    category: 'reputacion',
    title: '🚨 Intercepción Privada: Incidencia en Mesa 12',
    body: 'Comensal ha puntuado 2★ por comida templada. Tarea asignada al Jefe de Cocina.',
    timestamp: 'Hoy, 16:02',
    read: true,
    offlineQueued: false,
    priority: 'critica',
  },
];

export const PushNotificationManager: React.FC = () => {
  const { isOnline, isSimulatedOffline, announceAriaLive } = useApp();
  const effectiveOnline = isOnline && !isSimulatedOffline;

  const [notifications, setNotifications] = useState<PushNotificationItem[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_NOTIFS);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {
      // fallback
    }
    return INITIAL_NOTIFICATIONS;
  });

  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [activeTab, setActiveTab] = useState<'todas' | 'tesoreria' | 'turnos' | 'reputacion'>('todas');
  const [isOpenDrawer, setIsOpenDrawer] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      setPermission(Notification.permission);
    }
  }, []);

  const saveNotifications = (items: PushNotificationItem[]) => {
    setNotifications(items);
    try {
      localStorage.setItem(STORAGE_KEY_NOTIFS, JSON.stringify(items));
    } catch {
      // ignore
    }
  };

  const requestPermission = async () => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      try {
        const res = await Notification.requestPermission();
        setPermission(res);
        announceAriaLive(`Permiso de notificaciones push: ${res}`);
      } catch {
        // ignore
      }
    }
  };

  const triggerTestNotification = (
    category: 'tesoreria' | 'turnos' | 'reputacion',
    title: string,
    body: string
  ) => {
    const isOffline = !effectiveOnline;
    const newNotif: PushNotificationItem = {
      id: `PUSH-${Date.now().toString().slice(-4)}`,
      category,
      title,
      body,
      timestamp: new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
      read: false,
      offlineQueued: isOffline,
      priority: category === 'reputacion' || category === 'tesoreria' ? 'critica' : 'alta',
    };

    const updated = [newNotif, ...notifications];
    saveNotifications(updated);

    // Audio beep simulation for critical alert
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, ctx.currentTime); // A5
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.3);
    } catch {
      // audio context muted or unavailable
    }

    // Try system notification if allowed and online
    if (effectiveOnline && typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
      try {
        new Notification(title, {
          body,
          icon: '/favicon.ico',
        });
      } catch {
        // service worker notification fallback
      }
    }

    announceAriaLive(
      isOffline
        ? `[Offline Guardada] Alerta crítica: ${title}`
        : `Nueva notificación push: ${title}`
    );
  };

  const markAllAsRead = () => {
    const updated = notifications.map((n) => ({ ...n, read: true }));
    saveNotifications(updated);
    announceAriaLive('Todas las notificaciones marcadas como leídas');
  };

  const clearAll = () => {
    saveNotifications([]);
    announceAriaLive('Lista de notificaciones limpiada');
  };

  const unreadCount = notifications.filter((n) => !n.read).length;
  const filteredNotifications =
    activeTab === 'todas' ? notifications : notifications.filter((n) => n.category === activeTab);

  return (
    <div className="relative">
      {/* Floating Toggle Button */}
      <button
        onClick={() => setIsOpenDrawer(!isOpenDrawer)}
        className="touch-target-min relative inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-[#011c3c] hover:bg-[#0067B9] text-white border border-white/20 shadow-sm transition"
        title="Bandeja de Notificaciones Push PWA (Tesorería & Turnos)"
        aria-label={`Notificaciones push. ${unreadCount} no leídas.`}
      >
        {unreadCount > 0 ? (
          <BellRing className="w-4 h-4 text-[#80D518] animate-bounce" />
        ) : (
          <Bell className="w-4 h-4 text-blue-200" />
        )}
        <span className="hidden md:inline">Alertas Push</span>
        {unreadCount > 0 && (
          <span className="w-5 h-5 rounded-full bg-[#E11D48] text-white text-[10px] font-black flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Slide-over or Modal Drawer */}
      {isOpenDrawer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center sm:justify-end p-2 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div
            className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]"
            role="dialog"
            aria-label="Gestor de Notificaciones Push PWA"
          >
            {/* Header */}
            <div className="bg-[#022853] text-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#80D518]/20 flex items-center justify-center text-[#80D518]">
                  <BellRing className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-sm">Notificaciones Push PWA</h3>
                  <p className="text-[11px] text-blue-200">
                    Alertas Críticas · Tesorería · Turnos · Offline First
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsOpenDrawer(false)}
                className="text-white/70 hover:text-white p-1 rounded-lg"
              >
                ✕
              </button>
            </div>

            {/* Offline Status & Permission Indicator */}
            <div className="p-3 bg-slate-50 border-b border-slate-200 text-xs flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                {!effectiveOnline ? (
                  <span className="inline-flex items-center gap-1 text-amber-700 font-bold bg-amber-100 px-2 py-0.5 rounded-full text-[10px]">
                    <WifiOff className="w-3 h-3" /> Modo Offline (Registro Local Seguro)
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-emerald-700 font-bold bg-emerald-100 px-2 py-0.5 rounded-full text-[10px]">
                    <CheckCircle2 className="w-3 h-3" /> Push en Tiempo Real Activo
                  </span>
                )}
              </div>

              {permission !== 'granted' && (
                <button
                  onClick={requestPermission}
                  className="text-[10px] font-black bg-[#0067B9] text-white px-2 py-1 rounded-lg hover:bg-blue-700 transition"
                >
                  Activar en Navegador
                </button>
              )}
            </div>

            {/* Quick Simulation Buttons */}
            <div className="p-3 bg-blue-50/40 border-b border-slate-200">
              <span className="text-[10px] font-black uppercase text-slate-500 tracking-wider block mb-1.5">
                Simular Disparo de Alertas:
              </span>
              <div className="grid grid-cols-3 gap-1.5">
                <button
                  onClick={() =>
                    triggerTestNotification(
                      'tesoreria',
                      '⚠️ Vencimiento de Factura en 24h',
                      'Cárnicas Guadarrama: 1.840,50 €. Comprueba saldo de caja antes de las 18:00.'
                    )
                  }
                  className="text-[10px] font-bold p-1.5 rounded-lg bg-white border border-slate-200 hover:border-blue-400 text-slate-700 flex flex-col items-center text-center shadow-2xs"
                >
                  <DollarSign className="w-3.5 h-3.5 text-rose-600 mb-0.5" />
                  <span>Tesorería</span>
                </button>
                <button
                  onClick={() =>
                    triggerTestNotification(
                      'turnos',
                      '🔄 Solicitud Cambio de Turno Cocina',
                      'Marta solicita cambio con Carlos para el servicio de noche del viernes.'
                    )
                  }
                  className="text-[10px] font-bold p-1.5 rounded-lg bg-white border border-slate-200 hover:border-blue-400 text-slate-700 flex flex-col items-center text-center shadow-2xs"
                >
                  <Users className="w-3.5 h-3.5 text-amber-600 mb-0.5" />
                  <span>Cambio Turno</span>
                </button>
                <button
                  onClick={() =>
                    triggerTestNotification(
                      'reputacion',
                      '🚨 Intercepción Crítica: Alérgeno',
                      'Retirado plato con traza no declarada en Mesa 5. Tarea correctiva creada.'
                    )
                  }
                  className="text-[10px] font-bold p-1.5 rounded-lg bg-white border border-slate-200 hover:border-blue-400 text-slate-700 flex flex-col items-center text-center shadow-2xs"
                >
                  <ShieldAlert className="w-3.5 h-3.5 text-purple-600 mb-0.5" />
                  <span>Incidencia 360</span>
                </button>
              </div>
            </div>

            {/* Filter Tabs */}
            <div className="flex border-b border-slate-200 px-3 bg-white text-xs font-bold text-slate-600">
              {(['todas', 'tesoreria', 'turnos', 'reputacion'] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setActiveTab(t)}
                  className={`py-2 px-2.5 border-b-2 capitalize transition-colors ${
                    activeTab === t
                      ? 'border-[#0067B9] text-[#0067B9]'
                      : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>

            {/* Notification List */}
            <div className="flex-1 overflow-y-auto p-3 space-y-2 divide-y divide-slate-100">
              {filteredNotifications.length === 0 ? (
                <div className="py-8 text-center text-slate-400 text-xs">
                  No hay notificaciones en esta categoría
                </div>
              ) : (
                filteredNotifications.map((notif) => (
                  <div
                    key={notif.id}
                    className={`pt-2 first:pt-0 p-2.5 rounded-xl transition-all ${
                      notif.read ? 'bg-white opacity-85' : 'bg-blue-50/30 border border-blue-100 shadow-2xs'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-1.5">
                        {notif.category === 'tesoreria' && (
                          <DollarSign className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                        )}
                        {notif.category === 'turnos' && (
                          <Users className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                        )}
                        {notif.category === 'reputacion' && (
                          <ShieldAlert className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                        )}
                        <h4 className="text-xs font-bold text-slate-900 leading-tight">
                          {notif.title}
                        </h4>
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono whitespace-nowrap">
                        {notif.timestamp}
                      </span>
                    </div>

                    <p className="text-[11px] text-slate-600 mt-1 pl-5">{notif.body}</p>

                    <div className="mt-2 pl-5 flex items-center justify-between text-[10px]">
                      {notif.offlineQueued ? (
                        <span className="inline-flex items-center gap-1 text-amber-700 bg-amber-100 px-1.5 py-0.5 rounded font-bold">
                          <WifiOff className="w-2.5 h-2.5" /> Encolada offline
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded font-bold">
                          <CheckCircle2 className="w-2.5 h-2.5" /> Entregada PWA
                        </span>
                      )}

                      {!notif.read && (
                        <button
                          onClick={() => {
                            const updated = notifications.map((n) =>
                              n.id === notif.id ? { ...n, read: true } : n
                            );
                            saveNotifications(updated);
                          }}
                          className="text-[#0067B9] font-bold hover:underline"
                        >
                          Marcar leída
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer Actions */}
            <div className="p-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs">
              <button
                onClick={markAllAsRead}
                className="text-slate-600 hover:text-slate-900 font-bold"
              >
                Marcar todas leídas
              </button>
              <button
                onClick={clearAll}
                className="text-rose-600 hover:text-rose-800 font-bold flex items-center gap-1"
              >
                <Trash2 className="w-3 h-3" /> Limpiar historial
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
