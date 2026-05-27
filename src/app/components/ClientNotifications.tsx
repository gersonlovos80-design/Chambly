import { ArrowLeft, Check, Clock, X, MessageCircle } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface ClientNotificationsProps {
  onBack: () => void;
  onOpenChat?: (professionalName: string) => void;
  onViewProfessional?: (professional: any) => void;
  sentRequests?: any[];
}

const getCategoryColor = (category: string): string => {
  const colors: { [key: string]: string } = {
    'Limpieza': 'bg-[#E8F0FE] text-[#1D1D1B]',
    'Construcción': 'bg-[#FFEFE2] text-[#1D1D1B]',
    'Pintura': 'bg-[#F3E8FF] text-[#1D1D1B]',
    'Plomería': 'bg-[#D7F9FF] text-[#1D1D1B]',
    'Electricidad': 'bg-[#FFF9C4] text-[#1D1D1B]',
    'Jardinería': 'bg-[#E2FBE5] text-[#1D1D1B]',
    'Mudanza': 'bg-[#FFEBEE] text-[#1D1D1B]',
    'Ensamblaje de Muebles': 'bg-[#E8EAF6] text-[#1D1D1B]'
  };
  return colors[category] || 'bg-[#D3CFED] text-[#685AA1]';
};

const mockNotifications = [
  {
    id: 1,
    type: 'accepted',
    professionalName: 'María Rodríguez',
    professionalPhoto: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop',
    jobType: 'Limpieza',
    message: 'aceptó tu solicitud de Limpieza Profunda de Casa',
    time: 'Hace 1 hora',
    status: 'nueva',
    professionalData: {
      name: 'María',
      lastName: 'Rodríguez',
      photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop',
      departamento: 'San Salvador',
      rating: 4.8,
      reviewCount: 32,
      yearsExperience: 5,
      educationType: 'empirico',
      categories: ['Limpieza', 'Jardinería']
    }
  },
  {
    id: 2,
    type: 'pending',
    professionalName: 'Carlos Méndez',
    professionalPhoto: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop',
    jobType: 'Pintura',
    message: 'aún no ha respondido a tu solicitud de Pintura de 3 habitaciones',
    time: 'Hace 3 horas',
    status: 'leída',
    professionalData: {
      name: 'Carlos',
      lastName: 'Méndez',
      photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop',
      departamento: 'La Libertad',
      rating: 4.5,
      reviewCount: 18,
      yearsExperience: 8,
      educationType: 'titulo',
      categories: ['Construcción', 'Pintura']
    }
  },
  {
    id: 3,
    type: 'declined',
    professionalName: 'Ana López',
    professionalPhoto: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop',
    jobType: 'Plomería',
    message: 'no pudo aceptar tu solicitud debido a disponibilidad',
    time: 'Hace 1 día',
    status: 'leída',
    professionalData: {
      name: 'Ana',
      lastName: 'López',
      photo: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop',
      departamento: 'San Salvador',
      rating: 4.9,
      reviewCount: 45,
      yearsExperience: 3,
      educationType: 'empirico',
      categories: ['Limpieza']
    }
  },
  {
    id: 4,
    type: 'accepted',
    professionalName: 'Roberto Silva',
    professionalPhoto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop',
    jobType: 'Electricidad',
    message: 'aceptó tu solicitud de Instalación de tomacorrientes',
    time: 'Hace 2 días',
    status: 'leída',
    professionalData: {
      name: 'Roberto',
      lastName: 'Silva',
      photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop',
      departamento: 'Santa Ana',
      rating: 4.7,
      reviewCount: 28,
      yearsExperience: 10,
      educationType: 'titulo',
      categories: ['Electricidad', 'Plomería']
    }
  }
];

