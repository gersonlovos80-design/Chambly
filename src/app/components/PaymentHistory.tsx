import { ArrowLeft, Banknote, CreditCard, Filter, Calendar, DollarSign, CheckCircle, Clock } from 'lucide-react';
import { useState } from 'react';

interface Transaction {
  id: string;
  serviceId: string;
  clientId: string;
  clientName: string;
  clientPhoto: string;
  professionalId: string;
  serviceName: string;
  amount: number;
  paymentMethod: 'efectivo' | 'tarjeta';
  paymentStatus: 'pendiente' | 'completado';
  date: string;
  description: string;
}

interface PaymentHistoryProps {
  onBack: () => void;
  transactions: Transaction[];
  userType: 'client' | 'professional';
  isLoading: boolean;
  error: string;
}

const getStatusColor = (status: string) => {
  const colors = {
    'completado': 'bg-green-100 text-green-700',
    'pendiente': 'bg-yellow-100 text-yellow-700'
  };
  return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-700';
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'completado':
      return <CheckCircle size={16} />;
    case 'pendiente':
      return <Clock size={16} />;
    default:
      return <Clock size={16} />;
  }
};

const getStatusText = (status: string) => {
  const texts = { 'completado': 'Completado', 'pendiente': 'Pendiente' };
  return texts[status as keyof typeof texts] || status;
};

export function PaymentHistory({ onBack, transactions, userType, isLoading, error }: PaymentHistoryProps) {
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filteredTransactions = statusFilter === 'all'
    ? transactions
    : transactions.filter(t => t.paymentStatus === statusFilter);

  const totalEarned = transactions
    .filter(t => t.paymentStatus === 'completado')
    .reduce((sum, t) => sum + t.amount, 0);

  const pendingAmount = transactions
    .filter(t => t.paymentStatus === 'pendiente')
    .reduce((sum, t) => sum + t.amount, 0);


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
        <div className="mb-6">
          <h1 className="text-3xl mb-2 text-[#1D1D1B]">Historial de Pagos</h1>
          <p className="text-gray-600">Consulta los pagos de tus servicios</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 gap-4 mb-6 md:grid-cols-2">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-green-100 rounded-lg">
                <DollarSign size={24} className="text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">{userType === 'professional' ? 'Total recibido' : 'Total pagado'}</p>
                <p className="text-2xl font-medium text-green-600">${totalEarned.toFixed(2)}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Clock size={24} className="text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Pagos Pendientes</p>
                <p className="text-2xl font-medium text-yellow-600">${pendingAmount.toFixed(2)}</p>
              </div>
            </div>
          </div>

        </div>

        {/* Filter Section */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="flex items-center gap-4">
            <Filter size={20} className="text-gray-600" />
            <div className="flex-1">
              <label className="block text-sm mb-2 text-[#1D1D1B]">Filtrar por Estado</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#685AA1] bg-white"
              >
                <option value="all">Todos los Estados</option>
                <option value="completado">Completado</option>
                <option value="pendiente">Pendiente</option>
              </select>
            </div>
          </div>
        </div>

        {/* Transactions List */}
        <div className="space-y-4">
          {error ? (
            <div role="alert" className="rounded-xl border border-red-200 bg-red-50 p-6 text-red-700">
              No se pudo cargar el historial de pagos: {error}
            </div>
          ) : isLoading ? (
            <div className="rounded-xl bg-white p-12 text-center text-gray-600">Cargando historial de pagos...</div>
          ) : filteredTransactions.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm p-12 text-center">
              <DollarSign size={64} className="mx-auto mb-4 text-gray-300" />
              <h3 className="text-xl font-medium text-gray-600 mb-2">
                No hay transacciones
              </h3>
              <p className="text-gray-500">
                {statusFilter === 'all'
                  ? 'Aún no tienes transacciones registradas'
                  : `No hay transacciones con estado "${getStatusText(statusFilter)}"`
                }
              </p>
            </div>
          ) : (
            filteredTransactions.map((transaction) => (
              <div
                key={transaction.id}
                className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-4 flex-1">
                    {/* Payment Method Icon */}
                    <div className={`p-3 rounded-lg ${
                      transaction.paymentMethod === 'efectivo'
                        ? 'bg-green-100'
                        : 'bg-blue-100'
                    }`}>
                      {transaction.paymentMethod === 'efectivo' ? (
                        <Banknote size={24} className="text-green-600" />
                      ) : (
                        <CreditCard size={24} className="text-blue-600" />
                      )}
                    </div>

                    {/* Transaction Details */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="text-lg font-medium text-[#1D1D1B]">
                            {transaction.serviceName}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {userType === 'professional' ? 'Cliente' : 'Profesional'}: {transaction.clientName}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-medium text-green-600">
                            ${transaction.amount.toFixed(2)}
                          </p>
                          <p className="text-xs text-gray-500 capitalize">
                            {transaction.paymentMethod}
                          </p>
                        </div>
                      </div>

                      <p className="text-sm text-gray-700 mb-3">
                        {transaction.description}
                      </p>

                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Calendar size={14} />
                          <span>{transaction.date}</span>
                        </div>

                        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(transaction.paymentStatus)}`}>
                          {getStatusIcon(transaction.paymentStatus)}
                          {getStatusText(transaction.paymentStatus)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action for unpaid transactions */}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
