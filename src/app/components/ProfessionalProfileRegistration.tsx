import { useState } from 'react';
import { actualizarPerfilRol } from '../../services/api';

interface ProfessionalProfileRegistrationProps {
  userData: any;
  onCancel: () => void;
  onSubmitted: (userData: any) => void;
}

const categories = [
  'Limpieza',
  'Construcción',
  'Pintura',
  'Plomería',
  'Electricidad',
  'Jardinería',
  'Mudanza',
  'Ensamblaje de Muebles'
];

const paymentMethods = [
  { value: 'efectivo', label: 'Efectivo' },
  { value: 'tarjeta', label: 'Tarjeta' }
];

const departments = [
  'Ahuachapán', 'Santa Ana', 'Sonsonate', 'Chalatenango', 'La Libertad',
  'San Salvador', 'Cuscatlán', 'La Paz', 'Cabañas', 'San Vicente',
  'Usulután', 'San Miguel', 'Morazán', 'La Unión'
];

export function ProfessionalProfileRegistration({ userData, onCancel, onSubmitted }: ProfessionalProfileRegistrationProps) {
  const [name, setName] = useState(userData.name || '');
  const [lastName, setLastName] = useState(userData.lastName || '');
  const [age, setAge] = useState(String(userData.age || ''));
  const [phone, setPhone] = useState(userData.phone || '');
  const [address, setAddress] = useState(userData.address || '');
  const [department, setDepartment] = useState(userData.departamento || '');
  const [municipality, setMunicipality] = useState(userData.municipio || '');
  const [yearsExperience, setYearsExperience] = useState('');
  const [educationType, setEducationType] = useState('Empírico');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedPaymentMethods, setSelectedPaymentMethods] = useState<string[]>([]);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const toggleValue = (value: string, selected: string[], setSelected: (values: string[]) => void) => {
    setSelected(selected.includes(value) ? selected.filter(item => item !== value) : [...selected, value]);
  };

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setSaving(true);
    try {
      const result = await actualizarPerfilRol({
        action: 'create-professional',
        name,
        lastName,
        age,
        phone,
        address,
        departamento: department,
        municipio: municipality,
        yearsExperience,
        educationType,
        categories: selectedCategories,
        preferredPaymentMethods: selectedPaymentMethods
      });
      onSubmitted(result.usuario);
    } catch (submitError) {
      console.error(submitError);
      setError(submitError instanceof Error ? submitError.message : 'No se pudo enviar el perfil');
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#FAF8F5] px-4 py-10">
      <form onSubmit={submit} className="mx-auto max-w-2xl space-y-6 rounded-2xl bg-white p-6 shadow-xl md:p-8">
        <header>
          <p className="text-sm font-semibold uppercase tracking-wide text-[#685AA1]">Cuenta existente</p>
          <h1 className="mt-1 text-2xl font-semibold text-[#1D1D1B]">Completa tu perfil profesional</h1>
          <p className="mt-2 text-sm text-gray-600">
            Los datos de identidad se actualizarán también en tu perfil de Cliente. El correo y el DUI permanecerán vinculados a esta cuenta; teléfono y ubicación se guardarán para este perfil.
          </p>
        </header>

        <fieldset className="space-y-4 rounded-xl border border-gray-200 p-4">
          <legend className="px-2 text-sm font-semibold text-gray-800">Datos personales compartidos</legend>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="professional-role-name" className="mb-2 block text-sm font-medium text-[#1D1D1B]">Nombre</label>
              <input id="professional-role-name" required value={name} onChange={event => setName(event.target.value)} className="w-full rounded-lg border border-gray-300 px-4 py-3" />
            </div>
            <div>
              <label htmlFor="professional-role-lastname" className="mb-2 block text-sm font-medium text-[#1D1D1B]">Apellido</label>
              <input id="professional-role-lastname" required value={lastName} onChange={event => setLastName(event.target.value)} className="w-full rounded-lg border border-gray-300 px-4 py-3" />
            </div>
            <div>
              <label htmlFor="professional-role-age" className="mb-2 block text-sm font-medium text-[#1D1D1B]">Edad</label>
              <input id="professional-role-age" type="number" min="18" max="120" required value={age} onChange={event => setAge(event.target.value)} className="w-full rounded-lg border border-gray-300 px-4 py-3" />
            </div>
            <div>
              <label htmlFor="professional-role-dui" className="mb-2 block text-sm font-medium text-[#1D1D1B]">DUI vinculado</label>
              <input id="professional-role-dui" readOnly value={userData.dui || ''} className="w-full rounded-lg border border-gray-200 bg-gray-100 px-4 py-3 text-gray-600" />
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="professional-role-email" className="mb-2 block text-sm font-medium text-[#1D1D1B]">Correo de la cuenta</label>
              <input id="professional-role-email" type="email" readOnly value={userData.email || ''} className="w-full rounded-lg border border-gray-200 bg-gray-100 px-4 py-3 text-gray-600" />
            </div>
          </div>
        </fieldset>

        <fieldset className="space-y-4 rounded-xl border border-gray-200 p-4">
          <legend className="px-2 text-sm font-semibold text-gray-800">Contacto para el perfil Profesional</legend>
          <div>
            <label htmlFor="role-phone" className="mb-2 block text-sm font-medium text-[#1D1D1B]">Teléfono</label>
            <input id="role-phone" type="tel" required value={phone} onChange={event => setPhone(event.target.value)} className="w-full rounded-lg border border-gray-300 px-4 py-3" />
          </div>
          <div>
            <label htmlFor="role-address" className="mb-2 block text-sm font-medium text-[#1D1D1B]">Dirección</label>
            <input id="role-address" required value={address} onChange={event => setAddress(event.target.value)} className="w-full rounded-lg border border-gray-300 px-4 py-3" />
          </div>
          <div>
            <label htmlFor="role-department" className="mb-2 block text-sm font-medium text-[#1D1D1B]">Departamento</label>
            <select id="role-department" required value={department} onChange={event => setDepartment(event.target.value)} className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3">
              <option value="">Selecciona un departamento</option>
              {departments.map(item => <option key={item} value={item}>{item}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="role-municipality" className="mb-2 block text-sm font-medium text-[#1D1D1B]">Municipio o zona amplia</label>
            <input id="role-municipality" required maxLength={80} value={municipality} onChange={event => setMunicipality(event.target.value)} placeholder="Escribe el municipio" className="w-full rounded-lg border border-gray-300 px-4 py-3" />
          </div>
        </fieldset>

        <div>
          <label htmlFor="role-years" className="mb-2 block text-sm font-medium text-[#1D1D1B]">Años de experiencia</label>
          <input
            id="role-years"
            type="number"
            min="0"
            max="100"
            required
            value={yearsExperience}
            onChange={event => setYearsExperience(event.target.value)}
            className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-[#685AA1] focus:outline-none focus:ring-2 focus:ring-[#685AA1]/30"
          />
        </div>

        <div>
          <label htmlFor="role-education" className="mb-2 block text-sm font-medium text-[#1D1D1B]">Nivel de educación</label>
          <select
            id="role-education"
            value={educationType}
            onChange={event => setEducationType(event.target.value)}
            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 focus:border-[#685AA1] focus:outline-none focus:ring-2 focus:ring-[#685AA1]/30"
          >
            <option value="Empírico">Empírico</option>
            <option value="Técnico">Técnico</option>
            <option value="Universitario">Universitario</option>
            <option value="Otro">Otro</option>
          </select>
        </div>

        <fieldset>
          <legend className="mb-2 text-sm font-medium text-[#1D1D1B]">Servicios que ofreces</legend>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {categories.map(category => (
              <label key={category} className="flex items-center gap-2 rounded-lg border border-gray-200 p-3 text-sm">
                <input
                  type="checkbox"
                  checked={selectedCategories.includes(category)}
                  onChange={() => toggleValue(category, selectedCategories, setSelectedCategories)}
                  className="accent-[#685AA1]"
                />
                {category}
              </label>
            ))}
          </div>
        </fieldset>

        <fieldset>
          <legend className="mb-2 text-sm font-medium text-[#1D1D1B]">Métodos de pago aceptados</legend>
          <div className="flex flex-wrap gap-3">
            {paymentMethods.map(method => (
              <label key={method.value} className="flex items-center gap-2 rounded-lg border border-gray-200 px-4 py-3 text-sm">
                <input
                  type="checkbox"
                  checked={selectedPaymentMethods.includes(method.value)}
                  onChange={() => toggleValue(method.value, selectedPaymentMethods, setSelectedPaymentMethods)}
                  className="accent-[#685AA1]"
                />
                {method.label}
              </label>
            ))}
          </div>
        </fieldset>

        {error && <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}

        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button type="button" onClick={onCancel} className="rounded-lg border border-gray-300 px-5 py-3 text-gray-700 hover:bg-gray-50">
            Cancelar
          </button>
          <button
            type="submit"
            disabled={saving || selectedCategories.length === 0 || selectedPaymentMethods.length === 0}
            className="rounded-lg bg-[#685AA1] px-5 py-3 font-medium text-white hover:bg-[#51437F] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {saving ? 'Enviando...' : 'Enviar para aprobación'}
          </button>
        </div>
      </form>
    </main>
  );
}
