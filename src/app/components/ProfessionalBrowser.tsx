import { useState } from 'react';
import { ArrowLeft, Star, MapPin, Filter, CreditCard, Banknote } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface ProfessionalBrowserProps {
  category: string;
  onBack: () => void;
  onViewProfile: (professional: any) => void;
}

const departamentos = [
  'Ahuachapán', 'Santa Ana', 'Sonsonate', 'Chalatenango', 'La Libertad',
  'San Salvador', 'Cuscatlán', 'La Paz', 'Cabañas', 'San Vicente',
  'Usulután', 'San Miguel', 'Morazán', 'La Unión'
];

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

const mockProfessionals = [
  {
    id: 1,
    name: 'María',
    lastName: 'Rodríguez',
    photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop',
    departamento: 'San Salvador',
    rating: 4.8,
    reviewCount: 32,
    yearsExperience: 5,
    educationType: 'empirico',
    categories: ['Limpieza', 'Jardinería'],
    price: '$15-20/hora',
    preferredPaymentMethods: ['efectivo', 'tarjeta']
  },
  {
    id: 2,
    name: 'Carlos',
    lastName: 'Méndez',
    photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop',
    departamento: 'La Libertad',
    rating: 4.5,
    reviewCount: 18,
    yearsExperience: 8,
    educationType: 'titulo',
    categories: ['Construcción', 'Pintura'],
    price: '$25-30/hora',
    preferredPaymentMethods: ['tarjeta']
  },
  {
    id: 3,
    name: 'Ana',
    lastName: 'López',
    photo: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop',
    departamento: 'San Salvador',
    rating: 4.9,
    reviewCount: 45,
    yearsExperience: 3,
    educationType: 'empirico',
    categories: ['Limpieza'],
    price: '$12-18/hora',
    preferredPaymentMethods: ['efectivo']
  },
  {
    id: 4,
    name: 'Roberto',
    lastName: 'Silva',
    photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop',
    departamento: 'Santa Ana',
    rating: 4.7,
    reviewCount: 28,
    yearsExperience: 10,
    educationType: 'titulo',
    categories: ['Electricidad', 'Plomería'],
    price: '$30-35/hora',
    preferredPaymentMethods: ['tarjeta', 'efectivo']
  },
  {
    id: 5,
    name: 'Patricia',
    lastName: 'Flores',
    photo: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=200&h=200&fit=crop',
    departamento: 'San Salvador',
    rating: 4.6,
    reviewCount: 21,
    yearsExperience: 4,
    educationType: 'empirico',
    categories: ['Limpieza', 'Ensamblaje de Muebles'],
    price: '$14-19/hora',
    preferredPaymentMethods: ['efectivo', 'tarjeta']
  },
  {
    id: 6,
    name: 'José',
    lastName: 'Ramírez',
    photo: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&h=200&fit=crop',
    departamento: 'San Miguel',
    rating: 4.9,
    reviewCount: 52,
    yearsExperience: 12,
    educationType: 'titulo',
    categories: ['Plomería', 'Electricidad', 'Construcción'],
    price: '$35-40/hora',
    preferredPaymentMethods: ['tarjeta']
  },
  {
    id: 7,
    name: 'Sofía',
    lastName: 'Hernández',
    photo: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&h=200&fit=crop',
    departamento: 'La Libertad',
    rating: 4.8,
    reviewCount: 38,
    yearsExperience: 6,
    educationType: 'empirico',
    categories: ['Pintura', 'Limpieza'],
    price: '$18-22/hora',
    preferredPaymentMethods: ['efectivo', 'tarjeta']
  }
];

