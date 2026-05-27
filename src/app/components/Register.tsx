import { useState } from 'react';
import { User, Mail, Lock, Briefcase, Phone, MapPin, Calendar, CreditCard, GraduationCap, Eye, EyeOff } from 'lucide-react';

interface RegisterProps {
  onRegister: (userType: 'client' | 'professional', userData: any) => void;
  onSwitchToLogin: () => void;
}

const departamentos = [
  'Ahuachapán', 'Santa Ana', 'Sonsonate', 'Chalatenango', 'La Libertad',
  'San Salvador', 'Cuscatlán', 'La Paz', 'Cabañas', 'San Vicente',
  'Usulután', 'San Miguel', 'Morazán', 'La Unión'
];

const jobCategories = [
  'Limpieza', 'Construcción', 'Pintura', 'Plomería', 'Electricidad',
  'Jardinería', 'Mudanza', 'Ensamblaje de Muebles'
];

const paymentMethods = [
  { value: 'efectivo', label: 'Efectivo' },
  { value: 'tarjeta', label: 'Tarjeta' }
];

export function Register({ onRegister, onSwitchToLogin }: RegisterProps) {
  const [formData, setFormData] = useState({
    name: '',
    lastName: '',
    age: '',
    email: '',
    phone: '',
    address: '',
    departamento: '',
    password: '',
    confirmPassword: '',
    userType: 'client' as 'client' | 'professional',
    dui: '',
    // Professional-specific fields
    yearsExperience: '',
    educationType: 'empirico' as 'empirico' | 'titulo',
    categories: [] as string[],
    preferredPaymentMethods: [] as string[]
  });

  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const formatDUI = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 8) {
      return numbers;
    }
    return `${numbers.slice(0, 8)}-${numbers.slice(8, 9)}`;
  };

  const formatPhone = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 4) {
      return numbers;
    }
    return `${numbers.slice(0, 4)}-${numbers.slice(4, 8)}`;
  };

  const handleDUIChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatDUI(e.target.value);
    setFormData({ ...formData, dui: formatted });
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhone(e.target.value);
    setFormData({ ...formData, phone: formatted });
  };

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const email = e.target.value;
    setFormData({ ...formData, email });

    if (email && !validateEmail(email)) {
      setEmailError('Ingresa un correo electrónico válido');
    } else {
      setEmailError('');
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const password = e.target.value;
    setFormData({ ...formData, password });

    if (formData.confirmPassword && password !== formData.confirmPassword) {
      setPasswordError('Las contraseñas no coinciden');
    } else {
      setPasswordError('');
    }
  };

  const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const confirmPassword = e.target.value;
    setFormData({ ...formData, confirmPassword });

    if (confirmPassword && formData.password !== confirmPassword) {
      setPasswordError('Las contraseñas no coinciden');
    } else {
      setPasswordError('');
    }
  };

  const handleCategoryToggle = (category: string) => {
    setFormData(prev => ({
      ...prev,
      categories: prev.categories.includes(category)
        ? prev.categories.filter(c => c !== category)
        : [...prev.categories, category]
    }));
  };

  const handlePaymentMethodToggle = (method: string) => {
    setFormData(prev => ({
      ...prev,
      preferredPaymentMethods: prev.preferredPaymentMethods.includes(method)
        ? prev.preferredPaymentMethods.filter(m => m !== method)
        : [...prev.preferredPaymentMethods, method]
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate email
    if (!validateEmail(formData.email)) {
      setEmailError('Ingresa un correo electrónico válido');
      return;
    }

    // Validate password match
    if (formData.password !== formData.confirmPassword) {
      setPasswordError('Las contraseñas no coinciden');
      return;
    }

    onRegister(formData.userType, formData);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FAF8F5] p-4 py-12">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-2xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl mb-2 text-[#1D1D1B]">Chambly</h1>
          <p className="text-[#685AA1]">Crea tu cuenta</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* User Type Selector - First */}
          <div>
            <label className="block text-sm mb-2 text-[#1D1D1B]">Tipo de Usuario</label>
            <div className="relative">
              <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600" size={20} />
              <select
                value={formData.userType}
                onChange={(e) => setFormData({ ...formData, userType: e.target.value as 'client' | 'professional' })}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#685AA1] appearance-none bg-white"
              >
                <option value="client">Cliente (Busco servicios)</option>
                <option value="professional">Profesional (Ofrezco servicios)</option>
              </select>
            </div>
          </div>

          {/* Name and Last Name */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm mb-2 text-[#1D1D1B]">Nombre</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600" size={20} />
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#685AA1]"
                  placeholder="Juan"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm mb-2 text-[#1D1D1B]">Apellido</label>
              <input
                type="text"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#685AA1]"
                placeholder="Pérez"
                required
              />
            </div>
          </div>

          {/* Age and DUI */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm mb-2 text-[#1D1D1B]">Edad</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600" size={20} />
                <input
                  type="number"
                  value={formData.age}
                  onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#685AA1]"
                  placeholder="18"
                  min="18"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm mb-2 text-[#1D1D1B]">DUI</label>
              <div className="relative">
                <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600" size={20} />
                <input
                  type="text"
                  value={formData.dui}
                  onChange={handleDUIChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#685AA1]"
                  placeholder="00000000-0"
                  maxLength={10}
                  required
                />
              </div>
            </div>
          </div>

          {/* Email and Phone */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm mb-2 text-[#1D1D1B]">Correo Electrónico</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600" size={20} />
                <input
                  type="email"
                  value={formData.email}
                  onChange={handleEmailChange}
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 ${
                    emailError ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-[#685AA1]'
                  }`}
                  placeholder="correo@ejemplo.com"
                  required
                />
              </div>
              {emailError && <p className="text-sm text-red-600 mt-1">{emailError}</p>}
            </div>
            <div>
              <label className="block text-sm mb-2 text-[#1D1D1B]">Teléfono</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600" size={20} />
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={handlePhoneChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#685AA1]"
                  placeholder="7000-0000"
                  maxLength={9}
                  required
                />
              </div>
            </div>
          </div>

          {/* Address */}
          <div>
            <label className="block text-sm mb-2 text-[#1D1D1B]">Dirección</label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600" size={20} />
              <input
                type="text"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#685AA1]"
                placeholder="Colonia, calle, número de casa"
                required
              />
            </div>
          </div>

          {/* Departamento */}
          <div>
            <label className="block text-sm mb-2 text-[#1D1D1B]">Departamento</label>
            <select
              value={formData.departamento}
              onChange={(e) => setFormData({ ...formData, departamento: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#685AA1] appearance-none bg-white"
              required
            >
              <option value="">Selecciona un departamento</option>
              {departamentos.map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
          </div>

          {/* Professional-specific fields */}
          {formData.userType === 'professional' && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm mb-2 text-[#1D1D1B]">Años de Experiencia</label>
                  <input
                    type="number"
                    value={formData.yearsExperience}
                    onChange={(e) => setFormData({ ...formData, yearsExperience: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#685AA1]"
                    placeholder="5"
                    min="0"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm mb-2 text-[#1D1D1B]">Tipo de Educación</label>
                  <div className="relative">
                    <GraduationCap className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600" size={20} />
                    <select
                      value={formData.educationType}
                      onChange={(e) => setFormData({ ...formData, educationType: e.target.value as 'empirico' | 'titulo' })}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#685AA1] appearance-none bg-white"
                      required
                    >
                      <option value="empirico">Empírico</option>
                      <option value="titulo">Con Título</option>
                    </select>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm mb-2 text-[#1D1D1B]">Categorías de Trabajo</label>
                <div className="grid grid-cols-2 gap-2">
                  {jobCategories.map(category => (
                    <label
                      key={category}
                      className={`flex items-center gap-2 p-3 border rounded-lg cursor-pointer transition-colors ${
                        formData.categories.includes(category)
                          ? 'bg-[#D3CFED] border-[#685AA1]'
                          : 'border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={formData.categories.includes(category)}
                        onChange={() => handleCategoryToggle(category)}
                        className="rounded text-[#685AA1] focus:ring-[#685AA1]"
                      />
                      <span className="text-sm">{category}</span>
                    </label>
                  ))}
                </div>
                {formData.categories.length === 0 && (
                  <p className="text-sm text-red-600 mt-1">Selecciona al menos una categoría</p>
                )}
              </div>

              {/* Preferred Payment Methods */}
              <div>
                <label className="block text-sm mb-2 text-[#1D1D1B]">
                  Métodos de Pago Preferidos
                </label>
                <p className="text-xs text-gray-600 mb-3">
                  Selecciona los métodos de pago que prefieres aceptar de tus clientes
                </p>
                <div className="grid grid-cols-2 gap-3">
                  {paymentMethods.map((method) => (
                    <label
                      key={method.value}
                      className={`flex items-center gap-2 p-3 border rounded-lg cursor-pointer transition-colors ${
                        formData.preferredPaymentMethods.includes(method.value)
                          ? 'bg-[#D3CFED] border-[#685AA1]'
                          : 'border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={formData.preferredPaymentMethods.includes(method.value)}
                        onChange={() => handlePaymentMethodToggle(method.value)}
                        className="rounded text-[#685AA1] focus:ring-[#685AA1]"
                      />
                      <span className="text-sm">{method.label}</span>
                    </label>
                  ))}
                </div>
                {formData.preferredPaymentMethods.length === 0 && (
                  <p className="text-sm text-red-600 mt-1">Selecciona al menos un método de pago</p>
                )}
              </div>
            </>
          )}

          {/* Password */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm mb-2 text-[#1D1D1B]">Contraseña</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600" size={20} />
                <input
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handlePasswordChange}
                  className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:outline-none focus:ring-2 ${
                    passwordError ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-[#685AA1]'
                  }`}
                  placeholder="••••••••"
                  minLength={6}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-800"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>
            <div>
              <label className="block text-sm mb-2 text-[#1D1D1B]">Confirmar Contraseña</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600" size={20} />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={formData.confirmPassword}
                  onChange={handleConfirmPasswordChange}
                  className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:outline-none focus:ring-2 ${
                    passwordError ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-[#685AA1]'
                  }`}
                  placeholder="••••••••"
                  minLength={6}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-800"
                >
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>
          </div>
          {passwordError && <p className="text-sm text-red-600 mt-1">{passwordError}</p>}

          <button
            type="submit"
            disabled={formData.userType === 'professional' && (formData.categories.length === 0 || formData.preferredPaymentMethods.length === 0)}
            className="w-full bg-[#FFC900] text-[#1D1D1B] font-medium py-3 rounded-lg hover:bg-[#e6b500] transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            Crear Cuenta
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600">
            ¿Ya tienes una cuenta?{' '}
            <button
              onClick={onSwitchToLogin}
              className="text-[#685AA1] hover:underline font-medium"
            >
              Iniciar Sesión
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
