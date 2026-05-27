import { CheckCircle } from 'lucide-react';
import { useEffect, useState } from 'react';

interface PaymentSuccessAnimationProps {
  isOpen: boolean;
  onClose: () => void;
  amount: number;
  paymentMethod: 'efectivo' | 'tarjeta';
}

export function PaymentSuccessAnimation({
  isOpen,
  onClose,
  amount,
  paymentMethod
}: PaymentSuccessAnimationProps) {
  const [confetti, setConfetti] = useState<Array<{ id: number; left: number; delay: number }>>([]);

  useEffect(() => {
    if (isOpen) {
      // Generate confetti particles
      const particles = Array.from({ length: 30 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 0.5
      }));
      setConfetti(particles);

      // Auto close after 3 seconds
      const timer = setTimeout(() => {
        onClose();
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-[100] flex items-center justify-center">
      {/* Confetti */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {confetti.map((particle) => (
          <div
            key={particle.id}
            className="absolute w-2 h-2 bg-[#FFC900] rounded-full animate-confetti"
            style={{
              left: `${particle.left}%`,
              top: '-10%',
              animationDelay: `${particle.delay}s`,
              opacity: 0.8
            }}
          />
        ))}
      </div>

      {/* Success Card */}
      <div className="bg-white rounded-2xl shadow-2xl p-12 max-w-md mx-4 text-center relative z-10 animate-scale-in">
        {/* Success Icon */}
        <div className="relative mb-6">
          <div className="absolute inset-0 bg-[#FFC900] opacity-20 rounded-full animate-ping"></div>
          <div className="relative bg-[#FFC900] w-24 h-24 rounded-full mx-auto flex items-center justify-center">
            <CheckCircle size={48} className="text-white" strokeWidth={3} />
          </div>
        </div>

        {/* Success Message */}
        <h2 className="text-3xl font-medium text-[#1D1D1B] mb-3">
          ¡Pago Confirmado!
        </h2>

        <p className="text-lg text-gray-600 mb-6">
          Trabajo finalizado con éxito
        </p>

        {/* Amount */}
        <div className="bg-[#FAF8F5] rounded-xl p-6 mb-4">
          <p className="text-sm text-gray-600 mb-1">Monto pagado</p>
          <p className="text-4xl font-medium text-green-600">${amount.toFixed(2)}</p>
          <p className="text-sm text-gray-500 mt-2 capitalize">
            Método: {paymentMethod === 'efectivo' ? 'Efectivo' : 'Tarjeta'}
          </p>
        </div>

        {/* Additional Info */}
        <p className="text-sm text-gray-500">
          {paymentMethod === 'tarjeta'
            ? 'El recibo digital ha sido enviado a ambas partes'
            : 'El cliente ha confirmado el pago en efectivo'
          }
        </p>
      </div>

      <style>{`
        @keyframes confetti {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(360deg);
            opacity: 0;
          }
        }

        @keyframes scale-in {
          0% {
            transform: scale(0.5);
            opacity: 0;
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }

        .animate-confetti {
          animation: confetti 2s ease-in forwards;
        }

        .animate-scale-in {
          animation: scale-in 0.5s ease-out;
        }
      `}</style>
    </div>
  );
}
