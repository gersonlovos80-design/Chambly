import { useState } from 'react';
import { MapPin, Clock, Menu, Filter, Calendar, X, Banknote, CreditCard } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { MenuSidebar } from './MenuSidebar';

interface ProfessionalDashboardProps {
  userName: string;
  userData: any;
  userCategories: string[];
  onLogout: () => void;
  onNavigate: (section: string) => void;
  onViewClient?: (clientData: any) => void;
  onAcceptRequest?: (requestId: number, clientName: string, jobType: string, clientPhoto: string, scheduledDate: string, description: string, paymentMethod?: 'efectivo' | 'tarjeta') => void;
  onRejectRequest?: (requestId: number) => void;
  serviceRequests?: any[];
  acceptedRequestIds?: number[];
  rejectedRequestIds?: number[];
  onShowTutorial?: () => void;
  onToggleMode?: () => void;
  roleHistory?: {date: string; from: string; to: string}[];
  notificationCount?: number;
}

const departamentos = [
  'Ahuachapán', 'Santa Ana', 'Sonsonate', 'Chalatenango', 'La Libertad',
  'San Salvador', 'Cuscatlán', 'La Paz', 'Cabañas', 'San Vicente',
  'Usulután', 'San Miguel', 'Morazán', 'La Unión'
];

const allRequests = [
  {
    id: 1,
    clientName: 'Sara Martínez',
    clientPhoto: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop',
    jobType: 'Limpieza',
    description: 'Necesito limpieza profunda para casa de 3 habitaciones. Cocina, baños y áreas comunes. Productos amigables con mascotas preferiblemente.',
    departamento: 'San Salvador',
    time: 'Hace 2 horas',
    budget: '$150',
    scheduledDate: '2026-05-02',
    scheduledDateDisplay: '2 de Mayo, 2026',
    paymentMethod: 'tarjeta' as const
  },
  {
    id: 2,
    clientName: 'Miguel Chávez',
    clientPhoto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop',
    jobType: 'Construcción',
    description: 'Busco ayuda con instalación de azulejos en baño. Aproximadamente 50 pies cuadrados. Materiales ya comprados.',
    departamento: 'La Libertad',
    time: 'Hace 5 horas',
    budget: '$800',
    scheduledDate: '2026-05-10',
    scheduledDateDisplay: '10 de Mayo, 2026',
    paymentMethod: 'efectivo' as const
  },
  {
    id: 3,
    clientName: 'Ana López',
    clientPhoto: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop',
    jobType: 'Limpieza',
    description: 'Limpieza semanal de oficina necesaria. Espacio pequeño, 5 escritorios, 1 baño, área de cocina. Preferencia horario temprano.',
    departamento: 'San Salvador',
    time: 'Hace 1 día',
    budget: '$100/semana',
    scheduledDate: '2026-05-05',
    scheduledDateDisplay: '5 de Mayo, 2026',
    paymentMethod: 'tarjeta' as const
  },
  {
    id: 4,
    clientName: 'Carlos Rivera',
    clientPhoto: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop',
    jobType: 'Pintura',
    description: 'Necesito pintar 3 habitaciones de la casa. Paredes limpias y preparadas. Colores ya seleccionados.',
    departamento: 'Santa Ana',
    time: 'Hace 2 días',
    budget: '$600',
    scheduledDate: '2026-05-15',
    scheduledDateDisplay: '15 de Mayo, 2026',
    paymentMethod: 'efectivo' as const
  },
  {
    id: 5,
    clientName: 'Patricia Flores',
    clientPhoto: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=200&h=200&fit=crop',
    jobType: 'Plomería',
    description: 'Reparación de fuga en tubería de cocina. Urgente. Disponibilidad inmediata preferida.',
    departamento: 'San Salvador',
    time: 'Hace 3 horas',
    budget: '$200',
    scheduledDate: '2026-04-30',
    scheduledDateDisplay: '30 de Abril, 2026',
    paymentMethod: 'tarjeta' as const
  },
  {
    id: 6,
    clientName: 'Roberto Méndez',
    clientPhoto: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop',
    jobType: 'Electricidad',
    description: 'Instalación de nuevos tomacorrientes y cambio de interruptores en toda la casa. 8 puntos en total.',
    departamento: 'La Libertad',
    time: 'Hace 6 horas',
    budget: '$350',
    scheduledDate: '2026-05-03',
    scheduledDateDisplay: '3 de Mayo, 2026',
    paymentMethod: 'efectivo' as const
  }
];

