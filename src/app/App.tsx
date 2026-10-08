import { useState, useEffect } from 'react';
import { Login } from './components/Login';
import { Register } from './components/Register';
import { ClientDashboard } from './components/ClientDashboard';
import { ProfessionalDashboard } from './components/ProfessionalDashboard';
import { ProfessionalProfile } from './components/ProfessionalProfile';
import { ClientProfile } from './components/ClientProfile';
import { ClientNotifications } from './components/ClientNotifications';
import { Help } from './components/Help';
import { ProfessionalBrowser } from './components/ProfessionalBrowser';
import { ChatBubble } from './components/ChatBubble';
import { ChatList } from './components/ChatList';
import { ChatWindow } from './components/ChatWindow';
import { RequestDetails } from './components/RequestDetails';
import { ReviewsScreen } from './components/ReviewsScreen';
import { ClientReviewsScreen } from './components/ClientReviewsScreen';
import { ActiveJobs } from './components/ActiveJobs';
import { PaymentHistory } from './components/PaymentHistory';
import { PaymentModal } from './components/PaymentModal';
import { PaymentSuccessAnimation } from './components/PaymentSuccessAnimation';
import { TutorialOverlay } from './components/TutorialOverlay';
import { PaymentMethods } from './components/PaymentMethods';
import { AdminDashboard } from './components/AdminDashboard';
import {
  actualizarPerfilRol,
  crearSolicitud,
  crearResena,
  completarSolicitud,
  crearPresupuesto,
  enviarMensaje,
  logoutUsuario,
  marcarNotificacionLeida,
  obtenerConversaciones,
  obtenerNotificaciones,
  obtenerResenas,
  obtenerPerfilesRol,
  obtenerSolicitudes,
  responderPresupuesto,
  responderSolicitud
} from '../services/api';
import type { ServiceRequestPayload } from './components/RequestServiceModal';
import { ProfessionalProfileRegistration } from './components/ProfessionalProfileRegistration';
import { ClientProfileRegistration } from './components/ClientProfileRegistration';

export type UserMode = 'client' | 'professional' | 'admin';
export type Screen = 'login' | 'register' | 'client-dashboard' | 'professional-dashboard' | 'profile' | 'notifications' | 'help' | 'browse-professionals' | 'view-professional' | 'view-client' | 'request-details' | 'reviews' | 'client-reviews' | 'active-jobs' | 'payment-history' | 'payment-methods' | 'professional-register' | 'client-register' | 'admin-dashboard';

function mapConversations(conversations: any[], notifications: any[]) {
  const unreadRequestIds = new Set(
    notifications
      .filter((notification: any) =>
        Number(notification.leida) === 0 &&
        (
          ['mensaje', 'presupuesto', 'presupuesto_respuesta'].includes(notification.tipo) ||
          (
            notification.tipo === 'otro' &&
            ['Nuevo mensaje', 'Nuevo presupuesto de servicio', 'Respuesta al presupuesto'].includes(notification.titulo)
          )
        )
      )
      .map((notification: any) => Number(notification.referencia_id))
  );
  return conversations.map((conversation: any) => ({
    ...conversation,
    id: String(conversation.id),
    messages: conversation.messages || [],
    unread: unreadRequestIds.has(Number(conversation.solicitud_id))
  }));
}