export function ClientNotifications({ onBack, onOpenChat, onViewProfessional, sentRequests = [] }: ClientNotificationsProps) {
  return (
    <div className="min-h-screen bg-[#FAF8F5]">
      {/* Header */}
      <header className="bg-[#685AA1] shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-white hover:text-white/80 transition-colors"
          >
            <ArrowLeft size={20} />
            <span>Volver</span>
          </button>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-8 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        <h1 className="text-3xl mb-6 text-[#1D1D1B]">Notificaciones</h1>

        {/* Sent Requests Section */}
        {sentRequests.length > 0 && (
          <>
            <h2 className="text-xl font-medium text-[#1D1D1B] mb-4">Solicitudes Enviadas</h2>
            <div className="space-y-4 mb-8">
              {sentRequests.map((request) => (
                <div
                  key={request.id}
                  className="bg-white rounded-xl shadow-sm p-6 border-2 border-blue-200"
                >
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <p className="text-lg">
                        <span className="text-[#1D1D1B]">Enviaste una solicitud a </span>
                        <span className="font-medium">{request.professionalName}</span>
                      </p>
                      <div className="flex items-center gap-3 mt-2">
                        <span className="text-sm text-gray-500">{request.time}</span>
                        <span className={`px-3 py-1 ${getCategoryColor(request.category)} font-medium rounded-full text-sm`}>
                          {request.category}
                        </span>
                        <span className="text-sm text-gray-600">
                          {request.paymentMethod === 'efectivo' ? 'Efectivo' : 'Tarjeta'}
                        </span>
                      </div>
                    </div>
                    <div className="p-2 bg-blue-100 rounded-full h-fit">
                      <Clock size={20} className="text-blue-600" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        <h2 className="text-xl font-medium text-[#1D1D1B] mb-4">Respuestas de Profesionales</h2>
        <div className="space-y-4">
          {mockNotifications.map((notification) => (
            <div
              key={notification.id}
              className={`bg-white rounded-xl shadow-sm p-6 ${
                notification.status === 'nueva' ? 'border-2 border-indigo-200' : ''
              }`}
            >
              <div className="flex gap-4">
                {/* Professional Photo */}
                <ImageWithFallback
                  src={notification.professionalPhoto}
                  alt={notification.professionalName}
                  className="w-16 h-16 rounded-full object-cover flex-shrink-0"
                />

                {/* Notification Content */}
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <p className="text-lg">
                        <span className="font-medium">{notification.professionalName}</span>{' '}
                        <span className="text-[#1D1D1B]">{notification.message}</span>
                      </p>
                      <div className="flex items-center gap-3 mt-2">
                        <span className="text-sm text-gray-500">{notification.time}</span>
                        <span className={`px-3 py-1 ${getCategoryColor(notification.jobType)} font-medium rounded-full text-sm`}>
                          {notification.jobType}
                        </span>
                      </div>
                    </div>

                    {/* Status Icon */}
                    <div>
                      {notification.type === 'accepted' && (
                        <div className="p-2 bg-green-100 rounded-full">
                          <Check size={20} className="text-green-600" />
                        </div>
                      )}
                      {notification.type === 'pending' && (
                        <div className="p-2 bg-yellow-100 rounded-full">
                          <Clock size={20} className="text-yellow-600" />
                        </div>
                      )}
                      {notification.type === 'declined' && (
                        <div className="p-2 bg-red-100 rounded-full">
                          <X size={20} className="text-red-600" />
                        </div>
                      )}
                    </div>
                  </div>

                  {notification.type === 'accepted' && (
                    <div className="mt-3 flex gap-2">
                      <button
                        onClick={() => onViewProfessional && onViewProfessional(notification.professionalData)}
                        className="flex-1 px-4 py-2 bg-[#FFC900] text-[#1D1D1B] font-medium rounded-lg hover:bg-[#e6b500] transition-colors"
                      >
                        Ver Detalles
                      </button>
                      <button
                        onClick={() => onOpenChat && onOpenChat(notification.professionalName)}
                        className="flex items-center gap-2 px-4 py-2 border border-[#685AA1] text-[#685AA1] rounded-lg hover:bg-[#D3CFED] transition-colors"
                      >
                        <MessageCircle size={18} />
                        Chatear
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
