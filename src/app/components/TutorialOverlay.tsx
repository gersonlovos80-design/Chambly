import { X, ArrowRight, ArrowLeft } from 'lucide-react';
import { useState } from 'react';

interface TutorialStep {
  title: string;
  description: string;
  position: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'center' | 'top-center' | 'bottom-center';
  highlightArea?: {
    top?: string;
    left?: string;
    right?: string;
    bottom?: string;
    width: string;
    height: string;
  };
}

interface TutorialOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  userType: 'client' | 'professional';
}

const clientSteps: TutorialStep[] = [
  {
    title: '¡Bienvenido a Chambly!',
    description: 'Te guiaremos por las funciones principales de la aplicación para que puedas encontrar y contratar profesionales fácilmente.',
    position: 'center'
  },
  {
    title: 'Menú Principal',
    description: 'Aquí encontrarás acceso a tu perfil, notificaciones y centro de ayuda. Toca el ícono de 3 líneas en la esquina superior derecha.',
    position: 'top-right',
    highlightArea: {
      top: '0.5rem',
      right: '0.5rem',
      width: '3rem',
      height: '3rem'
    }
  },
  {
    title: 'Última Actividad',
    description: 'Revisa el estado de tus servicios recientes y accede a los detalles de cada solicitud.',
    position: 'top-center',
    highlightArea: {
      top: '8rem',
      left: '1rem',
      width: 'calc(100% - 2rem)',
      height: '12rem'
    }
  },
  {
    title: 'Categorías de Servicios',
    description: 'Selecciona la categoría del servicio que necesitas: Limpieza, Construcción, Pintura, Plomería y más. Esto te mostrará profesionales especializados.',
    position: 'bottom-center',
    highlightArea: {
      top: '22rem',
      left: '1rem',
      width: 'calc(100% - 2rem)',
      height: '22rem'
    }
  },
  {
    title: 'Mensajes',
    description: 'Toca el botón flotante amarillo para ver tus conversaciones con los profesionales que han aceptado tus solicitudes. Coordina detalles del trabajo aquí.',
    position: 'bottom-left',
    highlightArea: {
      bottom: '1.5rem',
      right: '1.5rem',
      width: '4rem',
      height: '4rem'
    }
  },
  {
    title: '¡Todo Listo!',
    description: 'Ya estás listo para usar Chambly. Encuentra profesionales de confianza, coordina trabajos y realiza pagos de forma segura. ¡Mucho éxito!',
    position: 'center'
  }
];

const professionalSteps: TutorialStep[] = [
  {
    title: '¡Bienvenido a Chambly!',
    description: 'Te guiaremos por las funciones principales para que puedas recibir solicitudes, gestionar trabajos y cobrar tus servicios.',
    position: 'center'
  },
  {
    title: 'Menú Principal',
    description: 'Accede a tu perfil, trabajos activos, historial de pagos y ayuda desde el menú. Toca el ícono de 3 líneas en la esquina superior derecha.',
    position: 'top-right',
    highlightArea: {
      top: '0.5rem',
      right: '0.5rem',
      width: '3rem',
      height: '3rem'
    }
  },
  {
    title: 'Tus Categorías',
    description: 'Aquí se muestran las categorías de servicios que ofreces. Solo recibirás solicitudes relacionadas con tus especialidades.',
    position: 'top-center',
    highlightArea: {
      top: '8rem',
      left: '1rem',
      width: 'calc(100% - 2rem)',
      height: '6rem'
    }
  },
  {
    title: 'Solicitudes de Trabajo',
    description: 'Revisa las solicitudes de clientes que coinciden con tus servicios. Puedes aceptar o rechazar cada solicitud. Verás detalles del trabajo, presupuesto y fecha.',
    position: 'bottom-center',
    highlightArea: {
      bottom: '6rem',
      left: '1rem',
      width: 'calc(100% - 2rem)',
      height: '15rem'
    }
  },
  {
    title: 'Trabajos Activos',
    description: 'Desde el menú accede a "Trabajos Activos" para ver todos los servicios que has aceptado. Aquí puedes chatear con clientes y marcar trabajos como completados.',
    position: 'center'
  },
  {
    title: 'Confirmar Pagos',
    description: 'Al finalizar un trabajo, confirma el pago (efectivo o tarjeta). El cliente recibirá una notificación y tú verás el registro en tu historial de pagos.',
    position: 'center'
  },
  {
    title: 'Mensajes',
    description: 'Toca el botón flotante amarillo para chatear con tus clientes. Coordina horarios, confirma detalles y mantén comunicación durante el servicio.',
    position: 'bottom-left',
    highlightArea: {
      bottom: '1.5rem',
      right: '1.5rem',
      width: '4rem',
      height: '4rem'
    }
  },
  {
    title: '¡Todo Listo!',
    description: 'Ahora puedes recibir solicitudes, gestionar tus trabajos y cobrar por tus servicios. ¡Éxito en tu carrera profesional!',
    position: 'center'
  }
];

