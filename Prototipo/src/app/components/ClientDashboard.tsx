import { useState } from 'react';
import { Hammer, Paintbrush, Wrench, Droplets, Zap, TreePine, Package, Sofa, Menu } from 'lucide-react';
import { MenuSidebar } from './MenuSidebar';

interface ClientDashboardProps {
  userName: string;
  userData: any;
  onLogout: () => void;
  onNavigate: (section: string) => void;
  onShowTutorial?: () => void;
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

export function ClientDashboard({ userName, userData, onLogout, onNavigate, onShowTutorial }: ClientDashboardProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  const lastActivity = {
    professionalName: 'María Rodríguez',
    jobType: 'Limpieza',
    category: 'Limpieza Profunda de Casa',
    icon: Droplets,
    professionalData: {
      name: 'María',
      lastName: 'Rodríguez',
      photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop',
      departamento: 'San Salvador',
      categories: ['Limpieza', 'Jardinería'],
      yearsExperience: 5
    },
    requestData: {
      jobType: 'Limpieza',
      description: 'Limpieza Profunda de Casa - 3 habitaciones, cocina y 2 baños. Productos incluidos.',
      date: '15 de Marzo, 2026',
      budget: '$150'
    }
  };

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
          <div className="flex items-center gap-4 p-4 bg-[#D3CFED] rounded-lg">
            <div className={`p-3 rounded-full ${jobCategories.find(c => c.name === lastActivity.jobType)?.color}`}>
              <lastActivity.icon size={24} />
            </div>
            <div className="flex-1">
              <p className="text-sm text-gray-600">Solicitaste a</p>
              <p className="font-medium text-[#1D1D1B]">{lastActivity.professionalName}</p>
              <p className="text-sm text-gray-600">{lastActivity.category}</p>
            </div>
            <button
              onClick={() => onNavigate('request-details')}
              className="px-4 py-2 bg-[#FFC900] text-[#1D1D1B] font-medium rounded-lg hover:bg-[#e6b500] transition-colors"
            >
              Ver Detalles
            </button>
          </div>
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
