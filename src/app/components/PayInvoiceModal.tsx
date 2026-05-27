import { X, CreditCard, CheckCircle } from 'lucide-react';
import { useState } from 'react';

interface PayInvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmPayment: (cardId: string) => void;
  savedCards: any[];
  amount: number;
  professionalName: string;
  jobType: string;
}

export function PayInvoiceModal({
  isOpen,
  onClose,
  onConfirmPayment,
  savedCards,
  amount,
  professionalName,
  jobType
}: PayInvoiceModalProps) {
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleConfirm = () => {
    if (!selectedCardId) {
      alert('Por favor selecciona una tarjeta');
      return;
    }

    onConfirmPayment(selectedCardId);
    onClose();
  };

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
            <h2 className="text-2xl text-[#1D1D1B]">Pagar Factura</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          {/* Service Info */}
          <div className="bg-[#FAF8F5] rounded-lg p-4 mb-6">
            <p className="text-sm text-gray-600 mb-1">Profesional: <span className="font-medium text-[#1D1D1B]">{professionalName}</span></p>
            <p className="text-sm text-gray-600">Servicio: <span className="font-medium text-[#1D1D1B]">{jobType}</span></p>
          </div>

          {/* Amount */}
          <div className="mb-6 p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-xl border border-green-200">
            <p className="text-sm text-gray-600 mb-1">Monto Total</p>
            <p className="text-4xl font-medium text-green-600">${amount.toFixed(2)}</p>
          </div>

          {/* Card Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-[#1D1D1B] mb-3">
              Selecciona una Tarjeta para Pagar
            </label>
            {savedCards.length === 0 ? (
              <div className="bg-gray-50 rounded-lg p-8 text-center">
                <CreditCard size={48} className="mx-auto mb-3 text-gray-400" />
                <p className="text-sm text-gray-600 mb-2">No tienes tarjetas guardadas</p>
                <p className="text-xs text-gray-500">Agrega una tarjeta desde el menú de Métodos de Pago</p>
              </div>
            ) : (
              <div className="space-y-3">
                {savedCards.map((card) => (
                  <button
                    key={card.id}
                    type="button"
                    onClick={() => setSelectedCardId(card.id)}
                    className={`w-full p-4 border-2 rounded-xl transition-all text-left ${
                      selectedCardId === card.id
                        ? 'border-[#FFC900] bg-[#FFC900]/10'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <CreditCard size={24} className={selectedCardId === card.id ? 'text-[#FFC900]' : 'text-gray-600'} />
                        <div>
                          <p className="font-medium text-[#1D1D1B]">
                            •••• •••• •••• {card.lastFourDigits}
                          </p>
                          <p className="text-sm text-gray-600">{card.cardName} • Vence {card.expiryDate}</p>
                        </div>
                      </div>
                      {selectedCardId === card.id && (
                        <CheckCircle size={20} className="text-[#FFC900]" />
                      )}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-4">
            <button
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={handleConfirm}
              disabled={!selectedCardId}
              className="flex-1 px-6 py-3 bg-[#FFC900] text-[#1D1D1B] font-medium rounded-lg hover:bg-[#e6b500] transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <CheckCircle size={18} />
              Confirmar Pago ${amount.toFixed(2)}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
