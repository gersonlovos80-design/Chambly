import { X, Plus, Trash2, Receipt, Banknote, CreditCard, Calendar } from 'lucide-react';
import { useState } from 'react';

interface InvoiceItem {
  id: string;
  description: string;
  amount: number;
  type: 'material' | 'labor';
}

interface InvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  clientName: string;
  jobType: string;
  onSendInvoice: (items: InvoiceItem[], total: number, expirationDate: string, paymentMethod: 'efectivo' | 'tarjeta') => void;
  requestedPaymentMethod?: 'efectivo' | 'tarjeta';
}

export function InvoiceModal({ isOpen, onClose, clientName, jobType, onSendInvoice, requestedPaymentMethod }: InvoiceModalProps) {
  const [items, setItems] = useState<InvoiceItem[]>([]);
  const [newItemDescription, setNewItemDescription] = useState('');
  const [newItemAmount, setNewItemAmount] = useState('');
  const [newItemType, setNewItemType] = useState<'material' | 'labor'>('labor');
  const [expirationDate, setExpirationDate] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'efectivo' | 'tarjeta'>(requestedPaymentMethod || 'efectivo');

  if (!isOpen) return null;

  const handleAddItem = () => {
    if (!newItemDescription || !newItemAmount) {
      alert('Por favor completa la descripción y el monto');
      return;
    }

    const amount = parseFloat(newItemAmount);
    if (isNaN(amount) || amount <= 0) {
      alert('Por favor ingresa un monto válido');
      return;
    }

    const newItem: InvoiceItem = {
      id: `item-${Date.now()}`,
      description: newItemDescription,
      amount: amount,
      type: newItemType
    };

    setItems(prev => [...prev, newItem]);
    setNewItemDescription('');
    setNewItemAmount('');
  };

  const handleRemoveItem = (itemId: string) => {
    setItems(prev => prev.filter(item => item.id !== itemId));
  };

  const total = items.reduce((sum, item) => sum + item.amount, 0);

  const handleSendInvoice = () => {
    if (items.length === 0) {
      alert('Por favor agrega al menos un elemento al cobro');
      return;
    }

    if (!expirationDate) {
      alert('Por favor selecciona una fecha de expiración');
      return;
    }

    // Validate expiration date is in the future
    const expDate = new Date(expirationDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (expDate < today) {
      alert('La fecha de expiración debe ser posterior a hoy');
      return;
    }

    onSendInvoice(items, total, expirationDate, paymentMethod);
    onClose();

    // Reset form
    setItems([]);
    setNewItemDescription('');
    setNewItemAmount('');
    setNewItemType('labor');
    setExpirationDate('');
    setPaymentMethod(requestedPaymentMethod || 'efectivo');
  };

  const materialsTotal = items.filter(i => i.type === 'material').reduce((sum, i) => sum + i.amount, 0);
  const laborTotal = items.filter(i => i.type === 'labor').reduce((sum, i) => sum + i.amount, 0);

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-50"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-3xl bg-white rounded-2xl shadow-2xl z-50 max-h-[90vh] overflow-y-auto">
        <div className="p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Receipt size={28} className="text-[#685AA1]" />
              <h2 className="text-2xl text-[#1D1D1B]">Crear Cobro</h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          {/* Service Info */}
          <div className="bg-[#FAF8F5] rounded-lg p-4 mb-6">
            <p className="text-sm text-gray-600 mb-1">Cliente: <span className="font-medium text-[#1D1D1B]">{clientName}</span></p>
            <p className="text-sm text-gray-600">Servicio: <span className="font-medium text-[#1D1D1B]">{jobType}</span></p>
          </div>

          {/* Payment Method Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-[#1D1D1B] mb-3">
              Método de Pago del Cliente
            </label>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setPaymentMethod('efectivo')}
                className={`p-4 border-2 rounded-xl transition-all ${
                  paymentMethod === 'efectivo'
                    ? 'border-[#FFC900] bg-[#FFC900]/10'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <Banknote size={28} className={paymentMethod === 'efectivo' ? 'text-[#FFC900] mx-auto mb-2' : 'text-gray-600 mx-auto mb-2'} />
                <p className="text-sm font-medium text-[#1D1D1B]">Efectivo</p>
                <p className="text-xs text-gray-600 mt-1">Marcarás como pagado manualmente</p>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('tarjeta')}
                className={`p-4 border-2 rounded-xl transition-all ${
                  paymentMethod === 'tarjeta'
                    ? 'border-[#FFC900] bg-[#FFC900]/10'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <CreditCard size={28} className={paymentMethod === 'tarjeta' ? 'text-[#FFC900] mx-auto mb-2' : 'text-gray-600 mx-auto mb-2'} />
                <p className="text-sm font-medium text-[#1D1D1B]">Tarjeta</p>
                <p className="text-xs text-gray-600 mt-1">Cliente paga automáticamente</p>
              </button>
            </div>
          </div>

          {/* Expiration Date */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-[#1D1D1B] mb-2">
              Fecha de Expiración del Cobro
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="date"
                value={expirationDate}
                onChange={(e) => setExpirationDate(e.target.value)}
                min={new Date(Date.now() + 86400000).toISOString().split('T')[0]}
                className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#685AA1]"
                required
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {paymentMethod === 'tarjeta'
                ? 'Si el cliente no paga antes de esta fecha, el cobro se marcará como No Pagado'
                : 'Fecha límite para que el cliente realice el pago en efectivo'
              }
            </p>
          </div>

          {/* Add Item Form */}
          <div className="bg-white border-2 border-gray-200 rounded-xl p-6 mb-6">
            <h3 className="text-lg font-medium text-[#1D1D1B] mb-4">Agregar Elemento</h3>

            <div className="space-y-4">
              {/* Type Selection */}
              <div>
                <label className="block text-sm font-medium text-[#1D1D1B] mb-2">
                  Tipo de Elemento
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setNewItemType('labor')}
                    className={`px-4 py-3 border-2 rounded-lg transition-all ${
                      newItemType === 'labor'
                        ? 'border-[#FFC900] bg-[#FFC900]/10 text-[#1D1D1B] font-medium'
                        : 'border-gray-300 text-gray-700 hover:border-gray-400'
                    }`}
                  >
                    Mano de Obra
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewItemType('material')}
                    className={`px-4 py-3 border-2 rounded-lg transition-all ${
                      newItemType === 'material'
                        ? 'border-[#FFC900] bg-[#FFC900]/10 text-[#1D1D1B] font-medium'
                        : 'border-gray-300 text-gray-700 hover:border-gray-400'
                    }`}
                  >
                    Materiales
                  </button>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-[#1D1D1B] mb-2">
                  Descripción
                </label>
                <input
                  type="text"
                  value={newItemDescription}
                  onChange={(e) => setNewItemDescription(e.target.value)}
                  placeholder="Ej: Pintura blanca 5 galones, Instalación de azulejos..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#685AA1]"
                />
              </div>

              {/* Amount */}
              <div>
                <label className="block text-sm font-medium text-[#1D1D1B] mb-2">
                  Costo
                </label>
                <div className="flex items-center gap-2">
                  <span className="text-xl text-gray-600">$</span>
                  <input
                    type="number"
                    value={newItemAmount}
                    onChange={(e) => setNewItemAmount(e.target.value)}
                    placeholder="0.00"
                    step="0.01"
                    min="0"
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#685AA1]"
                  />
                </div>
              </div>

              {/* Add Button */}
              <button
                type="button"
                onClick={handleAddItem}
                className="w-full px-6 py-3 bg-[#685AA1] text-white font-medium rounded-lg hover:bg-[#685AA1]/90 transition-colors flex items-center justify-center gap-2"
              >
                <Plus size={20} />
                Agregar Elemento
              </button>
            </div>
          </div>

          {/* Items List */}
          {items.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-medium text-[#1D1D1B] mb-4">Elementos del Cobro</h3>

              <div className="space-y-3">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          item.type === 'material'
                            ? 'bg-blue-100 text-blue-700'
                            : 'bg-purple-100 text-purple-700'
                        }`}>
                          {item.type === 'material' ? 'Material' : 'Mano de Obra'}
                        </span>
                      </div>
                      <p className="text-sm font-medium text-[#1D1D1B]">{item.description}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <p className="text-lg font-medium text-green-600">${item.amount.toFixed(2)}</p>
                      <button
                        onClick={() => handleRemoveItem(item.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Subtotals */}
              <div className="mt-6 space-y-2 bg-[#FAF8F5] rounded-lg p-4">
                {laborTotal > 0 && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Subtotal Mano de Obra:</span>
                    <span className="font-medium text-[#1D1D1B]">${laborTotal.toFixed(2)}</span>
                  </div>
                )}
                {materialsTotal > 0 && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Subtotal Materiales:</span>
                    <span className="font-medium text-[#1D1D1B]">${materialsTotal.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex items-center justify-between pt-2 border-t border-gray-300">
                  <span className="text-lg font-medium text-[#1D1D1B]">Total:</span>
                  <span className="text-2xl font-medium text-green-600">${total.toFixed(2)}</span>
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
              onClick={handleSendInvoice}
              disabled={items.length === 0}
              className="flex-1 px-6 py-3 bg-[#FFC900] text-[#1D1D1B] font-medium rounded-lg hover:bg-[#e6b500] transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <Receipt size={20} />
              Enviar Cobro al Cliente
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
