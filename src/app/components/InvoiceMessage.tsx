import { Receipt, CreditCard, Banknote, Calendar, CheckCircle, XCircle } from 'lucide-react';

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
  status?: 'programada' | 'pendiente' | 'aceptada' | 'rechazada';
  deliveryMode?: 'al_finalizar' | 'fecha';
  scheduledDate?: string | null;
  paymentMethod: 'efectivo' | 'tarjeta';
  onRespond?: (decision: 'aceptada' | 'rechazada') => void;
}

export function InvoiceMessage({
  items,
  total,
  clientName,
  professionalName,
  jobType,
  timestamp,
  userType,
  status = 'pendiente',
  deliveryMode,
  scheduledDate,
  paymentMethod,
  onRespond
}: InvoiceMessageProps) {
  const materialsTotal = items.filter(i => i.type === 'material').reduce((sum, i) => sum + i.amount, 0);
  const laborTotal = items.filter(i => i.type === 'labor').reduce((sum, i) => sum + i.amount, 0);

  return (
    <div className="max-w-md mx-auto my-4">
      <div className="bg-white border-2 border-[#685AA1] rounded-xl shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-[#685AA1] text-white p-4">
          <div className="flex items-center gap-2 mb-2">
            <Receipt size={24} />
            <h3 className="text-lg font-medium">Presupuesto de Servicio</h3>
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
                  <span className="font-medium text-[#1D1D1B]">Pago preferido:</span> {paymentMethod === 'efectivo' ? 'Efectivo' : 'Tarjeta'}
                </span>
              </div>
              {deliveryMode === 'al_finalizar' && (
                <div className="flex items-center gap-2">
                  <Calendar size={16} className="text-gray-600" />
                  <span className="text-sm text-gray-600">Se envía al finalizar el servicio</span>
                </div>
              )}
              {deliveryMode === 'fecha' && scheduledDate && (
                <div className="flex items-center gap-2">
                  <Calendar size={16} className="text-gray-600" />
                  <span className="text-sm text-gray-600">
                    Enviado para: {new Date(`${scheduledDate}T00:00:00`).toLocaleDateString('es-SV')}
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

          {/* Quote response */}
          {status === 'aceptada' ? (
            <div className="mt-6 rounded-lg border border-green-200 bg-green-50 p-4">
              <div className="flex items-center gap-2 text-green-700">
                <CheckCircle size={18} />
                <p className="text-sm font-medium">Presupuesto aceptado por el cliente</p>
              </div>
            </div>
          ) : status === 'rechazada' ? (
            <div className="mt-6 rounded-lg border border-red-200 bg-red-50 p-4">
              <div className="flex items-center gap-2 text-red-700">
                <XCircle size={18} />
                <p className="text-sm font-medium">Presupuesto rechazado por el cliente</p>
              </div>
            </div>
          ) : status === 'programada' ? (
            <div className="mt-6 rounded-lg border border-blue-200 bg-blue-50 p-4">
              <p className="text-sm text-blue-800">
                El presupuesto está programado y todavía no se ha enviado al cliente.
              </p>
            </div>
          ) : userType === 'client' && onRespond ? (
            <div className="mt-6">
              <p className="mb-3 text-sm text-gray-700">
                Revisa el desglose. Puedes aceptar este presupuesto o rechazarlo si no estás de acuerdo.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => onRespond('rechazada')}
                  className="flex-1 rounded-lg border border-red-300 px-4 py-3 font-medium text-red-700 hover:bg-red-50"
                >
                  Rechazar
                </button>
                <button
                  onClick={() => onRespond('aceptada')}
                  className="flex-1 rounded-lg bg-[#FFC900] px-4 py-3 font-medium text-[#1D1D1B] hover:bg-[#e6b500]"
                >
                  Aceptar presupuesto
                </button>
              </div>
            </div>
          ) : (
            <div className="mt-6 rounded-lg border border-yellow-200 bg-yellow-50 p-4">
              <p className="text-sm text-yellow-800">
                Esperando la respuesta del cliente.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
