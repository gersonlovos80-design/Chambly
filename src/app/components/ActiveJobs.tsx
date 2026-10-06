import { ArrowLeft, MessageCircle, CheckCircle, Calendar } from 'lucide-react';
import { useState } from 'react';
import { RatingModal } from './RatingModal';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface ActiveJob {
  id: string;
  chatId: string;
  clientName: string;
  clientPhoto: string;
  jobType: string;
  scheduledDate: string;
  description: string;
  isCompleted: boolean;
}

interface ActiveJobsProps {
  onBack: () => void;
  activeJobs: ActiveJob[];
  onMarkCompleted: (jobId: string, rating: number) => void;
  onOpenChat: (chatId: string) => void;
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
  return colors[category] || 'bg-[#D3CFED] text-[#685AA1]';
};

export function ActiveJobs({ onBack, activeJobs, onMarkCompleted, onOpenChat }: ActiveJobsProps) {
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [selectedJob, setSelectedJob] = useState<ActiveJob | null>(null);

  const handleCompleteClick = (job: ActiveJob) => {
    setSelectedJob(job);
    setShowRatingModal(true);
  };

  const handleRatingSubmit = (rating: number) => {
    if (selectedJob) {
      onMarkCompleted(selectedJob.id, rating);
    }
    setShowRatingModal(false);
    setSelectedJob(null);
  };

  const activeJobsList = activeJobs.filter(job => !job.isCompleted);
  const completedJobsList = activeJobs.filter(job => job.isCompleted);

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
        <h1 className="text-3xl mb-2 text-[#1D1D1B]">Trabajos Activos</h1>
        <p className="text-gray-600 mb-6">
          Gestiona tus trabajos aceptados y en progreso
        </p>

        {/* Active Jobs */}
        {activeJobsList.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl mb-4 text-[#1D1D1B]">En Progreso</h2>
            <div className="space-y-4">
              {activeJobsList.map((job) => (
                <div
                  key={job.id}
                  className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-4">
                      <ImageWithFallback
                        src={job.clientPhoto}
                        alt={job.clientName}
                        className="w-16 h-16 rounded-full object-cover flex-shrink-0"
                      />
                      <div>
                        <h3 className="text-xl font-medium text-[#1D1D1B] mb-1">
                          {job.clientName}
                        </h3>
                        <span className={`inline-block px-3 py-1 ${getCategoryColor(job.jobType)} font-medium rounded-full text-sm`}>
                          {job.jobType}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mb-4">
                    <div className="flex items-center gap-2 text-gray-600 mb-2">
                      <Calendar size={18} />
                      <span className="font-medium">Fecha Programada:</span>
                      <span>{job.scheduledDate}</span>
                    </div>
                    <div className="mt-3">
                      <p className="text-sm font-medium text-[#1D1D1B] mb-1">Descripción del Trabajo:</p>
                      <p className="text-gray-700">{job.description}</p>
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4 border-t">
                    <button
                      onClick={() => onOpenChat(job.chatId)}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 border border-[#685AA1] text-[#685AA1] font-medium rounded-lg hover:bg-[#685AA1] hover:text-white transition-colors"
                    >
                      <MessageCircle size={18} />
                      Chatear
                    </button>
                    <button
                      onClick={() => handleCompleteClick(job)}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-[#FFC900] text-[#1D1D1B] font-medium rounded-lg hover:bg-[#e6b500] transition-colors"
                    >
                      <CheckCircle size={18} />
                      Marcar Completado
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Completed Jobs */}
        {completedJobsList.length > 0 && (
          <div>
            <h2 className="text-2xl mb-4 text-[#1D1D1B]">Completados</h2>
            <div className="space-y-4">
              {completedJobsList.map((job) => (
                <div
                  key={job.id}
                  className="bg-white rounded-xl shadow-sm p-6 opacity-75"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-4">
                      <ImageWithFallback
                        src={job.clientPhoto}
                        alt={job.clientName}
                        className="w-16 h-16 rounded-full object-cover flex-shrink-0"
                      />
                      <div>
                        <h3 className="text-xl font-medium text-[#1D1D1B] mb-1">
                          {job.clientName}
                        </h3>
                        <span className={`inline-block px-3 py-1 ${getCategoryColor(job.jobType)} font-medium rounded-full text-sm`}>
                          {job.jobType}
                        </span>
                      </div>
                    </div>
                    <span className="px-3 py-1 bg-green-100 text-green-700 font-medium rounded-full text-sm">
                      Completado
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-gray-600">
                    <Calendar size={18} />
                    <span>Realizado: {job.scheduledDate}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {activeJobsList.length === 0 && completedJobsList.length === 0 && (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <CheckCircle size={64} className="mx-auto mb-4 text-gray-300" />
            <h3 className="text-xl font-medium text-gray-600 mb-2">
              No hay trabajos activos
            </h3>
            <p className="text-gray-500">
              Los trabajos aceptados aparecerán aquí
            </p>
          </div>
        )}
      </div>

      {/* Rating Modal */}
      {showRatingModal && selectedJob && (
        <RatingModal
          isOpen={showRatingModal}
          onClose={() => {
            setShowRatingModal(false);
            setSelectedJob(null);
          }}
          onSubmit={handleRatingSubmit}
          targetName={selectedJob.clientName}
          userType="professional"
        />
      )}
    </div>
  );
}
