import { ArrowLeft, CreditCard, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';

interface SavedCard {
  id: string;
  cardNumber: string;
  cardName: string;
  expiryDate: string;
  lastFourDigits: string;
}

interface PaymentMethodsProps {
  onBack: () => void;
  savedCards: SavedCard[];
  onAddCard: (card: SavedCard) => void;
  onDeleteCard: (cardId: string) => void;
}

export function PaymentMethods({ onBack, savedCards, onAddCard, onDeleteCard }: PaymentMethodsProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate fields
    if (!cardNumber || !cardName || !expiryDate || !cvv) {
      alert('Por favor completa todos los campos');
      return;
    }

    if (cardNumber.replace(/\s/g, '').length !== 16) {
      alert('El número de tarjeta debe tener 16 dígitos');
      return;
    }

    if (expiryDate.replace('/', '').length !== 4) {
      alert('La fecha de vencimiento debe tener formato MM/AA');
      return;
    }

    if (cvv.length !== 3) {
      alert('El CVV debe tener 3 dígitos');
      return;
    }

    // Get last 4 digits
    const cleanNumber = cardNumber.replace(/\s/g, '');
    const lastFour = cleanNumber.slice(-4);

    const newCard: SavedCard = {
      id: `card-${Date.now()}`,
      cardNumber: cleanNumber,
      cardName,
      expiryDate,
      lastFourDigits: lastFour
    };

    onAddCard(newCard);

    // Reset form
    setCardNumber('');
    setCardName('');
    setExpiryDate('');
    setCvv('');
    setShowAddForm(false);
  };

  const maskCardNumber = (number: string) => {
    return `•••• •••• •••• ${number.slice(-4)}`;
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5]">
      {/* Header */}
      <header className="bg-[#685AA1] shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-white hover:text-white/80 transition-colors"
          >
            <ArrowLeft size={20} />
            <span>Volver</span>
          </button>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-8 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        {/* Title */}
        <div className="mb-6">
          <h1 className="text-3xl mb-2 text-[#1D1D1B]">Métodos de Pago</h1>
          <p className="text-gray-600">Administra tus tarjetas guardadas</p>
        </div>

        {/* Add Card Button */}
        {!showAddForm && (
          <button
            onClick={() => setShowAddForm(true)}
            className="w-full mb-6 px-6 py-4 border-2 border-dashed border-gray-300 rounded-xl hover:border-[#FFC900] hover:bg-[#FFC900]/5 transition-all flex items-center justify-center gap-2 text-gray-600 hover:text-[#1D1D1B]"
          >
            <Plus size={24} />
            <span className="font-medium">Agregar Nueva Tarjeta</span>
          </button>
        )}

        {/* Add Card Form */}
        {showAddForm && (
          <div className="bg-white rounded-xl shadow-sm p-8 mb-6">
            <h2 className="text-2xl mb-6 text-[#1D1D1B]">Nueva Tarjeta</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
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

              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddForm(false);
                    setCardNumber('');
                    setCardName('');
                    setExpiryDate('');
                    setCvv('');
                  }}
                  className="flex-1 px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-[#FFC900] text-[#1D1D1B] font-medium rounded-lg hover:bg-[#e6b500] transition-colors"
                >
                  Guardar Tarjeta
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Saved Cards */}
        <div className="space-y-4">
          {savedCards.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm p-12 text-center">
              <CreditCard size={64} className="mx-auto mb-4 text-gray-300" />
              <h3 className="text-xl font-medium text-gray-600 mb-2">
                No hay tarjetas guardadas
              </h3>
              <p className="text-gray-500">
                Agrega una tarjeta para facilitar tus pagos
              </p>
            </div>
          ) : (
            savedCards.map((card) => (
              <div
                key={card.id}
                className="bg-gradient-to-br from-[#685AA1] to-[#8b7bb8] rounded-xl shadow-lg p-6 text-white relative overflow-hidden"
              >
                {/* Card Background Pattern */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-5 rounded-full -mr-16 -mt-16"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-white opacity-5 rounded-full -ml-12 -mb-12"></div>

                {/* Card Content */}
                <div className="relative z-10">
                  <div className="flex items-start justify-between mb-8">
                    <CreditCard size={40} className="text-[#FFC900]" />
                    <button
                      onClick={() => onDeleteCard(card.id)}
                      className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                      title="Eliminar tarjeta"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>

                  <div className="mb-6">
                    <p className="text-2xl font-mono tracking-wider">
                      {maskCardNumber(card.cardNumber)}
                    </p>
                  </div>

                  <div className="flex items-end justify-between">
                    <div>
                      <p className="text-xs text-white/70 mb-1">TITULAR</p>
                      <p className="font-medium uppercase">{card.cardName}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-white/70 mb-1">VENCE</p>
                      <p className="font-medium">{card.expiryDate}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
