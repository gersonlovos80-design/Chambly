import { Receipt, CreditCard, Banknote, Calendar, CheckCircle } from 'lucide-react';

interface InvoiceItem {
  id: string;
  description: string;
  amount: number;
  type: 'material' | 'labor';
}

interface InvoiceMessageProps {
  items: InvoiceItem[];
  total: number;
  clientName: string;
  professionalName: string;
  jobType: string;
  timestamp: string;
  userType: 'client' | 'professional';
  isPaid?: boolean;
  expirationDate?: string;
  paymentMethod: 'efectivo' | 'tarjeta';
  onPayInvoice?: () => void;
  onMarkAsPaid?: () => void;
}

export function InvoiceMessage({
  items,
  total,
  clientName,
  professionalName,
  jobType,
  timestamp,
  userType,
  isPaid = false,
  expirationDate,
  paymentMethod,
  onPayInvoice,
  onMarkAsPaid
}: InvoiceMessageProps) {
  const materialsTotal = items.filter(i => i.type === 'material').reduce((sum, i) => sum + i.amount, 0);
  const laborTotal = items.filter(i => i.type === 'labor').reduce((sum, i) => sum + i.amount, 0);

  // Check if expired
  const isExpired = expirationDate ? new Date(expirationDate) < new Date() : false;

  return (
    <div className="max-w-md mx-auto my-4">
      <div className="bg-white border-2 border-[#685AA1] rounded-xl shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-[#685AA1] text-white p-4">
          <div className="flex items-center gap-2 mb-2">
            <Receipt size={24} />
            <h3 className="text-lg font-medium">Factura de Servicio</h3>
          </div>
          <p className="text-sm text-white/80">{timestamp}</p>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Service Info */}
          <div className="mb-4 pb-4 border-b border-gray-200">
            <p className="text-sm text-gray-600 mb-1">
              <span className="font-medium text-[#1D1D1B]">Cliente:</span> {clientName}
            </p>
            <p className="text-sm text-gray-600 mb-1">
              <span className="font-medium text-[#1D1D1B]">Profesional:</span> {professionalName}
            </p>
            <p className="text-sm text-gray-600 mb-1">
              <span className="font-medium text-[#1D1D1B]">Servicio:</span> {jobType}
            </p>
            <div className="flex items-center gap-4 mt-2">
              <div className="flex items-center gap-2">
                {paymentMethod === 'efectivo' ? (
                  <Banknote size={16} className="text-green-600" />
                ) : (
                  <CreditCard size={16} className="text-blue-600" />
                )}
                <span className="text-sm text-gray-600">
                  <span className="font-medium text-[#1D1D1B]">Método:</span> {paymentMethod === 'efectivo' ? 'Efectivo' : 'Tarjeta'}
                </span>
              </div>
              {expirationDate && (
                <div className="flex items-center gap-2">
                  <Calendar size={16} className={isExpired && !isPaid ? 'text-red-600' : 'text-gray-600'} />
                  <span className={`text-sm ${isExpired && !isPaid ? 'text-red-600 font-medium' : 'text-gray-600'}`}>
                    {isExpired && !isPaid ? 'Venció' : 'Vence'}: {new Date(expirationDate).toLocaleDateString('es-ES')}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Items */}
          <div className="space-y-3 mb-4">
            {items.map((item) => (
              <div key={item.id} className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      item.type === 'material'
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-purple-100 text-purple-700'
                    }`}>
                      {item.type === 'material' ? 'Material' : 'Mano de Obra'}
                    </span>
                  </div>
                  <p className="text-sm text-[#1D1D1B]">{item.description}</p>
                </div>
                <p className="text-sm font-medium text-[#1D1D1B] ml-4">${item.amount.toFixed(2)}</p>
              </div>
            ))}
          </div>

          {/* Totals */}
          <div className="space-y-2 pt-4 border-t border-gray-200">
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
              <span className="text-lg font-medium text-[#1D1D1B]">Total a Pagar:</span>
              <span className="text-2xl font-medium text-green-600">${total.toFixed(2)}</span>
            </div>
          </div>

          {/* Payment Status / Action */}
          {isPaid ? (
            <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center gap-2 text-green-700">
                <CheckCircle size={18} />
                <p className="text-sm font-medium">Pago Completado</p>
              </div>
            </div>
          ) : isExpired ? (
            <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center gap-2 text-red-700">
                <Calendar size={18} />
                <p className="text-sm font-medium">Cobro Expirado - No Pagado</p>
              </div>
            </div>
          ) : userType === 'client' && paymentMethod === 'tarjeta' && onPayInvoice ? (
            <button
              onClick={onPayInvoice}
              className="w-full mt-6 px-6 py-3 bg-[#FFC900] text-[#1D1D1B] font-medium rounded-lg hover:bg-[#e6b500] transition-colors flex items-center justify-center gap-2"
            >
              <CreditCard size={20} />
              Realizar Pago con Tarjeta
            </button>
          ) : userType === 'client' && paymentMethod === 'efectivo' ? (
            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-800">
                Pago en efectivo. El profesional confirmará cuando reciba el pago.
              </p>
            </div>
          ) : userType === 'professional' && paymentMethod === 'efectivo' && onMarkAsPaid ? (
            <button
              onClick={onMarkAsPaid}
              className="w-full mt-6 px-6 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
            >
              <CheckCircle size={20} />
              Marcar como Pagado (Efectivo)
            </button>
          ) : userType === 'professional' && paymentMethod === 'tarjeta' ? (
            <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800">
                Esperando que el cliente realice el pago con tarjeta.
              </p>
            </div>
          ) : (
            <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800">
                Pendiente de pago
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