export function TutorialOverlay({ isOpen, onClose, userType }: TutorialOverlayProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const steps = userType === 'client' ? clientSteps : professionalSteps;
  const step = steps[currentStep];

  if (!isOpen) return null;

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onClose();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkip = () => {
    onClose();
  };

  const getTooltipPosition = () => {
    const positions = {
      'center': 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2',
      'top-right': 'top-20 right-4',
      'top-left': 'top-20 left-4',
      'bottom-right': 'bottom-24 right-4',
      'bottom-left': 'bottom-24 left-4',
      'top-center': 'top-1/3 left-1/2 -translate-x-1/2',
      'bottom-center': 'bottom-1/3 left-1/2 -translate-x-1/2'
    };
    return positions[step.position];
  };

  const getArrowClass = () => {
    const arrows = {
      'center': '',
      'top-right': 'before:content-[""] before:absolute before:-top-2 before:right-8 before:w-0 before:h-0 before:border-l-8 before:border-l-transparent before:border-r-8 before:border-r-transparent before:border-b-8 before:border-b-white',
      'top-left': 'before:content-[""] before:absolute before:-top-2 before:left-8 before:w-0 before:h-0 before:border-l-8 before:border-l-transparent before:border-r-8 before:border-r-transparent before:border-b-8 before:border-b-white',
      'bottom-right': 'before:content-[""] before:absolute before:-bottom-2 before:right-8 before:w-0 before:h-0 before:border-l-8 before:border-l-transparent before:border-r-8 before:border-r-transparent before:border-t-8 before:border-t-white',
      'bottom-left': 'before:content-[""] before:absolute before:-bottom-2 before:left-8 before:w-0 before:h-0 before:border-l-8 before:border-l-transparent before:border-r-8 before:border-r-transparent before:border-t-8 before:border-t-white',
      'top-center': 'before:content-[""] before:absolute before:-top-2 before:left-1/2 before:-translate-x-1/2 before:w-0 before:h-0 before:border-l-8 before:border-l-transparent before:border-r-8 before:border-r-transparent before:border-b-8 before:border-b-white',
      'bottom-center': 'before:content-[""] before:absolute before:-bottom-2 before:left-1/2 before:-translate-x-1/2 before:w-0 before:h-0 before:border-l-8 before:border-l-transparent before:border-r-8 before:border-r-transparent before:border-t-8 before:border-t-white'
    };
    return arrows[step.position];
  };

  return (
    <>
      {/* Dark Overlay */}
      <div className="fixed inset-0 bg-black bg-opacity-70 z-[200]" />

      {/* Highlight Area */}
      {step.highlightArea && (
        <div
          className="fixed z-[201] rounded-lg ring-4 ring-[#FFC900] ring-opacity-50 pointer-events-none animate-pulse-slow"
          style={{
            top: step.highlightArea.top,
            left: step.highlightArea.left,
            right: step.highlightArea.right,
            bottom: step.highlightArea.bottom,
            width: step.highlightArea.width,
            height: step.highlightArea.height
          }}
        />
      )}

      {/* Tooltip */}
      <div className={`fixed z-[202] ${getTooltipPosition()} max-w-sm`}>
        <div className={`bg-white rounded-2xl shadow-2xl p-6 relative ${getArrowClass()}`}>
          {/* Close Button */}
          <button
            onClick={handleSkip}
            className="absolute top-3 right-3 p-1 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={20} className="text-gray-600" />
          </button>

          {/* Content */}
          <div className="pr-6">
            <h3 className="text-xl font-medium text-[#1D1D1B] mb-3">
              {step.title}
            </h3>
            <p className="text-gray-700 leading-relaxed mb-6">
              {step.description}
            </p>

            {/* Progress Dots */}
            <div className="flex items-center justify-center gap-2 mb-6">
              {steps.map((_, index) => (
                <div
                  key={index}
                  className={`h-2 rounded-full transition-all ${
                    index === currentStep
                      ? 'w-8 bg-[#FFC900]'
                      : 'w-2 bg-gray-300'
                  }`}
                />
              ))}
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between gap-3">
              <button
                onClick={handlePrevious}
                disabled={currentStep === 0}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 disabled:text-gray-300 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
              >
                <ArrowLeft size={18} />
                Anterior
              </button>

              <span className="text-sm text-gray-500">
                {currentStep + 1} / {steps.length}
              </span>

              <button
                onClick={handleNext}
                className="px-6 py-2 bg-[#FFC900] text-[#1D1D1B] font-medium rounded-lg hover:bg-[#e6b500] transition-colors flex items-center gap-2"
              >
                {currentStep === steps.length - 1 ? 'Finalizar' : 'Siguiente'}
                <ArrowRight size={18} />
              </button>
            </div>

            {/* Skip Button */}
            {currentStep < steps.length - 1 && (
              <button
                onClick={handleSkip}
                className="w-full mt-3 text-sm text-gray-500 hover:text-gray-700 transition-colors"
              >
                Saltar tutorial
              </button>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes pulse-slow {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }

        .animate-pulse-slow {
          animation: pulse-slow 2s ease-in-out infinite;
        }
      `}</style>
    </>
  );
}
