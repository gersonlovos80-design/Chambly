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

type Screen = 'login' | 'register' | 'client-dashboard' | 'professional-dashboard' | 'profile' | 'notifications' | 'help' | 'browse-professionals' | 'view-professional' | 'view-client' | 'request-details' | 'reviews' | 'client-reviews' | 'active-jobs' | 'payment-history' | 'payment-methods';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('login');
  const [userData, setUserData] = useState<any>(null);
  const [userType, setUserType] = useState<'client' | 'professional' | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedProfessional, setSelectedProfessional] = useState<any>(null);
  const [selectedClient, setSelectedClient] = useState<any>(null);
  const [lastActivityData, setLastActivityData] = useState<any>(null);

  // Check for expired invoices periodically
  useEffect(() => {
    const checkExpiredInvoices = () => {
      const now = new Date();

      // Update expired transactions
      setTransactions(prev => {
        let hasChanges = false;
        const updated = prev.map(trans => {
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

  // Chat state
  const [showChatList, setShowChatList] = useState(false);
  const [showChatWindow, setShowChatWindow] = useState(false);
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [acceptedRequestIds, setAcceptedRequestIds] = useState<number[]>([]);
  const [rejectedRequestIds, setRejectedRequestIds] = useState<number[]>([]);
  const [activeJobs, setActiveJobs] = useState<any[]>([]);

  // Client request tracking
  const [sentRequests, setSentRequests] = useState<any[]>([]);

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
  const [chats, setChats] = useState<any[]>([
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
  ]);

  const handleLogin = (type: 'client' | 'professional', data: any) => {
    setUserData(data);
    setUserType(type);
    setCurrentScreen(type === 'client' ? 'client-dashboard' : 'professional-dashboard');

    // Show tutorial if user hasn't seen it
    if (!hasSeenTutorial) {
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

  const handleLogout = () => {
    setUserData(null);
    setUserType(null);
    setCurrentScreen('login');
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

  const handleViewReviews = () => {
    setCurrentScreen('reviews');
  };

  const handleViewClientReviews = () => {
    setCurrentScreen('client-reviews');
  };

  const handleSendRequest = (professionalId: string, professionalName: string, category: string, paymentMethod: 'efectivo' | 'tarjeta') => {
    const newRequest = {
      id: `request-${Date.now()}`,
      professionalId: String(professionalId),
      professionalName: professionalName,
      category: category,
      paymentMethod: paymentMethod,
      date: new Date().toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' }),
      time: 'Hace unos momentos',
      status: 'enviada'
    };

    setSentRequests(prev => [newRequest, ...prev]);
  };

  const handleAcceptRequest = (requestId: number, clientName: string, jobType: string, clientPhoto: string, scheduledDate: string, description: string, requestedPaymentMethod?: 'efectivo' | 'tarjeta') => {
    // Mark request as accepted
    setAcceptedRequestIds(prev => [...prev, requestId]);

    const chatId = `chat-${Date.now()}`;

    // Create a new chat when request is accepted
    const newChat = {
      id: chatId,
      otherPersonName: clientName,
      otherPersonPhoto: clientPhoto,
      lastMessage: 'Solicitud aceptada. ¡Ahora pueden conversar!',
      lastMessageTime: 'Ahora',
      unread: true,
      isActive: true,
      jobType: jobType,
      clientRated: false,
      professionalRated: false,
      requestedPaymentMethod: requestedPaymentMethod,
      messages: [
        {
          id: '1',
          senderId: 'system',
          text: '¡Solicitud aceptada! Ahora pueden coordinar los detalles del trabajo.',
          timestamp: 'Ahora',
          isMine: false,
          type: 'text' as const
        }
      ]
    };

    setChats(prev => [newChat, ...prev]);

    // Create active job
    const newActiveJob = {
      id: `job-${Date.now()}`,
      chatId: chatId,
      clientName: clientName,
      clientPhoto: clientPhoto,
      jobType: jobType,
      scheduledDate: scheduledDate,
      description: description,
      isCompleted: false
    };

    setActiveJobs(prev => [newActiveJob, ...prev]);
    alert('Solicitud aceptada. Ahora puedes chatear con el cliente y gestionar el trabajo desde "Trabajos Activos".');
  };

  const handleRejectRequest = (requestId: number) => {
    setRejectedRequestIds(prev => [...prev, requestId]);
  };

  const handleMarkJobCompleted = (jobId: string, rating: number) => {
    // Find the job to set up payment
    const job = activeJobs.find(j => j.id === jobId);
    if (job) {
      // Set pending payment data
      setPendingPayment({
        jobId: jobId,
        clientName: job.clientName,
        serviceName: job.jobType,
        amount: 0 // Will be entered in payment modal
      });

      // Store the rating temporarily
      setActiveJobs(prev => prev.map(j =>
        j.id === jobId ? { ...j, pendingRating: rating } : j
      ));

      // Show payment modal
      setShowPaymentModal(true);
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

  const handleChatSelect = (chatId: string) => {
    setSelectedChatId(chatId);
    setShowChatList(false);
    setShowChatWindow(true);

    // Mark chat as read
    setChats(prev => prev.map(chat =>
      chat.id === chatId ? { ...chat, unread: false } : chat
    ));
  };

  const handleMarkFinished = (rating: number) => {
    if (selectedChatId) {
      // Update chat status
      setChats(prev => prev.map(chat =>
        chat.id === selectedChatId ? {
          ...chat,
          isActive: false,
          professionalRated: true,
          professionalRating: rating
        } : chat
      ));

      // Mark the corresponding job as completed
      setActiveJobs(prev => prev.map(job =>
        job.chatId === selectedChatId ? { ...job, isCompleted: true } : job
      ));

      // Close chat window
      setShowChatWindow(false);
      setSelectedChatId(null);

      alert(`Trabajo marcado como finalizado. Calificaste al cliente con ${rating} estrellas.`);
    }
  };

  const handleRate = (chatId: string, rating: number) => {
    setChats(prev => prev.map(chat =>
      chat.id === chatId ? {
        ...chat,
        clientRated: true,
        clientRating: rating
      } : chat
    ));
    alert(`Has calificado el servicio con ${rating} estrellas. ¡Gracias por tu opinión!`);
  };

  const handleSendMessage = (chatId: string, message: string) => {
    // Add user's message
    const newUserMessage = {
      id: `msg-${Date.now()}`,
      senderId: 'me',
      text: message,
      timestamp: new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
      isMine: true,
      type: 'text' as const
    };

    setChats(prev => prev.map(chat => {
      if (chat.id === chatId) {
        return {
          ...chat,
          messages: [...chat.messages, newUserMessage],
          lastMessage: message,
          lastMessageTime: 'Ahora'
        };
      }
      return chat;
    }));

    // Auto-reply with "Gracias por contactarme!" after a short delay
    setTimeout(() => {
      const autoReply = {
        id: `msg-${Date.now()}-reply`,
        senderId: 'other',
        text: '¡Gracias por contactarme!',
        timestamp: new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
        isMine: false,
        type: 'text' as const
      };

      setChats(prev => prev.map(chat => {
        if (chat.id === chatId) {
          return {
            ...chat,
            messages: [...chat.messages, autoReply],
            lastMessage: '¡Gracias por contactarme!',
            lastMessageTime: 'Ahora',
            unread: true
          };
        }
        return chat;
      }));
    }, 1000);
  };

  const handleSendInvoice = (chatId: string, items: any[], total: number, expirationDate: string, paymentMethod: 'efectivo' | 'tarjeta') => {
    const invoiceId = `invoice-${Date.now()}`;
    const invoiceMessage = {
      id: `msg-${Date.now()}`,
      senderId: 'me',
      timestamp: new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
      isMine: true,
      type: 'invoice' as const,
      invoiceData: {
        items,
        total,
        isPaid: false,
        invoiceId,
        expirationDate,
        paymentMethod
      }
    };

    // Find the chat to get client info
    const chat = chats.find(c => c.id === chatId);
    if (!chat) return;

    // Create transaction in payment history
    const newTransaction = {
      id: `trans-${Date.now()}`,
      serviceId: chatId,
      clientId: chatId,
      clientName: chat.otherPersonName,
      clientPhoto: chat.otherPersonPhoto,
      professionalId: userData?.email || '',
      serviceName: chat.jobType,
      amount: total,
      paymentMethod: paymentMethod,
      paymentStatus: 'pendiente',
      date: new Date().toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' }),
      description: `Factura #${invoiceId.slice(-6)}`,
      expirationDate: expirationDate,
      invoiceId: invoiceId
    };

    setTransactions(prev => [newTransaction, ...prev]);

    setChats(prev => prev.map(chat => {
      if (chat.id === chatId) {
        return {
          ...chat,
          messages: [...chat.messages, invoiceMessage],
          lastMessage: `Factura enviada: $${total.toFixed(2)}`,
          lastMessageTime: 'Ahora'
        };
      }
      return chat;
    }));

    alert('Factura enviada al cliente exitosamente. Se agregó al historial de pagos como pendiente.');
  };

  const handlePayInvoice = (chatId: string, invoiceId: string, cardId: string) => {
    // Mark invoice as paid
    setChats(prev => prev.map(chat => {
      if (chat.id === chatId) {
        return {
          ...chat,
          messages: chat.messages.map(msg => {
            if (msg.type === 'invoice' && msg.invoiceData?.invoiceId === invoiceId) {
              return {
                ...msg,
                invoiceData: {
                  ...msg.invoiceData,
                  isPaid: true
                }
              };
            }
            return msg;
          })
        };
      }
      return chat;
    }));

    // Update transaction to completed
    setTransactions(prev => prev.map(trans => {
      if (trans.invoiceId === invoiceId) {
        return {
          ...trans,
          paymentStatus: 'completado',
          date: new Date().toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })
        };
      }
      return trans;
    }));

    // Find the invoice to get the total
    const chat = chats.find(c => c.id === chatId);
    const invoice = chat?.messages.find(m => m.type === 'invoice' && m.invoiceData?.invoiceId === invoiceId);

    if (invoice?.invoiceData) {
      alert(`Pago de $${invoice.invoiceData.total.toFixed(2)} procesado exitosamente con tarjeta`);
    }
  };

  const handleMarkInvoiceAsPaid = (chatId: string, invoiceId: string) => {
    // Mark invoice as paid
    setChats(prev => prev.map(chat => {
      if (chat.id === chatId) {
        return {
          ...chat,
          messages: chat.messages.map(msg => {
            if (msg.type === 'invoice' && msg.invoiceData?.invoiceId === invoiceId) {
              return {
                ...msg,
                invoiceData: {
                  ...msg.invoiceData,
                  isPaid: true
                }
              };
            }
            return msg;
          })
        };
      }
      return chat;
    }));

    // Update transaction to completed
    setTransactions(prev => prev.map(trans => {
      if (trans.invoiceId === invoiceId) {
        return {
          ...trans,
          paymentStatus: 'completado',
          date: new Date().toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })
        };
      }
      return trans;
    }));

    // Find chat to notify client
    const chat = chats.find(c => c.id === chatId);
    const invoice = chat?.messages.find(m => m.type === 'invoice' && m.invoiceData?.invoiceId === invoiceId);

    if (invoice?.invoiceData) {
      alert(`Pago en efectivo de $${invoice.invoiceData.total.toFixed(2)} marcado como recibido. El cliente recibirá una notificación.`);

      // Add notification message to client
      const notificationMessage = {
        id: `msg-${Date.now()}`,
        senderId: 'system',
        text: `✓ Tu pago en efectivo de $${invoice.invoiceData.total.toFixed(2)} ha sido recibido con éxito`,
        timestamp: new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
        isMine: false,
        type: 'text' as const
      };

      setChats(prev => prev.map(chat => {
        if (chat.id === chatId) {
          return {
            ...chat,
            messages: [...chat.messages, notificationMessage],
            lastMessage: notificationMessage.text,
            lastMessageTime: 'Ahora'
          };
        }
        return chat;
      }));
    }
  };

  const hasUnreadChats = chats.some(chat => chat.unread);
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
          acceptedRequestIds={acceptedRequestIds}
          rejectedRequestIds={rejectedRequestIds}
          onShowTutorial={handleShowTutorial}
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

      {currentScreen === 'notifications' && userData && userType === 'client' && (
        <ClientNotifications
          onBack={handleBackToDashboard}
          onOpenChat={(professionalName) => {
            // Find the chat with this professional
            const chat = chats.find(c => c.otherPersonName === professionalName && c.isActive);
            if (chat) {
              handleChatSelect(chat.id);
              setCurrentScreen('client-dashboard');
            }
          }}
          onViewProfessional={handleViewProfessional}
          sentRequests={sentRequests}
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
          savedCards={userType === 'client' ? savedCards : []}
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
          overallRating={selectedProfessional.rating || 4.5}
          totalReviews={selectedProfessional.reviewCount || 24}
          ratingDistribution={{
            5: 18,
            4: 4,
            3: 1,
            2: 1,
            1: 0
          }}
          reviews={[
            {
              id: 1,
              userName: 'Juan Pérez',
              rating: 5,
              comment: 'Excelente servicio, muy profesional y puntual. Dejó mi casa impecable. Totalmente recomendado.',
              date: '20 de Abril, 2026'
            },
            {
              id: 2,
              userName: 'Ana García',
              rating: 5,
              comment: 'Muy contenta con el trabajo realizado. Atención al detalle y muy amable. Definitivamente volveré a contratar sus servicios.',
              date: '15 de Abril, 2026'
            },
            {
              id: 3,
              userName: 'Roberto Silva',
              rating: 4,
              comment: 'Buen trabajo en general. Llegó a tiempo y fue muy profesional. Solo algunos detalles menores que mejorar.',
              date: '10 de Abril, 2026'
            }
          ]}
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
          userType={userType || 'client'}
          onMarkFinished={handleMarkFinished}
          onSendMessage={handleSendMessage}
          onRate={handleRate}
          onViewProfile={handleViewProfileFromChat}
          savedCards={savedCards}
          onSendInvoice={handleSendInvoice}
          onPayInvoice={handlePayInvoice}
          onMarkInvoiceAsPaid={handleMarkInvoiceAsPaid}
          requestedPaymentMethod={selectedChat.requestedPaymentMethod}
        />
      )}

      {/* Tutorial Overlay */}
      {showTutorial && userType && (
        <TutorialOverlay
          isOpen={showTutorial}
          onClose={handleCloseTutorial}
          userType={userType}
        />
      )}
    </div>
  );
}