export function ProfessionalBrowser({ category, onBack, onViewProfile }: ProfessionalBrowserProps) {
  const [selectedDepartamento, setSelectedDepartamento] = useState<string>('');
  const [minRating, setMinRating] = useState<number>(0);

  // Filter professionals by category
  const categoryFiltered = mockProfessionals.filter(prof =>
    prof.categories.includes(category)
  );

  // Apply departamento and rating filters
  const filteredProfessionals = categoryFiltered.filter(prof => {
    const matchesDepartamento = selectedDepartamento ? prof.departamento === selectedDepartamento : true;
    const matchesRating = minRating > 0 ? prof.rating >= minRating : true;
    return matchesDepartamento && matchesRating;
  });

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

      <div className="max-w-7xl mx-auto px-4 py-8 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        {/* Title */}
        <div className="mb-6">
          <h1 className="text-3xl mb-2">Profesionales de {category}</h1>
          <p className="text-gray-600">{filteredProfessionals.length} profesionales encontrados</p>
        </div>

        {/* Filter Section */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="flex items-center gap-4 mb-4">
            <Filter size={20} className="text-gray-600" />
            <span className="font-medium text-[#1D1D1B]">Filtros</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Departamento Filter */}
            <div>
              <label className="block text-sm mb-2 text-[#1D1D1B]">Departamento</label>
              <select
                value={selectedDepartamento}
                onChange={(e) => setSelectedDepartamento(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#685AA1] bg-white"
              >
                <option value="">Todos los Departamentos</option>
                {departamentos.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>

            {/* Rating Filter */}
            <div>
              <label className="block text-sm mb-2 text-[#1D1D1B]">Calificación Mínima</label>
              <select
                value={minRating}
                onChange={(e) => setMinRating(Number(e.target.value))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#685AA1] bg-white"
              >
                <option value="0">Todas las Calificaciones</option>
                <option value="4.5">⭐ 4.5 o más</option>
                <option value="4.0">⭐ 4.0 o más</option>
                <option value="3.5">⭐ 3.5 o más</option>
                <option value="3.0">⭐ 3.0 o más</option>
              </select>
            </div>
          </div>

          {(selectedDepartamento || minRating > 0) && (
            <div className="mt-4 flex justify-end">
              <button
                onClick={() => {
                  setSelectedDepartamento('');
                  setMinRating(0);
                }}
                className="px-4 py-2 text-sm text-[#685AA1] hover:text-[#685AA1]/80 underline"
              >
                Limpiar Todos los Filtros
              </button>
            </div>
          )}
        </div>

        {/* Professionals List */}
        {filteredProfessionals.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <p className="text-gray-600 text-lg mb-2">No hay profesionales disponibles</p>
            <p className="text-gray-500 text-sm">
              {selectedDepartamento || minRating > 0
                ? 'Intenta ajustar los filtros para ver más resultados'
                : `No hay profesionales de ${category} disponibles en este momento`
              }
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredProfessionals.map((professional) => (
              <div
                key={professional.id}
                className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-6"
              >
                <div className="flex gap-6">
                  {/* Profile Photo - Small Circle */}
                  <div className="flex-shrink-0">
                    <ImageWithFallback
                      src={professional.photo}
                      alt={`${professional.name} ${professional.lastName}`}
                      className="w-24 h-24 rounded-full object-cover"
                    />
                  </div>

                  {/* Professional Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="text-2xl font-medium text-[#1D1D1B]">
                          {professional.name} {professional.lastName}
                        </h3>
                        <div className="flex items-center gap-2 text-gray-600 mt-1">
                          <MapPin size={16} />
                          <span className="text-sm">{professional.departamento}</span>
                        </div>
                      </div>

                      {/* Rating Badge */}
                      <div className="flex items-center gap-1 px-3 py-1 bg-[#FFF9C4] rounded-full">
                        <Star size={18} className="fill-[#FFC900] text-[#FFC900]" />
                        <span className="font-medium text-[#1D1D1B]">{professional.rating}</span>
                      </div>
                    </div>

                    {/* Experience and Reviews */}
                    <div className="flex items-center gap-3 text-gray-600 mb-3">
                      <span className="text-sm">{professional.reviewCount} reseñas</span>
                      <span className="text-gray-400">•</span>
                      <span className="text-sm">{professional.yearsExperience} años de experiencia</span>
                      <span className="text-gray-400">•</span>
                      <span className="text-sm capitalize">{professional.educationType === 'titulo' ? 'Titulado' : 'Empírico'}</span>
                    </div>

                    {/* Categories */}
                    <div className="flex flex-wrap gap-2 mb-3">
                      {professional.categories.map(cat => (
                        <span
                          key={cat}
                          className={`px-3 py-1 ${getCategoryColor(cat)} font-medium rounded-full text-sm`}
                        >
                          {cat}
                        </span>
                      ))}
                    </div>

                    {/* Preferred Payment Methods */}
                    <div className="flex items-center gap-2 mb-4">
                      <span className="text-xs text-gray-600">Métodos de pago:</span>
                      <div className="flex gap-2">
                        {professional.preferredPaymentMethods.includes('efectivo') && (
                          <div className="flex items-center gap-1 px-2 py-1 bg-green-50 border border-green-200 rounded-md">
                            <Banknote size={14} className="text-green-600" />
                            <span className="text-xs text-green-700 font-medium">Efectivo</span>
                          </div>
                        )}
                        {professional.preferredPaymentMethods.includes('tarjeta') && (
                          <div className="flex items-center gap-1 px-2 py-1 bg-blue-50 border border-blue-200 rounded-md">
                            <CreditCard size={14} className="text-blue-600" />
                            <span className="text-xs text-blue-700 font-medium">Tarjeta</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Price and Action */}
                    <div className="flex items-center justify-between pt-4 border-t">
                      <span className="text-xl font-medium text-green-600">
                        {professional.price}
                      </span>
                      <button
                        onClick={() => onViewProfile(professional)}
                        className="px-6 py-2 bg-[#FFC900] text-[#1D1D1B] font-medium rounded-lg hover:bg-[#e6b500] transition-colors"
                      >
                        Ver Perfil Completo
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
