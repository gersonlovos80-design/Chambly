import { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowLeft, Camera, MapPin, Star, X, Edit2, Save, CreditCard, Banknote, Plus, Trash2, ImagePlus, Loader2 } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { RequestServiceModal, type ServiceRequestPayload } from './RequestServiceModal';
import { ScheduleModal, WorkSchedule } from './ScheduleModal';
import {
  obtenerPortafolio,
  crearTrabajoPortafolio,
  agregarFotosPortafolio,
  eliminarFotoPortafolio,
  actualizarTituloPortafolio
} from '../../services/api';

interface ProfessionalProfileProps {
  userData: any;
  onBack: () => void;
  isOwnProfile: boolean;
  clientData?: any;
  selectedCategory?: string;
  onViewReviews?: () => void;
  sentRequests?: any[];
  onSendRequest?: (payload: ServiceRequestPayload) => Promise<void>;
}

interface PortfolioPhoto {
  id: number | string;
  url: string;
  ruta_archivo?: string;
  mime_type?: string;
}

interface PortfolioWork {
  id: number | string;
  titulo: string;
  fotos: PortfolioPhoto[];
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

const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png'];
const ALLOWED_IMAGE_EXTENSIONS = ['jpg', 'jpeg', 'png'];

function archivoImagenValido(file: File): boolean {
  const typeOk = ALLOWED_IMAGE_TYPES.includes(file.type);
  const ext = file.name.split('.').pop()?.toLowerCase() || '';
  const extOk = ALLOWED_IMAGE_EXTENSIONS.includes(ext);
  return typeOk || extOk;
}

function obtenerIdProfesionalPortafolio(userData: any): string {
  const id = userData?.perfil_profesional_id
    ?? userData?.perfilProfesionalId
    ?? userData?.id
    ?? userData?.usuario_id
    ?? userData?.profesional_id
    ?? userData?.profiles?.professional?.id
    ?? userData?.accountId
    ?? '';
  return id === null || id === undefined ? '' : String(id);
}

export function ProfessionalProfile({ userData, onBack, isOwnProfile, clientData, selectedCategory, onViewReviews, sentRequests = [], onSendRequest }: ProfessionalProfileProps) {
  const [profilePhoto, setProfilePhoto] = useState<string>(userData.photo || '');
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [openSchedule, setOpenSchedule] = useState(false);
  const [schedule, setSchedule] = useState<WorkSchedule>(() => {
    const saved = localStorage.getItem('chambly_my_schedule');
    return saved
      ? JSON.parse(saved)
      : { days: 'lunes a sabado', hours: '08:00 AM - 05:00 PM' };
  });

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

  const portfolioOwnerId = useMemo(() => obtenerIdProfesionalPortafolio(userData), [userData]);
  const [portfolioWorks, setPortfolioWorks] = useState<PortfolioWork[]>([]);
  const [loadingPortfolio, setLoadingPortfolio] = useState(false);
  const [portfolioLoadError, setPortfolioLoadError] = useState('');
  const [portfolioMessage, setPortfolioMessage] = useState('');
  const [portfolioActionError, setPortfolioActionError] = useState('');
  const [savingNewWork, setSavingNewWork] = useState(false);
  const [addingPhotosWorkId, setAddingPhotosWorkId] = useState<string | number | null>(null);
  const [deletingPhotoId, setDeletingPhotoId] = useState<string | number | null>(null);
  const [savingTitleWorkId, setSavingTitleWorkId] = useState<string | number | null>(null);
  const [showNewWorkForm, setShowNewWorkForm] = useState(false);
  const [newWorkTitle, setNewWorkTitle] = useState('');
  const [newWorkFiles, setNewWorkFiles] = useState<File[]>([]);
  const [newWorkPreviews, setNewWorkPreviews] = useState<string[]>([]);
  const [newWorkError, setNewWorkError] = useState('');
  const [editingTitles, setEditingTitles] = useState<Record<string, string>>({});
  const newWorkInputRef = useRef<HTMLInputElement | null>(null);
  const addPhotosInputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  useEffect(() => {
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
    setProfilePhoto(userData.photo || '');
  }, [userData]);

  useEffect(() => {
    return () => {
      newWorkPreviews.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [newWorkPreviews]);

  useEffect(() => {
    if (!portfolioOwnerId) {
      setPortfolioWorks([]);
      setPortfolioLoadError('');
      return;
    }
    let cancelled = false;
    setLoadingPortfolio(true);
    setPortfolioLoadError('');
    obtenerPortafolio(portfolioOwnerId)
      .then((result) => {
        if (cancelled) return;
        setPortfolioWorks(Array.isArray(result.trabajos) ? result.trabajos : []);
      })
      .catch((error) => {
        if (cancelled) return;
        console.error('No se pudo cargar el portafolio:', error);
        setPortfolioWorks([]);
        setPortfolioLoadError(error instanceof Error ? error.message : 'No se pudo cargar el portafolio.');
      })
      .finally(() => {
        if (!cancelled) setLoadingPortfolio(false);
      });
    return () => { cancelled = true; };
  }, [portfolioOwnerId]);

  const handlePhotoUpload = () => {
    alert('Función de carga de foto de perfil - En desarrollo');
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
    alert('Perfil actualizado exitosamente');
    setIsEditing(false);
    Object.assign(userData, editedData);
  };

  const handleCancelEdit = () => {
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

  const resetNewWorkForm = () => {
    newWorkPreviews.forEach((url) => URL.revokeObjectURL(url));
    setNewWorkTitle('');
    setNewWorkFiles([]);
    setNewWorkPreviews([]);
    setNewWorkError('');
    setShowNewWorkForm(false);
    if (newWorkInputRef.current) newWorkInputRef.current.value = '';
  };

  const handleSelectNewWorkFiles = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (files.length === 0) return;
    const invalid = files.filter((file) => !archivoImagenValido(file));
    const valid = files.filter((file) => archivoImagenValido(file));
    if (invalid.length > 0) {
      setNewWorkError('Solo se permiten imágenes en formato JPG o PNG.');
    } else {
      setNewWorkError('');
    }
    if (valid.length > 0) {
      const previews = valid.map((file) => URL.createObjectURL(file));
      setNewWorkFiles((prev) => [...prev, ...valid]);
      setNewWorkPreviews((prev) => [...prev, ...previews]);
    }
    event.target.value = '';
  };

  const handleRemoveNewWorkFile = (index: number) => {
    setNewWorkFiles((prev) => prev.filter((_, i) => i !== index));
    setNewWorkPreviews((prev) => {
      const url = prev[index];
      if (url) URL.revokeObjectURL(url);
      return prev.filter((_, i) => i !== index);
    });
  };

  const handleCreateWork = async () => {
    setPortfolioActionError('');
    setPortfolioMessage('');
    const titulo = newWorkTitle.trim();
    if (!titulo) {
      setNewWorkError('El título del trabajo es obligatorio.');
      return;
    }
    if (newWorkFiles.length < 3) {
      setNewWorkError('Debes agregar al menos 3 fotos para guardar este trabajo.');
      return;
    }
    if (newWorkFiles.some((file) => !archivoImagenValido(file))) {
      setNewWorkError('Solo se permiten imágenes en formato JPG o PNG.');
      return;
    }

    setSavingNewWork(true);
    try {
      const result = await crearTrabajoPortafolio({ titulo, fotos: newWorkFiles });
      if (Array.isArray(result.trabajos)) {
        setPortfolioWorks(result.trabajos);
      } else if (portfolioOwnerId) {
        const refreshed = await obtenerPortafolio(portfolioOwnerId);
        setPortfolioWorks(Array.isArray(refreshed.trabajos) ? refreshed.trabajos : []);
      }
      setPortfolioMessage(result.mensaje || 'Trabajo guardado en tu portafolio.');
      resetNewWorkForm();
    } catch (error) {
      setNewWorkError(error instanceof Error ? error.message : 'No se pudo guardar el trabajo.');
    } finally {
      setSavingNewWork(false);
    }
  };

  const handleAddPhotosToWork = async (workId: string | number, event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    event.target.value = '';
    if (files.length === 0) return;
    const invalid = files.filter((file) => !archivoImagenValido(file));
    const valid = files.filter((file) => archivoImagenValido(file));
    setPortfolioMessage('');
    if (invalid.length > 0) {
      setPortfolioActionError('Solo se permiten imágenes en formato JPG o PNG.');
    } else {
      setPortfolioActionError('');
    }
    if (valid.length === 0) return;

    setAddingPhotosWorkId(workId);
    try {
      const result = await agregarFotosPortafolio(workId, valid);
      if (Array.isArray(result.trabajos)) {
        setPortfolioWorks(result.trabajos);
      }
      setPortfolioMessage(result.mensaje || 'Fotos agregadas al trabajo.');
      setPortfolioActionError('');
    } catch (error) {
      setPortfolioActionError(error instanceof Error ? error.message : 'No se pudieron agregar las fotos.');
    } finally {
      setAddingPhotosWorkId(null);
    }
  };

  const handleDeletePhoto = async (work: PortfolioWork, photoId: string | number) => {
    setPortfolioMessage('');
    setPortfolioActionError('');
    if ((work.fotos?.length || 0) <= 3) {
      setPortfolioActionError('No puedes dejar un trabajo con menos de 3 fotos. Agrega otra foto antes de eliminar esta.');
      return;
    }
    setDeletingPhotoId(photoId);
    try {
      const result = await eliminarFotoPortafolio(photoId);
      if (Array.isArray(result.trabajos)) {
        setPortfolioWorks(result.trabajos);
      }
      setPortfolioMessage(result.mensaje || 'Foto eliminada.');
    } catch (error) {
      setPortfolioActionError(error instanceof Error ? error.message : 'No se pudo eliminar la foto.');
    } finally {
      setDeletingPhotoId(null);
    }
  };

  const handleSaveWorkTitle = async (work: PortfolioWork) => {
    const nextTitle = (editingTitles[String(work.id)] ?? work.titulo).trim();
    setPortfolioMessage('');
    setPortfolioActionError('');
    if (!nextTitle) {
      setPortfolioActionError('El título del trabajo es obligatorio.');
      return;
    }
    if (nextTitle === work.titulo) {
      setEditingTitles((prev) => {
        const copy = { ...prev };
        delete copy[String(work.id)];
        return copy;
      });
      return;
    }
    setSavingTitleWorkId(work.id);
    try {
      const result = await actualizarTituloPortafolio(work.id, nextTitle);
      if (Array.isArray(result.trabajos)) {
        setPortfolioWorks(result.trabajos);
      }
      setPortfolioMessage(result.mensaje || 'Título actualizado.');
      setEditingTitles((prev) => {
        const copy = { ...prev };
        delete copy[String(work.id)];
        return copy;
      });
    } catch (error) {
      setPortfolioActionError(error instanceof Error ? error.message : 'No se pudo actualizar el título.');
    } finally {
      setSavingTitleWorkId(null);
    }
  };

  const professionalId = String(userData.id || userData.email || '');
  const hasRequestSent = sentRequests.some(req => String(req.professionalId) === professionalId);
  const rating = Number(userData.rating) || 0;

  return (
    <div className="min-h-screen bg-[#FAF8F5]">
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
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-[#FFC900] text-[#1D1D1B] font-medium rounded-lg hover:bg-[#e6b500]"
                >
                  <Edit2 size={18} />
                  Editar perfil
                </button>
                <button
                  type="button"
                  onClick={() => setOpenSchedule(true)}
                  className="rounded-lg border border-amber-500 px-3 py-1.5 text-xs font-medium text-amber-700 bg-white hover:bg-amber-50"
                >
                  ver/editar horario
                </button>
              </div>
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
        <div className="bg-white rounded-xl shadow-sm p-8 mb-6">
          <div className="flex flex-col items-center">
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

            <h1 className="text-3xl mb-2">{userData.name}{userData.lastName ? ' ' + userData.lastName : ''}</h1>
            <div className="flex items-center gap-2 text-gray-600 mb-3">
              <MapPin size={18} />
              <span>{userData.departamento}</span>
            </div>
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
              <span className="text-gray-600">({Number(userData.reviewCount) || 0} reseñas)</span>
            </div>
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

        <div className="bg-white rounded-xl shadow-sm p-8 mb-6">
          <h2 className="text-2xl mb-6">Información Profesional</h2>
          <div className="space-y-6">
            {isEditing && isOwnProfile && (
              <div className="space-y-4 p-4 bg-[#FAF8F5] rounded-lg mb-6">
                <h3 className="font-medium text-[#1D1D1B] mb-3">Datos Personales</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[#1D1D1B] mb-2">Nombre</label>
                    <input type="text" value={editedData.name} onChange={(e) => setEditedData(prev => ({ ...prev, name: e.target.value }))} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#685AA1]" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#1D1D1B] mb-2">Apellido</label>
                    <input type="text" value={editedData.lastName} onChange={(e) => setEditedData(prev => ({ ...prev, lastName: e.target.value }))} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#685AA1]" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#1D1D1B] mb-2">Teléfono</label>
                  <input type="text" value={editedData.phone} onChange={(e) => setEditedData(prev => ({ ...prev, phone: e.target.value }))} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#685AA1]" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#1D1D1B] mb-2">Correo Electrónico</label>
                  <input type="email" value={editedData.email} onChange={(e) => setEditedData(prev => ({ ...prev, email: e.target.value }))} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#685AA1]" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#1D1D1B] mb-2">Dirección</label>
                  <input type="text" value={editedData.address} onChange={(e) => setEditedData(prev => ({ ...prev, address: e.target.value }))} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#685AA1]" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#1D1D1B] mb-2">Departamento</label>
                  <select value={editedData.departamento} onChange={(e) => setEditedData(prev => ({ ...prev, departamento: e.target.value }))} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#685AA1] bg-white">
                    <option value="">Selecciona departamento</option>
                    {departamentos.map(dept => (<option key={dept} value={dept}>{dept}</option>))}
                  </select>
                </div>
              </div>
            )}

            <div>
              <h3 className="font-medium text-[#1D1D1B] mb-2">Años de Experiencia</h3>
              {isEditing && isOwnProfile ? (
                <input type="number" value={editedData.yearsExperience} onChange={(e) => setEditedData(prev => ({ ...prev, yearsExperience: e.target.value }))} min="0" className="w-full max-w-xs px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#685AA1]" />
              ) : (
                <p className="text-lg">{userData.yearsExperience || 0} años</p>
              )}
            </div>

            <div>
              <h3 className="font-medium text-[#1D1D1B] mb-2">Educación</h3>
              {userData.educationType === 'titulo' ? (
                <p className="text-lg">Estudios Formales</p>
              ) : (
                <p className="text-lg">Empírico</p>
              )}
            </div>

            <div>
              <h3 className="font-medium text-[#1D1D1B] mb-3">Categorías de Trabajo</h3>
              {isEditing && isOwnProfile ? (
                <div className="grid grid-cols-2 gap-3">
                  {allCategories.map((category) => (
                    <label key={category} className={`flex items-center gap-2 p-3 border rounded-lg cursor-pointer transition-colors ${editedData.categories.includes(category) ? 'bg-[#D3CFED] border-[#685AA1]' : 'border-gray-300 hover:bg-gray-50'}`}>
                      <input type="checkbox" checked={editedData.categories.includes(category)} onChange={() => handleCategoryToggle(category)} className="rounded text-[#685AA1] focus:ring-[#685AA1]" />
                      <span className="text-sm">{category}</span>
                    </label>
                  ))}
                </div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {(userData.categories || []).map((category: string) => (
                    <span key={category} className={`px-4 py-2 ${getCategoryColor(category)} font-medium rounded-full`}>{category}</span>
                  ))}
                </div>
              )}
            </div>

            <div>
              <h3 className="font-medium text-[#1D1D1B] mb-3">Métodos de Pago Preferidos</h3>
              {isEditing && isOwnProfile ? (
                <div className="grid grid-cols-2 gap-3">
                  <label className={`flex items-center gap-2 p-3 border rounded-lg cursor-pointer transition-colors ${editedData.preferredPaymentMethods.includes('efectivo') ? 'bg-[#D3CFED] border-[#685AA1]' : 'border-gray-300 hover:bg-gray-50'}`}>
                    <input type="checkbox" checked={editedData.preferredPaymentMethods.includes('efectivo')} onChange={() => handlePaymentMethodToggle('efectivo')} className="rounded text-[#685AA1] focus:ring-[#685AA1]" />
                    <Banknote size={20} className="text-gray-600" />
                    <span className="text-sm">Efectivo</span>
                  </label>
                  <label className={`flex items-center gap-2 p-3 border rounded-lg cursor-pointer transition-colors ${editedData.preferredPaymentMethods.includes('tarjeta') ? 'bg-[#D3CFED] border-[#685AA1]' : 'border-gray-300 hover:bg-gray-50'}`}>
                    <input type="checkbox" checked={editedData.preferredPaymentMethods.includes('tarjeta')} onChange={() => handlePaymentMethodToggle('tarjeta')} className="rounded text-[#685AA1] focus:ring-[#685AA1]" />
                    <CreditCard size={20} className="text-gray-600" />
                    <span className="text-sm">Tarjeta</span>
                  </label>
                </div>
              ) : (
                <div className="flex gap-3 flex-wrap">
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

        <div className="bg-white rounded-xl shadow-sm p-8 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <h2 className="text-2xl">Portafolio de Trabajos</h2>
              <p className="text-sm text-gray-600 mt-1">
                Cada trabajo debe tener un título y al menos 3 fotos (JPG o PNG). No hay límite máximo de fotos.
              </p>
            </div>
            {isOwnProfile && (
              <button
                onClick={() => { setShowNewWorkForm((v) => !v); setNewWorkError(''); setPortfolioActionError(''); setPortfolioMessage(''); }}
                className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-[#FFC900] text-[#1D1D1B] font-medium rounded-lg hover:bg-[#e6b500] transition-colors"
              >
                <Plus size={18} />
                {showNewWorkForm ? 'Cerrar formulario' : 'Agregar trabajo'}
              </button>
            )}
          </div>

          {portfolioMessage && (
            <div className="mb-4 p-3 rounded-lg bg-green-50 border border-green-200 text-green-700 text-sm">{portfolioMessage}</div>
          )}
          {portfolioActionError && (
            <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">{portfolioActionError}</div>
          )}
          {portfolioLoadError && (
            <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">{portfolioLoadError}</div>
          )}

          {isOwnProfile && showNewWorkForm && (
            <div className="mb-8 p-5 border border-[#D3CFED] rounded-xl bg-[#FAF8F5]">
              <h3 className="text-lg font-medium text-[#1D1D1B] mb-4">Nuevo trabajo</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[#1D1D1B] mb-2">Título del trabajo</label>
                  <input
                    type="text"
                    value={newWorkTitle}
                    onChange={(e) => setNewWorkTitle(e.target.value)}
                    placeholder="Ej: Remodelación de cocina"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#685AA1] bg-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#1D1D1B] mb-2">Fotos del trabajo (JPG o PNG, mínimo 3)</label>
                  <input
                    ref={newWorkInputRef}
                    type="file"
                    accept=".jpg,.jpeg,.png,image/jpeg,image/png"
                    multiple
                    onChange={handleSelectNewWorkFiles}
                    className="block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-[#685AA1] file:text-white hover:file:bg-[#584a89]"
                  />
                  <p className="text-xs text-gray-500 mt-1">Puedes seleccionar varias fotos a la vez. No hay límite máximo. Formatos permitidos: JPG y PNG.</p>
                </div>

                {newWorkFiles.length > 0 && (
                  <div>
                    <p className="text-sm text-[#1D1D1B] mb-2">Fotos seleccionadas: {newWorkFiles.length} {newWorkFiles.length < 3 ? '(mínimo 3 para guardar)' : ''}</p>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                      {newWorkPreviews.map((preview, index) => (
                        <div key={`${preview}-${index}`} className="relative group">
                          <img src={preview} alt={`Nueva foto ${index + 1}`} className="w-full h-28 object-cover rounded-lg border border-gray-200" />
                          <button
                            type="button"
                            onClick={() => handleRemoveNewWorkFile(index)}
                            className="absolute top-1 right-1 p-1.5 bg-red-600 text-white rounded-full hover:bg-red-700"
                            title="Quitar foto"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {newWorkError && (
                  <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">{newWorkError}</div>
                )}

                <div className="flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={handleCreateWork}
                    disabled={savingNewWork}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#685AA1] text-white font-medium rounded-lg hover:bg-[#584a89] disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {savingNewWork ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                    {savingNewWork ? 'Guardando...' : 'Guardar trabajo'}
                  </button>
                  <button
                    type="button"
                    onClick={resetNewWorkForm}
                    disabled={savingNewWork}
                    className="px-5 py-2.5 bg-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-300 disabled:opacity-60"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            </div>
          )}

          {loadingPortfolio ? (
            <div className="flex items-center justify-center gap-2 py-10 text-gray-600">
              <Loader2 size={20} className="animate-spin" />
              <span>Cargando portafolio...</span>
            </div>
          ) : !portfolioOwnerId ? (
            <div className="text-center py-12 text-gray-500">
              <p>No se pudo identificar el perfil profesional para cargar el portafolio.</p>
            </div>
          ) : portfolioWorks.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <p>No hay trabajos en el portafolio.</p>
              {isOwnProfile && (
                <p className="text-sm mt-2">Agrega un trabajo con su título y al menos 3 fotos para que los clientes puedan verlo.</p>
              )}
            </div>
          ) : (
            <div className="space-y-6">
              {portfolioWorks.map((work) => {
                const editTitleValue = editingTitles[String(work.id)];
                const isEditingTitle = editTitleValue !== undefined;
                const fotoCount = (work.fotos || []).length;
                return (
                  <div key={String(work.id)} className="border border-gray-200 rounded-xl p-5">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
                      <div className="flex-1">
                        {isOwnProfile && isEditingTitle ? (
                          <div className="flex flex-col sm:flex-row gap-2">
                            <input
                              type="text"
                              value={editTitleValue}
                              onChange={(e) => setEditingTitles((prev) => ({ ...prev, [String(work.id)]: e.target.value }))}
                              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#685AA1]"
                            />
                            <div className="flex gap-2">
                              <button
                                type="button"
                                onClick={() => handleSaveWorkTitle(work)}
                                disabled={savingTitleWorkId === work.id}
                                className="inline-flex items-center gap-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-60"
                              >
                                {savingTitleWorkId === work.id ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                                Guardar
                              </button>
                              <button
                                type="button"
                                onClick={() => setEditingTitles((prev) => { const c = { ...prev }; delete c[String(work.id)]; return c; })}
                                className="px-3 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                              >
                                Cancelar
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center gap-3 flex-wrap">
                            <h3 className="text-xl font-medium text-[#1D1D1B]">{work.titulo}</h3>
                            {isOwnProfile && (
                              <button
                                type="button"
                                onClick={() => setEditingTitles((prev) => ({ ...prev, [String(work.id)]: work.titulo }))}
                                className="text-sm text-[#685AA1] hover:underline"
                              >
                                Editar título
                              </button>
                            )}
                          </div>
                        )}
                        <p className="text-sm text-gray-500 mt-1">{fotoCount} foto(s)</p>
                      </div>

                      {isOwnProfile && (
                        <div className="flex items-center gap-2">
                          <input
                            ref={(el) => { addPhotosInputRefs.current[String(work.id)] = el; }}
                            type="file"
                            accept=".jpg,.jpeg,.png,image/jpeg,image/png"
                            multiple
                            onChange={(e) => handleAddPhotosToWork(work.id, e)}
                            className="hidden"
                          />
                          <button
                            type="button"
                            onClick={() => addPhotosInputRefs.current[String(work.id)]?.click()}
                            disabled={addingPhotosWorkId === work.id}
                            className="inline-flex items-center gap-2 px-4 py-2 border border-[#685AA1] text-[#685AA1] rounded-lg hover:bg-[#F3F1FA] disabled:opacity-60"
                          >
                            {addingPhotosWorkId === work.id ? <Loader2 size={16} className="animate-spin" /> : <ImagePlus size={16} />}
                            {addingPhotosWorkId === work.id ? 'Agregando...' : 'Agregar fotos'}
                          </button>
                        </div>
                      )}
                    </div>

                    {fotoCount === 0 ? (
                      <p className="text-gray-500 text-sm">Este trabajo no tiene fotos.</p>
                    ) : (
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                        {work.fotos.map((foto) => (
                          <div key={String(foto.id)} className="relative group">
                            <ImageWithFallback
                              src={foto.url}
                              alt={work.titulo}
                              className="w-full h-36 object-cover rounded-lg border border-gray-200"
                            />
                            {isOwnProfile && (
                              <button
                                type="button"
                                onClick={() => handleDeletePhoto(work, foto.id)}
                                disabled={deletingPhotoId === foto.id}
                                title={fotoCount <= 3 ? 'Un trabajo guardado debe tener al menos 3 fotos' : 'Eliminar foto'}
                                className="absolute top-2 right-2 p-2 bg-red-600 text-white rounded-full opacity-90 hover:opacity-100 hover:bg-red-700 disabled:opacity-60"
                              >
                                {deletingPhotoId === foto.id ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

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

      {clientData && (
        <RequestServiceModal
          isOpen={showRequestModal}
          onClose={() => setShowRequestModal(false)}
          clientData={clientData}
          professionalName={`${userData.name}${userData.lastName ? ' ' + userData.lastName : ''}`}
          professionalId={professionalId}
          category={selectedCategory || userData.categories?.[0] || 'Servicio General'}
          onSendRequest={onSendRequest || (async () => { throw new Error('No se pudo conectar con el envío de solicitudes.'); })}
        />
      )}

      <ScheduleModal
        isOpen={openSchedule}
        onClose={() => setOpenSchedule(false)}
        professionalName={userData?.name || userData?.nombre || 'yo tu'}
        schedule={schedule}
        canEdit={true}
        onSave={(newSchedule) => {
          setSchedule(newSchedule);
          localStorage.setItem('chambly_my_schedule', JSON.stringify(newSchedule));
          const proName = userData?.name || userData?.nombre || 'yo tu';
          const savedSchedules = JSON.parse(localStorage.getItem('chambly_schedules') || '{}');
          savedSchedules[proName] = newSchedule;
          localStorage.setItem('chambly_schedules', JSON.stringify(savedSchedules));
        }}
      />
    </div>
  );
}