function userDataForMode(account: any, mode: Exclude<UserMode, 'admin'>) {
  const profile = account.profiles?.[mode];
  if (!profile) return account;

  return {
    ...account,
    ...profile,
    accountId: account.accountId || account.id,
    profiles: account.profiles,
    roleHistory: account.roleHistory || [],
    is_client: Boolean(account.profiles.client),
    is_professional: Boolean(account.profiles.professional)
  };
}

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('login');
  const [userData, setUserData] = useState<any>(null);
  const [userType, setUserType] = useState<'client' | 'professional' | 'admin' | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedProfessional, setSelectedProfessional] = useState<any>(null);
  const [professionalReviews, setProfessionalReviews] = useState<any>(null);
  const [selectedClient, setSelectedClient] = useState<any>(null);
  const [lastActivityData, setLastActivityData] = useState<any>(null);
  
  // Estado para las notificaciones flotantes (Toast)
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const [roleHistory, setRoleHistory] = useState<{date: string; from : string; to: string}[]>(() => {
    const saved = localStorage.getItem('roleHistory');
    return saved ? JSON.parse(saved) :[];
  });

  // Función para activar el Toast flotante
  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  // Check for expired invoices periodically
  useEffect(() => {
    const checkExpiredInvoices = () => {
      const now = new Date();

      // Update expired transactions
      setTransactions((prev: any)=> {
        let hasChanges = false;
        const updated = prev.map((trans:any) => {
          if (trans.paymentStatus === 'pendiente' && trans.expirationDate) {
            const expirationDate = new Date(trans.expirationDate);
            if (expirationDate < now) {
              hasChanges = true;
              return { ...trans, paymentStatus: 'no_pagado' };
            }
          }
          return trans;
        });
        return hasChanges ? updated : prev;
      });
    };

    // Check immediately and then every minute
    checkExpiredInvoices();
    const interval = setInterval(checkExpiredInvoices, 60000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedUserType = localStorage.getItem('userType');
    let cancelled = false;


    if (storedUser) {
      const restoreSession = async () => {
        try {
          const savedUser = JSON.parse(storedUser);
          const isAdmin = savedUser.rol === 'admin';
          const account = isAdmin ? savedUser : (await obtenerPerfilesRol()).usuario;
          const professionalIsApproved =
            account.profiles?.professional?.estado === 'activo' &&
            account.profiles.professional.activo;
          const hasClientProfile = Boolean(account.profiles?.client);

          const mode: UserMode = isAdmin
            ? 'admin'
            : storedUserType === 'professional' && professionalIsApproved
              ? 'professional'
              : hasClientProfile
                ? 'client'
                : professionalIsApproved
                  ? 'professional'
                  : 'client';

          if (!isAdmin && !hasClientProfile && !professionalIsApproved) {
            throw new Error('La cuenta no tiene un perfil aprobado para iniciar sesión');
          }

          const activeUser = mode === 'admin' ? account : userDataForMode(account, mode);
          if (cancelled) return;
          setUserData(activeUser);
          setRoleHistory(account.roleHistory || []);
          setUserType(mode);
          localStorage.setItem('userType', mode);
          localStorage.setItem('user', JSON.stringify(activeUser));
          setCurrentScreen(mode === 'admin'
            ? 'admin-dashboard'
            : mode === 'professional'
              ? 'professional-dashboard'
              : 'client-dashboard');
          if (mode !== 'admin') {
            triggerToast(`Estás en el modo ${mode === 'professional' ? 'Profesional' : 'Cliente'}`);
          }
        } catch (error) {
          console.error('No se pudo restaurar la sesión:', error);
          if (cancelled) return;
          localStorage.removeItem('user');
          localStorage.removeItem('userType');
          localStorage.removeItem('chambly_usuario');
          setUserData(null);
          setUserType(null);
          setCurrentScreen('login');
        }
      };
      void restoreSession();
    }
    return () => {
      cancelled = true;
    };
  }, []);

  const handleLoginSuccess = (user: any) => {
  setUserData(user);
  localStorage.setItem('user', JSON.stringify(user));

  // Detectar el tipo de usuario
  let savedUserType: 'client' | 'professional' | 'admin' = 'client';

  if (user.rol === 'admin') {
    savedUserType = 'admin';
  } else if (user.rol === 'profesional' || user.isProfessional) {
    savedUserType = 'professional';
  } else {
    savedUserType = 'client';
  }

  setUserType(savedUserType);
  localStorage.setItem('userType', savedUserType);

  // Redirigir según el tipo
  if (savedUserType === 'admin') {
    setCurrentScreen('admin-dashboard');
  } else if (savedUserType === 'professional') {
    setCurrentScreen('professional-dashboard');
  } else {
    setCurrentScreen('client-dashboard');
  }
};

  const handleToggleMode = async () => {
    if (!userData || (userType !== 'client' && userType !== 'professional')) return;

    const newMode = userType === 'client' ? 'professional' : 'client';
    const professionalProfile = userData.profiles?.professional;
    if (newMode === 'professional' && !professionalProfile) {
      setCurrentScreen('professional-register');
      return;
    }
    if (newMode === 'client' && !userData.profiles?.client) {
      setCurrentScreen('client-register');
      return;
    }
    try {
      const result = await actualizarPerfilRol({ action: 'switch', mode: newMode });
      const account = result.usuario;
      const activeUser = userDataForMode(account, newMode);
      setUserData(activeUser);
      setUserType(newMode);
      setRoleHistory(account.roleHistory || []);
      localStorage.setItem('user', JSON.stringify(activeUser));
      localStorage.setItem('userType', newMode);
      setCurrentScreen(newMode === 'professional' ? 'professional-dashboard' : 'client-dashboard');
      triggerToast(result.mensaje);
    } catch (error) {
      console.error('No se pudo cambiar el modo de la cuenta:', error);
      triggerToast(error instanceof Error ? error.message : 'No se pudo cambiar el modo');
    }
  };


  // Chat state
  const [showChatList, setShowChatList] = useState(false);
  const [showChatWindow, setShowChatWindow] = useState(false);
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [acceptedRequestIds, setAcceptedRequestIds] = useState<number[]>([]);
  const [rejectedRequestIds, setRejectedRequestIds] = useState<number[]>([]);
  const [activeJobs, setActiveJobs] = useState<any[]>([]);

  // Client request tracking
  const [sentRequests, setSentRequests] = useState<any[]>([]);
  const [serviceRequests, setServiceRequests] = useState<any[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);

  // Payment state
  const [transactions, setTransactions] = useState<any[]>([
    // Demo transaction 1 - Pending (Card)
    {
      id: 'trans-demo-1',
      serviceId: 'demo-chat-1',
      clientId: 'demo-chat-1',
      clientName: 'María Rodríguez',
      clientPhoto: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop',
      professionalId: 'demo-professional',
      serviceName: 'Limpieza',
      amount: 175.00,
      paymentMethod: 'tarjeta',
      paymentStatus: 'pendiente',
      date: new Date().toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' }),
      description: 'Factura #demo-1 - Limpieza profunda de 3 habitaciones',
      expirationDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      invoiceId: 'invoice-demo-1'
    },
    // Demo transaction 2 - Completed (Cash - Electricidad)
    {
      id: 'trans-demo-2',
      serviceId: 'demo-chat-3',
      clientId: 'demo-chat-3',
      clientName: 'Roberto Silva',
      clientPhoto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop',
      professionalId: 'demo-professional',
      serviceName: 'Electricidad',
      amount: 450.00,
      paymentMethod: 'efectivo',
      paymentStatus: 'completado',
      date: new Date().toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' }),
      description: 'Factura #demo-3 - Reparación eléctrica y cambio de tomacorrientes',
      expirationDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      invoiceId: 'invoice-demo-3'
    },
    // Demo transaction 3 - Completed (Cash - Pintura)
    {
      id: 'trans-demo-3',
      serviceId: 'demo-chat-2',
      clientId: 'demo-chat-2',
      clientName: 'Carlos Méndez',
      clientPhoto: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop',
      professionalId: 'demo-professional',
      serviceName: 'Pintura',
      amount: 650.00,
      paymentMethod: 'efectivo',
      paymentStatus: 'completado',
      date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' }),
      description: 'Factura #demo-2 - Pintura de 3 habitaciones',
      expirationDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      invoiceId: 'invoice-demo-2'
    },
    // Demo transaction 4 - Completed (Card - Old)
    {
      id: 'trans-demo-4',
      serviceId: 'service-old-1',
      clientId: 'client-old-1',
      clientName: 'Ana López',
      clientPhoto: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop',
      professionalId: 'demo-professional',
      serviceName: 'Limpieza',
      amount: 220.00,
      paymentMethod: 'tarjeta',
      paymentStatus: 'completado',
      date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' }),
      description: 'Limpieza semanal de oficina',
      expirationDate: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      invoiceId: 'invoice-old-1'
    },
    // Demo transaction 5 - Completed (Cash - Old)
    {
      id: 'trans-demo-5',
      serviceId: 'service-old-2',
      clientId: 'client-old-2',
      clientName: 'Patricia Flores',
      clientPhoto: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=200&h=200&fit=crop',
      professionalId: 'demo-professional',
      serviceName: 'Jardinería',
      amount: 180.00,
      paymentMethod: 'efectivo',
      paymentStatus: 'completado',
      date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' }),
      description: 'Mantenimiento de jardín y poda',
      expirationDate: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      invoiceId: 'invoice-old-2'
    },
    // Demo transaction 6 - No Pagado (Expired)
    {
      id: 'trans-demo-6',
      serviceId: 'service-old-3',
      clientId: 'client-old-3',
      clientName: 'Miguel Torres',
      clientPhoto: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop',
      professionalId: 'demo-professional',
      serviceName: 'Plomería',
      amount: 320.00,
      paymentMethod: 'tarjeta',
      paymentStatus: 'no_pagado',
      date: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' }),
      description: 'Reparación de tubería - Pago no completado',
      expirationDate: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      invoiceId: 'invoice-old-3'
    }
  ]);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showPaymentSuccess, setShowPaymentSuccess] = useState(false);
  const [pendingPayment, setPendingPayment] = useState<{
    jobId: string;
    clientName: string;
    serviceName: string;
    amount: number;
  } | null>(null);

  // Saved cards state
  const [savedCards, setSavedCards] = useState<any[]>([
    {
      id: 'sample-card-1',
      cardNumber: '1234123412341234',
      cardName: 'Muestra',
      expiryDate: '04/32',
      lastFourDigits: '1234'
    }
  ]);

  // Tutorial state
  const [showTutorial, setShowTutorial] = useState(false);
  const [hasSeenTutorial, setHasSeenTutorial] = useState(false);
  const demoChats = [
    // Demo chat 1 - Active with invoice (Card payment - unpaid)
    {
      id: 'demo-chat-1',
      otherPersonName: 'María Rodríguez',
      otherPersonPhoto: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop',
      lastMessage: 'Factura enviada: $175.00',
      lastMessageTime: 'Hace 10 min',
      unread: true,
      isActive: true,
      jobType: 'Limpieza',
      clientRated: false,
      professionalRated: false,
      requestedPaymentMethod: 'tarjeta' as const,
      messages: [
        {
          id: 'm1',
          senderId: 'system',
          text: '¡Solicitud aceptada! Ahora pueden coordinar los detalles del trabajo.',
          timestamp: '10:30 AM',
          isMine: false,
          type: 'text' as const
        },
        {
          id: 'm2',
          senderId: 'maria',
          text: 'He aceptado tu solicitud. ¿Cuándo podemos empezar?',
          timestamp: '10:32 AM',
          isMine: false,
          type: 'text' as const
        },
        {
          id: 'm3',
          senderId: 'me',
          text: 'Mañana a las 2 PM estaría perfecto',
          timestamp: '10:35 AM',
          isMine: true,
          type: 'text' as const
        },
        {
          id: 'm4',
          senderId: 'maria',
          text: 'Excelente, he terminado el trabajo. Te envío la factura.',
          timestamp: '2:15 PM',
          isMine: false,
          type: 'text' as const
        },
        {
          id: 'm5-invoice',
          senderId: 'maria',
          timestamp: '2:16 PM',
          isMine: false,
          type: 'invoice' as const,
          invoiceData: {
            invoiceId: 'invoice-demo-1',
            items: [
              {
                id: 'item-1',
                description: 'Limpieza profunda - 3 habitaciones, cocina y 2 baños',
                amount: 120.00,
                type: 'labor' as const
              },
              {
                id: 'item-2',
                description: 'Productos de limpieza especializados',
                amount: 35.00,
                type: 'material' as const
              },
              {
                id: 'item-3',
                description: 'Limpieza de ventanas',
                amount: 20.00,
                type: 'labor' as const
              }
            ],
            total: 175.00,
            isPaid: false,
            expirationDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 7 days from now
            paymentMethod: 'tarjeta' as const
          }
        }
      ]
    },
    // Demo chat 2 - Finished work with paid invoice (Cash)
    {
      id: 'demo-chat-2',
      otherPersonName: 'Carlos Méndez',
      otherPersonPhoto: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop',
      lastMessage: '✓ Tu pago en efectivo de $650.00 ha sido recibido con éxito',
      lastMessageTime: 'Hace 2 días',
      unread: false,
      isActive: false,
      jobType: 'Pintura',
      clientRated: false,
      professionalRated: true,
      requestedPaymentMethod: 'efectivo' as const,
      messages: [
        {
          id: 'm1',
          senderId: 'system',
          text: '¡Solicitud aceptada! Ahora pueden coordinar los detalles del trabajo.',
          timestamp: 'Lun 10:00 AM',
          isMine: false,
          type: 'text' as const
        },
        {
          id: 'm2',
          senderId: 'carlos',
          text: 'Hola, puedo ir mañana a las 9 AM. ¿Te parece bien?',
          timestamp: 'Lun 10:15 AM',
          isMine: false,
          type: 'text' as const
        },
        {
          id: 'm3',
          senderId: 'me',
          text: 'Perfecto, te espero a esa hora.',
          timestamp: 'Lun 10:20 AM',
          isMine: true,
          type: 'text' as const
        },
        {
          id: 'm4',
          senderId: 'carlos',
          text: 'Trabajo finalizado. Te envío la factura del servicio.',
          timestamp: 'Mar 2:30 PM',
          isMine: false,
          type: 'text' as const
        },
        {
          id: 'm5-invoice',
          senderId: 'carlos',
          timestamp: 'Mar 2:32 PM',
          isMine: false,
          type: 'invoice' as const,
          invoiceData: {
            invoiceId: 'invoice-demo-2',
            items: [
              {
                id: 'item-1',
                description: 'Pintura de 3 habitaciones - Mano de obra',
                amount: 450.00,
                type: 'labor' as const
              },
              {
                id: 'item-2',
                description: 'Pintura premium blanco marfil - 5 galones',
                amount: 150.00,
                type: 'material' as const
              },
              {
                id: 'item-3',
                description: 'Materiales adicionales (rodillos, brochas, cinta)',
                amount: 50.00,
                type: 'material' as const
              }
            ],
            total: 650.00,
            isPaid: true,
            expirationDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Yesterday (already paid)
            paymentMethod: 'efectivo' as const
          }
        },
        {
          id: 'm6',
          senderId: 'system',
          text: '✓ Tu pago en efectivo de $650.00 ha sido recibido con éxito',
          timestamp: 'Mar 3:00 PM',
          isMine: false,
          type: 'text' as const
        }
      ]
    },
    // Demo chat 3 - Electricidad with cash invoice and final message
    {
      id: 'demo-chat-3',
      otherPersonName: 'Roberto Silva',
      otherPersonPhoto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop',
      lastMessage: 'Muchas gracias por tu pago',
      lastMessageTime: 'Hace 5 horas',
      unread: false,
      isActive: false,
      jobType: 'Electricidad',
      clientRated: false,
      professionalRated: true,
      requestedPaymentMethod: 'efectivo' as const,
      messages: [
        {
          id: 'm1',
          senderId: 'system',
          text: '¡Solicitud aceptada! Ahora pueden coordinar los detalles del trabajo.',
          timestamp: '9:00 AM',
          isMine: false,
          type: 'text' as const
        },
        {
          id: 'm2',
          senderId: 'roberto',
          text: 'Buenos días, puedo revisar el problema eléctrico hoy en la tarde. ¿Te parece bien?',
          timestamp: '9:15 AM',
          isMine: false,
          type: 'text' as const
        },
        {
          id: 'm3',
          senderId: 'me',
          text: 'Sí, perfecto. Te espero a las 3 PM',
          timestamp: '9:20 AM',
          isMine: true,
          type: 'text' as const
        },
        {
          id: 'm4',
          senderId: 'roberto',
          text: 'Trabajo terminado. Aquí está el detalle del servicio realizado.',
          timestamp: '5:45 PM',
          isMine: false,
          type: 'text' as const
        },
        {
          id: 'm5-invoice',
          senderId: 'roberto',
          timestamp: '5:47 PM',
          isMine: false,
          type: 'invoice' as const,
          invoiceData: {
            invoiceId: 'invoice-demo-3',
            items: [
              {
                id: 'item-1',
                description: 'Reparación de instalación eléctrica defectuosa',
                amount: 200.00,
                type: 'labor' as const
              },
              {
                id: 'item-2',
                description: 'Cambio de 8 tomacorrientes',
                amount: 120.00,
                type: 'labor' as const
              },
              {
                id: 'item-3',
                description: 'Tomacorrientes de seguridad (x8)',
                amount: 80.00,
                type: 'material' as const
              },
              {
                id: 'item-4',
                description: 'Cable eléctrico y materiales varios',
                amount: 50.00,
                type: 'material' as const
              }
            ],
            total: 450.00,
            isPaid: true,
            expirationDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            paymentMethod: 'efectivo' as const
          }
        },
        {
          id: 'm6',
          senderId: 'system',
          text: '✓ Tu pago en efectivo de $450.00 ha sido recibido con éxito',
          timestamp: '6:15 PM',
          isMine: false,
          type: 'text' as const
        },
        {
          id: 'm7',
          senderId: 'roberto',
          text: 'Muchas gracias por tu pago',
          timestamp: '6:16 PM',
          isMine: false,
          type: 'text' as const
        }
      ]
    }
  ];
  const [chats, setChats] = useState<any[]>([]);

  useEffect(() => {
    if (!userData || (userType !== 'client' && userType !== 'professional')) return;
    let cancelled = false;
    const loadServiceData = async (reportLoadError: boolean) => {
      const [requestState, conversationState, notificationState] = await Promise.allSettled([
          obtenerSolicitudes(),
          obtenerConversaciones(),
          obtenerNotificaciones()
      ]);
      if (cancelled) return;

      const loadErrors: string[] = [];
      const requests = requestState.status === 'fulfilled'
        ? requestState.value.solicitudes || []
        : null;
      const notificationItems = notificationState.status === 'fulfilled'
        ? notificationState.value.notificaciones || []
        : null;
      const conversations = conversationState.status === 'fulfilled'
        ? conversationState.value.conversaciones || []
        : null;

      if (requests) {
        setServiceRequests(requests);
        if (userType === 'client') {
          setSentRequests(requests.map((request: any) => ({
            id: String(request.id),
            professionalId: String(request.profesional_id),
            professionalName: `${request.profesional_nombre} ${request.profesional_apellido}`.trim(),
            category: request.categoria || 'Servicio',
            paymentMethod: String(request.metodo_pago || '').toLowerCase(),
            date: request.fecha_solicitud,
            time: request.fecha_solicitud,
            status: request.estado,
            municipio: request.municipio,
            departamento: request.departamento,
            solicitudId: Number(request.id),
            reviewId: request.resena_id ? Number(request.resena_id) : null
          })));
        }
      } else {
        loadErrors.push(`solicitudes: ${String(requestState.reason)}`);
      }

      if (notificationItems) {
        setNotifications(notificationItems);
      } else {
        loadErrors.push(`notificaciones: ${String(notificationState.reason)}`);
      }

      let mappedChats: any[] | null = null;
      if (conversations) {
        mappedChats = mapConversations(conversations, notificationItems || []);
        setChats(previous => mappedChats!.map((chat: any) => ({
          ...chat,
          unread: notificationItems
            ? chat.unread
            : previous.find((item: any) => item.id === chat.id)?.unread || false
        })));
      } else {
        loadErrors.push(`conversaciones: ${String(conversationState.reason)}`);
      }

      if (requests && userType === 'professional') {
        const chatByRequest = new Map((mappedChats || []).map((chat: any) => [Number(chat.solicitud_id), chat]));
        setActiveJobs(requests
          .filter((request: any) => ['aceptada', 'en_proceso', 'completada'].includes(request.estado))
          .map((request: any) => {
            const chat: any = chatByRequest.get(Number(request.id));
            return {
              id: String(request.id),
              chatId: chat?.id || '',
              clientName: `${request.cliente_nombre || ''} ${request.cliente_apellido || ''}`.trim() || 'Cliente',
              clientPhoto: request.foto_cliente || '',
              jobType: request.categoria || 'Servicio',
              scheduledDate: [request.fecha_servicio, request.hora_servicio].filter(Boolean).join(' · ') || 'Por coordinar',
              description: request.descripcion,
              isCompleted: request.estado === 'completada'
            };
          }));
      } else if (requests) {
        setActiveJobs([]);
      }

      if (reportLoadError && loadErrors.length > 0) {
        console.error('No se pudieron cargar algunos datos del servicio:', loadErrors);
        triggerToast(`No se pudieron cargar ${loadErrors.join('; ')}`);
      }
    };
    void loadServiceData(true);
    const refreshTimer = window.setInterval(() => { void loadServiceData(false); }, 15000);
    return () => {
      cancelled = true;
      window.clearInterval(refreshTimer);
    };
  }, [userData, userType]);

  const handleLogin = (type: UserMode, data: any) => {
    const activeUser = type === 'admin' ? data : userDataForMode(data, type);
    setUserData(activeUser);
    setUserType(type);
    if (Array.isArray(data.roleHistory)) {
      setRoleHistory(data.roleHistory);
    }
    localStorage.setItem('user', JSON.stringify(activeUser));
    localStorage.setItem('userType', type);

    if (type === 'admin') {
      setCurrentScreen('admin-dashboard');
    } else if (type === 'professional') {
      setCurrentScreen('professional-dashboard');
    } else {
      setCurrentScreen('client-dashboard');
    }

    if (type !== 'admin' && !hasSeenTutorial) {
      setTimeout(() => {
        setShowTutorial(true);
      }, 500);
    }
  };

  const handleRegister = (type: 'client' | 'professional', data: any) => {
    setUserData(data);
    setUserType(type);
    setCurrentScreen(type === 'client' ? 'client-dashboard' : 'professional-dashboard');

    // Always show tutorial for new users
    setTimeout(() => {
      setShowTutorial(true);
    }, 500);
  };

  const handleCloseTutorial = () => {
    setShowTutorial(false);
    setHasSeenTutorial(true);
  };

  const handleShowTutorial = () => {
    setShowTutorial(true);
  };

  const handleLogout = async () => {
    try {
      await logoutUsuario();
    } catch (error) {
      console.error('Error al cerrar la sesión del servidor:', error);
    } finally {
      localStorage.removeItem('user');
      localStorage.removeItem('userType');
      localStorage.removeItem('chambly_usuario');
      setUserData(null);
      setUserType(null);
      setCurrentScreen('login');
    }
  };

  const handleNavigation = (section: string) => {
    // Check if browsing a category
    if (section.startsWith('browse-')) {
      const category = section.replace('browse-', '');
      setSelectedCategory(category);
      setCurrentScreen('browse-professionals');
    } else {
      setCurrentScreen(section as Screen);
    }
  };

  const handleViewProfessional = (professional: any) => {
    setSelectedProfessional(professional);
    setCurrentScreen('view-professional');
  };

  const handleViewClient = (client: any) => {
    setSelectedClient(client);
    setCurrentScreen('view-client');
  };

  const handleViewReviews = async () => {
    if (!selectedProfessional?.id) return;
    try {
      const result = await obtenerResenas(selectedProfessional.id);
      setProfessionalReviews(result);
    } catch (error) {
      console.error('No se pudieron cargar las reseñas:', error);
      triggerToast(error instanceof Error ? error.message : 'No se pudieron cargar las reseñas');
      return;
    }
    setCurrentScreen('reviews');
  };

  const handleViewClientReviews = () => {
    setCurrentScreen('client-reviews');
  };

  const handleSendRequest = async (payload: ServiceRequestPayload) => {
    const result = await crearSolicitud(payload);
    const requestResult = await obtenerSolicitudes();
    setServiceRequests(requestResult.solicitudes || []);
    setSentRequests((requestResult.solicitudes || []).map((request: any) => ({
      id: String(request.id),
      professionalId: String(request.profesional_id),
      professionalName: `${request.profesional_nombre} ${request.profesional_apellido}`.trim(),
      category: request.categoria || 'Servicio',
      paymentMethod: String(request.metodo_pago || '').toLowerCase(),
      date: request.fecha_solicitud,
      time: request.fecha_solicitud,
      status: request.estado,
      municipio: request.municipio,
      departamento: request.departamento,
      solicitudId: Number(request.id),
      reviewId: request.resena_id ? Number(request.resena_id) : null
    })));
    triggerToast(result.mensaje);
  };

  const handleMarkNotificationRead = async (notificationId: number) => {
    try {
      await marcarNotificacionLeida(notificationId);
      setNotifications(previous => previous.map(notification =>
        Number(notification.id) === notificationId ? { ...notification, leida: 1 } : notification
      ));
    } catch (error) {
      console.error('No se pudo marcar la notificación como leída:', error);
      triggerToast(error instanceof Error ? error.message : 'No se pudo actualizar la notificación');
    }
  };

  const handleAcceptRequest = async (requestId: number) => {
    try {
      const result = await responderSolicitud(requestId, 'aceptada');
      const [requestResult, conversationResult, notificationResult] = await Promise.all([
        obtenerSolicitudes(), obtenerConversaciones(), obtenerNotificaciones()
      ]);
      setServiceRequests(requestResult.solicitudes || []);
      setNotifications(notificationResult.notificaciones || []);
      setChats(mapConversations(conversationResult.conversaciones || [], notificationResult.notificaciones || []));
      triggerToast(result.mensaje);
    } catch (error) {
      console.error('No se pudo aceptar la solicitud:', error);
      triggerToast(error instanceof Error ? error.message : 'No se pudo aceptar la solicitud');
    }
  };

  const handleRejectRequest = async (requestId: number) => {
    try {
      const result = await responderSolicitud(requestId, 'rechazada');
      const requestResult = await obtenerSolicitudes();
      setServiceRequests(requestResult.solicitudes || []);
      triggerToast(result.mensaje);
    } catch (error) {
      console.error('No se pudo rechazar la solicitud:', error);
      triggerToast(error instanceof Error ? error.message : 'No se pudo rechazar la solicitud');
    }
  };

  const handleMarkJobCompleted = async (jobId: string) => {
    try {
      const result = await completarSolicitud(Number(jobId));
      const requestResult = await obtenerSolicitudes();
      setServiceRequests(requestResult.solicitudes || []);
      setActiveJobs(previous => previous.map(job =>
        job.id === jobId ? { ...job, isCompleted: true } : job
      ));
      triggerToast(result.mensaje);
    } catch (error) {
      console.error('No se pudo completar el servicio:', error);
      triggerToast(error instanceof Error ? error.message : 'No se pudo completar el servicio');
    }
  };

  const handleConfirmPayment = (method: 'efectivo' | 'tarjeta', amount: number) => {
    if (!pendingPayment) return;

    const job = activeJobs.find(j => j.id === pendingPayment.jobId);
    if (!job) return;

    // Create transaction
    const newTransaction = {
      id: `trans-${Date.now()}`,
      serviceId: job.id,
      clientId: job.chatId,
      clientName: job.clientName,
      clientPhoto: job.clientPhoto,
      professionalId: userData?.email || '',
      serviceName: job.jobType,
      amount: amount,
      paymentMethod: method,
      paymentStatus: method === 'tarjeta' ? 'completado' : 'pendiente',
      date: new Date().toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' }),
      description: job.description
    };

    setTransactions(prev => [newTransaction, ...prev]);

    // If card payment, complete immediately
    if (method === 'tarjeta') {
      completeJobWithPayment(pendingPayment.jobId, amount, method);
    } else {
      // For cash, mark as pending confirmation
      alert('Se ha enviado una solicitud de confirmación de pago al cliente. El servicio se completará cuando el cliente confirme el pago en efectivo.');
      setShowPaymentModal(false);
      setPendingPayment(null);
    }
  };

  const completeJobWithPayment = (jobId: string, amount: number, method: 'efectivo' | 'tarjeta') => {
    const job = activeJobs.find(j => j.id === jobId);
    if (!job) return;

    // Mark job as completed
    setActiveJobs(prev => prev.map(j =>
      j.id === jobId ? { ...j, isCompleted: true } : j
    ));

    // Mark the chat as inactive and rated
    setChats(prev => prev.map(chat =>
      chat.id === job.chatId ? {
        ...chat,
        isActive: false,
        professionalRated: true,
        professionalRating: job.pendingRating || 5
      } : chat
    ));

    // Show success animation
    setShowPaymentSuccess(true);
    setShowPaymentModal(false);
    setPendingPayment(null);
  };

  const handleOpenChatFromJob = (chatId: string) => {
    setSelectedChatId(chatId);
    setShowChatList(false);
    setShowChatWindow(true);
    setCurrentScreen('professional-dashboard');

    // Mark chat as read
    setChats(prev => prev.map(chat =>
      chat.id === chatId ? { ...chat, unread: false } : chat
    ));
  };

  const handleViewProfileFromChat = () => {
    const selectedChat = chats.find(chat => chat.id === selectedChatId);
    if (!selectedChat) return;

    // Close chat
    setShowChatWindow(false);
    setShowChatList(false);

    if (userType === 'professional') {
      // Professional viewing client profile
      const mockClientData = {
        name: selectedChat.otherPersonName.split(' ')[0],
        lastName: selectedChat.otherPersonName.split(' ')[1] || '',
        departamento: 'San Salvador',
        email: 'cliente@ejemplo.com',
        phone: '7000-0000',
        address: 'Dirección del cliente',
        dui: '00000000-0',
        photo: selectedChat.otherPersonPhoto
      };
      setSelectedClient(mockClientData);
      setCurrentScreen('view-client');
    } else {
      // Client viewing professional profile
      const mockProfessionalData = {
        name: selectedChat.otherPersonName.split(' ')[0],
        lastName: selectedChat.otherPersonName.split(' ')[1] || '',
        photo: selectedChat.otherPersonPhoto,
        departamento: 'San Salvador',
        categories: [selectedChat.jobType],
        yearsExperience: 5,
        educationType: 'empirico',
        rating: 4.8,
        reviewCount: 24
      };
      setSelectedProfessional(mockProfessionalData);
      setCurrentScreen('view-professional');
    }
  };

  const handleChatSelect = async (chatId: string) => {
    const chat = chats.find(item => item.id === chatId);
    setSelectedChatId(chatId);
    setShowChatList(false);
    setShowChatWindow(true);
    setChats(prev => prev.map(chat =>
      chat.id === chatId ? { ...chat, unread: false } : chat
    ));
    if (currentScreen === 'notifications') {
      setCurrentScreen(userType === 'professional' ? 'professional-dashboard' : 'client-dashboard');
    }
    if (!chat) return;

    const unreadChatNotifications = notifications.filter(notification =>
      Number(notification.leida) === 0 &&
      Number(notification.referencia_id) === Number(chat.solicitud_id) &&
      (
        ['mensaje', 'presupuesto', 'presupuesto_respuesta'].includes(notification.tipo) ||
        (
          notification.tipo === 'otro' &&
          ['Nuevo mensaje', 'Nuevo presupuesto de servicio', 'Respuesta al presupuesto'].includes(notification.titulo)
        )
      )
    );
    if (unreadChatNotifications.length === 0) return;

    try {
      await Promise.all(unreadChatNotifications.map(notification =>
        marcarNotificacionLeida(Number(notification.id))
      ));
      const readIds = new Set(unreadChatNotifications.map(notification => Number(notification.id)));
      setNotifications(previous => previous.map(notification =>
        readIds.has(Number(notification.id)) ? { ...notification, leida: 1 } : notification
      ));
    } catch (error) {
      console.error('No se pudieron marcar como leídas las notificaciones del chat:', error);
      triggerToast(error instanceof Error ? error.message : 'No se pudieron actualizar las notificaciones');
    }
  };

  const handleMarkFinished = async () => {
    const chat = chats.find(item => item.id === selectedChatId);
    if (!chat) return;
    try {
      const result = await completarSolicitud(Number(chat.solicitud_id));
      const [requestResult, conversationResult, notificationResult] = await Promise.all([
        obtenerSolicitudes(), obtenerConversaciones(), obtenerNotificaciones()
      ]);
      setServiceRequests(requestResult.solicitudes || []);
      setNotifications(notificationResult.notificaciones || []);
      setChats(mapConversations(conversationResult.conversaciones || [], notificationResult.notificaciones || []));
      setActiveJobs(previous => previous.map(job =>
        job.chatId === selectedChatId ? { ...job, isCompleted: true } : job
      ));
      setShowChatWindow(false);
      setSelectedChatId(null);
      triggerToast(result.mensaje);
    } catch (error) {
      console.error('No se pudo marcar como completado el servicio:', error);
      triggerToast(error instanceof Error ? error.message : 'No se pudo completar el servicio');
    }
  };

  const handleRate = async (chatId: string, rating: number, comment: string) => {
    const chat = chats.find(item => item.id === chatId);
    if (!chat) return;
    await handleSubmitReview(Number(chat.solicitud_id), rating, comment);
    setChats(previous => previous.map(item =>
      item.id === chatId ? { ...item, clientRated: true } : item
    ));
  };

  const handleSubmitReview = async (requestId: number, rating: number, comment: string) => {
    try {
      const result = await crearResena({
        solicitudId: requestId,
        rating,
        comment
      });
      const [requestResult, notificationResult] = await Promise.all([
        obtenerSolicitudes(), obtenerNotificaciones()
      ]);
      setServiceRequests(requestResult.solicitudes || []);
      setSentRequests((requestResult.solicitudes || []).map((request: any) => ({
        id: String(request.id),
        professionalId: String(request.profesional_id),
        professionalName: `${request.profesional_nombre} ${request.profesional_apellido}`.trim(),
        category: request.categoria || 'Servicio',
        paymentMethod: String(request.metodo_pago || '').toLowerCase(),
        date: request.fecha_solicitud,
        time: request.fecha_solicitud,
        status: request.estado,
        municipio: request.municipio,
        departamento: request.departamento,
        solicitudId: Number(request.id),
        reviewId: request.resena_id ? Number(request.resena_id) : null
      })));
      setNotifications(notificationResult.notificaciones || []);
      triggerToast(result.mensaje);
    } catch (error) {
      console.error('No se pudo guardar la reseña:', error);
      const message = error instanceof Error ? error.message : 'No se pudo enviar la reseña';
      triggerToast(message);
      throw new Error(message);
    }
  };

  const handleSendMessage = async (chatId: string, message: string) => {
    try {
      const result = await enviarMensaje(Number(chatId), message);
      const sentMessage = result.mensajeEnviado;
      setChats(previous => previous.map(chat => chat.id === chatId ? {
        ...chat,
        messages: [...chat.messages, sentMessage],
        lastMessage: sentMessage.text,
        lastMessageTime: 'Ahora'
      } : chat));
      try {
        const [conversationResult, notificationResult] = await Promise.all([
          obtenerConversaciones(), obtenerNotificaciones()
        ]);
        setNotifications(notificationResult.notificaciones || []);
        setChats(mapConversations(conversationResult.conversaciones || [], notificationResult.notificaciones || []));
      } catch (refreshError) {
        console.error('El mensaje se envió, pero no se pudo actualizar la conversación:', refreshError);
        triggerToast('El mensaje se envió; no se pudo actualizar el chat. Vuelve a intentarlo en unos segundos.');
      }
    } catch (error) {
      console.error('No se pudo enviar el mensaje:', error);
      triggerToast(error instanceof Error ? error.message : 'No se pudo enviar el mensaje');
    }
  };

  const handleSendInvoice = async (
    chatId: string,
    items: any[],
    deliveryMode: 'al_finalizar' | 'fecha',
    scheduledDate: string
  ) => {
    const result = await crearPresupuesto(Number(chatId), items, deliveryMode, scheduledDate);
    const sentMessage = result.mensajeEnviado;
    setChats(previous => previous.map(chat => chat.id === chatId ? {
      ...chat,
      messages: [...chat.messages, sentMessage],
      lastMessage: sentMessage.invoiceData?.status === 'programada'
        ? 'Presupuesto programado'
        : `Presupuesto enviado: $${Number(sentMessage.invoiceData?.total || 0).toFixed(2)}`,
      lastMessageTime: 'Ahora'
    } : chat));
    triggerToast(result.mensaje);
    try {
      const [conversationResult, notificationResult] = await Promise.all([
        obtenerConversaciones(), obtenerNotificaciones()
      ]);
      setNotifications(notificationResult.notificaciones || []);
      setChats(mapConversations(conversationResult.conversaciones || [], notificationResult.notificaciones || []));
    } catch (refreshError) {
      console.error('El presupuesto se guardó como mensaje, pero no se pudo actualizar el chat:', refreshError);
      triggerToast('El presupuesto se guardó en el chat; no se pudo actualizar la vista.');
    }
  };

  const handleRespondQuote = async (
    chatId: string,
    quoteId: string,
    decision: 'aceptada' | 'rechazada'
  ) => {
    try {
      const result = await responderPresupuesto(Number(chatId), quoteId, decision);
      setChats(previous => previous.map(chat => chat.id === chatId ? {
        ...chat,
        messages: chat.messages.map((message: any) =>
          message.type === 'invoice' && message.invoiceData?.invoiceId === quoteId
            ? { ...message, invoiceData: { ...message.invoiceData, status: decision } }
            : message
        ).concat(result.mensajeEnviado ? [result.mensajeEnviado] : [])
      } : chat));
      triggerToast(result.mensaje);
      try {
        const [conversationResult, notificationResult] = await Promise.all([
          obtenerConversaciones(), obtenerNotificaciones()
        ]);
        setNotifications(notificationResult.notificaciones || []);
        setChats(mapConversations(conversationResult.conversaciones || [], notificationResult.notificaciones || []));
      } catch (refreshError) {
        console.error('La respuesta del presupuesto se guardó, pero no se pudo actualizar el chat:', refreshError);
        triggerToast('Tu respuesta se guardó; no se pudo actualizar el chat.');
      }
    } catch (error) {
      console.error('No se pudo responder el presupuesto:', error);
      triggerToast(error instanceof Error ? error.message : 'No se pudo responder el presupuesto');
    }
  };

  const hasUnreadChats = chats.some(chat => chat.unread);
  const unreadNotificationCount = notifications.filter(notification => Number(notification.leida) === 0).length;
  const selectedChat = chats.find(chat => chat.id === selectedChatId);

  // Show chat bubble: on dashboard OR on chat list, but NOT when in a specific chat window or login/register
  const showChatBubble = (currentScreen !== 'login' && currentScreen !== 'register' && userData) && !showChatWindow;
  // Show home icon when in chat list, show message icon when in dashboard
  const showHomeInBubble = showChatList;

  const handleBackToDashboard = () => {
    if (userType === 'client') {
      setCurrentScreen('client-dashboard');
    } else if (userType === 'professional') {
      setCurrentScreen('professional-dashboard');
    }
  };

  const handleBackFromBrowser = () => {
    setCurrentScreen('client-dashboard');
  };

  const handleAddCard = (card: any) => {
    setSavedCards(prev => [card, ...prev]);
  };

  const handleDeleteCard = (cardId: string) => {
    setSavedCards(prev => prev.filter(card => card.id !== cardId));
  };

  return (
    <div className="size-full">
      {currentScreen === 'login' && (
        <Login
          onLogin={handleLogin}
          onSwitchToRegister={() => setCurrentScreen('register')}
        />
      )}

      {currentScreen === 'register' && (
        <Register
          onRegister={handleRegister}
          onSwitchToLogin={() => setCurrentScreen('login')}
        />
      )}

      {currentScreen === 'client-dashboard' && userData && (
        <ClientDashboard
          userName={`${userData.name}${userData.lastName ? ' ' + userData.lastName : ''}`}
          userData={userData}
          onLogout={handleLogout}
          onNavigate={handleNavigation}
          onShowTutorial={handleShowTutorial}
          onToggleMode={handleToggleMode}
          roleHistory={roleHistory}
          notificationCount={unreadNotificationCount}
        />
      )}

      {currentScreen === 'professional-dashboard' && userData && (
        <ProfessionalDashboard
          userName={`${userData.name}${userData.lastName ? ' ' + userData.lastName : ''}`}
          userData={userData}
          userCategories={userData.categories || []}
          onLogout={handleLogout}
          onNavigate={handleNavigation}
          onViewClient={handleViewClient}
          onAcceptRequest={handleAcceptRequest}
          onRejectRequest={handleRejectRequest}
          serviceRequests={serviceRequests}
          onShowTutorial={handleShowTutorial}
          onToggleMode={handleToggleMode}
          roleHistory={roleHistory}
          notificationCount={unreadNotificationCount}
        />
      )}
      {currentScreen === 'admin-dashboard' && (
        <AdminDashboard
          userData={userData}
          onLogout={handleLogout}
        />
      )}

      {currentScreen === 'profile' && userData && userType === 'professional' && (
        <ProfessionalProfile
          userData={userData}
          onBack={handleBackToDashboard}
          isOwnProfile={true}
        />
      )}

      {currentScreen === 'profile' && userData && userType === 'client' && (
        <ClientProfile
          userData={userData}
          onBack={handleBackToDashboard}
          isOwnProfile={true}
        />
      )}

      {currentScreen === 'notifications' && userData && (userType === 'client' || userType === 'professional') && (
        <ClientNotifications
          onBack={handleBackToDashboard}
          userType={userType}
          onOpenChat={(requestId) => {
            const chat = chats.find(c => Number(c.solicitud_id) === requestId);
            if (chat) {
              void handleChatSelect(chat.id);
            }
          }}
          onOpenRequests={() => setCurrentScreen('professional-dashboard')}
          sentRequests={sentRequests}
          notifications={notifications}
          onMarkRead={handleMarkNotificationRead}
          onReviewRequest={handleSubmitReview}
        />
      )}

      {currentScreen === 'help' && (
        <Help
          onBack={handleBackToDashboard}
        />
      )}

      {currentScreen === 'browse-professionals' && (
        <ProfessionalBrowser
          category={selectedCategory}
          onBack={handleBackFromBrowser}
          onViewProfile={handleViewProfessional}
        />
      )}

      {currentScreen === 'view-professional' && selectedProfessional && (
        <ProfessionalProfile
          userData={{
            ...selectedProfessional,
            // Ensure photo property exists
            photo: selectedProfessional.photo || selectedProfessional.otherPersonPhoto || ''
          }}
          onBack={() => setCurrentScreen('browse-professionals')}
          isOwnProfile={false}
          clientData={userType === 'client' ? userData : undefined}
          selectedCategory={selectedCategory}
          onViewReviews={handleViewReviews}
          sentRequests={userType === 'client' ? sentRequests : []}
          onSendRequest={userType === 'client' ? handleSendRequest : undefined}
        />
      )}

      {currentScreen === 'view-client' && selectedClient && (
        <ClientProfile
          userData={selectedClient}
          onBack={handleBackToDashboard}
          isOwnProfile={false}
          onViewReviews={handleViewClientReviews}
        />
      )}

      {currentScreen === 'request-details' && userData && (
        <RequestDetails
          onBack={handleBackToDashboard}
          professionalData={{
            name: 'María',
            lastName: 'Rodríguez',
            photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop',
            departamento: 'San Salvador',
            categories: ['Limpieza', 'Jardinería'],
            yearsExperience: 5
          }}
          requestData={{
            jobType: 'Limpieza',
            description: 'Limpieza Profunda de Casa - 3 habitaciones, cocina y 2 baños. Productos incluidos.',
            date: '15 de Marzo, 2026',
            budget: '$150'
          }}
          clientData={userData}
        />
      )}

      {currentScreen === 'reviews' && selectedProfessional && (
        <ReviewsScreen
          onBack={() => setCurrentScreen('view-professional')}
          professionalName={`${selectedProfessional.name}${selectedProfessional.lastName ? ' ' + selectedProfessional.lastName : ''}`}
          overallRating={professionalReviews?.promedio || 0}
          totalReviews={professionalReviews?.total || 0}
          ratingDistribution={professionalReviews?.distribucion || { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }}
          reviews={professionalReviews?.resenas || []}
        />
      )}

      {currentScreen === 'client-reviews' && selectedClient && (
        <ClientReviewsScreen
          onBack={() => setCurrentScreen('view-client')}
          clientName={`${selectedClient.name}${selectedClient.lastName ? ' ' + selectedClient.lastName : ''}`}
          overallRating={4.7}
          totalReviews={15}
          ratingDistribution={{
            5: 10,
            4: 3,
            3: 1,
            2: 1,
            1: 0
          }}
          reviews={[
            {
              id: 1,
              professionalName: 'María Rodríguez',
              rating: 5,
              comment: 'Excelente cliente, muy claro con sus necesidades y respetuoso. El pago fue puntual y el ambiente de trabajo muy agradable.',
              date: '22 de Abril, 2026'
            },
            {
              id: 2,
              professionalName: 'Carlos Méndez',
              rating: 5,
              comment: 'Cliente muy organizado y comunicativo. Proporcionó todos los materiales necesarios a tiempo. Altamente recomendado.',
              date: '18 de Abril, 2026'
            },
            {
              id: 3,
              professionalName: 'Roberto Silva',
              rating: 4,
              comment: 'Buen cliente en general. Claro en sus expectativas y flexible con los horarios. Pago completo al finalizar.',
              date: '12 de Abril, 2026'
            }
          ]}
        />
      )}

      {currentScreen === 'active-jobs' && userData && (
        <ActiveJobs
          onBack={handleBackToDashboard}
          activeJobs={activeJobs}
          onMarkCompleted={handleMarkJobCompleted}
          onOpenChat={handleOpenChatFromJob}
        />
      )}

      {currentScreen === 'payment-history' && userData && (
        <PaymentHistory
          onBack={handleBackToDashboard}
          transactions={transactions}
        />
      )}

      {currentScreen === 'payment-methods' && userData && userType === 'client' && (
        <PaymentMethods
          onBack={handleBackToDashboard}
          savedCards={savedCards}
          onAddCard={handleAddCard}
          onDeleteCard={handleDeleteCard}
        />
      )}

      {/* Payment Modals */}
      {showPaymentModal && pendingPayment && (
        <PaymentModal
          isOpen={showPaymentModal}
          onClose={() => {
            setShowPaymentModal(false);
            setPendingPayment(null);
          }}
          onConfirmPayment={handleConfirmPayment}
          clientName={pendingPayment.clientName}
          serviceName={pendingPayment.serviceName}
          estimatedAmount={pendingPayment.amount}
        />
      )}

      {showPaymentSuccess && pendingPayment && (
        <PaymentSuccessAnimation
          isOpen={showPaymentSuccess}
          onClose={() => setShowPaymentSuccess(false)}
          amount={pendingPayment.amount}
          paymentMethod="tarjeta"
        />
      )}

      {/* Chat Components */}
      {showChatBubble && (
        <ChatBubble
          onClick={() => {
            if (showChatList) {
              // If in chat list, go back to dashboard
              setShowChatList(false);
            } else {
              // If in dashboard, open chat list
              setShowChatList(true);
            }
          }}
          hasUnread={hasUnreadChats}
          showHomeIcon={showHomeInBubble}
        />
      )}

      {showChatList && (
        <ChatList
          isOpen={showChatList}
          onClose={() => setShowChatList(false)}
          onBackToMain={() => setShowChatList(false)}
          chats={chats}
          onChatSelect={handleChatSelect}
        />
      )}

      {showChatWindow && selectedChat && (
        <ChatWindow
          isOpen={showChatWindow}
          onClose={() => setShowChatWindow(false)}
          onBack={() => {
            setShowChatWindow(false);
            setShowChatList(true);
          }}
          onBackToMain={() => {
            setShowChatWindow(false);
            setShowChatList(false);
          }}
          chatData={selectedChat}
          currentUserId={userData?.email || ''}
          currentUserData={userData}
          userType={(userType === 'admin' ? 'client' : userType) || 'client'}
          onMarkFinished={handleMarkFinished}
          onSendMessage={handleSendMessage}
          onRate={handleRate}
          onViewProfile={handleViewProfileFromChat}
          savedCards={savedCards}
          onSendInvoice={handleSendInvoice}
          onRespondQuote={handleRespondQuote}
        />
      )}

      {/* Tutorial Overlay */}
      {showTutorial && (userType === 'client' || userType === 'professional') && (
        <TutorialOverlay
          isOpen={showTutorial}
          onClose={handleCloseTutorial}
          userType={userType}
        />
      )}
      {currentScreen === 'professional-register' && userData && (
        <ProfessionalProfileRegistration
          userData={userData}
          onCancel={() => setCurrentScreen('client-dashboard')}
          onSubmitted={(account) => {
            const updatedAccount = { ...account, roleHistory: account.roleHistory || [] };
            const activeUser = userDataForMode(updatedAccount, 'client');
            setUserData(activeUser);
            setRoleHistory(updatedAccount.roleHistory);
            localStorage.setItem('user', JSON.stringify(activeUser));
            setCurrentScreen('client-dashboard');
            triggerToast('Tu perfil profesional fue enviado y estará disponible al ser aprobado');
          }}
        />
      )}
      {currentScreen === 'client-register' && userData && (
        <ClientProfileRegistration
          userData={userData}
          onCancel={() => setCurrentScreen('professional-dashboard')}
          onSubmitted={(account) => {
            const updatedAccount = { ...account, roleHistory: account.roleHistory || [] };
            const activeUser = userDataForMode(updatedAccount, 'client');
            setUserData(activeUser);
            setUserType('client');
            setRoleHistory(updatedAccount.roleHistory);
            localStorage.setItem('user', JSON.stringify(activeUser));
            localStorage.setItem('userType', 'client');
            setCurrentScreen('client-dashboard');
            triggerToast('Tu perfil de cliente se vinculó a la cuenta existente');
          }}
        />
      )}
      {toastMessage && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 bg-gray-900/90 text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-3 transition-all duration-300 backdrop-blur-sm">
          <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
          <span className="text-sm font-medium">{toastMessage}</span>
       </div>
      )}
    </div>
  );

}