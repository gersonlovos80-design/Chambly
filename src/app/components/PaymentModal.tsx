import { X, CreditCard, Banknote, CheckCircle, AlertCircle } from 'lucide-react';
import { useState } from 'react';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmPayment: (method: 'efectivo' | 'tarjeta', amount: number) => void;
  clientName: string;
  serviceName: string;
  estimatedAmount?: number;
}

export function PaymentModal({
  isOpen,
  onClose,
  onConfirmPayment,
  clientName,
  serviceName,
  estimatedAmount = 0
}: PaymentModalProps) {
  const [selectedMethod, setSelectedMethod] = useState<'efectivo' | 'tarjeta' | null>(null);
  const [amount, setAmount] = useState(estimatedAmount.toString());
  const [showCardForm, setShowCardForm] = useState(false);

  // Card form state
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');

  if (!isOpen) return null;

  const handleMethodSelect = (method: 'efectivo' | 'tarjeta') => {
    setSelectedMethod(method);
    if (method === 'tarjeta') {
      setShowCardForm(true);
    } else {
      setShowCardForm(false);
    }
  };

  const handleConfirm = () => {
    if (!selectedMethod) {
      alert('Por favor selecciona un método de pago');
      return;
    }

    const finalAmount = parseFloat(amount);
    if (isNaN(finalAmount) || finalAmount <= 0) {
      alert('Por favor ingresa un monto válido');
      return;
    }

    if (selectedMethod === 'tarjeta') {
      // Validate card fields
      if (!cardNumber || !cardName || !expiryDate || !cvv) {
        alert('Por favor completa todos los datos de la tarjeta');
        return;
      }
    }

    onConfirmPayment(selectedMethod, finalAmount);
    onClose();
  };

  const formatCardNumber = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    const groups = numbers.match(/.{1,4}/g);
    return groups ? groups.join(' ') : numbers;
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCardNumber(e.target.value);
    if (formatted.replace(/\s/g, '').length <= 16) {
      setCardNumber(formatted);
    }
  };

  const formatExpiryDate = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length >= 2) {
      return `${numbers.slice(0, 2)}/${numbers.slice(2, 4)}`;
    }
    return numbers;
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatExpiryDate(e.target.value);
    if (formatted.replace('/', '').length <= 4) {
      setExpiryDate(formatted);
    }
  };

  const handleCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const numbers = e.target.value.replace(/\D/g, '');
    if (numbers.length <= 3) {
      setCvv(numbers);
    }
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
            <h2 className="text-2xl text-[#1D1D1B]">Confirmar Pago</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          {/* Service Info */}
          <div className="bg-[#FAF8F5] rounded-lg p-4 mb-6">
            <p className="text-sm text-gray-600 mb-1">Servicio: <span className="font-medium text-[#1D1D1B]">{serviceName}</span></p>
            <p className="text-sm text-gray-600">Cliente: <span className="font-medium text-[#1D1D1B]">{clientName}</span></p>
          </div>

          {/* Amount Input */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-[#1D1D1B] mb-2">
              Monto Total del Servicio
            </label>
            <div className="flex items-center gap-2">
              <span className="text-2xl text-gray-600">$</span>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="flex-1 text-2xl px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#685AA1]"
                placeholder="0.00"
                step="0.01"
                min="0"
              />
            </div>
          </div>

          {/* Payment Method Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-[#1D1D1B] mb-3">
              Método de Pago
            </label>
            <div className="grid grid-cols-2 gap-4">
              {/* Cash Option */}
              <button
                onClick={() => handleMethodSelect('efectivo')}
                className={`p-6 border-2 rounded-xl transition-all ${
                  selectedMethod === 'efectivo'
                    ? 'border-[#FFC900] bg-[#FFC900]/10'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <Banknote size={32} className={selectedMethod === 'efectivo' ? 'text-[#FFC900]' : 'text-gray-600'} />
                <p className="mt-3 font-medium text-[#1D1D1B]">Efectivo</p>
                <p className="text-xs text-gray-600 mt-1">Requiere confirmación del cliente</p>
              </button>

              {/* Card Option */}
              <button
                onClick={() => handleMethodSelect('tarjeta')}
                className={`p-6 border-2 rounded-xl transition-all ${
                  selectedMethod === 'tarjeta'
                    ? 'border-[#FFC900] bg-[#FFC900]/10'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <CreditCard size={32} className={selectedMethod === 'tarjeta' ? 'text-[#FFC900]' : 'text-gray-600'} />
                <p className="mt-3 font-medium text-[#1D1D1B]">Tarjeta</p>
                <p className="text-xs text-gray-600 mt-1">Pago procesado automáticamente</p>
              </button>
            </div>
          </div>

          {/* Card Form - Only shown when card is selected */}
          {showCardForm && selectedMethod === 'tarjeta' && (
            <div className="mb-6 p-6 bg-[#FAF8F5] rounded-lg space-y-4">
              <h3 className="font-medium text-[#1D1D1B] mb-4">Datos de la Tarjeta</h3>

              <div>
                <label className="block text-sm font-medium text-[#1D1D1B] mb-2">
                  Número de Tarjeta
                </label>
                <input
                  type="text"
                  value={cardNumber}
                  onChange={handleCardNumberChange}
                  placeholder="1234 5678 9012 3456"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#685AA1]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#1D1D1B] mb-2">
                  Nombre en la Tarjeta
                </label>
                <input
                  type="text"
                  value={cardName}
                  onChange={(e) => setCardName(e.target.value)}
                  placeholder="Juan Pérez"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#685AA1]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#1D1D1B] mb-2">
                    Fecha de Vencimiento
                  </label>
                  <input
                    type="text"
                    value={expiryDate}
                    onChange={handleExpiryChange}
                    placeholder="MM/AA"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#685AA1]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#1D1D1B] mb-2">
                    CVV
                  </label>
                  <input
                    type="text"
                    value={cvv}
                    onChange={handleCvvChange}
                    placeholder="123"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#685AA1]"
                  />
                </div>
              </div>

              <div className="flex items-start gap-2 p-3 bg-blue-50 rounded-lg mt-4">
                <AlertCircle size={18} className="text-blue-600 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-blue-800">
                  El pago será procesado de forma segura. El cliente recibirá un recibo digital una vez completada la transacción.
                </p>
              </div>
            </div>
          )}

          {/* Cash Payment Info */}
          {selectedMethod === 'efectivo' && (
            <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex gap-2">
                <AlertCircle size={18} className="text-yellow-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm text-yellow-800 font-medium mb-1">
                    Pago en Efectivo
                  </p>
                  <p className="text-xs text-yellow-700">
                    Al confirmar, se enviará una notificación al cliente para que confirme el pago en efectivo.
                    El servicio no se marcará como completado hasta recibir la confirmación.
                  </p>
                </div>
              </div>
            </div>
          )}

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
              disabled={!selectedMethod}
              className="flex-1 px-6 py-3 bg-[#FFC900] text-[#1D1D1B] font-medium rounded-lg hover:bg-[#e6b500] transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <CheckCircle size={18} />
              Confirmar Pago
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
