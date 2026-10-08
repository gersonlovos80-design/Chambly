import { useState } from 'react';
import { X, Banknote, CreditCard } from 'lucide-react';

export interface ServiceRequestPayload {
  professionalId: string;
  professionalName: string;
  category: string;
  description: string;
  departamento: string;
  municipio: string;
  presupuesto: string;
  fechaServicio: string;
  horaServicio: string;
  paymentMethod: 'efectivo' | 'tarjeta';
}

interface RequestServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  clientData: any;
  professionalName: string;
  professionalId: string;
  category: string;
  onSendRequest: (payload: ServiceRequestPayload) => Promise<void>;
}

const departments = [
  'Ahuachapán', 'Santa Ana', 'Sonsonate', 'Chalatenango', 'La Libertad',
  'San Salvador', 'Cuscatlán', 'La Paz', 'Cabañas', 'San Vicente',
  'Usulután', 'San Miguel', 'Morazán', 'La Unión'
];

export function RequestServiceModal({ isOpen, onClose, clientData, professionalName, professionalId, category, onSendRequest }: RequestServiceModalProps) {
  const [description, setDescription] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'efectivo' | 'tarjeta' | null>(null);
  const [department, setDepartment] = useState(clientData.departamento || '');
  const [municipality, setMunicipality] = useState(clientData.municipio || '');
  const [budget, setBudget] = useState('');
  const [serviceDate, setServiceDate] = useState('');
  const [serviceTime, setServiceTime] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) {
      setError('Escribe una descripción del trabajo antes de enviar la solicitud.');
      return;
    }
    if (!paymentMethod || !department || !municipality.trim()) {
      setError('Selecciona el método de pago, departamento y municipio del servicio.');
      return;
    }
    setError('');
    setSaving(true);
    try {
      await onSendRequest({
        professionalId,
        professionalName,
        category,
        description,
        departamento: department,
        municipio: municipality.trim(),
        presupuesto: budget,
        fechaServicio: serviceDate,
        horaServicio: serviceTime,
        paymentMethod
      });
      setDescription('');
      setBudget('');
      setServiceDate('');
      setServiceTime('');
      onClose();
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'No se pudo enviar la solicitud.');
    } finally {
      setSaving(false);
    }
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
              <select
                value={department}
                onChange={(event) => setDepartment(event.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-[#FAF8F5] text-[#1D1D1B]"
              >
                <option value="">Selecciona un departamento</option>
                {departments.map(item => <option key={item} value={item}>{item}</option>)}
              </select>
              <label className="mt-4 mb-2 block text-sm font-medium text-[#1D1D1B]">
                Municipio o zona amplia
              </label>
              <input
                type="text"
                value={municipality}
                onChange={(event) => setMunicipality(event.target.value)}
                maxLength={80}
                required
                placeholder="Escribe el municipio"
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
                minLength={1}
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
                  value={budget}
                  onChange={(event) => setBudget(event.target.value)}
                  min="0"
                  step="0.01"
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
                value={serviceDate}
                onChange={(event) => setServiceDate(event.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#685AA1]"
                min={new Date().toISOString().split('T')[0]}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#1D1D1B] mb-2">
                Hora aproximada (opcional)
              </label>
              <input
                type="time"
                value={serviceTime}
                onChange={(event) => setServiceTime(event.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#685AA1]"
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
                  <p className="text-xs text-gray-600 mt-1">Preferencia; el pago no se procesa en la app</p>
                </button>
              </div>
            </div>

            {error && <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}

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
                disabled={saving}
                className="flex-1 px-6 py-3 bg-[#FFC900] text-[#1D1D1B] font-medium rounded-lg hover:bg-[#e6b500] transition-colors disabled:cursor-not-allowed disabled:opacity-50"
              >
                {saving ? 'Enviando...' : 'Enviar Solicitud'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
