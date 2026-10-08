import { useState } from 'react';
import { X, User, Bell, LogOut, HelpCircle, Briefcase, DollarSign, BookOpen, CreditCard, History, ChevronDown, ChevronUp } from 'lucide-react';

interface MenuSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  userType: 'client' | 'professional';
  onNavigate: (section: 'profile' | 'notifications' | 'help' | 'active-jobs' | 'payment-history' | 'payment-methods') => void;
  onLogout: () => void;
  onShowTutorial?: () => void;
  onToggleMode?: () => void;
  roleHistory?: { date: string; from: string; to: string }[];
  notificationCount?: number;
}

export function MenuSidebar({ isOpen, onClose, userType, onNavigate, onLogout, onShowTutorial, onToggleMode, roleHistory = [], notificationCount = 0 }: MenuSidebarProps) {
  const [showHistory, setShowHistory] = useState(false);

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

  const handleToggleMode = () => {
    if (onToggleMode) {
      onToggleMode();
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
        <nav className="flex-1 p-4 overflow-y-auto">
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
                    onClick={() => handleNavigate('notifications')}
                    className="w-full flex items-center gap-3 p-4 rounded-lg hover:bg-gray-100 transition-colors text-left"
                  >
                    <span className="relative">
                      <Bell size={20} className="text-gray-600" />
                      {notificationCount > 0 && (
                        <span className="absolute -right-2 -top-2 min-w-4 rounded-full bg-red-600 px-1 text-center text-[10px] leading-4 text-white">
                          {notificationCount > 99 ? '99+' : notificationCount}
                        </span>
                      )}
                    </span>
                    <span>Notificaciones</span>
                  </button>
                </li>
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
                    <span className="relative">
                      <Bell size={20} className="text-gray-600" />
                      {notificationCount > 0 && (
                        <span className="absolute -right-2 -top-2 min-w-4 rounded-full bg-red-600 px-1 text-center text-[10px] leading-4 text-white">
                          {notificationCount > 99 ? '99+' : notificationCount}
                        </span>
                      )}
                    </span>
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

            {/* Botón de cambio de modo */}
            <li>
              <button
                onClick={handleToggleMode}
                className="w-full flex items-center gap-3 p-4 rounded-lg hover:bg-blue-50 text-blue-600 font-medium transition"
              >
                <Briefcase size={20} className="text-blue-600" />
                <span>{userType === 'client' ? 'Cambiar a Modo Profesional' : 'Cambiar a Modo Cliente'}</span>
              </button>
            </li>

            {/* Historial desplegable de roles */}
            <li className="pt-2 border-t border-gray-100 mt-2">
                <button
                  type="button"
                  onClick={() => setShowHistory(!showHistory)}
                  className="w-full flex items-center justify-between p-3 rounded-lg text-gray-600 hover:bg-gray-100 text-sm font-medium transition"
                >
                  <div className="flex items-center gap-3">
                    <History size={18} className="text-gray-500" />
                    <span>Historial de Roles</span>
                  </div>
                  {showHistory ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>

                {showHistory && (
                  <div className="mt-2 pl-3 pr-1 space-y-2 max-h-36 overflow-y-auto">
                    {roleHistory.length === 0 ? (
                      <p className="rounded border border-gray-100 bg-gray-50 p-3 text-xs text-gray-500">
                        Aún no has cambiado de modo.
                      </p>
                    ) : (
                      roleHistory.map((item, idx) => (
                        <div key={`${item.date}-${idx}`} className="text-xs text-gray-600 bg-gray-50 p-2 rounded border border-gray-100">
                          <p className="font-semibold text-gray-700">{item.from} ➔ {item.to}</p>
                          <span className="text-[10px] text-gray-400">{item.date}</span>
                        </div>
                      ))
                    )}
                  </div>
                )}
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
