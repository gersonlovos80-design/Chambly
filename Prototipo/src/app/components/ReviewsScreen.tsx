import { ArrowLeft, Star } from 'lucide-react';

interface Review {
  id: number;
  userName: string;
  rating: number;
  comment: string;
  date: string;
}

interface ReviewsScreenProps {
  onBack: () => void;
  professionalName: string;
  overallRating: number;
  totalReviews: number;
  ratingDistribution: {
    5: number;
    4: number;
    3: number;
    2: number;
    1: number;
  };
  reviews: Review[];
}

export function ReviewsScreen({
  onBack,
  professionalName,
  overallRating,
  totalReviews,
  ratingDistribution,
  reviews
}: ReviewsScreenProps) {
  const getPercentage = (count: number) => {
    return totalReviews > 0 ? (count / totalReviews) * 100 : 0;
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5]">
      {/* Header */}
      <header className="bg-[#685AA1] shadow-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
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
        {/* Title */}
        <div className="mb-6">
          <h1 className="text-3xl mb-2 text-[#1D1D1B]">Reseñas de {professionalName}</h1>
          <p className="text-gray-600">{totalReviews} reseñas totales</p>
        </div>

        {/* Overall Rating Summary */}
        <div className="bg-white rounded-xl shadow-sm p-8 mb-6">
          <div className="flex flex-col md:flex-row items-center gap-8">
            {/* Overall Score */}
            <div className="text-center">
              <div className="text-6xl font-medium text-[#1D1D1B] mb-2">
                {overallRating.toFixed(1)}
              </div>
              <div className="flex justify-center mb-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    size={24}
                    className={
                      star <= Math.floor(overallRating)
                        ? 'fill-[#FFC900] text-[#FFC900]'
                        : 'text-gray-300'
                    }
                  />
                ))}
              </div>
              <p className="text-gray-600">De {totalReviews} reseñas</p>
            </div>

            {/* Rating Distribution */}
            <div className="flex-1 w-full">
              {[5, 4, 3, 2, 1].map((rating) => (
                <div key={rating} className="flex items-center gap-3 mb-2">
                  <div className="flex items-center gap-1 w-16">
                    <span className="text-sm font-medium text-[#1D1D1B]">{rating}</span>
                    <Star size={14} className="fill-[#FFC900] text-[#FFC900]" />
                  </div>
                  <div className="flex-1 bg-gray-200 rounded-full h-3 overflow-hidden">
                    <div
                      className="bg-[#FFC900] h-full rounded-full transition-all"
                      style={{ width: `${getPercentage(ratingDistribution[rating as keyof typeof ratingDistribution])}%` }}
                    />
                  </div>
                  <span className="text-sm text-gray-600 w-12 text-right">
                    {ratingDistribution[rating as keyof typeof ratingDistribution]}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Reviews List */}
        <div className="bg-white rounded-xl shadow-sm p-8">
          <h2 className="text-2xl mb-6 text-[#1D1D1B]">Comentarios de Clientes</h2>

          {reviews.length === 0 ? (
            <p className="text-center text-gray-500 py-8">
              Aún no hay comentarios disponibles
            </p>
          ) : (
            <div className="space-y-6">
              {reviews.map((review) => (
                <div key={review.id} className="border-b last:border-b-0 pb-6 last:pb-0">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-medium text-[#1D1D1B]">{review.userName}</h3>
                      <p className="text-sm text-gray-500">{review.date}</p>
                    </div>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          size={16}
                          className={
                            star <= review.rating
                              ? 'fill-[#FFC900] text-[#FFC900]'
                              : 'text-gray-300'
                          }
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-gray-700 leading-relaxed">{review.comment}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
