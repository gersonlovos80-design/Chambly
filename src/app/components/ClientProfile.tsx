import { useState } from 'react';
import { ArrowLeft, Camera, MapPin, User, Star } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface ClientProfileProps {
  userData: any;
  onBack: () => void;
  isOwnProfile: boolean;
  onViewReviews?: () => void;
}

export function ClientProfile({ userData, onBack, isOwnProfile, onViewReviews }: ClientProfileProps) {
  const [profilePhoto, setProfilePhoto] = useState<string>(userData.photo || '');

  const handlePhotoUpload = () => {
    // Simulated upload
    alert('Función de carga de foto - En desarrollo');
  };

  const rating = 4.7; // Mock rating for clients

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
        {/* Profile Header */}
        <div className="bg-white rounded-xl shadow-sm p-8 mb-6">
          <div className="flex flex-col items-center">
            {/* Profile Photo */}
            <div className="relative mb-4">
              {profilePhoto ? (
                <ImageWithFallback
                  src={profilePhoto}
                  alt={`${userData.name} ${userData.lastName}`}
                  className="w-32 h-32 rounded-full object-cover"
                />
              ) : (
                <div className="w-32 h-32 rounded-full bg-indigo-100 flex items-center justify-center">
                  <User size={64} className="text-[#685AA1]" />
                </div>
              )}

              {isOwnProfile && (
                <button
                  onClick={handlePhotoUpload}
                  className="absolute bottom-0 right-0 p-2 bg-[#FFC900] text-[#1D1D1B] font-medium rounded-full hover:bg-[#e6b500] transition-colors"
                >
                  <Camera size={18} />
                </button>
              )}
            </div>

            {/* Name */}
            <h1 className="text-3xl mb-2">{userData.name}{userData.lastName ? ' ' + userData.lastName : ''}</h1>

            {/* Location */}
            <div className="flex items-center gap-2 text-gray-600 mb-3">
              <MapPin size={18} />
              <span>{userData.departamento}</span>
            </div>

            {/* Rating - shown to professionals viewing client */}
            {!isOwnProfile && (
              <div className="flex flex-col items-center">
                <div className="flex items-center gap-2 mb-2">
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
                  <span className="text-gray-600">(15 reseñas)</span>
                </div>

                {/* View Reviews Link */}
                {onViewReviews && (
                  <button
                    onClick={onViewReviews}
                    className="text-[#685AA1] hover:underline text-sm font-medium mb-4"
                  >
                    Ver todas las reseñas
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Personal Information - Only for own profile */}
        {isOwnProfile && (
          <div className="bg-white rounded-xl shadow-sm p-8">
            <h2 className="text-2xl mb-6">Información Personal</h2>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-[#1D1D1B] mb-1">Nombre</h3>
                  <p className="text-lg">{userData.name}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-[#1D1D1B] mb-1">Apellido</h3>
                  <p className="text-lg">{userData.lastName}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-[#1D1D1B] mb-1">Correo Electrónico</h3>
                  <p className="text-lg">{userData.email}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-[#1D1D1B] mb-1">Teléfono</h3>
                  <p className="text-lg">{userData.phone}</p>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-[#1D1D1B] mb-1">Dirección</h3>
                <p className="text-lg">{userData.address}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-[#1D1D1B] mb-1">Departamento</h3>
                  <p className="text-lg">{userData.departamento}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-[#1D1D1B] mb-1">DUI</h3>
                  <p className="text-lg">{userData.dui}</p>
                </div>
              </div>

              <div className="pt-6 border-t">
                <button className="px-6 py-3 bg-[#FFC900] text-[#1D1D1B] font-medium rounded-lg hover:bg-[#e6b500] transition-colors">
                  Editar Información
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Limited info for professionals viewing client */}
        {!isOwnProfile && (
          <>
            <div className="bg-white rounded-xl shadow-sm p-8 mb-6">
              <h2 className="text-2xl mb-6">Sobre el Cliente</h2>
              <p className="text-gray-600">
                Cliente verificado con calificación de {rating} estrellas basada en trabajos anteriores.
                La información de contacto completa se compartirá una vez aceptes la solicitud.
              </p>
            </div>

            {/* Payment Reliability Metrics */}
            <div className="bg-white rounded-xl shadow-sm p-8">
              <h2 className="text-2xl mb-6">Confiabilidad de Pagos</h2>

              <div className="grid grid-cols-2 gap-6 mb-6">
                {/* Payment Success Rate */}
                <div className="bg-[#FAF8F5] rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-2">Tasa de Pagos Exitosos</p>
                  <div className="flex items-baseline gap-2">
                    <p className="text-3xl font-medium text-green-600">95%</p>
                    <p className="text-sm text-gray-500">(19/20 pagos)</p>
                  </div>
                </div>

                {/* Total Transactions */}
                <div className="bg-[#FAF8F5] rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-2">Total de Transacciones</p>
                  <p className="text-3xl font-medium text-[#1D1D1B]">20</p>
                </div>
              </div>

              {/* Payment Method Preference */}
              <div className="mb-6">
                <p className="text-sm font-medium text-[#1D1D1B] mb-3">Métodos de Pago Utilizados</p>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg">
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-[#1D1D1B]">Efectivo</p>
                      <p className="text-xs text-gray-500">60% (12 pagos)</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg">
                    <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-[#1D1D1B]">Tarjeta</p>
                      <p className="text-xs text-gray-500">40% (8 pagos)</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Trust Badge */}
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-sm font-medium text-green-800 mb-1">
                  ✓ Cliente Confiable
                </p>
                <p className="text-xs text-green-700">
                  Este cliente tiene un historial de pagos consistente y ha completado múltiples servicios exitosamente.
                </p>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
