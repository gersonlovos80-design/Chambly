import { useState } from 'react';
import { Hammer, Paintbrush, Wrench, Droplets, Zap, TreePine, Package, Sofa, Menu } from 'lucide-react';
import { MenuSidebar } from './MenuSidebar';

interface ClientDashboardProps {
  userName: string;
  userData: any;
  latestActivity: any | null;
  onViewActivity: (request: any) => void;
  onLogout: () => void;
  onNavigate: (section: string) => void;
  onShowTutorial?: () => void;
  onToggleMode?: () => void;
  roleHistory?: {date: string; from: string; to: string}[];
  notificationCount?: number;
}

const jobCategories = [
  { id: 1, name: 'Limpieza', icon: Droplets, color: 'bg-[#E8F0FE] text-[#1D1D1B]' },
  { id: 2, name: 'Construcción', icon: Hammer, color: 'bg-[#FFEFE2] text-[#1D1D1B]' },
  { id: 3, name: 'Pintura', icon: Paintbrush, color: 'bg-[#F3E8FF] text-[#1D1D1B]' },
  { id: 4, name: 'Plomería', icon: Wrench, color: 'bg-[#D7F9FF] text-[#1D1D1B]' },
  { id: 5, name: 'Electricidad', icon: Zap, color: 'bg-[#FFF9C4] text-[#1D1D1B]' },
  { id: 6, name: 'Jardinería', icon: TreePine, color: 'bg-[#E2FBE5] text-[#1D1D1B]' },
  { id: 7, name: 'Mudanza', icon: Package, color: 'bg-[#FFEBEE] text-[#1D1D1B]' },
  { id: 8, name: 'Ensamblaje de Muebles', icon: Sofa, color: 'bg-[#E8EAF6] text-[#1D1D1B]' },
];

export function ClientDashboard({ userName, userData, latestActivity, onViewActivity, onLogout, onNavigate, onShowTutorial, onToggleMode, roleHistory, notificationCount = 0 }: ClientDashboardProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const activityCategory = jobCategories.find(category => category.name === latestActivity?.categoria);
  const ActivityIcon = activityCategory?.icon || Droplets;
  const activityStatus = latestActivity?.estado === 'completada'
    ? 'Servicio completado'
    : latestActivity?.estado === 'aceptada' || latestActivity?.estado === 'en_proceso'
      ? 'Solicitud aceptada'
      : latestActivity?.estado === 'rechazada'
        ? 'Solicitud rechazada'
        : 'Solicitud pendiente';

  return (
    <div className="min-h-screen bg-[#FAF8F5]">
      {/* Header */}
      <header className="bg-[#685AA1] shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl text-white">Chambly</h1>
          <button
            onClick={() => setMenuOpen(true)}
            className="p-2 hover:bg-[#685AA1]/80 rounded-lg transition-colors text-white"
          >
            <Menu size={24} />
          </button>
        </div>
      </header>

      {/* Menu Sidebar */}
      <MenuSidebar
        isOpen={menuOpen}
        onClose={() => setMenuOpen(false)}
        userType="client"
        onNavigate={onNavigate}
        onLogout={onLogout}
        onShowTutorial={onShowTutorial}
        roleHistory={roleHistory}
        onToggleMode={onToggleMode}
        notificationCount={notificationCount}
      />

      <div className="max-w-7xl mx-auto px-4 py-8 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        {/* Welcome Section */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <h2 className="text-3xl mb-2 text-[#1D1D1B]">¡Bienvenido de nuevo, {userName}!</h2>
          <p className="text-gray-600">Encuentra el profesional perfecto para tus necesidades</p>
        </div>

        {/* Last Activity */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <h3 className="text-xl mb-4 text-[#1D1D1B]">Última Actividad</h3>
          {latestActivity ? (
            <div className="flex flex-wrap items-center gap-4 rounded-lg bg-[#D3CFED] p-4">
              <div className={`rounded-full p-3 ${activityCategory?.color || 'bg-white text-[#1D1D1B]'}`}>
                <ActivityIcon size={24} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm text-gray-600">{activityStatus}</p>
                <p className="font-medium text-[#1D1D1B]">
                  {latestActivity.profesional_nombre} {latestActivity.profesional_apellido}
                </p>
                <p className="text-sm text-gray-600">{latestActivity.categoria || 'Servicio'}</p>
                <p className="text-xs text-gray-600">
                  {[latestActivity.municipio, latestActivity.departamento].filter(Boolean).join(', ')}
                </p>
              </div>
              <button
                onClick={() => onViewActivity(latestActivity)}
                className="rounded-lg bg-[#FFC900] px-4 py-2 font-medium text-[#1D1D1B] transition-colors hover:bg-[#e6b500]"
              >
                Ver Detalles
              </button>
            </div>
          ) : (
            <p className="rounded-lg bg-[#FAF8F5] p-4 text-sm text-gray-600">
              Aún no tienes solicitudes de servicio.
            </p>
          )}
        </div>

        {/* Job Categories Gallery */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-xl mb-6 text-[#1D1D1B]">¿En qué necesitas ayuda?</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {jobCategories.map((category) => {
              const Icon = category.icon;
              return (
                <button
                  key={category.id}
                  onClick={() => onNavigate(`browse-${category.name}`)}
                  className="flex flex-col items-center gap-3 p-6 rounded-xl border-2 border-gray-200 hover:border-[#685AA1] hover:shadow-md transition-all"
                >
                  <div className={`p-4 rounded-full ${category.color}`}>
                    <Icon size={32} />
                  </div>
                  <span className="font-medium text-center text-[#1D1D1B]">{category.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
