import { ArrowLeft, MapPin, Star, Calendar, DollarSign } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { useState } from 'react';
import { RequestServiceModal } from './RequestServiceModal';

interface RequestDetailsProps {
  onBack: () => void;
  professionalData: any;
  requestData: any;
  clientData: any;
}

const getCategoryColor = (category: string): string => {
  const colors: { [key: string]: string } = {
    'Limpieza': 'bg-[#E8F0FE] text-[#1D1D1B]',
    'Construcción': 'bg-[#FFEFE2] text-[#1D1D1B]',
    'Pintura': 'bg-[#F3E8FF] text-[#1D1D1B]',
    'Plomería': 'bg-[#D7F9FF] text-[#1D1D1B]',
    'Electricidad': 'bg-[#FFF9C4] text-[#1D1D1B]',
    'Jardinería': 'bg-[#E2FBE5] text-[#1D1D1B]',
    'Mudanza': 'bg-[#FFEBEE] text-[#1D1D1B]',
    'Ensamblaje de Muebles': 'bg-[#E8EAF6] text-[#1D1D1B]'
  };
  return colors[category] || 'bg-[#D3CFED] text-[#685AA1]';
};

export function RequestDetails({ onBack, professionalData, requestData, clientData }: RequestDetailsProps) {
  const [showRequestModal, setShowRequestModal] = useState(false);
  const rating = 4.8;

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
        {/* Professional Profile */}
        <div className="bg-white rounded-xl shadow-sm p-8 mb-6">
          <div className="flex flex-col items-center">
            {/* Profile Photo */}
            <div className="relative mb-4">
              {professionalData.photo ? (
                <ImageWithFallback
                  src={professionalData.photo}
                  alt={`${professionalData.name} ${professionalData.lastName}`}
                  className="w-32 h-32 rounded-full object-cover"
                />
              ) : (
                <div className="w-32 h-32 rounded-full bg-[#D3CFED] flex items-center justify-center">
                  <span className="text-4xl text-[#685AA1]">
                    {professionalData.name?.[0]}{professionalData.lastName?.[0]}
                  </span>
                </div>
              )}
            </div>

            {/* Name */}
            <h1 className="text-3xl mb-2 text-[#1D1D1B]">
              {professionalData.name}{professionalData.lastName ? ' ' + professionalData.lastName : ''}
            </h1>

            {/* Location */}
            <div className="flex items-center gap-2 text-gray-600 mb-3">
              <MapPin size={18} />
              <span>{professionalData.departamento}</span>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-2 mb-4">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={20}
                    className={i < Math.floor(rating) ? 'fill-[#FFC900] text-[#FFC900]' : 'text-gray-300'}
                  />
                ))}
              </div>
              <span className="text-lg font-medium">{rating}</span>
              <span className="text-gray-600">(32 reseñas)</span>
            </div>

            {/* Categories */}
            <div className="flex flex-wrap gap-2 justify-center">
              {professionalData.categories?.map((category: string) => (
                <span
                  key={category}
                  className={`px-3 py-1 ${getCategoryColor(category)} font-medium rounded-full text-sm`}
                >
                  {category}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Request Details */}
        <div className="bg-white rounded-xl shadow-sm p-8 mb-6">
          <h2 className="text-2xl mb-6 text-[#1D1D1B]">Detalles de la Solicitud</h2>

          <div className="space-y-4">
            {/* Service Type */}
            <div>
              <h3 className="font-medium text-[#1D1D1B] mb-2">Tipo de Servicio</h3>
              <div className="flex items-center gap-2">
                <span className={`px-4 py-2 ${getCategoryColor(requestData.jobType)} font-medium rounded-lg`}>
                  {requestData.jobType}
                </span>
              </div>
            </div>

            {/* Description */}
            <div>
              <h3 className="font-medium text-[#1D1D1B] mb-2">Descripción del Trabajo</h3>
              <p className="text-gray-700">{requestData.description}</p>
            </div>

            {/* Date */}
            {requestData.date && (
              <div>
                <h3 className="font-medium text-[#1D1D1B] mb-2">Fecha Solicitada</h3>
                <div className="flex items-center gap-2 text-gray-700">
                  <Calendar size={18} />
                  <span>{requestData.date}</span>
                </div>
              </div>
            )}

            {/* Budget */}
            {requestData.budget && (
              <div>
                <h3 className="font-medium text-[#1D1D1B] mb-2">Presupuesto</h3>
                <div className="flex items-center gap-2 text-green-600 font-medium">
                  <DollarSign size={18} />
                  <span>{requestData.budget}</span>
                </div>
              </div>
            )}

            {/* Status */}
            <div>
              <h3 className="font-medium text-[#1D1D1B] mb-2">Estado</h3>
              <span className="inline-block px-4 py-2 bg-green-100 text-green-700 font-medium rounded-lg">
                Completado
              </span>
            </div>
          </div>
        </div>

        {/* Request Again Section */}
        <div className="bg-white rounded-xl shadow-sm p-8">
          <h2 className="text-2xl mb-4 text-[#1D1D1B]">¿Necesitas el servicio de nuevo?</h2>
          <p className="text-gray-600 mb-6">
            Si quedaste satisfecho con el trabajo de {professionalData.name}, puedes solicitar el servicio nuevamente.
          </p>
          <button
            onClick={() => setShowRequestModal(true)}
            className="w-full px-6 py-3 bg-[#FFC900] text-[#1D1D1B] font-medium rounded-lg hover:bg-[#e6b500] transition-colors"
          >
            Solicitar de Nuevo
          </button>
        </div>
      </div>

      {/* Request Service Modal */}
      <RequestServiceModal
        isOpen={showRequestModal}
        onClose={() => setShowRequestModal(false)}
        clientData={clientData}
        professionalName={`${professionalData.name}${professionalData.lastName ? ' ' + professionalData.lastName : ''}`}
        category={requestData.jobType}
      />
    </div>
  );
}
