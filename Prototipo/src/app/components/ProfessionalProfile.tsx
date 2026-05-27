import { useState } from 'react';
import { ArrowLeft, Camera, MapPin, Star, Upload, X, Edit2, Save, CreditCard, Banknote } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { RequestServiceModal } from './RequestServiceModal';

interface ProfessionalProfileProps {
  userData: any;
  onBack: () => void;
  isOwnProfile: boolean;
  clientData?: any;
  selectedCategory?: string;
  onViewReviews?: () => void;
  savedCards?: any[];
  sentRequests?: any[];
  onSendRequest?: (professionalId: string, professionalName: string, category: string, paymentMethod: 'efectivo' | 'tarjeta') => void;
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
  return colors[category] || 'bg-[#CCFFC4] text-[#1D1D1B]';
};

const allCategories = [
  'Limpieza', 'Construcción', 'Pintura', 'Plomería', 'Electricidad',
  'Jardinería', 'Mudanza', 'Ensamblaje de Muebles'
];

const departamentos = [
  'Ahuachapán', 'Santa Ana', 'Sonsonate', 'Chalatenango', 'La Libertad',
  'San Salvador', 'Cuscatlán', 'La Paz', 'Cabañas', 'San Vicente',
  'Usulután', 'San Miguel', 'Morazán', 'La Unión'
];

