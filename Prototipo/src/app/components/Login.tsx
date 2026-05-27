import { useState } from 'react';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';

interface LoginProps {
  onLogin: (userType: 'client' | 'professional', userData: any) => void;
  onSwitchToRegister: () => void;
}

export function Login({ onLogin, onSwitchToRegister }: LoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const emailValue = e.target.value;
    setEmail(emailValue);

    if (emailValue && !validateEmail(emailValue)) {
      setEmailError('Ingresa un correo electrónico válido');
    } else {
      setEmailError('');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate email before submitting
    if (!validateEmail(email)) {
      setEmailError('Ingresa un correo electrónico válido');
      return;
    }

    // Mock login - determine user type based on email
    const userType = email.includes('pro') ? 'professional' : 'client';
    const userName = email.split('@')[0];

    // Mock user data
    const userData = {
      name: userName,
      lastName: '',
      email: email,
      phone: '7000-0000',
      address: 'Dirección de ejemplo',
      departamento: 'San Salvador',
      dui: '00000000-0',
      categories: userType === 'professional' ? ['Limpieza', 'Pintura'] : [],
      yearsExperience: userType === 'professional' ? 5 : undefined,
      educationType: userType === 'professional' ? 'empirico' : undefined,
      preferredPaymentMethods: userType === 'professional' ? ['efectivo', 'tarjeta'] : undefined,
      photo: '' // User can upload their own photo later
    };

    onLogin(userType, userData);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FAF8F5] p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl mb-2 text-[#1D1D1B]">Chambly</h1>
          <p className="text-[#685AA1]">Conecta con profesionales</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm mb-2 text-[#1D1D1B]">Correo Electrónico</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
              <input
                type="email"
                value={email}
                onChange={handleEmailChange}
                className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 bg-white ${
                  emailError ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-[#685AA1]'
                }`}
                placeholder="correo@ejemplo.com"
                required
              />
            </div>
            {emailError && <p className="text-sm text-red-600 mt-1">{emailError}</p>}
          </div>

          <div>
            <label className="block text-sm mb-2 text-[#1D1D1B]">Contraseña</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#685AA1] bg-white"
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-[#FFC900] text-[#1D1D1B] font-medium py-3 rounded-lg hover:bg-[#e6b500] transition-colors"
          >
            Iniciar Sesión
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600">
            ¿No tienes una cuenta?{' '}
            <button
              onClick={onSwitchToRegister}
              className="text-[#685AA1] hover:underline font-medium"
            >
              Registrarse
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
