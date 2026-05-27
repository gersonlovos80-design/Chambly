import { useState } from 'react';
import { X, Banknote, CreditCard, CheckCircle } from 'lucide-react';

interface RequestServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  clientData: any;
  professionalName: string;
  professionalId: string;
  category: string;
  savedCards: any[];
  onSendRequest?: (professionalId: string, professionalName: string, category: string, paymentMethod: 'efectivo' | 'tarjeta') => void;
}

export function RequestServiceModal({ isOpen, onClose, clientData, professionalName, professionalId, category, savedCards, onSendRequest }: RequestServiceModalProps) {
  const [description, setDescription] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'efectivo' | 'tarjeta' | null>(null);
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate payment method
    if (!paymentMethod) {
      alert('Por favor selecciona un método de pago preferido');
      return;
    }

    // Call onSendRequest if provided
    if (onSendRequest) {
      onSendRequest(professionalId, professionalName, category, paymentMethod);
    }

    const paymentInfo = paymentMethod === 'efectivo'
      ? 'Efectivo (preferencia del cliente)'
      : 'Tarjeta (preferencia del cliente)';

    alert(`Solicitud enviada exitosamente\nMétodo de pago preferido: ${paymentInfo}`);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-50"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl bg-white rounded-2xl shadow-2xl z-50 max-h-[90vh] overflow-y-auto">
        <div className="p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl">Enviar Solicitud de Servicio</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          {/* Info Banner */}
          <div className="bg-[#D3CFED] border border-[#685AA1]/30 rounded-lg p-4 mb-6">
            <p className="text-sm text-[#1D1D1B]">
              Estás enviando una solicitud a <span className="font-medium">{professionalName}</span> para un trabajo de <span className="font-medium">{category}</span>
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Client Name */}
            <div>
              <label className="block text-sm font-medium text-[#1D1D1B] mb-2">
                Tu Nombre
              </label>
              <input
                type="text"
                value={`${clientData.name}${clientData.lastName ? ' ' + clientData.lastName : ''}`}
                disabled
                className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-[#FAF8F5] text-[#1D1D1B]"
              />
            </div>

            {/* City/Departamento */}
            <div>
              <label className="block text-sm font-medium text-[#1D1D1B] mb-2">
                Ubicación
              </label>
              <input
                type="text"
                value={clientData.departamento}
                disabled
                className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-[#FAF8F5] text-[#1D1D1B]"
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-[#1D1D1B] mb-2">
                Categoría del Trabajo
              </label>
              <input
                type="text"
                value={category}
                disabled
                className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-[#FAF8F5] text-[#1D1D1B]"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-[#1D1D1B] mb-2">
                Descripción del Trabajo
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe brevemente el trabajo que necesitas. Incluye detalles importantes como el tamaño del área, materiales necesarios, fecha preferida, etc."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#685AA1] min-h-[150px]"
                maxLength={500}
                required
              />
              <p className="text-sm text-gray-500 mt-2">
                {description.length}/500 caracteres
              </p>
            </div>

            {/* Budget (Optional) */}
            <div>
              <label className="block text-sm font-medium text-[#1D1D1B] mb-2">
                Presupuesto Estimado (Opcional)
              </label>
              <div className="flex items-center gap-2">
                <span className="text-gray-600">$</span>
                <input
                  type="number"
                  placeholder="150"
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#685AA1]"
                />
              </div>
            </div>

            {/* Scheduled Date */}
            <div>
              <label className="block text-sm font-medium text-[#1D1D1B] mb-2">
                Fecha Programada
              </label>
              <input
                type="date"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#685AA1]"
                required
                min={new Date().toISOString().split('T')[0]}
              />
            </div>

            {/* Payment Method */}
            <div>
              <label className="block text-sm font-medium text-[#1D1D1B] mb-3">
                Método de Pago Preferido
              </label>
              <p className="text-xs text-gray-600 mb-3">
                Indica tu preferencia de pago. El profesional creará la factura al finalizar el trabajo.
              </p>
              <div className="grid grid-cols-2 gap-4">
                {/* Cash Option */}
                <button
                  type="button"
                  onClick={() => {
                    setPaymentMethod('efectivo');
                    setSelectedCardId(null);
                  }}
                  className={`p-4 border-2 rounded-xl transition-all ${
                    paymentMethod === 'efectivo'
                      ? 'border-[#FFC900] bg-[#FFC900]/10'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <Banknote size={28} className={paymentMethod === 'efectivo' ? 'text-[#FFC900] mx-auto' : 'text-gray-600 mx-auto'} />
                  <p className="mt-2 font-medium text-[#1D1D1B]">Efectivo</p>
                  <p className="text-xs text-gray-600 mt-1">Pago directo al profesional</p>
                </button>

                {/* Card Option */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod('tarjeta')}
                  className={`p-4 border-2 rounded-xl transition-all ${
                    paymentMethod === 'tarjeta'
                      ? 'border-[#FFC900] bg-[#FFC900]/10'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <CreditCard size={28} className={paymentMethod === 'tarjeta' ? 'text-[#FFC900] mx-auto' : 'text-gray-600 mx-auto'} />
                  <p className="mt-2 font-medium text-[#1D1D1B]">Tarjeta</p>
                  <p className="text-xs text-gray-600 mt-1">Pago procesado por la app</p>
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-4 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-6 py-3 border border-gray-300 rounded-lg hover:bg-[#FAF8F5] transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="flex-1 px-6 py-3 bg-[#FFC900] text-[#1D1D1B] font-medium rounded-lg hover:bg-[#e6b500] transition-colors"
              >
                Enviar Solicitud
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