export function ProfessionalProfile({ userData, onBack, isOwnProfile, clientData, selectedCategory, onViewReviews, savedCards = [], sentRequests = [], onSendRequest }: ProfessionalProfileProps) {
  const [profilePhoto, setProfilePhoto] = useState<string>(userData.photo || '');
  const [gallery, setGallery] = useState<string[]>([
    'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400',
    'https://images.unsplash.com/photo-1562259949-e8e7689d7828?w=400',
    'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=400'
  ]);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // Editable fields
  const [editedData, setEditedData] = useState({
    name: userData.name || '',
    lastName: userData.lastName || '',
    phone: userData.phone || '',
    email: userData.email || '',
    address: userData.address || '',
    departamento: userData.departamento || '',
    yearsExperience: userData.yearsExperience || '',
    categories: userData.categories || [],
    preferredPaymentMethods: userData.preferredPaymentMethods || []
  });

  const handlePhotoUpload = () => {
    // Simulated upload
    alert('Función de carga de foto - En desarrollo');
  };

  const handleGalleryUpload = () => {
    // Simulated upload
    alert('Función de carga de galería - En desarrollo');
  };

  const handleCategoryToggle = (category: string) => {
    setEditedData(prev => ({
      ...prev,
      categories: prev.categories.includes(category)
        ? prev.categories.filter((c: string) => c !== category)
        : [...prev.categories, category]
    }));
  };

  const handlePaymentMethodToggle = (method: string) => {
    setEditedData(prev => ({
      ...prev,
      preferredPaymentMethods: prev.preferredPaymentMethods.includes(method)
        ? prev.preferredPaymentMethods.filter((m: string) => m !== method)
        : [...prev.preferredPaymentMethods, method]
    }));
  };

  const handleSaveProfile = () => {
    // Validate required fields
    if (!editedData.name || !editedData.lastName) {
      alert('Por favor completa el nombre y apellido');
      return;
    }

    if (editedData.categories.length === 0) {
      alert('Debes seleccionar al menos una categoría');
      return;
    }

    if (editedData.preferredPaymentMethods.length === 0) {
      alert('Debes seleccionar al menos un método de pago');
      return;
    }

    // Here you would save to backend
    alert('Perfil actualizado exitosamente');
    setIsEditing(false);

    // Update userData (in a real app, this would trigger a parent component update)
    Object.assign(userData, editedData);
  };

  const handleCancelEdit = () => {
    // Reset to original data
    setEditedData({
      name: userData.name || '',
      lastName: userData.lastName || '',
      phone: userData.phone || '',
      email: userData.email || '',
      address: userData.address || '',
      departamento: userData.departamento || '',
      yearsExperience: userData.yearsExperience || '',
      categories: userData.categories || [],
      preferredPaymentMethods: userData.preferredPaymentMethods || []
    });
    setIsEditing(false);
  };

  // Check if request was already sent to this professional
  const professionalId = String(userData.id || userData.email || '');
  const hasRequestSent = sentRequests.some(req => String(req.professionalId) === professionalId);

  const rating = 4.5;

  return (
    <div className="min-h-screen bg-[#FAF8F5]">
      {/* Header */}
      <header className="bg-[#685AA1] shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={onBack}
              className="flex items-center gap-2 text-white hover:text-white/80 transition-colors"
            >
              <ArrowLeft size={20} />
              <span>Volver</span>
            </button>

            {isOwnProfile && !isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-2 px-4 py-2 bg-[#FFC900] text-[#1D1D1B] font-medium rounded-lg hover:bg-[#e6b500] transition-colors"
              >
                <Edit2 size={18} />
                Editar Perfil
              </button>
            )}

            {isOwnProfile && isEditing && (
              <div className="flex gap-2">
                <button
                  onClick={handleCancelEdit}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-300 transition-colors"
                >
                  <X size={18} />
                  Cancelar
                </button>
                <button
                  onClick={handleSaveProfile}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors"
                >
                  <Save size={18} />
                  Guardar Cambios
                </button>
              </div>
            )}
          </div>
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
                <div className="w-32 h-32 rounded-full bg-[#D3CFED] flex items-center justify-center">
                  <span className="text-4xl text-[#685AA1]">
                    {userData.name?.[0]}{userData.lastName?.[0]}
                  </span>
                </div>
              )}

              {isOwnProfile && (
                <button
                  onClick={handlePhotoUpload}
                  className="absolute bottom-0 right-0 p-2 bg-[#FFC900] text-[#1D1D1B] rounded-full hover:bg-[#e6b500] transition-colors"
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

            {/* Rating */}
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
              <span className="text-gray-600">(24 reseñas)</span>
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
        </div>

        {/* Professional Details */}
        <div className="bg-white rounded-xl shadow-sm p-8 mb-6">
          <h2 className="text-2xl mb-6">Información Profesional</h2>

          <div className="space-y-6">
            {/* Personal Info - Only editable in edit mode */}
            {isEditing && isOwnProfile && (
              <div className="space-y-4 p-4 bg-[#FAF8F5] rounded-lg mb-6">
                <h3 className="font-medium text-[#1D1D1B] mb-3">Datos Personales</h3>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[#1D1D1B] mb-2">Nombre</label>
                    <input
                      type="text"
                      value={editedData.name}
                      onChange={(e) => setEditedData(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#685AA1]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#1D1D1B] mb-2">Apellido</label>
                    <input
                      type="text"
                      value={editedData.lastName}
                      onChange={(e) => setEditedData(prev => ({ ...prev, lastName: e.target.value }))}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#685AA1]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#1D1D1B] mb-2">Teléfono</label>
                  <input
                    type="text"
                    value={editedData.phone}
                    onChange={(e) => setEditedData(prev => ({ ...prev, phone: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#685AA1]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#1D1D1B] mb-2">Correo Electrónico</label>
                  <input
                    type="email"
                    value={editedData.email}
                    onChange={(e) => setEditedData(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#685AA1]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#1D1D1B] mb-2">Dirección</label>
                  <input
                    type="text"
                    value={editedData.address}
                    onChange={(e) => setEditedData(prev => ({ ...prev, address: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#685AA1]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#1D1D1B] mb-2">Departamento</label>
                  <select
                    value={editedData.departamento}
                    onChange={(e) => setEditedData(prev => ({ ...prev, departamento: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#685AA1] bg-white"
                  >
                    <option value="">Selecciona departamento</option>
                    {departamentos.map(dept => (
                      <option key={dept} value={dept}>{dept}</option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            {/* Years of Experience */}
            <div>
              <h3 className="font-medium text-[#1D1D1B] mb-2">Años de Experiencia</h3>
              {isEditing && isOwnProfile ? (
                <input
                  type="number"
                  value={editedData.yearsExperience}
                  onChange={(e) => setEditedData(prev => ({ ...prev, yearsExperience: e.target.value }))}
                  min="0"
                  className="w-full max-w-xs px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#685AA1]"
                />
              ) : (
                <p className="text-lg">{userData.yearsExperience || 0} años</p>
              )}
            </div>

            {/* Education */}
            <div>
              <h3 className="font-medium text-[#1D1D1B] mb-2">Educación</h3>
              {userData.educationType === 'titulo' ? (
                <p className="text-lg">Estudios Formales</p>
              ) : (
                <p className="text-lg">Empírico</p>
              )}
            </div>

            {/* Categories */}
            <div>
              <h3 className="font-medium text-[#1D1D1B] mb-3">Categorías de Trabajo</h3>
              {isEditing && isOwnProfile ? (
                <div className="grid grid-cols-2 gap-3">
                  {allCategories.map((category) => (
                    <label
                      key={category}
                      className={`flex items-center gap-2 p-3 border rounded-lg cursor-pointer transition-colors ${
                        editedData.categories.includes(category)
                          ? 'bg-[#D3CFED] border-[#685AA1]'
                          : 'border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={editedData.categories.includes(category)}
                        onChange={() => handleCategoryToggle(category)}
                        className="rounded text-[#685AA1] focus:ring-[#685AA1]"
                      />
                      <span className="text-sm">{category}</span>
                    </label>
                  ))}
                </div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {(userData.categories || []).map((category: string) => (
                    <span
                      key={category}
                      className={`px-4 py-2 ${getCategoryColor(category)} font-medium rounded-full`}
                    >
                      {category}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Preferred Payment Methods */}
            <div>
              <h3 className="font-medium text-[#1D1D1B] mb-3">Métodos de Pago Preferidos</h3>
              {isEditing && isOwnProfile ? (
                <div className="grid grid-cols-2 gap-3">
                  <label
                    className={`flex items-center gap-2 p-3 border rounded-lg cursor-pointer transition-colors ${
                      editedData.preferredPaymentMethods.includes('efectivo')
                        ? 'bg-[#D3CFED] border-[#685AA1]'
                        : 'border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={editedData.preferredPaymentMethods.includes('efectivo')}
                      onChange={() => handlePaymentMethodToggle('efectivo')}
                      className="rounded text-[#685AA1] focus:ring-[#685AA1]"
                    />
                    <Banknote size={20} className="text-gray-600" />
                    <span className="text-sm">Efectivo</span>
                  </label>

                  <label
                    className={`flex items-center gap-2 p-3 border rounded-lg cursor-pointer transition-colors ${
                      editedData.preferredPaymentMethods.includes('tarjeta')
                        ? 'bg-[#D3CFED] border-[#685AA1]'
                        : 'border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={editedData.preferredPaymentMethods.includes('tarjeta')}
                      onChange={() => handlePaymentMethodToggle('tarjeta')}
                      className="rounded text-[#685AA1] focus:ring-[#685AA1]"
                    />
                    <CreditCard size={20} className="text-gray-600" />
                    <span className="text-sm">Tarjeta</span>
                  </label>
                </div>
              ) : (
                <div className="flex gap-3">
                  {(userData.preferredPaymentMethods || []).includes('efectivo') && (
                    <div className="flex items-center gap-2 px-4 py-2 bg-green-50 border border-green-200 rounded-lg">
                      <Banknote size={20} className="text-green-600" />
                      <span className="text-sm text-green-700 font-medium">Efectivo</span>
                    </div>
                  )}
                  {(userData.preferredPaymentMethods || []).includes('tarjeta') && (
                    <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 border border-blue-200 rounded-lg">
                      <CreditCard size={20} className="text-blue-600" />
                      <span className="text-sm text-blue-700 font-medium">Tarjeta</span>
                    </div>
                  )}
                  {(!userData.preferredPaymentMethods || userData.preferredPaymentMethods.length === 0) && (
                    <p className="text-gray-500 text-sm">No especificado</p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Work Gallery */}
        <div className="bg-white rounded-xl shadow-sm p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl">Galería de Trabajos</h2>
            {isOwnProfile && (
              <button
                onClick={handleGalleryUpload}
                className="flex items-center gap-2 px-4 py-2 bg-[#FFC900] text-[#1D1D1B] font-medium rounded-lg hover:bg-[#e6b500] transition-colors"
              >
                <Upload size={18} />
                Subir Foto
              </button>
            )}
          </div>

          {gallery.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <p>No hay fotos en la galería</p>
              {isOwnProfile && (
                <p className="text-sm mt-2">Sube fotos de tus trabajos para que los clientes puedan verlos</p>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {gallery.map((photo, index) => (
                <div key={index} className="relative group">
                  <ImageWithFallback
                    src={photo}
                    alt={`Trabajo ${index + 1}`}
                    className="w-full h-48 object-cover rounded-lg"
                  />
                  {isOwnProfile && (
                    <button
                      onClick={() => setGallery(gallery.filter((_, i) => i !== index))}
                      className="absolute top-2 right-2 p-2 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X size={16} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Request Service Button for Clients */}
        {!isOwnProfile && clientData && (
          <div className="bg-white rounded-xl shadow-sm p-8 mt-6">
            <h2 className="text-2xl mb-4">¿Interesado en este profesional?</h2>
            <p className="text-gray-600 mb-6">
              {hasRequestSent
                ? 'Ya has enviado una solicitud a este profesional. Recibirás una notificación cuando responda.'
                : 'Envía una solicitud con los detalles de tu proyecto y espera la respuesta del profesional.'}
            </p>
            <button
              onClick={() => !hasRequestSent && setShowRequestModal(true)}
              disabled={hasRequestSent}
              className={`w-full px-6 py-3 font-medium rounded-lg transition-colors ${
                hasRequestSent
                  ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                  : 'bg-[#FFC900] text-[#1D1D1B] hover:bg-[#e6b500]'
              }`}
            >
              {hasRequestSent ? 'Solicitud Enviada' : 'Enviar Solicitud'}
            </button>
          </div>
        )}
      </div>

      {/* Request Service Modal */}
      {clientData && (
        <RequestServiceModal
          isOpen={showRequestModal}
          onClose={() => setShowRequestModal(false)}
          clientData={clientData}
          professionalName={`${userData.name}${userData.lastName ? ' ' + userData.lastName : ''}`}
          professionalId={professionalId}
          category={selectedCategory || userData.categories?.[0] || 'Servicio General'}
          savedCards={savedCards}
          onSendRequest={onSendRequest}
        />
      )}
    </div>
  );
}
