import { Star, X } from 'lucide-react';
import { useState } from 'react';

interface RatingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (rating: number) => void;
  targetName: string;
  userType: 'client' | 'professional';
}

export function RatingModal({ isOpen, onClose, onSubmit, targetName, userType }: RatingModalProps) {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState('');

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (rating > 0) {
      onSubmit(rating);
      onClose();
      // Reset for next use
      setRating(0);
      setComment('');
    }
  };

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-50"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white rounded-2xl shadow-2xl z-50 p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl text-[#1D1D1B]">
            {userType === 'professional' ? 'Calificar Cliente' : 'Calificar Servicio'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="text-center mb-8">
          <p className="text-lg mb-2 text-[#1D1D1B]">
            {userType === 'professional'
              ? `¿Cómo fue tu experiencia trabajando con ${targetName}?`
              : `¿Cómo calificarías el servicio de ${targetName}?`
            }
          </p>
          <p className="text-sm text-gray-600">
            Tu calificación ayuda a otros usuarios a tomar mejores decisiones
          </p>
        </div>

        {/* Star Rating */}
        <div className="flex justify-center gap-2 mb-8">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoveredRating(star)}
              onMouseLeave={() => setHoveredRating(0)}
              className="transition-transform hover:scale-110"
            >
              <Star
                size={48}
                className={
                  star <= (hoveredRating || rating)
                    ? 'fill-[#FFC900] text-[#FFC900]'
                    : 'text-gray-300'
                }
              />
            </button>
          ))}
        </div>

        {/* Rating Text */}
        {rating > 0 && (
          <p className="text-center text-lg font-medium mb-6 text-[#1D1D1B]">
            {rating === 1 && 'Muy malo'}
            {rating === 2 && 'Malo'}
            {rating === 3 && 'Regular'}
            {rating === 4 && 'Bueno'}
            {rating === 5 && 'Excelente'}
          </p>
        )}

        {/* Comment Section */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-[#1D1D1B] mb-2">
            Comentario (Opcional)
          </label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Comparte tu experiencia para ayudar a otros usuarios..."
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#685AA1] min-h-[100px] resize-none"
            maxLength={300}
          />
          <p className="text-sm text-gray-500 mt-1">
            {comment.length}/300 caracteres
          </p>
        </div>

        {/* Actions */}
        <div className="flex gap-4">
          <button
            onClick={onClose}
            className="flex-1 px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            disabled={rating === 0}
            className="flex-1 px-6 py-3 bg-[#FFC900] text-[#1D1D1B] font-medium rounded-lg hover:bg-[#e6b500] transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            Enviar Calificación
          </button>
        </div>
      </div>
    </>
  );
}
