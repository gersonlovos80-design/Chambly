import { X, User, Bell, LogOut, HelpCircle, Briefcase, DollarSign, BookOpen, CreditCard } from 'lucide-react';

interface MenuSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  userType: 'client' | 'professional';
  onNavigate: (section: 'profile' | 'notifications' | 'help' | 'active-jobs' | 'payment-history' | 'payment-methods') => void;
  onLogout: () => void;
  onShowTutorial?: () => void;
}

export function MenuSidebar({ isOpen, onClose, userType, onNavigate, onLogout, onShowTutorial }: MenuSidebarProps) {
  if (!isOpen) return null;

  const handleNavigate = (section: 'profile' | 'notifications' | 'help' | 'active-jobs' | 'payment-history' | 'payment-methods') => {
    onNavigate(section);
    onClose();
  };

  const handleShowTutorial = () => {
    if (onShowTutorial) {
      onShowTutorial();
    }
    onClose();
  };

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={onClose}
      />

      {/* Sidebar */}
      <div className="fixed top-0 right-0 h-full w-80 bg-white shadow-2xl z-50 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-medium">Menú</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            <li>
              <button
                onClick={() => handleNavigate('profile')}
                className="w-full flex items-center gap-3 p-4 rounded-lg hover:bg-gray-100 transition-colors text-left"
              >
                <User size={20} className="text-gray-600" />
                <span>Mi Perfil</span>
              </button>
            </li>

            {userType === 'professional' && (
              <>
                <li>
                  <button
                    onClick={() => handleNavigate('active-jobs')}
                    className="w-full flex items-center gap-3 p-4 rounded-lg hover:bg-gray-100 transition-colors text-left"
                  >
                    <Briefcase size={20} className="text-gray-600" />
                    <span>Trabajos Activos</span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleNavigate('payment-history')}
                    className="w-full flex items-center gap-3 p-4 rounded-lg hover:bg-gray-100 transition-colors text-left"
                  >
                    <DollarSign size={20} className="text-gray-600" />
                    <span>Historial de Pagos</span>
                  </button>
                </li>
              </>
            )}

            {userType === 'client' && (
              <>
                <li>
                  <button
                    onClick={() => handleNavigate('notifications')}
                    className="w-full flex items-center gap-3 p-4 rounded-lg hover:bg-gray-100 transition-colors text-left"
                  >
                    <Bell size={20} className="text-gray-600" />
                    <span>Notificaciones</span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleNavigate('payment-methods')}
                    className="w-full flex items-center gap-3 p-4 rounded-lg hover:bg-gray-100 transition-colors text-left"
                  >
                    <CreditCard size={20} className="text-gray-600" />
                    <span>Métodos de Pago</span>
                  </button>
                </li>
              </>
            )}

            <li>
              <button
                onClick={handleShowTutorial}
                className="w-full flex items-center gap-3 p-4 rounded-lg hover:bg-gray-100 transition-colors text-left"
              >
                <BookOpen size={20} className="text-gray-600" />
                <span>Ver Tutorial</span>
              </button>
            </li>

            <li>
              <button
                onClick={() => handleNavigate('help')}
                className="w-full flex items-center gap-3 p-4 rounded-lg hover:bg-gray-100 transition-colors text-left"
              >
                <HelpCircle size={20} className="text-gray-600" />
                <span>Ayuda</span>
              </button>
            </li>

            <li className="pt-4 border-t mt-4">
              <button
                onClick={onLogout}
                className="w-full flex items-center gap-3 p-4 rounded-lg hover:bg-red-50 text-red-600 transition-colors text-left"
              >
                <LogOut size={20} />
                <span>Cerrar Sesión</span>
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </>
  );
}
