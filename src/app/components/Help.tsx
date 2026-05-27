import { ArrowLeft, MessageCircle, Search } from 'lucide-react';
import { useState } from 'react';

interface HelpProps {
  onBack: () => void;
}

const faqItems = [
  {
    question: '¿Cómo busco un profesional?',
    answer: 'Desde el panel principal, selecciona la categoría de trabajo que necesitas (Limpieza, Construcción, Pintura, etc.). Luego puedes filtrar los resultados por departamento para encontrar profesionales cerca de ti. Haz clic en "Ver más" para ver el perfil completo del profesional.'
  },
  {
    question: '¿Cómo sé si un profesional es confiable?',
    answer: 'Cada profesional tiene una calificación de estrellas basada en las reseñas de otros clientes. En su perfil puedes ver: su calificación, número de reseñas, años de experiencia, tipo de educación (empírico o con título), galería de trabajos anteriores y las categorías en las que se especializa.'
  },
  {
    question: '¿Cómo envío una solicitud de trabajo?',
    answer: 'Selecciona el profesional que te interese y haz clic en "Ver más" para ver su perfil completo. En su perfil encontrarás el botón "Enviar Solicitud". Completa el formulario con la descripción del trabajo, presupuesto estimado (opcional) y fecha preferida (opcional). El profesional recibirá tu solicitud y podrá aceptarla o rechazarla.'
  },
  {
    question: '¿Qué pasa después de que un profesional acepta mi solicitud?',
    answer: 'Cuando un profesional acepta tu solicitud, recibirás una notificación. Desde ese momento podrás chatear directamente con el profesional para coordinar los detalles del trabajo. Puedes acceder al chat desde la sección de Notificaciones o haciendo clic en el ícono de mensajes en la esquina inferior derecha.'
  },
  {
    question: '¿Cómo uso el sistema de chat?',
    answer: 'El chat se activa automáticamente cuando un profesional acepta tu solicitud. Haz clic en el ícono de mensajes (esquina inferior derecha) para ver todas tus conversaciones. Las conversaciones activas aparecen primero, seguidas de las finalizadas. Puedes enviar mensajes en tiempo real para coordinar fechas, horarios y detalles del trabajo.'
  },
  {
    question: '¿Cómo veo los detalles de mis solicitudes?',
    answer: 'En el panel principal verás tu "Última Actividad" con un botón "Ver Detalles". También puedes ver detalles de todas las solicitudes desde la sección de Notificaciones haciendo clic en "Ver Detalles" en cualquier notificación. Allí verás el perfil del profesional, la descripción completa del trabajo, el presupuesto y el estado.'
  },
  {
    question: '¿Puedo solicitar el mismo servicio de nuevo?',
    answer: 'Sí, si quedaste satisfecho con el trabajo de un profesional, puedes solicitar el servicio de nuevo. En los detalles de trabajos completados encontrarás el botón "Solicitar de Nuevo" que te permitirá enviar una nueva solicitud al mismo profesional con facilidad.'
  },
  {
    question: '¿Cómo funcionan las notificaciones?',
    answer: 'Recibirás notificaciones cuando: un profesional acepta tu solicitud (con ícono verde), cuando una solicitud aún está pendiente de respuesta (ícono amarillo), o cuando un profesional rechaza tu solicitud (ícono rojo). Accede a Notificaciones desde el menú superior derecho para ver todas tus solicitudes y su estado.'
  },
  {
    question: '¿Qué categorías de servicios están disponibles?',
    answer: 'Chambly ofrece 8 categorías de servicios: Limpieza, Construcción, Pintura, Plomería, Electricidad, Jardinería, Mudanza y Ensamblaje de Muebles. Cada categoría tiene un código de color distintivo para facilitar su identificación en toda la aplicación.'
  },
  {
    question: '¿Cómo actualizo mi perfil?',
    answer: 'Ve al menú (tres líneas en la esquina superior derecha) y selecciona "Mi Perfil". Desde ahí puedes actualizar tu información personal, foto de perfil y, si eres profesional, también puedes agregar fotos a tu galería de trabajos, actualizar tus años de experiencia y las categorías en las que trabajas.'
  },
  {
    question: '¿Cómo marco un trabajo como finalizado? (Para profesionales)',
    answer: 'Como profesional, cuando estés en el chat con un cliente y hayas completado el trabajo, verás un botón con un ícono de check verde en la parte superior del chat. Haz clic ahí para marcar el trabajo como finalizado. Esto moverá la conversación a "Conversaciones Finalizadas".'
  },
  {
    question: '¿Puedo filtrar profesionales por ubicación?',
    answer: 'Sí, cuando buscas profesionales por categoría, encontrarás un filtro de departamento que te permite ver solo los profesionales que trabajan en tu zona. El Salvador está dividido en 14 departamentos y puedes filtrar por cualquiera de ellos.'
  },
  {
    question: '¿Cómo funciona el sistema de calificaciones?',
    answer: 'Chambly usa un sistema de calificación de 5 estrellas bidireccional. Cuando un profesional marca un trabajo como finalizado, debe calificar al cliente antes de cerrar el chat. Cuando el cliente entra al chat después de que el trabajo fue finalizado, se le pedirá que califique el servicio recibido. Estas calificaciones se promedian y aparecen en los perfiles, ayudando a construir confianza en la comunidad.'
  },
  {
    question: '¿Cuándo debo calificar a un profesional?',
    answer: 'Como cliente, se te pedirá que califiques el servicio cuando entres a un chat después de que el profesional haya marcado el trabajo como finalizado. Aparecerá un modal con 5 estrellas donde puedes indicar tu nivel de satisfacción. Tu calificación es importante y ayuda a otros usuarios a tomar mejores decisiones.'
  },
  {
    question: '¿Los profesionales también califican a los clientes?',
    answer: 'Sí, cuando un profesional marca un trabajo como finalizado, debe calificar al cliente usando el mismo sistema de 5 estrellas. Esto ayuda a otros profesionales a conocer la experiencia de trabajar con ese cliente. La calificación es obligatoria antes de poder finalizar el chat.'
  }
];