export function ProfessionalDashboard({ userName, userData, userCategories, onLogout, onNavigate, onViewClient, onAcceptRequest, onRejectRequest, serviceRequests = [], onShowTutorial, onToggleMode, roleHistory, notificationCount = 0 }: ProfessionalDashboardProps) {
  const [selectedDepartamento, setSelectedDepartamento] = useState<string>('');
  const [selectedMunicipio, setSelectedMunicipio] = useState<string>('');
  const [menuOpen, setMenuOpen] = useState(false);

  const handleViewClient = (request: any) => {
    const mockClientData = {
      name: request.clientName.split(' ')[0],
      lastName: request.clientName.split(' ')[1] || '',
      departamento: request.departamento,
      photo: request.clientPhoto || '',
      id: request.cliente_id
    };
    if (onViewClient) {
      onViewClient(mockClientData);
    }
  };

  const handleAcceptRequest = (request: any) => {
    if (onAcceptRequest) {
      onAcceptRequest(Number(request.id), request.clientName, request.jobType, request.clientPhoto, request.scheduledDateDisplay, request.description, request.paymentMethod);
    }
  };

  const handleRejectRequest = (requestId: number) => {
    if (onRejectRequest) {
      onRejectRequest(requestId);
    }
  };

  const availableRequests = serviceRequests
    .filter(request => request.estado === 'pendiente')
    .map((request: any) => ({
      ...request,
      id: Number(request.id),
      clientName: `${request.cliente_nombre || ''} ${request.cliente_apellido || ''}`.trim() || 'Cliente',
      clientPhoto: request.foto_cliente || '',
      jobType: request.categoria || 'Servicio',
      budget: request.presupuesto ? `$${request.presupuesto}` : 'Presupuesto no indicado',
      time: request.fecha_solicitud,
      scheduledDateDisplay: [request.fecha_servicio, request.hora_servicio].filter(Boolean).join(' · ') || 'Fecha por coordinar',
      paymentMethod: String(request.metodo_pago || '').toLowerCase()
    }))
    .filter(request => userCategories.includes(request.jobType));

  // Apply departamento filter
  const departamentoFiltered = availableRequests.filter(request =>
    (!selectedDepartamento || request.departamento === selectedDepartamento) &&
    (!selectedMunicipio || request.municipio === selectedMunicipio)
  );

  // Sort by scheduled date (closest first)
  const filteredRequests = [...departamentoFiltered].sort((a, b) => {
    return new Date(a.fecha_servicio || a.fecha_solicitud).getTime() - new Date(b.fecha_servicio || b.fecha_solicitud).getTime();
  });
  const municipalities = [...new Set(availableRequests
    .filter(request => !selectedDepartamento || request.departamento === selectedDepartamento)
    .map(request => request.municipio)
    .filter(Boolean))].sort();

  return (
    <div className="min-h-screen bg-[#EAE6F5]">
      {/* Header */}
      <header className="bg-[#403460] shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl text-white">Chambly</h1>
          <button
            onClick={() => setMenuOpen(true)}
            className="p-2 hover:bg-white/15 rounded-lg transition-colors text-white"
          >
            <Menu size={24} />
          </button>
        </div>
      </header>

      {/* Menu Sidebar */}
      <MenuSidebar
        isOpen={menuOpen}
        onClose={() => setMenuOpen(false)}
        userType="professional"
        onNavigate={onNavigate}
        onLogout={onLogout}
        onShowTutorial={onShowTutorial}
        roleHistory={roleHistory}
        onToggleMode={onToggleMode}
        notificationCount={notificationCount}
      />

      <div className="max-w-7xl mx-auto px-4 py-8 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-[#403460] via-[#51437F] to-[#685AA1] border border-[#685AA1] rounded-xl shadow-lg p-6 mb-8 text-white">
          <p className="text-sm font-semibold uppercase tracking-wider text-[#E6DFFF]">Espacio profesional</p>
          <h2 className="text-3xl mb-2 mt-1">¡Bienvenido, {userName}!</h2>
          <p className="text-white/90">Tienes {filteredRequests.length} solicitudes nuevas de trabajo</p>
          <div className="mt-3 flex flex-wrap gap-2">
            <span className="text-sm text-white/90 self-center">Tus categorías:</span>
            {userCategories.map(cat => (
              <span key={cat} className="px-3 py-1 bg-white/15 border border-white/30 text-white rounded-full text-sm font-medium">
                {cat}
              </span>
            ))}
          </div>
        </div>

        {/* Filter Section */}
        <div className="bg-[#F8F6FC] border border-[#C8C0DF] rounded-xl shadow-sm p-6 mb-6">
          <div className="flex items-center gap-4">
            <Filter size={20} className="text-[#51437F]" />
            <div className="grid flex-1 gap-4 md:grid-cols-2">
              <div>
                <label className="block text-sm mb-2 text-[#51437F]">Filtrar por Departamento</label>
                <select
                  value={selectedDepartamento}
                  onChange={(e) => {
                    setSelectedDepartamento(e.target.value);
                    setSelectedMunicipio('');
                  }}
                  className="w-full px-4 py-2 border border-[#C8C0DF] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#685AA1] bg-white"
                >
                  <option value="">Todos los Departamentos</option>
                  {departamentos.map(dept => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm mb-2 text-[#51437F]">Filtrar por Municipio o zona</label>
                <select
                  value={selectedMunicipio}
                  onChange={(e) => setSelectedMunicipio(e.target.value)}
                  className="w-full px-4 py-2 border border-[#C8C0DF] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#685AA1] bg-white"
                >
                  <option value="">Todos los municipios</option>
                  {municipalities.map(municipality => (
                    <option key={municipality} value={municipality}>{municipality}</option>
                  ))}
                </select>
              </div>
            </div>
            {(selectedDepartamento || selectedMunicipio) && (
              <button
                onClick={() => {
                  setSelectedDepartamento('');
                  setSelectedMunicipio('');
                }}
                className="px-4 py-2 text-sm text-[#51437F] hover:text-[#685AA1]"
              >
                Limpiar Filtro
              </button>
            )}
          </div>
        </div>

        {/* Job Requests */}
        {filteredRequests.length === 0 ? (
          <div className="bg-[#F8F6FC] border border-[#C8C0DF] rounded-xl shadow-sm p-12 text-center">
            <p className="text-gray-600 text-lg mb-2">No hay solicitudes disponibles</p>
            <p className="text-gray-500 text-sm">
              {selectedDepartamento || selectedMunicipio
                ? `No hay solicitudes en la zona seleccionada para tus categorías`
                : 'No hay solicitudes que coincidan con tus categorías de trabajo'
              }
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredRequests.map((request) => (
              <div key={request.id} className="bg-[#F8F6FC] border border-[#C8C0DF] border-l-8 border-l-[#685AA1] rounded-xl shadow-sm p-6 hover:shadow-lg hover:border-l-[#403460] transition-shadow">
                <div className="flex gap-4">
                  {/* Client Photo */}
                  <ImageWithFallback
                    src={request.clientPhoto}
                    alt={request.clientName}
                    className="w-16 h-16 rounded-full object-cover flex-shrink-0"
                  />

                  {/* Request Details */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="text-xl font-medium text-[#1D1D1B]">{request.clientName}</h3>
                        <p className="text-[#51437F] font-medium">{request.jobType}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-medium text-green-600">{request.budget}</p>
                        <div className="flex items-center gap-1 text-sm text-gray-500 mt-1">
                          <Clock size={14} />
                          <span>{request.time}</span>
                        </div>
                      </div>
                    </div>

                    <p className="text-gray-700 mb-3">{request.description}</p>

                    <div className="flex items-center gap-4 text-gray-600 mb-4">
                      <div className="flex items-center gap-2">
                        <MapPin size={16} />
                        <span className="text-sm">{request.departamento}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar size={16} />
                        <span className="text-sm font-medium">{request.scheduledDateDisplay}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {request.paymentMethod === 'efectivo' ? (
                          <Banknote size={16} className="text-green-600" />
                        ) : (
                          <CreditCard size={16} className="text-blue-600" />
                        )}
                        <span className="text-sm capitalize font-medium">
                          {request.paymentMethod === 'efectivo' ? 'Efectivo' : 'Tarjeta'}
                        </span>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <button
                        onClick={() => handleAcceptRequest(request)}
                        className="flex-1 px-6 py-2 bg-[#685AA1] text-white font-medium rounded-lg hover:bg-[#51437F] transition-colors"
                      >
                        Aceptar
                      </button>
                      <button
                        onClick={() => handleRejectRequest(request.id)}
                        className="flex-1 px-6 py-2 border-2 border-gray-400 text-gray-700 font-medium rounded-lg hover:bg-gray-100 transition-colors flex items-center justify-center gap-2"
                      >
                        <X size={18} />
                        Rechazar
                      </button>
                      <button
                        onClick={() => handleViewClient(request)}
                        className="px-6 py-2 border border-[#C8C0DF] rounded-lg hover:bg-[#EAE6F5] transition-colors text-[#51437F]"
                      >
                        Ver Cliente
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
