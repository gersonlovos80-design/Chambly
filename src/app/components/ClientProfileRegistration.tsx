import { useState } from 'react';
import { actualizarPerfilRol } from '../../services/api';

interface ClientProfileRegistrationProps {
  userData: any;
  onCancel: () => void;
  onSubmitted: (userData: any) => void;
}

const departments = [
  'Ahuachapán', 'Santa Ana', 'Sonsonate', 'Chalatenango', 'La Libertad',
  'San Salvador', 'Cuscatlán', 'La Paz', 'Cabañas', 'San Vicente',
  'Usulután', 'San Miguel', 'Morazán', 'La Unión'
];

export function ClientProfileRegistration({ userData, onCancel, onSubmitted }: ClientProfileRegistrationProps) {
  const [name, setName] = useState(userData.name || '');
  const [lastName, setLastName] = useState(userData.lastName || '');
  const [age, setAge] = useState(String(userData.age || ''));
  const [phone, setPhone] = useState(userData.phone || '');
  const [address, setAddress] = useState(userData.address || '');
  const [department, setDepartment] = useState(userData.departamento || '');
  const [municipality, setMunicipality] = useState(userData.municipio || '');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setSaving(true);
    try {
      const result = await actualizarPerfilRol({
        action: 'create-client',
        name,
        lastName,
        age,
        phone,
        address,
        departamento: department,
        municipio: municipality
      });
      onSubmitted(result.usuario);
    } catch (submitError) {
      console.error(submitError);
      setError(submitError instanceof Error ? submitError.message : 'No se pudo guardar el perfil');
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#FAF8F5] px-4 py-10">
      <form onSubmit={submit} className="mx-auto max-w-xl space-y-5 rounded-2xl bg-white p-6 shadow-xl md:p-8">
        <header>
          <p className="text-sm font-semibold uppercase tracking-wide text-[#685AA1]">Cuenta existente</p>
          <h1 className="mt-1 text-2xl font-semibold text-[#1D1D1B]">Completa tu perfil de cliente</h1>
          <p className="mt-2 text-sm text-gray-600">
            Los datos de identidad se actualizarán también en tu perfil Profesional. El correo y el DUI permanecerán vinculados a esta cuenta; puedes ajustar el contacto para tu perfil de Cliente.
          </p>
        </header>

        <fieldset className="space-y-4 rounded-xl border border-gray-200 p-4">
          <legend className="px-2 text-sm font-semibold text-gray-800">Datos personales compartidos</legend>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="client-role-name" className="mb-2 block text-sm font-medium text-[#1D1D1B]">Nombre</label>
              <input id="client-role-name" required value={name} onChange={event => setName(event.target.value)} className="w-full rounded-lg border border-gray-300 px-4 py-3" />
            </div>
            <div>
              <label htmlFor="client-role-lastname" className="mb-2 block text-sm font-medium text-[#1D1D1B]">Apellido</label>
              <input id="client-role-lastname" required value={lastName} onChange={event => setLastName(event.target.value)} className="w-full rounded-lg border border-gray-300 px-4 py-3" />
            </div>
            <div>
              <label htmlFor="client-role-age" className="mb-2 block text-sm font-medium text-[#1D1D1B]">Edad</label>
              <input id="client-role-age" type="number" min="18" max="120" required value={age} onChange={event => setAge(event.target.value)} className="w-full rounded-lg border border-gray-300 px-4 py-3" />
            </div>
            <div>
              <label htmlFor="client-role-dui" className="mb-2 block text-sm font-medium text-[#1D1D1B]">DUI vinculado</label>
              <input id="client-role-dui" readOnly value={userData.dui || ''} className="w-full rounded-lg border border-gray-200 bg-gray-100 px-4 py-3 text-gray-600" />
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="client-role-email" className="mb-2 block text-sm font-medium text-[#1D1D1B]">Correo de la cuenta</label>
              <input id="client-role-email" type="email" readOnly value={userData.email || ''} className="w-full rounded-lg border border-gray-200 bg-gray-100 px-4 py-3 text-gray-600" />
            </div>
          </div>
        </fieldset>

        <p className="text-sm font-semibold text-gray-800">Contacto para el perfil Cliente</p>
        <div>
          <label htmlFor="client-role-phone" className="mb-2 block text-sm font-medium text-[#1D1D1B]">Teléfono</label>
          <input
            id="client-role-phone"
            type="tel"
            required
            value={phone}
            onChange={event => setPhone(event.target.value)}
            className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-[#685AA1] focus:outline-none focus:ring-2 focus:ring-[#685AA1]/30"
          />
        </div>

        <div>
          <label htmlFor="client-role-address" className="mb-2 block text-sm font-medium text-[#1D1D1B]">Dirección</label>
          <input
            id="client-role-address"
            type="text"
            required
            value={address}
            onChange={event => setAddress(event.target.value)}
            className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-[#685AA1] focus:outline-none focus:ring-2 focus:ring-[#685AA1]/30"
          />
        </div>

        <div>
          <label htmlFor="client-role-department" className="mb-2 block text-sm font-medium text-[#1D1D1B]">Departamento</label>
          <select
            id="client-role-department"
            required
            value={department}
            onChange={event => setDepartment(event.target.value)}
            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 focus:border-[#685AA1] focus:outline-none focus:ring-2 focus:ring-[#685AA1]/30"
          >
            <option value="">Selecciona un departamento</option>
            {departments.map(item => <option key={item} value={item}>{item}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="client-role-municipality" className="mb-2 block text-sm font-medium text-[#1D1D1B]">Municipio o zona amplia</label>
          <input id="client-role-municipality" type="text" required maxLength={80} value={municipality} onChange={event => setMunicipality(event.target.value)} placeholder="Escribe el municipio" className="w-full rounded-lg border border-gray-300 px-4 py-3" />
        </div>

        {error && <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}

        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button type="button" onClick={onCancel} className="rounded-lg border border-gray-300 px-5 py-3 text-gray-700 hover:bg-gray-50">
            Cancelar
          </button>
          <button
            type="submit"
            disabled={saving}
            className="rounded-lg bg-[#685AA1] px-5 py-3 font-medium text-white hover:bg-[#51437F] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {saving ? 'Guardando...' : 'Guardar y cambiar a Cliente'}
          </button>
        </div>
      </form>
    </main>
  );
}