export function Help({ onBack }: HelpProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredFAQ = faqItems.filter(
    item =>
      item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
        <h1 className="text-3xl mb-6 text-[#1D1D1B]">Centro de Ayuda</h1>

        {/* Search Bar */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Busca tu pregunta..."
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#685AA1]"
            />
          </div>
        </div>

        {/* Chatbot Coming Soon */}
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl shadow-sm p-8 mb-8 text-white text-center">
          <MessageCircle size={48} className="mx-auto mb-4" />
          <h2 className="text-2xl mb-2">Chat de Ayuda en Vivo</h2>
          <p className="text-indigo-100 mb-4">
            Próximamente podrás chatear con nuestro asistente virtual para resolver tus dudas al instante
          </p>
          <div className="inline-block px-4 py-2 bg-white bg-opacity-20 rounded-lg">
            Próximamente
          </div>
        </div>

        {/* FAQ Section */}
        <div className="bg-white rounded-xl shadow-sm p-8">
          <h2 className="text-2xl mb-6 text-[#1D1D1B]">Preguntas Frecuentes</h2>

          {filteredFAQ.length === 0 ? (
            <p className="text-center text-gray-500 py-8">
              No se encontraron resultados para "{searchTerm}"
            </p>
          ) : (
            <div className="space-y-6">
              {filteredFAQ.map((item, index) => (
                <div key={index} className="border-b pb-6 last:border-b-0">
                  <h3 className="text-lg font-medium mb-3 text-[#1D1D1B]">
                    {item.question}
                  </h3>
                  <p className="text-gray-700 leading-relaxed">{item.answer}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Contact Section */}
        <div className="bg-white rounded-xl shadow-sm p-8 mt-6">
          <h2 className="text-xl mb-4 text-[#1D1D1B]">¿Aún necesitas ayuda?</h2>
          <p className="text-gray-600 mb-4">
            Si no encontraste la respuesta que buscabas, contáctanos:
          </p>
          <div className="space-y-2 text-[#1D1D1B]">
            <p>📧 Email: soporte@chambly.com</p>
            <p>📱 WhatsApp: +503 7000-0000</p>
            <p>⏰ Horario: Lunes a Viernes, 8:00 AM - 6:00 PM</p>
          </div>
        </div>
      </div>
    </div>
  );
}
